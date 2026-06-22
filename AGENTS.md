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

# 專案架構與慣例（所有 session 必讀）

## 本地優先（local-first）
- 狀態用 zustand + `persist` 存 localStorage；Supabase 為**選用**（`isSupabaseConfigured()`）。
- 無後端時用穩定本地使用者 `id: "local-user"`（見 `useAuthStore`），app 全程可離線運作。記帳/錢包/分類都讀寫 localStorage。
- 新增 store 沿用現有寫法（參考 `useProfileStore.ts` / `useCategoryStore.ts`）。
- **Store 雙寫**：先寫 localStorage（zustand persist）→ 再嘗試 Supabase；Supabase 失敗**不 rollback** 本地資料。
- **Supabase client 是懶初始化 Proxy**（`src/lib/supabase.ts`），用前**一律先 `isSupabaseConfigured()` 守衛**（沒設定就 throw）；**勿改回 eager 初始化**。env：`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`。**repo 內沒有 schema / migration SQL**（資料表在 Supabase 端管）。

## 浮層 / 彈窗規則（防被截、防被導覽列蓋住）— 這個坑犯過兩次
- 底部彈窗 / modal 一律 `z-[60]`，要**蓋過 `BottomNav`（`z-50`）**，否則導覽列會蓋住底部按鈕。
- 浮層結構：外層 `max-h-[90vh] flex flex-col`；中段內容 `flex-1 min-h-0 overflow-y-auto`；主要操作鈕放**釘底的 footer**，footer 加 `pb-[calc(env(safe-area-inset-bottom)+1rem)]`。
- **不要**把主要按鈕（如儲存）放進會捲動的內容區 → 表單一變高就會被推出畫面。

## 路由 / i18n（next-intl v4）
- 設定在 `src/i18n/routing.ts`：locales `zh-TW`（預設）/ `en`，`localePrefix: "always"`；middleware 走 `createMiddleware(routing)`。
- 記帳頁就是首頁 `src/app/[locale]/page.tsx`，**沒有**獨立 `/record`；全站路由有 locale 前綴（`/zh-TW`、`/en`）。
- 任何新文案都要**同時**加 `messages/zh-TW.json` 與 `messages/en.json`（缺一邊會顯示原始 key）。
- ⚠️ **i18n key 絕不能含「.」** —— next-intl 把 `.` 當 namespace 分隔。複合 key 用 `_`：`"harbor_desc"` ✅ → `t("harbor_desc")`；`"harbor.desc"` ❌ 會被解析成 `harbor` namespace 下的 `desc` → INVALID_KEY。

## 分類 ↔ 島嶼經濟耦合
- 分類驅動島嶼資源產出（`src/lib/rewardEngine.ts` 的 `calculateReward`）。新增/修改分類時，要一併設計獎勵（`resourceType` / `resourceAmount` / `bonusCoins`）。
- 分類為兩層（大類 `CategoryGroup` → 子類 `Category`，含 `groupKey`）；資料模型細節見 `docs/HANDOFF-two-tier-categories.md`，但**以程式碼為準**。
- **所有遊戲/經濟可調數值都集中在 `src/lib/constants.ts`**：分類、`LEVEL_THRESHOLDS`、`EXP_PER_RECORD`、`EXP_STREAK_BONUS`、`ISLAND_ZONES`、`BUILDINGS`、`ACHIEVEMENTS`、`QUESTS`、`TUTORIAL_STEPS`、`CAT_DEFINITIONS`。要調平衡/加內容先看這裡。

## 技術棧與品質關卡
- Next.js 16（App Router）+ TypeScript（strict）、Tailwind **v4**、zustand、next-intl v4、Recharts、Supabase（選用）。
- ⚠️ **Tailwind v4，沒有 `tailwind.config.js`**（CSS-first，設定在 `postcss.config.mjs` + globals）；別假設 v3 那套去找/建 config 檔。
- **專案沒有測試框架**（無 jest/vitest）。驗證關卡＝`npx tsc --noEmit` + `npm run build` + `eslint`（+ 需要時本機截圖），別去找或假設有 test suite。
- **Recharts Tooltip `formatter`** 的 value 型別是 `ValueType | undefined`，不能直接當 `number`：
  `formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)}`
- **週定義 = 固定週一～週日**（非 rolling 7 天）；計算在 `src/lib/streakUtils.ts` 的 `getWeekRange()`（`(getDay()+6)%7`）。

## 本機驗證（截圖）
- 跑 `npm run dev`（port 3000）+ `node scripts/screenshot.mjs <url-path> <out.png>` 截圖。
- ⚠️ 首次進入有新手教學浮層會擋住自動操作。繞過：載入前注入 localStorage —
  `meow_profile` = `{"state":{"profile":{"id":"local-user","onboardingCompleted":true,"language":"zh-TW","level":1,"exp":0,"currentStreak":0,"longestStreak":0,"lastRecordDate":null,"createdAt":"2026-01-01T00:00:00.000Z"}},"version":0}`
  （`id` 必須是 `local-user`，否則 `loadProfile` 會重置掉這份 profile）。
- Vercel 部署有 Auth 保護（403），容器內**無法** curl / 截 live 畫面，只能本機跑來驗。

# 進度文件 `docs/PROJECT_STATUS.md`（活的 roadmap，按需讀寫）

這個檔記錄 Sprint 進度、下一步待辦、已知問題（穩定的架構鐵則已上移到本檔上方，不放那裡）。

- **何時讀**：任務是**規劃 / 開新功能 / 決定下一步**（開放式、要對齊整體進度）時，先讀它對齊現況與待辦。定點型小任務（修某個 bug、改某個元件）**不必**讀。
- **何時寫**：當你**完成一個有意義的功能**（改變了進度或架構決策）時，順手更新它（進度表 / 待辦 / 已知問題），別讓它再過時。純小修不必動。
