import React from 'react';
import {
  Wallet,
  Home,
  LayoutDashboard,
  Sparkles,
  Calendar,
  Gem,
  History,
  LogOut,
  LogIn,
  UserPlus,
  Terminal,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenVsCodeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenVsCodeGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1e293b] text-white shadow-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  PocketSmart
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Smart Budget & Recommendations
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!currentUser && (
              <button
                onClick={() => onNavigate('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'landing'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>
            )}

            <button
              onClick={() => onNavigate('home_planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'home_planner'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Home Planner
            </button>

            <button
              onClick={() => onNavigate('party_planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'party_planner'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Party Planner
            </button>

            <button
              onClick={() => onNavigate('jewelry_planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'jewelry_planner'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              Jewelry Planner
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentView === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* VS Code Setup Guide Button */}
            <button
              onClick={onOpenVsCodeGuide}
              title="VS Code Setup, Running & Testing Instructions"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-600 transition-colors shadow-xs"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">VS Code Guide</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-700 text-xs">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400 text-blue-300 flex items-center justify-center font-bold">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-200 font-medium hidden sm:inline">
                    {currentUser.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-700/60 overflow-x-auto text-[11px]">
          <button
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
            className={`px-2 py-1 rounded ${
              currentView === 'landing' || currentView === 'dashboard'
                ? 'text-blue-400 font-bold'
                : 'text-slate-400'
            }`}
          >
            {currentUser ? 'Dashboard' : 'Home'}
          </button>
          <button
            onClick={() => onNavigate('home_planner')}
            className={`px-2 py-1 rounded ${
              currentView === 'home_planner' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('party_planner')}
            className={`px-2 py-1 rounded ${
              currentView === 'party_planner' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            Party
          </button>
          <button
            onClick={() => onNavigate('jewelry_planner')}
            className={`px-2 py-1 rounded ${
              currentView === 'jewelry_planner' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            Jewelry
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`px-2 py-1 rounded ${
              currentView === 'history' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
};
