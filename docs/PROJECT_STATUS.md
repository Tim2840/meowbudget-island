# 喵帳島 / MeowBudget Island — 專案現況

> **活的 roadmap**：記錄 Sprint 進度、下一步待辦、已知問題。
> **何時讀**：規劃 / 開新功能 / 決定下一步時讀它對齊進度（定點型小修不必）。
> **何時寫**：完成有意義的功能後順手更新進度/待辦/已知問題，別讓它過時。
> 穩定的架構鐵則與慣例請看 `AGENTS.md`。

---

## 目前進度

| Sprint | 狀態 | 說明 |
|--------|------|------|
| Sprint 0 | ✅ 完成 | 基礎架構、Auth、i18n、Layout、所有 Store |
| Sprint 1 | ✅ 完成 | 類別名稱修正、新手教學自動觸發、島嶼視覺升級、貓貓頁修正 |
| Sprint 2 | ✅ 完成 | 報表已接真實資料＋圖表 ✅；新手教學逐頁導覽 ✅；兩層分類系統＋自訂分類＋主題化獎勵＋收入分析 ✅；**預算設定（useBudgetStore + BudgetManager + MonthlyReport 進度條）** ✅ |
| Sprint 3 | ✅ 完成 | 視覺升級：`<Cat>` SVG 元件 + `CatLayer` 島上漫步 + 雲朵動畫 + 日夜色調 + `ParticleLayer`（葉子/飛鳥）✅ |
| Sprint 4 | 🔄 進行中 | Sprite sheet 資產導入 + 貓咪服裝；**任務系統 ✅**；**成就系統 ✅** |
| Sprint 5 | 🔜 未開始 | 教學完善 + 設定頁串 Store |
| Sprint 6 | 🔜 未開始 | Polish + PWA |

---

## 專案位置

- **本地路徑**：`/home/user/meowbudget-island/`
- **GitHub**：`https://github.com/Tim2840/meowbudget-island`（分支流程見 AGENTS.md：`main` ← `dev` ← `claude/*`）
- **部署**：✅ 已部署 Vercel（team `tim2840s-projects`）。連結與部署保護細節見 AGENTS.md「Vercel 部署連結」。
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
| 貓咪動畫 | Sprite sheet + CSS `steps()` — 決策見下方 |

---

## 重要架構規則（勿違反）

> **穩定的架構鐵則（next-intl key 不含「.」、Supabase 懶初始化、Store 雙寫、Recharts formatter、週定義…）已上移到 `AGENTS.md`**（每個 session 必讀）。這裡只保留與未來 Sprint 綁定的前瞻設計決策。

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
- `src/lib/constants.ts` — **兩層分類** `DEFAULT_GROUPS`(15) + `DEFAULT_SUBCATEGORIES`(~60) + `LEGACY_NAMEKEY_TO_GROUP`、LEVEL_THRESHOLDS、EXP_PER_RECORD、ISLAND_ZONES、BUILDINGS、ACHIEVEMENTS、QUESTS、TUTORIAL_STEPS、CAT_DEFINITIONS（**以程式碼為準**）
- `src/stores/useCategoryStore.ts` — 兩層分類 store（合併預設+自訂、CRUD、persist）
- `src/components/settings/CategoryManager.tsx` — 分類管理 UI（新增/編輯/隱藏/刪除）
- `src/lib/rewardEngine.ts` — `calculateReward()`, `getLevelForExp()`, `getExpProgress()`
- `src/lib/streakUtils.ts` — `todayString()`, `yesterdayString()`, `updateStreak()`, `getWeekRange()`, `getMonthRange()`, `formatYearMonth()`
- `src/lib/questSelection.ts` — 確定性任務抽籤（FNV-1a + mulberry32，稀有度加權）
- `src/lib/achievementEngine.ts` — `computeProgress()` + `checkAchievements()`（可追蹤條件）

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
- `src/stores/useBudgetStore.ts` — 月總預算 + 分項預算（persist + Supabase 雙寫）
- `src/stores/useQuestStore.ts` — 任務領取狀態（每日/每週重置 + reportViewed 追蹤）
- `src/stores/useAchievementStore.ts` — 已獲得/未讀成就（persist）

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
- `src/components/cats/Cat.tsx` — ✅ Sprint 3：5 隻貓 SVG 元件（idle/walk/lick/sleep 動畫）
- `src/components/island/CatLayer.tsx` — ✅ Sprint 3：解鎖貓咪自動島上漫步
- `src/components/island/ParticleLayer.tsx` — ✅ Sprint 3：葉子飄落 + 飛鳥飛過
- `src/components/island/QuestSheet.tsx` — ✅ Sprint 4：任務底部 sheet（進度條 + 領取）
- `src/components/record/AchievementSheet.tsx` — ✅ Sprint 4：成就底部 sheet（分類 + 進度）
- `src/components/settings/BudgetManager.tsx` — ✅ Sprint 2：預算設定底部 sheet

---

## Sprint 3 完成（已全部實作）

全部完成 ✅

### 已完成
- `<Cat>` SVG 元件：5 隻貓各有獨特配色/徽記，支援 idle/walk/lick/sleep 動畫
- `CatLayer`：解鎖貓咪自動在島上漫步（CSS transition + 方向翻轉）
- 分層雲朵動畫（animate-cloud/cloud-r）+ 日夜色調覆蓋（傍晚橙/暮色靛/深夜深藍+星點）
- `ParticleLayer`：7 片帶風力飄動的彩葉 + 兩組飛鳥每 9 秒交替飛過

---

## Sprint 4 進行中：Sprite Sheet + 貓咪服裝（任務/成就已完成）

### 已完成 ✅
- **任務系統（隨機 + 稀有度）**
  - 10 日任務 + 10 週任務，各有 common/rare/epic 稀有度
  - `questSelection.ts`：FNV-1a hash + mulberry32 PRNG 確定性抽籤（第一槽保底 common）
  - `useQuestStore`：每日/每週自動重置；追蹤 reportViewedDay/Week
  - `QuestSheet`：底部 sheet，實時進度條 + 一鍵領取獎勵（金幣/EXP）
  - 首頁快捷入口（📜 任務 pill）

- **成就系統**
  - `achievementEngine.ts`：計算可追蹤成就（total_records, streak_days, zones_unlocked, cats_owned, budgets_set）
  - `useAchievementStore`：持久化已獲得/未讀取成就
  - `AchievementSheet`：按分類（記帳/連打/島嶼/貓咪/財務）展示 + 進度條
  - 記帳後自動檢查並授予；`RewardPopup` 顯示新解鎖成就
  - 首頁快捷入口（🏆 成就 pill）

### 待辦 🔜
1. **Sprite sheet 資產**（等美術素材）
   - 路徑：`/public/cats/{catId}/{animationType}.png`，水平排列 8 幀，建議 64×64px/幀
   - `<Cat>` 換 sprite sheet 後 Props 介面不變
2. **貓咪服裝系統** — 從 wallet 資源消耗解鎖服裝，疊加 layer 顯示

---

## 已知問題

- `middleware.ts` 有 deprecation warning（應改名為 `proxy.ts`），但功能正常，可留待 Sprint 6 處理
- Supabase 尚未串接（無 `.env.local`），目前純本地模式
- 設定頁音效/動畫/通知開關只是 UI，沒接 store

---

## 計畫文件位置

⚠️ 早期 plan-mode 計畫檔（`/root/.claude/plans/…`）在容器本機、**不在 git**，新 session 讀不到，勿依賴。
已 commit 進 repo 的交接/設計文件在 `docs/`（例：`docs/HANDOFF-two-tier-categories.md`）。

Sprint 計畫摘要：
- Sprint 0：基礎架構 ✅
- Sprint 1：記帳核心（類別/Streak/EXP）✅
- Sprint 2：報表 + 預算
- Sprint 3：視覺升級（場景 + `<Cat>` 元件 + 島上漫步）
- Sprint 4：Sprite sheet 資產 + 貓咪服裝 + 任務 + Badge
- Sprint 5：教學完善 + 設定頁串 store
- Sprint 6：Polish + PWA

---

*最後更新：2026-06-23，Sprint 3 完成（視覺升級）+ Sprint 4 任務/成就系統完成，PR #6 合併進 dev*
