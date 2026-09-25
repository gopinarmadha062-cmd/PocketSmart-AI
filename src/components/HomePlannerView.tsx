import React, { useState } from 'react';
import {
  Home,
  IndianRupee,
  Lightbulb,
  Fan,
  Armchair,
  Utensils,
  Sparkles,
  Layers,
  FileText,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { HomeBudgetInput, HomeBudgetResponse } from '../types';
import { CalculationTable } from './CalculationTable';
import { ShoppingButtons } from './ShoppingButtons';

interface HomePlannerViewProps {
  onPlanCreated?: () => void;
}

export const HomePlannerView: React.FC<HomePlannerViewProps> = ({ onPlanCreated }) => {
  const [formData, setFormData] = useState<HomeBudgetInput>({
    total_budget: 5000,
    num_lights: 5,
    num_fans: 4,
    num_furniture: 2,
    num_dining_tables: 1,
    rooms: {
      living_room: true,
      kitchen: true,
      bedroom: true,
      balcony: false,
    },
    additional_requirements: 'Cost-effective, durable, and warm minimalist decor',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HomeBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof HomeBudgetInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoomToggle = (room: keyof HomeBudgetInput['rooms']) => {
    setFormData((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [room]: !prev.rooms[room],
      },
    }));
  };

  const handleLoadPreset = (budget: number, lights: number, fans: number, furn: number, tables: number) => {
    setFormData({
      total_budget: budget,
      num_lights: lights,
      num_fans: fans,
      num_furniture: furn,
      num_dining_tables: tables,
      rooms: {
        living_room: true,
        kitchen: true,
        bedroom: true,
        balcony: true,
      },
      additional_requirements: 'Energy-saving appliances, modern aesthetic',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.total_budget <= 0) {
      setError('Please specify a budget greater than ₹0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to generate recommendations');
      }

      const data = await response.json();
      setResult(data);
      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Banner matching PDF Screenshot page 32 */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] rounded-2xl p-6 sm:p-8 text-white text-center shadow-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs mb-3">
          <Home className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Home Interior Budget Planner
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">
          Create a customized budget plan for your dream home interior
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form matching PDF Screenshot page 32 */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Quick Test Presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset(5000, 5, 4, 2, 1)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                ₹5,000 Starter Plan (Doc Example)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(25000, 10, 5, 4, 1)}
                className="text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-medium transition-colors"
              >
                ₹25,000 2-BHK Setup
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(75000, 16, 6, 8, 2)}
                className="text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-medium transition-colors"
              >
                ₹75,000 Premium Makeover
              </button>
            </div>
          </div>

          {/* Section 1: Budget Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              <span>Budget Details</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Budget (₹ INR)
              </label>
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  value={formData.total_budget}
                  onChange={(e) => handleInputChange('total_budget', Number(e.target.value))}
                  placeholder="5000"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fixtures & Furniture */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Armchair className="w-4 h-4 text-blue-600" />
              <span>Fixtures & Furniture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Number of Lights/Fixtures
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.num_lights}
                  onChange={(e) => handleInputChange('num_lights', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Fan className="w-3.5 h-3.5 text-sky-500" />
                  Number of Ceiling Fans
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.num_fans}
                  onChange={(e) => handleInputChange('num_fans', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Armchair className="w-3.5 h-3.5 text-indigo-500" />
                  Number of Furniture Pieces
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.num_furniture}
                  onChange={(e) => handleInputChange('num_furniture', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                  Number of Dining Tables
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.num_dining_tables}
                  onChange={(e) => handleInputChange('num_dining_tables', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rooms to Include */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Rooms to Include</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'living_room', label: 'Living Room' },
                { key: 'kitchen', label: 'Kitchen' },
                { key: 'bedroom', label: 'Bedroom' },
                { key: 'balcony', label: 'Balcony / Study' },
              ].map(({ key, label }) => {
                const isChecked = Boolean(formData.rooms[key as keyof HomeBudgetInput['rooms']]);
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleRoomToggle(key as keyof HomeBudgetInput['rooms'])}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Additional Information</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special Requirements or Preferences
              </label>
              <textarea
                rows={3}
                value={formData.additional_requirements || ''}
                onChange={(e) => handleInputChange('additional_requirements', e.target.value)}
                placeholder="Any specific aesthetic preference, color scheme, brand requirement, or room dimensions..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button matching PDF Screenshot page 32 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1e40af] hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing with Gemini 1.5/2.5/3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-300" />
                  <span>Generate Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Results View matching PDF Screenshot page 33 */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Actions & Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Personalized Budget Plan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generated {new Date(result.timestamp).toLocaleDateString()} • Powered by Gemini AI
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print / Save
              </button>
              <button
                onClick={() => setResult(null)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Plan Another Budget
              </button>
            </div>
          </div>

          {/* Budget Summary Card matching PDF Screenshot page 33 */}
          <div className="bg-[#1e293b] rounded-xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Budget Summary
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                Total Budget: ₹{result.total_budget.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center sm:text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Allocated</span>
                <span className="text-base font-bold text-blue-300">
                  ₹{result.allocated_budget.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-center sm:text-right bg-emerald-500/20 px-3.5 py-1.5 rounded-lg border border-emerald-400/30">
                <span className="text-[11px] text-emerald-300 block font-medium">Remaining Budget</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{result.remaining_budget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Category Recommendation Cards matching PDF Screenshot page 33 */}
          <div className="space-y-6">
            {result.budget_breakdown.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Category Header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 capitalize">
                      {cat.category}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                    Allocation: ₹{cat.allocation.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-4">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs sm:text-sm font-extrabold text-blue-600">
                            ₹{item.estimated_price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Branded Shopping Buttons matching PDF Screenshot */}
                      <ShoppingButtons links={item.shopping_links} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* INR Calculation Table */}
          <CalculationTable
            rows={result.calculation_table}
            totalBudget={result.total_budget}
            allocatedBudget={result.allocated_budget}
            remainingBudget={result.remaining_budget}
          />

          {/* Additional Suggestions matching PDF Screenshot page 33 */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-blue-900 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <h4 className="text-xs sm:text-sm font-bold">Additional Suggestions</h4>
              </div>
              <div className="p-5 space-y-2.5">
                {result.additional_suggestions.map((sug, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
