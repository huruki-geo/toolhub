import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Music, Bell, Hourglass, SkipForward } from 'lucide-react';
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
      { id: '1', name: 'High Intensity', durationMinutes: 0.35, theme: 'rose' }, // 20s
      { id: '2', name: 'Low Intensity', durationMinutes: 0.17, theme: 'emerald' }  // 10s
    ] 
  },
];

export default function FocusTimer({ lang }: Props) {
  const [segments, setSegments] = useState<TimerSegment[]>(TEMPLATES[0].segments);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(segments[0].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  // Audio State
  const [alarmSrc, setAlarmSrc] = useState<string | null>(null);
  const [alarmName, setAlarmName] = useState<string>('');
  const [isLooping, setIsLooping] = useState(true);

  const bgmRef = useRef<HTMLAudioElement>(null);
  const alarmRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  const activeSegment = segments[activeSegmentIndex];
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
    if (bgmRef.current) {
        if (activeSeg.bgmSrc) {
             // Only update src if it changed to avoid restart
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
            bgmRef.current.src = "";
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
      // Timer finished current segment
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
         setTimeLeft(segments[nextIndex].durationMinutes * 60);
      } else {
         if (activeSegmentIndex < segments.length - 1) {
             const nextIndex = activeSegmentIndex + 1;
             setActiveSegmentIndex(nextIndex);
             setTimeLeft(segments[nextIndex].durationMinutes * 60);
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
    setTimeLeft(segments[0].durationMinutes * 60);
    if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
    }
  };

  const loadTemplate = (template: typeof TEMPLATES[0]) => {
    setIsRunning(false);
    // Deep copy to allow editing without affecting original template refs
    setSegments(template.segments.map(s => ({...s}))); 
    setActiveSegmentIndex(0);
    setTimeLeft(template.segments[0].durationMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
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
                 className="w-16 h-16 rounded-full bg-white/40 text-current flex items-center justify-center hover:bg-white/60 transition-colors backdrop-blur-sm"
               >
                 <RotateCcw size={24} />
               </button>

               <button 
                 onClick={toggleTimer}
                 className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${isRunning ? 'bg-white text-slate-900' : currentAccentClass}`}
               >
                 {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
               </button>

               <button 
                 onClick={nextSegment}
                 className="w-16 h-16 rounded-full bg-white/40 text-current flex items-center justify-center hover:bg-white/60 transition-colors backdrop-blur-sm"
               >
                 <SkipForward size={24} fill="currentColor" />
               </button>
             </div>
          </div>
        </div>

        {/* Right: Sequence List */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-700">{lang==='JP'?'再生リスト':'Sequence'}</h3>
               <button 
                 onClick={() => setIsLooping(!isLooping)}
                 className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-colors ${isLooping ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-300'}`}
               >
                 {lang==='JP'?'ループ':'Loop'} {isLooping ? 'ON' : 'OFF'}
               </button>
             </div>
             
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
               {segments.map((seg, i) => {
                 const isActive = i === activeSegmentIndex;
                 const themeAccent = THEME_ACCENTS[seg.theme].split(' ')[0]; // Extract bg-color
                 return (
                  <div 
                      key={i} 
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
                          <span className="text-xs text-slate-400">{seg.durationMinutes < 1 ? Math.round(seg.durationMinutes*60) + 's' : seg.durationMinutes + 'm'}</span>
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
             </div>
             <p className="text-[10px] text-slate-400 mt-4 text-center">
               {lang === 'JP' ? '音符アイコンをクリックしてBGMを設定' : 'Click note icon to set BGM'}
             </p>
          </div>
        </div>
      </div>

      {/* Audio Elements */}
      <audio ref={bgmRef} loop />
      <audio ref={alarmRef} src={alarmSrc || undefined} />
    </div>
  );
}