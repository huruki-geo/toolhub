import { PAGES_JP } from '../src/data/pages';
import { PAGES_EN } from '../src/data/pages.en';
import { TOOLS } from '../src/constants';

const STATIC_FILE_PATTERN = /\.(css|js|png|jpg|jpeg|gif|ico|json|svg|xml|txt|woff|woff2|ttf|map)$/i;

// ツールコンポーネントのSSRレンダリング用の簡易HTMLジェネレーター
const generateToolHTML = (toolId: string, lang: 'JP' | 'EN') => {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return '';

  const title = lang === 'JP' ? tool.nameJp : tool.name;
  const desc = lang === 'JP' ? tool.description.jp : tool.description.en;

  return `
    <div class="max-w-4xl mx-auto py-16 px-4">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">${title}</h1>
        <p class="text-lg text-slate-600">${desc}</p>
      </div>
      <div class="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
        <div class="flex items-center justify-center h-64">
          <div class="text-center text-slate-400">
            <svg class="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="font-medium">${lang === 'JP' ? '読み込み中...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ホームページのSSRレンダリング
const generateHomeHTML = (lang: 'JP' | 'EN') => {
  const CATEGORIES = [
    { id: 'Productivity', labelJp: '仕事・効率化', labelEn: 'Productivity' },
    { id: 'Utility', labelJp: '便利ツール', labelEn: 'Utility' },
    { id: 'Design', labelJp: '画像・デザイン', labelEn: 'Design' },
    { id: 'Health', labelJp: '健康・生活', labelEn: 'Health' },
  ];

  let html = `
    <div class="animate-in fade-in duration-500">
      <div class="text-center mb-10 space-y-6">
        <h1 class="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">ToolPark</span>.info
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ${lang === 'JP' 
            ? 'インストール不要、広告なし、プライバシー重視。あなたの作業を少しだけ楽にする、便利なWebツール広場です。'
            : 'A privacy-first collection of lightweight utilities. No server uploads, no loading screens, just instant results.'}
        </p>
      </div>
  `;

  CATEGORIES.forEach(cat => {
    const categoryTools = TOOLS.filter(t => t.category === cat.id && t.isImplemented);
    if (categoryTools.length === 0) return;

    html += `
      <section id="${cat.id}" class="mb-20">
        <div class="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
          <h2 class="text-2xl font-bold text-slate-800">
            ${lang === 'JP' ? cat.labelJp : cat.labelEn}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    `;

    categoryTools.forEach(tool => {
      const href = lang === 'EN' ? `/en${tool.path}` : tool.path;
      const displayName = lang === 'JP' ? tool.nameJp : tool.name;
      const displayDesc = lang === 'JP' ? tool.description.jp : tool.description.en;

      html += `
        <a href="${href}" class="group relative p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col justify-between bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 block">
          <div>
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              ${displayName}
            </h3>
            ${lang === 'JP' ? `<div class="text-sm font-medium text-slate-500 mb-3 font-mono">${tool.name}</div>` : ''}
            <p class="text-base text-slate-600 leading-relaxed">
              ${displayDesc}
            </p>
          </div>
        </a>
      `;
    });

    html += `
        </div>
      </section>
    `;
  });

  html += '</div>';
  return html;
};

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. 静的ファイルはそのまま返す
  if (STATIC_FILE_PATTERN.test(path)) {
    return env.ASSETS.fetch(request);
  }

  console.log(`[SSR] Processing: ${path}`);

  // 2. パス解析
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;

  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }

  const lang: 'JP' | 'EN' = isEn ? 'EN' : 'JP';

  // 3. ページ設定を取得
  const collection = isEn ? PAGES_EN : PAGES_JP;
  const config = collection[rawPath];

  if (!config) {
    return new Response("Not Found", { status: 404 });
  }

  // 4. テンプレートHTML取得
  let template = "";
  try {
    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";

    const response = await env.ASSETS.fetch(indexUrl);
    if (!response.ok) {
      console.error(`[SSR] Failed to fetch index.html`);
      return next();
    }

    template = await response.text();
  } catch (e) {
    console.error(`[SSR] Exception:`, e);
    return next();
  }

  // 5. コンテンツ生成
  let contentHTML = '';
  
  // ホームページかツールページかを判定
  if (rawPath === '/') {
    // ホームページ
    contentHTML = generateHomeHTML(lang);
  } else {
    // ツールページ - ツールIDを抽出
    const toolId = rawPath.split('/').pop() || '';
    const tool = TOOLS.find(t => t.path === rawPath);
    
    if (tool) {
      contentHTML = generateToolHTML(tool.id, lang);
    } else {
      // 設定されたコンテンツをそのまま使用
      contentHTML = config.content;
    }
  }

  // 6. メタタグの準備
  const title = config.title;
  const description = config.description;
  const canonical = encodeURI(url.href);

  // 7. HTML組み立て
  let html = template;

  // 既存のtitleとdescriptionを削除
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/i, '');
  html = html.replace(/<!--\s*SEO_HEAD_TAGS\s*-->/i, '');

  // 新しいメタタグ
  const headContent = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://toolpark.info/ogp.png">
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="toolpark.info" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  `;

  html = html.replace('</head>', `${headContent}</head>`);

  // 8. SSRコンテンツを#rootに直接注入
  const ssrContent = `
    <div id="root">
      <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <!-- Header -->
        <header class="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200/60">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <a href="${lang === 'EN' ? '/en' : '/'}" class="flex items-center gap-2 group">
                <div class="p-2 rounded-lg bg-emerald-600 text-white group-hover:bg-emerald-700 transition-colors shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span class="font-bold text-xl tracking-tight text-slate-900">
                  ToolPark<span class="text-slate-400 font-normal text-lg">.info</span>
                </span>
              </a>
              
              <nav class="flex items-center gap-3 md:gap-4">
                <a href="${lang === 'EN' ? '/en' : '/'}" class="text-base font-medium px-4 py-2 rounded-full transition-all ${rawPath === '/' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                  ${lang === 'JP' ? 'ツール一覧' : 'Tools'}
                </a>
                <div class="h-5 w-px bg-slate-300 mx-1 hidden md:block"></div>
                <a href="${lang === 'EN' ? rawPath.replace(/^\/en/, '') || '/' : `/en${rawPath}`}" class="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full border border-slate-200 hover:border-emerald-300 hover:bg-white hover:text-emerald-600 transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>${lang}</span>
                </a>
              </nav>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          ${contentHTML}
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-200 bg-white">
          <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-12 lg:px-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-900">ToolPark.info</span>
                <span class="text-slate-400">© 2024</span>
              </div>
              <div class="flex gap-6 text-sm text-slate-500">
                <span class="hover:text-slate-900 cursor-pointer">
                  ${lang === 'JP' ? 'プライバシー' : 'Privacy'}
                </span>
                <span class="hover:text-slate-900 cursor-pointer">
                  ${lang === 'JP' ? '利用規約' : 'Terms'}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `;

  html = html.replace(/<div id="root"><\/div>/, ssrContent);

  // 9. 追加のSEOコンテンツ（ページガイド）
  if (config.content && rawPath !== '/') {
    const seoContent = `
      <div class="bg-slate-50 border-t border-slate-200">
        <div class="max-w-4xl mx-auto px-6 py-16 text-slate-600">
          <style>
            .server-content-style h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; }
            .server-content-style h2 { font-size: 1.5rem; font-weight: 700; color: #334155; margin-top: 2.5rem; margin-bottom: 1rem; }
            .server-content-style p { margin-bottom: 1.25rem; line-height: 1.75; }
            .server-content-style ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .server-content-style li { margin-bottom: 0.5rem; }
          </style>
          <div class="server-content-style">
            ${config.content}
          </div>
        </div>
      </div>
    `;
    html = html.replace('</body>', `${seoContent}</body>`);
  }

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow",
      "cache-control": "public, max-age=3600"
    }
  });
};