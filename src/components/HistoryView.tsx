import React, { useState } from 'react';
import {
  History,
  Home,
  Calendar,
  Gem,
  ArrowRight,
  Trash2,
  Search,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';
import { HistoryItem, RecommendationType } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectItem,
  onDeleteItem,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = history.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchType = item.type.toLowerCase().includes(q);
      const matchSummary = JSON.stringify(item.input_summary).toLowerCase().includes(q);
      return matchType || matchSummary;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Banner matching PDF Screenshot page 38 */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] rounded-2xl p-6 sm:p-8 text-white text-center shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Recommendation History
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">
          View and manage all your previous budget plans and recommendations
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'All Plans' },
            { key: 'home', label: 'Home Interior' },
            { key: 'party', label: 'Party Planning' },
            { key: 'jewelry', label: 'Jewelry Selection' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search saved plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-bold text-slate-900">
          Recent Recommendations ({filtered.length})
        </h2>
      </div>

      {/* History Grid matching PDF Screenshot page 38 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => {
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
            const categories =
              item.result_summary?.categories ||
              item.summary?.categories ||
              (item.full_result as any)?.budget_breakdown?.map((b: any) => b.category) ||
              [];

            const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 space-y-4">
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isHome
                            ? 'bg-blue-100 text-blue-700'
                            : isParty
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isHome && <Home className="w-4 h-4" />}
                        {isParty && <Calendar className="w-4 h-4" />}
                        {isJewelry && <Gem className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">
                          {isHome && 'Home Interior Budget'}
                          {isParty && 'Party Planning Budget'}
                          {isJewelry && 'Jewelry Budget'}
                        </h3>
                        <span className="text-[10px] text-slate-400 block">{formattedDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      title="Delete entry"
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Budget Figures */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Budget</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        ₹{totalBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Remaining</span>
                      <span className="font-extrabold text-blue-600 font-mono">
                        ₹{remainingBudget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Summary Details matching screenshot page 38 */}
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    {isHome && (
                      <>
                        <p>
                          <span className="font-semibold text-slate-700">Rooms: </span>
                          {(inputData.rooms || []).join(', ') || 'Living, Kitchen'}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">Fixtures: </span>
                          Lights: {inputData.lights || 5} • Fans:{' '}
                          {inputData.fans || 4} • Furniture:{' '}
                          {inputData.furniture || 2}
                        </p>
                      </>
                    )}

                    {isParty && (
                      <>
                        <p>
                          <span className="font-semibold text-slate-700">Party Type: </span>
                          {inputData.party_type || 'Wedding'}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">Guests: </span>
                          {inputData.guests || 3}
                        </p>
                        {inputData.needs && (
                          <p>
                            <span className="font-semibold text-slate-700">Needs: </span>
                            {inputData.needs}
                          </p>
                        )}
                      </>
                    )}

                    {isJewelry && (
                      <>
                        <p>
                          <span className="font-semibold text-slate-700">Occasion: </span>
                          {inputData.occasion || 'Birthday'}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">With outfit image: </span>
                          {inputData.with_outfit_image ? 'Yes' : 'No'}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {categories.map((c: string, cIdx: number) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Full Details Button matching screenshot page 38 */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="w-full py-2 bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">No recommendation plans found</h3>
            <p className="text-xs text-slate-500">
              Run one of the smart budget planners to see your recommendations saved here!
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => onNavigate('home_planner')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
            >
              Home Planner
            </button>
            <button
              onClick={() => onNavigate('party_planner')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
            >
              Party Planner
            </button>
            <button
              onClick={() => onNavigate('jewelry_planner')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
            >
              Jewelry Planner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
