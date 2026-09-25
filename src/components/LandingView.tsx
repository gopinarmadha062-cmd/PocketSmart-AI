import React from 'react';
import {
  Home,
  Calendar,
  Gem,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="space-y-16">
      {/* Hero Banner matching PDF Screenshot page 27 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#1e40af] text-white py-20 px-4 sm:px-6 lg:px-8 text-center rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>GenAI-Powered Cross-Platform Recommendation Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            PocketSmart
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-blue-100 max-w-2xl mx-auto">
            AI-Powered Budget Planning for Everyday Needs
          </h2>

          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Make smarter financial decisions with personalized budget recommendations for home interiors,
            parties, and jewelry purchases. Our AI helps you get the most value for your money.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2 text-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#planners-section"
              className="px-7 py-3.5 bg-blue-700/50 hover:bg-blue-700 text-white font-semibold rounded-lg border border-blue-400/30 transition-all text-sm"
            >
              Learn More
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-blue-400/20 text-left">
            <div className="bg-white/5 backdrop-blur-xs rounded-lg p-3 border border-white/10">
              <span className="text-2xl font-black text-white">3</span>
              <p className="text-xs text-blue-200 font-medium">Domain Planners</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-lg p-3 border border-white/10">
              <span className="text-2xl font-black text-white">10+</span>
              <p className="text-xs text-blue-200 font-medium">Platforms (Amazon, IKEA, etc.)</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-lg p-3 border border-white/10">
              <span className="text-2xl font-black text-white">100%</span>
              <p className="text-xs text-blue-200 font-medium">INR Budget Adherence</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-lg p-3 border border-white/10">
              <span className="text-2xl font-black text-white">Multimodal</span>
              <p className="text-xs text-blue-200 font-medium">Outfit Vision & Match</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Smart Budget Planners Section matching screenshot page 27 */}
      <section id="planners-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Smart Budget Planners
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Discover how PocketSmart helps you make better financial decisions across different areas of your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
            <div className="h-44 bg-gradient-to-tr from-sky-700 to-blue-600 relative overflow-hidden flex items-center justify-center p-6 text-white">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-blue-100">
                  Scenario 1
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Home Interior Budget Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get personalized recommendations for furniture, lighting, and decor that fit your style preferences
                  and budget constraints. Our AI helps you create a beautiful space without overspending.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded">IKEA</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Amazon</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Flipkart</span>
                </div>
                <button
                  onClick={() => onNavigate('home_planner')}
                  className="w-full py-2.5 bg-[#1e40af] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
            <div className="h-44 bg-gradient-to-tr from-indigo-700 to-purple-600 relative overflow-hidden flex items-center justify-center p-6 text-white">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-purple-100">
                  Scenario 2
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Party Budget Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan your perfect event with smart budget allocations for venue, catering, decorations, and
                  entertainment. Our AI suggests the best ways to create memorable events while staying within your budget.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Swiggy</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Zomato</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">OYO</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">BookMyShow</span>
                </div>
                <button
                  onClick={() => onNavigate('party_planner')}
                  className="w-full py-2.5 bg-[#1e40af] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
            <div className="h-44 bg-gradient-to-tr from-blue-700 to-cyan-600 relative overflow-hidden flex items-center justify-center p-6 text-white">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="relative text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                  <Gem className="w-7 h-7 text-white" />
                </div>
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-cyan-100">
                  Scenario 3
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  Jewelry Budget Planner
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Find the ideal jewelry pieces for any occasion that match your outfit and budget. Our AI recommends
                  options based on your style preferences, occasion, and available budget.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-100 rounded">Tanishq</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">BlueStone</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded">CaratLane</span>
                </div>
                <button
                  onClick={() => onNavigate('jewelry_planner')}
                  className="w-full py-2.5 bg-[#1e40af] hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Users Say (Testimonials) Section matching Screenshot page 28 */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Real experiences from people who have transformed their financial planning with PocketSmart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 relative flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-blue-500/30 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "PocketSmart helped me furnish my new apartment without breaking the bank. The recommendations were spot on and I saved nearly 30% of my original budget!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sarah K.</h4>
                  <p className="text-[11px] text-slate-500">Home Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 relative flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-purple-500/30 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "Planning my daughter's birthday party was so much easier with PocketSmart's budget breakdown. The AI suggestions for affordable decorations and catering options were fantastic."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  MR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Michael R.</h4>
                  <p className="text-[11px] text-slate-500">Parent</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 relative flex flex-col justify-between">
              <div>
                <Quote className="w-6 h-6 text-cyan-500/30 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "The jewelry recommendations perfectly matched my outfit for the wedding. Saved me hours of searching and I received so many compliments on my accessories!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Priya M.</h4>
                  <p className="text-[11px] text-slate-500">Fashion Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Optimize Your Budget? CTA Section matching Screenshot page 28 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Optimize Your Budget?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Join PocketSmart today and start making smarter financial decisions across all areas of your life.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-lg text-xs transition-colors shadow-md"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg text-xs border border-blue-400/30 transition-colors shadow-md"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
