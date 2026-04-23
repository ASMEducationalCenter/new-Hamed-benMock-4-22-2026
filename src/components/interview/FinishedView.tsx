import React from 'react';
import TranscriptionDisplay from './TranscriptionDisplay';
import { TranscriptionItem } from '../../types';
import { downloadTranscriptPdf } from '../../services/pdf';

interface FinishedViewProps {
  transcriptions: TranscriptionItem[];
  timeUp: boolean;
  onRestart: () => void;
}

const FinishedView: React.FC<FinishedViewProps> = ({ transcriptions, timeUp, onRestart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        {timeUp ? "Time’s up" : "Interview Session Completed"}
      </h2>

      <p className="text-slate-600 text-lg mb-8">
        {timeUp
          ? "Your 30-minute session has ended. You can restart the interview from the beginning."
          : "Great job finishing the mock interview. You can review the transcription below or start a new session."}
      </p>

      <div className="text-left mb-10">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Final Session Log</h4>
        <TranscriptionDisplay items={transcriptions} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => downloadTranscriptPdf(transcriptions)}
          disabled={transcriptions.length === 0}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all"
        >
          Download Chat Summary (PDF)
        </button>

        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all"
        >
          {timeUp ? "Restart Interview" : "Back to Start"}
        </button>
      </div>
    </div>
  );
};

export default FinishedView;
