import React from 'react';
import { LayoutGrid, Globe, Github } from 'lucide-react';
import { Language } from '../src/types';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  currentPath: string; // Add currentPath to determine link destinations
}

export const Layout: React.FC<LayoutProps> = ({ children, lang, currentPath }) => {
  
  // Calculate the URL for the other language
  const getToggleLangUrl = () => {
    if (lang === 'JP') {
      // JP -> EN: Add /en prefix
      // If current is '/', result is '/en'
      // If current is '/tools/xyz', result is '/en/tools/xyz'
      return currentPath === '/' ? '/en' : `/en${currentPath}`;
    } else {
      // EN -> JP: Remove /en prefix
      // If current is '/en', result is '/'
      // If current is '/en/tools/xyz', result is '/tools/xyz'
      return currentPath.replace(/^\/en/, '') || '/';
    }
  };

  const homeUrl = lang === 'EN' ? '/en' : '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a 
              href={homeUrl}
              className="flex items-center gap-2 cursor-pointer group" 
            >
              <div className="p-2 rounded-lg bg-emerald-600 text-white group-hover:bg-emerald-700 transition-colors shadow-sm">
                <LayoutGrid size={22} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                ToolPark<span className="text-slate-400 font-normal text-lg">.info</span>
              </span>
            </a>
            
            <nav className="flex items-center gap-3 md:gap-4">
              <a 
                href={homeUrl}
                className={`text-base font-medium px-4 py-2 rounded-full transition-all ${currentPath === '/' || currentPath === '/en' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {lang === 'JP' ? 'ツール一覧' : 'Tools'}
              </a>
              
              <div className="h-5 w-px bg-slate-300 mx-1 hidden md:block"></div>
              
              <a 
                href={getToggleLangUrl()}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-white hover:text-emerald-600 transition-all shadow-sm"
                aria-label="Switch Language"
              >
                <Globe size={16} />
                <span>{lang}</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">ToolPark.info</span>
              <span className="text-slate-400">© 2024</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <span className="hover:text-slate-900 cursor-pointer">
                <a href="https://toolpark.info/legal-pages">
                  {lang === 'JP' ? 'プライバシーポリシー、利用規約、免責事項' : 'Privacy Policy / Terms of Service / Disclaimer'}
                </a>
              </span>
            </div>
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 cursor-pointer transition-colors">
                <Github size={18} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};