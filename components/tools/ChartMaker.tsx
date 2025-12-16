import React, { useState, useEffect, useRef } from 'react';
import { Settings2, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { Language } from '../../src/types';

interface Props {
  lang: Language;
}

type ChartType = 'bar' | 'line' | 'pie' | 'band' | 'pictogram' | 'histogram' | 'boxplot';

export const ChartMakerComponent: React.FC<Props> = ({ lang }) => {
  const [dataText, setDataText] = useState("Apple, 30\nBanana, 50\nCherry, 20\nDate, 40\nElderberry, 65");
  const [chartTitle, setChartTitle] = useState(lang === 'JP' ? 'フルーツの売上' : 'Fruit Sales');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [unit, setUnit] = useState('');
  
  // Axis Configuration
  const [manualMax, setManualMax] = useState('');
  const [manualStep, setManualStep] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = {
    title: lang === 'JP' ? '万能グラフ作成' : 'Pro Chart Maker',
    desc: lang === 'JP' 
      ? 'データを貼り付けるだけで、プレゼン資料にも使える美しいグラフを生成します。' 
      : 'Create presentation-ready charts instantly from your data.',
    inputLabel: lang === 'JP' ? 'データ入力' : 'Data Input',
    settings: lang === 'JP' ? 'グラフ設定' : 'Settings',
    type: lang === 'JP' ? 'グラフの種類' : 'Chart Type',
    xLabel: lang === 'JP' ? '横軸ラベル' : 'X Axis Label',
    yLabel: lang === 'JP' ? '縦軸ラベル' : 'Y Axis Label',
    unitLabel: lang === 'JP' ? '単位' : 'Unit',
    maxLabel: lang === 'JP' ? '最大値 (Y-Max)' : 'Max Value',
    stepLabel: lang === 'JP' ? '目盛り間隔 (Step)' : 'Step Size',
    placeholder: lang === 'JP' ? '項目名, 値\nApple, 30\nBanana, 50' : 'Label, Value\nApple, 30\nBanana, 50',
    download: lang === 'JP' ? '画像保存' : 'Save Image',
    types: {
      bar: lang === 'JP' ? '棒グラフ (Bar)' : 'Bar Chart',
      line: lang === 'JP' ? '折れ線 (Line)' : 'Line Chart',
      pie: lang === 'JP' ? 'ドーナツ円 (Donut)' : 'Donut Chart',
      band: lang === 'JP' ? '帯グラフ (Band)' : 'Band Graph',
      pictogram: lang === 'JP' ? '絵グラフ (Picto)' : 'Pictogram',
      histogram: lang === 'JP' ? 'ヒストグラム (Hist)' : 'Histogram',
      boxplot: lang === 'JP' ? '箱ひげ図 (Box)' : 'Box Plot',
    }
  };

  useEffect(() => {
    drawChart();
  }, [dataText, chartTitle, chartType, xAxisLabel, yAxisLabel, unit, manualMax, manualStep, lang]);

  // Modern Color Palette
  const PALETTE = [
    { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' }, // Indigo
    { main: '#f43f5e', light: '#fb7185', dark: '#e11d48' }, // Rose
    { main: '#10b981', light: '#34d399', dark: '#059669' }, // Emerald
    { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' }, // Amber
    { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' }, // Cyan
    { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' }, // Violet
    { main: '#ec4899', light: '#f472b6', dark: '#db2777' }, // Pink
  ];

  const calculateAxis = (dataMax: number) => {
    let max = manualMax ? parseFloat(manualMax) : dataMax;
    let step = manualStep ? parseFloat(manualStep) : 0;

    // Auto-calculate "Nice" numbers if step is not provided
    if (!step) {
       // Rough target for number of steps (e.g., 5)
       const roughStep = max / 5; 
       const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
       const residual = roughStep / magnitude;
       
       if (residual > 5) step = 10 * magnitude;
       else if (residual > 2) step = 5 * magnitude;
       else if (residual > 1) step = 2 * magnitude;
       else step = magnitude;
    }

    // Adjust max to be a multiple of step if auto-calculating
    if (!manualMax) {
      max = Math.ceil(dataMax / step) * step;
      // Ensure we have at least a little headroom
      if (max === dataMax) max += step;
    }

    return { max, step };
  };

  const parseData = () => {
    const lines = dataText.trim().split('\n');
    
    if (chartType === 'histogram') {
      const values: number[] = [];
      lines.forEach(line => {
        const parts = line.split(/,|，|\t|\s+/);
        parts.forEach(p => {
           const v = parseFloat(p);
           if (!isNaN(v)) values.push(v);
        });
      });
      return { type: 'series', values };
    }

    if (chartType === 'boxplot') {
       const groups = lines.map(line => {
         const parts = line.split(/,|，|\t/);
         const label = parts[0].trim();
         const values = parts.slice(1).map(s => parseFloat(s)).filter(n => !isNaN(n)).sort((a,b) => a - b);
         if (values.length === 0) return null;
         
         const min = values[0];
         const max = values[values.length - 1];
         const q1 = values[Math.floor(values.length * 0.25)];
         const median = values[Math.floor(values.length * 0.5)];
         const q3 = values[Math.floor(values.length * 0.75)];
         return { label, min, max, q1, median, q3, values };
       }).filter(Boolean);
       return { type: 'stats', groups };
    }

    const data = lines.map(line => {
      const [label, valueStr] = line.split(/,|，|\t/).map(s => s.trim());
      const value = parseFloat(valueStr);
      if (label && !isNaN(value)) {
        return { label, value };
      }
      return null;
    }).filter((item): item is {label: string, value: number} => item !== null);
    
    return { type: 'standard', data };
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parsed = parseData();
    
    // High Res Setup
    const dpr = window.devicePixelRatio || 1;
    const width = 1000; // Fixed large render width
    const height = 700;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Layout Config
    const padding = { top: 100, bottom: 80, left: 100, right: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Draw Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(chartTitle, width / 2, 60);

    // Labels
    if (xAxisLabel) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText(xAxisLabel, width / 2, height - 20);
    }
    if (yAxisLabel) {
      ctx.save();
      ctx.translate(30, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }

    // --- Chart Specific Drawing ---
    
    // 1. Bar Chart
    if (chartType === 'bar' && parsed.type === 'standard') {
      const data = parsed.data as {label: string, value: number}[];
      if (data.length === 0) return;
      
      const rawMax = Math.max(...data.map(d => d.value));
      const { max, step } = calculateAxis(rawMax);
      const barW = Math.min(80, chartW / data.length * 0.7);
      const gap = (chartW - (barW * data.length)) / (data.length + 1);

      drawGrid(ctx, padding, width, height, max, step);

      data.forEach((d, i) => {
        const x = padding.left + gap + i * (barW + gap);
        const h = (d.value / max) * chartH;
        const y = height - padding.bottom - h;
        
        const color = PALETTE[i % PALETTE.length];
        
        // Gradient Bar
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, color.light);
        gradient.addColorStop(1, color.dark);
        ctx.fillStyle = gradient;
        
        // Rounded top corners
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, [8, 8, 0, 0]);
        ctx.fill();
        
        // Value on top
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.value}${unit}`, x + barW/2, y - 10);
        
        // Label bottom
        ctx.fillStyle = '#475569';
        ctx.font = '14px "Inter", sans-serif';
        wrapText(ctx, d.label, x + barW/2, height - padding.bottom + 25, barW + gap, 16);
      });
    }

    // 2. Line Chart
    else if (chartType === 'line' && parsed.type === 'standard') {
      const data = parsed.data as {label: string, value: number}[];
      if (data.length === 0) return;
      
      const rawMax = Math.max(...data.map(d => d.value));
      const { max, step } = calculateAxis(rawMax);
      const stepX = chartW / (data.length - 1 || 1);

      drawGrid(ctx, padding, width, height, max, step);

      // Line
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = PALETTE[0].main;
      ctx.shadowColor = PALETTE[0].light;
      ctx.shadowBlur = 10;
      
      const points: {x: number, y: number}[] = [];
      data.forEach((d, i) => {
        const x = padding.left + (i * stepX);
        const y = height - padding.bottom - (d.value / max) * chartH;
        points.push({x, y});
        if (i === 0) ctx.moveTo(x, y);
        else {
           // Bezier curve for smoothness
           const prev = points[i-1];
           const midX = (prev.x + x) / 2;
           ctx.bezierCurveTo(midX, prev.y, midX, y, x, y);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Dots
      points.forEach((p, i) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE[0].dark;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${data[i].value}${unit}`, p.x, p.y - 18);
        ctx.fillText(data[i].label, p.x, height - padding.bottom + 30);
      });
    }

    // 3. Donut Chart
    else if (chartType === 'pie' && parsed.type === 'standard') {
      const data = parsed.data as {label: string, value: number}[];
      if (data.length === 0) return;
      const total = data.reduce((s, d) => s + d.value, 0);
      let startAngle = -Math.PI / 2;
      const cx = width / 2 - 100;
      const cy = height / 2 + 10;
      const r = Math.min(chartW, chartH) / 2.2;
      const innerR = r * 0.6; // Donut hole

      data.forEach((d, i) => {
        const sliceAngle = (d.value / total) * Math.PI * 2;
        const color = PALETTE[i % PALETTE.length];
        
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = color.main;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Label line
        const midAngle = startAngle + sliceAngle / 2;
        const labelR = r + 20;
        const lx = cx + Math.cos(midAngle) * labelR;
        const ly = cy + Math.sin(midAngle) * labelR;
        
        const pct = Math.round((d.value / total) * 100);
        if (pct > 2) {
             ctx.beginPath();
             ctx.moveTo(cx + Math.cos(midAngle)*r, cy + Math.sin(midAngle)*r);
             ctx.lineTo(lx, ly);
             ctx.strokeStyle = '#94a3b8';
             ctx.lineWidth = 1;
             ctx.stroke();
             
             ctx.fillStyle = '#334155';
             ctx.font = 'bold 14px "Inter", sans-serif';
             ctx.textAlign = Math.cos(midAngle) > 0 ? 'left' : 'right';
             ctx.textBaseline = 'middle';
             ctx.fillText(`${d.label} (${pct}%)`, lx + (Math.cos(midAngle) > 0 ? 5 : -5), ly);
        }

        startAngle += sliceAngle;
      });

      // Center text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 32px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("Total", cx, cy - 20);
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${total}${unit}`, cx, cy + 20);

      // Legend
      const legendX = width - 200;
      data.forEach((d, i) => {
         const ly = 150 + i * 30;
         const color = PALETTE[i % PALETTE.length];
         ctx.fillStyle = color.main;
         ctx.fillRect(legendX, ly, 16, 16);
         ctx.fillStyle = '#334155';
         ctx.textAlign = 'left';
         ctx.textBaseline = 'top';
         ctx.font = '14px "Inter", sans-serif';
         ctx.fillText(`${d.label}`, legendX + 25, ly);
      });
    }

    // 4. Band Graph
    else if (chartType === 'band' && parsed.type === 'standard') {
      const data = parsed.data as {label: string, value: number}[];
      if (data.length === 0) return;
      const total = data.reduce((s, d) => s + d.value, 0);
      let currentX = padding.left;
      const barH = 120;
      const y = height / 2 - 60;
      const barTotalW = chartW;

      // Draw Main Band
      data.forEach((d, i) => {
        const w = (d.value / total) * barTotalW;
        const color = PALETTE[i % PALETTE.length];
        
        ctx.fillStyle = color.main;
        ctx.fillRect(currentX, y, w, barH);
        
        // Separator
        ctx.fillStyle = '#fff';
        ctx.fillRect(currentX + w - 2, y, 2, barH);
        
        // Pct Label inside
        if (w > 50) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 18px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.round(d.value/total*100)}%`, currentX + w/2, y + barH/2);
        }

        // Connecting Line & Label
        const ly = y + barH + 30 + (i % 3) * 30; 
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(currentX + w/2, y + barH);
        ctx.lineTo(currentX + w/2, ly - 15);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.label} (${d.value}${unit})`, currentX + w/2, ly);

        currentX += w;
      });
      
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(padding.left, y, barTotalW, barH);
    }

    // 5. Pictogram
    else if (chartType === 'pictogram' && parsed.type === 'standard') {
      const data = parsed.data as {label: string, value: number}[];
      if (data.length === 0) return;
      
      const rowH = chartH / data.length;
      
      data.forEach((d, i) => {
        const y = padding.top + i * rowH + rowH/2;
        const color = PALETTE[i % PALETTE.length];
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.label, padding.left - 20, y);

        // Draw circles
        const iconStart = padding.left;
        const iconSize = 24;
        const gap = 8;
        const iconCount = d.value; 
        
        let displayCount = iconCount;
        let scaleText = '';
        if (iconCount > 15) {
            displayCount = 10;
            scaleText = '...';
        }

        ctx.fillStyle = color.main;
        for(let k=0; k<displayCount; k++) {
             ctx.beginPath();
             ctx.arc(iconStart + k * (iconSize + gap) + iconSize/2, y, iconSize/2, 0, Math.PI*2);
             ctx.fill();
        }
        
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${scaleText} ${d.value}${unit}`, iconStart + displayCount * (iconSize+gap) + 10, y);
      });
    }

    // 6. Histogram
    else if (chartType === 'histogram' && parsed.type === 'series') {
       const values = parsed.values as number[];
       if (values.length === 0) return;
       const min = Math.min(...values);
       
       const rawMaxVal = Math.max(...values);
       
       const binCount = Math.ceil(Math.sqrt(values.length)) + 2; 
       const range = rawMaxVal - min + 0.001; 
       const binWidth = range / binCount;
       const bins = new Array(binCount).fill(0);
       
       values.forEach(v => {
         const idx = Math.floor((v - min) / binWidth);
         if(idx >= 0 && idx < binCount) bins[idx]++;
       });
       
       const maxBinH = Math.max(...bins);
       const { max, step } = calculateAxis(maxBinH);

       drawGrid(ctx, padding, width, height, max, step);
       
       const barW = chartW / binCount;
       bins.forEach((count, i) => {
         const h = (count / max) * chartH;
         const x = padding.left + i * barW;
         const y = height - padding.bottom - h;
         
         const color = PALETTE[2]; // Emerald
         const gradient = ctx.createLinearGradient(x, y, x, y+h);
         gradient.addColorStop(0, color.light);
         gradient.addColorStop(1, color.dark);
         ctx.fillStyle = gradient;

         ctx.fillRect(x, y, barW - 2, h);
         
         // Label range
         if (i % 2 === 0 || binCount < 8) {
           const rangeStart = Math.round((min + i * binWidth)*10)/10;
           ctx.fillStyle = '#64748b';
           ctx.font = '12px "Inter", sans-serif';
           ctx.textAlign = 'center';
           ctx.fillText(`${rangeStart}`, x, height - padding.bottom + 20);
         }
       });
    }

    // 7. Box Plot
    else if (chartType === 'boxplot' && parsed.type === 'stats') {
       const groups = parsed.groups as any[];
       if (groups.length === 0) return;
       
       const globalMax = Math.max(...groups.map(g => g.max));
       
       const { max, step } = calculateAxis(globalMax);

       const boxW = Math.min(60, chartW / groups.length * 0.5);
       const stepX = chartW / (groups.length);

       // Box plot usually needs a custom min, but here we assume 0 baseline for grid 
       // or we need to calculate range properly. For now, let's use the standard grid 0 to Max
       // and if min is negative, we'd need to adjust. Assuming positive for simplicity or just fit.
       
       // Let's refine grid to handle min/max if we wanted perfect box plots, 
       // but for this request (fixing ticks), let's stick to standard 0-Max grid.
       
       drawGrid(ctx, padding, width, height, max, step, 0); 

       groups.forEach((g, i) => {
         const cx = padding.left + stepX * i + stepX/2;
         const mapY = (val: number) => height - padding.bottom - (val / max) * chartH; 

         const yMin = mapY(g.min);
         const yMax = mapY(g.max);
         const yQ1 = mapY(g.q1);
         const yQ3 = mapY(g.q3);
         const yMed = mapY(g.median);
         
         const color = PALETTE[i % PALETTE.length];

         ctx.strokeStyle = '#334155';
         ctx.lineWidth = 2;
         
         // Whiskers
         ctx.beginPath();
         ctx.moveTo(cx, yMin); ctx.lineTo(cx, yMax);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(cx - 15, yMin); ctx.lineTo(cx + 15, yMin);
         ctx.moveTo(cx - 15, yMax); ctx.lineTo(cx + 15, yMax);
         ctx.stroke();

         // Box
         ctx.fillStyle = color.light + '80'; // transparent
         ctx.fillRect(cx - boxW/2, yQ3, boxW, yQ1 - yQ3);
         ctx.strokeStyle = color.dark;
         ctx.lineWidth = 2;
         ctx.strokeRect(cx - boxW/2, yQ3, boxW, yQ1 - yQ3);

         // Median
         ctx.strokeStyle = '#1e293b';
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.moveTo(cx - boxW/2, yMed);
         ctx.lineTo(cx + boxW/2, yMed);
         ctx.stroke();
         
         // Label
         ctx.fillStyle = '#334155';
         ctx.font = 'bold 14px "Inter", sans-serif';
         ctx.textAlign = 'center';
         ctx.fillText(g.label, cx, height - padding.bottom + 30);
       });
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, p: any, w: number, h: number, maxVal: number, step: number, minVal: number = 0) => {
    // Y Axis Line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.left, p.top);
    ctx.lineTo(p.left, h - p.bottom);
    ctx.stroke();

    // X Axis Line
    ctx.beginPath();
    ctx.moveTo(p.left, h - p.bottom);
    ctx.lineTo(w - p.right, h - p.bottom);
    ctx.stroke();

    const chartH = h - p.top - p.bottom;
    const range = maxVal - minVal;
    
    // Safety check for infinite loops
    if (step <= 0) step = maxVal / 5;

    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.font = '14px "Inter", sans-serif';
    ctx.textBaseline = 'middle';
    
    // Draw ticks based on Step
    for(let val = minVal; val <= maxVal + (step/1000); val += step) {
       // Avoid floating point errors (e.g., 0.300000004)
       const roundedVal = Math.round(val * 10000) / 10000;
       
       if (roundedVal > maxVal && roundedVal - maxVal > step/2) break;

       const y = (h - p.bottom) - ((roundedVal - minVal) / range) * chartH;
       
       // Grid line
       if (roundedVal > minVal) {
         ctx.strokeStyle = '#f1f5f9';
         ctx.lineWidth = 1;
         ctx.beginPath();
         ctx.moveTo(p.left, y); ctx.lineTo(w - p.right, y);
         ctx.stroke();
       }
       
       // Label
       ctx.fillText(roundedVal + unit, p.left - 15, y);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];
    
    for(let n = 0; n < words.length; n++) {
      testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lineArray.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lineArray.push(line);
    for(let k = 0; k < lineArray.length; k++) {
      ctx.fillText(lineArray[k], x, y + k * lineHeight);
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `chart-${chartType}-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="text-indigo-600" size={40} />
            {t.title}
        </h2>
        <p className="text-lg text-slate-600">{t.desc}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold border-b pb-3">
                <Settings2 size={20} className="text-indigo-600" />
                {t.settings}
             </div>
             
             <div className="space-y-5">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.type}</label>
                 <div className="relative">
                    <select 
                        value={chartType} 
                        onChange={(e) => setChartType(e.target.value as ChartType)}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                        <option value="bar">{t.types.bar}</option>
                        <option value="line">{t.types.line}</option>
                        <option value="pie">{t.types.pie}</option>
                        <option value="band">{t.types.band}</option>
                        <option value="pictogram">{t.types.pictogram}</option>
                        <option value="histogram">{t.types.histogram}</option>
                        <option value="boxplot">{t.types.boxplot}</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                 </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.title}</label>
                 <input 
                    type="text" 
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.xLabel}</label>
                    <input type="text" value={xAxisLabel} onChange={e => setXAxisLabel(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.yLabel}</label>
                    <input type="text" value={yAxisLabel} onChange={e => setYAxisLabel(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.maxLabel}</label>
                    <input type="number" value={manualMax} onChange={e => setManualMax(e.target.value)} placeholder="Auto" className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.stepLabel}</label>
                    <input type="number" value={manualStep} onChange={e => setManualStep(e.target.value)} placeholder="Auto" className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/>
                 </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">{t.unitLabel}</label>
                  <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="%, kg, etc"/>
               </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block ml-1">{t.inputLabel}</label>
            <div className="relative">
              <textarea
                value={dataText}
                onChange={(e) => setDataText(e.target.value)}
                className="w-full h-80 p-4 rounded-2xl border border-slate-300 bg-white text-slate-900 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none shadow-sm leading-relaxed"
                placeholder={t.placeholder}
              />
            </div>
            <p className="text-xs text-slate-500 ml-1">
              {chartType === 'histogram' ? '10, 20, 30... (Simple List)' : 
               chartType === 'boxplot' ? 'Group A, 10, 20, 30... (One group per line)' : 
               'Label, Value (Standard)'}
            </p>
          </div>
        </div>

        {/* Preview (Right) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-slate-100 rounded-3xl p-6 md:p-8 overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner min-h-[500px] relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
             <canvas 
               ref={canvasRef}
               className="max-w-full h-auto bg-white shadow-2xl rounded-xl z-10 transform transition-transform hover:scale-[1.01] duration-500"
             />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              <ImageIcon size={20} />
              {t.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartMakerComponent;