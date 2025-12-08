import React, { useState, useRef, useEffect } from 'react';
import { Activity, Flame, ChevronRight, Scale, Heart, Droplets, Image as ImageIcon, Info } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export const CalorieCheckerComponent: React.FC<Props> = ({ lang }) => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState(1.375);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    title: lang === 'JP' ? '健康・体組成計算機' : 'Health & Body Calculator',
    desc: lang === 'JP' 
      ? 'BMI、適正体重、基礎代謝などを一括計算し、あなたの健康状態を可視化します。' 
      : 'Comprehensive calculator for BMI, Ideal Weight, BMR, and daily calorie needs.',
    gender: lang === 'JP' ? '性別' : 'Gender',
    male: lang === 'JP' ? '男性' : 'Male',
    female: lang === 'JP' ? '女性' : 'Female',
    age: lang === 'JP' ? '年齢' : 'Age',
    height: lang === 'JP' ? '身長 (cm)' : 'Height (cm)',
    weight: lang === 'JP' ? '体重 (kg)' : 'Weight (kg)',
    activity: lang === 'JP' ? '活動レベル' : 'Activity Level',
    act1: lang === 'JP' ? 'ほぼ運動しない (デスクワーク)' : 'Sedentary (Office job)',
    act2: lang === 'JP' ? '軽い運動 (週1-3回)' : 'Light Exercise (1-3 days/week)',
    act3: lang === 'JP' ? '中程度の運動 (週3-5回)' : 'Moderate Exercise (3-5 days/week)',
    act4: lang === 'JP' ? '激しい運動 (週6-7回)' : 'Heavy Exercise (6-7 days/week)',
    
    // Results
    bmiLabel: 'BMI',
    bmiStatus: {
      under: lang === 'JP' ? '低体重 (痩せ)' : 'Underweight',
      normal: lang === 'JP' ? '普通体重' : 'Normal',
      over: lang === 'JP' ? '過体重 (太り気味)' : 'Overweight',
      obese: lang === 'JP' ? '肥満' : 'Obese',
    },
    idealW: lang === 'JP' ? '適正体重' : 'Ideal Weight',
    beautyW: lang === 'JP' ? '美容体重' : 'Beauty Weight',
    bmr: lang === 'JP' ? '基礎代謝 (BMR)' : 'BMR',
    tdee: lang === 'JP' ? '総消費カロリー (TDEE)' : 'TDEE',
    water: lang === 'JP' ? '水分摂取目安' : 'Daily Water',
    save: lang === 'JP' ? 'レポートを保存' : 'Save Report',
    unitKg: 'kg',
    unitKcal: 'kcal',
    unitMl: 'ml',
  };

  // --- Calculations ---
  const calculate = () => {
    // 1. BMI
    const hM = height / 100;
    const bmi = weight / (hM * hM);
    let bmiStatus = t.bmiStatus.normal;
    let bmiColor = '#10b981'; // Green

    if (bmi < 18.5) {
      bmiStatus = t.bmiStatus.under;
      bmiColor = '#3b82f6'; // Blue
    } else if (bmi >= 25 && bmi < 30) {
      bmiStatus = t.bmiStatus.over;
      bmiColor = '#f59e0b'; // Orange
    } else if (bmi >= 30) {
      bmiStatus = t.bmiStatus.obese;
      bmiColor = '#ef4444'; // Red
    }

    // 2. Weights
    const idealWeight = 22 * (hM * hM);
    const beautyWeight = 20 * (hM * hM);

    // 3. BMR (Mifflin-St Jeor)
    let bmrVal = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmrVal += 5;
    } else {
      bmrVal -= 161;
    }

    // 4. TDEE
    const tdeeVal = bmrVal * activity;

    // 5. Water (Approx 30-35ml per kg)
    const waterVal = weight * 33;

    return {
      bmi: bmi.toFixed(1),
      bmiStatus,
      bmiColor,
      idealWeight: idealWeight.toFixed(1),
      beautyWeight: beautyWeight.toFixed(1),
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal),
      water: Math.round(waterVal)
    };
  };

  const results = calculate();

  // --- Image Generation ---
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas Setup
    const width = 800;
    const height = 1000;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header
    const headerH = 120;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, headerH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Health Report', width / 2, 60);
    
    // Explicit Date Formatting
    const now = new Date();
    const dateStr = now.toLocaleDateString(lang === 'JP' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText(dateStr, width / 2, 95);

    // Profile Section
    const pTop = 160;
    ctx.fillStyle = '#f1f5f9';
    ctx.roundRect(50, pTop, width - 100, 100, 20);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const genderText = gender === 'male' ? t.male : t.female;
    ctx.fillText(`${genderText} / ${age}${lang==='JP'?'歳':'y'} / ${height}cm / ${weight}kg`, width/2, pTop + 60);

    // Main Metrics Grid
    const drawCard = (title: string, value: string, sub: string, x: number, y: number, w: number, color: string) => {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        ctx.beginPath();
        ctx.roundRect(x, y, w, 160, 20);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Colored Header Line
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, w, 10, [20, 20, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + w/2, y + 50);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 48px "Inter", sans-serif';
        ctx.fillText(value, x + w/2, y + 100);

        ctx.fillStyle = color;
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText(sub, x + w/2, y + 135);
    };

    const gridY = 300;
    const gap = 40;
    const cardW = (width - 100 - gap) / 2;

    // BMI
    drawCard('BMI', results.bmi, results.bmiStatus, 50, gridY, cardW, results.bmiColor);
    
    // Ideal Weight
    drawCard(t.idealW, results.idealWeight + 'kg', `Beauty: ${results.beautyWeight}kg`, 50 + cardW + gap, gridY, cardW, '#10b981');

    // TDEE
    drawCard(t.tdee, results.tdee + '', 'kcal / day', 50, gridY + 160 + gap, cardW, '#f59e0b');

    // BMR
    drawCard(t.bmr, results.bmr + '', 'kcal / day', 50 + cardW + gap, gridY + 160 + gap, cardW, '#6366f1');

    // Footer / Advice
    const fTop = 750;
    ctx.fillStyle = '#f8fafc';
    ctx.roundRect(50, fTop, width - 100, 180, 20);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(lang === 'JP' ? '💡 健康メモ' : '💡 Health Note', 80, fTop + 50);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '20px "Inter", sans-serif';
    const lineH = 35;
    ctx.fillText(lang === 'JP' ? `・1日の水分目安: 約 ${results.water} ml` : `・Daily Water Intake: ~${results.water} ml`, 80, fTop + 90);
    ctx.fillText(lang === 'JP' ? `・ダイエット目安: ${Math.round(results.tdee * 0.8)} kcal` : `・Fat Loss Target: ${Math.round(results.tdee * 0.8)} kcal`, 80, fTop + 90 + lineH);
    ctx.fillText(lang === 'JP' ? `・増量目安: ${Math.round(results.tdee * 1.15)} kcal` : `・Muscle Gain Target: ${Math.round(results.tdee * 1.15)} kcal`, 80, fTop + 90 + lineH*2);

    // Save
    const safeDate = dateStr.replace(/[\/:]/g, '-');
    const link = document.createElement('a');
    link.download = `health-report-${safeDate}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Activity className="text-indigo-600" size={40} />
          {t.title}
        </h2>
        <p className="text-lg text-slate-600">{t.desc}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
             
             {/* Gender */}
             <div className="mb-6">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.gender}</label>
               <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                 <button 
                   onClick={() => setGender('male')}
                   className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${gender === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {t.male}
                 </button>
                 <button 
                   onClick={() => setGender('female')}
                   className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${gender === 'female' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {t.female}
                 </button>
               </div>
             </div>

             {/* Stats Inputs */}
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.age}</label>
                  <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.height}</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.weight}</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.activity}</label>
                  <select 
                    value={activity} 
                    onChange={(e) => setActivity(parseFloat(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-sm"
                  >
                    <option value={1.2}>{t.act1}</option>
                    <option value={1.375}>{t.act2}</option>
                    <option value={1.55}>{t.act3}</option>
                    <option value={1.725}>{t.act4}</option>
                  </select>
               </div>
             </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BMI Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Scale size={20}/></div>
                 <span className="font-bold text-slate-600">{t.bmiLabel}</span>
               </div>
               <div className="text-center my-4">
                  <span className="text-5xl font-black text-slate-800">{results.bmi}</span>
                  <div 
                    className="mt-2 text-sm font-bold px-3 py-1 rounded-full inline-block text-white"
                    style={{ backgroundColor: results.bmiColor }}
                  >
                    {results.bmiStatus}
                  </div>
               </div>
            </div>

            {/* Ideal Weight Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Heart size={20}/></div>
                 <span className="font-bold text-slate-600">{t.idealW}</span>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                     <span className="text-slate-500 text-sm">{t.idealW}</span>
                     <span className="text-2xl font-bold text-slate-800">{results.idealWeight} <small className="text-slate-400 text-sm">kg</small></span>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-slate-500 text-sm">{t.beautyW}</span>
                     <span className="text-2xl font-bold text-pink-500">{results.beautyWeight} <small className="text-pink-300 text-sm">kg</small></span>
                  </div>
               </div>
            </div>

            {/* Calories Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                 <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><Flame size={20}/></div>
                 <span className="font-bold text-slate-600">Daily Calories</span>
               </div>
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="relative overflow-hidden rounded-2xl bg-amber-50 p-4 border border-amber-100">
                    <span className="text-xs font-bold text-amber-500 uppercase block mb-1">{t.tdee}</span>
                    <span className="text-4xl font-black text-amber-600">{results.tdee}</span>
                    <span className="text-sm text-amber-400 ml-1">kcal</span>
                    <p className="text-xs text-amber-500/70 mt-1">Maintenance Level</p>
                 </div>
                 <div className="relative overflow-hidden rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-500 uppercase block mb-1">{t.bmr}</span>
                    <span className="text-4xl font-black text-indigo-600">{results.bmr}</span>
                    <span className="text-sm text-indigo-400 ml-1">kcal</span>
                    <p className="text-xs text-indigo-500/70 mt-1">Basal Metabolism</p>
                 </div>
               </div>
            </div>
            
            {/* Water Card */}
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 md:col-span-2">
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-full bg-cyan-50 text-cyan-600"><Droplets size={24}/></div>
                 <div>
                    <span className="font-bold text-slate-600 block text-sm">{t.water}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-cyan-600">{results.water}</span>
                      <span className="text-slate-400 font-bold">ml</span>
                    </div>
                 </div>
                 <div className="ml-auto flex items-center gap-2">
                    <button 
                      onClick={handleDownload}
                      className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                    >
                      <ImageIcon size={18} />
                      {t.save}
                    </button>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Hidden Canvas */}
      <div className="hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default CalorieCheckerComponent;