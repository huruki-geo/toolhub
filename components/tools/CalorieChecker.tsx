import React, { useState, useRef } from 'react';
import { Activity, Flame, Scale, Heart, Droplets, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
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
  
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    let bmiBg = 'bg-emerald-500';

    if (bmi < 18.5) {
      bmiStatus = t.bmiStatus.under;
      bmiColor = '#3b82f6'; // Blue
      bmiBg = 'bg-blue-500';
    } else if (bmi >= 25 && bmi < 30) {
      bmiStatus = t.bmiStatus.over;
      bmiColor = '#f59e0b'; // Orange
      bmiBg = 'bg-amber-500';
    } else if (bmi >= 30) {
      bmiStatus = t.bmiStatus.obese;
      bmiColor = '#ef4444'; // Red
      bmiBg = 'bg-rose-500';
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
      bmiBg,
      idealWeight: idealWeight.toFixed(1),
      beautyWeight: beautyWeight.toFixed(1),
      bmr: Math.round(bmrVal),
      tdee: Math.round(tdeeVal),
      water: Math.round(waterVal)
    };
  };

  const results = calculate();

  // --- Image Generation using html-to-image ---
  const handleDownload = async () => {
    if (!reportRef.current || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
        // Capture the DOM element
        const dataUrl = await toPng(reportRef.current, { 
            cacheBust: true, 
            backgroundColor: '#ffffff',
            pixelRatio: 2 // High resolution
        });
        
        const link = document.createElement('a');
        link.download = `health-report-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to generate image', err);
        alert('画像の保存に失敗しました。ブラウザの設定を確認してください。');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Activity className="text-indigo-600" size={32} />
          {t.title}
        </h2>
        <p className="text-slate-600 mt-2">{t.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.gender}</label>
                <div className="flex gap-2">
                   {(['male', 'female'] as const).map(g => (
                     <button
                       key={g}
                       onClick={() => setGender(g)}
                       className={`flex-1 py-3 rounded-xl font-bold transition-all border ${gender === g ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                     >
                       {g === 'male' ? t.male : t.female}
                     </button>
                   ))}
                </div>
              </div>

              {/* Sliders */}
              <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.age}</label>
                   <span className="font-bold text-indigo-600">{age}</span>
                 </div>
                 <input type="range" min="10" max="100" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.height}</label>
                   <span className="font-bold text-indigo-600">{height} cm</span>
                 </div>
                 <input type="range" min="100" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>

              <div>
                 <div className="flex justify-between mb-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.weight}</label>
                   <span className="font-bold text-indigo-600">{weight} kg</span>
                 </div>
                 <input type="range" min="30" max="150" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
              </div>

              {/* Activity */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.activity}</label>
                <select 
                   value={activity}
                   onChange={e => setActivity(Number(e.target.value))}
                   className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value={1.2}>{t.act1}</option>
                  <option value={1.375}>{t.act2}</option>
                  <option value={1.55}>{t.act3}</option>
                  <option value={1.725}>{t.act4}</option>
                </select>
              </div>
           </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
           {/* Wrap results in ref for capture */}
           <div ref={reportRef} className="bg-slate-50 p-6 rounded-3xl space-y-4">
               {/* Header Info for Report */}
               <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-2">
                   <div>
                       <h3 className="font-bold text-slate-800 text-lg">Health Report</h3>
                       <p className="text-xs text-slate-500">{new Date().toLocaleDateString()} • {height}cm / {weight}kg / {age}{lang==='JP'?'歳':'yo'}</p>
                   </div>
                   <div className="text-right">
                       <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">ToolPark.info</span>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10"><Scale size={40} /></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">{t.bmiLabel}</p>
                     <p className="text-3xl font-black text-slate-800 my-1">{results.bmi}</p>
                     <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white ${results.bmiBg}`}>
                        {results.bmiStatus}
                     </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10"><Heart size={40} /></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">{t.idealW}</p>
                     <p className="text-3xl font-black text-indigo-600 my-1">{results.idealWeight}</p>
                     <p className="text-xs text-slate-500">{t.beautyW}: {results.beautyWeight}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10"><Flame size={40} /></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">{t.bmr}</p>
                     <p className="text-3xl font-black text-amber-500 my-1">{results.bmr}</p>
                     <p className="text-xs text-slate-500">kcal / day</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10"><Activity size={40} /></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">{t.tdee}</p>
                     <p className="text-3xl font-black text-rose-500 my-1">{results.tdee}</p>
                     <p className="text-xs text-slate-500">kcal / day</p>
                  </div>
               </div>
               
               <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full text-cyan-500 shadow-sm">
                     <Droplets size={24} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-cyan-600 uppercase">{t.water}</p>
                     <p className="text-xl font-bold text-slate-800">{results.water} ml <span className="text-sm font-normal text-slate-500">/ day</span></p>
                  </div>
               </div>
           </div>

           <button 
             onClick={handleDownload}
             disabled={isGenerating}
             className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
           >
             {isGenerating ? (
                <>Loading...</>
             ) : (
                <>
                    <Download size={18} /> {t.save}
                </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
};

export default CalorieCheckerComponent;