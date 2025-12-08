import { useState, useRef } from 'react';
import { StretchHorizontal, Plus, Trash2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

interface Task {
  id: string;
  name: string;
  start: number; // relative day offset (0-30)
  duration: number; // days
  color: string;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function GanttChart({ lang }: Props) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Planning', start: 0, duration: 3, color: COLORS[0] },
    { id: '2', name: 'Design', start: 3, duration: 5, color: COLORS[1] },
    { id: '3', name: 'Development', start: 8, duration: 10, color: COLORS[2] },
  ]);
  const [chartTitle, setChartTitle] = useState('Project Timeline');
  const chartRef = useRef<HTMLDivElement>(null);

  const addTask = () => {
    const lastTask = tasks[tasks.length - 1];
    const newStart = lastTask ? lastTask.start + lastTask.duration : 0;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Task',
      start: newStart,
      duration: 3,
      color: COLORS[tasks.length % COLORS.length]
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `gantt-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert('Error saving image');
    }
  };

  const totalDays = Math.max(20, ...tasks.map(t => t.start + t.duration + 2));

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <StretchHorizontal className="text-indigo-600" size={32} />
          {lang === 'JP' ? '超軽量ガントチャート' : 'Lightweight Gantt'}
        </h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="mb-4">
               <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{lang==='JP'?'タイトル':'Project Title'}</label>
               <input 
                 type="text" 
                 value={chartTitle}
                 onChange={e => setChartTitle(e.target.value)}
                 className="w-full p-2 border border-slate-200 rounded-lg font-bold"
               />
             </div>
             
             <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {tasks.map((task, i) => (
                   <div key={task.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-400">Task {i+1}</span>
                         <button onClick={() => removeTask(task.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                      <input 
                        type="text" 
                        value={task.name} 
                        onChange={e => updateTask(task.id, { name: e.target.value })}
                        className="w-full p-1.5 text-sm border border-slate-200 rounded bg-white mb-2"
                        placeholder="Task name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-[10px] text-slate-400 block">{lang==='JP'?'開始日':'Start'}</label>
                            <input type="number" value={task.start} onChange={e => updateTask(task.id, { start: Number(e.target.value) })} className="w-full p-1 text-sm rounded border border-slate-200" />
                         </div>
                         <div>
                            <label className="text-[10px] text-slate-400 block">{lang==='JP'?'期間(日)':'Duration'}</label>
                            <input type="number" min="1" value={task.duration} onChange={e => updateTask(task.id, { duration: Number(e.target.value) })} className="w-full p-1 text-sm rounded border border-slate-200" />
                         </div>
                      </div>
                      <div className="flex gap-1 mt-1">
                         {COLORS.map(c => (
                            <button 
                               key={c}
                               onClick={() => updateTask(task.id, { color: c })}
                               className={`w-4 h-4 rounded-full ${task.color === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                               style={{ backgroundColor: c }}
                            />
                         ))}
                      </div>
                   </div>
                ))}
                <button onClick={addTask} className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 flex justify-center items-center gap-2">
                   <Plus size={16} /> {lang==='JP'?'タスク追加':'Add Task'}
                </button>
             </div>
           </div>
        </div>

        {/* Chart View */}
        <div className="lg:col-span-8 space-y-4">
           <div className="bg-slate-100 p-4 md:p-8 rounded-3xl overflow-auto border border-slate-200 shadow-inner">
               <div ref={chartRef} className="bg-white p-8 rounded-xl shadow-lg min-w-[600px]">
                   <h2 className="text-2xl font-bold text-slate-800 mb-6">{chartTitle}</h2>
                   
                   <div className="relative border-l border-b border-slate-200" style={{ minHeight: `${tasks.length * 50 + 50}px` }}>
                       {/* Grid Lines */}
                       {Array.from({ length: totalDays }).map((_, i) => (
                           <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100 text-[10px] text-slate-400 pt-1" style={{ left: `${(i / totalDays) * 100}%`, width: `${100/totalDays}%` }}>
                              {i % 5 === 0 && <span className="pl-1">{i}</span>}
                           </div>
                       ))}

                       {/* Bars */}
                       {tasks.map((task, i) => {
                          const left = (task.start / totalDays) * 100;
                          const width = (task.duration / totalDays) * 100;
                          return (
                             <div 
                                key={task.id}
                                className="absolute h-8 rounded-md flex items-center px-2 text-white text-xs font-bold whitespace-nowrap overflow-hidden shadow-sm"
                                style={{
                                    top: `${i * 50 + 20}px`,
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    backgroundColor: task.color
                                }}
                             >
                                 {task.name}
                             </div>
                          );
                       })}
                   </div>
               </div>
           </div>
           
           <div className="flex justify-end">
              <button onClick={handleDownload} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800">
                 <Download size={18} /> {lang==='JP'?'画像を保存':'Download Chart'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}