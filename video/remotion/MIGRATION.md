# Remotion Migration

最終更新：2026-09-13

## 状態

移植完了。2026-09-13に検証結果が承認され、親リポジトリの `main` へpushした。

- 統合Commit: `c14798074e01c2384457c079d2185cf780ab1bac`
- Commit message: `Integrate Remotion production environment`

## コピー元

- Repository: `kazu326/ai-radio-remotion-test`
- 保護する基準Commit: `4191ac7ad8d286d296fd340f9e1e0b7f50ffdd51`
- Commit message: `Merge GitHub repository history`
- 状態: 初回GitHub保存完了。ローカルでlint / TypeScript / Remotion bundle / Composition 6件の読み込み確認済み。

このCommitを、親リポジトリ統合時のコピー元スナップショットとして固定した。旧プロジェクトは変更せず、引き続きコピー元として保護する。

## 統合先

`video/remotion/`

RemotionはAI通訳ラジオ全体の一機能であり、親リポジトリ全体をRemotionプロジェクトとして扱わない。

## 移植対象

コピー元の実行環境を壊さないため、Git管理されているRemotionプロジェクト一式198ファイルをそのまま `video/remotion/` 配下へ移植した。

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
- ローカル素材台帳 `video/remotion/LOCAL_ASSETS.md`（記載された相対パスを維持）

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

## 移植完了記録

コピー元は正常動作スナップショットとして変更していない。親への統合はコピーとして行い、旧リポジトリは削除・改名・退役させていない。

親へ配置後、ローカルで以下を確認した。

1. `video/remotion/` で `npm ci` 成功
2. lintはエラー0（既存警告3件）、TypeScriptはエラー0
3. Remotion bundle成功
4. Composition 6件の読み込み成功
5. ローカルMP4 38本を素材台帳記載パスへ配置し、コピー元とのハッシュ一致を確認
6. MP4配置後に全6 Compositionを再読み込みし、第2話 `AI-Radio-Episode2-Main-v01` を確認
7. `*.mp4`、`node_modules/`、`build/`、`dist/`、`out/`、`.env` が統合Commitに含まれていないことを確認

## 方針

移植フェーズでは「動いているものを整理しながら作り直す」を行わなかった。

同等状態で親へ収容し、正常動作を確認済み。今後、親リポジトリの構造に合わせた整理を行う場合は、移植と分けた別工程とする。
