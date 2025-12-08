import React, { useState, useRef } from 'react';
import { ArrowRight, Copy, Check, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export const ScheduleFormatterComponent: React.FC<Props> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    title: lang === 'JP' ? 'スケジュール整形 Pro' : 'Schedule Formatter Pro',
    desc: lang === 'JP' 
      ? 'メモを時刻順に並べ替え、カテゴリごとに色分けして可視化します。「食事」「移動」などのキーワードに反応します。' 
      : 'Sorts notes chronologically and visualizes them with category-based color coding.',
    inputLabel: lang === 'JP' ? '入力（メモ書き）' : 'Input',
    clear: lang === 'JP' ? 'クリア' : 'Clear',
    placeholder: lang === 'JP' 
      ? '0900 朝食\n10:00 移動\n10:30 ミーティング\n12:00 ランチ\n1300 作業' 
      : '0900 Breakfast\n10:00 Commute\n10:30 Meeting',
    outputLabel: lang === 'JP' ? '整形結果' : 'Formatted Output',
    copy: lang === 'JP' ? 'コピー' : 'Copy',
    saveImg: lang === 'JP' ? '画像保存' : 'Save Image',
    formatBtn: lang === 'JP' ? '整形する' : 'Format',
  };

  // Keywords for auto-coloring
  const getColorForText = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('食事') || t.includes('ランチ') || t.includes('dinner') || t.includes('lunch') || t.includes('breakfast')) return '#f97316'; // Orange
    if (t.includes('移動') || t.includes('commute') || t.includes('travel') || t.includes('電車')) return '#64748b'; // Slate
    if (t.includes('ミーティング') || t.includes('会議') || t.includes('meeting')) return '#3b82f6'; // Blue
    if (t.includes('作業') || t.includes('work') || t.includes('dev')) return '#10b981'; // Emerald
    if (t.includes('ジム') || t.includes('運動') || t.includes('gym')) return '#ef4444'; // Red
    if (t.includes('睡眠') || t.includes('寝る') || t.includes('sleep')) return '#8b5cf6'; // Violet
    return '#6366f1'; // Default Indigo
  };

  const formatSchedule = () => {
    if (!input.trim()) return;

    const lines = input.split('\n');
    const parsed = lines
      .map(line => {
        const timeMatch = line.match(/(\d{1,2})[:：]?(\d{2})?|(\d{4})/);
        if (!timeMatch) return null;

        let hour = 0;
        let minute = 0;

        if (timeMatch[3]) { 
          hour = parseInt(timeMatch[3].substring(0, 2));
          minute = parseInt(timeMatch[3].substring(2, 4));
        } else {
          hour = parseInt(timeMatch[1]);
          minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        }

        const content = line.replace(timeMatch[0], '').replace(/^[:：\s]+|[:：\s]+$/g, '').trim();

        return {
          totalMinutes: hour * 60 + minute,
          hour,
          minute,
          content
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.totalMinutes - b.totalMinutes);

    // Generate Text Output with Duration
    const formatted = parsed.map((item, i) => {
      const h = item.hour.toString().padStart(2, '0');
      const m = item.minute.toString().padStart(2, '0');
      
      // Calculate duration to next item
      let durationStr = '';
      if (i < parsed.length - 1) {
        const next = parsed[i+1];
        const diff = next.totalMinutes - item.totalMinutes;
        if (diff > 0) {
          const dh = Math.floor(diff / 60);
          const dm = diff % 60;
          durationStr = `(${dh > 0 ? dh + 'h ' : ''}${dm}m)`;
        }
      }

      return `${h}:${m} ${item.content} ${durationStr}`;
    }).join('\n');

    setOutput(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!output || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines = output.split('\n');
    const lineHeight = 60; // Increased for blocks
    const padding = 60;
    const headerHeight = 100;
    const width = 800;
    const height = headerHeight + (lines.length * lineHeight) + padding;

    // Setup Canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw Header
    ctx.fillStyle = '#4f46e5'; 
    ctx.fillRect(0, 0, width, 16); 
    ctx.fillStyle = '#1e293b'; 
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Schedule', padding, 70);
    
    // Draw Date (Mock)
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(new Date().toLocaleDateString(), padding + 180, 70);

    // Draw Content
    lines.forEach((line, i) => {
      const y = headerHeight + (i * lineHeight);
      
      // Parse Line again simply
      const parts = line.split(' ');
      const time = parts[0];
      const content = parts.slice(1).join(' ').replace(/\(.*\)/, '').trim(); // Remove duration for clean text
      const durationMatch = line.match(/\((.*)\)/);
      const duration = durationMatch ? durationMatch[1] : '';

      // Color logic
      const color = getColorForText(content);

      // Time Pillar
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(time, padding, y + 24);

      // Colored Block for Content
      const blockX = padding + 100;
      const blockW = width - blockX - padding;
      
      ctx.fillStyle = color + '20'; // Transparent bg
      ctx.fillRect(blockX, y - 10, blockW, 48);
      ctx.fillStyle = color; // Border/Indicator
      ctx.fillRect(blockX, y - 10, 6, 48);

      // Content Text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(content, blockX + 24, y + 22);

      // Duration Label
      if (duration) {
         ctx.fillStyle = '#64748b';
         ctx.font = '14px sans-serif';
         ctx.textAlign = 'right';
         ctx.fillText(duration, width - padding - 10, y + 22);
         ctx.textAlign = 'left';
         
         // Little connection line
         if (i < lines.length - 1) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padding + 35, y + 35);
            ctx.lineTo(padding + 35, y + lineHeight - 10);
            ctx.stroke();
            ctx.setLineDash([]);
         }
      }
    });

    const link = document.createElement('a');
    link.download = `schedule-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h2>
        <p className="text-lg text-slate-600">{t.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">{t.inputLabel}</label>
            <button 
              onClick={() => setInput('')}
              className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 font-medium"
            >
              <RotateCcw size={12} /> {t.clear}
            </button>
          </div>
          <div className="relative flex-1">
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-full min-h-[400px] p-5 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-base shadow-sm leading-relaxed"
             />
             <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 px-2 rounded backdrop-blur">
                Auto-sort enabled
             </div>
          </div>
        </div>

        {/* Action (Mobile) */}
        <div className="md:hidden flex justify-center">
           <button onClick={formatSchedule} className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
             {t.formatBtn} <ArrowRight size={18} />
           </button>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">{t.outputLabel}</label>
            {output && (
              <div className="flex gap-2">
                 <button 
                  onClick={handleDownloadImage}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold transition-colors flex items-center gap-1 shadow-md shadow-indigo-200"
                >
                  <ImageIcon size={14} /> {t.saveImg}
                </button>
                <button 
                  onClick={handleCopy}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 border ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? t.copy : t.copy}
                </button>
              </div>
            )}
          </div>
          
          <div className="relative flex-1 min-h-[400px]">
            {/* Desktop Action */}
            <div className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-10">
              <button 
                onClick={formatSchedule}
                className="bg-white border border-slate-200 p-3 rounded-full shadow-xl text-indigo-600 hover:scale-110 hover:text-indigo-700 transition-all group"
              >
                <ArrowRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <textarea
              readOnly
              value={output}
              className="w-full h-full p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-base shadow-inner text-slate-700 leading-relaxed"
            />
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ScheduleFormatterComponent;