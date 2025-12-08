import { PAGES, PageConfig } from './pages';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. 静的アセット（画像、CSS、JSなど）はそのまま通過させる
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf)$/i.test(path)) {
    return next();
  }

  // 2. パスに対応する設定を取得（完全一致しない場合はトップページ設定またはデフォルトを使用）
  const config: PageConfig = PAGES[path] || PAGES['/'];

  // 3. 元のindex.htmlを取得
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

  // 4. メタデータとコンテンツの注入
  const title = config.title;
  const description = config.description;
  const content = config.content;
  const canonical = url.href;

  // Cloudflare Pagesのビルド済みHTML内のデフォルトタグを置換します
  const html = template
    .replace('<title>ToolsHub</title>', `<title>${title}</title>`)
    .replace(
      '<meta name="description" content="ToolsHub - Web Tools Collection">', 
      `<meta name="description" content="${description}">`
    )
    .replace('<!-- SSR_OUTLET -->', `
      <div id="static-content-for-crawlers" style="display:none; visibility:hidden;" aria-hidden="true">
        ${content}
      </div>
    `)
    .replace('<!-- SEO_HEAD_TAGS -->', `
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${canonical}" />
      <meta property="og:site_name" content="ToolsHub" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
    `);

  return new Response(html, {
    headers: { 
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "index, follow" 
    }
  });
};