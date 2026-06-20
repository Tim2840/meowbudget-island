# 喵帳島 / MeowBudget Island — 專案現況

> **每個新 session 開頭必讀此檔。** 記錄目前做到哪、架構決策、待辦事項。

---

## 目前進度

| Sprint | 狀態 | 說明 |
|--------|------|------|
| Sprint 0 | ✅ 完成 | 基礎架構、Auth、i18n、Layout、所有 Store |
| Sprint 1 | ✅ 完成 | 類別名稱修正、新手教學自動觸發、島嶼視覺升級、貓貓頁修正 |
| Sprint 2 | ✅ 完成 | 報表真實資料（已接 store）、預算設定（store + UI + 月報達成率）、報表分類名稱翻譯修正 |
| Sprint 3 | ✅ 完成 | `<Cat>` sprite 元件 + 5 隻貓 sprite sheet；島嶼場景日夜/視差/粒子/貓漫步 |
| Sprint 4 | ⏳ 部分 | 任務系統 ✅ + 成就 Badge ✅（引擎+store+頁面+自動解鎖 toast）；貓咪服裝未做 |
| Sprint 5 | ✅ 完成 | 設定頁串 `useSettingsStore`（音效/動畫/通知 toggle 持久化）、動畫開關全域生效、全頁面 i18n 補完 |
| Sprint 6 | ✅ 完成 | `proxy.ts`（取代 deprecated `middleware.ts`）、PWA manifest + icons + service worker、Supabase migration SQL |

---

## 專案位置

- **本地路徑**：`/home/user/meowbudget-island/`
- **GitHub**：`https://github.com/Tim2840/meowbudget-island`（main 分支）
- **部署**：尚未部署（目標 Vercel）
- **開發指令**：`npm run dev`（在 `/home/user/meowbudget-island/` 下執行）
- **型別檢查**：`npx tsc --noEmit --project /home/user/meowbudget-island/tsconfig.json`

---

## 技術棧

| 項目 | 技術 |
|------|------|
| Framework | Next.js 15（next@16.2.9）App Router + TypeScript |
| 樣式 | Tailwind CSS v4 |
| UI 元件 | 手刻（shadcn/ui 外網不通，改手動安裝 radix 相依） |
| State | Zustand + persist（LocalStorage 樂觀更新 + Supabase 同步） |
| Backend | Supabase（懶初始化 Proxy，無 env 時純本地模式） |
| i18n | next-intl v4，語言：`zh-TW`（預設）/ `en` |
| 圖表 | Recharts |
| 路由 | `[locale]` 段（`/zh-TW/...`、`/en/...`） |
| Auth | 匿名優先 → Google OAuth / Email magic link |
| 貓咪動畫 | Sprite sheet + CSS `steps()` — 決策見下方 |

---

## 重要架構規則（勿違反）

### 1. next-intl 的 key 絕不能含有「.」
next-intl 把 `.` 視為 namespace 分隔符。messages JSON 中所有複合 key 用 `_` 而非 `.`：
- ✅ `"harbor_desc": "..."` → `t("harbor_desc")`
- ❌ `"harbor.desc": "..."` → 會解析為 `harbor` namespace 下的 `desc`，造成 INVALID_KEY 錯誤

### 2. Supabase 懶初始化（勿改回 eager）
`src/lib/supabase.ts` 使用 Proxy 延遲建立 client，避免無 `.env.local` 時模組載入就爆炸。
Supabase 尚未設定 env，目前全走本地 Zustand persist 模式。

### 3. Store 雙寫模式
所有 store：先寫 LocalStorage（Zustand persist），再嘗試 Supabase。
用 `isSupabaseConfigured()` 判斷；Supabase 失敗不 rollback 本地資料。

### 4. Recharts Tooltip formatter
`formatter` 的 value 型別是 `ValueType | undefined`，不能直接當 `number` 用：
```ts
formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)}
```

### 5. Week 定義
周報綁固定週一～週日（不是 rolling 7 天）。
計算在 `src/lib/streakUtils.ts` 的 `getWeekRange()`：`(d.getDay() + 6) % 7`。

### 6. 貓咪動畫技術選型：Sprite sheet + CSS steps()（Sprint 3/4 決策）
**選型理由**：
- 資料層已有 `CatDefinition.animations[].type`（idle/walk/lick/wave/sleep/roll），sprite sheet 自然對應
- Rive 需要外網安裝 + 學習曲線，且 .riv 需美術工具產出；sprite sheet 可直接用 PNG
- CSS `steps()` 零 JS 執行成本，效能優於 canvas 方案
- 可用 Canva MCP 產出各角色 sprite sheet 素材

**架構原則**：
- `<Cat catId animationState>` 做成獨立元件，內部實作對外透明
- Sprint 3 先用分層 SVG 或 CSS 區色 placeholder，等 Sprint 4 美術素材到位再換 sprite sheet 圖片
- sprite sheet 路徑規範：`/public/cats/{catId}/{animationType}.png`，每張橫向排列 N 幀

### 7. 場景分層架構（Sprint 3 決策）
IslandPage 場景分為 5 個獨立 CSS 層（由後到前）：
1. `sky` — 天空漸層（含日夜色調邏輯）
2. `clouds` — 雲層（緩慢漂移動畫）
3. `ocean` — 海洋（波光 SVG）
4. `island` — 島嶼本體 + 樹木
5. `cats` — 在島上漫步的貓（絕對定位，沿 zone 座標移動）

視差：滑動或 `deviceorientation` 事件驅動各層 translateX 偏移量（幅度由後到前遞增）。

---

## 已完成的檔案清單

### 核心 lib
- `src/types/index.ts` — 所有 TypeScript 型別
- `src/lib/utils.ts` — `cn()`
- `src/lib/supabase.ts` — 懶初始化 Proxy
- `src/lib/constants.ts` — DEFAULT_CATEGORIES(12), LEVEL_THRESHOLDS, ISLAND_ZONES(3), ACHIEVEMENTS(16), QUESTS(5), TUTORIAL_STEPS(5), CAT_DEFINITIONS(5)
- `src/lib/rewardEngine.ts` — `calculateReward()`, `getLevelForExp()`, `getExpProgress()`
- `src/lib/streakUtils.ts` — `todayString()`, `yesterdayString()`, `updateStreak()`, `getWeekRange()`, `getMonthRange()`, `formatYearMonth()`

### i18n
- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/middleware.ts`（deprecated warning 無害，功能正常）
- `messages/zh-TW.json` — 繁中完整翻譯
- `messages/en.json` — 英文完整翻譯

### Stores
- `src/stores/useAuthStore.ts` — 匿名/Google/Email auth
- `src/stores/useProfileStore.ts` — level, exp, streak, onboarding
- `src/stores/useWalletStore.ts` — coins, wood, fabric, fish
- `src/stores/useTransactionStore.ts` — 交易紀錄 CRUD

### App Router
- `src/app/layout.tsx` — PWA metadata, Geist font
- `src/app/page.tsx` — redirect to `/zh-TW`
- `src/app/[locale]/layout.tsx` — NextIntlClientProvider + AppInitializer + TutorialController + BottomNav
- `src/app/[locale]/page.tsx` + `island/page.tsx` + `reports/page.tsx` + `cats/page.tsx` + `settings/page.tsx`
- `src/app/globals.css` — cat animations (walk/idle/lick/bounce-in), scrollbar-none, safe-area-bottom

### Components
- `src/components/layout/AppInitializer.tsx` — 初始化 auth + 載入資料
- `src/components/layout/BottomNav.tsx` — 5 tabs，`data-tutorial` 屬性
- `src/components/record/RecordPage.tsx` — 主記帳頁（WalletBar + TransactionList + FAB + Form + RewardPopup）
- `src/components/record/WalletBar.tsx` — 資源錢包顯示條
- `src/components/record/RecordForm.tsx` — 記帳表單（底部 sheet）
- `src/components/record/RewardPopup.tsx` — 記帳後獎勵動畫彈窗
- `src/components/record/TransactionList.tsx` — 交易列表（已用 CategoryName hook）
- `src/components/record/CategoryName.tsx` — ✅ Sprint 1 新增：翻譯類別名稱元件 + hook
- `src/components/island/IslandPage.tsx` — ✅ Sprint 1 升級：2.5D 場景（天空/雲/太陽/海浪/島嶼/樹）
- `src/components/island/IslandZoneCard.tsx` — 區域卡片
- `src/components/island/LevelBar.tsx` — 等級進度條
- `src/components/reports/ReportsPage.tsx` — 報表頁（Tab 切換）
- `src/components/reports/DailyReport.tsx` — 日報（PieChart + 明細列表）
- `src/components/reports/WeeklyReport.tsx` — 週報（BarChart 7 天）
- `src/components/reports/MonthlyReport.tsx` — ✅ Sprint 2：月報（Donut + 排行）+ 預算進度條 + 設定預算入口
- `src/components/reports/BudgetSheet.tsx` — ✅ Sprint 2 新增：預算設定底部 sheet（總預算 + 各分類）
- `src/stores/useBudgetStore.ts` — ✅ Sprint 2 新增：預算 store（persist + Supabase，key = yearMonth__categoryId）
- `src/components/cats/Cat.tsx` — ✅ Sprint 3：sprite sheet 貓咪元件（CSS steps(8)）
- `public/cats/*.png` + `scripts/gen-cat-sprites.mjs` — ✅ Sprint 3：5 隻貓 sprite sheet + 生成腳本
- `src/components/cats/CatsPage.tsx` — ✅ Sprint 1 修正 + Sprint 3 改用 `<Cat>`
- `src/components/settings/SettingsPage.tsx` — 設定頁（語言/音效/登出/重看教學）
- `src/components/onboarding/TutorialOverlay.tsx` — Spotlight 教學 overlay（SVG mask）
- `src/components/onboarding/TutorialController.tsx` — ✅ Sprint 1 新增：首次進入自動觸發教學

---

## Sprint 2 — 已完成 ✅

### 已完成項目
1. ~~**報表接真實資料**~~ ✅ — `ReportsPage` 已用 `getByDateRange()` 把真實交易傳進三個報表（日/週/月），全部走真實資料。
2. ~~**報表分類名稱翻譯**~~ ✅ — DailyReport/MonthlyReport 改用 `useCategoryName()`，不再顯示原始 key。
3. ~~**預算設定**~~ ✅ — 新增 `useBudgetStore`（總預算 + 各分類，persist + Supabase）+ `BudgetSheet` 設定 UI + MonthlyReport 預算進度條（綠/琥珀/紅三色狀態 + 剩餘/超支）。

### Sprint 2 剩餘（次要，可延後）
- **點擊報表圖表跳轉** — 點某分類 → 回記帳頁並篩選該分類（尚未做）
- **Supabase schema migration** — `budgets` / `transactions` / `resource_wallets` 等 table 的 `001_initial.sql`（尚未做，目前純本地）
- **設定頁 sound/animation/notifications toggle 接 store**（仍只是 UI）

### （原始 Sprint 2 規劃，供參考）
1. **報表接真實資料** — `ReportsPage`/`DailyReport`/`WeeklyReport`/`MonthlyReport`
   - 從 `useTransactionStore.getByDateRange()` 拿交易資料
   - DailyReport：今天的交易 → PieChart 分類占比 + 明細列表
   - WeeklyReport：本週（週一到今天）→ BarChart 每日金額
   - MonthlyReport：本月 → Donut 分類占比 + 排行榜

2. **預算設定頁** — `BudgetPage` or modal：
   - 月總預算 + 各分類預算
   - Store：`useBudgetStore`（Zustand persist + Supabase）
   - MonthlyReport 的預算達成率顯示

3. **點擊報表圖表跳轉** — 點某分類 → 回到記帳頁並自動篩選該分類

### 次要項目
4. **Supabase schema migration** — 建立 `supabase/migrations/001_initial.sql`
5. **記帳後 streak 動畫強化**
6. **設定頁的 sound/animation/notifications toggle 接 store**（目前只是 UI，無實際 store）

---

## Sprint 3 待辦：視覺升級（場景 + 貓咪元件基礎）

### 場景升級（IslandPage 重構）
1. **分層場景架構**（見架構規則 §7）
   - 將現有 IslandPage 拆為 5 個 CSS 層元件：`<SkyLayer>` `<CloudLayer>` `<OceanLayer>` `<IslandLayer>` `<CatLayer>`
   - 統一層級用 `z-index: 10/20/30/40/50`

2. **視差分層**
   - 監聽 scroll（iOS: `window.addEventListener('scroll')`）或 `deviceorientation`
   - 各層 `transform: translateX(offset * speed)` ，speed 係數：sky=0.05, clouds=0.1, ocean=0.15, island=0, cats=0.2

3. **日夜色調**
   - 讀取 `new Date().getHours()`，分 4 個時段：
     - 06–17：白天（天空 sky-300）
     - 17–19：黃昏（sky→orange, 雲→粉橘）
     - 19–22：暮色（indigo-900, 雲→灰紫）
     - 22–06：深夜（slate-900, 星星出現）
   - 用 CSS transition（3s ease）讓切換滑順

4. **環境粒子動態**
   - 飄落葉子：每 3–5 秒隨機 x 位置生成，CSS animation 往下漂
   - 水面波光：SVG 多條半透明波線，opacity 0→0.4→0 循環
   - 飛鳥：每 15s 從左飄到右的小 SVG 鳥（2–3 隻群飛）
   - 升級粒子：`useProfileStore` 監聽 level 變化，觸發一次性星星迸發

5. **貓在島上漫步**
   - 新增 `<CatLayer>` 元件，把 `ISLAND_ZONES.position`（x%, y%）當成貓的目標座標
   - 每 4–8 秒隨機選一個 unlocked zone 或島上隨機點
   - CSS transition `left`/`bottom` 移動（duration 依距離計算），到達後播 idle 動畫
   - 途中播 walk 動畫（`scaleX(-1)` 判斷朝向）

### 貓咪元件抽象化
6. **`<Cat>` 元件** — `src/components/cats/Cat.tsx`
   ```
   Props: { catId: string; animationState: 'idle'|'walk'|'lick'|'wave'|'sleep'|'roll'; size?: number }
   ```
   - Sprint 3：內部先用分層 SVG placeholder（每隻不同底色/花紋/耳型）
   - Sprint 4：換成 sprite sheet 圖片，Props 介面不變

7. **CatsPage 改用 `<Cat>`** — 從 emoji 升級為 SVG 角色

---

## Sprint 4 待辦：Sprite Sheet 資產 + 貓咪服裝 + 任務

### Sprite sheet 資產
1. **素材規範**：
   - 每隻貓 × 每個動畫型別 = 一張 PNG
   - 路徑：`/public/cats/{catId}/{animationType}.png`（e.g. `captain/idle.png`）
   - 每張水平排列 8 幀，建議每幀 64×64px，整張 512×64px
   - 可用 Canva MCP 或 AI 生成，再切割

2. **動畫型別對照**（依 CAT_DEFINITIONS）：
   - captain：idle / walk / lick
   - merchant：idle / walk / wave
   - scholar：idle / sleep / lick
   - explorer：idle / walk / roll
   - streak_master：idle / walk / lick / bounce

3. **`<Cat>` 換用 sprite sheet**：
   - CSS `background-image: url(...)` + `background-position` steps
   - `@keyframes sprite-{catId}-{animType}` 搭配 `steps(8)`

### 其他 Sprint 4 項目
4. **貓咪服裝系統** — 從 wallet 資源消耗解鎖服裝，疊加 layer 顯示
5. **任務系統** — QUESTS(5) 已在 constants.ts，需 UI 頁面 + 進度追蹤
6. **Achievement Badge** — ACHIEVEMENTS(16) 完成條件判斷 + 通知

---

## 已知問題

- `middleware.ts` 有 deprecation warning（應改名為 `proxy.ts`），但功能正常，可留待 Sprint 6 處理
- Supabase 尚未串接（無 `.env.local`），目前純本地模式
- 設定頁音效/動畫/通知開關只是 UI，沒接 store

---

## 計畫文件位置

完整 PRD 與 sprint 計畫在 plan mode 生成的計畫檔：
`/root/.claude/plans/meowbudget-island-mighty-frost.md`（本機，不在 git）

Sprint 計畫摘要：
- Sprint 0：基礎架構 ✅
- Sprint 1：記帳核心（類別/Streak/EXP）✅
- Sprint 2：報表 + 預算
- Sprint 3：視覺升級（場景 + `<Cat>` 元件 + 島上漫步）
- Sprint 4：Sprite sheet 資產 + 貓咪服裝 + 任務 + Badge
- Sprint 5：教學完善 + 設定頁串 store
- Sprint 6：Polish + PWA

---

*最後更新：2026-06-19，Sprint 3/4 視覺升級計畫整合後*
