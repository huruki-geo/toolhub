import React from 'react';
import { PAGES_JP } from '../src/data/pages';
import { PAGES_EN } from '../src/data/pages.en';
import { Language } from '../src/types';

interface PageGuideProps {
  currentPath: string;
  lang: Language;
}

export const PageGuide: React.FC<PageGuideProps> = ({ currentPath, lang }) => {
  // Normalize path to match keys in PAGES
  // If we are in EN mode (e.g., /en/tools/xyz), we need to look up /tools/xyz
  let lookupPath = currentPath;
  if (lang === 'EN') {
    lookupPath = currentPath.replace(/^\/en/, '') || '/';
  }
  
  // Handle trailing slashes if necessary, though our setup usually strips them
  if (lookupPath.length > 1 && lookupPath.endsWith('/')) {
    lookupPath = lookupPath.slice(0, -1);
  }

  const collection = lang === 'EN' ? PAGES_EN : PAGES_JP;
  const config = collection[lookupPath];

  if (!config) return null;

  return (
    <div className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-16 text-slate-600">
        <div className="server-content-style">
            <style>{`
                .server-content-style h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; letter-spacing: -0.025em; }
                .server-content-style h2 { font-size: 1.5rem; font-weight: 700; color: #334155; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
                .server-content-style p { margin-bottom: 1.25rem; line-height: 1.75; }
                .server-content-style ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                .server-content-style li { margin-bottom: 0.5rem; line-height: 1.6; }
                .server-content-style strong { font-weight: 700; color: #475569; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: config.content }} />
        </div>
      </div>
    </div>
  );
};