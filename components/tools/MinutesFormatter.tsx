import { useState } from 'react';
import { FileText, ArrowRight, Copy, Check, List, Code2, Eye } from 'lucide-react';
import { Language } from '../../src/types';

interface Props {
  lang: Language;
}

type Tab = 'input' | 'preview';

export default function MinutesFormatter({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('input');

  const processLine = (line: string) => {
    let text = line.trim();
    if (!text) return '';

    // 1. Detect Headers (Keywords)
    if (text.match(/^(議題|アジェンダ|Agenda|Topic)/i)) {
        return `\n## 📝 ${text.replace(/^[:：\s]+/, '')}\n`;
    }
    if (text.match(/^(決定|決まったこと|Conclusion|Decision|Result)/i)) {
        return `\n## ✅ ${text.replace(/^[:：\s]+/, '')}\n`;
    }
    if (text.match(/^(ToDo|タスク|Next Action|Action Item)/i)) {
        return `\n## 🚀 ${text.replace(/^[:：\s]+/, '')}\n`;
    }
    if (text.match(/^(日時|Date)/i)) {
        return `**📅 ${text}**  `;
    }
    if (text.match(/^(参加者|Members|Attendees)/i)) {
        return `**👥 ${text}**  `;
    }

    // 2. Detect Speakers "Name: text"
    // Regex: Start with non-symbol, followed by colon, then text
    const speakerMatch = text.match(/^([^-\s!@#$%.][^:：]{0,10})[:：]\s*(.+)$/);
    if (speakerMatch) {
        const name = speakerMatch[1];
        const content = speakerMatch[2];
        return `- **${name}**: ${content}`;
    }

    // 3. Detect Action Items with Mentions "TODO @Name Task"
    if (text.match(/@\S+/)) {
        text = text.replace(/(@\S+)/g, '**$1**');
    }

    // 4. Standard Bullets
    if (text.startsWith('・') || text.startsWith('-')) {
       // Convert '・' to markdown dash
       return `- ${text.replace(/^[・-]\s?/, '')}`;
    }
    
    // 5. Numbered Lists
    if (text.match(/^[0-9]+\./)) {
       return text;
    }

    // 6. Section Headers (Manual)
    if (text.startsWith('■') || text.startsWith('#')) {
       return `\n### ${text.replace(/^[■#]\s?/, '')}\n`;
    }

    // Default: Indented text or plain text
    // If previous line was a list item, maybe indent this one? (Simplified: just indent)
    return `  ${text}  `;
  };

  const formatNotes = () => {
    const lines = input.split('\n');
    let formatted = '';
    
    // Add Metadata Header if missing
    if (!input.match(/日時|Date/)) {
        formatted += `**📅 Date:** ${new Date().toLocaleDateString()}\n`;
    }

    lines.forEach(line => {
      formatted += processLine(line) + '\n';
    });

    // Cleanup multiple newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    setOutput(formatted.trim());
    setActiveTab('preview');
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown Renderer for Preview
  const renderPreview = (md: string) => {
    return md.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3 border-b pb-1 border-slate-200">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('- ')) {
            const content = line.replace('- ', '');
            // Simple bold replacement
            const parts = content.split(/(\*\*.*?\*\*)/g);
            return (
                <li key={i} className="ml-4 list-disc text-slate-700 my-1">
                    {parts.map((p, j) => p.startsWith('**') ? <strong key={j} className="text-slate-900">{p.replace(/\*\*/g, '')}</strong> : p)}
                </li>
            );
        }
        if (line.startsWith('**')) {
             return <p key={i} className="font-bold text-slate-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
        }
        if (!line.trim()) return <br key={i} />;
        return <p key={i} className="text-slate-600 ml-4 mb-1 text-sm">{line.trim()}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <FileText className="text-indigo-600" size={32} />
          {lang === 'JP' ? '議事録フォーマット自動整形 Pro' : 'Minutes Formatter Pro'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '発言者、決定事項、ToDoを自動検出し、構造化されたMarkdownへ変換します。' : 'Auto-detects speakers, decisions, and tasks, formatting them into structured Markdown.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Input Section */}
         <div className="flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-2 px-1">
                <label className="font-bold text-slate-700 flex items-center gap-2">
                    <List size={18} /> {lang==='JP'?'メモ入力':'Rough Notes'}
                </label>
                <span className="text-xs text-slate-400">{lang==='JP'?'「名前: 発言」の形式も自動認識':'Supports "Name: Text" format'}</span>
            </div>
            <textarea 
               value={input}
               onChange={e => setInput(e.target.value)}
               className="flex-1 p-6 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm text-base leading-relaxed"
               placeholder={lang==='JP' ? 
`日時：2024/10/20
参加者：田中、佐藤、鈴木

■アジェンダ
・新機能のデザインについて
・リリース日の調整

田中：デザインはA案が良いと思います。シンプルなので。
佐藤：確かに。でもB案の方がユーザー層には合っていそう。
鈴木：ではA案をベースにB案の色味を取り入れましょう。

決定：A案ベースの折衷案で進行
ToDo：佐藤さんは来週までにモック作成 (@佐藤)
` : 
`Agenda
- Design Review

Tom: I like option A.
Jerry: Option B is better.

Decision: Go with Option A.
Todo: Tom to finalize assets (@Tom)
`}
            />
            <button onClick={formatNotes} className="mt-4 bg-slate-900 text-white w-full py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5">
               {lang==='JP'?'自動整形する':'Format Notes'} <ArrowRight size={20} />
            </button>
         </div>

         {/* Output Section */}
         <div className="flex flex-col h-[600px] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200 bg-white px-4 pt-4 gap-4">
                <button 
                   onClick={() => setActiveTab('preview')}
                   className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   <Eye size={16} /> {lang==='JP'?'プレビュー':'Preview'}
                </button>
                <button 
                   onClick={() => setActiveTab('input')}
                   className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'input' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                   <Code2 size={16} /> {lang==='JP'?'Markdown':'Source'}
                </button>
                
                <div className="flex-1 text-right pb-2">
                    <button onClick={copyResult} className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold transition-colors inline-flex items-center gap-1">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? (lang==='JP'?'コピー完了':'Copied') : (lang==='JP'?'コピー':'Copy')}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {output ? (
                    activeTab === 'preview' ? (
                        <div className="prose prose-slate max-w-none">
                            {renderPreview(output)}
                        </div>
                    ) : (
                        <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {output}
                        </pre>
                    )
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>{lang==='JP'?'左側にメモを入力して整形ボタンを押してください':'Input notes and click Format'}</p>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
}