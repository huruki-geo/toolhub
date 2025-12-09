export const onRequestGet = async (context) => {
  const url = new URL("sitemap.xml", context.request.url);

  // ASSETS（dist/）にある sitemap.xml を取得
  return await context.env.ASSETS.fetch(url.toString());
};

export const onRequestHead = async (context) => {
  const url = new URL("sitemap.xml", context.request.url);

  const res = await context.env.ASSETS.fetch(url.toString());

  // HEAD：ボディなし、ヘッダーだけ返す
  return new Response(null, {
    status: res.status,
    headers: res.headers,
  });
};
