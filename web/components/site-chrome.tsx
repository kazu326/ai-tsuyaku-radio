import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="AI通訳ラジオ ホーム">
      <Image src="/images/logo-20260915.png" width={48} height={48} alt="" />
      <span>AI通訳ラジオ<span className="brand-caption">AI TSUYAKU RADIO</span></span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <div className="header-actions">
          <nav className="desktop-nav" aria-label="メインナビゲーション">
            <Link href="/">ホーム</Link>
            <Link href="/#episodes">エピソード</Link>
            <Link href="/#news">お知らせ</Link>
            <Link href="/#about">この番組について</Link>
          </nav>
          <a className="header-listen" href="https://www.youtube.com/watch?v=FbcFznXk0Bg"><span aria-hidden="true">▶</span> 番組を聴く</a>
          <details className="mobile-nav">
            <summary><span className="visually-hidden">メニューを開く</span><span aria-hidden="true" className="menu-lines" /></summary>
            <nav aria-label="モバイルナビゲーション">
              <Link href="/">ホーム</Link>
              <Link href="/#episodes">エピソード</Link>
              <Link href="/#news">お知らせ</Link>
              <Link href="/#about">この番組について</Link>
              <a href="https://www.youtube.com/watch?v=FbcFznXk0Bg">番組を聴く</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Image src="/images/icon-white.png" width={56} height={56} alt="" />
          <div><p className="footer-title">AI通訳ラジオ<span className="signal-dot" /></p><p>AIの難しい話を、わかる言葉に。</p></div>
        </div>
        <span className="copyright">© AI TSUYAKU RADIO</span>
      </div>
    </footer>
  );
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}
