// Workers Static Assets：處理 HTTP → HTTPS 的 301 轉址，其餘請求交由靜態資產處理。
// 說明：Workers 靜態資產不支援網域級 _redirects，故以 Worker 統一 HTTP/HTTPS。
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
