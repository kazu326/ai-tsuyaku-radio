import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export const episodeHref = "/episodes/ep001-ultrafast";
export const episode2Href = "/episodes/ep002-cerebras";
export const episode3Href = "/episodes/ep003-japan-semiconductor";

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
    data.episode !== episodeNumber
  ) {
    throw new Error(`Episode ${String(episodeNumber).padStart(3, "0")} article metadata is missing or invalid.`);
  }

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
