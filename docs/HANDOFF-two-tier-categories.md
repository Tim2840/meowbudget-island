# 交接：兩層分類 + 自訂分類 + 主題化獎勵 + 收入分析

> 這份文件是給「接手實作兩層分類功能」的新 session 的交接包。
> 上一個 session 已完成驗證與分支整備，**功能本身尚未開始實作**。

---

## TL;DR（接手者先看這段）

1. **在哪開發**：分支 `claude/vercel-canvas-deployment-w4pb69`（已 rebase 到最新 `dev`，與 `origin/dev` 對齊、無多餘 commit）。
2. **基底已驗證**：`dev` 分支（含 PR #4 全部修復）已通過 `tsc --noEmit` 與 `npm run build`，14 頁正常產生。可放心在此基礎上開發。
3. **要做什麼**：把目前 **12 個扁平分類** 改成 **大類→子類兩層 + 使用者自訂 + 主題化獎勵 + 報表收入分析**。完整計畫見下方〈實作計畫〉。
4. **Git 身份**：新 commit 前先 `git config user.email noreply@anthropic.com && git config user.name Claude`（本分支既有歷史是從 dev 繼承的，**不要改寫**）。
5. **分支規範**：所有開發與 push 都走 `claude/vercel-canvas-deployment-w4pb69`，push 用 `git push -u origin <branch>`。**未經明示不要開 PR、不要 push 到別的分支**。

---

## 目前狀態（已完成 / 未完成）

### 已完成
- PR #4（新手教學逐頁導覽 + 全站修復精緻化）已 merge 進 `dev`（merge commit `6d185d6`）。
- PR #3 已關閉（內容已被 PR #4 涵蓋）。
- `main` 保持乾淨（`d8b6f87`），未被汙染。
- `dev` 分支驗證通過：
  - `npx tsc --noEmit` ✅ 零錯誤
  - `npm run build` ✅ 14 頁成功
  - 四大修復確認落地：無 Supabase 本地 user 備援（`useAuthStore.ts:9` `"local-user"`）、教學跨頁跳轉（`TutorialOverlay.tsx:43`）、報表分類翻譯（`DailyReport.tsx:34` `getCategoryName`）、記帳表單可捲動（`RecordForm.tsx:39` `max-h-[90vh] overflow-y-auto`）。
- Feature 分支已 rebase 到 `dev`，git 身份已設好。

### 未完成（= 你的任務）
- 兩層分類功能整個還沒動工。照下方〈實作計畫〉做。

### Vercel 部署備註
- 專案開了 **Deployment Protection（Vercel Authentication）**，所有部署網址（production / preview / dev 分支）對未登入請求回 **403**。容器內無法直接截圖或 curl 驗證 live 畫面。
- 擁有者登入後可正常瀏覽。dev 分支部署網址：
  `https://meowbudget-island-git-dev-tim2840s-projects.vercel.app`
- 若要本機驗證：`npm run dev`（port 3000），repo 內有 `scripts/screenshot.mjs`（Playwright，預設截 `/zh-TW/island`）。

---

## 關鍵現況事實（實作前必讀，避免照舊資料寫錯）

- **記帳頁就是首頁**：`RecordPage` 渲染在 `src/app/[locale]/page.tsx`，元件本體在 `src/components/record/RecordPage.tsx`。**沒有獨立 `/record` route**。
- **目前分類是扁平 12 類**，硬編在 `src/lib/constants.ts` 的 `DEFAULT_CATEGORIES`（11 支出 + 1 收入「💰 income」）。
- **技術債**：`RecordPage.tsx:100` 用 `categoryId: default-${i}`（陣列索引），新增/重排會錯位 → 計畫要改成穩定 `key`。
- **現有型別**（`src/types/index.ts`）：
  - `Category`（line 7）= 扁平分類，無 `groupKey`、無穩定 `key`。
  - `Transaction.categoryId: string`（line 26）目前存 `default-{i}`。
  - `Transaction.categorySnapshot`（line 27）= `Pick<Category, "nameKey"|"emoji"|"color"|"isCustom">`，只有 4 欄 → 計畫要擴充成兩層快照。
- **現有 store 寫法參考**：`src/stores/useProfileStore.ts`（zustand + persist），新 `useCategoryStore.ts` 沿用同模式。
- **既有 stores**：`useAuthStore / useProfileStore / useTransactionStore / useTutorialStore / useWalletStore`。
- **報表元件**：`DailyReport / MonthlyReport / WeeklyReport / ReportsPage`（`src/components/reports/`）。報表目前用固定 `COLORS` 陣列上色（`DailyReport.tsx:74,83`），計畫改用 `categorySnapshot.color`。
- **設定頁**：`src/components/settings/SettingsPage.tsx`（目前無 `CategoryManager`，需新增）。
- **i18n**：`messages/zh-TW.json`、`messages/en.json`。分類翻譯透過 `src/components/record/CategoryName.tsx` 的 `useCategoryName()`。
- **獎勵引擎**：`src/lib/rewardEngine.ts`（`calculateReward` 對外契約要維持）。

---

## ⚠️ 專案特別注意

`AGENTS.md`：**這不是你熟悉的 Next.js**。此版本有 breaking changes，API/慣例/檔案結構可能與訓練資料不同。**動工前先讀 `node_modules/next/dist/docs/` 裡相關指南**，並留意 deprecation 提示（例如 build 時會警告 `middleware` 已改名 `proxy`）。

---

## 實作計畫（完整）

> 使用者已選定方向：**(1) 兩層(大類→子類)+ 自訂分類、(2) 主題化重新平衡獎勵、(3) 報表加入收入分類分析**。
> 目標：做成像 MOZE / 記帳城市 / CWMoney 的兩層分類體驗。

### 1. 資料模型（`src/types/index.ts`）

新增「大類」型別，子類沿用 `Category` 並掛 `groupKey` + 穩定 `key`：

```ts
export interface CategoryGroup {
  key: string;            // 穩定鍵，如 "food"（取代陣列索引）
  nameKey: string;        // i18n: "category.food"
  emoji: string;
  color: string;
  isIncome: boolean;
  sortOrder: number;
  isCustom: boolean;
  userId: string | null;
  hidden?: boolean;       // 使用者隱藏的預設大類
}

export interface Category {        // = 子類
  key: string;            // 穩定鍵，如 "food_breakfast"
  groupKey: string;       // 所屬大類
  nameKey: string;        // "category.food_breakfast"
  emoji: string;          // 子類可自訂，預設可繼承大類
  color: string;          // 繼承大類顏色
  resourceType: ResourceType;
  resourceAmount: number;
  bonusCoins: number;
  isIncome: boolean;
  sortOrder: number;
  isCustom: boolean;
  userId: string | null;
  hidden?: boolean;
}
```

交易快照擴充（讓報表能依大類分組、且不受日後編輯影響）：
```ts
categorySnapshot: {
  key: string; groupKey: string;
  nameKey: string; groupNameKey: string;
  emoji: string; color: string; isCustom: boolean;
}
```
> `Transaction.categoryId` 改存子類穩定 `key`（非 `default-{i}`）。

### 2. 預設分類分類法（`src/lib/constants.ts`）

以 `DEFAULT_GROUPS` + `DEFAULT_SUBCATEGORIES` 取代 `DEFAULT_CATEGORIES`。用 builder 讓子類**繼承大類的獎勵預設值**（可個別覆寫），避免重複。建議集合：

**支出大類 → 子類**
- 🍔 飲食(fish)：早餐 / 午餐 / 晚餐 / 飲料手搖 / 點心宵夜 / 食材超市
- 🚌 交通(wood)：大眾運輸 / 計程車 / 加油 / 停車 / 過路費ETC / 維修保養
- 🛒 購物(fabric)：日用品 / 3C電子 / 家電 / 美妝保養 / 書籍文具
- 🎮 娛樂(coins+bonus)：電影 / 遊戲 / 訂閱服務 / KTV / 運動健身
- 🏠 居家(wood)：房租 / 水電瓦斯 / 網路電話 / 家具 / 管理費
- 👕 服飾(fabric)：衣服 / 鞋子 / 配件
- 💊 醫療健康(coins+bonus)：看診 / 藥品 / 保健食品 / 保險
- 📚 教育(coins+bonus)：學費 / 書籍 / 課程進修
- 🤝 人際社交(fabric)：禮金 / 請客聚餐 / 捐款
- 🐱 寵物(fish)：飼料 / 寵物醫療 / 寵物用品
- ✈️ 旅遊(wood)：交通 / 住宿 / 票券 / 伴手禮
- 📦 其他(coins)：雜支 / 手續費 / 稅金

**收入大類 → 子類**
- 💰 工作收入(coins)：薪資 / 獎金 / 加班費 / 兼職
- 📈 理財收入(coins)：股息 / 利息 / 投資獲利 / 租金收入
- 🎁 其他收入(coins)：紅包 / 退款退稅 / 補助津貼 / 二手販售 / 中獎

### 3. 主題化獎勵重新平衡（`src/lib/rewardEngine.ts` + constants）

維持 `calculateReward` 對外契約（支出：`bonusCoins` 金幣 + `resourceAmount` 的 `resourceType`；收入：`resourceAmount` 金幣），但：
- 把獎勵預設值移到**大類層級**（builder 帶入子類），數值平衡：
  - 飲食/寵物 → 🐟fish（amount 2, bonus 5）
  - 交通/居家/旅遊 → 🪵wood（amount 1–2, bonus 5）
  - 購物/服飾/人際 → 🧵fabric（amount 1–2, bonus 5）
  - 娛樂 → 金幣（bonus 4）
  - 醫療/教育 → 金幣（bonus 8，鼓勵記錄）
  - 其他 → 金幣（bonus 3）
  - 收入各類 → 金幣（每筆固定獎勵 ~12–15，**不隨金額膨脹**避免破壞經濟）
- 順手清掉 `rewardEngine.ts` 未使用/重複的中間變數。

### 4. 新增分類 Store（`src/stores/useCategoryStore.ts`）

zustand + `persist`（name `meow_categories`），**只持久化使用者層**（自訂大類/子類、隱藏的預設 key、emoji/顏色/排序覆寫），執行時與程式碼定義的 `DEFAULT_*` 合併 → 預設清單日後可演進、不被舊快取卡住。沿用 `useProfileStore.ts` 寫法。

API：
```ts
getGroups(isIncome): CategoryGroup[]            // 合併+排序+過濾 hidden
getSubcategories(groupKey): Category[]
addGroup / updateGroup / removeGroup
addSubcategory / updateSubcategory / removeSubcategory
hideDefault(key) / reorder(...)
```

### 5. 記帳選擇器 UX（`src/components/record/RecordForm.tsx`、`RecordPage.tsx`）

- `RecordPage`（`src/components/record/RecordPage.tsx`，渲染於 `src/app/[locale]/page.tsx`）改從 `useCategoryStore` 取分類（不再用 `DEFAULT_CATEGORIES`），存檔時寫入新的兩層 `categorySnapshot`。
- `RecordForm` 兩層選擇（單一 sheet 內，不另開頁）：
  - 上排：**大類 chips**（可橫向捲動，依 expense/income 切換過濾）。
  - 下方：選中大類的**子類 grid**（沿用現有 grid，已有 `max-h/overflow`）。
  - 末尾一個 **`＋ 自訂`** tile → 快速新增子類到目前大類。
- 仍保留金額 / 日期 / 備註 / 儲存。

### 6. 報表（`DailyReport.tsx`、`MonthlyReport.tsx`）

- **顏色**：圓餅與圖例改用 `categorySnapshot.color`（取代固定 `COLORS` 陣列，目前在 `DailyReport.tsx:74,83`）。
- **依大類彙總**圓餅（乾淨），清單可展開到子類；沿用 `useCategoryName()` 翻譯，杜絕原始 key。
- **新增收入分析**：支出圓餅下方加一塊「收入分類」圓餅/清單（依收入大類）。`WeeklyReport` 維持趨勢圖即可。

### 7. 設定 — 分類管理（`SettingsPage.tsx` + 新 `components/settings/CategoryManager.tsx`）

設定頁「偏好設定」新增一列「管理分類」→ 開管理畫面（沿用全站浮層防溢出規則：限高+捲動+`z-[60]`）：
- 切換 支出/收入；列出大類與子類；新增/編輯（名稱、emoji、顏色）/刪除自訂項；隱藏預設項；拖動排序（排序可後續）。

### 8. i18n（`messages/zh-TW.json`、`messages/en.json`）

- `category.*` 大幅擴充：所有大類 key 與子類 key（中英）。
- 新增管理 UI 字串（`settings.manage_categories`、新增/編輯/刪除/emoji/顏色…）。

### 9. 向後相容（既有交易）

舊交易 `categorySnapshot` 只有 `nameKey/emoji/color`、`categoryId` 是 `default-{i}`：
- 報表渲染靠快照，`nameKey`（如 `category.food`）仍可翻譯 → 正常顯示。
- 依大類分組時，快照缺 `groupKey` → 用「legacy nameKey → group」對照表回退（舊 12 類都對得到大類），對不到歸「其他」。
- 不需資料遷移（本地 demo 資料）；新交易一律寫完整兩層快照。

---

## 待修改檔案（代表性）

- `src/types/index.ts` — `CategoryGroup`、`Category`（加 `key/groupKey`）、`categorySnapshot` 擴充
- `src/lib/constants.ts` — `DEFAULT_GROUPS` + `DEFAULT_SUBCATEGORIES` + builder（取代 `DEFAULT_CATEGORIES`）
- `src/lib/rewardEngine.ts` — 主題化數值 + 清理
- `src/stores/useCategoryStore.ts` — **新增**（合併預設+自訂、CRUD、persist）
- `src/components/record/RecordForm.tsx`、`RecordPage.tsx` — 兩層選擇器 + 新快照
- `src/components/record/TransactionList.tsx` — 顯示子類（可加大類）
- `src/components/reports/DailyReport.tsx`、`MonthlyReport.tsx` — 收入分析 + 用快照顏色 + 依大類彙總
- `src/components/settings/SettingsPage.tsx` + **新增** `components/settings/CategoryManager.tsx`
- `messages/zh-TW.json`、`messages/en.json` — 分類與管理 UI 字串
- `src/components/record/CategoryName.tsx` — 沿用（自訂名稱已支援 `isCustom`）

## 建議建置順序

1. 型別 + 常數（大類/子類/builder）+ 獎勵重平衡 → `tsc` 綠
2. `useCategoryStore`（合併+CRUD+persist）
3. `RecordPage`/`RecordForm` 接上 store + 新快照（記帳能存）
4. 報表（顏色 + 大類彙總 + 收入分析）
5. 設定分類管理 CRUD
6. i18n 補齊（中英）
7. 向後相容回退表

## 驗證（端到端）

- `npx tsc --noEmit` 與 `npm run build` 綠。
- 記帳：支出選「飲食→午餐」存檔 → 出現獎勵（🐟+金幣）、錢包增加、今日清單顯示「午餐」；收入選「工作收入→薪資」→ 金幣增加。
- 重新整理 → 資料與自訂分類仍在（localStorage）。
- 報表：日/月報支出與**收入**兩個圓餅、顏色為各分類色、tooltip/圖例皆中文無原始 key。
- 設定→管理分類：新增自訂子類 → 立即出現在記帳選擇器；隱藏一個預設大類 → 選擇器不再出現。
- 舊交易仍正確顯示、可被歸入大類。
- 部署到 Vercel 由擁有者登入後實機驗證（部署有 Auth 保護，容器內無法外部存取）。

## 附：Supabase 雲端同步（可選，非必要）

本地模式已可運作。若要雲端同步，新增 `categories` 表（`key, group_key, user_id, name, emoji, color, resource_type, resource_amount, bonus_coins, is_income, is_custom, hidden, sort_order`），並在 store 內 `isSupabaseConfigured()` 時讀寫，與既有 store 同樣模式。
