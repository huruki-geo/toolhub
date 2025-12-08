import { PAGES, PageConfig } from './pages.ts';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  console.log(`[SSR] Request for: ${path}`);

  // 1. Static Assets Pass-through
  // Pass through files with extensions, but handle root / explicitly later
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf|map)$/i.test(path)) {
    console.log(`[SSR] Static asset detected, skipping SSR.`);
    return next();
  }

  // 2. Determine Page Config
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;
  
  // Normalize trailing slash (remove it unless it's root)
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }
  
  console.log(`[SSR] Resolved rawPath: ${rawPath} (isEn: ${isEn})`);

  const config = PAGES[rawPath];

  // Return 404 if the page is not defined in our configuration.
  if (!config) {
    console.log(`[SSR] No config found for ${rawPath}, returning 404.`);
    return new Response("Not Found", { status: 404 });
  }

  console.log(`[SSR] Config found for ${rawPath}: ${config.title}`);

  // 3. Fetch index.html template
  let template = "";
  try {
    // Explicitly fetch "/index.html" regardless of the current path
    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = ""; // Clear query params to hit static asset cache
    
    console.log(`[SSR] Fetching template from: ${indexUrl.toString()}`);
    const response = await env.ASSETS.fetch(indexUrl);
    
    console.log(`[SSR] Template fetch status: ${response.status}`);

    if (!response.ok) {
       console.log(`[SSR] Template fetch failed (not ok), falling back to next()`);
       return next();
    }
    template = await response.text();
    console.log(`[SSR] Template fetched successfully. Length: ${template.length}`);
  } catch (e) {
    console.error(`[SSR] Error fetching template:`, e);
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
  
  // Remove existing Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
  
  // Remove existing Description (Handles multiline and different attribute orders)
  html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/i, '');
  
  // Remove placeholder comment if present
  html = html.replace(/<!--\s*SEO_HEAD_TAGS\s*-->/i, '');
  
  // Construct new Head Content
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

  // Inject before closing head tag
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${newHeadContent}</head>`);
  } else {
    // Fallback if head tag is missing or malformed
    html = newHeadContent + html;
    console.warn(`[SSR] </head> tag not found, prepending head content.`);
  }

  // Crawler Content (Insert before closing body)
  const crawlerContent = `
    <div id="static-content-for-crawlers" style="display:none; visibility:hidden;" aria-hidden="true">
      ${content}
    </div>
  `;
  
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${crawlerContent}</body>`);
    console.log(`[SSR] Injected crawler content before </body>`);
  } else {
    html += crawlerContent;
    console.warn(`[SSR] </body> tag not found, appending crawler content.`);
  }

  console.log(`[SSR] Returning modified HTML response.`);

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};