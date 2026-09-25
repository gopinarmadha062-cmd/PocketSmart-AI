import React from 'react';
import { Wallet, Heart, Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">PocketSmart AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Your GenAI-powered, cross-platform budget planning and recommendation assistant.
              Bridging smart life decisions with Amazon, Flipkart, IKEA, Swiggy, Zomato, OYO, and more.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:text-white hover:bg-blue-600 cursor-pointer transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </span>
              <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:text-white hover:bg-blue-600 cursor-pointer transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </span>
              <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center hover:text-white hover:bg-blue-600 cursor-pointer transition-colors">
                <Github className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Our Team</button></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home_planner')} className="hover:text-white transition-colors">Home Interior Planner</button></li>
              <li><button onClick={() => onNavigate('party_planner')} className="hover:text-white transition-colors">Party Budget Planner</button></li>
              <li><button onClick={() => onNavigate('jewelry_planner')} className="hover:text-white transition-colors">Jewelry Recommendations</button></li>
              <li><button onClick={() => onNavigate('history')} className="hover:text-white transition-colors">Saved Recommendations</button></li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Resources & Legal</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Help Center / FAQ</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2025 PocketSmart AI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Powered by Google Gemini 1.5/2.5/3.8 Flash & SmartBridge
          </p>
        </div>
      </div>
    </footer>
  );
};
