import React, { useState } from 'react';
import { generateRegexSolution } from './services/gemini.ts';
import { RegexResult, LoadingState } from './types.ts';
import { DEFAULT_PROMPT } from './constants.ts';
import CodeBlock from './components/CodeBlock.tsx';
import RegexTester from './components/RegexTester.tsx';
import { Sparkles, Terminal, Code2, AlertCircle, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<RegexResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus(LoadingState.LOADING);
    setErrorMsg(null);
    try {
      const data = await generateRegexSolution(prompt);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate solution. Please check your API Key and try again.");
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Terminal size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              C# Regex Wizard
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Input Section */}
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">What do you want to match?</h2>
            <p className="text-slate-400">Describe your pattern requirements in plain language, and I'll generate the C# Regex code for you.</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 transition-opacity duration-500 group-hover:opacity-30"></div>
            <div className="relative bg-slate-900 rounded-xl border border-slate-700 p-2 shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-transparent text-lg p-4 min-h-[120px] text-slate-200 placeholder-slate-600 focus:outline-none resize-none"
                placeholder="e.g. Extract email addresses from a text block..."
              />
              <div className="flex justify-between items-center px-4 pb-2">
                <span className="text-xs text-slate-500">
                  {prompt.length} chars
                </span>
                <button
                  onClick={handleGenerate}
                  disabled={status === LoadingState.LOADING || !prompt.trim()}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${status === LoadingState.LOADING 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95'
                    }`}
                >
                  {status === LoadingState.LOADING ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate Regex
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error State */}
        {status === LoadingState.ERROR && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Explanation & Code */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Explanation Card */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
                  <div className="flex items-center gap-2 mb-4 text-indigo-400">
                    <Sparkles size={20} />
                    <h3 className="font-semibold text-white">How it works</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {result.explanation}
                  </p>
                </div>

                {/* Pattern & Code */}
                <div>
                   <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Code2 size={20} className="text-purple-400" />
                    Solution
                   </h3>
                   <CodeBlock 
                      code={result.pattern} 
                      label="Regex Pattern" 
                      language="regex" 
                    />
                   <CodeBlock 
                      code={result.csharpCode} 
                      label="C# Implementation" 
                      language="csharp" 
                    />
                </div>
              </div>

              {/* Right Column: Testing */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <RegexTester result={result} />
                  
                  {/* Tips Card */}
                  <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-2">C# Regex Tips</h4>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                      <li>C# supports <code>RightToLeft</code> mode which is great for finding the "last" occurrence efficiently.</li>
                      <li>Use <code>@""</code> verbatim strings in C# to avoid double escaping backslashes.</li>
                      <li><code>RegexOptions.Compiled</code> can improve performance for reused patterns.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;