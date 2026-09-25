import React from 'react';
import {
  X,
  Printer,
  Calendar,
  Home,
  Gem,
  Sparkles,
  MapPin,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { ShoppingButtons } from './ShoppingButtons';
import { CalculationTable } from './CalculationTable';

interface RecommendationModalProps {
  item: HistoryItem | null;
  onClose: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const res = (item.full_result || {}) as any;
  const isHome = item.type === 'home';
  const isParty = item.type === 'party';
  const isJewelry = item.type === 'jewelry';

  const inputData = item.input_summary || item.input || {};
  const totalBudget =
    res?.total_budget ??
    item.result_summary?.total_budget ??
    item.summary?.total_budget ??
    0;
  const allocatedBudget =
    res?.allocated_budget ??
    (totalBudget - (res?.remaining_budget ?? item.result_summary?.remaining_budget ?? 0));
  const remainingBudget =
    res?.remaining_budget ??
    item.result_summary?.remaining_budget ??
    item.summary?.remaining_budget ??
    0;

  const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isHome ? 'bg-blue-600' : isParty ? 'bg-purple-600' : 'bg-rose-600'
              }`}
            >
              {isHome && <Home className="w-4 h-4 text-white" />}
              {isParty && <Calendar className="w-4 h-4 text-white" />}
              {isJewelry && <Gem className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {isHome && 'Home Interior Budget Plan'}
                {isParty && `${inputData.party_type || 'Party'} Budget Plan`}
                {isJewelry && `Jewelry Budget Plan - ${inputData.occasion || 'Special'}`}
              </h3>
              <p className="text-[11px] text-slate-400">Created on {dateStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-slate-800 text-xs">
          {/* Summary Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Total Budget
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                ₹{totalBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Allocated
              </span>
              <span className="text-base font-extrabold text-blue-600 font-mono">
                ₹{allocatedBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Remaining
              </span>
              <span className="text-base font-extrabold text-emerald-600 font-mono">
                ₹{remainingBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Outfit Analysis if Jewelry */}
          {res.outfit_analysis && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Multimodal Outfit Analysis</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block">Style</span>
                  <span className="font-semibold text-slate-900">{res.outfit_analysis.style}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Formality</span>
                  <span className="font-semibold text-slate-900">{res.outfit_analysis.formality}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 text-[10px] block">Color Swatches</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {res.outfit_analysis.colors?.map((c: string, idx: number) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {res.outfit_analysis.rationale && (
                <p className="text-[11px] text-slate-600 italic pt-1">
                  {res.outfit_analysis.rationale}
                </p>
              )}
            </div>
          )}

          {/* Home or Party Category Breakdown */}
          {res.budget_breakdown && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Category Recommendations</h4>
              {res.budget_breakdown.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 capitalize">{cat.category}</span>
                    <span className="font-mono font-bold text-blue-600">
                      ₹{cat.allocation?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cat.items?.map((it: any, iIdx: number) => (
                      <div key={iIdx} className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-bold text-slate-900">{it.name}</span>
                            <p className="text-slate-600 text-[11px] mt-0.5">{it.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-900 font-mono">
                              ₹{it.estimated_price?.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[10px] text-slate-500">Qty: {it.quantity || 1}</span>
                          </div>
                        </div>
                        <ShoppingButtons links={it.shopping_links} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Jewelry Recommendations */}
          {res.jewelry_recommendations && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Recommended Pieces</h4>
              <div className="space-y-3">
                {res.jewelry_recommendations.map((it: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{it.name || it.item_type}</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{it.description}</p>
                        {it.style && <span className="text-[10px] text-slate-500">Style: {it.style}</span>}
                      </div>
                      <span className="font-bold text-blue-600 text-sm font-mono shrink-0">
                        ₹{it.estimated_price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ShoppingButtons links={it.shopping_links} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Party Venue Suggestions */}
          {res.venue_suggestions && res.venue_suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Venue Suggestions
              </h4>
              {res.venue_suggestions.map((v: any, vIdx: number) => (
                <div key={vIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{v.name}</span>
                      <p className="text-[11px] text-slate-600">
                        Type: {v.type} • Capacity: {v.capacity} guests
                      </p>
                    </div>
                    <span className="font-bold text-blue-600 font-mono">
                      ₹{v.estimated_cost?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ShoppingButtons links={v.shopping_links} />
                </div>
              ))}
            </div>
          )}

          {/* Calculation Table */}
          {res.calculation_table && (
            <CalculationTable
              rows={res.calculation_table}
              totalBudget={res.total_budget}
              allocatedBudget={res.allocated_budget}
              remainingBudget={res.remaining_budget}
            />
          )}

          {/* Additional suggestions / Styling tips */}
          {(res.additional_suggestions || res.styling_tips) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Smart Tips & Recommendations</span>
              </div>
              <ul className="space-y-1 pl-1">
                {(res.additional_suggestions || res.styling_tips).map((tip: string, tIdx: number) => (
                  <li key={tIdx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
