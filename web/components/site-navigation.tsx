"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "ホーム", current: (pathname: string) => pathname === "/" },
  { href: "/episodes", label: "エピソード", current: (pathname: string) => pathname.startsWith("/episodes") },
  { href: "/#news", label: "お知らせ", current: () => false },
  { href: "/#about", label: "この番組について", current: () => false },
];

export function SiteNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={mobile ? undefined : "desktop-nav"} aria-label="メインナビゲーション">
      {links.map((link) => (
        <Link key={link.href} href={link.href} aria-current={link.current(pathname) ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
      {mobile ? <a href="https://www.youtube.com/watch?v=FbcFznXk0Bg">番組を聴く</a> : null}
    </nav>
  );
}
