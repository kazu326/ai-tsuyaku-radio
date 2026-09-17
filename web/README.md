# AI通訳ラジオ Web MVP

トップからEpisode 003の最新記事とEpisode 001〜003の記事全文を読む、ローカルレビュー用の最小Webアプリです。

## 起動

Node.js 20.9以上とpnpm 11.19.0を使用します。検証環境はWindows / Node.js 24.19.0。
この環境ではnpmがPATHになく、Codex同梱のpnpmを使っています。

公開環境では `NEXT_PUBLIC_SITE_URL` にサイトのオリジンを設定すると、各EpisodeのOpen Graph / Xカード画像が絶対URLで出力されます。未設定時はローカル確認用の `http://localhost:3000` を使用します。

PowerShellで、リポジトリのルートから実行します。

```powershell
Set-Location web
pnpm.cmd install --frozen-lockfile
pnpm.cmd run dev
```

- トップ: http://127.0.0.1:3000/
- 記事: http://127.0.0.1:3000/episodes/ep001-ultrafast
- 記事: http://127.0.0.1:3000/episodes/ep002-cerebras
- 記事: http://127.0.0.1:3000/episodes/ep003-japan-semiconductor

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
- App RouterのServer ComponentsでトップとEpisode 001〜003の記事ページを静的生成します。
- `../episodes/ep001-ultrafast/article.md`、`../episodes/ep002-cerebras/article.md`、`../episodes/ep003-japan-semiconductor/article.md` をビルド時に読み込みます。**リポジトリ全体を保持し、コマンドはweb内で実行してください。** webフォルダ単独では原稿を読めません。
- Frontmatterはgray-matter、本文はreact-markdownで表示。ページ見出しと重複する先頭H1だけを表示時に除きます。記事末尾の用語と出典は原稿から表示用データへ分け、共通の余韻ゾーン、続いて記事最下部の出典として表示します。元記事にあるVideo IDからYouTubeリンクを表示します。
- Episode 001〜003だけを明示的に表示します。すべてのページに `noindex, nofollow` を設定しています。
- 記事を更新した場合、開発サーバーは再起動、本番確認は再ビルドしてください。
- 日本語フォントNoto Sans JPは依存パッケージから配信し、実行時にGoogle Fontsへ接続しません。
- pnpmの `allowBuilds` では、ESLint依存のunrs-resolverのネイティブ初期化だけを明示的に許可しています。

## 画像

今回、人間側で確定した正式素材をそのまま使用しています。新しい画像生成や画像生成基盤の追加は行っていません。

- `public/images/logo-20260915.png`: ヘッダー用の正式ロゴ
- `public/images/icon-white.png`: 濃色フッター用の反転ロゴ
- `public/images/hero-20260915.png`: Desktop専用ヒーロー
- `public/images/hero-mobile.png`: Mobile専用ヒーロー
- `public/images/episode-001.png`: Episode 001の仮サムネイル
- `public/images/episode-002.png`: Episode 002の正式画像
- `public/images/episode-003.png`: Episode 003の正式画像

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

Episode 003の正式画像・記事ルート・トップからの導線を追加しました。検索、お知らせ本文ページ、画像生成や自動化、CMS、DB、API、デプロイは今回の対象外です。トップのお知らせ5件は情報密度を確認するための仮表示です。
