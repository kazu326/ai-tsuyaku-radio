import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export const episodeHref = "/episodes/ep001-ultrafast";

// The local review intentionally includes this one draft, not a draft directory scan.
export const getEpisode = cache(async () => {
  const source = await readFile(
    path.resolve(process.cwd(), "../episodes/ep001-ultrafast/article.md"),
    "utf8",
  );
  const { data, content } = matter(source);
  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    data.slug !== "ep001-ultrafast" ||
    data.episode !== 1
  ) {
    throw new Error("Episode 001 article metadata is missing or invalid.");
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
