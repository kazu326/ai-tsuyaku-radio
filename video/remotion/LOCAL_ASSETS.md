# Local Assets

このプロジェクトはRemotionをローカル環境で実行する。GitHubはコード、設定、字幕JSON、台本、素材パス、管理情報の正本とし、MP4の実体は管理しない。

`.gitignore`の`*.mp4`は意図した設定である。下記のファイルがGitに存在しなくても削除や破損ではなく、各パスへローカル配置する前提を示す。Remotion Studioの起動・バンドル・レンダリング前に、使用するCompositionが必要とするMP4を配置する。

## 共通素材

| File | Local Path | 用途 | 尺 | 解像度 |
|---|---|---|---:|---:|
| `cat200.mp4` | `public/cat200.mp4` | 第2話本編の左下に表示する猫動画。0秒から等速、無音、非ループ | 11:03 | 960×960 |
| `opening.mp4` | `public/opening.mp4` | オープニング用のローカル動画素材 | 00:13 | 1920×1080 |

## 背景素材

`public/video/`以下のA・B・C素材は背景Asset Registryで管理する。用途区分とループ可否の正本は`src/data/background-assets.ts`、詳細なフレームレートと尺は`src/episode2/background-video-metadata.json`を参照する。

| File | Local Path | 用途 | 尺 | 解像度 |
|---|---|---|---:|---:|
| `a1.mp4` | `public/video/a1.mp4` | 背景プールA | 00:11 | 1280×720 |
| `a2.mp4` | `public/video/a2.mp4` | 背景プールA | 00:29 | 1920×1080 |
| `a3.mp4` | `public/video/a3.mp4` | 背景プールA | 00:28 | 1920×1080 |
| `a4.mp4` | `public/video/a4.mp4` | 背景プールA | 00:38 | 1920×1080 |
| `a5.mp4` | `public/video/a5.mp4` | 背景プールA | 00:21 | 1920×1080 |
| `a6.mp4` | `public/video/a6.mp4` | 背景プールA | 00:21 | 1920×1080 |
| `a7.mp4` | `public/video/a7.mp4` | 背景プールA | 01:00 | 1280×720 |
| `a8.mp4` | `public/video/a8.mp4` | 背景プールA | 00:30 | 1920×1080 |
| `a9.mp4` | `public/video/a9.mp4` | 背景プールA | 00:59 | 1280×720 |
| `a10.mp4` | `public/video/a10.mp4` | 背景プールA | 01:00 | 1280×720 |
| `a11.mp4` | `public/video/a11.mp4` | 背景プールA | 00:59 | 1920×1080 |
| `b1.mp4` | `public/video/b1.mp4` | 背景プールB | 00:30 | 1920×1080 |
| `b2.mp4` | `public/video/b2.mp4` | 背景プールB | 00:15 | 1920×1080 |
| `b3.mp4` | `public/video/b3.mp4` | 背景プールB | 00:20 | 1920×1080 |
| `b4.mp4` | `public/video/b4.mp4` | 背景プールB | 01:48 | 1280×720 |
| `b5.mp4` | `public/video/b5.mp4` | 背景プールB | 00:56 | 1280×720 |
| `b6.mp4` | `public/video/b6.mp4` | 背景プールB | 00:24 | 1920×1080 |
| `b7.mp4` | `public/video/b7.mp4` | 背景プールB | 00:59 | 1920×1080 |
| `b8.mp4` | `public/video/b8.mp4` | 背景プールB | 00:25 | 1280×720 |
| `b9.mp4` | `public/video/b9.mp4` | 背景プールB | 00:59 | 1920×1080 |
| `b10.mp4` | `public/video/b10.mp4` | 背景プールB | 01:57 | 1920×1080 |
| `c1.mp4` | `public/video/c1.mp4` | 背景プールC | 00:20 | 1920×1080 |
| `c2.mp4` | `public/video/c2.mp4` | 背景プールC | 00:21 | 1920×1080 |
| `c3.mp4` | `public/video/c3.mp4` | 背景プールC | 00:15 | 1280×720 |
| `c4.mp4` | `public/video/c4.mp4` | 背景プールC | 00:14 | 1920×1080 |
| `c5.mp4` | `public/video/c5.mp4` | 背景プールC | 00:15 | 1280×720 |
| `c6.mp4` | `public/video/c6.mp4` | 背景プールC | 00:28 | 1920×1080 |
| `c7.mp4` | `public/video/c7.mp4` | 背景プールC | 00:29 | 1920×1080 |
| `c8.mp4` | `public/video/c8.mp4` | 背景プールC | 00:15 | 1920×1080 |

## 猫・トピック素材

| File | Local Path | 用途 | 尺 | 解像度 |
|---|---|---|---:|---:|
| `cat1.mp4` | `public/video/cat1.mp4` | 猫素材プール | 00:26 | 1920×1080 |
| `cat2.mp4` | `public/video/cat2.mp4` | 猫素材プール | 00:30 | 1920×1080 |
| `cat3.mp4` | `public/video/cat3.mp4` | 猫素材プール | 00:30 | 1920×1080 |
| `cpu1.mp4` | `public/video/cpu1.mp4` | CPUトピック素材 | 00:12 | 1920×1080 |
| `gpu1.mp4` | `public/video/gpu1.mp4` | GPUトピック素材 | 00:15 | 1920×1080 |
| `gpu2.mp4` | `public/video/gpu2.mp4` | GPUトピック素材 | 00:06 | 1920×1080 |
| `server1.mp4` | `public/video/server1.mp4` | サーバートピック素材 | 00:12 | 1920×1080 |

## Episode 2

第2話専用の追加MP4はない。`AI-Radio-Episode2-Main-v01`は、共通素材の`public/cat200.mp4`と`public/video/`の背景素材を使用する。音声6本、図解画像、字幕、SEはMP4ではないためGit管理対象とする。

## 出力動画

レンダリング結果は`out/`へ置く。`out/`もGit管理対象外であり、公開済み動画や比較用MP4の状態は`PROJECT_CONTEXT.md`と各制作メモで管理する。

## 更新ルール

- MP4を追加・改名・移動した場合は、コード内の参照パスとこの台帳を同時に更新する。
- ファイルの実体をGitへ追加しない。
- 素材を差し替えた場合は、必要に応じて尺・解像度・用途を更新する。
- Git clone後にMP4がなくても正常である。使用するCompositionに必要な素材を上記パスへローカル配置してから実行する。
