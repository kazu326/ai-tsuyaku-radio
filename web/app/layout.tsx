import type { Metadata } from "next";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "./globals.css";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "AI通訳ラジオ | AIの難しい話を、わかる言葉に。", template: "%s | AI通訳ラジオ" },
  description: "難しいAIニュースや技術トピックを、やさしく整理して届けるラジオ番組。猫の通訳者と、AIの世界を少しずつ。",
  robots: { index: false, follow: false },
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">本文へスキップ</a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
