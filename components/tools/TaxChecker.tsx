import React, { useState } from 'react';
import { Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export default function TaxChecker({ lang }: Props) {
  const [income, setIncome] = useState<number | ''>('');
  
  const thresholds = [
    { val: 103, label: '103万円の壁', desc: '所得税が発生し始めます。親などの扶養から外れる可能性があります。' },
    { val: 130, label: '130万円の壁', desc: '社会保険（健康保険・年金）への加入が必要になり、手取りが減る可能性があります。' },
    { val: 150, label: '150万円の壁', desc: '配偶者特別控除が満額受けられなくなります。' }
  ];

  const renderStatus = () => {
    if (income === '') return null;
    const val = Number(income); // unit: 10k yen

    return (
      <div className="space-y-4 mt-8">
        {thresholds.map(t => {
           const diff = t.val - (val / 10000);
           const isOver = diff < 0;
           
           return (
             <div key={t.val} className={`p-6 rounded-2xl border-2 transition-all ${isOver ? 'border-rose-100 bg-rose-50' : 'border-emerald-100 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold text-lg ${isOver ? 'text-rose-700' : 'text-slate-700'}`}>
                      {t.label} ({t.val}万円)
                   </h3>
                   {isOver ? (
                     <span className="flex items-center gap-1 text-rose-600 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                        <AlertTriangle size={16} /> 超過 (Over)
                     </span>
                   ) : (
                     <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle2 size={16} /> 安全 (Safe)
                     </span>
                   )}
                </div>
                
                <p className="text-sm text-slate-600 mb-4">{t.desc}</p>
                
                {!isOver ? (
                  <div className="text-slate-500 text-sm font-medium">
                    あと <span className="text-emerald-600 text-xl font-bold">{Math.round(diff * 10000).toLocaleString()}円</span> 稼げます
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm font-medium">
                    <span className="text-rose-600 text-xl font-bold">{Math.abs(Math.round(diff * 10000)).toLocaleString()}円</span> 超えています
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                     style={{ width: `${Math.min(100, (val / 10000 / t.val) * 100)}%` }}
                   />
                </div>
             </div>
           );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Wallet className="text-indigo-600" size={32} />
          {lang === 'JP' ? '扶養壁チェッカー' : 'Tax Threshold Checker'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? '年収を入力するだけで、103万・130万の壁までの残額を計算します。' : 'Check your income against Japanese tax dependency thresholds.'}
        </p>
      </div>

      <div className="bg-slate-100 p-8 rounded-3xl shadow-inner text-center mb-8">
         <label className="block text-slate-500 font-bold mb-4 uppercase tracking-wider text-sm">
           {lang === 'JP' ? '今年の累計収入 (見込み)' : 'Total Yearly Income'}
         </label>
         <div className="inline-flex items-center relative max-w-xs w-full">
            <input 
              type="number" 
              value={income}
              onChange={e => setIncome(Number(e.target.value))}
              className="w-full p-4 pr-12 text-3xl font-bold text-center rounded-2xl border border-slate-300 focus:ring-4 focus:ring-indigo-200 outline-none"
              placeholder="0"
            />
            <span className="absolute right-4 text-slate-400 font-bold">円</span>
         </div>
         <p className="text-xs text-slate-400 mt-3">交通費は含まない金額を入力してください (130万の壁は含む場合あり)</p>
      </div>

      {renderStatus()}

    </div>
  );
}