# CURRENT｜AI通訳ラジオ 現在地

最終更新：2026-09-14

このファイルは、人間・ChatGPT・Codex・その他のAIが作業開始時に最初に読む短い現在地です。詳細な経緯は `logs/`、固定方針は同じ `context/` 内の各文書を参照します。

## Current Focus

AI通訳ラジオの表側の活動基盤となるWeb MVPを制作する。

Actor / Story / World Modelの基礎設計フェーズはいったん完了。新しい仕組みを先回りして追加せず、Episode 001 / 002のKnowledgeと制作物を使って、実際のWeb制作へ進む。

制作中に必要性が発生したものだけを追加する。

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

1. AI通訳ラジオの表側の活動基盤となるWeb MVPを作る
2. Episode 001 / 002のKnowledgeと制作物をWebへ接続する
3. 実制作を通じて、1テーマを動画・記事・SNSまで流す制作パイプラインを検証する
4. 制作中に必要性が確認された仕組みだけを追加し、安定した工程から自動化する

## 作業原則

最初から全媒体を完全自動化しない。まず「1テーマ → 動画 / 記事 / SNS」が一巡する最小構成を完成させ、実運用で安定した部分だけ自動化する。

動作済みRemotionの移植と検証は完了した。今後の整理やリファクタリングは、移植済みの同等状態を基準に別工程で行う。
