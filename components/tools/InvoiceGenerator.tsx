import React, { useState, useRef } from 'react';
import { Receipt, Download, Plus, Trash2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

interface Item {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export default function InvoiceGenerator({ lang }: Props) {
  const [type, setType] = useState<'invoice' | 'estimate'>('invoice');
  const [myInfo, setMyInfo] = useState({ name: '山田 太郎', address: '東京都渋谷区...' });
  const [clientInfo, setClientInfo] = useState({ name: '株式会社サンプル 御中' });
  const [items, setItems] = useState<Item[]>([{ id: '1', name: 'Webサイト制作費', qty: 1, price: 100000 }]);
  const [taxRate, setTaxRate] = useState(10);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', qty: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + (i.qty * i.price), 0);
  const tax = Math.floor(subtotal * (taxRate / 100));
  const total = subtotal + tax;
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      const dataUrl = await toPng(reportRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${type}-${Date.now()}.png`;
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
          <Receipt className="text-indigo-600" size={32} />
          {lang === 'JP' ? '簡易伝票ジェネレーター' : 'Invoice Generator'}
        </h2>
        <p className="text-slate-600 mt-2">{lang === 'JP' ? 'フリーランス向けのシンプルな見積書・請求書作成ツール。' : 'Create simple invoices and estimates.'}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="font-bold text-slate-700 border-b pb-2">{lang==='JP'?'基本設定':'Settings'}</h3>
               <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Type</label>
                  <div className="flex gap-2">
                     <button onClick={() => setType('invoice')} className={`flex-1 py-2 rounded font-bold ${type==='invoice'?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600'}`}>{lang==='JP'?'請求書':'Invoice'}</button>
                     <button onClick={() => setType('estimate')} className={`flex-1 py-2 rounded font-bold ${type==='estimate'?'bg-indigo-600 text-white':'bg-slate-100 text-slate-600'}`}>{lang==='JP'?'見積書':'Estimate'}</button>
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">My Info</label>
                  <input type="text" value={myInfo.name} onChange={e => setMyInfo({...myInfo, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded mb-2" placeholder="Name" />
                  <textarea value={myInfo.address} onChange={e => setMyInfo({...myInfo, address: e.target.value})} className="w-full p-2 border border-slate-200 rounded" placeholder="Address" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Client</label>
                  <input type="text" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded" placeholder="Client Name" />
               </div>
               
               <div className="pt-4 border-t">
                  <h4 className="font-bold text-slate-700 mb-2">Items</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                     {items.map(item => (
                        <div key={item.id} className="bg-slate-50 p-2 rounded border border-slate-200">
                           <div className="flex justify-between mb-1">
                              <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full p-1 bg-white border rounded text-sm mr-2" placeholder="Item" />
                              <button onClick={() => removeItem(item.id)} className="text-rose-400"><Trash2 size={16}/></button>
                           </div>
                           <div className="flex gap-2">
                              <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-16 p-1 bg-white border rounded text-sm text-right" placeholder="Qty" />
                              <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} className="flex-1 p-1 bg-white border rounded text-sm text-right" placeholder="Price" />
                           </div>
                        </div>
                     ))}
                     <button onClick={addItem} className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold rounded flex justify-center items-center gap-1 text-sm"><Plus size={14}/> Add Item</button>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-8">
            <div className="bg-slate-100 p-8 rounded-3xl overflow-auto border border-slate-200 shadow-inner flex justify-center">
               {/* Invoice Preview */}
               <div ref={reportRef} className="bg-white p-12 shadow-xl min-w-[700px] min-h-[900px] relative text-slate-800">
                  <div className="flex justify-between items-start mb-12">
                     <h1 className="text-3xl font-bold border-b-4 border-indigo-600 pb-2">
                        {type === 'invoice' ? (lang==='JP'?'請求書':'INVOICE') : (lang==='JP'?'見積書':'ESTIMATE')}
                     </h1>
                     <div className="text-right text-sm">
                        <p>No. {Date.now().toString().slice(-6)}</p>
                        <p>{today}</p>
                     </div>
                  </div>

                  <div className="flex justify-between mb-12">
                     <div>
                        <h2 className="text-xl font-bold border-b border-slate-300 pb-1 mb-2 min-w-[250px]">{clientInfo.name}</h2>
                        <p className="text-sm text-slate-500">{lang==='JP'?'下記の通りご請求申し上げます。':'Please find the details below.'}</p>
                     </div>
                     <div className="text-right">
                        <p className="font-bold">{myInfo.name}</p>
                        <p className="text-sm whitespace-pre-wrap">{myInfo.address}</p>
                     </div>
                  </div>

                  <div className="mb-8">
                     <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2 mb-4">
                        <span className="font-bold text-lg">{lang==='JP'?'合計金額':'Total Amount'}</span>
                        <span className="text-3xl font-bold">¥{total.toLocaleString()}</span>
                     </div>
                  </div>

                  <table className="w-full mb-8">
                     <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-500 text-sm">
                           <th className="text-left py-2">{lang==='JP'?'品名':'Description'}</th>
                           <th className="text-right py-2 w-20">{lang==='JP'?'数量':'Qty'}</th>
                           <th className="text-right py-2 w-32">{lang==='JP'?'単価':'Unit Price'}</th>
                           <th className="text-right py-2 w-32">{lang==='JP'?'金額':'Amount'}</th>
                        </tr>
                     </thead>
                     <tbody>
                        {items.map(item => (
                           <tr key={item.id} className="border-b border-slate-100 text-sm">
                              <td className="py-3">{item.name}</td>
                              <td className="text-right py-3">{item.qty}</td>
                              <td className="text-right py-3">¥{item.price.toLocaleString()}</td>
                              <td className="text-right py-3">¥{(item.qty * item.price).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  <div className="flex justify-end">
                     <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                           <span>{lang==='JP'?'小計':'Subtotal'}</span>
                           <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span>{lang==='JP'?'消費税':'Tax'} ({taxRate}%)</span>
                           <span>¥{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-2">
                           <span>Total</span>
                           <span>¥{total.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-slate-400">
                     Thank you for your business.
                  </div>
               </div>
            </div>

            <div className="flex justify-end mt-6">
               <button onClick={handleDownload} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800">
                  <Download size={20} /> {lang==='JP'?'画像を保存':'Save Invoice'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}