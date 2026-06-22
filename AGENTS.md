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

# 分支與部署流程（所有 session 必讀）

**Branch 策略**：`main`（穩定 production）← `dev`（整合）← `claude/*`（feature，在此開發）

**開工前（先對齊最新 dev）**：
- 一律從**最新的 `dev`** 切 feature 分支：
  `git fetch origin dev` → `git checkout -B claude/<功能名> origin/dev`
- 若 session 已被系統指派某條 `claude/*` 分支，先把它對齊最新 dev：
  `git fetch origin dev && git rebase origin/dev`
- **不要**從 `main` 或別人已合併的舊 feature 分支切。

**功能完成後（合回 dev）**：
1. 在 `claude/*` 分支 commit & push
2. **對 `dev` 開 PR**（base = `dev`，絕不直接對 `main`）
3. Vercel 機器人自動在 PR 留言貼出該 feature 分支的確切預覽連結
4. 把那個連結回報給使用者，讓他登入後點開驗
5. 使用者確認後合進 `dev`（`dev → main` 的時機由使用者決定）

這樣使用者每次都能拿到可點的 Vercel 預覽連結，不需要重查。
不要直接 push 進 `dev`/`main`，也不要讓使用者自己去找連結。
