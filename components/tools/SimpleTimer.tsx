import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Watch, Timer, Bell } from 'lucide-react';
import { Language } from '../../src/types';
import { playDefaultAlarm, unlockAudio } from '../../utils/audio';

interface Props {
  lang: Language;
}

type Mode = 'timer' | 'stopwatch';

export default function SimpleTimer({ lang }: Props) {
  const [mode, setMode] = useState<Mode>('timer');
  
  // --- Timer State ---
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(0); // Current countdown value
  const [initialTotal, setInitialTotal] = useState(0); // To show progress
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerInterval = useRef<number | null>(null);
  
  // --- Stopwatch State ---
  const [swTime, setSwTime] = useState(0); // ms
  const [isSwRunning, setIsSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swInterval = useRef<number | null>(null);
  const swStartTime = useRef<number>(0);
  const swAccumulated = useRef<number>(0);

  // Audio
  const [alarmSrc, setAlarmSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Timer Logic ---
  const startTimer = () => {
    // Unlock Audio Context on user interaction
    unlockAudio();

    let h = parseInt(hours) || 0;
    let m = parseInt(minutes) || 0;
    let s = parseInt(seconds) || 0;
    
    // If paused and resuming
    if (totalSeconds > 0 && !isTimerRunning && initialTotal > 0) {
      setIsTimerRunning(true);
      return;
    }

    const total = h * 3600 + m * 60 + s;
    if (total <= 0) return;

    setTotalSeconds(total);
    setInitialTotal(total);
    setIsTimerRunning(true);
  };

  const pauseTimer = () => setIsTimerRunning(false);
  
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTotalSeconds(0);
    setInitialTotal(0);
    audioRef.current?.pause();
    if(audioRef.current) audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (isTimerRunning && totalSeconds > 0) {
      timerInterval.current = window.setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current!);
            setIsTimerRunning(false);
            
            // Play Alarm
            if (alarmSrc && audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed", e));
            } else {
                playDefaultAlarm();
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); };
  }, [isTimerRunning, alarmSrc]);

  const setPreset = (min: number) => {
    resetTimer();
    setHours('0');
    setMinutes(min.toString());
    setSeconds('0');
  };

  // --- Stopwatch Logic ---
  const startSw = () => {
    if (!isSwRunning) {
      setIsSwRunning(true);
      swStartTime.current = Date.now();
      
      swInterval.current = window.setInterval(() => {
        const now = Date.now();
        const delta = now - swStartTime.current;
        setSwTime(swAccumulated.current + delta);
      }, 10);
    }
  };

  const stopSw = () => {
    if (isSwRunning) {
      setIsSwRunning(false);
      if (swInterval.current) clearInterval(swInterval.current);
      swAccumulated.current = swTime;
    }
  };

  const resetSw = () => {
    setIsSwRunning(false);
    if (swInterval.current) clearInterval(swInterval.current);
    setSwTime(0);
    swAccumulated.current = 0;
    setLaps([]);
  };

  const lapSw = () => {
    if (isSwRunning || swTime > 0) {
      setLaps([swTime, ...laps]);
    }
  };

  // --- Formatting ---
  const formatTimer = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const formatSw = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${cs.toString().padStart(2,'0')}`;
  };

  const handleAlarmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAlarmSrc(URL.createObjectURL(file));
  };

  // Calculate Progress Percent for Background
  const progressPercent = initialTotal > 0 ? (totalSeconds / initialTotal) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      
      {/* Tab Switch */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm inline-flex">
          <button 
             onClick={() => setMode('timer')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${mode==='timer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Timer size={18} /> {lang==='JP'?'タイマー':'Timer'}
          </button>
          <button 
             onClick={() => setMode('stopwatch')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${mode==='stopwatch' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Watch size={18} /> {lang==='JP'?'ストップウォッチ':'Stopwatch'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative min-h-[400px]">
         
         {/* Timer UI */}
         {mode === 'timer' && (
           <div className="relative w-full h-full flex flex-col items-center">
              
              {/* Background Progress Fill */}
              {initialTotal > 0 && (
                <div 
                  className="absolute bottom-0 left-0 w-full bg-indigo-50 transition-all duration-1000 ease-linear pointer-events-none"
                  style={{ height: `${progressPercent}%` }}
                />
              )}

              <div className="p-8 md:p-12 w-full flex flex-col items-center relative z-10">
                  {/* Display or Inputs */}
                  {(isTimerRunning || totalSeconds > 0) ? (
                    <div className="text-[15vw] md:text-9xl font-black text-slate-800 font-mono tracking-tighter mb-12 tabular-nums py-10 w-full text-center leading-none">
                      {formatTimer(totalSeconds)}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-2 mb-12 py-6 w-full max-w-full">
                        <div className="flex flex-col items-center w-[28%] sm:w-auto">
                          <input 
                            type="number" 
                            value={hours} 
                            onChange={e => setHours(e.target.value.slice(0,2))} 
                            placeholder="00"
                            className="w-full sm:w-24 md:w-32 p-2 sm:p-4 text-4xl sm:text-6xl md:text-7xl font-black text-center bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                          />
                          <span className="text-xs font-bold text-slate-400 mt-2">HR</span>
                        </div>
                        <span className="text-2xl sm:text-4xl font-bold text-slate-300">:</span>
                        <div className="flex flex-col items-center w-[28%] sm:w-auto">
                          <input 
                            type="number" 
                            value={minutes} 
                            onChange={e => setMinutes(e.target.value.slice(0,2))} 
                            placeholder="00"
                            className="w-full sm:w-24 md:w-32 p-2 sm:p-4 text-4xl sm:text-6xl md:text-7xl font-black text-center bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                          />
                          <span className="text-xs font-bold text-slate-400 mt-2">MIN</span>
                        </div>
                        <span className="text-2xl sm:text-4xl font-bold text-slate-300">:</span>
                        <div className="flex flex-col items-center w-[28%] sm:w-auto">
                          <input 
                            type="number" 
                            value={seconds} 
                            onChange={e => setSeconds(e.target.value.slice(0,2))} 
                            placeholder="00"
                            className="w-full sm:w-24 md:w-32 p-2 sm:p-4 text-4xl sm:text-6xl md:text-7xl font-black text-center bg-slate-50 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none"
                          />
                          <span className="text-xs font-bold text-slate-400 mt-2">SEC</span>
                        </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-6 mb-8">
                    <button 
                      onClick={isTimerRunning ? pauseTimer : startTimer}
                      className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isTimerRunning ? 'bg-amber-100 text-amber-600' : 'bg-indigo-600 text-white'}`}
                    >
                      {isTimerRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                    </button>
                    <button 
                      onClick={resetTimer}
                      className="w-24 h-24 rounded-full bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-600 shadow-sm"
                    >
                      <RotateCcw size={30} />
                    </button>
                  </div>

                  {/* Presets & Config */}
                  <div className="w-full pt-8 border-t border-slate-100/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                        {[3, 5, 10, 30].map(m => (
                          <button key={m} onClick={() => setPreset(m)} className="px-4 py-2 rounded-lg bg-white/80 border border-slate-200 text-slate-600 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
                            {m}m
                          </button>
                        ))}
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors bg-white/50 px-3 py-1 rounded-lg">
                        <Bell size={16} />
                        <span className="text-xs font-bold">{alarmSrc ? 'Custom Alarm Set' : 'Default Alarm'}</span>
                        <input type="file" accept="audio/*" className="hidden" onChange={handleAlarmUpload} />
                    </label>
                  </div>
              </div>
           </div>
         )}

         {/* Stopwatch UI */}
         {mode === 'stopwatch' && (
           <div className="p-8 md:p-12 flex flex-col items-center">
              <div className="text-[12vw] md:text-9xl font-black text-slate-800 font-mono tracking-tighter mb-12 tabular-nums py-10 w-full text-center leading-none">
                   {formatSw(swTime)}
              </div>

              <div className="flex gap-6 mb-12">
                 <button 
                   onClick={isSwRunning ? stopSw : startSw}
                   className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${isSwRunning ? 'bg-rose-100 text-rose-600' : 'bg-emerald-500 text-white'}`}
                 >
                   {isSwRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                 </button>
                 <button 
                   onClick={isSwRunning ? lapSw : resetSw}
                   className="w-24 h-24 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                 >
                   {isSwRunning ? <Flag size={30} /> : <RotateCcw size={30} />}
                 </button>
              </div>
              
              {/* Laps */}
              {laps.length > 0 && (
                <div className="w-full max-h-48 overflow-y-auto border-t border-slate-100 pt-4 px-4 space-y-2">
                  {laps.map((lap, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-mono text-slate-600 p-2 hover:bg-slate-50 rounded-lg">
                       <span className="text-slate-400">Lap {laps.length - i}</span>
                       <span className="font-bold text-slate-800">{formatSw(lap)}</span>
                    </div>
                  ))}
                </div>
              )}
           </div>
         )}

      </div>
      <audio ref={audioRef} src={alarmSrc || undefined} />
    </div>
  );
}