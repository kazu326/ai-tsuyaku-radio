# Remotion Migration

最終更新：2026-09-12

## コピー元

- Repository: `kazu326/ai-radio-remotion-test`
- 保護する基準Commit: `4191ac7ad8d286d296fd340f9e1e0b7f50ffdd51`
- Commit message: `Merge GitHub repository history`
- 状態: 初回GitHub保存完了。ローカルでlint / TypeScript / Remotion bundle / Composition 6件の読み込み確認済み。

このCommitを、親リポジトリ統合時のコピー元スナップショットとして固定する。

## 統合先

`video/remotion/`

RemotionはAI通訳ラジオ全体の一機能であり、親リポジトリ全体をRemotionプロジェクトとして扱わない。

## 移植対象

コピー元の実行環境を壊さないため、原則としてGit管理されているRemotionプロジェクト一式をそのまま `video/remotion/` 配下へ移植する。

主な対象:

- `src/`
- `public/` のGit管理対象素材
- `docs/` のRemotion制作・検証文書
- `scripts/`
- `diagnostics/`
- `.agents/`
- `package.json`
- `package-lock.json`
- `remotion.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `.prettierrc`
- `skills-lock.json`
- Remotion固有の `PROJECT_CONTEXT.md`
- ローカル素材台帳 `video/remotion/LOCAL_ASSETS.md`（コピー元内の現行パス。統合時は配置を整理する）

## 親へ昇格する情報

コピー元 `PROJECT_CONTEXT.md` の内容を丸ごと親の `context/` へ移さない。

- 番組全体のブランド・編集思想・Content Hub方針 → 親 `context/`
- Remotion実装、Composition、字幕同期、背景、SE、レンダリング、検証状態 → `video/remotion/`
- エピソード固有のリサーチ・台本・記事 → 将来 `episodes/` へ整理

既存文書は履歴・証跡としてまず保持し、統合と同時に大規模な文書整理をしない。

## Git管理しないもの

- `*.mp4`
- `out/`
- `node_modules/`
- `build/`
- `dist/`
- `.env`

MP4の実体はローカル専用。必要パス・用途・尺・解像度は素材台帳で管理する。

## 統合時の重要事項

コピー元は正常動作スナップショットとして変更しない。親への統合はコピーとして行い、旧リポジトリを削除・改名・退役させない。

親へ配置後、ローカルで以下を確認するまで移植完了としない。

1. `video/remotion/` で依存関係をインストールできる
2. lint / TypeScript がエラー0
3. Remotion bundle成功
4. Composition 6件が読み込める
5. ローカルMP4を素材台帳記載パスへ置いた状態で既存Compositionが参照できる
6. 第2話 `AI-Radio-Episode2-Main-v01` がStudioで開ける

## 方針

移植フェーズでは「動いているものを整理しながら作り直す」をしない。

まず同等状態で親へ収容し、正常動作を確認する。その後、親リポジトリの構造に合わせた整理を別工程として行う。
