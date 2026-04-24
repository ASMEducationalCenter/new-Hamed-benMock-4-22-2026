import React from 'react';
import Timer from '../common/Timer';
import TranscriptionDisplay from './TranscriptionDisplay';
import { TranscriptionItem } from '../../types';

interface ActiveViewProps {
  transcriptions: TranscriptionItem[];
  resetKey: number;
  onStop: () => void;
  onTimeUp: () => void;
}

const ActiveView: React.FC<ActiveViewProps> = ({ transcriptions, resetKey, onStop, onTimeUp }) => {
  return (
    <div className="space-y-6">
      <Timer
        minutes={30}
        running={true}
        resetKey={resetKey}
        onTimeUp={onTimeUp}
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            </div>
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Interview Session Live</span>
          </div>
          <button
            onClick={onStop}
            className="text-sm font-semibold text-slate-400 hover:text-red-600 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Session
          </button>
        </div>

        <div className="mb-10 text-center">
          <div className="inline-block p-4 rounded-full bg-blue-50 border-4 border-blue-100 mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">The Coach is listening...</h3>
          <p className="text-slate-500 text-lg mb-8">Speak naturally. Answer the questions as if you're in a real interview.</p>
          
          {/* Highlighted Current Question */}
          {transcriptions.length > 0 && transcriptions[transcriptions.length - 1].role === 'model' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">Current Question / Feedback</span>
              <p className="text-slate-800 text-xl font-medium leading-relaxed">
                {transcriptions[transcriptions.length - 1].text}
              </p>
            </div>
          )}

          {transcriptions.length > 0 && transcriptions[transcriptions.length - 1].role === 'user' && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 text-left opacity-75">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Your Last Answer</span>
              <p className="text-slate-700 text-lg">
                {transcriptions[transcriptions.length - 1].text}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-8 mt-8">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Interview Log
          </h4>
          <TranscriptionDisplay items={transcriptions} />
        </div>
      </div>

      <div className="bg-blue-600 rounded-xl p-4 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Use professional keywords like <b>SLA, First point of contact,</b> and <b>Document findings</b>.</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveView;
