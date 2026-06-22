<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Vercel 部署連結（固定，不要每次重查）

這個專案部署在 Vercel（team slug `tim2840s-projects`，專案 `meowbudget-island`）。
當使用者問「部署 / 預覽 / 線上版 / Vercel 連結」時，**直接給下面這些連結即可，不要再用 curl 試網址、翻 PR 留言重新推導**：

- **Deployments 後台（最該收藏的一個）**：<https://vercel.com/tim2840s-projects/meowbudget-island/deployments>
  永遠不變、列出每個分支的最新部署、擁有者登入著不會 403。要看哪個分支的預覽都從這裡點進去。
- **Production（main，app 網址）**：<https://meowbudget-island.vercel.app>
- **dev 分支預覽**：<https://meowbudget-island-git-dev-tim2840s-projects.vercel.app>

注意事項：
- 部署開了 **Deployment Protection（Vercel Authentication）**，所有部署網址對**未登入**請求回 **403**。擁有者登入後可正常瀏覽；容器內 / 無痕視窗 / 他人無法直接存取，所以 agent 無法從外部 curl 或截圖 live 畫面（要驗畫面就 `npm run dev` 本機跑 + `scripts/screenshot.mjs`）。
- **feature 分支**的預覽網址含雜湊、無法從分支名推導 → 從上面的 Deployments 後台點，或開 PR 讓 Vercel 機器人自動貼預覽連結。
- 若希望連結對未登入者也能開（可分享），需到 Vercel 專案 Settings → Deployment Protection 關閉 Vercel Authentication（這是擁有者的安全決定，agent 不要擅自更動）。
