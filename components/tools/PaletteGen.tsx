import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

export const PaletteGenComponent: React.FC<Props> = ({ lang }) => {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [copied, setCopied] = useState<string | null>(null);

  const t = {
    title: lang === 'JP' ? '配色ジェネレータ' : 'Palette Generator',
    desc: lang === 'JP' ? 'ひとつの色から、調和の取れた配色パターンを自動生成します。' : 'Generate harmonious color schemes from a single base color.',
    base: lang === 'JP' ? 'ベースカラー' : 'Base Color',
    schemes: {
      mono: lang === 'JP' ? 'モノクロマティック (同系色)' : 'Monochromatic',
      analog: lang === 'JP' ? 'アナロガス (類似色)' : 'Analogous',
      comp: lang === 'JP' ? 'コンプリメンタリー (補色)' : 'Complementary',
      triad: lang === 'JP' ? 'トライアド (3色配色)' : 'Triadic',
    }
  };

  // --- Color Utils ---
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // --- Generation Logic ---
  const generatePalettes = () => {
    const { h, s, l } = hexToHsl(baseColor);
    
    return {
      monochromatic: [
        hslToHex(h, s, Math.max(10, l - 30)),
        hslToHex(h, s, Math.max(20, l - 15)),
        baseColor,
        hslToHex(h, s, Math.min(90, l + 15)),
        hslToHex(h, s, Math.min(95, l + 30)),
      ],
      analogous: [
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex((h - 15 + 360) % 360, s, l),
        baseColor,
        hslToHex((h + 15) % 360, s, l),
        hslToHex((h + 30) % 360, s, l),
      ],
      complementary: [
        baseColor,
        hslToHex(h, Math.max(0, s - 20), Math.min(90, l + 30)), // Tint
        hslToHex((h + 180) % 360, s, l), // Comp
        hslToHex((h + 180) % 360, s, Math.max(20, l - 20)), // Shade
      ],
      triadic: [
        baseColor,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
      ]
    };
  };

  const palettes = generatePalettes();

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  const ColorSwatch = ({ hex, large = false }: { hex: string, large?: boolean }) => (
    <div 
      onClick={() => handleCopy(hex)}
      className={`
        relative group cursor-pointer rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-105 hover:shadow-md hover:z-10
        ${large ? 'h-32 md:h-40 flex-1' : 'h-20 w-full'}
      `}
      style={{ backgroundColor: hex }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-xl">
        <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wider">
          {copied === hex ? <Check size={14} /> : hex}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Palette className="text-pink-500" size={40} />
          {t.title}
        </h2>
        <p className="text-lg text-slate-600">{t.desc}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Picker */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 text-center">
             <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{t.base}</label>
             <div className="relative inline-block w-32 h-32 rounded-full overflow-hidden shadow-inner border-4 border-white ring-4 ring-slate-100 cursor-pointer hover:ring-indigo-100 transition-all">
                <input 
                  type="color" 
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer p-0 border-0"
                />
             </div>
             <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                   <span className="w-4 h-4 rounded-full border border-slate-300" style={{backgroundColor: baseColor}}></span>
                   <input 
                    type="text" 
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-20 bg-transparent text-slate-700 font-mono font-bold outline-none uppercase"
                   />
                </div>
             </div>
             
             <div className="mt-6 grid grid-cols-5 gap-2">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'].map(c => (
                   <button 
                     key={c}
                     onClick={() => setBaseColor(c)}
                     className="w-8 h-8 rounded-full border border-slate-200 hover:scale-110 transition-transform"
                     style={{backgroundColor: c}}
                   />
                ))}
             </div>
           </div>
        </div>

        {/* Palettes */}
        <div className="lg:col-span-8 space-y-10">
          
          <section>
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
               {t.schemes.mono}
             </h3>
             <div className="flex gap-2">
               {palettes.monochromatic.map((hex, i) => <ColorSwatch key={i} hex={hex} large />)}
             </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
               {t.schemes.comp}
             </h3>
             <div className="flex gap-2">
               {palettes.complementary.map((hex, i) => <ColorSwatch key={i} hex={hex} large />)}
             </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
               {t.schemes.analog}
             </h3>
             <div className="flex gap-2">
               {palettes.analogous.map((hex, i) => <ColorSwatch key={i} hex={hex} large />)}
             </div>
          </section>

          <section>
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
               {t.schemes.triad}
             </h3>
             <div className="flex gap-2">
               {palettes.triadic.map((hex, i) => <ColorSwatch key={i} hex={hex} large />)}
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PaletteGenComponent;