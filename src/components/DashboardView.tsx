import React from 'react';
import {
  Home,
  Calendar,
  Gem,
  ArrowRight,
  Clock,
  History,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';
import { User, HistoryItem } from '../types';

interface DashboardViewProps {
  user: User;
  onNavigate: (view: string) => void;
  recentHistory: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  recentHistory,
  onSelectHistoryItem,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Hero Banner matching PDF Screenshot page 31 */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] rounded-2xl p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user.username}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-normal">
            Choose a budget planner to get started with your personalized financial planning experience
          </p>
        </div>
      </div>

      {/* 3 Budget Planner Cards matching PDF Screenshot page 31 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Home Planner Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="h-40 bg-slate-100 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
              alt="Home Interior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600/90 backdrop-blur-xs flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Home Budget</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-blue-600" />
                Home Budget Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plan your interior design budget efficiently with AI-powered recommendations for furniture,
                lighting, and more.
              </p>
            </div>

            <button
              onClick={() => onNavigate('home_planner')}
              className="w-full py-2.5 bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Party Planner Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="h-40 bg-slate-100 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
              alt="Party Balloons"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/90 backdrop-blur-xs flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Party Budget</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Party Budget Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plan your perfect event with budget allocations for venue, catering, decorations, and
                entertainment.
              </p>
            </div>

            <button
              onClick={() => onNavigate('party_planner')}
              className="w-full py-2.5 bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Jewelry Planner Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="h-40 bg-slate-100 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
              alt="Jewelry pearls"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/90 backdrop-blur-xs flex items-center justify-center">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm">Jewelry Budget</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-cyan-600" />
                Jewelry Budget Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find the ideal jewelry pieces for any occasion that match your outfit and stay within your
                budget.
              </p>
            </div>

            <button
              onClick={() => onNavigate('jewelry_planner')}
              className="w-full py-2.5 bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* View All History Button Bar matching Screenshot page 31 */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('history')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <History className="w-4 h-4" />
          <span>View All Recommendation History</span>
        </button>
      </div>

      {/* Recent Activity Card matching Screenshot page 31 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            See all ({recentHistory.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentHistory.slice(0, 5).map((item) => {
            const isHome = item.type === 'home';
            const isParty = item.type === 'party';
            const isJewelry = item.type === 'jewelry';

            const totalBudget =
              item.result_summary?.total_budget ??
              item.summary?.total_budget ??
              (item.full_result as any)?.total_budget ??
              0;

            const remainingBudget =
              item.result_summary?.remaining_budget ??
              item.summary?.remaining_budget ??
              (item.full_result as any)?.remaining_budget ??
              0;

            const inputData = item.input_summary || item.input || {};

            return (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      isHome
                        ? 'bg-blue-100 text-blue-700'
                        : isParty
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {isHome && <Home className="w-4 h-4" />}
                    {isParty && <Calendar className="w-4 h-4" />}
                    {isJewelry && <Gem className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {isHome && 'Home Budget Plan'}
                      {isParty && `${inputData.party_type || 'Party'} Budget Plan`}
                      {isJewelry && `Jewelry Budget Plan - ${inputData.occasion || 'Special'}`}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Budget: ₹{totalBudget.toLocaleString('en-IN')} • Created on{' '}
                      {new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Rem: ₹{remainingBudget.toLocaleString('en-IN')}
                  </span>
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {recentHistory.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent activity found. Choose a planner above to get your first AI budget recommendation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
