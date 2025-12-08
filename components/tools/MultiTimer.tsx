import React, { useState, useEffect, useRef } from 'react';
import { Layers, Plus, Trash2, Play, Pause, RotateCcw, Music, Bell, Volume2, VolumeX } from 'lucide-react';
import { Language } from '../../types';
import { playDefaultAlarm, unlockAudio } from '../../utils/audio';

interface Props {
  lang: Language;
}

interface TimerInstance {
  id: number;
  name: string;
  initialDuration: number;
  remaining: number;
  isRunning: boolean;
  isFinished: boolean;
}

export default function MultiTimer({ lang }: Props) {
  const [timers, setTimers] = useState<TimerInstance[]>([
    { id: 1, name: 'Pasta', initialDuration: 600, remaining: 600, isRunning: false, isFinished: false },
    { id: 2, name: 'Sauce', initialDuration: 300, remaining: 300, isRunning: false, isFinished: false },
  ]);
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerMin, setNewTimerMin] = useState('');

  // Audio State (Global for simplicity in multi-timer)
  const [bgmSrc, setBgmSrc] = useState<string | null>(null);
  const [alarmSrc, setAlarmSrc] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const alarmRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);

  // --- Audio Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'bgm' | 'alarm') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'bgm') setBgmSrc(url);
      else setAlarmSrc(url);
    }
  };

  // --- Global Interval ---
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimers(prevTimers => {
        let anyRunning = false;
        let justFinished = false;

        const nextTimers = prevTimers.map(t => {
          if (t.isRunning && t.remaining > 0) {
            anyRunning = true;
            const nextVal = t.remaining - 1;
            if (nextVal === 0) justFinished = true;
            return { ...t, remaining: nextVal, isFinished: nextVal === 0, isRunning: nextVal > 0 };
          }
          return t;
        });

        // Handle Audio Playback
        if (!isMuted) {
          if (anyRunning) bgmRef.current?.play().catch(() => {});
          else bgmRef.current?.pause();

          if (justFinished) {
              if (alarmSrc && alarmRef.current) {
                  alarmRef.current.play().catch(() => {});
              } else {
                  playDefaultAlarm();
              }
          }
        } else {
           bgmRef.current?.pause();
        }

        return nextTimers;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMuted, alarmSrc]);

  // --- Actions ---
  const addTimer = () => {
    const min = parseInt(newTimerMin) || 5;
    const newId = Math.max(0, ...timers.map(t => t.id)) + 1;
    setTimers([...timers, {
      id: newId,
      name: newTimerName || `Timer ${newId}`,
      initialDuration: min * 60,
      remaining: min * 60,
      isRunning: false,
      isFinished: false
    }]);
    setNewTimerName('');
    setNewTimerMin('');
  };

  const removeTimer = (id: number) => {
    setTimers(timers.filter(t => t.id !== id));
  };

  const toggleTimer = (id: number) => {
    // Attempt unlock
    unlockAudio();

    setTimers(timers.map(t => {
      if (t.id === id) {
        if (t.isFinished) return { ...t, remaining: t.initialDuration, isFinished: false, isRunning: true };
        return { ...t, isRunning: !t.isRunning };
      }
      return t;
    }));
  };

  const resetTimer = (id: number) => {
    setTimers(timers.map(t => {
      if (t.id === id) return { ...t, remaining: t.initialDuration, isRunning: false, isFinished: false };
      return t;
    }));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Layers className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'マルチタイマー' : 'Multi Timer'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '複数のタイマーを並行稼働。料理や並行作業に。' : 'Run concurrent timers. Perfect for cooking or multitasking.'}
        </p>
      </div>

      {/* Global Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1">
               <input 
                 type="text" 
                 value={newTimerName} 
                 onChange={e => setNewTimerName(e.target.value)} 
                 placeholder="Name (e.g. Pasta)" 
                 className="w-full p-2 border border-slate-200 rounded-lg text-sm"
               />
            </div>
            <div className="w-20">
               <input 
                 type="number" 
                 value={newTimerMin} 
                 onChange={e => setNewTimerMin(e.target.value)} 
                 placeholder="Min" 
                 className="w-full p-2 border border-slate-200 rounded-lg text-sm"
               />
            </div>
            <button onClick={addTimer} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
               <Plus size={20} />
            </button>
         </div>

         <div className="flex gap-4 items-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
               <Music size={16} className="text-slate-400" />
               <input type="file" accept="audio/*" onChange={e => handleFileChange(e, 'bgm')} className="w-20 text-xs text-slate-500" />
            </div>
            <div className="flex items-center gap-2">
               <Bell size={16} className="text-slate-400" />
               <input type="file" accept="audio/*" onChange={e => handleFileChange(e, 'alarm')} className="w-20 text-xs text-slate-500" />
            </div>
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
         </div>
      </div>

      {/* Timers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {timers.map(timer => (
           <div 
             key={timer.id} 
             className={`
                relative p-6 rounded-3xl border transition-all duration-300
                ${timer.isFinished 
                    ? 'bg-rose-50 border-rose-200 shadow-xl shadow-rose-100 scale-105' 
                    : timer.isRunning 
                        ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-200' 
                        : 'bg-white border-slate-200 shadow-sm'
                }
             `}
           >
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-800">{timer.name}</h3>
                <button onClick={() => removeTimer(timer.id)} className="text-slate-300 hover:text-rose-500">
                   <Trash2 size={16} />
                </button>
             </div>

             <div className={`text-6xl font-mono font-black mb-6 tabular-nums tracking-tighter text-center ${timer.isFinished ? 'text-rose-600 animate-pulse' : timer.isRunning ? 'text-indigo-900' : 'text-slate-700'}`}>
                {formatTime(timer.remaining)}
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => toggleTimer(timer.id)}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${timer.isRunning ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {timer.isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  {timer.isRunning ? 'Pause' : 'Start'}
                </button>
                <button 
                  onClick={() => resetTimer(timer.id)}
                  className="w-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                >
                  <RotateCcw size={18} />
                </button>
             </div>
           </div>
         ))}
      </div>

      <audio ref={bgmRef} src={bgmSrc || undefined} loop />
      <audio ref={alarmRef} src={alarmSrc || undefined} />
    </div>
  );
}