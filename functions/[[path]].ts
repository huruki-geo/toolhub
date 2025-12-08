import { PAGES, PageConfig } from './pages.ts';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`[SSR] START Request: ${path}`);

  // 1. Static Assets Pass-through
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf|map)$/i.test(path)) {
    return next();
  }

  // 2. Determine Page Config
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;
  
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }
  
  console.log(`[SSR] Path resolution: ${path} -> ${rawPath} (isEn: ${isEn})`);

  const config = PAGES[rawPath];

  if (!config) {
    return new Response("Not Found", { status: 404 });
  }

  // 3. Fetch index.html template
  let template = "";
  try {
    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = ""; 
    
    const response = await env.ASSETS.fetch(indexUrl);
    
    if (!response.ok) {
       console.error(`[SSR] Failed to fetch index.html. Status: ${response.status}`);
       return next();
    }
    template = await response.text();
  } catch (e) {
    console.error(`[SSR] EXCEPTION fetching template:`, e);
    return next();
  }

  // 4. Inject Metadata & Content
  let title = config.title;
  let description = config.description;

  if (isEn) {
    if (rawPath === '/') {
       title = "ToolsHub - Simple & Free Web Tools";
       description = "Privacy-focused, lightweight web tools collection. Timer, Calculator, Chart Maker, and more. No installation required.";
    } else {
       title = title.replace(' | ToolsHub', ' | ToolsHub (EN)');
    }
  }

  const canonical = encodeURI(url.href);
  const content = config.content; 

  let html = template;
  
  // Replace Title
  const titleRegex = /<title>[\s\S]*?<\/title>/i;
  if (titleRegex.test(html)) {
      html = html.replace(titleRegex, '');
  }
  
  // Replace Description
  const descRegex = /<meta[^>]*name=["']description["'][^>]*>/i;
  if (descRegex.test(html)) {
      html = html.replace(descRegex, '');
  }
  
  html = html.replace(/<!--\s*SEO_HEAD_TAGS\s*-->/i, '');
  
  const newHeadContent = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="ToolsHub" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  `;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${newHeadContent}</head>`);
  } else {
    html = newHeadContent + html;
  }

  // Inject visible content with styling styles to restore defaults reset by Tailwind
  // We place this content visible at the bottom of the page.
  // The styles ensure headers and lists look correct.
  const visibleContent = `
    <div class="server-content-wrapper bg-slate-50 border-t border-slate-200">
      <div class="max-w-4xl mx-auto px-6 py-16 text-slate-600">
        <style>
          .server-content-wrapper h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; letter-spacing: -0.025em; }
          .server-content-wrapper h2 { font-size: 1.5rem; font-weight: 700; color: #334155; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
          .server-content-wrapper p { margin-bottom: 1.25rem; line-height: 1.75; }
          .server-content-wrapper ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
          .server-content-wrapper li { margin-bottom: 0.5rem; line-height: 1.6; }
          .server-content-wrapper strong { font-weight: 700; color: #475569; }
        </style>
        ${content}
      </div>
    </div>
  `;
  
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${visibleContent}</body>`);
  } else {
    html += visibleContent;
  }

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};