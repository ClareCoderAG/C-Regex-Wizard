import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text', label }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-900 my-4 shadow-sm">
      {label && (
        <div className="bg-slate-800 px-4 py-2 text-xs font-medium text-slate-400 border-b border-slate-700 flex justify-between items-center">
          <span>{label}</span>
          <span className="uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm text-slate-200 leading-relaxed">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-md bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700 hover:text-white"
          title="Copy to clipboard"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

export default CodeBlock;