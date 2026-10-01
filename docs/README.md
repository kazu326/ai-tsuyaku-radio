# AI通訳ラジオ｜共有設計資料

このフォルダは、AI通訳ラジオを人間と複数AIで運営するための共有設計資料です。

## 新しいReal Memberが最初に読む

1. `REAL_MEMBER_ONBOARDING.md` — 参加方法と最初の仕事
2. `../README.md` — プロジェクト全体の入口
3. `../context/CURRENT.md` — 現在地
4. `SYSTEM_OVERVIEW.md` — 全体像
5. 自分が触る仕事に必要な資料だけ

`PARALLEL_WORKSTREAMS.md` は、現在どの作業を並行して進められるか確認したいときに参照する。

## AI・実装担当が読む

1. `SYSTEM_ARCHITECTURE.md` — GitHub / Cloudflare / MCP / 3D Presenceの設計
2. `../context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actorの定義
3. `PARALLEL_WORKSTREAMS.md` — 各作業の境界、依存、完了条件
4. `../AGENTS.md` — 共通の作業ルール

## 方針

人間向けとAI向けで別々の事実を持たない。

人間向け資料は理解しやすさを優先し、AI・実装向け資料は境界、Source of Truth、権限、未決定事項を明示する。同じ事実の二重管理を増やさず、詳細は正本へリンクする。
