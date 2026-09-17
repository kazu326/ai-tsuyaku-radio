# Episode 003 制作ライン再現性確認

実施日：2026-09-17

## 結果

Episode 003「知られざる半導体王国、日本」を、正式画像・Web記事・動画v01・SNS派生物まで接続した。Episode 002の初回通過と同じ制作ラインを再現できた。動画は人間の全編レビューにも合格し、現段階では追加修正なしで完成扱い。Web記事は一段階目の人間レビューに合格し、本文を大きく変えずに次のレビューを待つ。

## 各媒体の状態

- 正式画像：`episodes/images/episode-003.png` を改変せず、Web配置先 `web/public/images/episode-003.png` とSHA-256一致を確認した。
- Web記事：`episodes/ep003-japan-semiconductor/article.md` を `final` とし、`/episodes/ep003-japan-semiconductor` で静的生成。トップの最新エピソードとヒーローCTAをEpisode 003へ接続した。
- 動画：`AI-Radio-Episode3-Main-v01` を実装。12音声の間へ200msの無音を入れ、144字幕、8 Visual Segment、SE 5か所を同期した。全編MP4をレンダリングし、メディア検査と人間レビューに合格した。
- SNS：`episodes/ep003-japan-semiconductor/social.md` にX単独投稿、Xスレッド、Instagramキャプション、画像代替テキストを保存した。公開URLは投稿時の差し込み項目として明示した。

## 音声・動画

- 入力：`video/remotion/public/episode3/1.mp3`〜`12.mp3`
- 音声素材合計：564.061628秒
- 音声間の無音：11か所×200ms＝2.2秒
- 元音声：速度変更、トリミング、フェード、ノイズ除去なし
- Composition：16993フレーム / 30fps / 566.433333秒
- 完成MP4：`video/remotion/out/AI-Radio-Episode3-Main-v01.mp4`
- MP4：H.264 1280×720 / 30fps / 16993フレーム、AAC 48kHz stereo、566.485333秒
- サイズ：450,539,262 bytes
- SHA-256：`0DD95E693F543985D898B52B1994BA213B3C124B9024FE928ED844EFCA231997`

ElevenLabs Scribe v2とForced Alignmentを使い、最終台本と12音声を同期した。全文一致、キャッシュ整合、時刻順序、全時間帯への分布、独立STT終端との差を検査し、12/12で合格した。開始だけ300ms前倒し、終了維持、重なりは次字幕優先というEpisode 002のV03方式を継承した。

ユーザー申告の一部音声末尾の「ザっ」というノイズは加工していない。完成動画の人間レビューでは実用上ほぼ問題ないと判断され、200msの音声間隔も違和感なしとして承認された。BGM追加後に再確認するが、現段階では追加修正を行わない。

## Web検証

- `pnpm run lint`：成功
- `pnpm run typecheck`：成功
- `pnpm run build`：成功
- 静的生成：トップ、Episode 001、Episode 002、Episode 003
- 375 / 768 / 1440px：トップとEpisode 003記事でページ全体の横スクロールなし
- 正本Markdownと表示本文：一致
- 画像エラー、代替テキスト欠落、コンソールエラー、ローカルHTTPエラー：0
- トップ→Episode 003記事→トップのエピソード位置への往復：成功
- `noindex, nofollow`：維持

## Remotion検証

- `npm run lint`：成功。既存 `src/Composition.tsx` のobjectFit警告3件のみ
- Composition読み込み：成功。Episode 003を含む7件を認識
- Forced Alignment機械検査：12/12合格
- 代表静止画：8/8生成・目視確認
- 完成MP4：ffprobe検査合格
- 実MP4の冒頭・中盤・末尾フレーム：背景、字幕、猫小窓、図解を確認
- 人間による全編レビュー：合格。200msの区切りは自然で、末尾ノイズも実用上ほぼ問題なし

## 境界

- 正式画像を再生成・改変していない。
- 完成台本の意味・事実関係を変更していない。
- 東京エレクトロンを露光装置メーカーとして描いていない。
- Cerebras製品への日本企業の個別供給関係を断定していない。
- 国ごとの役割を排他的な分類にしていない。
- Webの公開デプロイ、SNSアカウントへの実投稿、動画公開はしていない。
- NEWS仮データ5件とEpisode 001の旧仮サムネイルは変更していない。
- 音声末尾ノイズは未処理。人間レビューで実用上ほぼ問題ないと判断され、現段階では追加処理しない。

## 次の判断

1. BGMを追加した状態で、音声間隔と末尾ノイズをもう一度確認する。
2. Web記事の次段階の人間レビュー結果を待ち、大きな本文変更は行わない。
3. 公開時にURLを記録し、Webの動画導線とSNSの差し込み項目を更新する。
