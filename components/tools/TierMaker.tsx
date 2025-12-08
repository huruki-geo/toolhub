import React, { useState, useRef } from 'react';
import { ListOrdered, Plus, Download, X, GripVertical } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

interface TierRow {
  id: string;
  label: string;
  color: string;
  items: string[];
}

const DEFAULT_ROWS: TierRow[] = [
  { id: 'S', label: 'S', color: '#ef4444', items: [] },
  { id: 'A', label: 'A', color: '#f97316', items: [] },
  { id: 'B', label: 'B', color: '#eab308', items: [] },
  { id: 'C', label: 'C', color: '#22c55e', items: [] },
  { id: 'D', label: 'D', color: '#3b82f6', items: [] },
];

export default function TierMaker({ lang }: Props) {
  const [rows, setRows] = useState<TierRow[]>(DEFAULT_ROWS);
  const [pool, setPool] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  // Simple item management (Text based for simplicity in this version)
  const addItemToPool = () => {
    if (!newItem.trim()) return;
    setPool([...pool, newItem]);
    setNewItem('');
  };

  const moveItem = (item: string, targetRowId: string | 'pool') => {
    // Remove from all
    const newRows = rows.map(r => ({ ...r, items: r.items.filter(i => i !== item) }));
    let newPool = pool.filter(i => i !== item);

    if (targetRowId === 'pool') {
      newPool.push(item);
    } else {
      const row = newRows.find(r => r.id === targetRowId);
      if (row) row.items.push(item);
    }

    setRows(newRows);
    setPool(newPool);
  };

  const handleDownload = async () => {
    if (!tableRef.current) return;
    try {
      const dataUrl = await toPng(tableRef.current, { pixelRatio: 2, backgroundColor: '#1e293b' });
      const link = document.createElement('a');
      link.download = `tier-list-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert('Error saving image');
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <ListOrdered className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'Tier表作成ツール' : 'Tier List Maker'}
        </h2>
        <p className="text-slate-600 mt-2">{lang === 'JP' ? '項目を追加して、クリックでランクに割り振ってください。' : 'Add items and assign them to tiers.'}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-4">Add Item</h3>
              <div className="flex gap-2 mb-4">
                 <input 
                   type="text" 
                   value={newItem}
                   onChange={e => setNewItem(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && addItemToPool()}
                   className="flex-1 p-2 border border-slate-200 rounded outline-none"
                   placeholder="Item Name"
                 />
                 <button onClick={addItemToPool} className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
                    <Plus size={20} />
                 </button>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl min-h-[150px] border border-slate-200">
                 <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Unranked Pool</h4>
                 <div className="flex flex-wrap gap-2">
                    {pool.map((item, i) => (
                       <div key={i} className="bg-white px-3 py-1 rounded shadow-sm border border-slate-200 text-sm font-bold flex items-center gap-2 group">
                          {item}
                          <div className="hidden group-hover:flex absolute bg-white shadow-xl border rounded-lg p-1 z-10 -mt-8 flex-wrap w-32 justify-center gap-1">
                             {rows.map(r => (
                                <button key={r.id} onClick={() => moveItem(item, r.id)} className="w-5 h-5 rounded text-[10px] text-white font-bold" style={{backgroundColor: r.color}}>{r.label}</button>
                             ))}
                          </div>
                       </div>
                    ))}
                    {pool.length === 0 && <span className="text-slate-300 text-sm italic">No items</span>}
                 </div>
              </div>
           </div>
           
           <button onClick={handleDownload} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2">
              <Download size={18} /> {lang==='JP'?'画像を保存':'Save Image'}
           </button>
        </div>

        {/* Tier Table */}
        <div className="lg:col-span-8">
           <div ref={tableRef} className="bg-slate-900 p-4 rounded-xl shadow-2xl space-y-1 min-h-[500px]">
              {rows.map(row => (
                 <div key={row.id} className="flex min-h-[80px] bg-slate-800">
                    <div 
                      className="w-24 flex items-center justify-center font-black text-2xl text-slate-900 shrink-0"
                      style={{ backgroundColor: row.color }}
                    >
                       {row.label}
                    </div>
                    <div className="flex-1 p-2 flex flex-wrap gap-2 items-center">
                       {row.items.map((item, i) => (
                          <div 
                             key={i} 
                             onClick={() => moveItem(item, 'pool')}
                             className="bg-white px-3 py-2 rounded text-slate-900 font-bold text-sm cursor-pointer hover:bg-rose-100 transition-colors"
                             title="Remove to pool"
                          >
                             {item}
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}