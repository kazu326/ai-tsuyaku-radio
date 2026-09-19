import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export const episodeHref = "/episodes/ep001-ultrafast";
export const episode2Href = "/episodes/ep002-cerebras";
export const episode3Href = "/episodes/ep003-japan-semiconductor";
export const episode4Href = "/episodes/ep004-ai-semiconductor-race";
export const episode5Href = "/episodes/ep005-deepseek";
export const episode6Href = "/episodes/ep006-open-model-economy";

const episodeDefinitions = [
  { slug: "ep001-ultrafast", episode: 1, href: episodeHref, imageSrc: "/images/episode-001-ai-infrastructure.png" },
  { slug: "ep002-cerebras", episode: 2, href: episode2Href, imageSrc: "/images/episode-002.png" },
  { slug: "ep003-japan-semiconductor", episode: 3, href: episode3Href, imageSrc: "/images/episode-003.png" },
  { slug: "ep004-ai-semiconductor-race", episode: 4, href: episode4Href, imageSrc: "/images/episode-004.png" },
  { slug: "ep005-deepseek", episode: 5, href: episode5Href, imageSrc: "/images/episode-005.png" },
  { slug: "ep006-open-model-economy", episode: 6, href: episode6Href, imageSrc: "/images/episode-006.png" },
] as const;

const contentTypeLabels: Record<string, string> = {
  "ai-news-explainer": "AIニュース解説",
  "difficult-topic-translation": "難解トピック翻訳",
};

export type EpisodeSummary = {
  title: string;
  description: string;
  slug: string;
  episode: number;
  season: number;
  href: string;
  imageSrc: string;
  imageAlt: string;
  contentType: string;
  contentTypeLabel: string;
  tags: string[];
  entities: string[];
};

export type GlossaryItem = {
  term: string;
  meaning: string;
  inEpisode: string;
};

type MarkdownSection = {
  title: string;
  body: string;
  start: number;
  end: number;
};

const afterglowBySlug: Record<string, string> = {
  "ep001-ultrafast": "14倍は目を引く数字です。でも、本当に面白い変化は、その数字を生み出した土台の方にあります。",
  "ep002-cerebras": "AIがさらに賢くなるほど、その知能をどんな環境で動かすかが、体験の違いとして見えやすくなっていきそうです。",
  "ep003-japan-semiconductor": "日本の半導体の強さは、完成したチップの名前ではなく、1000工程の途中に隠れている。",
  "ep004-ai-semiconductor-race": "AIは画面の中では国境がないように見えます。でも、その計算を支える場所は、世界地図の上にあります。",
  "ep005-deepseek": "強いGPUは、AI競争の上限を押し上げる。でも、そのGPUをどれだけ働かせられるかは、設計で変わる。",
  "ep006-open-model-economy": "AIの強さは、モデル一個の性能だけでなく、その周りに作られた仕組み全体で決まっているのかもしれません。",
};

const findSection = (markdown: string, titles: string[]): MarkdownSection | null => {
  const headings = [...markdown.matchAll(/^## (.+?)\r?$/gm)];
  const index = headings.findIndex((heading) => titles.includes(heading[1]));
  if (index === -1) return null;

  const heading = headings[index];
  const start = heading.index;
  const bodyStart = start + heading[0].length;
  const end = headings[index + 1]?.index ?? markdown.length;
  return {
    title: heading[1],
    body: markdown.slice(bodyStart, end).trim(),
    start,
    end,
  };
};

const removeSections = (markdown: string, sections: MarkdownSection[]) => {
  let result = markdown;
  for (const section of sections.toSorted((a, b) => b.start - a.start)) {
    result = `${result.slice(0, section.start).trimEnd()}\n\n${result.slice(section.end).trimStart()}`;
  }
  return result.trim();
};

const parseGlossary = (markdown: string): GlossaryItem[] => {
  const items = markdown.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^- \*\*(.+?)\*\*\s+—\s+(.+)$/);
    if (!match) return [];

    const description = match[2].trim();
    const sentenceEnd = description.indexOf("。");
    const meaning = sentenceEnd === -1 ? description : description.slice(0, sentenceEnd + 1);
    const context = sentenceEnd === -1 ? "" : description.slice(sentenceEnd + 1).trim();
    return [{
      term: match[1],
      meaning,
      inEpisode: context.replace(/^この回(?:では|で)[、]?/, ""),
    }];
  });

  if (items.length < 3 || items.length > 5) {
    throw new Error(`Episode glossary must contain 3 to 5 items; received ${items.length}.`);
  }
  return items;
};

const loadEpisode = cache(async (slug: string, episodeNumber: number) => {
  const source = await readFile(
    path.resolve(process.cwd(), `../episodes/${slug}/article.md`),
    "utf8",
  );
  const { data, content } = matter(source);
  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    data.slug !== slug ||
    data.episode !== episodeNumber ||
    !Number.isInteger(data.season)
  ) {
    throw new Error(`Episode ${String(episodeNumber).padStart(3, "0")} article metadata is missing or invalid.`);
  }

  const definition = episodeDefinitions.find((episode) => episode.slug === slug);
  if (!definition) {
    throw new Error(`Episode ${String(episodeNumber).padStart(3, "0")} is not registered.`);
  }

  const tags = Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const entities = Array.isArray(data.entities) ? data.entities.filter((entity): entity is string => typeof entity === "string") : [];
  const contentType = typeof data.content_type === "string" ? data.content_type : "";

  const videoId = content.match(/Video ID:\s*`([A-Za-z0-9_-]{11})`/)?.[1];
  const sourceBody = content.replace(/^\s*# [^\r\n]+\r?\n/, "").trim();
  const sources = findSection(sourceBody, ["一次情報・参考資料", "出典"]);
  const glossary = findSection(sourceBody, ["この回の言葉", "この回のことば"]);
  if (!sources || !glossary) {
    throw new Error(`Episode ${String(episodeNumber).padStart(3, "0")} article closing sections are missing.`);
  }

  return {
    title: data.title,
    description: data.description,
    slug,
    episode: episodeNumber,
    season: data.season,
    href: definition.href,
    imageSrc: definition.imageSrc,
    imageAlt: `${data.title}のEpisode ${String(episodeNumber).padStart(3, "0")}画像`,
    contentType,
    contentTypeLabel: contentTypeLabels[contentType] ?? "AI解説",
    tags,
    entities,
    // Render the source H1 once in the page header and move closing sections without changing the source file.
    body: removeSections(sourceBody, [sources, glossary]),
    afterglow: afterglowBySlug[slug],
    glossary: parseGlossary(glossary.body),
    sourcesTitle: sources.title,
    sources: sources.body,
    youtubeUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
  };
});

// Explicitly expose only the episodes reviewed for the local MVP.
export const getEpisode = () => loadEpisode("ep001-ultrafast", 1);
export const getEpisode2 = () => loadEpisode("ep002-cerebras", 2);
export const getEpisode3 = () => loadEpisode("ep003-japan-semiconductor", 3);
export const getEpisode4 = () => loadEpisode("ep004-ai-semiconductor-race", 4);
export const getEpisode5 = () => loadEpisode("ep005-deepseek", 5);
export const getEpisode6 = () => loadEpisode("ep006-open-model-economy", 6);

export const getAllEpisodes = cache(async (): Promise<EpisodeSummary[]> => {
  const episodes = await Promise.all(
    episodeDefinitions.map(({ slug, episode }) => loadEpisode(slug, episode)),
  );

  return episodes.map((episode) => ({
    title: episode.title,
    description: episode.description,
    slug: episode.slug,
    episode: episode.episode,
    season: episode.season,
    href: episode.href,
    imageSrc: episode.imageSrc,
    imageAlt: episode.imageAlt,
    contentType: episode.contentType,
    contentTypeLabel: episode.contentTypeLabel,
    tags: episode.tags,
    entities: episode.entities,
  }));
});
