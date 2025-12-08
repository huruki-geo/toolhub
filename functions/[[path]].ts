import { PAGES, PageConfig } from './pages';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Static Assets Pass-through
  // Fix: Ensure we are matching file extensions at the end of the path to avoid false positives like /tools/map
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf|map)$/i.test(path)) {
    return next();
  }

  // 2. Determine Page Config
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;
  
  // Normalize trailing slash (remove it unless it's root)
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }
  
  const config = PAGES[rawPath];

  // Fix: Return 404 if the page is not defined in our configuration.
  // This prevents "Soft 404" issues where Google indexes non-existent URLs as the homepage.
  if (!config) {
    return new Response("Not Found", { status: 404 });
  }

  // 3. Fetch index.html template
  // Fix: Explicitly fetch "/index.html" to ensure we get the file, not a directory listing or 404
  let template = "";
  try {
    const assetUrl = new URL("/index.html", request.url);
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

  // Fix: Encode URL for canonical tag to handle Japanese characters correctly
  const canonical = encodeURI(url.href);
  const content = config.content; 

  let html = template;
  
  // Fix: Robust Title Replacement
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  
  // Fix: Remove existing meta description to avoid duplicates before injecting new one
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, '');
  
  // Construct SEO Tags
  const seoTags = `
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
  
  // Fix: Robust Injection using Regex to handle minification whitespace
  if (/<!--\s*SEO_HEAD_TAGS\s*-->/.test(html)) {
    html = html.replace(/<!--\s*SEO_HEAD_TAGS\s*-->/, seoTags);
  } else {
    // Fallback: inject before closing head tag
    html = html.replace('</head>', `${seoTags}\n</head>`);
  }

  // Crawler Content (Insert before closing body)
  const crawlerContent = `
    <div id="static-content-for-crawlers" style="display:none; visibility:hidden;" aria-hidden="true">
      ${content}
    </div>
  `;
  html = html.replace('</body>', `${crawlerContent}\n</body>`);

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};