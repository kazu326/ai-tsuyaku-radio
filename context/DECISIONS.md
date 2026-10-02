# DECISIONS｜確定事項

このファイルには、現在採用されている重要な決定だけを記録する。検討中の案や詳細な議論は `logs/` に残す。

## 2026-10-02

### World Model Seed Systemを正式採用する

World Model Seedは、実務を通して育つ個別のAI作業単位とする。Seedを人・組織に合わせて個別化し、実務から育て続ける仕組みを **World Model Seed System** と呼ぶ。

World Modelの育成・昇格は引き続き `context/ACTOR_WORLD_MODEL.md` を正本とし、World Model Seed SystemはTask Contract、Challenge、個別化、内部／外部Seedの原則を扱う。

外部提供では内部Seedをコピーせず、顧客・個人ごとに構築する。既存Knowledgeを活用し、顧客側にSeedを育て続ける能力とKnowledgeを残し、Client間でKnowledgeを混ぜない。

正本は `context/WORLD_MODEL_SEED_SYSTEM.md`。

### Knowledgeを「情報の性質 × 所属Scope」の2軸で扱う

情報の性質は既存の `public` / `internal` / `narrative_secret` / `protected_information` を維持する。

それとは別に、Knowledgeが誰の世界に属するかを organization / role・project / personal / client のScopeで考える。

Scopeはアクセス制御そのものではない。公開リポジトリへProtected Information、非公開のPersonal情報、公開許可のないClient情報を保存しない。

正本は `context/KNOWLEDGE_MODEL.md`。

### Real Member Onboardingを「やりたいこと」起点にする

新しいReal Memberには既定の制作担当を割り当てず、「AIを使って何をやってみたいか」から小さなExperimentを始めてもらう。

初参加の基本導線は、GitHub collaborator招待 → clone → AIクライアント → Experiment → branch / commit / push → PRとする。外部Contributorはfork経由とする。

正本は `docs/REAL_MEMBER_ONBOARDING.md`。

## 2026-10-01

### 組織モデルを Real Member → World Model Seed → Actor に分ける

現実の人間はReal Memberとして責任と最終判断を持つ。

AIはまずWorld Model Seedとして内部の実務を行い、Observation / Discovery / World Modelを育てる。内部処理だけで成立する場合はActor化しない。

名前・外見・声・公開時の語り方などのActor層は、動画・SNS・一般ユーザーとの会話など、外部との接点が必要になった場合だけ追加する。

Real Memberを架空Actorとして扱わず、本人が示していない性格、能力、感情、事情をAIが設定しない。

組織上の正本は `context/ORGANIZATION_MODEL.md`、Seed一覧は `context/WORLD_MODEL_SEEDS.md`、外向けActor一覧は `context/ACTORS.md` とする。

### GitHubを本体、Cloudflareを入口、MCPを共通会社インターフェースとする

GitHubを引き続きAI通訳ラジオのSource of Truthとする。

Cloudflareは一般公開と内部アクセスを分ける「本社の入口」として段階的に整備する。内部Real Memberは認証後、Codex / Claudeなど異なるAIクライアントから同じ会社Contextと許可された道具へ接続できる状態を目指す。

MCPは共通会社インターフェースとして使い、最初は現在地の取得、社内検索、Task Context取得、branch / PR提案、Observation記録など少数機能から始める。

mainへの直接編集は初期の標準権限にしない。

### 3D Presenceを実行基盤とは分離する

内部向け3D本社は、仕事そのものを3Dゲームへ置き換えるものではない。

誰がいるか、どこにいるか、何をしているか、話しかけられそうかを直感的に感じるPresence Layerとして実験する。

フォトリアルを目標にせず、軽量なゲーム風3Dを優先する。映像用高品質3DとPresence用軽量3Dは同じ本社座標を共有できるが、同じ品質目標を持たせない。

Presenceを開かなくても仕事が成立する設計を維持する。

### Workstream全体の優先順位を固定しない

Cloudflare / MCP、Real Member Onboarding、World Model Seed、3D Presence、Studio B、Season 2、Knowledge化は、現時点では一列のロードマップにしない。

必要性、興味、依存関係、利用可能な時間に応じて並行して進め、各Workstreamで代表サンプルや最小PoCを作った時点で人間レビューを挟む。

### 本社空間の正本を平面図・座標データへ移す

生成画像から間取りを推測し続けず、`experiments/headquarters-plan-20261001/headquarters-floorplans.pdf` と `headquarters-layout.json` を、本社の部屋・扉・通路・階段など空間配置のSource of Truthとして扱う。

2階Bの正式用途は「サブ収録用」のまま維持する。ブース内部の詳細図はユーザーが作成し、本社側の仮枠へ反映する。

旧スタジオ画像・動画・3D試作は現在の空間配置の正本にはしない。現行の採用状態は `experiments/studio-spatial-foundation-20261001/asset-policy.json` に従う。

現時点では、本社外観 `09-headquarters-exterior.png` を採用し、通路 `07-headquarters-corridor.png` は紺の壁・木の床や枠・暖色照明など素材感のみを部分採用する。その他の旧ブース画像・動画・旧3D試作は原則参考専用。

旧素材は、現行ツリーには採用素材・比較用contact sheet / review sheet・生成記録・旧3Dの再現に必要なコアだけを残す。大量の不採用動画、silent複製、個別確認フレーム、重複画像、キャッシュ、ログは現行ツリーから削除する。整理前の完全な実ファイルはコミット `2061b03cbedc9729fc4e115e3859bf60a4fd9073` 以前のGit履歴から復元できる。Git履歴の書き換えは行わない。

### 3Dの当面の目的を「空間的一貫性の基盤」にする

3Dの優先目的は、Blender単体で最終フォトリアル画像を完成させることではない。

平面図を基準に家具・建築・機材の位置と向きを固定し、カメラだけを動かして複数アングルの構図リファレンスを作れる状態を優先する。

高品質画像が必要な場合は、3Dレンダーを構図・座標のリファレンスとして使い、別途高品質画像生成へ渡す方法を検証する。

### Narrative SecretとProtected Information（保護情報）を分ける

物語上の秘密設定は、Protected Information（保護情報）とは別に扱う。

Narrative Secretは、ストーリーテリングを面白くするための「まだ答え合わせしない設定」。内部AIが内容や根拠を知ること、World Modelのprovenanceとして出典を残すこと、存在や痕跡から推測されることを禁止しない。

通常の公開出力やActor会話では明示的な答え合わせを避ける。偶発的に一部が漏れた場合も自動的に消去・改変せず、必要ならStory Event候補として扱う。

Protected Information（保護情報）は別枠とし、必要な権限なしに取得・出力しない。

### 本社設定を表／裏／秘密に分離する

本社・猫スタジオに関する設定は、用途によって次の3階層に分ける。

- `world/HQ_PUBLIC.md`：通常の図面・画像・3D・Web等で使う表設定
- `world/HQ_BEHIND_THE_SCENES.md`：猫の活動や物語上の裏側を扱う設定
- `world/HQ_SECRET.md`：Narrative Secretの根拠確認・制作レビュー・真相演出で参照できる設定。公開・Actor出力はReveal Policyに従う

表向きの2階Bは最後まで「サブ収録用」とする。

裏設定・Narrative Secretの具体内容は、一般の決定ログへ全文複製しない。`world/HQ_SECRET.md` は根拠確認・制作レビューでも参照できるが、公開・Actor出力ではReveal Policyに従う。

Narrative Secret設定を理由に、通常の図面・Web・3Dへ未承認の用途・設備・導線を追加しない。

## 2026-09-15

### Episode画像 共通ルール v0.1

Episode 001〜003の採用画像から確認できたデザイン文法を、`context/EPISODE_IMAGE_RULES.md` として確定する。

Episode画像は16:9とし、ネイビー〜ブルーを基調に、白と`#f9a135`で情報階層を作る。左上の縦バー、Episode番号、控えめなブランド表記を共通フォーマットとする。レイアウト自体は固定せず、各Episodeの核心が一瞬で伝わる構図を選ぶ。猫は必須ではなく、使う場合だけ正式キャラクターを参照する。

004以降は、共通ルールと`episodes/images/episode-001.png`〜`episode-003.png`を同時に参照する。一度の失敗だけで規則を増やさず、複数Episodeで繰り返し確認された問題や改善点だけを次版へ反映する。

## 2026-09-14

※ 用語定義は2026-10-01に更新済み。Real Member / World Model Seed / Actorを分離し、現在は `context/ORGANIZATION_MODEL.md` を優先する。以下はWorld Model育成原則の起点として残す。

### Actorを設計するのではなく、World Modelを育てる

AI通訳ラジオGROUPの新しいActor／社員／担当者は、完成した人物設定を先に作らず、実際の仕事を始められる最小限のWorld Model Seedから育てる。

`種 → 登場 → 行動 → 観察 → 発見 → World Model更新 → 次の行動` を基本ループとし、設定から行動を作るだけでなく、行動から判断原理を発見して設定へ戻す。複数のObservationで一貫して確認されたものだけをWorld Modelへ昇格させる。

Known / Observed / Unknownを分離し、矛盾やUnknownをAIが推測で埋めない。現実の人間メンバーにも適用できるが、本人の内面や関係を架空設定化しない。

当面は `context/ACTOR_WORLD_MODEL.md` と `context/ACTORS.md` による小さな文書運用に留め、専用システムや大量のActorは必要性が確認されてから作る。

### Actorの不完全さと組織の信頼性を分ける

中心原則は、**「ミスを作らない。ミスを必要以上に消さない。」**

低リスクの未完成さ、明示された不確かさ、Actor固有の視点や表現は必要以上に均さない。後から判明した誤りは訂正し、その過程をObservationとActorの経験として残す。高リスクの内容は、上司、編集、専門Actorまたは人間の承認によって公開・実行前に検証する。

組織側の確認は、Actor全体を一般的な文章へ書き換えるためではなく、危険や誤りに関係する箇所を必要最小限修正するために行う。既知の誤情報を個性として残すことはしない。

## 2026-09-12

### AI通訳ラジオをContent Hubにする

YouTube単体ではなく、動画・Web記事・SNSへ展開する中心メディアとしてAI通訳ラジオを育てる。

### GitHubを制作側の正本にする

`kazu326/ai-tsuyaku-radio` を、Knowledge・Context・ブランド・編集方針・意思決定・制作物をモデル間で共有するSource of Truthとして使う。

### 日報と現在地を分ける

- `logs/`：その日の観察、試行、経緯、判断理由
- `context/`：現在有効な短い情報

新しいChatGPT/Codex等は原則 `context/CURRENT.md` から読む。必要な場合だけ過去ログへ遡る。

### 3カテゴリー

1. AIニュース解説
2. 難解トピック翻訳
3. 音声・動画コンテンツ

### コンテンツ再利用

動画→記事→SNS、記事→動画→SNSのどちらも可能。順番を固定せず、一つのリサーチ・知識資産から各媒体へ変換する。

### 猫の役割

白黒ハチワレ猫を、人間とAIの間に立つ「通訳者」兼ラジオパーソナリティとする。単なるマスコットにはしない。

### デフォルトデザイン

白黒ハチワレ猫 × ラジオスタジオ × ネイビー/ブルー × オレンジ/アンバー照明 × 白ベースの整理されたUI。

赤 `#A90000` は基本カラーとしては不採用。

### ロゴ

マイク＋猫耳＋猫の尻尾＋電波を一体化した方向を基本案とする。細部は今後調整可能。

### Remotion

既存 `ai-radio-remotion-test` を直接本番リポジトリへ改名するのではなく、AI通訳ラジオを親リポジトリとする。

旧Remotion環境は単独で正常動作状態をGitHubへ保存した後、親の `video/remotion/` へ移植する。検証完了まで旧環境を保護する。

### 自動化

最初から全媒体を自動化しない。人間が最も手をかける中心をAI通訳ラジオに置き、SNS等の派生媒体は運用が安定したものから自動化する。
