import React, { useState } from 'react';
import { Quote, ArrowDown, Copy, Check } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export default function QuoteFormatter({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatText = () => {
    // 1. Convert straight double quotes to Japanese corners
    let text = input.replace(/"(.*?)"/g, '「$1」');
    
    // 2. Handle nesting: If corner brackets contain corner brackets, convert outer to double corner
    // Note: Simple regex for single level nesting
    text = text.replace(/「(.*?)「(.*?)」(.*?)」/g, '『$1「$2」$3』');
    
    // 3. Convert standard brackets to corners if user wants (optional heuristic)
    text = text.replace(/\[(.*?)\]/g, '「$1」');
    
    setOutput(text);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Quote className="text-indigo-600" size={32} />
          {lang === 'JP' ? '引用符整形ツール' : 'Quote Formatter'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '"" や [] を「」に変換し、入れ子になった引用を『』に自動整理します。' : 'Auto-formats straight quotes to Japanese corner brackets and handles nesting.'}
        </p>
      </div>

      <div className="grid gap-6">
         <div>
            <label className="font-bold text-slate-700 block mb-2">{lang==='JP'?'入力':'Input'}</label>
            <textarea 
               value={input}
               onChange={e => setInput(e.target.value)}
               className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
               placeholder={lang==='JP' ? '彼は "それは "間違い" だと思う" と言った。' : 'He said "I think that is "wrong"".'}
            />
         </div>

         <div className="flex justify-center">
            <button onClick={formatText} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
               <ArrowDown size={20} /> {lang==='JP'?'整形する':'Format'}
            </button>
         </div>

         <div>
            <div className="flex justify-between items-center mb-2">
               <label className="font-bold text-slate-700">{lang==='JP'?'結果':'Result'}</label>
               <button onClick={copyResult} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-800">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? (lang==='JP'?'コピー完了':'Copied') : (lang==='JP'?'コピー':'Copy')}
               </button>
            </div>
            <textarea 
               readOnly
               value={output}
               className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none"
            />
         </div>
      </div>
    </div>
  );
}