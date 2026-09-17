import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export const episodeHref = "/episodes/ep001-ultrafast";
export const episode2Href = "/episodes/ep002-cerebras";
export const episode3Href = "/episodes/ep003-japan-semiconductor";

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
  return {
    title: data.title,
    description: data.description,
    // Render the source H1 once in the page header, without changing the source file.
    body: content.replace(/^\s*# [^\r\n]+\r?\n/, "").trim(),
    youtubeUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
  };
});

// Explicitly expose only the episodes reviewed for the local MVP.
export const getEpisode = () => loadEpisode("ep001-ultrafast", 1);
export const getEpisode2 = () => loadEpisode("ep002-cerebras", 2);
export const getEpisode3 = () => loadEpisode("ep003-japan-semiconductor", 3);
