# 白沙岬燈塔旅遊指南

`BaishajiaLighthouse.com` 的完整 Astro 景點網站專案。網站使用臺灣繁體中文、真實景點照片與海岸歷史視覺，內容聚焦開放資訊、交通停車、拍照指南、百年歷史與觀音海線半日遊。

## 已完成內容

- Astro 7、Tailwind CSS 4、TypeScript
- pnpm 專案設定
- Cloudflare Workers 靜態資產部署設定
- 無資料庫、無登入、無 CMS
- 響應式單頁景點首頁
- 關於本站、隱私權、照片授權與 404 頁面
- 真實照片已下載並轉為本地 WebP，不使用圖片熱連結
- GA4：`G-HXM22WWPKP`
- `TouristAttraction`、`FAQPage`、`WebSite` 結構化資料
- Canonical、Open Graph、Twitter Card、Sitemap、Robots
- CSP、安全標頭與靜態資產快取
- 系統字體，不載入第三方字型
- 僅在旅客主動點擊時開啟 Google 地圖導航

## 本機啟動

建議使用 Node.js 22 與 pnpm 10。

```bash
corepack enable
pnpm install
pnpm dev
```

開發伺服器預設位於：

```text
http://localhost:4321
```

## 檢查與建置

```bash
pnpm check
pnpm build
pnpm preview
```

建置產物位於 `dist/`。

## 部署到 Cloudflare Workers

首次使用需登入 Cloudflare：

```bash
pnpm exec wrangler login
```

部署：

```bash
pnpm deploy
```

`wrangler.jsonc` 已設定將 `dist/` 作為 Workers Static Assets 發布目錄，並使用 `404-page` 處理不存在的頁面。

### 綁定網域

部署完成後，在 Cloudflare 控制台中：

1. 開啟對應的 Workers 專案。
2. 進入「設定」→「網域與路由」。
3. 新增自訂網域 `BaishajiaLighthouse.com`。
4. 另外新增 `www.BaishajiaLighthouse.com`，再以 Redirect Rule 永久轉址到無 `www` 版本。
5. 確認 HTTPS 與 Universal SSL 已啟用。

正式網站 Canonical 已設為：

```text
https://baishajialighthouse.com
```

## 內容維護

主要內容資料集中在：

```text
src/data/site.ts
```

更新容易變動的開放資訊時，應同步檢查：

- `src/data/site.ts`
- `src/pages/index.astro` 的結構化資料

## 圖片授權

網頁使用的真實照片位於：

```text
public/images/optimized/
```

照片來源、作者、授權條款與修改說明位於：

```text
src/pages/photo-credits/index.astro
ATTRIBUTIONS.md
```

照片衍生檔繼續依各自的 CC BY-SA 3.0 或 CC BY-SA 4.0 授權使用。網站程式碼則依 `LICENSE` 的 MIT License 發布，兩者不要混淆。

## 專案結構

```text
src/
├── components/
│   ├── Footer.astro
│   ├── Header.astro
│   ├── Logo.astro
│   └── SectionHeading.astro
├── data/
│   └── site.ts
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── 404.astro
│   ├── about/
│   ├── photo-credits/
│   └── privacy/
└── styles/
    └── global.css
```
