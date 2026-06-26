# 美術素材生成規格（給「自己用 AI 生圖」用）

風格 = **溫馨像素風（cozy pixel art）**，參考你提供的「貓貓世界」截圖：
點陣像素、Q版貓咪、正面站姿、暖色奶油/粉彩、可愛溫馨。

照這份生成 → 把檔案丟回 repo 對應路徑（或傳給我）→ 我負責接上程式 + 加「動態場景」CSS 動畫。

> ⚠️ 四個鐵則（不照做圖會接不上）：
> 1. **像素風**：clean pixel art, crisp pixels, limited palette（不要平滑/3D/寫實）。
> 2. **貓咪 / 建築一定要「透明背景 PNG」**（transparent background）。背景圖才不透明。
> 3. **全部沿用同一段「風格前綴」**，5 隻貓才會像同一套。
> 4. **圖上不要有任何文字、UI、卡框、愛心、浮水印**（參考圖的卡框/愛心是遊戲 UI，不要畫進去）。

---

## 0. 通用風格前綴（每張圖都貼這段在最前面）

```
cute cozy pixel art game asset, 16-bit style, crisp clean pixels, limited warm pastel palette,
soft cream and pastel colors, kawaii chibi style, adorable, simple dot eyes with pink blush cheeks,
clean readable silhouette
```

建議：同一批用**同一個 seed / 同一張參考圖**生（把你那張 6 隻貓的截圖當參考餵進去最準）。

---

## 1. 貓咪角色（5 隻，最優先，取代現有 SVG 貓）

| 共同設定 | 值 |
|------|----|
| 路徑 | `public/assets/cats/<key>.png` |
| 尺寸 | **256×256**（像素風不需太大；顯示時縮到 34~48px） |
| 背景 | **透明（transparent background）** ← 最重要 |
| 構圖 | 單隻貓、**全身**、**正面站姿**（面向鏡頭、像參考圖那樣兩腳站立、一隻前掌微抬）、置中、腳在底部 |
| 格式 | PNG（含 alpha） |

> 想要走路動畫：每隻**多生一張「邁步/抬腳」姿勢**存 `<key>_walk.png`，我做兩格踏步。不生也行，我用 CSS 讓牠上下呼吸彈跳。

| key（檔名） | 角色 | 提詞重點 |
|------|------|------|
| `captain` | 船長貓 | orange tabby cat wearing a tiny sailor hat and navy collar |
| `merchant` | 商人貓 | chubby golden-yellow cat wearing a small merchant vest |
| `scholar` | 學者貓 | grey tabby cat wearing round glasses |
| `explorer` | 探險家貓 | brown cat wearing an explorer hat and little scarf |
| `streak_master` | 連續達人貓 | white-and-lavender cat with a small glowing star on forehead |

**單隻提詞範例**（captain）：
```
<風格前綴>, full body cute pixel art orange tabby cat wearing a tiny sailor hat and navy collar,
standing front view facing camera, one paw slightly raised, centered, transparent background, no card frame, no text
```

---

## 2. 島嶼背景

| 項目 | 值 |
|------|----|
| 路徑 | `public/assets/island_bg.png` |
| 尺寸 | **640×480 以上**（約 4:3，會裁成 390×288 寬框置中） |
| 背景 | **不透明**（這是底圖） |
| 格式 | PNG |

**版面要求**（建築會疊在這些位置，地形要對得上）：
- 一座被海包圍的小島，**俯視偏等角**像素風。
- **下方中央 = 港口區**（沙灘/碼頭水域）。
- **右側中段 = 市集區**（平地/廣場）。
- **上方中央 = 山丘區**（綠色高地）。
- 那三塊**留乾淨平台、別畫太滿**（建築會蓋上去）。

**提詞範例**：
```
<風格前綴>, top-down cozy pixel art island surrounded by calm turquoise sea,
sandy harbor beach at bottom center, open market plaza on the right, green grassy hill at top center,
scattered trees and flowers, soft clouds, daytime, empty clean spots for buildings, no buildings, no text
```

---

## 3. 建築（10 棟，第二批再做也行）

| 共同設定 | 值 |
|------|----|
| 路徑 | `public/assets/buildings/<key>.png` |
| 尺寸 | **256×256**（顯示縮到 72px） |
| 背景 | **透明** |
| 構圖 | 單棟建築、像素風 3/4 等角、置中、底部接地 |

| key | 區域 | 設定 |
|------|------|------|
| `harbor_dock` | 港口 | wooden fishing dock with a small boat |
| `harbor_lighthouse` | 港口 | red-and-white striped lighthouse |
| `harbor_warehouse` | 港口 | seaside storage warehouse |
| `market_stall` | 市集 | colorful market stall with striped awning |
| `market_bakery` | 市集 | cozy bakery with bread sign |
| `market_blacksmith` | 市集 | blacksmith forge with anvil |
| `market_tailor` | 市集 | tailor shop with fabric rolls |
| `hill_windmill` | 山丘 | white windmill on grass |
| `hill_observatory` | 山丘 | domed star observatory |
| `hill_temple` | 山丘 | small shrine / temple |

**單棟提詞範例**：
```
<風格前綴>, pixel art 3/4 isometric cute red-and-white striped lighthouse,
centered, transparent background, no ground, no text
```

> 現有 8 棟已有圖，缺 `hill_observatory` / `hill_temple`。要全部重生統一成像素風也可以。

---

## 4. 交付方式

1. 生好的檔案**照上面路徑命名**放進 `public/assets/...`（或直接把圖傳我，我來放）。
2. 跟我說「好了」，我會：
   - 把貓咪從 SVG 切到你的 PNG（含 fallback，缺圖不會壞）。
   - 加 `image-rendering: pixelated` 讓像素風保持清脆不糊。
   - 加**動態場景**：貓咪呼吸彈跳/踏步、海面微光、樹搖、雲飄（已有）、日夜漸層（已有）。
   - 跑 `tsc` + `build` + 截圖驗證，開 PR 給你看 Vercel 預覽。

## 5. 「動態」靠誰？

生圖只給**靜態圖**；「會動」是我這邊用 CSS 做的。你只要生**漂亮的像素靜態素材**，動的交給我。生越多姿勢（idle / walk）動畫越豐富，最低每隻一張 idle 就能動起來。
