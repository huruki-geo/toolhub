import { PAGES, PageConfig } from './pages.ts';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`[SSR] START Request: ${path}`);

  // 1. Static Assets Pass-through
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf|map)$/i.test(path)) {
    console.log(`[SSR] Skipping static asset: ${path}`);
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
    console.log(`[SSR] No config found for ${rawPath}. Returning 404.`);
    return new Response("Not Found", { status: 404 });
  }

  console.log(`[SSR] Config found: ${config.title}`);

  // 3. Fetch index.html template
  let template = "";
  try {
    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = ""; 
    
    console.log(`[SSR] Attempting to fetch template from: ${indexUrl.toString()}`);
    
    // Perform fetch
    const response = await env.ASSETS.fetch(indexUrl);
    
    console.log(`[SSR] Fetch response status: ${response.status}`);
    
    if (!response.ok) {
       console.error(`[SSR] CRITICAL: Failed to fetch index.html. Status: ${response.status}. Falling back to next().`);
       return next();
    }
    
    template = await response.text();
    console.log(`[SSR] Template fetched successfully. Length: ${template.length}`);
    
    if (template.length < 50) {
        console.warn(`[SSR] Template seems suspiciously short: "${template}"`);
    }

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
      console.log(`[SSR] Removed existing <title> tag.`);
  } else {
      console.warn(`[SSR] <title> tag NOT found in template.`);
  }
  
  // Replace Description
  const descRegex = /<meta[^>]*name=["']description["'][^>]*>/i;
  if (descRegex.test(html)) {
      html = html.replace(descRegex, '');
      console.log(`[SSR] Removed existing description meta tag.`);
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
    console.log(`[SSR] Injected new head content.`);
  } else {
    html = newHeadContent + html;
    console.warn(`[SSR] </head> not found, prepending head content.`);
  }

  const crawlerContent = `
    <div id="static-content-for-crawlers" style="display:none; visibility:hidden;" aria-hidden="true">
      ${content}
    </div>
  `;
  
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${crawlerContent}</body>`);
    console.log(`[SSR] Injected crawler content.`);
  } else {
    html += crawlerContent;
    console.warn(`[SSR] </body> not found, appending crawler content.`);
  }

  console.log(`[SSR] DONE. Returning modified HTML.`);

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};