export const onRequestGet = async (context) => {
  // 静的ファイルの sitemap.xml を返す
    const url = new URL("sitemap.xml", context.request.url);

  return context.env.ASSETS.fetch(url.toString());
};
