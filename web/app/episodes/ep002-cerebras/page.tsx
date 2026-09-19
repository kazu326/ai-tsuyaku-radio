import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EpisodeAfterword } from "@/components/episode-afterword";
import { Arrow } from "@/components/site-chrome";
import { getEpisode2 } from "@/lib/episode";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const episode = await getEpisode2();
  const image = "/images/episode-002.png";
  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.description,
      images: [{ url: image, width: 1672, height: 941, alt: "Episode 002 なぜ、1枚で作るのか？ 巨大すぎるAIチップの理由" }],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [image],
    },
  };
}

export default async function Episode2Page() {
  const episode = await getEpisode2();
  return (
    <main id="main" className="article-main">
      <div className="article-shell">
        <Link className="back-link" href="/episodes"><span aria-hidden="true">←</span> エピソードに戻る</Link>
        <article>
          <header className="article-header">
            <div className="episode-meta"><span className="eyebrow">EPISODE 002</span><span className="category">AIニュース解説</span></div>
            <h1>{episode.title}</h1>
            <p className="article-description">{episode.description}</p>
          </header>
          <Image className="article-cover" src="/images/episode-002.png" width={1672} height={941} alt="約3センチのGPUと20センチを超えるCerebrasの巨大なAIチップを比較したEpisode 002正式画像" sizes="(max-width: 900px) calc(100vw - 40px), 840px" preload />
          <div className="article-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{episode.body}</ReactMarkdown></div>
          {episode.youtubeUrl ? <aside className="video-link-box" aria-label="関連動画"><div><p className="eyebrow">WATCH ON YOUTUBE</p><p>この話を、動画でも。</p></div><a className="button button-navy" href={episode.youtubeUrl}>YouTubeでEpisode 002を見る<Arrow diagonal /></a></aside> : null}
          <EpisodeAfterword afterglow={episode.afterglow} episodeLabel="EPISODE 002" glossary={episode.glossary} imageSrc="/images/episode-002.png" sources={episode.sources} sourcesTitle={episode.sourcesTitle} />
        </article>
        <Link className="back-link bottom-back" href="/">← トップに戻る</Link>
      </div>
    </main>
  );
}
