import React, { useState, useRef } from 'react';
import { PenTool, Move, Square, Circle, Triangle, Type, Download, Trash2 } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  lang: Language;
}

type ShapeType = 'rect' | 'circle' | 'triangle' | 'text';

interface SvgShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
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
    const newShape: SvgShape = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: canvasSize.width / 2 - 50,
      y: canvasSize.height / 2 - 50,
      width: 100,
      height: 100,
      fill: type === 'text' ? '#333333' : '#6366f1',
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

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const shape = shapes.find(s => s.id === id);
    if (!shape || !svgRef.current) return;

    setSelectedId(id);
    setIsDragging(true);
    
    // Calculate offset relative to SVG coordinates
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

    updateShape(selectedId, {
      x: svgP.x - dragOffset.x,
      y: svgP.y - dragOffset.y
    });
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
          {lang === 'JP' ? 'SVGベクターエディタ' : 'SVG Vector Editor'}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-200px)] min-h-[600px]">
        
        {/* Toolbar (Left) */}
        <div className="w-full lg:w-64 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 overflow-y-auto max-h-full">
           
           {/* Add Shapes */}
           <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{lang==='JP'?'図形追加':'Add Shape'}</label>
              <div className="grid grid-cols-4 gap-2">
                 <button onClick={() => addShape('rect')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Rect">
                    <Square size={20} />
                 </button>
                 <button onClick={() => addShape('circle')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Circle">
                    <Circle size={20} />
                 </button>
                 <button onClick={() => addShape('triangle')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-700" title="Triangle">
                    <Triangle size={20} />
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
                          <label className="text-xs text-slate-400 block mb-1">X</label>
                          <input type="number" value={Math.round(selectedShape.x)} onChange={e => updateShape(selectedShape.id, { x: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                       </div>
                       <div>
                          <label className="text-xs text-slate-400 block mb-1">Y</label>
                          <input type="number" value={Math.round(selectedShape.y)} onChange={e => updateShape(selectedShape.id, { y: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                       </div>
                    </div>

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

                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Color</label>
                        <div className="flex gap-2">
                           <input type="color" value={selectedShape.fill} onChange={e => updateShape(selectedShape.id, { fill: e.target.value })} className="h-9 w-full rounded-lg cursor-pointer" />
                        </div>
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
                 const transform = `rotate(${s.rotation}, ${s.x + s.width/2}, ${s.y + s.height/2})`;
                 const isSelected = selectedId === s.id;
                 const props = {
                    key: s.id,
                    fill: s.fill,
                    opacity: s.opacity,
                    transform,
                    onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, s.id),
                    className: `cursor-move hover:opacity-80 transition-opacity ${isSelected ? 'stroke-2 stroke-indigo-500 stroke-dashed' : ''}`,
                    style: { strokeDasharray: '4' }
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
                 if (s.type === 'text') {
                    return (
                        <text 
                            x={s.x} 
                            y={s.y + s.height/2} 
                            fontSize={s.height/2} 
                            fontFamily="sans-serif"
                            dominantBaseline="middle"
                            {...props}
                            fill={s.fill} // Explicitly set fill for text
                        >
                            {s.text}
                        </text>
                    );
                 }
                 return null;
              })}
           </svg>
        </div>

        {/* Layers (Right - Mobile hidden/bottom?) - For simplicity, integrated in toolbar or just omitted for lightweight. Keeping it simple. */}
      </div>
    </div>
  );
}