import React from 'react';
import asmLogo from "../../assets/asm-logo.png";

const Header: React.FC = () => (
  <header className="bg-white border-b border-slate-200 py-6 mb-8">
    <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={asmLogo}
          alt="ASM Logo"
          className="h-14 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            ASM Educational Center
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Cyber Interview Coach
          </p>
        </div>
      </div>
      <div className="hidden md:block text-right">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Tier 1 Specialist Training
        </span>
      </div>
    </div>
  </header>
);

export default Header;
