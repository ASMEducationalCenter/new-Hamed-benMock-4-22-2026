import React, { useRef, useEffect } from 'react';
import { TranscriptionItem } from '../../types';

const TranscriptionDisplay: React.FC<{ items: TranscriptionItem[] }> = ({ items }) => {
  const scrollRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div
      ref={scrollRef}
      className="bg-white rounded-xl shadow-inner border border-slate-200 h-64 overflow-y-auto p-4 space-y-4"
    >
      {items.length === 0 && (
        <div className="flex items-center justify-center h-full text-slate-400 italic">
          Conversation transcription will appear here...
        </div>
      )}
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            {item.role === 'user' ? 'You' : 'Coach'}
          </span>
          <div
            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              item.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
            }`}
          >
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptionDisplay;
