import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {EpisodeAfterword} from "@/components/episode-afterword";
import {Arrow} from "@/components/site-chrome";
import {getEpisode5} from "@/lib/episode";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const episode = await getEpisode5();
  const image = "/images/episode-005.png";
  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.description,
      images: [
        {
          url: image,
          width: 1672,
          height: 941,
          alt: "Episode 005 強いGPUだけがAI競争ではない",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description,
      images: [image],
    },
  };
}

export default async function Episode5Page() {
  const episode = await getEpisode5();
  return (
    <main id="main" className="article-main">
      <div className="article-shell">
        <Link className="back-link" href="/episodes">
          <span aria-hidden="true">←</span> エピソードに戻る
        </Link>
        <article>
          <header className="article-header">
            <div className="episode-meta">
              <span className="eyebrow">EPISODE 005</span>
              <span className="category">難解トピック翻訳</span>
            </div>
            <h1>{episode.title}</h1>
            <p className="article-description">{episode.description}</p>
          </header>
          <Image
            className="article-cover"
            src="/images/episode-005.png"
            width={1672}
            height={941}
            alt="夜のデータセンターでGPUの列の一部だけがオレンジに点灯し、光の線でつながる構図に「強いGPUだけがAI競争ではない」と大きく書かれたEpisode 005の画像"
            sizes="(max-width: 900px) calc(100vw - 40px), 840px"
            preload
          />
          <div className="article-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{episode.body}</ReactMarkdown>
          </div>
          {episode.youtubeUrl ? (
            <aside className="video-link-box" aria-label="関連動画">
              <div>
                <p className="eyebrow">WATCH ON YOUTUBE</p>
                <p>この話を、動画でも。</p>
              </div>
              <a className="button button-navy" href={episode.youtubeUrl}>
                YouTubeでEpisode 005を見る
                <Arrow diagonal />
              </a>
            </aside>
          ) : null}
          <EpisodeAfterword
            afterglow={episode.afterglow}
            episodeLabel="EPISODE 005"
            glossary={episode.glossary}
            imageSrc="/images/episode-005.png"
            sources={episode.sources}
            sourcesTitle={episode.sourcesTitle}
          />
        </article>
        <Link className="back-link bottom-back" href="/">
          ← トップに戻る
        </Link>
      </div>
    </main>
  );
}
