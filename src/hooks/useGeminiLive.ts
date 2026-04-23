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
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(InterviewStatus.ACTIVE);
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple silence suppression: check if any sample exceeds a threshold
              let hasSound = false;
              for (let i = 0; i < inputData.length; i++) {
                if (Math.abs(inputData[i]) > 0.01) { // 1% threshold
                  hasSound = true;
                  break;
                }
              }

              if (!hasSound) return;

              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ audio: pcmBlob });
              });
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
              currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userInput = currentInputTranscriptionRef.current;
              const coachOutput = currentOutputTranscriptionRef.current;

              const newItems: TranscriptionItem[] = [];
              if (userInput) newItems.push({ role: 'user', text: userInput, timestamp: Date.now() });
              if (coachOutput) newItems.push({ role: 'model', text: coachOutput, timestamp: Date.now() });

              if (newItems.length > 0) {
                setTranscriptions(prev => [...prev, ...newItems]);
              }

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
