import { useState, useRef } from 'react';
import { Receipt, Download, Plus, Trash2, Calendar } from 'lucide-react';
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
  
  // Basic Info
  const [invoiceNo, setInvoiceNo] = useState(Date.now().toString().slice(-6));
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(''); // Payment deadline
  
  // Issuer & Client
  const [myInfo, setMyInfo] = useState({ name: '山田 太郎', address: '東京都渋谷区...' });
  const [registrationNo, setRegistrationNo] = useState(''); // T1234...
  const [clientInfo, setClientInfo] = useState({ name: '株式会社サンプル 御中' });
  
  // Items & Tax
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

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      const dataUrl = await toPng(reportRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `${type}-${invoiceNo}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      alert('Error saving image');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Receipt className="text-indigo-600" size={32} />
          {lang === 'JP' ? '簡易伝票ジェネレーター' : 'Invoice Generator'}
        </h2>
        <p className="text-slate-600 mt-2">
          {lang === 'JP' ? 'インボイス対応。登録番号や日付入力も可能なシンプル作成ツール。' : 'Create invoices with registration numbers and custom dates.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* Input Panel */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
               
               {/* Type & Dates */}
               <div className="space-y-3">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                     <button onClick={() => setType('invoice')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${type==='invoice'?'bg-white text-indigo-600 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>{lang==='JP'?'請求書':'Invoice'}</button>
                     <button onClick={() => setType('estimate')} className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${type==='estimate'?'bg-white text-indigo-600 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>{lang==='JP'?'見積書':'Estimate'}</button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'No.':'No.'}</label>
                        <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full p-2 border border-slate-200 rounded text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'発行日':'Date'}</label>
                        <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full p-2 border border-slate-200 rounded text-sm" />
                    </div>
                  </div>
                  
                  {type === 'invoice' && (
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'お支払期限':'Due Date'}</label>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border border-slate-200 rounded text-sm" />
                      </div>
                  )}
               </div>

               <hr className="border-slate-100" />

               {/* Partners */}
               <div className="space-y-3">
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'宛先 (クライアント)':'Client'}</label>
                     <input type="text" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm" placeholder="Client Name" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'発行者 (自分)':'Issuer'}</label>
                     <input type="text" value={myInfo.name} onChange={e => setMyInfo({...myInfo, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm mb-2" placeholder="Name" />
                     <textarea value={myInfo.address} onChange={e => setMyInfo({...myInfo, address: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm h-20 resize-none" placeholder="Address, Contact..." />
                  </div>
                  
                  {/* Invoice Registration Number */}
                  <div>
                     <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'登録番号 (インボイス)':'Registration No.'}</label>
                     <input 
                       type="text" 
                       value={registrationNo} 
                       onChange={e => setRegistrationNo(e.target.value)} 
                       className="w-full p-2 border border-slate-200 rounded text-sm font-mono placeholder:text-slate-300" 
                       placeholder="T1234567890123" 
                     />
                  </div>
               </div>

               <hr className="border-slate-100" />

               {/* Tax Rate */}
               <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">{lang==='JP'?'消費税率 (%)':'Tax Rate (%)'}</label>
                  <input 
                    type="number" 
                    value={taxRate} 
                    onChange={e => setTaxRate(Number(e.target.value))} 
                    className="w-full p-2 border border-slate-200 rounded text-sm" 
                  />
               </div>

               {/* Items */}
               <div className="pt-2">
                  <h4 className="font-bold text-slate-700 mb-2 flex justify-between items-center">
                      <span>Items</span>
                      <button onClick={addItem} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold flex items-center gap-1"><Plus size={12}/> Add</button>
                  </h4>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                     {items.map(item => (
                        <div key={item.id} className="bg-slate-50 p-2 rounded border border-slate-200">
                           <div className="flex justify-between mb-1">
                              <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} className="w-full p-1 bg-white border rounded text-xs mr-2" placeholder="Item Name" />
                              <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={14}/></button>
                           </div>
                           <div className="flex gap-2 items-center">
                              <span className="text-[10px] text-slate-400">¥</span>
                              <input type="number" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} className="flex-1 p-1 bg-white border rounded text-xs text-right" placeholder="Price" />
                              <span className="text-[10px] text-slate-400">x</span>
                              <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-12 p-1 bg-white border rounded text-xs text-right" placeholder="Qty" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Preview Panel */}
         <div className="lg:col-span-8">
            <div className="bg-slate-100 p-4 md:p-8 rounded-3xl overflow-auto border border-slate-200 shadow-inner flex justify-center">
               <div ref={reportRef} className="bg-white p-10 md:p-14 shadow-xl min-w-[700px] min-h-[900px] relative text-slate-800 flex flex-col">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-12">
                     <div>
                        <h1 className="text-3xl font-bold border-b-4 border-indigo-600 pb-2 inline-block min-w-[200px] text-indigo-900">
                            {type === 'invoice' ? (lang==='JP'?'御請求書':'INVOICE') : (lang==='JP'?'御見積書':'ESTIMATE')}
                        </h1>
                     </div>
                     <div className="text-right space-y-1">
                        <div className="text-sm font-bold text-slate-600">No. {invoiceNo}</div>
                        <div className="text-sm text-slate-500">{lang==='JP'?'発行日':'Date'}: {issueDate}</div>
                     </div>
                  </div>

                  {/* Addresses */}
                  <div className="flex justify-between mb-12 gap-8">
                     <div className="flex-1">
                        <h2 className="text-xl font-bold border-b border-slate-300 pb-2 mb-3 leading-relaxed">
                            {clientInfo.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {type === 'invoice' 
                                ? (lang==='JP'?'下記の通りご請求申し上げます。':'Please find the invoice details below.')
                                : (lang==='JP'?'下記の通りお見積り申し上げます。':'Please find the estimate details below.')
                            }
                        </p>
                     </div>
                     <div className="text-right flex-1">
                        <p className="font-bold text-lg mb-1">{myInfo.name}</p>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed mb-2">{myInfo.address}</p>
                        {registrationNo && (
                            <p className="text-xs font-bold text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded">
                                {lang==='JP'?'登録番号':'Reg No'}: {registrationNo}
                            </p>
                        )}
                     </div>
                  </div>

                  {/* Totals Highilght */}
                  <div className="mb-10 bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <div className="flex justify-between items-end border-b border-slate-300 pb-2 mb-2">
                        <span className="font-bold text-lg text-slate-700">{lang==='JP'?'ご請求金額':'Total Amount'}</span>
                        <span className="text-4xl font-bold text-slate-900">¥{total.toLocaleString()}</span>
                     </div>
                     {dueDate && (
                         <div className="text-right text-sm font-bold text-rose-600 flex items-center justify-end gap-1">
                             <Calendar size={14} />
                             {lang==='JP'?'お支払期限':'Due Date'}: {dueDate}
                         </div>
                     )}
                  </div>

                  {/* Table */}
                  <table className="w-full mb-8 border-collapse">
                     <thead>
                        <tr className="bg-indigo-50 text-indigo-900 text-sm border-b border-indigo-100">
                           <th className="text-left py-3 px-4 first:rounded-tl-lg">{lang==='JP'?'内容':'Description'}</th>
                           <th className="text-right py-3 px-4 w-24">{lang==='JP'?'数量':'Qty'}</th>
                           <th className="text-right py-3 px-4 w-32">{lang==='JP'?'単価':'Unit Price'}</th>
                           <th className="text-right py-3 px-4 w-32 last:rounded-tr-lg">{lang==='JP'?'金額':'Amount'}</th>
                        </tr>
                     </thead>
                     <tbody className="text-sm">
                        {items.map((item, i) => (
                           <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="py-3 px-4 border-b border-slate-100">{item.name}</td>
                              <td className="text-right py-3 px-4 border-b border-slate-100">{item.qty}</td>
                              <td className="text-right py-3 px-4 border-b border-slate-100">¥{item.price.toLocaleString()}</td>
                              <td className="text-right py-3 px-4 border-b border-slate-100 font-medium">¥{(item.qty * item.price).toLocaleString()}</td>
                           </tr>
                        ))}
                        {/* Fill empty rows to look like a proper document */}
                        {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                            <tr key={`empty-${i}`} className="h-11 border-b border-slate-100">
                                <td colSpan={4}></td>
                            </tr>
                        ))}
                     </tbody>
                  </table>

                  {/* Summary */}
                  <div className="flex justify-end mt-auto">
                     <div className="w-72 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                           <span>{lang==='JP'?'小計':'Subtotal'}</span>
                           <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                           <span>{lang==='JP'?'消費税':'Tax'} ({taxRate}%)</span>
                           <span>¥{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t-2 border-slate-800 pt-3 text-slate-900">
                           <span>Total</span>
                           <span>¥{total.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
                  
                  {/* Footer */}
                  {type === 'invoice' && (
                      <div className="mt-12 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                          {lang==='JP' ? '振込手数料はご負担願います。' : 'Thank you for your business.'}
                      </div>
                  )}
               </div>
            </div>

            <div className="flex justify-end mt-6">
               <button onClick={handleDownload} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-3 hover:bg-slate-800 transition-transform hover:-translate-y-1">
                  <Download size={20} /> {lang==='JP'?'画像を保存 (PNG)':'Save Image'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
