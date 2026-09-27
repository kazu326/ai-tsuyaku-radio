import fs from "node:fs";

const timeline = JSON.parse(fs.readFileSync("src/episode6/timeline-v02.json", "utf8"));
const {fps, cues, segments} = timeline;
const frame = (seconds) => Math.round(seconds * fps);
const segment = (id) => {
  const found = segments.find((item) => item.id === id);
  if (!found) throw new Error(`Missing segment: ${id}`);
  return found;
};
const panel = (id, from, seconds, title, cards, footer = "") => ({
  id, from, durationInFrames: frame(seconds), title, cards, footer,
});

const canvas = [
  {
    id: "A", file: "episode6/canvas/ep006_A_weights_from_212.80s.webm",
    from: cues.modelWeights.frame - frame(0.8), durationInFrames: frame(55.2),
    x: 110, y: 50, width: 1700, height: 740,
    anchor: "modelWeights",
  },
  {
    id: "B", file: "episode6/canvas/ep006_B_foundation_from_293.60s.webm",
    from: cues.foundation.frame - frame(0.2), durationInFrames: frame(30.6),
    x: 110, y: 50, width: 1700, height: 740,
    anchor: "foundation",
  },
];
const chapterTitles = [
  ["01", "高価なAIの横に、ダウンロードボタンがある"],
  ["02", "無料で配りながら、有料でも売れる"],
  ["03", "公開されているのは、AIのどこまで？"],
  ["04", "公開した先にできる「土台」"],
  ["05", "Season 1の終わりに"],
].map(([id, title]) => ({id, title, from: segment(id).from, durationInFrames: frame(3)}));
const panels = [
  panel("free-download", cues.freeDownload.frame, 8, "無料で受け取る", ["ダウンロード", "使ってみる"], "入口が開く"),
  panel("freemium", cues.freemiumQuestion.frame, 12, "無料の、その先", ["無料体験", "便利な機能", "継続利用"], "使い続ける価値にお金を払う"),
  panel("cat-sample", cues.catSample.frame, 13, "猫のごはんの試供品", ["試してみる", "気に入る", "選び続ける"], "無料で渡すことにも理由がある"),
  panel("model-foundation", cues.openModelAnalogy.frame, 18, "AIモデルを公開すると", ["モデル", "開発者・企業", "製品・サービス"], "多くの人が使う土台へ"),
  panel("deepseek-release", cues.deepSeekOpens.frame, 12, "DeepSeekが公開したもの", ["V3・R1", "モデルの重み", "利用・改良"], "公開は競合にも届く"),
  panel("why-publish", cues.whyPublish.frame, 15, "なぜ、あえて公開する？", ["研究への貢献", "宣伝", "事業の土台"], "公開する企業側の理由を探す"),
  panel("free-and-paid", segment("02").from + frame(3), 14, "無料で配り、有料でも売る", ["モデルを自分で動かす", "API・導入を任せる"], "選べる使い方がある"),
  panel("api-operation", cues.paidApi.frame, 20, "重みだけでは終わらない仕事", ["GPUで動かす", "止めずに運用", "安全につなぐ"], "便利さ・速さ・安全性に価値が残る"),
  panel("car-analogy", cues.carAnalogy.frame, 12, "車にたとえると", ["車を渡す", "運転まで任せる"], "モデルの公開とAPIの販売は両立する"),
  panel("what-is-open", segment("03").from + frame(3), 9, "公開されるのは、どこまで？", ["モデルの重み", "作った全工程"], "この違いを確かめる"),
  panel("api-only", segment("04").from + frame(3), 11, "APIだけでも売れるのに", ["APIだけ提供", "モデルも公開"], "なぜ、モデルを渡すのか"),
  panel("revenue-paths", cues.revenuePaths.frame, 12, "価値を受け取る道", ["モデル", "API・運用", "本業"], "企業によって選び方は違う"),
  panel("open-scope", cues.openScope.frame, 7, "公開の範囲を選ぶ", ["何を開くか", "どこまで開くか"], "モデルごとに違う"),
  panel("make-deliver-use", cues.deepSeekExample.frame, 15, "AIの競争は、届け方まで", ["技術を作る", "APIとして届ける", "使われる"], "公開だけで評価は決まらない"),
  panel("season-recap", cues.seasonRecap.frame, 18, "Season 1を振り返る", ["GPU", "チップ", "半導体", "モデル公開"], "作る側・支える側の競争"),
  panel("surrounding-system", cues.surroundingSystem.frame, 12, "AIを支える仕組み", ["モデル", "計算資源", "道具・環境"], "強さは知能だけで決まらない"),
  panel("user-side", cues.userSide.frame, 17, "次は、使う側へ", ["渡す情報", "指示・文脈", "つなぐ道具"], "同じAIでも結果は変わる"),
  panel("season-two", cues.season2.frame, 8.6, "Season 2へ", ["AIをどう使うか"], "僕たちの問いへ"),
];
const relations = {
  "why-publish": "options",
  "free-and-paid": "options",
  "api-operation": "options",
  "car-analogy": "options",
  "what-is-open": "contrast",
  "api-only": "contrast",
  "revenue-paths": "options",
  "open-scope": "options",
  "season-recap": "options",
  "surrounding-system": "options",
  "user-side": "options",
};
for (const item of panels) item.relation = relations[item.id] ?? "flow";
const seCues = chapterTitles.map(({id, from}) => ({
  id: `chapter-${id}`, from, durationInFrames: frame(1), volume: 0.08,
}));

const overlaps = (a, b) => a.from < b.from + b.durationInFrames && b.from < a.from + a.durationInFrames;
for (const item of [...canvas, ...panels, ...chapterTitles]) {
  if (item.from < 0 || item.from + item.durationInFrames > timeline.durationInFrames) {
    throw new Error(`Visual outside composition: ${item.id}`);
  }
}
for (const item of [...panels, ...chapterTitles]) {
  if (canvas.some((clip) => overlaps(item, clip))) {
    throw new Error(`Supplementary visual overlaps Canvas: ${item.id}`);
  }
}
if (panels.some((item, index) => panels.slice(index + 1).some((other) => overlaps(item, other)))) {
  throw new Error("Supplementary panels overlap");
}

const result = {canvas, chapterTitles, panels, seCues};
fs.writeFileSync("src/episode6/visuals-v02.json", `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({canvas: canvas.map(({id, from, durationInFrames}) => ({id, from, durationInFrames})), panels: panels.length, chapters: chapterTitles.length}));
