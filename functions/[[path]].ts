import { PAGES_JP } from '../src/data/pages.ts';
import { PAGES_EN } from '../src/data/pages.en.ts';

// 静的ファイルのパスはぜんぶ ASSETS に逃がす
const STATIC_FILE_PATTERN = /\.(css|js|png|jpg|jpeg|gif|ico|json|svg|xml|txt|woff|woff2|ttf|map)$/i;

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Static Assets Pass-through
  if (STATIC_FILE_PATTERN.test(path)) {
    return env.ASSETS.fetch(request); // ← 重要！ next() ではダメ!!
  }

  console.log(`[SSR] START Request: ${path}`);

  // === 以下は元の SSR ロジックそのまま ===
  const isEn = path.startsWith('/en/') || path === '/en';
  let rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;

  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    rawPath = rawPath.slice(0, -1);
  }

  console.log(`[SSR] Path resolution: ${path} -> ${rawPath} (isEn: ${isEn})`);

  const collection = isEn ? PAGES_EN : PAGES_JP;
  const config = collection[rawPath];

  if (!config) {
    return new Response("Not Found", { status: 404 });
  }

  // Fetch template
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

  // Inject content (略)
  // ↓ あなたのまま使ってOK

  let title = config.title;
  let description = config.description;

  const canonical = encodeURI(url.href);
  const content = config.content;

  let html = template;

  const titleRegex = /<title>[\s\S]*?<\/title>/i;
  if (titleRegex.test(html)) html = html.replace(titleRegex, '');

  const descRegex = /<meta[^>]*name=["']description["'][^>]*>/i;
  if (descRegex.test(html)) html = html.replace(descRegex, '');

  html = html.replace(/<!--\s*SEO_HEAD_TAGS\s*-->/i, '');

  const newHeadContent = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://toolpark.info/ogp.png">
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="Quikit.info" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  `;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${newHeadContent}</head>`);
  } else {
    html = newHeadContent + html;
  }

  const hiddenSEOContent = `
    <div id="server-seo-content" style="display:none; visibility:hidden;" aria-hidden="true">
      ${content}
    </div>
  `;

  if (html.includes('</body>')) {
    html = html.replace('</body>', `${hiddenSEOContent}</body>`);
  } else {
    html += hiddenSEOContent;
  }

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow"
    }
  });
};
