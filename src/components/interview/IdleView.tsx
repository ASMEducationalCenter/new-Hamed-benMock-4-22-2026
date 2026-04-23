import React from 'react';
import { User } from 'firebase/auth';

interface IdleViewProps {
  user: User | null;
  onStart: () => void;
}

const IdleView: React.FC<IdleViewProps> = ({ user, onStart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready for your Interview?</h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-8 text-lg leading-relaxed">
          Experience a realistic, voice-based mock interview for an IT Help Desk role.
          We'll cover 30 essential questions with professional feedback for each one.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
          {[
            { icon: "✓", title: "30 Questions", desc: "Comprehensive Tier 1 coverage" },
            { icon: "✓", title: "Voice Feedback", desc: "Real-time coaching notes" },
            { icon: "✓", title: "Final Report", desc: "Score & 7-day practice plan" }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-blue-600 font-bold block mb-1">{feature.icon} {feature.title}</span>
              <span className="text-slate-500 text-sm">{feature.desc}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          disabled={!user}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center mx-auto text-lg ${
            user ? "" : "bg-slate-300 hover:bg-slate-300 text-slate-500 cursor-not-allowed transform-none"
          }`}
        >
          Start Mock Interview
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IdleView;
