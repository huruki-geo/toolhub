export const onRequestGet = async (context) => {
  // 静的ファイルの sitemap.xml を返す
  return await context.env.ASSETS.fetch("../public/sitemap.xml");
};
