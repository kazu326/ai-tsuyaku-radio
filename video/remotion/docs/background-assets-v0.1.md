# Background Asset Registry v0.1

> 現時点の目的：背景・トピック素材のID、Pool、Loop可否を共通管理する。
> Loop可否は今回の手動判定を確定値として記録する。
> subject / mood / motion / use_hint は、必要になった時点で追加・更新する。

| ID | File | Pool | Loopable | Notes |
|---|---|---|---|---|
| A1 | a1.mp4 | A | NO | |
| A2 | a2.mp4 | A | YES | |
| A3 | a3.mp4 | A | YES | |
| A4 | a4.mp4 | A | YES | |
| A5 | a5.mp4 | A | YES | |
| A6 | a6.mp4 | A | YES | |
| A7 | a7.mp4 | A | YES | |
| A8 | a8.mp4 | A | YES | |
| A9 | a9.mp4 | A | YES | |
| A10 | a10.mp4 | A | YES | |
| A11 | a11.mp4 | A | YES | |
| B1 | b1.mp4 | B | YES | |
| B2 | b2.mp4 | B | NO | |
| B3 | b3.mp4 | B | YES | |
| B4 | b4.mp4 | B | YES | |
| B5 | b5.mp4 | B | YES | |
| B6 | b6.mp4 | B | YES | |
| B7 | b7.mp4 | B | YES | |
| B8 | b8.mp4 | B | NO | |
| B9 | b9.mp4 | B | YES | |
| B10 | b10.mp4 | B | YES | |
| C1 | c1.mp4 | C | YES | |
| C2 | c2.mp4 | C | NO | |
| C3 | c3.mp4 | C | NO | |
| C4 | c4.mp4 | C | NO | |
| C5 | c5.mp4 | C | NO | |
| C6 | c6.mp4 | C | YES | |
| C7 | c7.mp4 | C | YES | |
| C8 | c8.mp4 | C | YES | |
| CAT1 | cat1.mp4 | CAT | NO | |
| CAT2 | cat2.mp4 | CAT | NO | |
| CAT3 | cat3.mp4 | CAT | NO | |
| CPU1 | cpu1.mp4 | TOPIC | NO | |
| GPU1 | gpu1.mp4 | TOPIC | NO | |
| GPU2 | gpu2.mp4 | TOPIC | NO | |
| SERVER1 | server1.mp4 | TOPIC | NO | |

## 現時点の判定方針

- `NO` は、素材の始点と終点が明確で、繰り返すと時間が巻き戻ったように見える素材を含む。
- `YES` は、必要に応じてループしても違和感が比較的小さい素材。
- A / B / C は厳密な前半・中盤・後半固定ではなく、素材選択のPool。
- 導入はAから選ぶ。その中では前半向き素材を優先する。
- CAT / TOPIC は通常背景Poolとは分け、セリフや場面に合わせて意図的に挿入する。
