import { useState, useEffect } from 'react';
import { Binary, Copy, RotateCcw } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export default function EncodingConverter({ lang }: Props) {
  const [input, setInput] = useState('こんにちは World!');
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    convertAll();
  }, [input]);

  const convertAll = () => {
    try {
      const utf8Encode = new TextEncoder();
      const bytes = utf8Encode.encode(input);
      
      const res: Record<string, string> = {};

      // URL Encode
      res['URL Encoded'] = encodeURIComponent(input);
      
      // Base64
      try {
        // Handle UTF-8 strings for btoa
        const binString = String.fromCodePoint(...bytes);
        res['Base64'] = btoa(binString);
      } catch (e) {
        res['Base64'] = 'Error';
      }

      // Hex (UTF-8)
      res['Hex (UTF-8)'] = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');

      // HTML Entities
      res['HTML Entities'] = input.replace(/[\u00A0-\u9999<>&]/g, function(i) {
         return '&#'+i.charCodeAt(0)+';';
      });

      // Unicode Escape
      res['Unicode Escape'] = input.split('').map(c => {
         const hex = c.charCodeAt(0).toString(16).padStart(4, '0');
         return `\\u${hex}`;
      }).join('');

      setResults(res);

    } catch (e) {
      console.error(e);
    }
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Binary className="text-indigo-600" size={32} />
          {lang === 'JP' ? '文字コード変換' : 'Encoding Converter'}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div>
           <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700">{lang==='JP'?'入力テキスト':'Input Text'}</label>
              <button onClick={() => setInput('')} className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"><RotateCcw size={12}/> Clear</button>
           </div>
           <textarea 
             value={input}
             onChange={e => setInput(e.target.value)}
             className="w-full h-96 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-base"
             placeholder="Type here..."
           />
        </div>

        {/* Results */}
        <div className="space-y-4 h-96 overflow-y-auto pr-2 custom-scrollbar">
           {Object.entries(results).map(([label, val]) => (
             <div key={label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                   <button onClick={() => copyResult(val as string)} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-50 rounded">
                      <Copy size={16} />
                   </button>
                </div>
                <div className="font-mono text-sm break-all text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                   {val}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}