# AI通訳ラジオ｜Real Member Onboarding v0.2

Status: Draft for review / 2026-10-02  
Audience: AI通訳ラジオに新しく参加する現実の人

## 1. ようこそ

AI通訳ラジオでは、最初からAIに詳しいことを前提にしません。

最初に決めるのは、動画や記事の担当ではありません。

**「AIを使って、何をやってみたいですか？」**

から始めます。

例えば、

- SNSをやってみたい
- AIアプリやWebサービスを作りたい
- 動画や記事を作りたい
- 商品を企画して外注したい
- 3Dプリンターや電子工作で何か作りたい
- ECやクラウドファンディングを試したい
- まだ何をしたいか分からない

でも構いません。決まっていなければ、最初の会話でAIと一緒に候補を出して、短期間で試せるものを一つ選びます。

やったことがAI通訳ラジオの中で完結する必要はありません。面白い経験や再利用できる知見が生まれたら、あとから記事・動画・SNSなどへ「通訳」することがあります。

## 2. 先に知っておくこと（3つだけ）

### このリポジトリは公開されています

誰でも読めます。次のものは置かないでください。

- 自分や他人の個人情報
- 勤務先や顧客の資料
- パスワード、APIキーなどの認証情報

迷ったら、置かずにProject Leadへ確認してください。

### AIがあなたを「設定」することはありません

あなたは架空のキャラクターではありません。AIがあなたの性格・能力・感情・事情を勝手に決めることはしません。

同じように、他のReal Memberに関する個人的な情報を、推測したり記録したりしません。

### mainは直接変更しません

変更は必ず作業ブランチで行い、PR（変更の提案）を出してレビューを受けます。

## 3. 準備

### GitHub

内部Real Memberとして参加する場合：

1. GitHubアカウントを作る
2. Project Lead（`@kazu326`）から、このリポジトリへのcollaborator招待を受け取り、承認する

この文書の一本道は、collaboratorとして参加するReal Member向けです。

外部Contributorとして参加する場合は、招待の代わりにリポジトリをforkします。その場合は、後述のclone先を自分のforkへ変更し、自分のforkへpushしてから、本家 `kazu326/ai-tsuyaku-radio` の `main` にPRを送ります。

### Git

公式サイト（https://git-scm.com/downloads）からインストールします。

インストール後、一度だけ名前とメールアドレスを設定します。

```bash
git config --global user.name "Taro Yamada"
```

```bash
git config --global user.email "taro@example.com"
```

名前とメールアドレスは自分のものに置き換えてください。GitHubアカウントに登録済みのメールアドレス、またはGitHubのnoreplyアドレスを使うと、commitを自分のGitHubアカウントへ関連付けやすくなります。

### AIクライアント

この文書ではCodex CLIを使う手順で説明します。インストールとログインは公式ガイドに従ってください。

- Codex CLI公式ガイド：https://learn.chatgpt.com/docs/codex/cli

Claude Codeでも同じ流れで進められます。

## 4. 最初の1周

ここが本番です。一度、最後まで通してみてください。

### ① リポジトリを自分のPCへ取得する

collaboratorとして参加するReal Member：

```bash
git clone https://github.com/kazu326/ai-tsuyaku-radio.git
```

外部Contributorとしてforkした場合は、自分のGitHubユーザー名へ置き換えます。

```bash
git clone https://github.com/YOUR_GITHUB_USER/ai-tsuyaku-radio.git
```

その後：

```bash
cd ai-tsuyaku-radio
```

worktreeなどの特別な仕組みは不要です。

### ② 作業ブランチを作る

```bash
git switch -c experiment-first-task
```

`experiment-first-task` の部分は、作業内容が分かる短い英数字とハイフンの名前に変えて構いません。

### ③ AIでフォルダを開く

`ai-tsuyaku-radio` フォルダをCodexで開きます。CLIなら、このフォルダの中で次を実行します。

```bash
codex
```

AIはフォルダ内の `AGENTS.md`（Claude Codeでは `CLAUDE.md`）から作業ルールを読みます。あなたが資料を全部読む必要はありません。

### ④ 最初の会話

例えば次のように話しかけます。

> 私は新しいReal Memberです。このリポジトリの作業方針を確認してください。そのうえで、AIを使って何をやってみたいか一緒に整理し、最初の小さなExperimentを決めてください。必要なContextだけ読んでください。

特別なPromptを覚える必要はありません。

### ⑤ 小さなExperimentを決める

最初から大きな成果物は要りません。**短期間で実際に試せて、結果が観察できること**を一つ選びます。

例：

- SNS投稿を3本作って反応を見る
- 小さなAIツールを1つ作る
- 3Dプリンターで小さな試作品を作る
- 外注用の仕様書をAIと作る
- 自分の作業を一工程だけAIで改善する

始める前に、AIと次の3つだけ確認します。

- 今回何をやりたいか（どうなったら終わりか）
- どこまでAIに任せるか
- どこで自分が確認するか

成功しなくても構いません。

### ⑥ 実行して、変更を確認する

AIと一緒に作業します。AIが「今の条件では難しい」と言ったら、勝手に範囲を広げさせず、条件を一緒に見直します。

リポジトリにファイルを残す必要がある場合は、まず既存の構造を確認して適切な場所へ置きます。採用前の試作・検証なら `experiments/` を使います。場所が分からなければAIまたはProject Leadへ確認してください。

3Dプリント、販売、外部サービスの運用など、作業そのものがリポジトリ外で完結するExperimentでも、PRにする場合は公開可能な短いObservationをMarkdownとして既存の適切な場所（例：既存の `logs/` 運用）へ残し、その差分をcommitします。保存場所が明確でない場合は、新しい体系を作らず先に確認してください。

公開できるファイルを何も残さない場合は、無理に空のPRを作らず、Issueや既存PRへのコメントなど、その時点で指定された方法で共有します。

何が変わったかは次で確認できます。AIに「変更内容を説明して」と頼んでも構いません。

```bash
git status
```

公開してはいけないもの（§2）が含まれていないか、ここで必ず確認します。見覚えのないファイルや大量の生成物（例：`node_modules/`）が表示された場合は、`git add` せずAIまたはProject Leadへ確認してください。

### ⑦ commitしてpushする

`git status` で内容を確認してから実行します。

```bash
git add -A
```

```bash
git commit -m "Add first experiment"
```

```bash
git push -u origin experiment-first-task
```

ブランチ名を変えた場合は、最後のコマンドの `experiment-first-task` も同じ名前にします。初めてpushするときは、ブラウザでGitHubへのログインを求められることがあります。

外部Contributorの場合、この `origin` は自分のforkです。

### ⑧ PRを出す

GitHubのリポジトリページを開くと「Compare & pull request」ボタンが表示されることがあります。表示されない場合は「Pull requests」→「New pull request」から作成します。

collaboratorは本家リポジトリの `main` へ、外部Contributorは自分のforkのブランチから本家 `kazu326/ai-tsuyaku-radio` の `main` へPRを送ります。

PR本文に次を書きます。

```md
## やりたかったこと

## AIに任せた範囲

## 実際に起きたこと

## 予想外だったこと・次に使えそうなこと
```

長い日報は不要です。うまくいかなかったことも大事な記録です。

### ⑨ レビュー

Project Leadや他のメンバーがレビューし、問題がなければmainへ反映されます。これで1周です。

## 5. 分からないとき

「分からない」は正常です。AI通訳ラジオも、この仕組みも完成品ではありません。

使いにくかった場所、理解できなかった場所、AIが間違えた場所は、仕組みを良くするための大事な記録です。PRまたはProject Leadへそのまま伝えてください。

最初から全部を理解するより、まず小さく1周してください。

## 6. もっと知りたくなったら

最初に読む必要はありません。

- `../context/ORGANIZATION_MODEL.md` — Real Member / Seed / Actorという組織の考え方
- `../context/WORLD_MODEL_SEED_SYSTEM.md` — あなたと一緒に育つAI（Seed）の仕組み
- `../context/VISION.md` — AI通訳ラジオが目指す長期像
- `SYSTEM_OVERVIEW.md` — 全体像
