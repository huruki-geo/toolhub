import React, { useState, useRef } from 'react';
import { ListOrdered, Plus, Download, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

interface TierItem {
  id: string;
  type: 'text' | 'image';
  content: string; // text string or dataURL
}

interface TierRow {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
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
  const [pool, setPool] = useState<TierItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTextItem = () => {
    if (!newItemText.trim()) return;
    const newItem: TierItem = {
      id: generateId(),
      type: 'text',
      content: newItemText
    };
    setPool([...pool, newItem]);
    setNewItemText('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const newItem: TierItem = {
            id: generateId(),
            type: 'image',
            content: ev.target.result as string
          };
          setPool(prev => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const moveItem = (itemId: string, targetRowId: string | 'pool' | 'delete') => {
    // Find item details first
    let itemToMove: TierItem | undefined;
    
    // Check pool
    itemToMove = pool.find(i => i.id === itemId);
    
    // Check rows if not in pool
    if (!itemToMove) {
      for (const row of rows) {
        const found = row.items.find(i => i.id === itemId);
        if (found) {
          itemToMove = found;
          break;
        }
      }
    }

    if (!itemToMove) return;

    // 1. Remove from source
    setPool(prev => prev.filter(i => i.id !== itemId));
    setRows(prev => prev.map(r => ({
      ...r,
      items: r.items.filter(i => i.id !== itemId)
    })));

    // 2. Add to destination
    if (targetRowId === 'delete') {
      // Just removed, do nothing else
    } else if (targetRowId === 'pool') {
      setPool(prev => [...prev, itemToMove!]);
    } else {
      setRows(prev => prev.map(r => {
        if (r.id === targetRowId) {
          return { ...r, items: [...r.items, itemToMove!] };
        }
        return r;
      }));
    }
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

  const renderItem = (item: TierItem, context: 'pool' | 'row') => (
    <div 
      key={item.id} 
      className="relative group cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      {item.type === 'text' ? (
        <div className="bg-white px-3 py-2 rounded text-slate-900 font-bold text-sm shadow-sm border border-slate-200 min-w-[60px] text-center">
          {item.content}
        </div>
      ) : (
        <div className="w-16 h-16 bg-white rounded overflow-hidden shadow-sm border border-slate-200">
          <img src={item.content} alt="tier item" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Hover Menu */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-white shadow-xl border border-slate-200 rounded-lg p-1 z-50 flex-wrap w-40 justify-center gap-1">
         {context === 'row' && (
            <button onClick={() => moveItem(item.id, 'pool')} className="w-full text-[10px] bg-slate-100 hover:bg-slate-200 rounded px-1 py-0.5 mb-1 text-slate-600 font-bold">
               To Pool
            </button>
         )}
         {rows.map(r => (
            <button 
              key={r.id} 
              onClick={() => moveItem(item.id, r.id)} 
              className="w-6 h-6 rounded text-[10px] text-white font-bold hover:opacity-80" 
              style={{backgroundColor: r.color}}
            >
              {r.label}
            </button>
         ))}
         <button onClick={() => moveItem(item.id, 'delete')} className="w-6 h-6 rounded bg-slate-200 text-rose-500 hover:bg-rose-100 flex items-center justify-center">
            <Trash2 size={12} />
         </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <ListOrdered className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'Tier表作成ツール' : 'Tier List Maker'}
        </h2>
        <p className="text-slate-600 mt-2">{lang === 'JP' ? '画像やテキストを追加して、ランク付け表を作成できます。' : 'Rank images and text items.'}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-700">{lang==='JP'?'アイテム追加':'Add Items'}</h3>
              
              {/* Text Input */}
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={newItemText}
                   onChange={e => setNewItemText(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && addTextItem()}
                   className="flex-1 p-2 border border-slate-200 rounded outline-none text-sm"
                   placeholder={lang==='JP'?'テキスト入力':'Text item...'}
                 />
                 <button onClick={addTextItem} className="bg-slate-100 text-slate-600 p-2 rounded hover:bg-slate-200 border border-slate-200">
                    <Plus size={20} />
                 </button>
              </div>

              {/* Image Input */}
              <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-indigo-600 font-bold text-sm">
                 <ImageIcon size={20} />
                 <span>{lang==='JP'?'画像をアップロード':'Upload Images'}</span>
                 <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
              
              {/* Pool Area */}
              <div className="bg-slate-50 p-4 rounded-xl min-h-[200px] border border-slate-200">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Unranked Pool</h4>
                    {pool.length > 0 && (
                      <button onClick={() => setPool([])} className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1">
                        <X size={12} /> Clear
                      </button>
                    )}
                 </div>
                 <div className="flex flex-wrap gap-2 content-start">
                    {pool.map(item => renderItem(item, 'pool'))}
                    {pool.length === 0 && <span className="text-slate-300 text-sm italic w-full text-center py-8">{lang==='JP'?'アイテムがありません':'No items'}</span>}
                 </div>
              </div>
           </div>
           
           <button onClick={handleDownload} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2">
              <Download size={18} /> {lang==='JP'?'画像を保存':'Save Image'}
           </button>
        </div>

        {/* Tier Table */}
        <div className="lg:col-span-8">
           <div ref={tableRef} className="bg-slate-900 p-4 rounded-xl shadow-2xl space-y-1 min-h-[600px]">
              {rows.map(row => (
                 <div key={row.id} className="flex min-h-[100px] bg-slate-800 border-b border-slate-900/50 last:border-0">
                    <div 
                      className="w-24 flex items-center justify-center font-black text-3xl text-slate-900 shrink-0"
                      style={{ backgroundColor: row.color }}
                    >
                       {row.label}
                    </div>
                    <div className="flex-1 p-2 flex flex-wrap gap-2 items-center content-center">
                       {row.items.map(item => renderItem(item, 'row'))}
                    </div>
                 </div>
              ))}
           </div>
           <p className="text-xs text-slate-400 mt-2 text-center">
              {lang==='JP'?'※アイテムをクリックまたはホバーすると移動メニューが表示されます。':'* Click or hover items to show move menu.'}
           </p>
        </div>
      </div>
    </div>
  );
}