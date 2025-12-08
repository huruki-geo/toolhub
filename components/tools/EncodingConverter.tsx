import { useState, useEffect } from 'react';
import { Binary, Copy, RotateCcw, ArrowRightLeft, ArrowDownUp } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

type ConversionMode = 'encode' | 'decode';

export default function EncodingConverter({ lang }: Props) {
  const [mode, setMode] = useState<ConversionMode>('encode');
  const [input, setInput] = useState(mode === 'encode' ? 'こんにちは World!' : '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20World%21');
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'encode') {
      encodeAll();
    } else {
      decodeAll();
    }
  }, [input, mode]);

  const encodeAll = () => {
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

  const decodeAll = () => {
    const res: Record<string, string> = {};

    // URL Decode
    try {
      res['From URL Encoded'] = decodeURIComponent(input);
    } catch (e) {
      res['From URL Encoded'] = '(Invalid URL encoding)';
    }

    // Base64 Decode
    try {
      const binString = atob(input);
      const bytes = Uint8Array.from(binString, m => m.codePointAt(0)!);
      const decoder = new TextDecoder('utf-8');
      res['From Base64'] = decoder.decode(bytes);
    } catch (e) {
      res['From Base64'] = '(Invalid Base64)';
    }

    // Hex Decode
    try {
      const hex = input.replace(/\s+/g, '');
      if (hex.match(/^[0-9a-fA-F]+$/) && hex.length % 2 === 0) {
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const decoder = new TextDecoder('utf-8');
        res['From Hex (UTF-8)'] = decoder.decode(bytes);
      } else {
        res['From Hex (UTF-8)'] = '(Invalid Hex)';
      }
    } catch (e) {
      res['From Hex (UTF-8)'] = '(Error)';
    }

    // Unicode Unescape (\uXXXX)
    try {
      res['From Unicode Escape'] = input.replace(/\\u[\dA-F]{4}/gi, (match) => {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
    } catch (e) {
      res['From Unicode Escape'] = '(Error)';
    }

    // HTML Entity Decode (Simple)
    try {
      const txt = document.createElement('textarea');
      txt.innerHTML = input;
      res['From HTML Entities'] = txt.value;
    } catch(e) {
      res['From HTML Entities'] = '(Error)';
    }

    setResults(res);
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const switchMode = (m: ConversionMode) => {
    setMode(m);
    setInput('');
    setResults({});
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Binary className="text-indigo-600" size={32} />
          {lang === 'JP' ? '文字コード変換' : 'Encoding Converter'}
        </h2>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => switchMode('encode')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'encode' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ArrowRightLeft size={16} />
            {lang === 'JP' ? 'エンコード (変換)' : 'Encode'}
          </button>
          <button
            onClick={() => switchMode('decode')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${mode === 'decode' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ArrowDownUp size={16} />
            {lang === 'JP' ? 'デコード (復元)' : 'Decode'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="flex flex-col h-full">
           <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700">
                {lang === 'JP' ? (mode === 'encode' ? '入力テキスト' : '入力コード (Base64, URL, Hex等)') : (mode === 'encode' ? 'Input Text' : 'Input Code')}
              </label>
              <button onClick={() => setInput('')} className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"><RotateCcw size={12}/> Clear</button>
           </div>
           <textarea 
             value={input}
             onChange={e => setInput(e.target.value)}
             className="w-full flex-1 min-h-[300px] p-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-base"
             placeholder={mode === 'encode' ? (lang==='JP'?'ここに文字を入力...':'Type text here...') : (lang==='JP'?'ここにコードを入力...':'Paste code here...')}
           />
        </div>

        {/* Results */}
        <div className="space-y-4 h-[400px] md:h-auto overflow-y-auto pr-2 custom-scrollbar">
           {Object.entries(results).map(([label, val]) => (
             <div key={label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                   <button onClick={() => copyResult(val as string)} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-50 rounded">
                      <Copy size={16} />
                   </button>
                </div>
                <div className="font-mono text-sm break-all text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 min-h-[3em]">
                   {val || <span className="text-slate-300 italic">Result</span>}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}