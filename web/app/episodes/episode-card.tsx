import Image from "next/image";
import Link from "next/link";
import type { EpisodeSummary } from "@/lib/episode";

export function EpisodeArchiveCard({ episode }: { episode: EpisodeSummary }) {
  const episodeLabel = String(episode.episode).padStart(3, "0");

  return (
    <article className="episode-archive-card">
      <Link className="episode-archive-image" href={episode.href} aria-label={`Episode ${episodeLabel}の記事を読む`}>
        <Image
          src={episode.imageSrc}
          alt={episode.imageAlt}
          width={1672}
          height={941}
          sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc(50vw - 36px), 540px"
        />
      </Link>
      <div className="episode-archive-copy">
        <div className="episode-archive-meta">
          <span className="category">{episode.contentTypeLabel}</span>
          <span>SEASON {episode.season}</span>
        </div>
        <p className="episode-archive-number">EPISODE.{episodeLabel}</p>
        <h2><Link href={episode.href}>{episode.title}</Link></h2>
        <p className="episode-archive-description">{episode.description}</p>
        <ul className="episode-tag-list" aria-label="タグ">
          {episode.tags.slice(0, 3).map((tag) => <li key={tag}>#{tag}</li>)}
        </ul>
        <Link className="button button-amber episode-archive-button" href={episode.href}>
          エピソードを読む <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
