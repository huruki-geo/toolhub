import React, { useState, useEffect } from 'react';
import { FileEdit, Download, Trash2, Copy, Check, Clock } from 'lucide-react';
import { Language } from '../../src/types';


interface Props {
  lang: Language;
}

export default function BrowserNotepad({ lang }: Props) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('browser-notepad-content');
    if (saved) setText(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    localStorage.setItem('browser-notepad-content', val);
    if (!status) {
        setStatus(lang === 'JP' ? '保存中...' : 'Saving...');
        setTimeout(() => setStatus(''), 1000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notepad-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setStatus(lang === 'JP' ? 'コピーしました' : 'Copied!');
    setTimeout(() => {
        setCopied(false);
        setStatus('');
    }, 2000);
  };

  const handleInsertDate = () => {
    const now = new Date().toLocaleString(lang==='JP'?'ja-JP':'en-US');
    setText(prev => prev + (prev ? '\n' : '') + now + '\n');
    localStorage.setItem('browser-notepad-content', text + (text ? '\n' : '') + now + '\n');
  };

  const handleClear = () => {
    if (confirm(lang === 'JP' ? '本当に消去しますか？' : 'Are you sure?')) {
      setText('');
      localStorage.removeItem('browser-notepad-content');
    }
  };

  const stats = {
    chars: text.length,
    lines: text ? text.split('\n').length : 0
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 h-[calc(100vh-200px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
         <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileEdit className="text-indigo-600" size={28} />
              {lang === 'JP' ? 'ブラウザメモ帳' : 'Browser Notepad'}
            </h2>
            <span className="text-xs text-indigo-500 font-bold transition-opacity duration-300 opacity-80 min-w-[100px]">
              {status}
            </span>
         </div>
         
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
                onClick={handleInsertDate} 
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs transition-colors whitespace-nowrap"
                title="Insert Timestamp"
            >
              <Clock size={14} /> {lang==='JP'?'日時':'Date'}
            </button>
            <button 
                onClick={handleCopy} 
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {lang === 'JP' ? 'コピー' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-xs transition-colors whitespace-nowrap">
              <Download size={14} /> {lang === 'JP' ? '保存' : 'Download'}
            </button>
            <button onClick={handleClear} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors">
              <Trash2 size={14} />
            </button>
         </div>
      </div>

      <div className="flex-1 relative flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <textarea
           value={text}
           onChange={handleChange}
           placeholder={lang === 'JP' ? 'ここに入力した内容は、ブラウザに自動保存されます...' : 'Type here. Auto-saved to browser storage...'}
           className="flex-1 w-full p-6 md:p-8 outline-none resize-none font-mono text-base leading-relaxed text-slate-800"
        />
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-2 text-xs text-slate-400 font-mono flex gap-4">
            <span>{stats.chars} chars</span>
            <span>{stats.lines} lines</span>
        </div>
      </div>
    </div>
  );
}