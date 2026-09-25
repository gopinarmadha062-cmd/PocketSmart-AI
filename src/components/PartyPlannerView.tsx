import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Building,
  Cake,
  Music,
  UtensilsCrossed,
  Sparkles,
  FileText,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Camera,
} from 'lucide-react';
import { PartyBudgetInput, PartyBudgetResponse } from '../types';
import { CalculationTable } from './CalculationTable';
import { ShoppingButtons } from './ShoppingButtons';

interface PartyPlannerViewProps {
  onPlanCreated?: () => void;
}

export const PartyPlannerView: React.FC<PartyPlannerViewProps> = ({ onPlanCreated }) => {
  const [formData, setFormData] = useState<PartyBudgetInput>({
    total_budget: 5000,
    num_guests: 3,
    party_type: 'Wedding',
    venue_type: 'Home',
    needs_catering: true,
    needs_decoration: true,
    needs_entertainment: true,
    needs_photography: false,
    additional_requirements: 'Intimate, warm vibe with great music and tasty finger food',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PartyBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PartyBudgetInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoadPreset = (
    budget: number,
    guests: number,
    type: string,
    venue: string,
    cat: boolean,
    dec: boolean,
    ent: boolean
  ) => {
    setFormData({
      total_budget: budget,
      num_guests: guests,
      party_type: type,
      venue_type: venue,
      needs_catering: cat,
      needs_decoration: dec,
      needs_entertainment: ent,
      needs_photography: false,
      additional_requirements: 'Memorable celebration with cost-effective planning',
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
      const response = await fetch('/api/generate-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to generate party budget recommendations');
      }

      const data = await response.json();
      setResult(data);
      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while contacting the AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Banner matching PDF Screenshot page 34 */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-6 sm:p-8 text-white text-center shadow-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs mb-3">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Party Budget Planner
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">
          Plan your perfect event with AI-powered budget recommendations
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form matching PDF Screenshot page 34 */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Quick Test Presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadPreset(5000, 3, 'Wedding', 'Home', true, true, true)}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                ₹5,000 Wedding (Doc Example)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(15000, 15, 'Birthday', 'Home', true, true, true)}
                className="text-xs px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md font-medium transition-colors"
              >
                ₹15,000 Birthday (15 Guests)
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(50000, 35, 'Corporate / Get-together', 'Banquet Hall', true, true, true)}
                className="text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-medium transition-colors"
              >
                ₹50,000 Corporate (35 Guests)
              </button>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Basic Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Total Budget (₹ INR)
                </label>
                <div className="relative">
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
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.num_guests}
                  onChange={(e) => handleInputChange('num_guests', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Event Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Party Type
                </label>
                <select
                  value={formData.party_type}
                  onChange={(e) => handleInputChange('party_type', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                >
                  <option value="Wedding">Wedding / Anniversary</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Corporate">Corporate / Networking</option>
                  <option value="Dinner Party">Casual Dinner Party</option>
                  <option value="Housewarming">Housewarming Ceremony</option>
                  <option value="Cocktail">Cocktail & Game Night</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Venue Type
                </label>
                <select
                  value={formData.venue_type}
                  onChange={(e) => handleInputChange('venue_type', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                >
                  <option value="Home">Home / Residence</option>
                  <option value="Banquet Hall">Banquet Hall</option>
                  <option value="Resort">Resort / Farmhouse</option>
                  <option value="Restaurant">Restaurant Private Dining</option>
                  <option value="Outdoor Park">Outdoor Terrace / Lawn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Party Needs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Cake className="w-4 h-4 text-blue-600" />
              <span>Party Needs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  field: 'needs_catering',
                  label: 'Catering',
                  icon: UtensilsCrossed,
                  color: 'text-orange-500',
                },
                {
                  field: 'needs_decoration',
                  label: 'Decoration',
                  icon: Sparkles,
                  color: 'text-purple-500',
                },
                {
                  field: 'needs_entertainment',
                  label: 'Entertainment',
                  icon: Music,
                  color: 'text-blue-500',
                },
                {
                  field: 'needs_photography',
                  label: 'Photography',
                  icon: Camera,
                  color: 'text-emerald-500',
                },
              ].map(({ field, label, icon: Icon, color }) => {
                const isChecked = Boolean(formData[field as keyof PartyBudgetInput]);
                return (
                  <label
                    key={field}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleInputChange(field as keyof PartyBudgetInput, !isChecked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Additional Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Additional Requirements</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Special requests, themes, dietary restrictions, etc.
              </label>
              <textarea
                rows={3}
                value={formData.additional_requirements || ''}
                onChange={(e) => handleInputChange('additional_requirements', e.target.value)}
                placeholder="Vegetarian preference, music genre, specific theme colors..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit Button matching PDF Screenshot page 34 */}
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
                  <span>Generate Budget Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Results View matching PDF Screenshot page 35 */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Actions & Heading matching PDF Screenshot page 35 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Party Budget Plan
              </h2>
              <div className="text-xl font-bold text-blue-700 mt-1">
                Budget: ₹{result.total_budget.toLocaleString('en-IN')}.00
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                Print / Save
              </button>
              <button
                onClick={() => setResult(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Plan Another
              </button>
            </div>
          </div>

          {/* Breakdown Items matching PDF Screenshot page 35 layout */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {result.budget_breakdown.map((cat, idx) => (
              <div key={idx} className="p-5 sm:p-6 space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 capitalize">
                      {cat.category}
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                    ₹{cat.allocation.toLocaleString('en-IN')}.00
                  </span>
                </div>

                {/* Items in Category */}
                <div className="space-y-3.5 pl-2 sm:pl-4">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-1.5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-900 shrink-0 font-mono">
                          ₹{item.estimated_price.toLocaleString('en-IN')}.00
                        </span>
                      </div>
                      <ShoppingButtons links={item.shopping_links} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Budget Summary Table matching PDF Screenshot page 35 */}
            <div className="p-5 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Total Budget</span>
                <span className="font-mono">₹{result.total_budget.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-600">
                <span>Allocated</span>
                <span className="font-mono text-blue-600">₹{result.allocated_budget.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-200">
                <span>Remaining</span>
                <span className="font-mono">₹{result.remaining_budget.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* Venue Suggestions matching PDF Screenshot page 35 */}
          {result.venue_suggestions && result.venue_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Venue Suggestions</h3>
              </div>
              <div className="p-5 space-y-4">
                {result.venue_suggestions.map((venue, vIdx) => (
                  <div key={vIdx} className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {venue.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
                          <p>Type: <span className="font-medium text-slate-700">{venue.type}</span></p>
                          <p>Capacity: <span className="font-medium text-slate-700">{venue.capacity} guests</span></p>
                          {venue.location && <p>Location: <span className="font-medium text-slate-700">{venue.location}</span></p>}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 font-mono">
                        ₹{venue.estimated_cost.toLocaleString('en-IN')}.00
                      </span>
                    </div>
                    <ShoppingButtons links={venue.shopping_links} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculation Table */}
          <CalculationTable
            rows={result.calculation_table}
            totalBudget={result.total_budget}
            allocatedBudget={result.allocated_budget}
            remainingBudget={result.remaining_budget}
          />

          {/* Additional Suggestions matching PDF Screenshot page 35 */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <h4 className="text-xs sm:text-sm font-bold">Additional Suggestions</h4>
              </div>
              <div className="p-5 space-y-2">
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
