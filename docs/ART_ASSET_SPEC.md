# 美術素材生成規格（給「自己用 AI 生圖」用）

這份是給你拿去 ChatGPT / Midjourney / 任何生圖工具用的**精確清單**。
照這份生成 → 把檔案丟回 repo 對應路徑（或傳給我）→ 我負責接上程式 + 加「動態場景」CSS 動畫。

> ⚠️ 三個鐵則（不照做圖會接不上）：
> 1. **貓咪 / 建築一定要「透明背景 PNG」**（no background / transparent）。背景圖才是不透明。
> 2. **全部沿用同一段「風格前綴」**（見下方），否則每張畫風不一致會很雜。
> 3. **不要在圖上加任何文字、UI、邊框、浮水印**。

---

## 0. 通用風格前綴（每張圖都貼這段在最前面）

```
cozy storybook mobile game art, soft Studio Ghibli inspired, warm pastel palette,
hand-painted watercolor texture, gentle clean outlines, soft ambient lighting,
cute chibi proportions, high detail, centered composition
```

建議：同一批用**同一個 seed / 同一張參考圖**生，畫風會更一致（尤其 5 隻貓要像一家人）。

---

## 1. 島嶼背景（最大視覺提升，先做這張）

| 項目 | 值 |
|------|----|
| 路徑 | `public/assets/island_bg.png` |
| 尺寸 | **1024×768 以上**（比例約 4:3，會被裁成 390×288 的寬框，置中顯示） |
| 背景 | **不透明**（這是底圖） |
| 格式 | PNG |

**版面要求**（建築會疊在這些位置，請讓地形對得上）：
- 一座被海包圍的小島，**俯視偏等角**視角。
- **下方中央 = 港口區**（沙灘 / 碼頭水域，留空可放燈塔）。
- **右側中段 = 市集區**（平地 / 廣場，留空可放攤位）。
- **上方中央 = 山丘區**（綠色高地，留空可放風車）。
- 留白：建築會蓋在上述三區，**那幾塊別畫太滿**，留乾淨平台。

**提詞範例**：
```
<風格前綴>, top-down isometric cozy island surrounded by calm turquoise sea,
sandy harbor beach at bottom center, open market plaza on the right,
green grassy hill at top center, scattered trees and flowers, soft clouds,
daytime, empty clean platforms where buildings will be placed, no buildings, no text
```

---

## 2. 貓咪角色（5 隻，取代現有 SVG 貓）

| 共同設定 | 值 |
|------|----|
| 路徑 | `public/assets/cats/<key>.png` |
| 尺寸 | **512×512** |
| 背景 | **透明（transparent / no background）** ← 最重要 |
| 構圖 | 單隻貓、**全身**、站立 idle、**面朝右**、置中、腳在底部 |
| 格式 | PNG（含 alpha） |

> 想要會走路動畫的話：每隻**多生一張「走路抬腳」姿勢**存成 `<key>_walk.png`，我就能做兩格踏步動畫。不生也行，我用 CSS 讓牠上下彈跳。

| key（檔名） | 角色設定 | 提詞重點 |
|------|------|------|
| `captain` | 船長貓 | orange tabby cat, tiny sailor captain hat, navy scarf, confident |
| `merchant` | 商人貓 | plump golden-yellow cat, merchant vest, small coin pouch, friendly |
| `scholar` | 學者貓 | grey cat, round spectacles, holding a tiny book, calm |
| `explorer` | 探險家貓 | brown cat, explorer hat and scarf, small backpack, adventurous |
| `streak_master` | 連續達人貓 | lavender-purple cat, glowing star mark on forehead, energetic pose |

**單隻提詞範例**（以 captain 為例）：
```
<風格前綴>, full body cute chibi orange tabby cat wearing a tiny sailor captain hat
and navy scarf, standing idle, facing right, centered, transparent background, no shadow on ground, no text
```

---

## 3. 建築（10 棟，可選 / 第二批再做）

| 共同設定 | 值 |
|------|----|
| 路徑 | `public/assets/buildings/<key>.png` |
| 尺寸 | **512×512**（顯示縮到 72×72） |
| 背景 | **透明** |
| 構圖 | 單棟建築、等角 3/4 視角、置中、底部接地 |

| key | 區域 | 設定 |
|------|------|------|
| `harbor_dock` | 港口 | wooden fishing dock with boat |
| `harbor_lighthouse` | 港口 | red-white striped lighthouse |
| `harbor_warehouse` | 港口 | seaside storage warehouse |
| `market_stall` | 市集 | colorful market stall with awning |
| `market_bakery` | 市集 | cozy bakery with bread sign |
| `market_blacksmith` | 市集 | blacksmith forge with anvil |
| `market_tailor` | 市集 | tailor shop with fabric rolls |
| `hill_windmill` | 山丘 | white windmill on grass |
| `hill_observatory` | 山丘 | domed star observatory |
| `hill_temple` | 山丘 | small shrine / temple |

**單棟提詞範例**：
```
<風格前綴>, isometric 3/4 view cute red and white striped lighthouse,
centered, transparent background, no ground, no text
```

> 現有 8 棟已有圖，缺 `hill_observatory` / `hill_temple`。要全部重生統一畫風也可以。

---

## 4. 交付方式

1. 生好的檔案**照上面的路徑命名**放進 `public/assets/...`（或直接把圖傳給我，我來放）。
2. 告訴我「好了」，我會：
   - 把貓咪從 SVG 切換成你的 PNG（含 fallback，缺圖不會壞）。
   - 加上**動態場景**：海面微光、樹搖、雲飄（已有）、貓咪呼吸彈跳 / 踏步、日夜漸層（已有）視差。
   - 跑 `tsc` + `build` + 截圖驗證，開 PR 給你看 Vercel 預覽。

## 5. 「動態」靠誰？

生圖只給**靜態圖**；「會動」是我這邊用 CSS / 動畫做的。所以你只要負責生**漂亮的靜態素材**，動的部分交給我。生越多姿勢（idle / walk）我能做的動畫越多，但最低只要每隻一張 idle 就能動起來。
