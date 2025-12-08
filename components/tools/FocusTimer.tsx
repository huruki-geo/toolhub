import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Music, Bell, Hourglass, SkipForward, Edit2, Plus, Trash2, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Language } from '../../types';
import { playDefaultAlarm, unlockAudio } from '../../utils/audio';

interface Props {
  lang: Language;
}

type ThemeColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'cyan';

interface TimerSegment {
  id: string;
  name: string;
  durationMinutes: number;
  bgmSrc?: string;
  bgmName?: string;
  theme: ThemeColor;
}

const THEME_KEYS: ThemeColor[] = ['indigo', 'emerald', 'amber', 'rose', 'slate', 'cyan'];

const THEMES: Record<ThemeColor, string> = {
  indigo: 'bg-indigo-50 border-indigo-100 text-indigo-900',
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  amber: 'bg-amber-50 border-amber-100 text-amber-900',
  rose: 'bg-rose-50 border-rose-100 text-rose-900',
  slate: 'bg-slate-50 border-slate-100 text-slate-900',
  cyan: 'bg-cyan-50 border-cyan-100 text-cyan-900',
};

const THEME_ACCENTS: Record<ThemeColor, string> = {
  indigo: 'bg-indigo-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-600 text-white',
  rose: 'bg-rose-600 text-white',
  slate: 'bg-slate-600 text-white',
  cyan: 'bg-cyan-600 text-white',
};

const TEMPLATES: { name: string; segments: TimerSegment[] }[] = [
  { 
    name: 'Pomodoro (25/5)', 
    segments: [
      { id: '1', name: 'Focus', durationMinutes: 25, theme: 'indigo' },
      { id: '2', name: 'Break', durationMinutes: 5, theme: 'emerald' }
    ] 
  },
  { 
    name: '52/17 Rule', 
    segments: [
      { id: '1', name: 'Deep Work', durationMinutes: 52, theme: 'indigo' },
      { id: '2', name: 'Refresh', durationMinutes: 17, theme: 'cyan' }
    ] 
  },
  { 
    name: 'Ultradian (90)', 
    segments: [
      { id: '1', name: 'Ultradian Cycle', durationMinutes: 90, theme: 'rose' },
      { id: '2', name: 'Recover', durationMinutes: 20, theme: 'amber' }
    ] 
  },
  { 
    name: '10-2 Flow', 
    segments: [
      { id: '1', name: 'Dash', durationMinutes: 10, theme: 'indigo' },
      { id: '2', name: 'Rest', durationMinutes: 2, theme: 'slate' }
    ] 
  },
  { 
    name: 'HIIT/Tabata', 
    segments: [
      { id: '1', name: 'High Intensity', durationMinutes: 0.35, theme: 'rose' }, // 20s roughly
      { id: '2', name: 'Low Intensity', durationMinutes: 0.17, theme: 'emerald' }  // 10s roughly
    ] 
  },
];

export default function FocusTimer({ lang }: Props) {
  const [segments, setSegments] = useState<TimerSegment[]>(TEMPLATES[0].segments);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(Math.floor(segments[0].durationMinutes * 60));
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Audio State
  const [alarmSrc, setAlarmSrc] = useState<string | null>(null);
  const [alarmName, setAlarmName] = useState<string>('');
  const [isLooping, setIsLooping] = useState(true);

  const bgmRef = useRef<HTMLAudioElement>(null);
  const alarmRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  const activeSegment = segments[activeSegmentIndex] || segments[0]; // fallback
  const currentThemeClass = THEMES[activeSegment.theme] || THEMES.indigo;
  const currentAccentClass = THEME_ACCENTS[activeSegment.theme] || THEME_ACCENTS.indigo;

  // --- Audio Handling ---
  const handleGlobalAlarmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlarmSrc(URL.createObjectURL(file));
      setAlarmName(file.name);
    }
  };

  const handleSegmentBgmChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newSegments = [...segments];
      newSegments[index] = {
        ...newSegments[index],
        bgmSrc: url,
        bgmName: file.name
      };
      setSegments(newSegments);
    }
  };

  // --- Playback Logic ---
  useEffect(() => {
    const activeSeg = segments[activeSegmentIndex];
    if (bgmRef.current && activeSeg) {
        if (activeSeg.bgmSrc) {
             const currentSrc = bgmRef.current.getAttribute('src');
             if (currentSrc !== activeSeg.bgmSrc) {
                bgmRef.current.src = activeSeg.bgmSrc;
                bgmRef.current.load();
             }
             if (isRunning) {
                bgmRef.current.play().catch(() => {});
             } else {
                bgmRef.current.pause();
             }
        } else {
            bgmRef.current.pause();
            // Don't clear src immediately to avoid abrupt stop if same, but pause is enough
            if (!isRunning) bgmRef.current.currentTime = 0; 
        }
    }
  }, [activeSegmentIndex, segments, isRunning]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Play Sound
      if (alarmSrc && alarmRef.current) {
         alarmRef.current.play().catch(() => {});
      } else {
         playDefaultAlarm();
      }

      nextSegment();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, alarmSrc]);

  const nextSegment = () => {
      if (isLooping) {
         const nextIndex = (activeSegmentIndex + 1) % segments.length;
         setActiveSegmentIndex(nextIndex);
         setTimeLeft(Math.floor(segments[nextIndex].durationMinutes * 60));
      } else {
         if (activeSegmentIndex < segments.length - 1) {
             const nextIndex = activeSegmentIndex + 1;
             setActiveSegmentIndex(nextIndex);
             setTimeLeft(Math.floor(segments[nextIndex].durationMinutes * 60));
         } else {
             setIsRunning(false);
         }
      }
  };

  const toggleTimer = () => {
      if (!isRunning) unlockAudio();
      setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setActiveSegmentIndex(0);
    setTimeLeft(Math.floor(segments[0].durationMinutes * 60));
    if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
    }
  };

  const loadTemplate = (template: typeof TEMPLATES[0]) => {
    setIsRunning(false);
    setIsEditing(false);
    setSegments(template.segments.map(s => ({...s, id: Math.random().toString(36).substr(2, 9)}))); 
    setActiveSegmentIndex(0);
    setTimeLeft(Math.floor(template.segments[0].durationMinutes * 60));
  };

  // --- Edit Logic ---
  const toggleEditMode = () => {
    if (isEditing) {
      // Save / Exit Edit Mode
      setIsEditing(false);
      // Ensure we reset to a valid state
      resetTimer();
    } else {
      // Enter Edit Mode - Pause timer
      setIsRunning(false);
      setIsEditing(true);
    }
  };

  const addSegment = () => {
    const newSeg: TimerSegment = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Segment',
      durationMinutes: 5,
      theme: 'indigo'
    };
    setSegments([...segments, newSeg]);
  };

  const removeSegment = (index: number) => {
    if (segments.length <= 1) return; // Prevent empty
    const newSegs = segments.filter((_, i) => i !== index);
    setSegments(newSegs);
  };

  const moveSegment = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === segments.length - 1) return;
    
    const newSegs = [...segments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSegs[index], newSegs[targetIndex]] = [newSegs[targetIndex], newSegs[index]];
    setSegments(newSegs);
  };

  const updateSegment = (index: number, updates: Partial<TimerSegment>) => {
    const newSegs = [...segments];
    newSegs[index] = { ...newSegs[index], ...updates };
    setSegments(newSegs);
  };

  // Helper to change minutes/seconds from edit inputs
  const handleTimeChange = (index: number, type: 'min' | 'sec', value: string) => {
    const val = parseInt(value) || 0;
    const currentTotalSec = Math.round(segments[index].durationMinutes * 60);
    const currentMin = Math.floor(currentTotalSec / 60);
    const currentSec = currentTotalSec % 60;
    
    let newTotalSec = 0;
    if (type === 'min') {
      newTotalSec = val * 60 + currentSec;
    } else {
      newTotalSec = currentMin * 60 + val;
    }
    
    updateSegment(index, { durationMinutes: newTotalSec / 60 });
  };

  const cycleTheme = (index: number) => {
    const currentTheme = segments[index].theme;
    const currentIndex = THEME_KEYS.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
    updateSegment(index, { theme: THEME_KEYS[nextIndex] });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Hourglass className="text-indigo-600" size={32} />
          {lang === 'JP' ? '集中・サイクルタイマー' : 'Focus Timer'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '区間ごとに好きな音楽を設定して、フロー状態へ。' : 'Set custom music for each segment and enter the flow.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Templates */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Templates</h3>
            <div className="flex flex-col gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => loadTemplate(t)}
                  className="text-left px-4 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 font-medium text-slate-700 transition-colors flex justify-between group text-sm"
                >
                  {t.name}
                  <Play size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
          
           {/* Global Alarm */}
           <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang==='JP'?'終了音':'Alarm Sound'}</h3>
             <div className="flex gap-2 items-center">
                 <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors text-slate-500 hover:text-rose-500">
                   <Bell size={18} />
                   <input type="file" accept="audio/*" onChange={handleGlobalAlarmChange} className="hidden" />
                 </label>
                 <span className="text-xs text-slate-500 truncate flex-1">{alarmName || 'Default (Beep)'}</span>
             </div>
           </div>
        </div>

        {/* Center: Main Timer */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            className={`
               p-8 md:p-12 rounded-3xl border shadow-xl flex flex-col items-center justify-center relative overflow-hidden h-[450px] transition-colors duration-500 ease-in-out
               ${currentThemeClass}
            `}
          >
             
             <div className="mb-8">
               <span className={`px-5 py-2 rounded-full bg-white/50 backdrop-blur font-bold text-base uppercase tracking-wide border border-white/20 shadow-sm`}>
                 {activeSegment?.name}
               </span>
             </div>

             <div className="text-[15vw] md:text-8xl font-black font-mono tracking-tighter mb-12 tabular-nums leading-none drop-shadow-sm">
               {formatTime(timeLeft)}
             </div>

             <div className="flex items-center gap-6">
               <button 
                 onClick={resetTimer}
                 disabled={isEditing}
                 className="w-16 h-16 rounded-full bg-white/40 text-current flex items-center justify-center hover:bg-white/60 transition-colors backdrop-blur-sm disabled:opacity-50"
               >
                 <RotateCcw size={24} />
               </button>

               <button 
                 onClick={toggleTimer}
                 disabled={isEditing}
                 className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:grayscale ${isRunning ? 'bg-white text-slate-900' : currentAccentClass}`}
               >
                 {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
               </button>

               <button 
                 onClick={nextSegment}
                 disabled={isEditing}
                 className="w-16 h-16 rounded-full bg-white/40 text-current flex items-center justify-center hover:bg-white/60 transition-colors backdrop-blur-sm disabled:opacity-50"
               >
                 <SkipForward size={24} fill="currentColor" />
               </button>
             </div>
             
             {isEditing && (
               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-center">
                   <Edit2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-800 mb-2">{lang==='JP'?'編集中...':'Editing...'}</h3>
                   <p className="text-slate-500 mb-4">{lang==='JP'?'右側のリストで区間を編集してください':'Edit segments in the list on the right'}</p>
                   <button onClick={toggleEditMode} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
                     {lang==='JP'?'編集完了':'Done'}
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right: Sequence List */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full flex flex-col">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-700">{lang==='JP'?'再生リスト':'Sequence'}</h3>
               <div className="flex gap-2">
                 {!isEditing && (
                    <button 
                        onClick={() => setIsLooping(!isLooping)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-colors ${isLooping ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-300'}`}
                    >
                        {lang==='JP'?'ループ':'Loop'} {isLooping ? 'ON' : 'OFF'}
                    </button>
                 )}
                 <button
                    onClick={toggleEditMode}
                    className={`p-1.5 rounded-lg border transition-colors ${isEditing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}
                    title="Edit Sequence"
                 >
                    {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
                 </button>
               </div>
             </div>
             
             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 flex-1">
               {segments.map((seg, i) => {
                 const isActive = i === activeSegmentIndex && !isEditing;
                 const themeAccent = THEME_ACCENTS[seg.theme].split(' ')[0]; // Extract bg-color
                 const totalSec = Math.round(seg.durationMinutes * 60);
                 const m = Math.floor(totalSec / 60);
                 const s = totalSec % 60;

                 if (isEditing) {
                   // --- EDIT MODE ROW ---
                   return (
                     <div key={seg.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                           {/* Theme Color Circle */}
                           <button 
                             onClick={() => cycleTheme(i)}
                             className={`w-6 h-6 rounded-full shrink-0 ${themeAccent} border-2 border-white shadow-sm ring-1 ring-slate-200 hover:scale-110 transition-transform`}
                             title="Change Color"
                           />
                           {/* Name Input */}
                           <input 
                             type="text" 
                             value={seg.name}
                             onChange={(e) => updateSegment(i, { name: e.target.value })}
                             className="flex-1 min-w-0 p-1.5 rounded-md border border-slate-200 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-200 outline-none"
                           />
                        </div>
                        
                        <div className="flex justify-between items-center gap-2">
                            {/* Duration Input */}
                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-md border border-slate-200">
                                <input 
                                  type="number" 
                                  min="0"
                                  value={m}
                                  onChange={(e) => handleTimeChange(i, 'min', e.target.value)}
                                  className="w-10 bg-transparent text-right font-mono text-sm outline-none"
                                /><span className="text-xs text-slate-400">m</span>
                                <span className="text-slate-300">:</span>
                                <input 
                                  type="number" 
                                  min="0"
                                  max="59"
                                  value={s}
                                  onChange={(e) => handleTimeChange(i, 'sec', e.target.value)}
                                  className="w-10 bg-transparent text-right font-mono text-sm outline-none"
                                /><span className="text-xs text-slate-400">s</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                                <button onClick={() => moveSegment(i, 'up')} disabled={i === 0} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded disabled:opacity-30">
                                   <ArrowUp size={14} />
                                </button>
                                <button onClick={() => moveSegment(i, 'down')} disabled={i === segments.length - 1} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded disabled:opacity-30">
                                   <ArrowDown size={14} />
                                </button>
                                <button onClick={() => removeSegment(i)} disabled={segments.length <= 1} className="p-1.5 text-rose-400 hover:bg-rose-50 rounded disabled:opacity-30">
                                   <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                     </div>
                   );
                 }

                 // --- VIEW MODE ROW ---
                 return (
                  <div 
                      key={seg.id} 
                      className={`
                        relative flex items-center justify-between p-3 rounded-xl border transition-all duration-300
                        ${isActive 
                          ? `bg-white border-slate-300 shadow-md ring-2 ring-offset-1 ring-slate-200 z-10 scale-[1.02]` 
                          : 'bg-white border-slate-200 opacity-60 hover:opacity-100'}
                      `}
                  >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? themeAccent + ' text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {i + 1}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-700 text-sm truncate">{seg.name}</span>
                          <span className="text-xs text-slate-400">{m}m {s}s</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* BGM Upload for Segment */}
                        <label className={`
                            cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                            ${seg.bgmSrc ? themeAccent + ' bg-opacity-10 text-slate-600' : 'bg-slate-100 text-slate-300 hover:text-slate-500'}
                        `}>
                            <Music size={14} />
                            <input type="file" accept="audio/*" onChange={(e) => handleSegmentBgmChange(i, e)} className="hidden" />
                        </label>
                      </div>
                  </div>
                 );
               })}

               {isEditing && (
                 <button 
                   onClick={addSegment}
                   className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                 >
                   <Plus size={18} /> {lang==='JP'?'追加':'Add Segment'}
                 </button>
               )}
             </div>
             
             {!isEditing && (
                <p className="text-[10px] text-slate-400 mt-4 text-center">
                {lang === 'JP' ? '音符アイコンをクリックしてBGMを設定' : 'Click note icon to set BGM'}
                </p>
             )}
          </div>
        </div>
      </div>

      {/* Audio Elements */}
      <audio ref={bgmRef} loop />
      <audio ref={alarmRef} src={alarmSrc || undefined} />
    </div>
  );
}