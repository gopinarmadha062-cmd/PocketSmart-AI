import React, { useState, useRef } from 'react';
import {
  Gem,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  FileText,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Palette,
  Eye,
  Camera,
} from 'lucide-react';
import { JewelryBudgetInput, JewelryBudgetResponse } from '../types';
import { ShoppingButtons } from './ShoppingButtons';
import { CalculationTable } from './CalculationTable';

interface JewelryPlannerViewProps {
  onPlanCreated?: () => void;
}

// Preset sample outfit images for instant 1-click test
const SAMPLE_OUTFITS = [
  {
    name: 'Blue Smart Shirt (Doc Example)',
    dataUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
    occasion: 'Birthday',
    preferences: 'Minimalist, silver and leather accents',
  },
  {
    name: 'Navy Silk Saree / Kurta',
    dataUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    occasion: 'Wedding / Reception',
    preferences: 'Traditional Indian, Kundan or Pearl elegance',
  },
  {
    name: 'Emerald Evening Dress',
    dataUrl:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80',
    occasion: 'Cocktail Gala',
    preferences: 'Contemporary rose gold and diamond accents',
  },
];

export const JewelryPlannerView: React.FC<JewelryPlannerViewProps> = ({ onPlanCreated }) => {
  const [formData, setFormData] = useState<JewelryBudgetInput>({
    total_budget: 5000,
    occasion: 'Birthday',
    preferences: 'Minimalist, sleek, modern finishes',
    image: SAMPLE_OUTFITS[0].dataUrl,
    image_name: SAMPLE_OUTFITS[0].name,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JewelryBudgetResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof JewelryBudgetInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be under 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
          image_name: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined, image_name: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectSampleOutfit = (sample: typeof SAMPLE_OUTFITS[0]) => {
    setFormData((prev) => ({
      ...prev,
      image: sample.dataUrl,
      image_name: sample.name,
      occasion: sample.occasion,
      preferences: sample.preferences,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.total_budget <= 0) {
      setError('Please enter a valid budget greater than ₹0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to generate jewelry recommendations');
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
      {/* Page Title Banner matching PDF Screenshot page 36 */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] rounded-2xl p-6 sm:p-8 text-white text-center shadow-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs mb-3">
          <Gem className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Jewelry Budget Planner
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1">
          Get AI-powered jewelry recommendations within your budget for any occasion
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form matching PDF Screenshot page 36 */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Section 1: Budget Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <Gem className="w-4 h-4 text-blue-600" />
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

          {/* Section 2: Occasion & Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Occasion & Preferences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Occasion
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => handleInputChange('occasion', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Wedding">Wedding / Reception</option>
                  <option value="Festive / Diwali">Festive / Diwali / Pooja</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Cocktail Party">Cocktail / Evening Party</option>
                  <option value="Formal Gala">Formal Work Gala</option>
                  <option value="Everyday Casual">Everyday / College / Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Style Preferences
                </label>
                <input
                  type="text"
                  value={formData.preferences}
                  onChange={(e) => handleInputChange('preferences', e.target.value)}
                  placeholder="Describe your style preferences, materials, colors, etc."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Upload Outfit Image matching PDF Screenshot page 36 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>Upload Outfit Image</span>
              </div>
              <span className="text-xs text-slate-500">Optional multimodal visual analysis</span>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Choose a Sample Outfit or Upload:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_OUTFITS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSampleOutfit(sample)}
                    className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                      formData.image === sample.dataUrl
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <img src={sample.dataUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview & Upload Controls */}
            {formData.image ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-36 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs relative">
                  <img
                    src={formData.image}
                    alt="Outfit Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    {formData.image_name || 'Selected Outfit Image'}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Gemini 1.5/2.5/3.8 Flash will examine this outfit's color palette, neckline, texture,
                    and formality level to suggest matching jewelry from Indian brands.
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/20"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Click to upload or drag & drop outfit photo
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  JPG, PNG or WEBP (Max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Submit Button matching PDF Screenshot page 36 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Outfit & Matching with Gemini Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Get Recommendations</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Results View matching PDF Screenshot page 37 */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Actions & Heading matching PDF Screenshot page 37 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Your Personalized Jewelry Recommendations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Occasion: {formData.occasion} • Style: {formData.preferences}
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1d4ed8] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Plan Another
              </button>
            </div>
          </div>

          {/* Budget Summary Bar matching PDF Screenshot page 37 */}
          <div className="bg-[#1e293b] rounded-xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Budget Summary
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                Total Budget: ₹{result.total_budget.toLocaleString('en-IN')}.00
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center sm:text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Allocated</span>
                <span className="text-base font-bold text-blue-300">
                  ₹{result.allocated_budget.toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="text-center sm:text-right bg-emerald-500/20 px-3.5 py-1.5 rounded-lg border border-emerald-400/30">
                <span className="text-[11px] text-emerald-300 block font-medium">Remaining Budget</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{result.remaining_budget.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>
          </div>

          {/* Outfit Analysis Box matching PDF Screenshot page 37 */}
          {result.outfit_analysis && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Outfit Analysis</h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Colors */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      Colors
                    </span>
                    <div className="flex items-center gap-2">
                      {result.outfit_analysis.colors.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: c }}
                          />
                          <span className="font-mono text-slate-700">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Style
                    </span>
                    <span className="font-bold text-slate-900 capitalize">
                      {result.outfit_analysis.style}
                    </span>
                  </div>

                  {/* Formality */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Formality
                    </span>
                    <span className="font-bold text-slate-900 capitalize">
                      {result.outfit_analysis.formality}
                    </span>
                  </div>
                </div>

                {result.outfit_analysis.rationale && (
                  <p className="text-xs text-slate-600 italic bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    💡 Stylist note: {result.outfit_analysis.rationale}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Jewelry Recommendations List matching PDF Screenshot page 37 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <Gem className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Jewelry Recommendations</h3>
            </div>

            <div className="divide-y divide-slate-100 p-5 space-y-6">
              {result.jewelry_recommendations.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900 capitalize">
                          {item.item_type || item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl">
                        <span className="font-semibold text-slate-700">Description: </span>
                        {item.description}
                      </p>
                      {item.style && (
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">Style: </span>
                          {item.style}
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white font-extrabold text-xs rounded-md shadow-xs font-mono">
                        ₹{item.estimated_price.toLocaleString('en-IN')}.00
                      </span>
                    </div>
                  </div>

                  {/* Shop for This branded buttons matching PDF Screenshot page 37 */}
                  <div className="pt-1">
                    <span className="text-xs font-bold text-slate-600 block mb-1">
                      Shop For This:
                    </span>
                    <ShoppingButtons links={item.shopping_links} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INR Calculation Table */}
          {result.calculation_table && (
            <CalculationTable
              rows={result.calculation_table}
              totalBudget={result.total_budget}
              allocatedBudget={result.allocated_budget}
              remainingBudget={result.remaining_budget}
            />
          )}

          {/* Styling Tips matching PDF Screenshot page 37 */}
          {result.styling_tips && result.styling_tips.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-blue-900 text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <h4 className="text-xs sm:text-sm font-bold">Styling Tips</h4>
              </div>
              <div className="p-5 space-y-2.5">
                {result.styling_tips.map((tip, tIdx) => (
                  <div key={tIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
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
