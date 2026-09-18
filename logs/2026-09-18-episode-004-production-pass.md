# Episode 004 実制作 再開記録

実施日：2026-09-18

## 現在の結果

Episode 004「AIと半導体の国家争奪戦」の実制作を再開し、画像候補、Web記事、SNS原稿、Web導線、動画用音声タイムライン、字幕、図解、SE、完成版Composition、全編レンダリングまで接続した。動画は機械検証、代表フレーム確認、人間の全編レビューを完了し、追加修正なしで完成扱い。画像は人間の採用確認前なので、現段階では正式採用ではなく候補として扱う。

## 各媒体の状態

- 画像候補：`episodes/images/episode-004.png`。Web配置先 `web/public/images/episode-004.png` とSHA-256一致を確認した。
- Web記事：`episodes/ep004-ai-semiconductor-race/article.md` を追加。状態は `editorial-review-pending`。
- Web表示：`/episodes/ep004-ai-semiconductor-race` を静的生成し、トップの最新エピソードとヒーローCTAをEpisode 004へ接続した。
- SNS：`episodes/ep004-ai-semiconductor-race/social.md` にX単独投稿、4投稿スレッド、Instagramキャプション、画像代替テキストを保存した。
- 動画：19音声を検査し、200msのクリップ間隔、182字幕、9 Visual Segment、SE 6か所、猫小窓を接続した `AI-Radio-Episode4-Main-v01` を追加した。全編MP4をレンダリング済み。

## 音声・動画

- 入力：`video/remotion/public/episode4/1.mp3`〜`19.mp3`
- 音声素材合計：731.454694秒
- 音声間の無音：18か所×200ms＝3.6秒
- 元音声：速度変更、トリミング、フェード、ノイズ除去なし
- 音声レビューComposition：22062フレーム / 30fps / 735.4秒
- 音声インベントリ：`video/remotion/docs/episode4/audio-inventory.json`
- 承認テキスト：`video/remotion/docs/episode4/spoken-text-01.txt`〜`spoken-text-19.txt`

Scribe v2による独立STT 01〜19は既存キャッシュを再利用した。分割境界を修正した音声1〜5だけを正しいテキストでForced Alignmentし直し、Alignment 06〜19は再実行していない。品質ゲートは19/19で合格し、182字幕を生成した。

- 完成版Composition：`AI-Radio-Episode4-Main-v01`
- 字幕：182件
- Visual Segment：9区間
- SE：6か所
- 猫小窓：60.57秒から約724.53秒まで。素材終了後は本編だけ継続
- 出力：`video/remotion/out/AI-Radio-Episode4-Main-v01.mp4`
- 出力サイズ：503,557,970 bytes
- 出力実測：735.446秒 / 1280×720 / 30fps / H.264 / AACステレオ48kHz
- SHA-256：`95d70c9aa3282e6a5f6a69950950cb514f30a7605581ab60653a1153955a7137`
- 検証記録：`video/remotion/docs/episode4/render-verification.json`

## 検証

- Web lint：成功
- Web TypeScript：成功
- Web本番ビルド：成功。Episode 004を含む7ページを静的生成
- 実ブラウザ：トップとEpisode 004記事の横スクロールなし
- トップからEpisode 004へのリンク：4件を確認
- Remotion ESLint：エラー0。既存`src/Composition.tsx`の警告3件のみ
- Remotion TypeScript：成功
- Remotion Composition読み込み：成功。Episode 004完成版を含む9件を認識
- 字幕・Alignment品質ゲート：19/19合格
- 代表フレーム：14枚を確認。字幕の欠け、図解との衝突、猫小窓との重なりなし
- 全編レンダリング：成功。22062/22062フレーム
- 完成MP4検証：尺、解像度、fps、コンテナ、映像コーデック、音声コーデック、映像・音声トラックの全項目合格

## 境界

- 既存19音声を加工・上書きしていない。
- Episode 001〜003の実装や正式画像を変更していない。
- NEWS仮データ5件とEpisode 001の旧仮サムネイルは変更していない。
- Webの公開デプロイ、SNS実投稿、動画公開はしていない。
- 画像候補を正式採用扱いにしていない。
- 外部送信は、ユーザーが明示的に許可したElevenLabs STT / Forced Alignmentだけに限定した。

## 人間レビューと次回への仮説

Episode 004動画は追加修正なしで承認された。次の2点はEpisode 004を修正する指示ではなく、Episode 005で試す未確定仮説として扱う。

1. **章タイトルを注意転換のフラグとして見せる**
   - セクションのミニタイトルを読み上げる瞬間に同期し、最前面へ大きなタイトルを一時表示する。
   - ここから話の展開が変わることを、音声と視覚の両方で知らせる。
   - Episode 005で表示時間、サイズ、Entry / Exit、字幕との共存を試し、人間レビュー後に継続可否を判断する。
2. **図解の方向を明示する**
   - Episode 004の約7分54秒、「国内に一つ工場があっても、自給自足ではない」の図では、上段の「製造装置・材料・設計技術」と下段の「工場」の関係方向が読み取りにくかった。
   - オレンジの工場が最初に目へ入り、下から上へ流れるようにも見えた。セリフを聞いて初めて上から下の関係だと推測できる状態だった。
   - 起点と到達点がある図は、矢印を使うか、起点を先に見せて到達点へ流す段階アニメーションを使う。色・コントラストによる視線順も、意図する読み順と一致させる。
   - Episode 005で該当する図がある場合に試し、人間レビュー後に共通ルールへの昇格を判断する。

## 次の開始点

1. Episode 005の実制作へ進む。
2. 章タイトル読み上げに同期した大きな最前面タイトルを試す。
3. 起点と到達点を持つ図解では、矢印または段階アニメーションで方向を明示する。
4. 両方とも005の人間レビューまでは未確定仮説として扱う。
5. Episode 004画像候補を人間が確認し、採用または修正を判断する。
