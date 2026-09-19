import type { Metadata } from "next";
import { EpisodeBrowser } from "./episode-browser";
import { getAllEpisodes } from "@/lib/episode";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "エピソード一覧",
  description: "AI通訳ラジオのEpisode 001から最新回までを、タイトル、タグ、シーズンから検索できます。",
};

export default async function EpisodesPage() {
  const episodes = await getAllEpisodes();

  return (
    <main id="main" className="episodes-index-main">
      <header className="episodes-index-hero">
        <div className="container episodes-index-hero-inner">
          <div>
            <div className="episodes-index-title-row">
              <span className="episodes-index-title-mark" aria-hidden="true" />
              <div>
                <p className="eyebrow">ALL EPISODES</p>
                <h1>Episodes</h1>
              </div>
            </div>
            <p className="episodes-index-intro">AIの難しい話を、わかる言葉に。<br />これまでのエピソードを、テーマやキーワードから探せます。</p>
          </div>
          <div className="episodes-index-signoff" aria-hidden="true">
            <p>テクノロジーで、<br />もっと広い世界を知ろう。</p>
            <span>AI TSUYAKU RADIO</span>
          </div>
        </div>
      </header>

      <section className="container episodes-index-library" aria-labelledby="episode-library-title">
        <div className="visually-hidden" id="episode-library-title">エピソード一覧</div>
        <EpisodeBrowser episodes={episodes} />
      </section>

      <aside className="container glossary-teaser" aria-labelledby="glossary-teaser-title">
        <div>
          <p className="eyebrow">GLOSSARY</p>
          <h2 id="glossary-teaser-title">AIのことばを、もう一度整理する。</h2>
          <p>各エピソードの「この回のことば」を横断して探せる用語集を準備しています。</p>
        </div>
        <span>COMING SOON</span>
      </aside>
    </main>
  );
}
