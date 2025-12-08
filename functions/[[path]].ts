import { PAGES, PageConfig } from './pages';

export const onRequest = async (context: any) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. 静的アセット（画像、CSS、JSなど）はそのまま通過させる
  if (/\.(css|js|png|jpg|jpeg|gif|ico|json|svg|woff|woff2|ttf)$/i.test(path)) {
    return next();
  }

  // 2. パスに対応する設定を取得
  // /en/tools/xxx の場合は /tools/xxx の設定を取得する
  const isEn = path.startsWith('/en/') || path === '/en';
  const rawPath = isEn ? (path.replace(/^\/en/, '') || '/') : path;
  
  const config: PageConfig = PAGES[rawPath] || PAGES['/'];

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
  // 英語ページの場合は簡易的にタイトルとディスクリプションを調整 (理想的にはpages.tsに多言語対応を持たせる)
  let title = config.title;
  let description = config.description;

  if (isEn) {
    // 簡易的な英語対応: タイトルから日本語部分を除去するか、デフォルトの英語表記に置換
    // 注: 本来はpages.tsを構造化すべきだが、既存の静的コンテンツ構造を維持しつつURL分離を実現するため、
    // ここではToolsHubというブランド名と汎用的な英語説明をセットする等の処理を行う
    if (path === '/en') {
       title = "ToolsHub - Simple & Free Web Tools";
       description = "Privacy-focused, lightweight web tools collection. Timer, Calculator, Chart Maker, and more. No installation required.";
    } else {
       // 個別ツールページの場合、タイトル末尾の | ToolsHub を維持しつつ、もし日本語が含まれていたら英語に...という処理は複雑なため、
       // 汎用的に suffix を英語にする程度に留める
       title = title.replace(' | ToolsHub', ' | ToolsHub (EN)');
    }
  }

  const content = config.content; // クローラー用コンテンツは日本語のまま(多言語化は今後の課題として)
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