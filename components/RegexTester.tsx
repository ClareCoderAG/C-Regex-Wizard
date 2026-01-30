import React, { useState, useEffect } from 'react';
import { RegexResult, TestCase } from '../types';
import { Play, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface RegexTesterProps {
  result: RegexResult;
}

const RegexTester: React.FC<RegexTesterProps> = ({ result }) => {
  const [testString, setTestString] = useState<string>('abc+def+ghi+jkl.mno');
  const [matchResult, setMatchResult] = useState<{ match: string; index: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result.jsPattern) {
      setError("The generated C# Regex uses features not supported in the browser (JavaScript). Please use the C# code snippet to test accurately.");
      setMatchResult(null);
      return;
    }

    try {
      setError(null);
      // We assume the pattern is meant to be global or specific. 
      // Typically C# regex matches part of string.
      const regex = new RegExp(result.jsPattern, 'g'); // 'g' to find last if needed, though pattern logic dictates match
      
      // For "last match" logic, the regex pattern itself usually handles greedy consumption.
      // If the pattern is like `\+[^.]*$`, it matches once at the end.
      
      const matches = [...testString.matchAll(regex)];
      
      if (matches.length > 0) {
        // If multiple matches, C# Regex.Match usually takes the first found from left, 
        // BUT the pattern logic for "last plus" typically forces the engine to skip to the end.
        // We will display the *last* match found if the logic implies scanning, but usually the pattern is anchored or greedy.
        // Let's just take the first match returned by the RegExp because a well-formed "find last" regex usually consumes everything before it.
        const m = matches[0];
        setMatchResult({ match: m[0], index: m.index || 0 });
      } else {
        setMatchResult(null);
      }
    } catch (e) {
      setError("Invalid JS Regex Pattern");
    }
  }, [testString, result.jsPattern]);

  const renderHighlightedText = () => {
    if (!matchResult || !testString) return <span className="text-slate-400">{testString}</span>;

    const before = testString.substring(0, matchResult.index);
    const match = matchResult.match;
    const after = testString.substring(matchResult.index + match.length);

    return (
      <div className="font-mono text-sm break-all">
        <span className="text-slate-500 opacity-60">{before}</span>
        <span className="bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-500">{match}</span>
        <span className="text-slate-500 opacity-60">{after}</span>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Play className="text-emerald-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Live Playground</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Test String</label>
          <input
            type="text"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
            placeholder="Enter text to test..."
          />
        </div>

        <div className="bg-slate-900 rounded-lg p-4 min-h-[80px] flex flex-col justify-center border border-slate-700">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</span>
             {matchResult ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 size={12} /> Match Found
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                 No Match
              </span>
            )}
          </div>
          
          {error ? (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          ) : (
             renderHighlightedText()
          )}
        </div>
        
        {matchResult && (
           <div className="text-xs text-slate-500">
            Matched: <span className="font-mono text-emerald-300">"{matchResult.match}"</span> at index {matchResult.index}
           </div>
        )}
      </div>
    </div>
  );
};

export default RegexTester;