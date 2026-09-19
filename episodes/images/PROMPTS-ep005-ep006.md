# Episode 005・006 画像プロンプト（人間側で生成する用）

作成日：2026-09-19

`context/EPISODE_IMAGE_RULES.md` v0.1と採用画像（`episode-001.png`〜`episode-003.png`、候補`episode-004.png`）を参照画像として同時に読み込む前提のプロンプト。生成後、採用画像は `episodes/images/episode-005.png` / `episode-006.png`（1672×941px）へ保存し、`web/public/images/` の同名の仮画像を上書きする。

各Episodeに、構図の異なるA / Bの2案を用意した。まずAを基準にし、Bは比較用。

---

## Episode 005「DeepSeek：強いGPUだけがAI競争ではない」

### 画像内に入れる情報

- Episodeラベル：`Episode 005`
- ブランド：`AI通訳ラジオ` / 小さく `AI TSUYAKU RADIO`
- メインタイトル（2行、情報階層あり）：
  - 1行目（小さめ・白）：`強いGPUだけが`
  - 2行目（大きく）：`AI競争ではない`（`AI競争` を強調色 #f9a135、`ではない` を白）
- 補助コピー（1行・白・細め、左に短い橙のライン）：`限られた計算を、どれだけ無駄なく能力へ変えるか。`
- 補助英字（小さく、左下または右下）：`COMPUTE EFFICIENCY` または `LESS WASTE, MORE CAPABILITY`
- 数字は入れない（約600万ドルは誤読されやすいため画像では使わない）
- 猫：使わない
- 使わない表現：DeepSeekのロゴ、NVIDIAロゴ、中国国旗、製品名の文字、「600万ドル」「$6M」

### 005-A：一部だけ点灯するGPUの列（推奨）

```
Create one editorial 16:9 cover image for a Japanese AI media series, matching the attached reference images' layout grammar exactly: deep navy-to-blue night palette (#081B2A base, #16324F mid-blue), amber accent #f9a135, white Noto Sans JP typography, thin vertical amber bar at top-left, a boxed label "Episode 005" in amber next to it, then "AI通訳ラジオ" in white with tiny "AI TSUYAKU RADIO" beneath, all kept well inside safe margins.

Main visual, right two-thirds: a long dense rack of identical AI accelerator GPU modules seen in perspective inside a dark data-center aisle, photoreal, tactile metal and PCB detail. Most modules are dim, cool blue and idle; only a scattered minority are lit warm amber, and thin amber light traces connect just those active modules into one flowing path, showing "only the needed parts are working." Subtle motion-blur light streams pass between the lit modules without stopping, suggesting no waiting. No logos, no brand names, no flags, no numbers, no dollar signs.

Typography, left half over calm dark negative space: line 1 "強いGPUだけが" in medium white; line 2 much larger, "AI競争" in amber #f9a135 followed by "ではない" in white, bold. Below, a short amber horizontal rule and one thin white subline "限られた計算を、どれだけ無駄なく能力へ変えるか。". Small tracked-out English "COMPUTE EFFICIENCY" in muted blue-grey at bottom-left as a quiet decorative layer. Japanese title must be the first thing the eye reads; English is secondary.

Mood: intelligent, organized, trustworthy tech media, slightly futuristic, not a shouting YouTube thumbnail. No neon overload, no extra text, no watermark, no UI elements. Output 1672x941.
```

### 005-B：同じ量の計算、違う出力（比較構図）

```
Create one editorial 16:9 cover image for a Japanese AI media series, matching the attached reference images' layout grammar: deep navy night palette (#081B2A / #16324F), amber accent #f9a135, white Noto Sans JP typography, thin amber vertical bar and boxed "Episode 005" label at top-left, "AI通訳ラジオ" with tiny "AI TSUYAKU RADIO" beside it, safe margins respected.

Main visual, right side, a quiet two-part comparison of the same hardware used two ways: on top, a row of identical GPU chips all glowing evenly but with hazy, scattered light leaking and dissipating upward into the dark (wasted compute); on the bottom, the same row of chips where the light is gathered into one sharp, focused amber beam that becomes a clean luminous neural-network structure on the right. Both rows are photoreal, tactile, no logos, no brand names, no flags, no numbers.

Typography, left half over dark negative space: "強いGPUだけが" in medium white above a much larger bold line "AI競争" in amber #f9a135 + "ではない" in white. Beneath, a short amber rule and a thin white subline "限られた計算を、どれだけ無駄なく能力へ変えるか。". Small muted English "SAME COMPUTE, DIFFERENT DESIGN" at bottom-left as a secondary layer. Japanese first, English quiet.

Mood: intelligent, organized information media, restrained, cinematic realism. No extra text, no watermark, no UI. Output 1672x941.
```

---

## Episode 006「なぜAI企業はモデルを公開するのか：オープンモデルの経済」

### 画像内に入れる情報

- Episodeラベル：`Episode 006`
- ブランド：`AI通訳ラジオ` / 小さく `AI TSUYAKU RADIO`
- メインタイトル（2行）：
  - 1行目（小さめ・白）：`なぜAI企業は`
  - 2行目（大きく）：`モデルを公開するのか`（`公開` を強調色 #f9a135、他は白）
- 補助コピー：`無料で配ることが、競争力になる。`
- 補助英字（小さく）：`OPEN MODEL ECONOMY`
- 猫：使わない
- 使わない表現：Meta、Mistral、DeepSeek、Hugging Faceのロゴやマーク、「オープンソース」という文字（本編で全部をそう呼ばないため）、ダウンロード矢印だけの安い図像

### 006-A：中央のモデルから育つ生態系（推奨）

```
Create one editorial 16:9 cover image for a Japanese AI media series, matching the attached reference images' layout grammar exactly: deep navy night palette (#081B2A base, #16324F mid-blue), amber accent #f9a135, white Noto Sans JP typography, thin vertical amber bar and boxed "Episode 006" label at top-left, "AI通訳ラジオ" in white with tiny "AI TSUYAKU RADIO" beneath, safe margins respected.

Main visual, right two-thirds: a single luminous crystalline AI model core, like a compact glowing lattice or cube of layered light, sitting on a dark reflective platform. From it, warm amber and cool blue light lines radiate outward across the platform and connect to many small, varied, photoreal objects arranged around it at different distances: a server rack, a smartphone, a laptop with code, a cloud-like cluster of data-center modules, a semiconductor chip, a small satellite-dish-like antenna, tiny figures of developers at desks. The connected objects are lit; the platform between them shows faint grid lines like a foundation. The composition reads as "one model becomes the ground many products stand on." No logos, no brand names, no download-arrow icons, no text inside the visual.

Typography, left half over calm dark negative space: "なぜAI企業は" in medium white above a much larger bold line "モデルを" in white and "公開" in amber #f9a135 and "するのか" in white. Beneath, a short amber rule and one thin white subline "無料で配ることが、競争力になる。". Small tracked-out English "OPEN MODEL ECONOMY" in muted blue-grey at bottom-left, secondary. Japanese title reads first.

Mood: intelligent, organized, trustworthy information media, slightly future-leaning, cinematic realism, not a loud thumbnail. No neon overload, no extra text, no watermark, no UI. Output 1672x941.
```

### 006-B：開いた金庫の中の光（開く範囲を見せる構図）

```
Create one editorial 16:9 cover image for a Japanese AI media series, matching the attached reference images' layout grammar: deep navy night palette (#081B2A / #16324F), amber accent #f9a135, white Noto Sans JP typography, thin amber vertical bar and boxed "Episode 006" label at top-left, "AI通訳ラジオ" with tiny "AI TSUYAKU RADIO" beside it, safe margins respected.

Main visual, right side: a large, elegant dark-metal research vault or archive wall in a nighttime lab, its heavy door partially open. Through the opening, one glowing amber object, a compact AI model core like a lattice of light, is being handed outward on a sliding tray toward the viewer, and small streams of light flow from it to a few photoreal devices in the foreground (a laptop, a phone, a small server). Deeper inside the vault, still lit only in cool blue and clearly staying behind, are shelves of data drives, notebooks, and experiment equipment. The image should read "one valuable part is opened, the rest stays inside." No logos, no brand names, no readable text inside the scene, no cheap download arrows.

Typography, left half over dark negative space: "なぜAI企業は" in medium white, then a much larger bold line "モデルを" white + "公開" amber #f9a135 + "するのか" white. Beneath, a short amber rule and the thin white subline "無料で配ることが、競争力になる。". Small muted English "WHAT IS OPEN, WHAT STAYS" at bottom-left, secondary.

Mood: intelligent, organized, trustworthy, cinematic realism, restrained. No extra text, no watermark, no UI. Output 1672x941.
```

---

## 生成後のチェック（画像共通ルールv0.1より）

1. 001〜004と並べてシリーズに見えるか
2. 日本語タイトルが英字より先に目へ入るか
3. Episodeラベル・ブランド・タイトルが四辺ぎりぎりに寄っていないか
4. ロゴ・国旗・製品名・金額が紛れ込んでいないか
5. 文字の誤字（生成モデルの日本語崩れ）がないか。崩れた場合はテキストだけ後から重ねる
