import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Hash, ScrollText, Download, Music } from 'lucide-react';
import { Language } from '../../src/types';

interface Props {
  lang: Language;
}

interface LogEntry {
  id: number;
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  tag: string;
  note: string;
}

export default function LogTimer({ lang }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState('Work');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [customTag, setCustomTag] = useState('');
  
  // Audio State
  const [bgmSrc, setBgmSrc] = useState<string | null>(null);
  const [bgmName, setBgmName] = useState<string>('');
  const bgmRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  const TAGS = [
    { label: 'Work', color: 'bg-indigo-500', bgClass: 'bg-indigo-50' },
    { label: 'Break', color: 'bg-emerald-500', bgClass: 'bg-emerald-50' },
    { label: 'Chore', color: 'bg-amber-500', bgClass: 'bg-amber-50' },
    { label: 'Move', color: 'bg-slate-500', bgClass: 'bg-slate-50' },
  ];

  const currentTagInfo = TAGS.find(t => t.label === activeTag) || { label: activeTag, color: 'bg-slate-500', bgClass: 'bg-slate-50' };

  // --- Audio ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgmSrc(URL.createObjectURL(file));
      setBgmName(file.name);
    }
  };

  useEffect(() => {
    if (isRunning) {
      bgmRef.current?.play().catch(() => {});
    } else {
      bgmRef.current?.pause();
    }
  }, [isRunning, bgmSrc]);

  // --- Timer ---
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setCurrentSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now());
      setCurrentSeconds(0);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      finishCurrentSegment();
      setIsRunning(false);
      setStartTime(null);
      setCurrentSeconds(0);
    }
  };

  const finishCurrentSegment = (nextTag?: string) => {
    if (!startTime) return;
    
    const now = Date.now();
    const newLog: LogEntry = {
      id: Math.random(),
      startTime: startTime,
      endTime: now,
      duration: Math.floor((now - startTime) / 1000),
      tag: activeTag,
      note: ''
    };

    setLogs(prev => [newLog, ...prev]); // Prepend

    if (nextTag) {
      // Switch immediately
      setActiveTag(nextTag);
      setStartTime(now);
      setCurrentSeconds(0);
    }
  };

  const switchTag = (tag: string) => {
    if (isRunning) {
      finishCurrentSegment(tag);
    } else {
      setActiveTag(tag);
    }
  };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatAbsoluteTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleExport = () => {
    const text = logs.map(l => 
      `${formatAbsoluteTime(l.startTime)} - ${formatAbsoluteTime(l.endTime || 0)} [${l.tag}] ${formatTime(l.duration)}`
    ).reverse().join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timer-log-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <ScrollText className="text-indigo-600" size={32} />
          {lang === 'JP' ? '作業ログタイマー' : 'Log Timer'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '今の作業を記録しながら、ワンクリックで次の作業へ切り替え。BGM機能付き。' : 'Track tasks, switch contexts instantly, and play your focus music.'}
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Main Controls */}
        <div className="md:col-span-5 space-y-6">
          <div className={`p-8 rounded-3xl border border-slate-200 shadow-xl text-center relative overflow-hidden transition-colors duration-500 ${currentTagInfo.bgClass}`}>
             {/* Running Status Indicator */}
             <div className={`absolute top-0 left-0 w-full h-2 ${isRunning ? 'animate-pulse' : ''} ${currentTagInfo.color}`} />
             
             <div className="mb-4 mt-2">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-2 shadow-sm ${currentTagInfo.color}`}>
                  {activeTag}
                </span>
             </div>
             <div className="text-7xl md:text-8xl font-black text-slate-800 font-mono tracking-tighter mb-10 tabular-nums">
               {formatTime(currentSeconds)}
             </div>

             <div className="flex justify-center gap-4">
               {!isRunning ? (
                 <button onClick={handleStart} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                   <Play size={20} fill="currentColor" /> Start
                 </button>
               ) : (
                 <button onClick={handleStop} className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-50 transition-colors">
                   <Square size={20} fill="currentColor" /> Stop
                 </button>
               )}
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Switch</h3>
             <div className="grid grid-cols-2 gap-3">
               {TAGS.map(t => (
                 <button 
                   key={t.label}
                   onClick={() => switchTag(t.label)}
                   className={`p-3 rounded-xl font-bold text-sm transition-all border-2 ${activeTag === t.label ? 'border-slate-800 ring-2 ring-slate-200' : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                 >
                   {t.label}
                 </button>
               ))}
             </div>
             
             <div className="mt-4 flex gap-2">
               <input 
                 type="text" 
                 value={customTag}
                 onChange={e => setCustomTag(e.target.value)}
                 placeholder="Custom Tag..."
                 className="flex-1 p-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-500"
               />
               <button 
                 onClick={() => { if(customTag) switchTag(customTag); setCustomTag(''); }}
                 className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
               >
                 <Hash size={18} className="text-slate-600" />
               </button>
             </div>
          </div>

          {/* BGM Config */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                 <Music size={14} /> BGM (Playing while active)
             </label>
             <div className="flex gap-2 items-center">
                 <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                   Select
                   <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
                 </label>
                 <span className="text-xs text-slate-500 truncate flex-1">{bgmName || 'No file'}</span>
             </div>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="md:col-span-7">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 h-full min-h-[500px] flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-700">Today's Log</h3>
               <button onClick={handleExport} className="text-xs flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:text-indigo-600">
                 <Download size={14} /> Export
               </button>
             </div>
             
             <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2">
               {logs.length === 0 && (
                 <div className="text-center text-slate-400 py-20 italic">No logs yet. Start the timer!</div>
               )}
               {logs.map((log) => (
                 <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400">{formatAbsoluteTime(log.startTime)}</span>
                      <div className="h-full w-px bg-slate-200 my-1"></div>
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider mb-1 ${TAGS.find(t=>t.label===log.tag)?.color || 'bg-slate-400'}`}>
                              {log.tag}
                            </span>
                            <div className="font-bold text-slate-800">{formatTime(log.duration)}</div>
                          </div>
                          {log.endTime && (
                            <span className="text-xs font-bold text-slate-400">{formatAbsoluteTime(log.endTime)}</span>
                          )}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
      
      <audio ref={bgmRef} src={bgmSrc || undefined} loop />
    </div>
  );
}