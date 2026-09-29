"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";

/*
  スクロール通訳デモ：左の専門用語がマイクへ吸い込まれ、右に日常語の言い換えが書き出される。
  スクロール量をそのまま進み具合にする（スクロールを戻すと巻き戻る）。

  - 素のHTMLでは4組の「専門用語 → 言い換え」を一覧で表示する。
    JavaScriptが動き、動きを減らす設定でないときだけ .is-scrolly を付けて演出にする。
  - 進み具合は CSS 変数（--in / --fly / --reveal / --out / --pulse）で渡し、見た目は CSS が決める。
*/

const ITEMS = [
  // 「|」は折り返してよい位置（意味の切れ目）。単語や文節の途中では改行しない
  { term: "推論コスト", plain: "AIを動かすのに、|どれくらい|お金がかかるか" },
  { term: "MoE", plain: "得意分野ごとの|専門家が、|手分けして動く仕組み" },
  { term: "ハルシネーション", plain: "AIが、|もっともらしく|まちがえること" },
  { term: "RAG", plain: "資料を|調べてから|答える方法" },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeIn = (k: number) => k * k;

// 言い換えを「|」の位置でまとまりに分ける（まとまりの途中では改行しない）
function chunks(text: string) {
  const out: { chars: [string, number][] }[] = [];
  let i = 0;
  for (const part of text.split("|")) out.push({ chars: [...part].map((c) => [c, i++] as [string, number]) });
  return out;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

export function TranslationScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  // サーバー描画と JavaScript なしでは一覧表示。動きを減らす設定でなければ演出にする
  const scrolly = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(REDUCED).matches, () => false);

  useEffect(() => {
    if (!scrolly) return;
    const track = trackRef.current;
    if (!track) return;
    const stage = track.querySelector<HTMLElement>(".xlate-stage")!;
    const items = [...track.querySelectorAll<HTMLElement>(".xlate-item")];
    const slot = track.querySelector<HTMLElement>(".xlate-term-slot")!;
    const mic = track.querySelector<HTMLElement>(".xlate-mic")!;
    const dots = [...track.querySelectorAll<HTMLElement>(".xlate-progress span")];
    let raf = 0;

    // 専門用語の位置からマイクの中心までの距離（吸い込まれる向き。PCは横、スマホは縦になる）
    function measure() {
      const a = slot.getBoundingClientRect(), b = mic.getBoundingClientRect();
      stage.style.setProperty("--fx", `${b.left + b.width / 2 - (a.left + a.width / 2)}px`);
      stage.style.setProperty("--fy", `${b.top + b.height * 0.42 - (a.top + a.height / 2)}px`);
    }
    function update() {
      raf = 0;
      const r = track!.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = clamp(-r.top / Math.max(1, span));
      const n = ITEMS.length, local = Math.min(p * n, n - 0.0001);
      const cur = Math.floor(local), u = local - cur;
      let pulse = 0;
      items.forEach((el, j) => {
        let vIn = 0, fly = 0, reveal = 0, out = 0;
        if (j < cur) { vIn = 1; fly = 1; reveal = 1; out = 1; }
        else if (j === cur) {
          vIn = j === 0 ? 1 : seg(u, 0.02, 0.14);
          fly = easeIn(seg(u, 0.2, 0.42));
          reveal = seg(u, 0.46, 0.76);
          out = j < n - 1 ? seg(u, 0.9, 1) : 0;
          pulse = seg(u, 0.36, 0.44) * (1 - seg(u, 0.44, 0.64));
        }
        el.style.setProperty("--in", vIn.toFixed(3));
        el.style.setProperty("--fly", fly.toFixed(3));
        el.style.setProperty("--reveal", reveal.toFixed(3));
        el.style.setProperty("--out", out.toFixed(3));
        el.toggleAttribute("data-current", j === cur);
      });
      stage.style.setProperty("--pulse", pulse.toFixed(3));
      dots.forEach((d, j) => d.toggleAttribute("data-on", j === cur));
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    measure(); update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [scrolly]);

  return (
    <section id="translate" className={`xlate${scrolly ? " is-scrolly" : ""}`} aria-labelledby="xlate-title" style={{ ["--count" as string]: ITEMS.length }}>
      <div className="xlate-track" ref={trackRef}>
        <div className="xlate-stage">
          <div className="container xlate-head">
            <p className="eyebrow"><span className="heading-bar" /> TRANSLATE</p>
            <h2 id="xlate-title">難しい言葉を、そのまま渡さない。</h2>
            <p className="xlate-lead">専門用語は、一度マイクを通してから届けます。</p>
          </div>
          <div className="container xlate-grid">
            <p className="xlate-label xlate-label-in" aria-hidden="true">むずかしい言葉</p>
            <div className="xlate-term-slot" aria-hidden="true" />
            <div className="xlate-mic" aria-hidden="true">
              <Image src="/images/brand/logo-mark-cat.png" width={520} height={480} alt="" />
              <svg className="xlate-waves" viewBox="0 0 120 200"><path d="M20 40a90 90 0 0 1 0 120M52 18a120 120 0 0 1 0 164" /></svg>
            </div>
            <p className="xlate-label xlate-label-out" aria-hidden="true">日常の言葉では</p>
            <ol className="xlate-list">
              {ITEMS.map((it) => (
                <li key={it.term} className="xlate-item">
                  <span className="xlate-term">{it.term}</span>
                  <span className="xlate-arrow" aria-hidden="true">→</span>
                  <span className="xlate-plain" style={{ ["--len" as string]: [...it.plain.replaceAll("|", "")].length }}>
                    <span className="visually-hidden">{it.plain.replaceAll("|", "")}</span>
                    <span className="xlate-plain-text" aria-hidden="true">
                      {chunks(it.plain).map((chunk, ci) => (
                        <span key={ci} className="xlate-chunk">
                          {chunk.chars.map(([c, i]) => <span key={i} style={{ ["--i" as string]: i }}>{c}</span>)}
                        </span>
                      ))}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="xlate-progress" aria-hidden="true">{ITEMS.map((it) => <span key={it.term} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
