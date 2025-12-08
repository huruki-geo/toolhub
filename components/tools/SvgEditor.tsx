import React, { useState, useRef } from 'react';
import { PenTool, Move, Square, Circle, Triangle, Type, Download, Trash2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

type ShapeType = 'rect' | 'circle' | 'triangle' | 'text' | 'line';

interface SvgShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  // Line specific
  x2?: number;
  y2?: number;
  
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  rotation: number;
  text?: string;
  visible: boolean;
}

export default function SvgEditor({ lang }: Props) {
  const [shapes, setShapes] = useState<SvgShape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSize] = useState({ width: 800, height: 600 });
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const addShape = (type: ShapeType) => {
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;
    
    const newShape: SvgShape = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: type === 'line' ? cx - 50 : cx - 50,
      y: type === 'line' ? cy : cy - 50,
      width: 100,
      height: 100,
      x2: type === 'line' ? cx + 50 : undefined,
      y2: type === 'line' ? cy : undefined,
      
      fill: type === 'line' ? 'none' : (type === 'text' ? '#333333' : '#6366f1'),
      stroke: type === 'line' ? '#6366f1' : 'none',
      strokeWidth: type === 'line' ? 4 : 0,
      opacity: 1,
      rotation: 0,
      text: type === 'text' ? 'Text' : undefined,
      visible: true
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  const updateShape = (id: string, updates: Partial<SvgShape>) => {
    setShapes(shapes.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeShape = (id: string) => {
    setShapes(shapes.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const changeOrder = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const index = shapes.findIndex(s => s.id === selectedId);
    if (index === -1) return;
    
    const newShapes = [...shapes];
    if (direction === 'up' && index < shapes.length - 1) {
      [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]];
    } else if (direction === 'down' && index > 0) {
      [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]];
    }
    setShapes(newShapes);
  };

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const shape = shapes.find(s => s.id === id);
    if (!shape || !svgRef.current) return;

    setSelectedId(id);
    setIsDragging(true);
    
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    setDragOffset({
      x: svgP.x - shape.x,
      y: svgP.y - shape.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !svgRef.current) return;
    
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

    const shape = shapes.find(s => s.id === selectedId);
    if (shape?.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
        // Move line relatively
        const dx = svgP.x - dragOffset.x - shape.x;
        const dy = svgP.y - dragOffset.y - shape.y;
        updateShape(selectedId, {
            x: shape.x + dx,
            y: shape.y + dy,
            x2: shape.x2 + dx,
            y2: shape.y2 + dy
        });
    } else {
        updateShape(selectedId, {
            x: svgP.x - dragOffset.x,
            y: svgP.y - dragOffset.y
        });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vector-art-${Date.now()}.svg`;
    link.click();
  };

  const selectedShape = shapes.find(s => s.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-12" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <PenTool className="text-indigo-600" size={32} />
          {lang === 'JP' ? 'SVGベクターエディタ Pro' : 'SVG Vector Editor Pro'}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-200px)] min-h-[650px]">
        
        {/* Toolbar (Left) */}
        <div className="w-full lg:w-72 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 overflow-y-auto max-h-full">
           
           {/* Add Shapes */}
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'図形追加':'Add Shape'}</label>
              <div className="grid grid-cols-5 gap-2">
                 <button onClick={() => addShape('rect')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Rect">
                    <Square size={20} />
                 </button>
                 <button onClick={() => addShape('circle')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Circle">
                    <Circle size={20} />
                 </button>
                 <button onClick={() => addShape('triangle')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Triangle">
                    <Triangle size={20} />
                 </button>
                 <button onClick={() => addShape('line')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Line">
                    <Minus size={20} className="-rotate-45" />
                 </button>
                 <button onClick={() => addShape('text')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Text">
                    <Type size={20} />
                 </button>
              </div>
           </div>

           {/* Properties Panel */}
           <div className="flex-1 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block flex items-center gap-2">
                 <Move size={14} /> {lang==='JP'?'プロパティ':'Properties'}
              </label>
              
              {selectedShape ? (
                 <div className="space-y-4">
                    {/* Layer Controls */}
                    <div className="flex gap-2 mb-4">
                       <button onClick={() => changeOrder('up')} className="flex-1 bg-slate-50 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-100">
                          <ArrowUp size={12} /> {lang==='JP'?'前面へ':'Forward'}
                       </button>
                       <button onClick={() => changeOrder('down')} className="flex-1 bg-slate-50 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-100">
                          <ArrowDown size={12} /> {lang==='JP'?'背面へ':'Backward'}
                       </button>
                    </div>

                    {selectedShape.type === 'text' && (
                        <div>
                           <label className="text-xs text-slate-400 block mb-1">Text</label>
                           <input 
                             type="text" 
                             value={selectedShape.text}
                             onChange={e => updateShape(selectedShape.id, { text: e.target.value })}
                             className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                           />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="text-xs text-slate-400 block mb-1">X / X1</label>
                          <input type="number" value={Math.round(selectedShape.x)} onChange={e => updateShape(selectedShape.id, { x: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                       </div>
                       <div>
                          <label className="text-xs text-slate-400 block mb-1">Y / Y1</label>
                          <input type="number" value={Math.round(selectedShape.y)} onChange={e => updateShape(selectedShape.id, { y: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                       </div>
                    </div>

                    {selectedShape.type === 'line' ? (
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">X2</label>
                              <input type="number" value={Math.round(selectedShape.x2 || 0)} onChange={e => updateShape(selectedShape.id, { x2: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                           </div>
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Y2</label>
                              <input type="number" value={Math.round(selectedShape.y2 || 0)} onChange={e => updateShape(selectedShape.id, { y2: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                           </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Width</label>
                              <input type="number" value={Math.round(selectedShape.width)} onChange={e => updateShape(selectedShape.id, { width: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                           </div>
                           <div>
                              <label className="text-xs text-slate-400 block mb-1">Height</label>
                              <input type="number" value={Math.round(selectedShape.height)} onChange={e => updateShape(selectedShape.id, { height: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                           </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">{lang==='JP'?'塗りつぶし':'Fill'}</label>
                            <div className="flex gap-2 items-center">
                               <input type="color" value={selectedShape.fill === 'none' ? '#ffffff' : selectedShape.fill} onChange={e => updateShape(selectedShape.id, { fill: e.target.value })} disabled={selectedShape.type === 'line'} className="h-8 w-full rounded cursor-pointer disabled:opacity-50" />
                               <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                                  <input type="checkbox" checked={selectedShape.fill === 'none'} onChange={e => updateShape(selectedShape.id, { fill: e.target.checked ? 'none' : '#6366f1' })} disabled={selectedShape.type === 'line'} />
                                  None
                               </label>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">{lang==='JP'?'線':'Stroke'}</label>
                            <div className="flex gap-2 items-center">
                               <input type="color" value={selectedShape.stroke === 'none' ? '#000000' : selectedShape.stroke} onChange={e => updateShape(selectedShape.id, { stroke: e.target.value })} className="h-8 w-full rounded cursor-pointer" />
                               <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                                  <input type="checkbox" checked={selectedShape.stroke === 'none'} onChange={e => updateShape(selectedShape.id, { stroke: e.target.checked ? 'none' : '#000000' })} />
                                  None
                               </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 block mb-1">{lang==='JP'?'線の太さ':'Stroke Width'}</label>
                        <input type="range" min="0" max="20" value={selectedShape.strokeWidth} onChange={e => updateShape(selectedShape.id, { strokeWidth: Number(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Opacity ({Math.round(selectedShape.opacity * 100)}%)</label>
                        <input type="range" min="0" max="1" step="0.1" value={selectedShape.opacity} onChange={e => updateShape(selectedShape.id, { opacity: Number(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Rotation ({selectedShape.rotation}°)</label>
                        <input type="range" min="0" max="360" value={selectedShape.rotation} onChange={e => updateShape(selectedShape.id, { rotation: Number(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>
                    
                    <button 
                       onClick={() => removeShape(selectedShape.id)}
                       className="w-full mt-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 flex items-center justify-center gap-2 text-sm"
                    >
                       <Trash2 size={16} /> {lang==='JP'?'削除':'Delete'}
                    </button>
                 </div>
              ) : (
                 <div className="text-slate-400 text-sm italic text-center py-10">
                    {lang==='JP'?'図形を選択してください':'Select a shape to edit'}
                 </div>
              )}
           </div>

           {/* Export */}
           <button onClick={handleDownload} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2">
              <Download size={18} /> {lang==='JP'?'SVG保存':'Export SVG'}
           </button>
        </div>

        {/* Canvas (Center) */}
        <div className="flex-1 bg-slate-200 rounded-2xl shadow-inner overflow-auto h-full flex items-center justify-center p-8 relative">
           <div className="absolute inset-0 pointer-events-none opacity-10" style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           
           <svg 
             ref={svgRef}
             width={canvasSize.width} 
             height={canvasSize.height}
             className="bg-white shadow-2xl cursor-default"
             onMouseDown={() => setSelectedId(null)} // Deselect on bg click
           >
              {shapes.map(s => {
                 if (!s.visible) return null;
                 
                 // Rotation center
                 let cx = s.x + s.width/2;
                 let cy = s.y + s.height/2;
                 if (s.type === 'line' && s.x2 !== undefined && s.y2 !== undefined) {
                     cx = (s.x + s.x2) / 2;
                     cy = (s.y + s.y2) / 2;
                 }

                 const transform = `rotate(${s.rotation}, ${cx}, ${cy})`;
                 const isSelected = selectedId === s.id;
                 const props = {
                    key: s.id,
                    fill: s.fill,
                    stroke: s.stroke,
                    strokeWidth: s.strokeWidth,
                    opacity: s.opacity,
                    transform,
                    onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, s.id),
                    className: `cursor-move hover:opacity-80 transition-opacity ${isSelected ? 'stroke-dashed' : ''}`,
                    style: isSelected ? { outline: '1px dashed #6366f1', outlineOffset: '2px' } : undefined
                 };

                 if (s.type === 'rect') {
                    return <rect x={s.x} y={s.y} width={s.width} height={s.height} {...props} />;
                 }
                 if (s.type === 'circle') {
                    return <ellipse cx={s.x + s.width/2} cy={s.y + s.height/2} rx={s.width/2} ry={s.height/2} {...props} />;
                 }
                 if (s.type === 'triangle') {
                    const points = `${s.x + s.width/2},${s.y} ${s.x},${s.y + s.height} ${s.x + s.width},${s.y + s.height}`;
                    return <polygon points={points} {...props} />;
                 }
                 if (s.type === 'line') {
                    return <line x1={s.x} y1={s.y} x2={s.x2} y2={s.y2} {...props} />;
                 }
                 if (s.type === 'text') {
                    return (
                        <text 
                            x={s.x} 
                            y={s.y + s.height/2} 
                            fontSize={s.height/2} 
                            fontFamily="sans-serif"
                            dominantBaseline="middle"
                            {...props}
                            fill={s.fill}
                            stroke={s.stroke === 'none' ? 'none' : s.stroke}
                        >
                            {s.text}
                        </text>
                    );
                 }
                 return null;
              })}
           </svg>
        </div>
      </div>
    </div>
  );
}