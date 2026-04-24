import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { InterviewStatus, TranscriptionItem } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';
import { createBlob, decode, decodeAudioData } from '../utils/audio';

export function useGeminiLive() {
  const [status, setStatus] = useState(InterviewStatus.IDLE as InterviewStatus);
  const [transcriptions, setTranscriptions] = useState([] as TranscriptionItem[]);
  const [errorMsg, setErrorMsg] = useState(null as string | null);

  const sessionRef = useRef(null as any);
  const audioContextInRef = useRef(null as AudioContext | null);
  const audioContextOutRef = useRef(null as AudioContext | null);
  const streamRef = useRef(null as MediaStream | null);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTimeRef = useRef(0 as number);

  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextInRef.current) {
      audioContextInRef.current.close();
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      audioContextOutRef.current.close();
      audioContextOutRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setStatus(InterviewStatus.FINISHED);
  }, []);

  const startSession = useCallback(async () => {
    try {
      setStatus(InterviewStatus.CONNECTING);
      setErrorMsg(null);
      setTranscriptions([]);

      // Check for Vite-prefixed key first, then fallback to standard process.env
      const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please ensure VITE_GEMINI_API_KEY is set in your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextInRef.current = inCtx;
      audioContextOutRef.current = outCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          generationConfig: {
            candidateCount: 1,
            temperature: 0.1,
            maxOutputTokens: 1000,
          },
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: async () => {
            const session = await sessionPromise;
            setStatus(InterviewStatus.ACTIVE);
            
            // Proactively trigger the first greet from the coach
            session.sendRealtimeInput({ text: "The interview starts now. Please greet the student and ask for their name as per your instructions." });

            const source = inCtx.createMediaStreamSource(stream);
            // Reduced buffer size further for lower latency (512 samples @ 16kHz is ~32ms)
            const scriptProcessor = inCtx.createScriptProcessor(512, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simplified sound check for speed
              let maxVal = 0;
              for (let i = 0; i < inputData.length; i++) {
                const abs = Math.abs(inputData[i]);
                if (abs > maxVal) maxVal = abs;
              }

              // More sensitive threshold to catch soft starts
              if (maxVal > 0.003) {
                const pcmBlob = createBlob(inputData);
                session.sendRealtimeInput({ audio: pcmBlob });
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const outCtx = audioContextOutRef.current;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(outCtx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentInputTranscriptionRef.current += text;
              // Update transiently for UI? Or wait for turn. 
              // For now, let's keep it simple but ensure it's captured on interupt too.
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              currentOutputTranscriptionRef.current += text;
            }

            if (message.serverContent?.turnComplete) {
              const userInput = currentInputTranscriptionRef.current.trim();
              const coachOutput = currentOutputTranscriptionRef.current.trim();

              setTranscriptions(prev => {
                const updated = [...prev];
                if (userInput) updated.push({ role: 'user', text: userInput, timestamp: Date.now() });
                if (coachOutput) updated.push({ role: 'model', text: coachOutput, timestamp: Date.now() });
                return updated;
              });

              currentInputTranscriptionRef.current = '';
              currentOutputTranscriptionRef.current = '';
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            setErrorMsg("Connection lost. Please try again.");
            stopSession();
          },
          onclose: () => {
            if (status !== InterviewStatus.FINISHED) {
              setStatus(InterviewStatus.FINISHED);
            }
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to start interview. Check microphone permissions.");
      setStatus(InterviewStatus.ERROR);
    }
  }, [status, stopSession]);

  return {
    status,
    setStatus,
    transcriptions,
    errorMsg,
    setErrorMsg,
    startSession,
    stopSession
  };
}
