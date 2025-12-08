import React, { useState, useEffect, Suspense, startTransition } from 'react';
import { Layout } from './components/Layout';
import { ToolCard } from './components/ToolCard';
import { TOOLS } from './constants';
import { Language, ToolId, ViewState } from './types';
import { Loader2, Zap, Wrench, Palette, Heart } from 'lucide-react';
import { SEOHead } from './components/SEOHead';
import { PageGuide } from './components/PageGuide';

// Lazy load tool components
const ScheduleFormatter = React.lazy(() => import('./components/tools/ScheduleFormatter'));
const RomajiConverter = React.lazy(() => import('./components/tools/RomajiConverter'));
const ChartMaker = React.lazy(() => import('./components/tools/ChartMaker'));
const CalorieChecker = React.lazy(() => import('./components/tools/CalorieChecker'));
const PaletteGen = React.lazy(() => import('./components/tools/PaletteGen'));
const FocusTimer = React.lazy(() => import('./components/tools/FocusTimer'));
const LogTimer = React.lazy(() => import('./components/tools/LogTimer'));
const MultiTimer = React.lazy(() => import('./components/tools/MultiTimer'));
const SimpleTimer = React.lazy(() => import('./components/tools/SimpleTimer'));
const HabitPal = React.lazy(() => import('./components/tools/HabitPal'));
const BrowserNotepad = React.lazy(() => import('./components/tools/BrowserNotepad'));
const PixelEditor = React.lazy(() => import('./components/tools/PixelEditor'));
const TaxChecker = React.lazy(() => import('./components/tools/TaxChecker'));
const SvgEditor = React.lazy(() => import('./components/tools/SvgEditor'));
const CalendarEditor = React.lazy(() => import('./components/tools/CalendarEditor'));
const CryptoTool = React.lazy(() => import('./components/tools/CryptoTool'));
const EncodingConverter = React.lazy(() => import('./components/tools/EncodingConverter'));
// New Tools
const GanttChart = React.lazy(() => import('./components/tools/GanttChart'));
const QuoteFormatter = React.lazy(() => import('./components/tools/QuoteFormatter'));
const MinutesFormatter = React.lazy(() => import('./components/tools/MinutesFormatter'));
const InvoiceGenerator = React.lazy(() => import('./components/tools/InvoiceGenerator'));
const TierMaker = React.lazy(() => import('./components/tools/TierMaker'));

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Derived state from URL
  const getRouteState = (pathname: string): { lang: Language, view: ViewState } => {
    const isEn = pathname.startsWith('/en/') || pathname === '/en';
    // Remove '/en' prefix to find the tool path
    const rawPath = isEn ? (pathname.replace(/^\/en/, '') || '/') : pathname;
    
    // Find tool by matching path
    // Exact match or match with trailing slash handled by normalize
    const tool = TOOLS.find(t => t.path === rawPath || t.path === rawPath.replace(/\/$/, ''));
    
    return {
      lang: isEn ? 'EN' : 'JP',
      view: tool ? tool.id : 'HOME'
    };
  };

  const { lang, view } = getRouteState(currentPath);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Link Interceptor for SPA navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Check if it's an internal link
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        // Use startTransition to prioritize UI responsiveness
        startTransition(() => {
          setCurrentPath(href);
          window.scrollTo(0, 0);
        });
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  // Cleanup Server SEO Content on Client Mount
  useEffect(() => {
    const seoContent = document.getElementById('server-seo-content');
    if (seoContent) {
      seoContent.remove();
    }
    // Also remove old class based wrapper if it exists from previous version cache
    const oldWrapper = document.querySelector('.server-content-wrapper');
    if (oldWrapper) {
      oldWrapper.remove();
    }
  }, []);

  const renderContent = () => {
    switch (view) {
      case ToolId.SCHEDULE_FORMATTER:
        return <Suspense fallback={<LoadingSpinner />}><ScheduleFormatter lang={lang} /></Suspense>;
      case ToolId.ROMAJI_CONVERTER:
        return <Suspense fallback={<LoadingSpinner />}><RomajiConverter lang={lang} /></Suspense>;
      case ToolId.CHART_MAKER:
        return <Suspense fallback={<LoadingSpinner />}><ChartMaker lang={lang} /></Suspense>;
      case ToolId.CALORIE_CHECKER:
        return <Suspense fallback={<LoadingSpinner />}><CalorieChecker lang={lang} /></Suspense>;
      case ToolId.PALETTE_GEN:
        return <Suspense fallback={<LoadingSpinner />}><PaletteGen lang={lang} /></Suspense>;
      case ToolId.FOCUS_TIMER:
        return <Suspense fallback={<LoadingSpinner />}><FocusTimer lang={lang} /></Suspense>;
      case ToolId.LOG_TIMER:
        return <Suspense fallback={<LoadingSpinner />}><LogTimer lang={lang} /></Suspense>;
      case ToolId.MULTI_TIMER:
        return <Suspense fallback={<LoadingSpinner />}><MultiTimer lang={lang} /></Suspense>;
      case ToolId.SIMPLE_TIMER:
        return <Suspense fallback={<LoadingSpinner />}><SimpleTimer lang={lang} /></Suspense>;
      case ToolId.HABIT_PAL:
        return <Suspense fallback={<LoadingSpinner />}><HabitPal lang={lang} /></Suspense>;
      case ToolId.BROWSER_NOTEPAD:
        return <Suspense fallback={<LoadingSpinner />}><BrowserNotepad lang={lang} /></Suspense>;
      case ToolId.PIXEL_EDITOR:
        return <Suspense fallback={<LoadingSpinner />}><PixelEditor lang={lang} /></Suspense>;
      case ToolId.TAX_THRESHOLD:
        return <Suspense fallback={<LoadingSpinner />}><TaxChecker lang={lang} /></Suspense>;
      case ToolId.SVG_EDITOR:
        return <Suspense fallback={<LoadingSpinner />}><SvgEditor lang={lang} /></Suspense>;
      case ToolId.CALENDAR_EDITOR:
        return <Suspense fallback={<LoadingSpinner />}><CalendarEditor lang={lang} /></Suspense>;
      case ToolId.CRYPTO_TOOL:
        return <Suspense fallback={<LoadingSpinner />}><CryptoTool lang={lang} /></Suspense>;
      case ToolId.ENCODING_CONVERTER:
        return <Suspense fallback={<LoadingSpinner />}><EncodingConverter lang={lang} /></Suspense>;
      case ToolId.GANTT_CHART:
        return <Suspense fallback={<LoadingSpinner />}><GanttChart lang={lang} /></Suspense>;
      case ToolId.QUOTE_FORMATTER:
        return <Suspense fallback={<LoadingSpinner />}><QuoteFormatter lang={lang} /></Suspense>;
      case ToolId.MINUTES_FORMATTER:
        return <Suspense fallback={<LoadingSpinner />}><MinutesFormatter lang={lang} /></Suspense>;
      case ToolId.INVOICE_GENERATOR:
        return <Suspense fallback={<LoadingSpinner />}><InvoiceGenerator lang={lang} /></Suspense>;
      case ToolId.TIER_MAKER:
        return <Suspense fallback={<LoadingSpinner />}><TierMaker lang={lang} /></Suspense>;
      case 'HOME':
      default:
        // Define categories for grouping
        const CATEGORIES = [
          { id: 'Productivity', labelJp: '仕事・効率化', labelEn: 'Productivity', icon: Zap, color: 'text-amber-500' },
          { id: 'Utility', labelJp: '便利ツール', labelEn: 'Utility', icon: Wrench, color: 'text-slate-500' },
          { id: 'Design', labelJp: '画像・デザイン', labelEn: 'Design', icon: Palette, color: 'text-indigo-500' },
          { id: 'Health', labelJp: '健康・生活', labelEn: 'Health', icon: Heart, color: 'text-rose-500' },
        ] as const;

        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-16 space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'JP' ? (
                   <>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">ToolPark</span>
                     .info
                   </>
                ) : (
                   <>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">ToolPark</span>
                     .info
                   </>
                )}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {lang === 'JP' 
                  ? 'インストール不要、広告なし、プライバシー重視。あなたの作業を少しだけ楽にする、便利なWebツール広場です。'
                  : 'A privacy-first collection of lightweight utilities. No server uploads, no loading screens, just instant results.'}
              </p>
            </div>

            <div className="space-y-20">
              {CATEGORIES.map((category) => {
                const categoryTools = TOOLS.filter(t => t.category === category.id);
                if (categoryTools.length === 0) return null;

                return (
                  <section key={category.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                      <div className={`p-2 bg-slate-50 rounded-lg ${category.color}`}>
                        <category.icon size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {lang === 'JP' ? category.labelJp : category.labelEn}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryTools.map((tool) => (
                        <ToolCard 
                          key={tool.id} 
                          tool={tool} 
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <Layout 
      lang={lang} 
      currentPath={currentPath}
    >
      <SEOHead view={view} lang={lang} />
      {renderContent()}
      <PageGuide currentPath={currentPath} lang={lang} />
    </Layout>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-64">
    <Loader2 className="animate-spin text-emerald-600" size={48} />
  </div>
);

export default App;