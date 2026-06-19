# 喵帳島 / MeowBudget Island — 專案現況

> **每個新 session 開頭必讀此檔。** 記錄目前做到哪、架構決策、待辦事項。

---

## 目前進度

| Sprint | 狀態 | 說明 |
|--------|------|------|
| Sprint 0 | ✅ 完成 | 基礎架構、Auth、i18n、Layout、所有 Store |
| Sprint 1 | ✅ 完成 | 類別名稱修正、新手教學自動觸發、島嶼視覺升級、貓貓頁修正 |
| Sprint 2 | ⏳ 待開始 | 報表真實資料（圖表）、預算設定 |
| Sprint 3–6 | 🔜 未開始 | 島嶼建築系統、服裝、任務、PWA polish |

---

## 專案位置

- **本地路徑**：`/home/user/meowbudget-island/`
- **GitHub**：尚未設定 remote（使用者需手動建立 repo 並提供 URL）
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
- `src/components/reports/MonthlyReport.tsx` — 月報（Donut PieChart）
- `src/components/cats/CatsPage.tsx` — ✅ Sprint 1 修正：貓貓收藏，鎖定條件顯示正確
- `src/components/settings/SettingsPage.tsx` — 設定頁（語言/音效/登出/重看教學）
- `src/components/onboarding/TutorialOverlay.tsx` — Spotlight 教學 overlay（SVG mask）
- `src/components/onboarding/TutorialController.tsx` — ✅ Sprint 1 新增：首次進入自動觸發教學

---

## Sprint 2 待辦（下個 session 應從這裡開始）

### 優先項目
1. **報表接真實資料** — `ReportsPage`/`DailyReport`/`WeeklyReport`/`MonthlyReport` 目前顯示空資料或 mock。
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
4. **Supabase schema migration** — 建立 `supabase/migrations/001_initial.sql`（schema 在計畫檔裡有完整定義）
5. **記帳後 streak 動畫強化**
6. **設定頁的 sound/animation/notifications toggle 接 store**（目前只是 UI，無實際 store）

---

## 已知問題

- `middleware.ts` 有 deprecation warning（應改名為 `proxy.ts`），但功能正常，可留待 Sprint 6 處理
- Supabase 尚未串接（無 `.env.local`），目前純本地模式
- GitHub remote 尚未設定，使用者需先在 github.com 建立 `meowbudget-island` repo

---

## 計畫文件位置

完整 PRD 與 sprint 計畫在 plan mode 生成的計畫檔：
`/root/.claude/plans/meowbudget-island-mighty-frost.md`（本機，不在 git）

Sprint 計畫摘要：
- Sprint 0：基礎架構 ✅
- Sprint 1：記帳核心（類別/Streak/EXP）✅
- Sprint 2：報表 + 預算
- Sprint 3：島嶼建築系統
- Sprint 4：貓咪服裝 + 任務 + Badge
- Sprint 5：教學完善 + 設定
- Sprint 6：Polish + PWA

---

*最後更新：2026-06-19，Sprint 1 完成後*
