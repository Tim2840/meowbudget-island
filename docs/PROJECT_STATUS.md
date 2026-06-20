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
| Sprint 4 | ✅ 完成 | 任務系統 + 成就 Badge（引擎 + store + 頁面 + 自動解鎖 toast）；貓咪服裝延後（待美術素材） |
| Sprint 5 | ✅ 完成 | 設定頁串 `useSettingsStore`（音效/動畫/通知 toggle 持久化）、動畫開關全域生效、全頁面 i18n 補完 |
| Sprint 6 | ✅ 完成 | `proxy.ts`（取代 deprecated `middleware.ts`）、PWA manifest + icons + service worker、Supabase migration SQL |
| 建造系統 | ✅ 完成 | 島嶼建造系統（BUILDINGS × 10、useBuildingStore、BuildingModal、ZoneBuildingsSheet、user_buildings table） |
| 收尾打磨 | ✅ 完成 | 區域卡片點擊 → 建築清單 sheet；i18n navigation 修正（404 fix）；任務描述 key 修正 |

---

## 專案位置

- **本地路徑**：`/home/user/meowbudget-island/`
- **GitHub**：`https://github.com/Tim2840/meowbudget-island`（main 分支）
- **開發分支**：`claude/code-file-to-repo-r7x9i2`
- **部署**：尚未部署（目標 Vercel；需使用者提供 Supabase env keys）
- **開發指令**：`npm run dev`（在 `/home/user/meowbudget-island/` 下執行）
- **型別檢查**：`npx tsc --noEmit`

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
| 貓咪動畫 | Sprite sheet + CSS `steps()` |

---

## 重要架構規則（勿違反）

### 1. next-intl 的 key 絕不能含有多個「.」
next-intl 把 `.` 視為 namespace 分隔符。messages JSON 中 key 只能有一個 `.`（namespace.key），複合 key 用 `_` 連接：
- ✅ `"quest.daily_record_3_desc"` → `t("quest.daily_record_3_desc")` = namespace `quest`、key `daily_record_3_desc`
- ❌ `"quest.daily_record_3.desc"` → next-intl 試圖在 `quest.daily_record_3` 物件下找 `desc`，造成 INVALID_KEY

### 2. 路由需用 locale-aware Link/usePathname
使用 `src/i18n/navigation.ts` 匯出的 `Link`、`usePathname`、`useRouter`（由 `createNavigation(routing)` 產生），而非 `next/link`。`localePrefix: "always"` 下，原生 `next/link` 不會加前綴，導致 404。

### 3. Supabase 懶初始化（勿改回 eager）
`src/lib/supabase.ts` 使用 Proxy 延遲建立 client，避免無 `.env.local` 時模組載入就爆炸。
Supabase 尚未設定 env，目前全走本地 Zustand persist 模式。

### 4. Store 雙寫模式
所有 store：先寫 LocalStorage（Zustand persist），再嘗試 Supabase。
用 `isSupabaseConfigured()` 判斷；Supabase 失敗不 rollback 本地資料。

### 5. Recharts Tooltip formatter
`formatter` 的 value 型別是 `ValueType | undefined`，不能直接當 `number` 用：
```ts
formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)}
```

### 6. Week 定義
周報綁固定週一～週日（不是 rolling 7 天）。
計算在 `src/lib/streakUtils.ts` 的 `getWeekRange()`：`(d.getDay() + 6) % 7`。

### 7. 貓咪動畫技術選型：Sprite sheet + CSS steps()
- `<Cat catId animationState>` 獨立元件，sprite sheet 路徑：`/public/cats/{catId}/{animationType}.png`
- Sprint 3 起已換用真實 sprite sheet

### 8. 場景分層架構
IslandPage 場景共 8 層（z-index 由低到高）：
星空(10) → 日月(20) → 雲層+落葉(30) → 海洋(40) → 島嶼+樹木(50) → Zone icon(60) → 建造地塊(62) → 貓咪(65)

---

## 已完成的檔案清單

### 核心 lib
- `src/types/index.ts` — 所有 TypeScript 型別（含 Building、UserBuilding、BuildingLevelCost）
- `src/lib/utils.ts` — `cn()`
- `src/lib/supabase.ts` — 懶初始化 Proxy
- `src/lib/constants.ts` — DEFAULT_CATEGORIES(12)、LEVEL_THRESHOLDS、ISLAND_ZONES(3)、BUILDINGS(10)、ACHIEVEMENTS(16)、QUESTS(5)、TUTORIAL_STEPS(5)、CAT_DEFINITIONS(5)
- `src/lib/rewardEngine.ts` — `calculateReward()`、`getLevelForExp()`、`getExpProgress()`
- `src/lib/streakUtils.ts` — `todayString()`、`updateStreak()`、`getWeekRange()`、`formatYearMonth()`
- `src/lib/progressEngine.ts` — `evaluateAchievements()`、`evaluateQuests()`、ProgressStats 介面（含 `buildingsBuilt`）
- `src/lib/useProgressStats.ts` — 聚合所有 store 資料為 ProgressStats hook

### i18n
- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/i18n/navigation.ts` — `createNavigation(routing)` 匯出 locale-aware Link/usePathname/useRouter
- `src/proxy.ts` — 取代 deprecated middleware.ts
- `messages/zh-TW.json` — 繁中完整翻譯（含 zone/island/building namespace）
- `messages/en.json` — 英文完整翻譯

### Stores
- `src/stores/useAuthStore.ts` — 匿名/Google/Email auth
- `src/stores/useProfileStore.ts` — level、exp、streak、onboarding
- `src/stores/useWalletStore.ts` — coins、wood、fabric、fish；`spendResources()` 含餘額檢查
- `src/stores/useTransactionStore.ts` — 交易紀錄 CRUD
- `src/stores/useBudgetStore.ts` — 預算 store（總預算 + 各分類，persist + Supabase）
- `src/stores/useSettingsStore.ts` — 音效/動畫/通知 toggle（persist + Supabase）
- `src/stores/useQuestStore.ts` — 任務進度 + 報表查看追蹤
- `src/stores/useAchievementStore.ts` — 成就達成追蹤 + toast 觸發
- `src/stores/useBuildingStore.ts` — 建築 CRUD；`buildOrUpgrade()` 呼叫 `spendResources()`

### App Router
- `src/app/layout.tsx` — PWA metadata、Geist font
- `src/app/page.tsx` — redirect to `/zh-TW`
- `src/app/[locale]/layout.tsx` — NextIntlClientProvider + AppInitializer + TutorialController + BottomNav
- `src/app/[locale]/page.tsx` + `island/page.tsx` + `reports/page.tsx` + `cats/page.tsx` + `settings/page.tsx` + `quests/page.tsx` + `achievements/page.tsx`

### Components — 記帳
- `src/components/layout/AppInitializer.tsx` — 初始化 auth + 載入所有 store（含 loadBuildings）
- `src/components/layout/BottomNav.tsx` — 5 tabs，locale-aware Link
- `src/components/record/RecordPage.tsx`、`WalletBar.tsx`、`RecordForm.tsx`、`RewardPopup.tsx`、`TransactionList.tsx`、`CategoryName.tsx`

### Components — 島嶼建造
- `src/components/island/IslandPage.tsx` — 場景、zone 卡片、slot 點位、BuildingModal/ZoneBuildingsSheet 整合
- `src/components/island/IslandZoneCard.tsx` — 區域卡片（可點擊，顯示 X/Y 棟建築進度）
- `src/components/island/ZoneBuildingsSheet.tsx` — 區域建築清單 bottom sheet（狀態徽章、等級進度條）
- `src/components/island/BuildingModal.tsx` — 建築資訊 + 費用 + 建造/升級按鈕
- `src/components/island/LevelBar.tsx`

### Components — 其他
- `src/components/reports/ReportsPage.tsx`、`DailyReport.tsx`、`WeeklyReport.tsx`、`MonthlyReport.tsx`、`BudgetSheet.tsx`
- `src/components/cats/Cat.tsx`、`CatsPage.tsx`
- `src/components/settings/SettingsPage.tsx`
- `src/components/onboarding/TutorialOverlay.tsx`、`TutorialController.tsx`
- `src/components/quests/QuestsPage.tsx`
- `src/components/achievements/AchievementsPage.tsx`

### Infrastructure
- `public/manifest.json` + `public/sw.js` — PWA
- `supabase/migrations/001_initial.sql` — profiles、transactions、resource_wallets、budgets、user_settings、user_buildings（含 RLS）

---

## 已知問題 / 技術負債

### npm audit（8 個漏洞）
**決策：保留現狀，不執行 `npm audit fix --force`。**

所有漏洞只能透過 `--force` 修復，會強制降版至 `next@9.3.3`、`next-pwa@2.0.2`（breaking change，build 會失敗）。
受影響套件均為建置/開發期 transitive deps（`postcss` 在 `next` 底下；`serialize-javascript` 在 `next-pwa` 底下），非執行期對外暴露的攻擊面。

待上游 `next` / `next-intl` / `next-pwa` 釋出修補版本後再處理。

---

## 待辦（優先順序）

| 項目 | 說明 |
|------|------|
| **部署 + Supabase** | 需使用者提供 Supabase project URL + anon key，填入 `.env.local` 並設定 Vercel env vars |
| **貓咪服裝系統** | 需美術素材（服裝圖層 PNG）；`useCatStore`、購買 UI、服裝疊加渲染 |
| **報表圖表點擊篩選** | 點報表分類 → 回記帳頁並自動篩選（低優先） |

---

*最後更新：2026-06-20，建造系統 + 收尾打磨完成後*
