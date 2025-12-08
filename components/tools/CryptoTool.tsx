import { useState } from 'react';
import { Lock, Unlock, ArrowDown, Copy, RotateCcw } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

type Mode = 'caesar' | 'base64' | 'rot13' | 'hex' | 'tanuki' | 'morse' | 'reverse';

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': ' '
};
const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce((acc, [k, v]) => ({...acc, [v]: k}), {});

export default function CryptoTool({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('caesar');
  const [direction, setDirection] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [shift, setShift] = useState(3);

  const process = () => {
    try {
      let res = '';
      if (mode === 'base64') {
        try {
            res = direction === 'encrypt' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
        } catch (e) { res = 'Base64 Error'; }
      } else if (mode === 'hex') {
        if (direction === 'encrypt') {
           res = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        } else {
           res = input.split(/[\s,]+/).map(h => String.fromCharCode(parseInt(h, 16))).join('');
        }
      } else if (mode === 'caesar' || mode === 'rot13') {
        const s = mode === 'rot13' ? 13 : (direction === 'encrypt' ? shift : -shift);
        res = input.replace(/[a-zA-Z]/g, (char) => {
          const base = char <= 'Z' ? 65 : 97;
          return String.fromCharCode(((char.charCodeAt(0) - base + s + 26) % 26) + base);
        });
      } else if (mode === 'tanuki') {
        // Tanuki: Insert 'ta' or 'タ'
        const ta = 'タ'; // Use Katakana Ta
        if (direction === 'encrypt') {
            res = input.split('').map(c => ta + c).join('');
        } else {
            res = input.replace(/タ|た/g, '');
        }
      } else if (mode === 'morse') {
        if (direction === 'encrypt') {
            res = input.toUpperCase().split('').map(c => MORSE_MAP[c] || c).join(' ');
        } else {
            res = input.split(' ').map(c => REVERSE_MORSE[c] || c).join('');
        }
      } else if (mode === 'reverse') {
        res = input.split('').reverse().join('');
      }
      setOutput(res);
    } catch (e) {
      setOutput('Error: Invalid Input');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Lock className="text-indigo-600" size={32} />
          {lang === 'JP' ? '暗号化・復号化ツール' : 'Crypto Tool'}
        </h2>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-lg">
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex-1 min-w-[200px]">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{lang==='JP'?'アルゴリズム':'Algorithm'}</label>
             <select 
               value={mode} 
               onChange={e => { setMode(e.target.value as Mode); setOutput(''); }}
               className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
             >
               <option value="caesar">Caesar Cipher (シーザー暗号)</option>
               <option value="rot13">ROT13 (13文字ずらし)</option>
               <option value="base64">Base64</option>
               <option value="hex">Hex (16進数)</option>
               <option value="tanuki">{lang==='JP'?'たぬき暗号 (タを挿入)':'Tanuki (Insert Ta)'}</option>
               <option value="morse">{lang==='JP'?'モールス信号':'Morse Code'}</option>
               <option value="reverse">{lang==='JP'?'逆さ言葉':'Reverse String'}</option>
             </select>
          </div>

          <div className="flex-1 min-w-[200px]">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{lang==='JP'?'処理':'Action'}</label>
             <div className="flex bg-white rounded-xl border border-slate-200 p-1">
                <button 
                  onClick={() => setDirection('encrypt')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${direction === 'encrypt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Lock size={14} /> Encrypt
                </button>
                <button 
                  onClick={() => setDirection('decrypt')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 ${direction === 'decrypt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Unlock size={14} /> Decrypt
                </button>
             </div>
          </div>

          {mode === 'caesar' && (
             <div className="w-24">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Shift</label>
                <input 
                  type="number" 
                  value={shift}
                  onChange={e => setShift(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-6">
           <div>
              <div className="flex justify-between mb-2">
                 <label className="text-sm font-bold text-slate-700">{lang==='JP'?'入力':'Input'}</label>
                 <button onClick={() => { setInput(''); setOutput(''); }} className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"><RotateCcw size={12}/> Clear</button>
              </div>
              <textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors font-mono text-sm"
                placeholder={mode==='tanuki' ? (lang==='JP'?'こんにちは':'Hello') : "..."}
              />
           </div>

           <div className="flex justify-center">
              <button onClick={process} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <ArrowDown size={20} /> {lang==='JP'?'実行':'Run'}
              </button>
           </div>

           <div>
              <div className="flex justify-between mb-2">
                 <label className="text-sm font-bold text-slate-700">{lang==='JP'?'結果':'Result'}</label>
                 <button onClick={copyToClipboard} className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1"><Copy size={12}/> Copy</button>
              </div>
              <textarea 
                readOnly
                value={output}
                className="w-full h-32 p-4 rounded-xl border-2 border-indigo-100 bg-white font-mono text-sm focus:outline-none"
              />
           </div>
        </div>

      </div>
    </div>
  );
}