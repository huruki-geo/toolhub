import React, { useState, useEffect } from 'react';
import { ArrowRight, Type, Copy, Settings2, Check, ArrowLeftRight } from 'lucide-react';
import { Language } from '../../src/types';

interface Props {
  lang: Language;
}

type RomajiSystem = 'hepburn' | 'kunrei';
type LetterCase = 'capitalized' | 'upper' | 'lower';
type Mode = 'kanaToRomaji' | 'romajiToKana';

const KUNREI_DIFF: Record<string, string> = {
  'shi': 'si', 'chi': 'ti', 'tsu': 'tu', 'fu': 'hu',
  'ji': 'zi', 'sha': 'sya', 'shu': 'syu', 'sho': 'syo',
  'cha': 'tya', 'chu': 'tyu', 'cho': 'tyo',
  'ja': 'zya', 'ju': 'zyu', 'jo': 'zyo'
};

const ROMAJI_MAP: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'o', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'ゔ': 'vu'
};

// Build reverse map for Romaji -> Kana
const ROMAJI_TO_KANA_MAP: Record<string, string> = {};
// Standard mappings
Object.entries(ROMAJI_MAP).forEach(([k, v]) => {
  ROMAJI_TO_KANA_MAP[v] = k;
});
// Add Kunrei/Alternative mappings manually for better coverage
const EXTRAS: Record<string, string> = {
  'si': 'し', 'ti': 'ち', 'tu': 'つ', 'hu': 'ふ', 'zi': 'じ',
  'sya': 'しゃ', 'syu': 'しゅ', 'syo': 'しょ',
  'tya': 'ちゃ', 'tyu': 'ちゅ', 'tyo': 'ちょ',
  'zya': 'じゃ', 'zyu': 'じゅ', 'zyo': 'じょ',
  'cya': 'ちゃ', 'cyu': 'ちゅ', 'cyo': 'ちょ',
  'jya': 'じゃ', 'jyu': 'じゅ', 'jyo': 'じょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
  'qa': 'くぁ', 'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ',
  'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
  'xya': 'ゃ', 'xyu': 'ゅ', 'xyo': 'ょ',
  'xtu': 'っ', 'tsu': 'つ'
};
Object.assign(ROMAJI_TO_KANA_MAP, EXTRAS);

// Sort keys by length descending to match longer strings first (e.g. 'shi' before 'sh' or 'si')
const SORTED_ROMAJI_KEYS = Object.keys(ROMAJI_TO_KANA_MAP).sort((a, b) => b.length - a.length);

const KANA_TO_HIRA = (str: string) => {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
};

export const RomajiConverterComponent: React.FC<Props> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [system, setSystem] = useState<RomajiSystem>('hepburn');
  const [letterCase, setLetterCase] = useState<LetterCase>('capitalized');
  const [mode, setMode] = useState<Mode>('kanaToRomaji');
  const [copied, setCopied] = useState(false);

  const t = {
    title: lang === 'JP' ? 'ローマ字変換 Pro' : 'Romaji Converter Pro',
    desc: lang === 'JP' 
      ? 'ヘボン式・訓令式の切り替えや、ローマ字からの逆変換も可能です。' 
      : 'Professional conversion supporting Hepburn/Kunrei systems and reverse conversion.',
    inputLabel: mode === 'kanaToRomaji' ? (lang === 'JP' ? '日本語（かな・カナ）' : 'Japanese Text') : (lang === 'JP' ? 'ローマ字' : 'Romaji Text'),
    placeholder: mode === 'kanaToRomaji' ? (lang === 'JP' ? 'やまだ たろう' : 'yamada taro') : 'yamada tarou',
    outputLabel: lang === 'JP' ? '変換結果' : 'Result',
    copy: lang === 'JP' ? '結果をコピー' : 'Copy Result',
    settings: lang === 'JP' ? '変換設定' : 'Settings',
    hepburn: lang === 'JP' ? 'ヘボン式 (Hepburn)' : 'Hepburn',
    kunrei: lang === 'JP' ? '訓令式 (Kunrei)' : 'Kunrei',
    switchMode: lang === 'JP' ? 'モード切替' : 'Switch Mode',
  };

  useEffect(() => {
    if (mode === 'kanaToRomaji') {
      convertKanaToRomaji(input);
    } else {
      convertRomajiToKana(input);
    }
  }, [input, system, letterCase, mode]);

  const convertKanaToRomaji = (text: string) => {
    let hira = KANA_TO_HIRA(text);
    let result = '';
    
    for (let i = 0; i < hira.length; i++) {
      let char = hira[i];
      let next = hira[i + 1];
      
      if (char === 'っ' || char === 'ッ') {
        if (next) {
          let nextRomaji = ROMAJI_MAP[next] || '';
          if (['ゃ','ゅ','ょ'].includes(hira[i+2])) {
             const compound = next + hira[i+2];
             if (ROMAJI_MAP[compound]) nextRomaji = ROMAJI_MAP[compound];
          }

          if (nextRomaji) {
            if (system === 'kunrei' && KUNREI_DIFF[nextRomaji]) {
               nextRomaji = KUNREI_DIFF[nextRomaji];
            }
            result += nextRomaji[0]; 
            continue; 
          }
        }
      }

      if (next && (next === 'ゃ' || next === 'ゅ' || next === 'ょ')) {
        const compound = char + next;
        if (ROMAJI_MAP[compound]) {
          let r = ROMAJI_MAP[compound];
          if (system === 'kunrei' && KUNREI_DIFF[r]) {
            r = KUNREI_DIFF[r];
          }
          result += r;
          i++;
          continue;
        }
      }

      if (char === 'ー') {
        result += '-';
        continue; 
      }

      let r = ROMAJI_MAP[char];
      if (r) {
        if (system === 'kunrei' && KUNREI_DIFF[r]) {
          r = KUNREI_DIFF[r];
        }
        result += r;
      } else {
        result += char; 
      }
    }

    if (letterCase === 'upper') {
      result = result.toUpperCase();
    } else if (letterCase === 'lower') {
      result = result.toLowerCase();
    } else {
      result = result.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    setOutput(result);
  };

  const convertRomajiToKana = (text: string) => {
    let str = text.toLowerCase();
    let result = '';
    let i = 0;
    while (i < str.length) {
      let matchFound = false;
      // Try to match longest keys first
      for (const key of SORTED_ROMAJI_KEYS) {
        if (str.startsWith(key, i)) {
          result += ROMAJI_TO_KANA_MAP[key];
          i += key.length;
          matchFound = true;
          break;
        }
      }
      
      if (!matchFound) {
        // Handle double consonants (sokuon) e.g. 'tt', 'kk' -> 'っ'
        // But exclude 'nn' which is 'ん' (already in map)
        const char = str[i];
        const next = str[i+1];
        if (char === next && /[bcdfghjklmpqrstvwxyz]/.test(char)) {
           result += 'っ';
           i++;
        } else if (char === '-') {
           result += 'ー';
           i++;
        } else {
           // No match, just keep the character
           result += text[i]; // keep original case for non-matches
           i++;
        }
      }
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'kanaToRomaji' ? 'romajiToKana' : 'kanaToRomaji');
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.title}</h2>
        <p className="text-lg text-slate-600">{t.desc}</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b pb-3">
              <Settings2 size={20} />
              {t.settings}
            </div>
            
            <div className="space-y-6">
              
              <div>
                <button 
                  onClick={toggleMode}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center gap-2 transition-colors border border-indigo-200"
                >
                  <ArrowLeftRight size={18} />
                  {mode === 'kanaToRomaji' ? 'Kana → Romaji' : 'Romaji → Kana'}
                </button>
              </div>

              {mode === 'kanaToRomaji' && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">System</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <input 
                          type="radio" 
                          name="system" 
                          checked={system === 'hepburn'} 
                          onChange={() => setSystem('hepburn')}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <div>
                            <span className="text-sm font-bold text-slate-800 block">{t.hepburn}</span>
                            <span className="text-xs text-slate-500">し(Shi), つ(Tsu)</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <input 
                          type="radio" 
                          name="system" 
                          checked={system === 'kunrei'} 
                          onChange={() => setSystem('kunrei')}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <div>
                            <span className="text-sm font-bold text-slate-800 block">{t.kunrei}</span>
                            <span className="text-xs text-slate-500">し(Si), つ(Tu)</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Case</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="case" 
                          checked={letterCase === 'capitalized'} 
                          onChange={() => setLetterCase('capitalized')}
                          className="text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-medium">Yamada Taro</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="case" 
                          checked={letterCase === 'upper'} 
                          onChange={() => setLetterCase('upper')}
                          className="text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-medium">YAMADA TARO</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="case" 
                          checked={letterCase === 'lower'} 
                          onChange={() => setLetterCase('lower')}
                          className="text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-medium">yamada taro</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {mode === 'romajiToKana' && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed">
                   {lang === 'JP' 
                     ? 'ローマ字を入力すると、自動的にひらがなに変換されます。sokuon (tt, pp) も対応しています。'
                     : 'Typing romaji will automatically convert to Hiragana. Supports double consonants.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Converter */}
        <div className="md:col-span-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">{t.inputLabel}</label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full text-xl p-5 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 shadow-sm"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Type size={20} />
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-start pl-8">
             <ArrowRight size={24} className="text-slate-300 rotate-90 md:rotate-0" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">{t.outputLabel}</label>
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={output}
                placeholder={mode === 'kanaToRomaji' ? "Yamada Taro" : "やまだ たろう"}
                className="w-full text-xl p-5 pr-32 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 text-indigo-900 font-bold focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-indigo-100 text-indigo-600 font-bold text-sm shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'OK' : t.copy}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RomajiConverterComponent;