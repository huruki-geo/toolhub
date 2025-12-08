import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { ToolMeta, Language } from '../types';

interface ToolCardProps {
  tool: ToolMeta;
  lang: Language;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, lang }) => {
  const Icon = tool.icon;
  const displayName = lang === 'JP' ? tool.nameJp : tool.name;
  const displayDesc = lang === 'JP' ? tool.description.jp : tool.description.en;

  // Construct URL based on language
  // JP: /tools/tool-name
  // EN: /en/tools/tool-name
  const href = lang === 'EN' ? `/en${tool.path}` : tool.path;

  const cardContent = (
    <>
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-2xl ${tool.isImplemented ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-slate-200 text-slate-400'} transition-colors duration-300`}>
            <Icon size={32} />
          </div>
          {!tool.isImplemented && <Lock size={20} className="text-slate-400" />}
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {displayName}
        </h3>
        {lang === 'JP' && <div className="text-sm font-medium text-slate-500 mb-3 font-mono">{tool.name}</div>}
        
        <p className="text-base text-slate-600 leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {tool.isImplemented && (
        <div className="mt-6 flex justify-end">
          <div className="p-2 rounded-full bg-slate-50 text-indigo-600 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight size={24} />
          </div>
        </div>
      )}
    </>
  );

  if (tool.isImplemented) {
    return (
      <a 
        href={href}
        className="group relative p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col justify-between bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer hover:-translate-y-1 block"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="group relative p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col justify-between bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed">
      {cardContent}
    </div>
  );
};