# AGENTS.md

AI通訳ラジオでCodex、Claude Code、その他のAIエージェントが共通して参照する作業入口です。

## 作業開始時

次の順で確認する。

1. `README.md`
2. `context/CURRENT.md`
3. 作業内容に応じた関連資料

必要な資料だけを追加で読む。過去ログや秘密設定を常時すべて読み込む必要はない。

## Source of Truth

このリポジトリを制作側のSource of Truthとして使う。

ただし、**ファイルが存在することと、現在採用されていることは同義ではない。**

特に `experiments/`、生成画像・生成動画・3D試作を利用するときは、そのフォルダの `README.md`、`adoption-status.json`、`asset-policy.json` などから現在の採用状態を確認する。

不採用・参考専用の素材を、ファイルが残っているという理由だけで制作へ戻さない。

## 組織・Seed・Actor

人間、内部AI、外向けキャラクターを扱う場合は、まず `context/ORGANIZATION_MODEL.md` を読む。

- Real Member = 現実の人間。架空設定化しない
- World Model Seed = その人・組織の目的、Context、権限、評価、経験を実務から育てるAI作業基盤
- Actor = 外部との接点が必要になったSeedが持つ表現層

WorldModelSeedの設計原則、Task Contract、Challenge、内部／外部Seedの違いは `context/WORLD_MODEL_SEED.md` を参照する。

KnowledgeのScope、Role / Permission、Personal / Client境界は `context/KNOWLEDGE_MODEL.md` を参照する。

現在存在するSeed / Candidateの一覧は `context/WORLD_MODEL_SEEDS.md`、Actor一覧は `context/ACTORS.md` を参照する。

内部処理だけで成立するSeedを、名前・外見・声を持つActorへ勝手に変えない。Real Memberの性格、能力、感情、事情を推測で設定しない。

Real Memberへ既定の制作担当を押し付けない。新規参加時は、本人が「AIを使って何をやってみたいか」を起点に、小さなExperimentを作る。活動は動画・記事・Web内に限定しない。

全員へ同じ完成済みAgentを適用しない。内部SeedでもRole / Permission / Personal Contextに応じて必要なWorldだけを参照する。外部顧客向けSeedは内部Seedのコピーとして作らない。

## Knowledgeとアクセス境界

次を同一視しない。

- Knowledgeが存在する
- AgentがRetrievalできる
- 現在のTaskでUseできる
- 外部へDisclosureできる

Protected Informationは権限がなければ取得・利用・出力しない。

Client / Personal / Role Scoped Knowledgeを、便利だからという理由で組織全体のContextへ昇格しない。汎用Knowledgeへ戻す場合は、provenance、Scope、必要なHuman Reviewを確認する。

## 世界設定

本社・猫スタジオの設定は必要な範囲だけ読む。

- 通常の図面・画像・3D・Web制作：`world/HQ_PUBLIC.md`
- 猫の活動や物語上の裏側が必要：`world/HQ_BEHIND_THE_SCENES.md`
- Narrative Secretの根拠確認・制作レビュー・真相演出：`world/HQ_SECRET.md`

`HQ_SECRET.md` は物語上のNarrative Secretとして扱う。制作側AIは根拠確認のため参照してよいが、Actorとして振る舞う場面や公開向け出力では、通常は明示的な答え合わせをしない。存在・痕跡・推測・偶発的な漏れは許容し、面白い出来事になった場合はStory Event候補として扱う。

特に、2階Bの正式用途は「サブ収録用」のまま。物語上の秘密を理由に、正式図面や通常制作を勝手に書き換えない。

### Narrative SecretとProtected Information

- Narrative Secret：ストーリーテリングのための秘密。内部AIは知っていてよく、根拠・provenanceも保持できる。通常公開では明示的な答え合わせを避けるが、痕跡や推測は許容する。
- Protected Information（保護情報）：認証情報、個人情報、契約情報など、現実に保護が必要な情報。必要な権限がなければ取得・出力しない。保存・アクセス境界は `docs/SYSTEM_ARCHITECTURE.md` の Information classes / Protected Information storage を参照する。

制作レビューではNarrative Secretについて事実を正直に説明してよい。Actorとしての会話や公開コンテンツでは、そのActorが知らない設定なら知らないふり・はぐらかし・冗談など、物語上の振る舞いを優先する。

## 空間・3D

現在の本社空間は、`experiments/headquarters-plan-20261001/` の平面図と座標データを基準にする。

旧スタジオ画像・動画・3D試作から、間取りや扉・窓・家具配置を推測して戻さない。

3Dの当面の目的は、最終フォトリアル作品そのものより、複数アングルでも崩れない空間・座標・カメラの基盤を作ること。

Presence用3Dは、映像用高品質3Dと同じ見た目を要求しない。軽量で位置・状態・会話のきっかけが分かることを優先する。

## 変更時の原則

- 既存の正式用途、ブランド、採用状態、空間配置を推測で変更しない
- Unknownや未決定事項を勝手に確定しない
- 一度の失敗だけで大きなルールを追加しない
- 大量生成や仕上げへ進む前に、代表サンプル・ブロッキングで人間レビューを挟む
- 次回の作業開始時にも必要な決定は、チャットだけに残さずSource of Truthへ反映する

## GitHub上の変更

原則として、変更は作業ブランチで行い、PRで確認してからmainへ反映する。ユーザーが明示的に別の方法を指定した場合は、その指示を優先する。

## 作業終了時

次回の再開に必要な状態変化がある場合は、最低限次を確認する。

- `context/CURRENT.md` が古くなっていないか
- 重要な確定事項を `context/DECISIONS.md` に残す必要がないか
- READMEや関連資料への入口が切れていないか
- 採用／不採用の状態が実ファイルと矛盾していないか
- Seed / Actor / Real Memberの区別が崩れていないか
