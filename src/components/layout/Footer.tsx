import React from 'react';

const Footer: React.FC = () => (
  <footer className="mt-auto py-8 border-t border-slate-200">
    <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
      <p>© {new Date().getFullYear()} ASM Educational Center. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
      </div>
    </div>
  </footer>
);

export default Footer;
