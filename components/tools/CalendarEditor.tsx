import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, Download, Image as ImageIcon, ChevronLeft, ChevronRight, Type } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export default function CalendarEditor({ lang }: Props) {
  const [date, setDate] = useState(new Date());
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [titleColor, setTitleColor] = useState('#1e293b');
  const [overlayOpacity, setOverlayOpacity] = useState(0.8);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const shiftMonth = (delta: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + delta);
    setDate(newDate);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBgImage(URL.createObjectURL(file));
    }
  };

  const handleDownload = async () => {
    if (!calendarRef.current) return;
    try {
        const dataUrl = await toPng(calendarRef.current, { pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `calendar-${date.getFullYear()}-${date.getMonth()+1}.png`;
        link.href = dataUrl;
        link.click();
    } catch (e) {
        console.error(e);
        alert(lang==='JP'?'画像の保存に失敗しました':'Failed to save image');
    }
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
       const isSunday = (firstDay + d - 1) % 7 === 0;
       const isSaturday = (firstDay + d - 1) % 7 === 6;
       let colorClass = 'text-slate-700';
       if (isSunday) colorClass = 'text-rose-500';
       if (isSaturday) colorClass = 'text-blue-500';

       days.push(
         <div key={d} className={`p-2 min-h-[80px] border-t border-slate-100 ${colorClass}`}>
            <span className="font-bold text-lg">{d}</span>
         </div>
       );
    }

    return days;
  };

  const weekDays = lang === 'JP' 
    ? ['日', '月', '火', '水', '木', '金', '土'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <CalendarIcon className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'カレンダー作成' : 'Calendar Editor'}
        </h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         
         {/* Settings */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'年月':'Month'}</label>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2">
                     <button onClick={() => shiftMonth(-1)} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronLeft size={20}/></button>
                     <span className="font-bold text-lg text-slate-700">
                        {date.getFullYear()} / {date.getMonth() + 1}
                     </span>
                     <button onClick={() => shiftMonth(1)} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronRight size={20}/></button>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'背景画像':'Background'}</label>
                  <div className="flex gap-2">
                     <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 p-3 rounded-xl border border-slate-200 border-dashed flex items-center justify-center gap-2 font-bold transition-colors">
                        <ImageIcon size={18} />
                        {bgImage ? (lang==='JP'?'変更':'Change') : (lang==='JP'?'選択':'Select')}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                     </label>
                     {bgImage && (
                        <button onClick={() => setBgImage(null)} className="px-3 rounded-xl bg-rose-50 text-rose-500 font-bold border border-rose-100 hover:bg-rose-100">✕</button>
                     )}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'文字色':'Text Color'}</label>
                  <div className="flex items-center gap-2">
                     <input type="color" value={titleColor} onChange={e => setTitleColor(e.target.value)} className="h-10 w-20 rounded cursor-pointer" />
                  </div>
               </div>
               
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'背景の透明度':'Overlay Opacity'}</label>
                  <input type="range" min="0" max="1" step="0.05" value={overlayOpacity} onChange={e => setOverlayOpacity(Number(e.target.value))} className="w-full accent-indigo-600" />
               </div>

               <button onClick={handleDownload} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2">
                  <Download size={20} /> {lang==='JP'?'画像を保存':'Save Image'}
               </button>
            </div>
         </div>

         {/* Preview */}
         <div className="lg:col-span-8">
            <div className="bg-slate-200 p-4 md:p-8 rounded-3xl shadow-inner flex justify-center overflow-auto">
               <div 
                  ref={calendarRef}
                  className="bg-white shadow-2xl relative overflow-hidden"
                  style={{ width: '800px', minHeight: '600px', aspectRatio: '4/3' }}
               >
                  {/* Background Layer */}
                  {bgImage && (
                     <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bgImage})` }}
                     />
                  )}
                  
                  {/* Overlay Layer */}
                  <div 
                     className="absolute inset-0 bg-white transition-opacity duration-300"
                     style={{ opacity: bgImage ? overlayOpacity : 1 }}
                  />

                  {/* Content Layer */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                     <div className="mb-6 flex justify-between items-end border-b-2 border-slate-900 pb-4" style={{ borderColor: titleColor }}>
                        <h1 className="text-6xl font-black tracking-tighter" style={{ color: titleColor }}>
                           {date.getMonth() + 1}
                           <span className="text-2xl font-medium ml-2 opacity-60">/ {date.getFullYear()}</span>
                        </h1>
                        <span className="text-sm font-bold opacity-50" style={{ color: titleColor }}>ToolPark.info</span>
                     </div>

                     <div className="grid grid-cols-7 mb-2 text-center">
                        {weekDays.map((d, i) => (
                           <div key={d} className={`font-bold text-sm py-2 ${i===0?'text-rose-500':i===6?'text-blue-500':'text-slate-500'}`}>
                              {d}
                           </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-7 flex-1">
                        {renderCalendar()}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}