# Episode 002 制作ライン初回通過

実施日：2026-09-17

## 結果

Episode 002「Cerebrasって、結局なにがそんなに速いの？」を、正式画像・Web記事・完成済み動画・SNS派生物まで一つの制作パッケージとして接続した。これを制作ラインの初回通過とし、次のEpisode 003で同じ流れの再現性を確認する。

## 各媒体の状態

- 正式画像：`episodes/images/episode-002.png` を正本として維持。Web配置先 `web/public/images/episode-002.png` とSHA-256一致を確認した。
- Web記事：`episodes/ep002-cerebras/article.md` を `final` とし、`/episodes/ep002-cerebras` で静的生成。トップの最新エピソードとヒーローCTAもEpisode 002へ接続した。
- 動画：`video/remotion/PROJECT_CONTEXT.md` に記録済みのとおり、人間評価承認、手動レンダリング、編集ソフトでの微調整、公開まで完了済み。今回Remotion実装や動画素材は変更していない。
- SNS：`episodes/ep002-cerebras/social.md` にX単独投稿、Xスレッド、Instagramキャプション、画像代替テキストを保存した。Webと動画の公開URLはリポジトリに記録がないため、投稿時の差し込み項目として明示した。

## Web検証

- `pnpm run lint`：成功
- `pnpm run typecheck`：成功
- `pnpm run build`：成功
- 静的生成：トップ、Episode 001、Episode 002
- 375 / 768 / 1440px：トップとEpisode 002記事で横スクロールなし
- 正本Markdownと表示本文：一致
- 画像エラー、代替テキスト欠落、コンソールエラー、ローカルHTTPエラー：0
- 比較表はGFMとして表示し、狭い画面では表の領域内だけスクロール可能

詳細は `web/review/REVIEW.md` を参照する。

## 境界

- 正式画像の再生成・改変はしていない。
- 完成・公開済み動画の再レンダリングやRemotion変更はしていない。
- Webの公開デプロイ、SNSアカウントへの実投稿はしていない。
- トップのNEWS仮データ5件と、Episode 001の旧仮サムネイルは今回変更していない。
