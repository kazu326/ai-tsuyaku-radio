# CURRENT｜AI通訳ラジオ 現在地

最終更新：2026-09-16

このファイルは、人間・ChatGPT・Codex・その他のAIが作業開始時に最初に読む短い現在地です。詳細な経緯は `logs/`、固定方針は同じ `context/` 内の各文書を参照します。

## Current Focus

Web MVPのトップページは、現段階の基準として一旦完成。Episode 001〜003の正式画像と画像共通ルールv0.1も確定した。Episode 003「知られざる半導体王国、日本」は、台本と制作側Knowledge Masterの最終確認を完了した。Episode 004「AIと半導体の国家争奪戦」は、初稿への赤ペンを反映した台本と制作側Knowledge Masterを作成し、最終確認待ち。Episode 005と006の制作には進んでいない。

その後、記事・動画・SNSまで1テーマを流して「一周」を完成させる。UIの細かな調整は、全体が8〜9割揃ってからトップへ戻り、情報量・文字サイズ・余白・Mobile表示をまとめて行う。

Actor / Story / World Modelの基礎設計フェーズはいったん完了。新しい仕組みを先回りして追加せず、制作中に必要性が発生したものだけを追加する。

## 現在の目的

AI通訳ラジオをYouTube単体ではなく、AIニュース・難解トピック・動画を中心に、Web記事やSNSへ展開できるメディア / Content Hubとして育てる。

同時に、少量のWorld Model SeedからActor／社員／担当者が実際の制作を通じて育つ、AI組織モデルを長期的に探究する。完成したキャラクターを先に量産せず、必要な仕事から一人ずつ育てる。

## ActorとWorld Modelの育成

中心原則：**Actorを設計するのではなく、World Modelを育てる。**

基本ループ：

`種 → 登場 → 行動 → 観察 → 発見 → World Model更新 → 次の行動`

設定から行動を作るだけでなく、実際の行動から判断原理を発見して設定へ戻す。繰り返し確認されたものだけをWorld Modelへ昇格させ、UnknownはAIが勝手に補完しない。

- 共通の育成方針と境界：`context/ACTOR_WORLD_MODEL.md`
- 現在の軽量名簿：`context/ACTORS.md`
- 猫の正本：`context/STORY_BIBLE.md`
- 公開文に残った猫の足跡候補：`context/CAT_FOOTPRINTS.md`

現時点では文書による最小運用だけを行う。専用アプリ、データベース、大量のActor、完成組織図は作らない。

## ブランドの核心

- 名称：AI通訳ラジオ
- コアコピー：「AIの難しい話を、わかる言葉に。」
- 主役：白黒ハチワレ猫のラジオパーソナリティ
- 猫の役割：人間とAIの間に立つ「通訳者」。AI側の事情と人間側の疑問を、猫の視点から橋渡しする
- 世界観：ラジオスタジオ / ON AIR / 夜の放送感
- 色：ネイビー〜ブルーを基調、オレンジ〜アンバーをアクセント。赤 #A90000 は基本色から外す
- ロゴ方向：マイク＋猫耳＋尻尾＋電波を一体化したシンボル

詳細：`context/BRAND.md`

## コンテンツの3カテゴリー

1. AIニュース解説
2. 難解トピック翻訳
3. 音声・動画コンテンツ

ニュース解説と難解トピックはWeb記事としても蓄積する。動画→記事、記事→動画のどちらも許容し、完成物を次媒体のコンテキストとして再利用する。さらにSNS向けへ要約・変換する。

## Web MVPの現在地

`web/` にNext.js App Router / TypeScript / CSSによるローカルレビュー用MVPを実装済み。

- トップ：`/`
- Episode 001記事：`/episodes/ep001-ultrafast`
- 原稿の正本：`episodes/ep001-ultrafast/article.md`。ビルド時に読み込み、複製・改稿しない
- トップ構成：ヘッダー、Desktop / Mobile専用ヒーロー、読む・聞く・見る、最新エピソード、NEWS 5件、番組紹介、フッター
- 正式素材：ヘッダーロゴ、Desktopヒーロー、Mobileヒーロー、フッター用反転アイコン
- 正式Episode画像：`episodes/images/episode-001.png`〜`episode-003.png`。Webへの反映は次工程
- 現在のWeb表示：Episode 001は旧仮サムネイルのまま。コンテンツ流し込み時に正式画像へ差し替える
- 仮データ：NEWS 5件。UI確認用で本文ページや運用基盤は未実装
- 記事詳細：本文全文、一次情報・参考資料、YouTubeリンクを表示
- レビュー状態：375 / 768 / 1440pxで横スクロール・重なりなし。lint、TypeScript、本番ビルド、ブラウザ確認に合格
- 公開状態：ローカルMVP。`noindex, nofollow`。未デプロイ

実装・起動手順は `web/README.md`、最終確認内容は `web/review/REVIEW.md` を参照する。

### 現段階のUI判断

- Desktop版は現在のレイアウトを基準として固定し、コンテンツを一周させるまで細部を調整しない
- Mobile版は破綻していない状態を維持できればよく、現時点では6〜7割程度の完成度として扱う
- 全体が8〜9割完成した段階でトップへ戻り、Desktop / Mobileをまとめて再調整する
- 新しいコンポーネント体系や画像生成基盤を先回りして作らない。004画像は確定済みルールと採用3画像を使う実制作として検証する

## リポジトリの役割

このGitHubリポジトリを制作側のSource of Truthとする。

- GitHub：Knowledge / Context / Source / Decisions
- ChatGPT・Codex等：制作・編集・実行
- Remotion：動画制作エンジン
- Web：公開・記事蓄積
- SNS：派生配信。可能な部分から自動化する

## Remotion

旧Remotion環境 `kazu326/ai-radio-remotion-test` から親リポジトリへの移植は完了した。

コピー元として固定する基準Commit：`4191ac7ad8d286d296fd340f9e1e0b7f50ffdd51`

統合先：`video/remotion/`

親リポジトリへの統合Commit：`c14798074e01c2384457c079d2185cf780ab1bac` (`Integrate Remotion production environment`)

Git管理対象198ファイルは基準Commitと一致する状態で収容し、`main` へpush済み。`npm ci`、lint、TypeScript、Remotion bundle、Composition 6件の読み込みはすべて成功した。第2話 `AI-Radio-Episode2-Main-v01` もCompositionとして読み込み済み。

MP4はGit管理対象外。ローカル素材38本は `video/remotion/LOCAL_ASSETS.md` のパスを維持して配置し、コピー元とのハッシュ一致を確認済み。GitHubにはコード・設定・字幕JSON・台本・素材パス・管理情報のみを保存する。

移植の完了記録と境界は `video/remotion/MIGRATION.md` を正本とする。旧プロジェクトは変更せず、引き続きコピー元スナップショットとして保護する。

## 現在の優先順位

1. Episode 004の台本を人間が最終確認する
2. Episode 003完成台本を正式画像とともにWeb・動画へ展開する
3. Episode 001〜003の実コンテンツでNEWS 5件を置き換える
4. 記事・動画・SNSまで反映し、1テーマの制作を「一周」させる
5. コンテンツが揃った状態で、情報量・文字サイズ・余白・Mobile表示をまとめて調整する
6. Episode 004以降で、共通ルールv0.1と採用画像3点を使う実制作を検証する

## 作業原則

最初から全媒体を完全自動化しない。まず「1テーマ → 動画 / 記事 / SNS」が一巡する最小構成を完成させ、実運用で安定した部分だけ自動化する。

動作済みRemotionの移植と検証は完了した。今後の整理やリファクタリングは、移植済みの同等状態を基準に別工程で行う。

## 次回の開始点

Episode 004の最終確認を続ける場合は、このファイル、`episodes/ep004-ai-semiconductor-race/script.md`、`episodes/ep004-ai-semiconductor-race/research.md` を読む。台本制作の共通手順は `context/EPISODE_SCRIPT_WORKFLOW.md` を入口にする。

Web展開を続ける場合は、`episodes/ep003-japan-semiconductor/script.md`、`episodes/ep003-japan-semiconductor/research.md`、`context/EPISODE_IMAGE_RULES.md`、`web/review/REVIEW.md` を読み、既存のDesktop基準を保ったままEpisode 003の正式画像とコンテンツを反映する。

Episode 004以降の接続方向は、004「AIと半導体の国家争奪戦」、005「DeepSeek：強いGPUだけがAI競争ではない」、006「なぜAI企業はモデルを公開するのか：オープンモデルの経済」。004は編集レビュー反映済み・最終確認待ち。005と006は接続方向のみ合意済みで、制作は未着手。

Episode画像の正本：

- 共通ルール：`context/EPISODE_IMAGE_RULES.md`
- 採用画像：`episodes/images/episode-001.png`
- 採用画像：`episodes/images/episode-002.png`
- 採用画像：`episodes/images/episode-003.png`

004以降は、この共通ルールと採用3画像を読み込み、Episodeの核心、タイトル、補助情報を入力として同じデザイン文法を再現する。画像生成の自動化基盤は先に作らず、まず004の実制作で一回の指示による再現性を検証する。
