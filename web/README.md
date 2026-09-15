# AI通訳ラジオ Web MVP

トップからEpisode 001の記事全文を読む、ローカルレビュー用の最小Webアプリです。

## 起動

Node.js 20.9以上とpnpm 11.19.0を使用します。検証環境はWindows / Node.js 24.19.0。
この環境ではnpmがPATHになく、Codex同梱のpnpmを使っています。

PowerShellで、リポジトリのルートから実行します。

```powershell
Set-Location web
pnpm.cmd install --frozen-lockfile
pnpm.cmd run dev
```

- トップ: http://127.0.0.1:3000/
- 記事: http://127.0.0.1:3000/episodes/ep001-ultrafast

pnpmがPATHにない場合、今回のCodex環境では以下で同じコマンドを呼び出せます。

```powershell
& 'C:\Users\kukyo\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' run dev
```

停止は起動したターミナルで `Ctrl+C`。本番ビルドのローカル確認は以下です。

```powershell
pnpm.cmd run lint
pnpm.cmd run typecheck
pnpm.cmd run build
pnpm.cmd run start --port 3001
```

本番確認URLは http://127.0.0.1:3001/ です。ローカル接続のみで、デプロイは行っていません。

## 構成と原稿

- Next.js 16.3.5 / React 19.3.0 / TypeScript / 通常のCSS。UIライブラリ、API、DB、CMSはありません。
- App RouterのServer Componentsで2ページを静的生成します。
- `../episodes/ep001-ultrafast/article.md` をビルド時に読み込みます。**リポジトリ全体を保持し、コマンドはweb内で実行してください。** webフォルダ単独では原稿を読めません。
- Frontmatterはgray-matter、本文はreact-markdownで表示。ページ見出しと重複する先頭H1だけを表示時に除き、本文と参考資料は保持します。元記事にあるVideo IDからYouTubeリンクを表示します。
- 元記事の `draft` は変更せず、今回のレビューではEpisode 001のみを明示的に表示します。すべてのページに `noindex, nofollow` を設定しています。
- 記事を更新した場合、開発サーバーは再起動、本番確認は再ビルドしてください。
- 日本語フォントNoto Sans JPは依存パッケージから配信し、実行時にGoogle Fontsへ接続しません。
- pnpmの `allowBuilds` では、ESLint依存のunrs-resolverのネイティブ初期化だけを明示的に許可しています。

## 画像

今回、人間側で確定した正式素材をそのまま使用しています。新しい画像生成や画像生成基盤の追加は行っていません。

- `public/images/logo-20260915.png`: ヘッダー用の正式ロゴ
- `public/images/icon-white.png`: 濃色フッター用の反転ロゴ
- `public/images/hero-20260915.png`: Desktop専用ヒーロー
- `public/images/hero-mobile.png`: Mobile専用ヒーロー
- `public/images/episode-001.png`: 差し替え予定の仮サムネイル

DesktopとMobileのヒーローは`picture`要素で切り替え、各モードの表示高さをCSSで固定しています。見出し、説明、ボタンはHTMLで重ねています。中間サイズはDesktop素材を使います。

## レビュー

結果は [review/REVIEW.md](review/REVIEW.md) に記録します。
ブラウザ検証スクリプトは `review/verify.mjs`。Playwrightとmarkedはレビュー環境から供給し、アプリ依存には追加していません。

今回のCodex環境で再実行する場合、サーバーを起動したうえで、web内で実行します。

```powershell
$env:NODE_PATH = 'C:\Users\kukyo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:RADIO_REVIEW_URL = 'http://127.0.0.1:3001'
node review/verify.mjs
```

Chromeが必要です。他の環境ではPlaywrightとmarkedを別途レビュー用に用意し、そのnode_modulesをNODE_PATHに設定します。
スクリーンショットとJSON結果は `review/` に保存し、Git管理対象外とします。

## 今回の境界

変更はweb内のみ。元記事・Context文書・参照画像・Remotion環境は変更しません。
Episode 002 / 003、検索、お知らせ本文ページ、画像生成や自動化、CMS、DB、API、デプロイは今回の対象外です。トップのお知らせ5件は情報密度を確認するための仮表示です。
