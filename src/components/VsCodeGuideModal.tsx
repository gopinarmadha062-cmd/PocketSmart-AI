import React, { useState } from 'react';
import {
  X,
  Terminal,
  Copy,
  Check,
  Code2,
  FileCode,
  Play,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface VsCodeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VsCodeGuideModal: React.FC<VsCodeGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'node' | 'python'>('node');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const nodeCommands = `# Step 1: Open project in VS Code
cd /path/to/PocketSmart-AI

# Step 2: Ensure Node.js (v18+) is installed
node -v

# Step 3: Install all dependencies
npm install

# Step 4: Configure your Gemini API Key in .env
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY="AIzaSy..."

# Step 5: Start the full-stack server
npm run dev

# Step 6: Open in your browser
http://localhost:3000`;

  const pythonCommands = `# Step 1: Navigate to the python backend folder
cd backend_python

# Step 2: Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate

# Step 3: Install all Python dependencies
pip install -r requirements.txt

# Step 4: Configure your environment variables
cp .env.example .env
# Add your GEMINI_API_KEY="AIzaSy..." in .env

# Step 5: Run the FastAPI server with Uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Step 6: Test the FastAPI Interactive API Docs
http://localhost:8000/docs`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">VS Code Setup, Running & Testing Instructions</h3>
              <p className="text-[11px] text-slate-400">Complete guide for Node.js + Python FastAPI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Environment Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('node')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'node'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🚀 Node.js / React App (Port 3000)
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'python'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🐍 Python FastAPI Backend (Port 8000)
            </button>
          </div>

          {activeTab === 'node' ? (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 space-y-1">
                <span className="font-bold block">Full-Stack Vite + Express Architecture</span>
                <p className="text-[11px] text-blue-800">
                  This repository has a built-in Express server (<code>server.ts</code>) that connects directly to the Google GenAI SDK and serves the modern React SPA.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2 rounded-t-lg font-mono text-[11px]">
                  <span>VS Code Integrated Terminal</span>
                  <button
                    onClick={() => copyToClipboard(nodeCommands, 'node')}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'node' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy commands</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-b-lg overflow-x-auto leading-relaxed">
                  {nodeCommands}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 space-y-1">
                <span className="font-bold block">Python FastAPI Backend Architecture</span>
                <p className="text-[11px] text-emerald-800">
                  The standalone Python backend lives in <code>backend_python/</code>. It contains <code>app.py</code>, <code>gemini_utils.py</code>, and <code>models.py</code> matching the exact SmartBridge PDF architecture.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2 rounded-t-lg font-mono text-[11px]">
                  <span>VS Code Integrated Terminal</span>
                  <button
                    onClick={() => copyToClipboard(pythonCommands, 'python')}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'python' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy commands</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-b-lg overflow-x-auto leading-relaxed">
                  {pythonCommands}
                </pre>
              </div>
            </div>
          )}

          {/* Testing All 3 Scenarios */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              Step-by-Step Testing Checklist
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Scenario 1 (Home Interior):</span> Enter budget ₹5,000, specify 5 lights and 4 fans. Click "Generate Recommendations" and verify items with Amazon, Flipkart, and IKEA links.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Scenario 2 (Party Budget):</span> Enter budget ₹5,000, 3 guests, Wedding anniversary. Check Swiggy/Zomato catering, OYO venue suggestions, and the calculation table.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Scenario 3 (Jewelry Multimodal):</span> Upload or click the "Blue Shirt" preset, set budget ₹5,000 for a Birthday. Check that the Gemini vision output extracts outfit colors, style, and recommends matching pieces from Tanishq & CaratLane!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
