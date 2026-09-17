import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GlossaryItem } from "@/lib/episode";

type EpisodeAfterwordProps = {
  afterglow: string;
  episodeLabel: string;
  glossary: GlossaryItem[];
  imageSrc: string;
  sources: string;
  sourcesTitle: string;
};

export function EpisodeAfterword({
  afterglow,
  episodeLabel,
  glossary,
  imageSrc,
  sources,
  sourcesTitle,
}: EpisodeAfterwordProps) {
  const headingId = `${episodeLabel.toLowerCase().replace(/\s+/g, "-")}-afterglow`;

  return (
    <>
      <section className="afterglow-zone" aria-labelledby={headingId}>
        <div className="afterglow-art" aria-hidden="true">
          <Image src={imageSrc} alt="" fill sizes="(max-width: 700px) calc(100vw - 40px), 840px" />
        </div>
        <div className="afterglow-content">
          <p className="afterglow-kicker"><span className="signal-dot" />AFTERGLOW · {episodeLabel}</p>
          <div className="afterglow-card">
            <p className="afterglow-label">この回の余韻</p>
            <h2 id={headingId}>{afterglow}</h2>
          </div>
          <div className="glossary-heading">
            <p className="afterglow-label">もう少し知りたくなったら</p>
            <h3>この回のことば</h3>
          </div>
          <div className="glossary-grid">
            {glossary.map((item) => (
              <div className="glossary-card" key={item.term}>
                <h4>{item.term}</h4>
                <div className="glossary-layer">
                  <p className="glossary-layer-label">簡単な意味</p>
                  <p>{item.meaning}</p>
                </div>
                <div className="glossary-layer glossary-layer-context">
                  <p className="glossary-layer-label">この回では</p>
                  <p>{item.inEpisode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="article-sources" aria-labelledby={`${headingId}-sources`}>
        <h2 id={`${headingId}-sources`}>{sourcesTitle}</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sources}</ReactMarkdown>
      </section>
    </>
  );
}
