import { useState } from 'react';
import { Grid, Download, Trash2, Eraser, Undo, PaintBucket, Minus, Square, Circle, Pipette, Plus } from 'lucide-react';
import { Language } from '../../src/types';

interface Props {
  lang: Language;
}

// Expanded Palette
const PRESET_COLORS = [
  '#000000', '#1a1c2c', '#5d275d', '#b13e53', '#ef7d57', '#ffcd75', '#a7f070', '#38b764',
  '#257179', '#29366f', '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86', '#333c57',
  '#ffffff', '#ff0044', '#00ff99', '#ffff00', '#00ccff', '#9900ff', '#ff6600', '#666666'
];

type ToolType = 'pen' | 'eraser' | 'fill' | 'line' | 'rect' | 'circle' | 'picker';

export default function PixelEditor({ lang }: Props) {
  // Initialize with default values directly to avoid useEffect race conditions
  const [size, setSize] = useState(32);
  const [pixels, setPixels] = useState<string[]>(Array(32 * 32).fill(''));
  
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [tool, setTool] = useState<ToolType>('pen');
  const [history, setHistory] = useState<string[][]>([]);
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [currentPos, setCurrentPos] = useState<{x: number, y: number} | null>(null);

  // --- Helpers ---
  const getIndex = (x: number, y: number) => {
    if (x < 0 || x >= size || y < 0 || y >= size) return -1;
    return y * size + x;
  };

  const getCoords = (index: number) => {
    return { x: index % size, y: Math.floor(index / size) };
  };

  const saveHistory = () => {
    const newHistory = [...history, [...pixels]];
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
  };

  // --- Resizing Logic ---
  const handleResize = (newSize: number) => {
    if (newSize === size) return;

    const hasContent = pixels.some(p => p !== '');
    if (hasContent) {
      const msg = lang === 'JP' 
        ? 'サイズを変更するとキャンバスがクリアされます。よろしいですか？' 
        : 'Changing size will clear the canvas. Continue?';
      if (!window.confirm(msg)) return;
    }

    // Update everything synchronously
    setSize(newSize);
    setPixels(Array(newSize * newSize).fill(''));
    setHistory([]);
    setDragStart(null);
    setCurrentPos(null);
  };

  // --- Algorithms ---
  const getLinePixels = (x0: number, y0: number, x1: number, y1: number) => {
    const points: number[] = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      points.push(getIndex(x0, y0));
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
    return points;
  };

  const getRectPixels = (x0: number, y0: number, x1: number, y1: number) => {
    const points: Set<number> = new Set();
    const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);

    for (let x = minX; x <= maxX; x++) {
      points.add(getIndex(x, minY));
      points.add(getIndex(x, maxY));
    }
    for (let y = minY; y <= maxY; y++) {
      points.add(getIndex(minX, y));
      points.add(getIndex(maxX, y));
    }
    return Array.from(points);
  };

  const getCirclePixels = (x0: number, y0: number, x1: number, y1: number) => {
    const points: Set<number> = new Set();
    const r = Math.floor(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
    let x = 0, y = r;
    let d = 3 - 2 * r;

    const addOctant = (cx: number, cy: number, x: number, y: number) => {
      points.add(getIndex(cx + x, cy + y));
      points.add(getIndex(cx - x, cy + y));
      points.add(getIndex(cx + x, cy - y));
      points.add(getIndex(cx - x, cy - y));
      points.add(getIndex(cx + y, cy + x));
      points.add(getIndex(cx - y, cy + x));
      points.add(getIndex(cx + y, cy - x));
      points.add(getIndex(cx - y, cy - x));
    };

    while (y >= x) {
      addOctant(x0, y0, x, y);
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
    }
    return Array.from(points);
  };

  const floodFill = (startIndex: number, targetColor: string, replaceColor: string) => {
    if (targetColor === replaceColor) return pixels;
    
    const newPixels = [...pixels];
    const queue = [startIndex];
    const visited = new Set([startIndex]);

    while (queue.length > 0) {
      const idx = queue.shift()!;
      newPixels[idx] = replaceColor;
      
      const { x, y } = getCoords(idx);
      const neighbors = [
        { nx: x + 1, ny: y },
        { nx: x - 1, ny: y },
        { nx: x, ny: y + 1 },
        { nx: x, ny: y - 1 }
      ];

      for (const { nx, ny } of neighbors) {
        const nIdx = getIndex(nx, ny);
        if (nIdx !== -1 && !visited.has(nIdx) && newPixels[nIdx] === targetColor) {
          visited.add(nIdx);
          queue.push(nIdx);
        }
      }
    }
    return newPixels;
  };

  // --- Handlers ---
  const handleMouseDown = (index: number) => {
    if (tool === 'picker') {
      const c = pixels[index];
      if (c) setSelectedColor(c);
      setTool('pen');
      return;
    }

    saveHistory();
    setIsDragging(true);
    const coords = getCoords(index);
    setDragStart(coords);
    setCurrentPos(coords);

    if (tool === 'fill') {
      const targetColor = pixels[index];
      const newPixels = floodFill(index, targetColor, selectedColor);
      setPixels(newPixels);
      setIsDragging(false); // Fill is instant
    } else if (tool === 'pen' || tool === 'eraser') {
      const newPixels = [...pixels];
      newPixels[index] = tool === 'pen' ? selectedColor : '';
      setPixels(newPixels);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isDragging) return;
    const coords = getCoords(index);
    setCurrentPos(coords);

    if (tool === 'pen' || tool === 'eraser') {
      const newPixels = [...pixels];
      newPixels[index] = tool === 'pen' ? selectedColor : '';
      setPixels(newPixels);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Commit Shape
    if ((tool === 'line' || tool === 'rect' || tool === 'circle') && dragStart && currentPos) {
      let indices: number[] = [];
      if (tool === 'line') indices = getLinePixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);
      if (tool === 'rect') indices = getRectPixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);
      if (tool === 'circle') indices = getCirclePixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);

      const newPixels = [...pixels];
      indices.forEach(idx => {
        if (idx !== -1) newPixels[idx] = selectedColor;
      });
      setPixels(newPixels);
    }

    setDragStart(null);
    setCurrentPos(null);
  };

  // --- Render Helpers ---
  const getDisplayPixels = () => {
    // Safety check: ensure pixels array matches current size
    if (pixels.length !== size * size) {
      return Array(size * size).fill('');
    }

    if (!isDragging || !dragStart || !currentPos) return pixels;
    if (tool === 'pen' || tool === 'eraser' || tool === 'fill') return pixels;

    const preview = [...pixels];
    let indices: number[] = [];
    
    if (tool === 'line') indices = getLinePixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);
    if (tool === 'rect') indices = getRectPixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);
    if (tool === 'circle') indices = getCirclePixels(dragStart.x, dragStart.y, currentPos.x, currentPos.y);

    indices.forEach(idx => {
      if (idx !== -1) preview[idx] = selectedColor;
    });

    return preview;
  };

  const displayPixels = getDisplayPixels();

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setPixels(prev);
    setHistory(history.slice(0, -1));
  };

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const scale = 10;
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    pixels.forEach((color, i) => {
      if (color) {
        const { x, y } = getCoords(i);
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    });

    const link = document.createElement('a');
    link.download = `pixel-art-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12 select-none">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Grid className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'ドット絵エディタ Pro' : 'Pixel Editor Pro'}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        
        {/* Tools Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-72 space-y-6">
           
           {/* Canvas Size */}
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Canvas Size</label>
             <div className="grid grid-cols-4 gap-1">
               {[16, 32, 48, 64].map(s => (
                 <button 
                   key={s} 
                   onClick={() => handleResize(s)}
                   className={`py-2 rounded-md font-bold text-xs border transition-colors ${size === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                 >
                   {s}
                 </button>
               ))}
             </div>
           </div>

           {/* Drawing Tools */}
           <div>
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tools</label>
             <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'pen', icon: Grid, label: 'Pen' },
                  { id: 'eraser', icon: Eraser, label: 'Erase' },
                  { id: 'fill', icon: PaintBucket, label: 'Fill' },
                  { id: 'picker', icon: Pipette, label: 'Pick' },
                  { id: 'line', icon: Minus, label: 'Line' },
                  { id: 'rect', icon: Square, label: 'Rect' },
                  { id: 'circle', icon: Circle, label: 'Circ' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id as ToolType)}
                    title={t.label}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${tool === t.id ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <t.icon size={20} />
                  </button>
                ))}
                <button 
                  onClick={handleUndo} 
                  disabled={history.length===0} 
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center"
                  title="Undo"
                >
                  <Undo size={20} />
                </button>
             </div>
           </div>

           {/* Palette */}
           <div>
             <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Palette</label>
                <div className="flex items-center gap-2">
                   <div 
                      className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" 
                      style={{backgroundColor: selectedColor}}
                   />
                   <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 p-1 rounded-md transition-colors">
                      <Plus size={14} className="text-slate-600" />
                      <input 
                        type="color" 
                        value={selectedColor} 
                        onChange={(e) => { setSelectedColor(e.target.value); setTool('pen'); }} 
                        className="hidden" 
                      />
                   </label>
                </div>
             </div>
             <div className="grid grid-cols-6 gap-2">
               {PRESET_COLORS.map(c => (
                 <button
                   key={c}
                   onClick={() => { setSelectedColor(c); setTool('pen'); }}
                   className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${selectedColor === c ? 'border-indigo-600 shadow-md scale-110 z-10' : 'border-transparent'}`}
                   style={{ backgroundColor: c }}
                 />
               ))}
             </div>
           </div>
           
           <div className="pt-4 border-t border-slate-100 space-y-2">
              <button onClick={() => { if(confirm(lang==='JP'?'クリアしますか？':'Clear?')) { setPixels(Array(size*size).fill('')); setHistory([]); } }} className="w-full py-2 text-rose-500 font-bold text-sm border border-rose-200 rounded-xl hover:bg-rose-50 flex items-center justify-center gap-2">
                <Trash2 size={16} /> Clear Canvas
              </button>

              <button onClick={handleDownload} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
                <Download size={18} /> Export PNG
              </button>
           </div>
        </div>

        {/* Canvas Area */}
        <div 
           className="bg-slate-200 p-4 rounded-2xl shadow-inner overflow-auto max-w-full flex justify-center items-center min-h-[500px] w-full"
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
        >
           <div 
             className="bg-white shadow-2xl cursor-crosshair touch-none"
             style={{
               display: 'grid',
               gridTemplateColumns: `repeat(${size}, 1fr)`,
               width: size >= 48 ? 'min(640px, 90vw)' : 'min(500px, 90vw)',
               aspectRatio: '1/1',
             }}
           >
             {displayPixels.map((color, i) => (
               <div
                 key={i}
                 onMouseDown={() => handleMouseDown(i)}
                 onMouseEnter={() => handleMouseEnter(i)}
                 style={{ backgroundColor: color || 'white' }}
                 className="border-[0.5px] border-slate-200/40"
               />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}