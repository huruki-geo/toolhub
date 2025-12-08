import React, { useState } from 'react';
import { FileText, ArrowRight, Copy, Check } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export default function MinutesFormatter({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatNotes = () => {
    const lines = input.split('\n');
    let formatted = '';
    let section = 'none'; // 'none', 'agenda', 'discussion', 'decision'

    lines.forEach(line => {
      const trim = line.trim();
      if (!trim) return;

      // Detect Sections
      if (trim.match(/^(議題|アジェンダ|Agenda)/i)) {
         formatted += `\n## 📝 ${trim}\n`;
         section = 'agenda';
         return;
      }
      if (trim.match(/^(決定|決まったこと|Conclusion|Decision)/i)) {
         formatted += `\n## ✅ ${trim}\n`;
         section = 'decision';
         return;
      }
      if (trim.match(/^(ToDo|タスク|Next Action)/i)) {
         formatted += `\n## 🚀 ${trim}\n`;
         section = 'todo';
         return;
      }

      // Format Content based on heuristics
      if (trim.startsWith('・') || trim.startsWith('-')) {
         formatted += `- ${trim.replace(/^[・-]\s?/, '')}\n`;
      } else if (trim.match(/^[0-9]+\./)) {
         formatted += `${trim}\n`;
      } else if (trim.startsWith('■') || trim.startsWith('#')) {
         formatted += `\n### ${trim.replace(/^[■#]\s?/, '')}\n`;
      } else {
         // Plain text, indent if it looks like a continuation
         formatted += `  ${trim}\n`;
      }
    });

    setOutput(formatted.trim());
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <FileText className="text-indigo-600" size={32} />
          {lang === 'JP' ? '議事録フォーマット自動整形' : 'Minutes Formatter'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? 'メモ書きを「見出し」「箇条書き」「決定事項」に自動で構造化します。' : 'Auto-structure rough notes into formatted meeting minutes.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-[500px]">
         <div className="flex flex-col">
            <label className="font-bold text-slate-700 block mb-2">{lang==='JP'?'入力 (メモ書き)':'Rough Notes'}</label>
            <textarea 
               value={input}
               onChange={e => setInput(e.target.value)}
               className="flex-1 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
               placeholder={lang==='JP' ? "■議題\n・新プロジェクトについて\n・予算の確認\n\n■決定事項\n・予算は50万で承認\n・来週キックオフ\n\nToDo\n・Aさんが資料作成" : "Agenda\n- Project A\n\nDecisions\n- Budget approved"}
            />
         </div>

         <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
               <label className="font-bold text-slate-700">{lang==='JP'?'整形結果':'Formatted'}</label>
               <button onClick={copyResult} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-800">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? (lang==='JP'?'コピー完了':'Copied') : (lang==='JP'?'コピー':'Copy')}
               </button>
            </div>
            <textarea 
               readOnly
               value={output}
               className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
         </div>
      </div>

      <div className="flex justify-center mt-8">
         <button onClick={formatNotes} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
            {lang==='JP'?'自動整形する':'Format Notes'} <ArrowRight size={20} />
         </button>
      </div>
    </div>
  );
}