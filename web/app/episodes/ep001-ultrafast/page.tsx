import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { EpisodeAfterword } from "@/components/episode-afterword";
import { Arrow } from "@/components/site-chrome";
import { getEpisode } from "@/lib/episode";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const episode = await getEpisode();
  return { title: episode.title, description: episode.description };
}

export default async function EpisodePage() {
  const episode = await getEpisode();
  return (
    <main id="main" className="article-main">
      <div className="article-shell">
        <Link className="back-link" href="/episodes"><span aria-hidden="true">←</span> エピソードに戻る</Link>
        <article>
          <header className="article-header">
            <div className="episode-meta"><span className="eyebrow">EPISODE 001</span><span className="category">AIニュース解説</span></div>
            <h1>{episode.title}</h1>
            <p className="article-description">{episode.description}</p>
          </header>
          <Image className="article-cover" src="/images/episode-001-ai-infrastructure.png" width={1672} height={941} alt="世界を結ぶネットワークとデータセンターでAI専用インフラへの移行を表現したビジュアル" sizes="(max-width: 900px) calc(100vw - 40px), 840px" preload />
          <div className="article-body"><ReactMarkdown>{episode.body}</ReactMarkdown></div>
          {episode.youtubeUrl ? <aside className="video-link-box" aria-label="関連動画"><div><p className="eyebrow">WATCH ON YOUTUBE</p><p>この話を、動画でも。</p></div><a className="button button-navy" href={episode.youtubeUrl}>YouTubeでEpisode 001を見る<Arrow diagonal /></a></aside> : null}
          <EpisodeAfterword afterglow={episode.afterglow} episodeLabel="EPISODE 001" glossary={episode.glossary} imageSrc="/images/episode-001-ai-infrastructure.png" sources={episode.sources} sourcesTitle={episode.sourcesTitle} />
        </article>
        <Link className="back-link bottom-back" href="/">← トップに戻る</Link>
      </div>
    </main>
  );
}
