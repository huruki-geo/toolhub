import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Trophy, ChevronLeft, ChevronRight, ListTodo, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

interface Habit {
  id: number;
  name: string;
  completedDates: string[]; // ISO Date strings 'YYYY-MM-DD'
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type Tab = 'habits' | 'tasks';

export default function HabitPal({ lang }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('habits');
  
  // --- Habit State ---
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [viewDate, setViewDate] = useState(new Date()); // Reference date for the view

  // --- Task State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // --- Persistence ---
  useEffect(() => {
    const savedHabits = localStorage.getItem('habit-pal-data');
    if (savedHabits) {
      try { setHabits(JSON.parse(savedHabits)); } catch (e) { console.error(e); }
    } else {
      setHabits([
        { id: 1, name: lang === 'JP' ? '水を2L飲む' : 'Drink 2L Water', completedDates: [] },
        { id: 2, name: lang === 'JP' ? '読書 15分' : 'Read 15min', completedDates: [] }
      ]);
    }

    const savedTasks = localStorage.getItem('habit-pal-tasks');
    if (savedTasks) {
      try { setTasks(JSON.parse(savedTasks)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habit-pal-data', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habit-pal-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Habit Logic ---
  const addHabit = () => {
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitName, completedDates: [] }]);
    setNewHabitName('');
  };

  const removeHabit = (id: number) => {
    if (confirm(lang==='JP'?'削除しますか？':'Delete this habit?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const toggleDate = (habitId: number, dateStr: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const exists = h.completedDates.includes(dateStr);
        const newDates = exists 
          ? h.completedDates.filter(d => d !== dateStr)
          : [...h.completedDates, dateStr];
        return { ...h, completedDates: newDates };
      }
      return h;
    }));
  };

  // Week Navigation
  const shiftWeek = (days: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + days);
    setViewDate(newDate);
  };

  const resetToToday = () => {
    setViewDate(new Date());
  };

  const getDisplayDays = () => {
    const days = [];
    // Generate 7 days ending at viewDate (or centered? Let's do ending at viewDate to show "Past week")
    // Let's make it fixed 7 days ending with viewDate. 
    // To make it behave like "Weekly view", usually we show [ViewDate - 6] to [ViewDate].
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(viewDate);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const displayDays = getDisplayDays();
  const todayStr = new Date().toISOString().split('T')[0];

  // --- Task Logic ---
  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearCompletedTasks = () => {
    if(confirm(lang==='JP'?'完了したタスクを削除しますか？':'Clear completed tasks?')) {
      setTasks(tasks.filter(t => !t.completed));
    }
  };

  const activeTaskCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <CheckSquare className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'Habit & Task' : 'Habit & Task'}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
          <button 
            onClick={() => setActiveTab('habits')}
            className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'habits' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Calendar size={16} />
            {lang === 'JP' ? '習慣ログ' : 'Habits'}
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListTodo size={16} />
            {lang === 'JP' ? 'タスクメモ' : 'Tasks'}
            {activeTaskCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeTaskCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8 min-h-[500px]">
        
        {/* HABITS TAB */}
        {activeTab === 'habits' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Week Navigation */}
            <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-2xl">
              <button onClick={() => shiftWeek(-7)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500">
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-opacity" onClick={resetToToday}>
                <span className="text-sm font-bold text-slate-700">
                  {displayDays[0].toLocaleDateString(lang==='JP'?'ja-JP':'en-US', {month:'short', day:'numeric'})} - {displayDays[6].toLocaleDateString(lang==='JP'?'ja-JP':'en-US', {month:'short', day:'numeric'})}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {viewDate.toDateString() === new Date().toDateString() ? (lang==='JP'?'(今週)':'(Current)') : (lang==='JP'?'(過去ログ)':'(History)')}
                </span>
              </div>

              <button onClick={() => shiftWeek(7)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-500">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Add Bar */}
            <div className="flex gap-3 mb-8">
              <input 
                type="text" 
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addHabit()}
                placeholder={lang === 'JP' ? '新しい習慣を入力...' : 'New habit...'}
                className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button onClick={addHabit} className="bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                <Plus size={20} />
              </button>
            </div>

            {/* Header Dates */}
            <div className="flex mb-4 items-end pl-2">
              <div className="flex-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{lang === 'JP' ? '項目' : 'Habit'}</div>
              <div className="flex gap-1 md:gap-2">
                {displayDays.map((d, i) => {
                  const dStr = d.toISOString().split('T')[0];
                  const isToday = dStr === todayStr;
                  return (
                    <div key={i} className="w-8 md:w-10 text-center">
                      <div className={`text-[10px] font-bold mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {d.toLocaleDateString(lang === 'JP'?'ja-JP':'en-US', { weekday: 'narrow' })}
                      </div>
                      <div className={`text-xs ${isToday ? 'text-indigo-600 font-bold bg-indigo-50 rounded-md py-1' : 'text-slate-500'}`}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-8"></div>
            </div>

            {/* Habit Rows */}
            <div className="space-y-3">
              {habits.map(habit => {
                 const streak = habit.completedDates.length; 
                 return (
                   <div key={habit.id} className="flex items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                      <div className="flex-1 min-w-0 pr-2">
                         <div className="font-bold text-slate-700 truncate text-sm">{habit.name}</div>
                         <div className="flex items-center gap-1 mt-1">
                            <Trophy size={10} className="text-amber-500" />
                            <span className="text-[10px] text-slate-400">{streak} total</span>
                         </div>
                      </div>
                      
                      <div className="flex gap-1 md:gap-2">
                        {displayDays.map((d, i) => {
                          const dateStr = d.toISOString().split('T')[0];
                          const isCompleted = habit.completedDates.includes(dateStr);
                          return (
                            <button
                              key={i}
                              onClick={() => toggleDate(habit.id, dateStr)}
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                isCompleted 
                                  ? 'bg-indigo-500 text-white shadow-md scale-100' 
                                  : 'bg-white border border-slate-200 text-transparent hover:border-indigo-300 scale-95'
                              }`}
                            >
                              <CheckSquare size={16} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-8 flex justify-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => removeHabit(habit.id)} className="text-slate-300 hover:text-rose-500 p-1">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                 );
              })}

              {habits.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic text-sm">
                   {lang === 'JP' ? '習慣を追加してスタートしましょう！' : 'Add a habit to get started!'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
             
             {/* Add Task */}
             <div className="flex gap-3 mb-8">
               <div className="relative flex-1">
                 <input 
                  type="text" 
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder={lang === 'JP' ? '新しいタスク...' : 'New task...'}
                  className="w-full p-3 pl-10 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                 />
                 <ListTodo className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               </div>
               <button onClick={addTask} className="bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                 <Plus size={20} />
               </button>
             </div>

             {/* Task List */}
             <div className="space-y-2">
                {tasks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                     <p className="text-slate-400 font-bold mb-1">{lang==='JP'?'タスクはありません':'No Tasks'}</p>
                     <p className="text-slate-300 text-xs">{lang==='JP'?'頭の中を整理しましょう':'Clear your mind'}</p>
                  </div>
                )}

                {/* Incomplete Tasks */}
                {tasks.filter(t => !t.completed).map(task => (
                   <div key={task.id} className="group flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 transition-all">
                      <button onClick={() => toggleTask(task.id)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                        <Circle size={24} />
                      </button>
                      <span className="flex-1 font-bold text-slate-700 break-all">{task.text}</span>
                      <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-2">
                        <Trash2 size={18} />
                      </button>
                   </div>
                ))}

                {/* Completed Tasks */}
                {tasks.some(t => t.completed) && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang==='JP'?'完了済み':'Completed'}</h3>
                      <button onClick={clearCompletedTasks} className="text-xs text-rose-400 hover:text-rose-600 font-bold">
                        {lang==='JP'?'完了を削除':'Clear All'}
                      </button>
                    </div>
                    <div className="space-y-2 opacity-60">
                      {tasks.filter(t => t.completed).map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <button onClick={() => toggleTask(task.id)} className="text-emerald-500">
                              <CheckCircle2 size={24} />
                            </button>
                            <span className="flex-1 font-medium text-slate-500 line-through decoration-slate-300 break-all">{task.text}</span>
                            <button onClick={() => removeTask(task.id)} className="text-slate-300 hover:text-rose-500 p-2">
                              <Trash2 size={16} />
                            </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}