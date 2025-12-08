import { PAGES, PageConfig } from './pages';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Pass-through for static assets
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf|map)$/i.test(path)) {
    return next();
  }

  // 2. Determine Page Config
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;
  
  // Normalize trailing slash (except for root)
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }
  
  const config: PageConfig = PAGES[rawPath] || PAGES['/'];

  // 3. Fetch index.html template
  let template = "";
  try {
    const assetUrl = new URL("/", request.url);
    const response = await env.ASSETS.fetch(assetUrl);
    if (!response.ok) {
       return next();
    }
    template = await response.text();
  } catch (e) {
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

  const content = config.content; 
  const canonical = url.href;

  let html = template;
  
  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  
  // Replace Description
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${description}">`);
  } else {
    html = html.replace('</title>', `</title>\n    <meta name="description" content="${description}">`);
  }

  // SEO Tags
  const seoTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="ToolsHub" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  `;
  
  if (html.includes('<!-- SEO_HEAD_TAGS -->')) {
    html = html.replace('<!-- SEO_HEAD_TAGS -->', seoTags);
  } else {
    html = html.replace('</head>', `${seoTags}\n  </head>`);
  }

  // Crawler Content (Insert before closing body to ensure it exists)
  const crawlerContent = `
    <div id="static-content-for-crawlers" style="display:none; visibility:hidden;" aria-hidden="true">
      ${content}
    </div>
  `;
  html = html.replace('</body>', `${crawlerContent}\n  </body>`);

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};