import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/site-chrome";
import { episodeHref, getEpisode } from "@/lib/episode";

export const dynamic = "force-static";

const newsItems = [
  {
    date: "2026.09.14",
    label: "モデル比較",
    title: "GPT-5.2とClaude Opus 4.6、何が違う？",
    description: "新しいモデル競争を、使い方の違いから整理します。",
  },
  {
    date: "2026.09.13",
    label: "開発ツール",
    title: "Codex、Claude Code、Cursorの競争が加速",
    description: "AIを使わせるための開発環境競争が激しくなっています。",
  },
  {
    date: "2026.09.12",
    label: "動画・画像生成",
    title: "Sora 2の動向と、動画生成の次の流れ",
    description: "動画生成を取り巻く変化を短く整理します。",
  },
  {
    date: "2026.09.11",
    label: "AIインフラ",
    title: "Ultrafastの先にある、AI専用インフラの流れ",
    description: "モデルだけでなく、AIを動かす土台にも競争が広がっています。",
  },
  {
    date: "2026.09.10",
    label: "観測 / 噂",
    title: "Astra周辺で見えてきた、次のモデルの気配",
    description: "現時点で確認できている情報と、噂の部分を分けて見ていきます。",
  },
];

function HeroPicture() {
  const common = {
    alt: "夜のラジオスタジオで、ヘッドセットを着けた白黒ハチワレ猫がマイクとノートPCの前に座る様子",
    sizes: "100vw",
    fetchPriority: "high" as const,
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/images/hero-20260915.png",
    width: 2220,
    height: 1082,
  });
  const {
    props: { ...mobileProps },
  } = getImageProps({
    ...common,
    src: "/images/hero-mobile.png",
    width: 1620,
    height: 1836,
  });

  return (
    <picture className="hero-picture">
      <source media="(min-width: 701px)" srcSet={desktopSrcSet} />
      <img {...mobileProps} className="hero-image" alt={common.alt} />
    </picture>
  );
}

function ArticleIcon() {
  return (
    <svg className="content-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M11 5.5h22l5 5V42.5H11z" />
      <path d="M33 5.5v7h5M17 19h15M17 25h15M17 31h11" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="content-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 27v-5a16 16 0 0 1 32 0v5" />
      <path d="M8 27h7v14H8a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4ZM40 27h-7v14h7a4 4 0 0 0 4-4v-6a4 4 0 0 0-4-4Z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="content-icon" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="9" width="38" height="30" rx="2" />
      <path d="m20 17 12 7-12 7zM11 15h3M11 21h3M11 27h3M11 33h3M37 15h3M37 21h3M37 27h3M37 33h3" />
    </svg>
  );
}

export default async function Home() {
  const episode = await getEpisode();
  return (
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <HeroPicture />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">AIを、みんなのそばに</p>
            <h1 id="hero-title">AIの難しい話を、<br /><span>わかる言葉に。</span></h1>
            <p className="hero-description">難しいAIニュースや技術トピックを、<br />やさしく整理して届けるラジオ番組。<br />毎日の変化を、置いていかれない言葉で。</p>
            <Link className="button button-amber" href={episodeHref}>Episode 001を読む<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="content-title">
        <div className="container">
          <div className="compact-heading">
            <p className="eyebrow"><span className="heading-bar" /> CONTENT</p>
            <h2 id="content-title">AIをもっと身近にする、3つのコンテンツ</h2>
          </div>
          <div className="content-grid">
            <article className="content-item">
              <div className="content-visual"><p><strong>01</strong><span>読む</span></p><ArticleIcon /></div>
              <div className="content-copy"><h3>ニュースや難しい話を、記事でわかりやすく。</h3><p>気になるテーマを、自分のペースでじっくり読めます。</p></div>
            </article>
            <article className="content-item">
              <div className="content-visual"><p><strong>02</strong><span>聞く</span></p><HeadphonesIcon /></div>
              <div className="content-copy"><h3>ラジオのように、耳からAIを理解する。</h3><p>移動中や作業中でも、難しい話を追いやすくします。</p></div>
            </article>
            <article className="content-item">
              <div className="content-visual"><p><strong>03</strong><span>見る</span></p><VideoIcon /></div>
              <div className="content-copy"><h3>動画で、要点をすばやくつかむ。</h3><p>短時間で流れを知りたいときの入口です。</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="updates-section" aria-label="最新情報">
        <div className="container updates-grid">
          <section id="episodes" className="latest-block" aria-labelledby="episodes-title">
            <div className="compact-heading inline-heading"><h2 id="episodes-title"><span className="heading-bar" /> 最新のエピソード</h2><span className="eyebrow">LATEST EPISODE</span></div>
            <article className="episode-card">
              <Link className="episode-image-link" href={episodeHref} aria-label="Episode 001の記事を読む">
                {/* Temporary layout image. Replace this src when the approved Episode 001 asset arrives. */}
                <Image src="/images/episode-001.png" alt="Episode 001の仮画像" width={1672} height={941} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1050px) 52vw, 480px" />
                <span className="image-label">EPISODE.001</span>
              </Link>
              <div className="episode-copy">
                <div className="episode-meta"><span className="category">AIニュース解説</span><time dateTime="2026-09-14">2026.09.14</time></div>
                <h3><Link href={episodeHref}>{episode.title}</Link></h3>
                <p>{episode.description}</p>
                <Link className="button button-amber episode-button" href={episodeHref}>エピソードを読む<Arrow /></Link>
              </div>
            </article>
          </section>

          <section id="news" className="news-block" aria-labelledby="news-title">
            <div className="compact-heading inline-heading"><h2 id="news-title"><span className="heading-bar" /> お知らせ <small>/ NEWS</small></h2><span className="news-note">仮掲載</span></div>
            <ol className="news-list">
              {newsItems.map((item) => (
                <li key={item.title}>
                  <div className="news-meta"><time dateTime={item.date.replaceAll(".", "-")}>{item.date}</time><span>{item.label}</span></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="news-arrow" aria-hidden="true">→</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </section>

      <section id="about" className="about-section" aria-labelledby="about-title">
        <div className="container about-inner">
          <div><p className="eyebrow">ABOUT THE RADIO</p><h2 id="about-title">AIと人間のあいだを、<br />少しだけ、わかりやすく。</h2></div>
          <div className="about-copy"><p>ニュースの見出しだけでは、わからないこと。<br className="desktop-break" />専門用語の向こうにある、私たちとのつながり。</p><p>AI通訳ラジオは、そんな話を「わかる言葉」にする番組です。<br className="desktop-break" />一回で伝える核心は、ひとつ。<br />人間とAIのあいだに立つ猫が、今日もマイクに向かいます。</p><div className="about-signoff"><span className="small-line" /> AIの難しい話を、わかる言葉に。</div></div>
        </div>
      </section>
    </main>
  );
}
