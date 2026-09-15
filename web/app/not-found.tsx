import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="container not-found"><p className="eyebrow">404</p><h1>ページが見つかりませんでした。</h1><Link className="button button-navy" href="/">トップに戻る →</Link></main>;
}
