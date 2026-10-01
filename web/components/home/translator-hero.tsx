"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/site-chrome";

/*
  トップのHero：「AIのニュース、むずかしすぎない？」→ 専門用語が画面を埋める → マイクが吸い込む
  → 猫耳が生えてロゴになる。CM冒頭（0–24秒）を約7秒に詰めたWeb版。

  - 猫キャラクター本人は出さない。猫耳ロゴはブランド表現として使う。
  - 描画は Canvas。意味のある文字（見出し・説明・CTA）はHTMLにも置く。
  - 座標はロゴ原画（1920x1080）の座標系で持ち、画面サイズに合わせて縮める。
  - prefers-reduced-motion では完成形だけを静止表示する。
*/

const TIMING = {
  q1: 0.5, q2: 1.0,              // 見出し 2 行
  micIn: 2.9,                    // 猫耳のないマイクが現れる
  qOut: [3.3, 3.75],             // 見出しがマイクへ吸い込まれる
  suck: [3.5, 1.1],              // 言葉が吸い込まれ始める時刻とばらつき
  drop: 5.3,                     // 猫耳が生える
  word: 5.9, tag: 6.3, lets: 6.7,
  cta: 7.0,
  done: 7.4,
  idleEvery: 1.6,                // 完成後、音波がゆっくり出る間隔
};

const JARGON = [
  "LLM", "推論コスト", "MoE", "RAG", "ハルシネーション", "トランスフォーマー", "ファインチューニング", "パラメータ数",
  "トークン", "マルチモーダル", "AIエージェント", "蒸留", "量子化", "コンテキスト長", "強化学習", "ベンチマーク",
  "GPU", "推論モデル", "埋め込みベクトル", "プロンプト", "アテンション", "スケーリング則", "オープンウェイト", "世界モデル",
  "LoRA", "CoT", "ゼロショット", "KVキャッシュ", "拡散モデル", "MCP", "合成データ", "ベクトルDB",
];

// ロゴ原画での部品の位置
const PARTS = {
  mic: { src: "/images/brand/logo-mark-mic.png", x: 700, y: 170 },
  cat: { src: "/images/brand/logo-mark-cat.png", x: 700, y: 170 },
  ears: { src: "/images/brand/logo-mark-ears.png", x: 830, y: 175 },
  tail: { src: "/images/brand/logo-mark-tail.png", x: 725, y: 480 },
  word: { src: "/images/brand/logo-wordmark.png", x: 560, y: 655 },
  tag: { src: "/images/brand/logo-tagline.png", x: 620, y: 800 },
  lets: { src: "/images/brand/logo-letstalk.png", x: 630, y: 865 },
} as const;
type PartKey = keyof typeof PARTS;
const LOCK = { x0: 560, x1: 1370, y0: 170, y1: 905 };           // ロゴ全体の範囲
const ICON = { x: 960, y: 410 }, WAVE = { x: 960, y: 388 };
const EAR_BASE = [{ x: 905, y: 282 }, { x: 1015, y: 282 }];

const NAVY = "#081b2a", MUTED = "#5d6871", ORANGE = "#f47c20";
const FONT = '"Noto Sans JP", sans-serif';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
const easeIn = (k: number) => k * k * k;
const easeOutBack = (k: number) => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let x = s; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${clamp(a)})`;
}

type Word = { text: string; size: number; weight: number; x: number; y: number; w: number; rot: number; boxed: boolean; back: boolean; appear: number; suck: number; ph: number };
type Layout = { w: number; h: number; s: number; cx: number; top: number; q: number; qy1: number; qy2: number; words: Word[] };

function buildLayout(ctx: CanvasRenderingContext2D, w: number, h: number): Layout {
  const narrow = w < 700;
  const ctaSpace = narrow ? 170 : 132;
  const pad = narrow ? 28 : Math.max(28, h * 0.06);
  const availH = h - ctaSpace - pad;
  // PCではロゴを主役にしすぎない（既存サイトの情報密度に合わせて上限を下げる）
  const s = Math.min(availH / (LOCK.y1 - LOCK.y0), (w * 0.84) / (LOCK.x1 - LOCK.x0), w > 900 ? 0.62 : 0.95);
  const top = pad + (availH - (LOCK.y1 - LOCK.y0) * s) / 2;
  const cx = w / 2;
  const q = Math.min(64, w * 0.085);
  const qy1 = top + (690 - LOCK.y0) * s;
  const qy2 = qy1 + q * 1.35;

  // 言葉の配置：見出しとマイクの範囲には置かない。手前の語は重ならない場所、空きがなければ奥の小さな語
  const r = rng(99);
  const f = clamp(w / 1440, 0.5, 1.05);
  const keepHalf = Math.max(q * 4.9, ((LOCK.x1 - LOCK.x0) * s) / 2) + 16;
  const keep = { x0: cx - keepHalf, x1: cx + keepHalf, y0: top - 8, y1: qy2 + q * 0.5 };
  const count = narrow ? 22 : 32;
  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const words: Word[] = [];
  JARGON.slice(0, count).forEach((text, i) => {
    let back = i >= (narrow ? 12 : 16);
    const big = [26, 32, 38, 46, 54][Math.floor(r() * 5)] * f, small = [17, 20, 23][Math.floor(r() * 3)] * f;
    const bold = r() < 0.6;
    let size = 0, weight = 700, ww = 0, hh = 0, x = 0, y = 0;
    for (let pass = back ? 1 : 0; pass < 2; pass++) {
      back = pass === 1;
      size = back ? small : big; weight = 700;
      ctx.font = `${weight} ${size}px ${FONT}`;
      ww = ctx.measureText(text).width; hh = size * 1.25;
      let ok = false;
      for (let tries = 0; tries < 2000 && !ok; tries++) {
        x = 12 + r() * Math.max(1, w - 24 - ww); y = 12 + r() * Math.max(1, h - 24 - hh);
        const hitKeep = x < keep.x1 && x + ww > keep.x0 && y < keep.y1 && y + hh > keep.y0;
        const hitOther = placed.some((p) => x < p.x + p.w + 18 && x + ww + 18 > p.x && y < p.y + p.h + 8 && y + hh + 8 > p.y);
        ok = !hitKeep && (back || !hitOther);
      }
      if (ok) break;
    }
    if (!back) placed.push({ x, y, w: ww, h: hh });
    words.push({
      text, size, weight, x: x + ww / 2, y: y + hh * 0.78, w: ww, rot: (r() - 0.5) * 0.14, boxed: !back && bold && r() < 0.35, back,
      appear: i < 6 ? 0.15 + i * 0.28 : 1.8 + (i - 6) * 0.045, suck: TIMING.suck[0] + r() * TIMING.suck[1], ph: r() * Math.PI * 2,
    });
  });
  return { w, h, s, cx, top, q, qy1, qy2, words };
}

export function TranslatorHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [replayKey, setReplayKey] = useState(0);
  const replay = useCallback(() => { setPhase("intro"); setReplayKey((k) => k + 1); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const imgs = {} as Record<PartKey, HTMLImageElement>;
    let layout: Layout | null = null;
    let raf = 0, start = 0, visible = true, alive = true, doneSent = false;

    const X = (x: number) => layout!.cx + (x - ICON.x) * layout!.s;
    const Y = (y: number) => layout!.top + (y - LOCK.y0) * layout!.s;
    const drawPart = (k: PartKey) => { const p = PARTS[k], im = imgs[k]; if (im?.complete) ctx.drawImage(im, p.x, p.y); };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr); canvas!.height = Math.round(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout = buildLayout(ctx!, rect.width, rect.height);
    }

    // アイコン（マイク）を画面の (cx, cy) に k 倍で。ears / tail は 0..1、cat=true なら完成形
    function drawIcon(cx: number, cy: number, k: number, o: { ears?: [number, number]; tail?: number; cat?: boolean; sx?: number; sy?: number }) {
      const L = layout!;
      ctx!.save();
      ctx!.translate(cx, cy); ctx!.scale(L.s * k * (o.sx ?? 1), L.s * k * (o.sy ?? 1)); ctx!.translate(-ICON.x, -ICON.y);
      if (o.cat) { drawPart("cat"); ctx!.restore(); return; }
      drawPart("mic");
      const tail = o.tail ?? 0;
      if (tail > 0) { ctx!.save(); ctx!.beginPath(); ctx!.rect(lerp(975, 725, easeOut(tail)), 480, 260, 160); ctx!.clip(); drawPart("tail"); ctx!.restore(); }
      (o.ears ?? [0, 0]).forEach((e, i) => {
        if (e <= 0) return;
        const b = EAR_BASE[i];
        ctx!.save();
        ctx!.translate(b.x, b.y); ctx!.rotate((1 - Math.min(1, e)) * (i ? 0.5 : -0.5)); ctx!.scale(e, e); ctx!.translate(-b.x, -b.y);
        ctx!.beginPath(); ctx!.rect(i ? 960 : 820, 170, 140, 130); ctx!.clip();
        drawPart("ears");
        ctx!.restore();
      });
      ctx!.restore();
    }

    function wave(cx: number, cy: number, k: number, scale: number, alpha: number) {
      ctx!.save(); ctx!.lineCap = "round";
      ctx!.strokeStyle = rgba(ORANGE, alpha * (1 - k));
      ctx!.lineWidth = lerp(16, 4, k) * scale;
      const r = lerp(250, 420, easeOut(k)) * scale;
      ctx!.beginPath(); ctx!.arc(cx, cy, r, -0.5, 0.5); ctx!.stroke();
      ctx!.beginPath(); ctx!.arc(cx, cy, r, Math.PI - 0.5, Math.PI + 0.5); ctx!.stroke();
      ctx!.restore();
    }

    function render(t: number) {
      const L = layout!;
      ctx!.clearRect(0, 0, L.w, L.h);
      const iconX = X(ICON.x), iconY = Y(ICON.y);

      // 専門用語
      const jit = 5 * seg(t, 2.0, 3.2) * (1 - seg(t, 3.4, 3.6));
      const words = [...L.words.filter((w) => w.back), ...L.words.filter((w) => !w.back)];
      for (const w of words) {
        const a = seg(t, w.appear, w.appear + 0.3);
        if (a <= 0) continue;
        const sk = easeIn(seg(t, w.suck, w.suck + 0.55));
        if (sk >= 1) continue;
        let x = w.x + Math.sin(t * 23 + w.ph) * jit, y = w.y + Math.sin(t * 0.8 + w.ph) * 4 + Math.cos(t * 19 + w.ph) * jit;
        const ang = sk * 2.2, dx = x - iconX, dy = y - iconY;
        x = iconX + (dx * Math.cos(ang) - dy * Math.sin(ang)) * (1 - sk);
        y = iconY + (dx * Math.sin(ang) + dy * Math.cos(ang)) * (1 - sk);
        const sc = (0.6 + 0.4 * easeOutBack(a)) * (1 - 0.85 * sk);
        ctx!.save();
        ctx!.globalAlpha = clamp(a * 1.6) * (1 - sk * 0.6) * (w.back ? 0.5 : 1);
        ctx!.translate(x, y); ctx!.rotate(w.rot + sk * 3); ctx!.scale(sc, sc);
        ctx!.font = `${w.weight} ${w.size}px ${FONT}`; ctx!.textAlign = "center";
        if (w.boxed) { ctx!.strokeStyle = rgba(NAVY, 0.45); ctx!.lineWidth = 1.5; ctx!.strokeRect(-w.w / 2 - 12, -w.size * 0.98, w.w + 24, w.size * 1.34); }
        ctx!.fillStyle = w.back ? MUTED : NAVY;
        ctx!.fillText(w.text, 0, 0);
        ctx!.restore();
      }

      // 見出し「AIのニュース、／むずかしすぎない？」
      const qs = easeIn(seg(t, TIMING.qOut[0], TIMING.qOut[1]));
      if (qs < 1) {
        ctx!.save();
        ctx!.translate(iconX, iconY); ctx!.scale(1 - qs, 1 - qs); ctx!.translate(-iconX, -iconY);
        ctx!.globalAlpha = 1 - qs;
        const plate = seg(t, TIMING.q1 - 0.2, TIMING.q1 + 0.3);
        if (plate > 0) {
          ctx!.save(); ctx!.globalAlpha *= plate;
          ctx!.translate(L.cx, (L.qy1 + L.qy2) / 2 - L.q * 0.35); ctx!.scale(1, 0.36);
          const g = ctx!.createRadialGradient(0, 0, 0, 0, 0, L.q * 6);
          g.addColorStop(0, "rgba(250,249,246,.96)"); g.addColorStop(0.7, "rgba(250,249,246,.86)"); g.addColorStop(1, "rgba(250,249,246,0)");
          ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(0, 0, L.q * 6, 0, Math.PI * 2); ctx!.fill(); ctx!.restore();
        }
        popLine("AIのニュース、", L.cx, L.qy1, L.q * 0.82, t, TIMING.q1, [0, 1]);
        popLine("むずかしすぎない？", L.cx, L.qy2, L.q, t, TIMING.q2, null);
        ctx!.restore();
      }

      // マイク → 猫耳
      if (t >= TIMING.micIn) {
        const pop = easeOutBack(seg(t, TIMING.drop, TIMING.drop + 0.5));
        const k = lerp(0.45 * easeOutBack(seg(t, TIMING.micIn, TIMING.micIn + 0.45)), 1, pop);
        const gulp = L.words.reduce((m, w) => { const d = t - (w.suck + 0.55); return d > 0 && d < 0.25 ? Math.max(m, 1 - d / 0.25) : m; }, 0);
        const squash = seg(t, TIMING.drop - 0.45, TIMING.drop - 0.05) * (t < TIMING.drop ? 1 : 0);
        const ears: [number, number] = [easeOutBack(seg(t, TIMING.drop + 0.05, TIMING.drop + 0.4)), easeOutBack(seg(t, TIMING.drop + 0.15, TIMING.drop + 0.5))];
        const tail = seg(t, TIMING.drop + 0.3, TIMING.drop + 0.85);
        const kk = k * (1 + 0.06 * gulp);
        // 音波：猫になった直後に数回、その後はゆっくり
        const wy = iconY + (WAVE.y - ICON.y) * L.s * kk;
        for (let b = TIMING.drop + 0.5; b <= Math.min(t, TIMING.done); b += 0.5) wave(iconX, wy, seg(t, b, b + 0.8), L.s * kk, 0.75);
        if (!reduced && t > TIMING.done) { const b = TIMING.done + Math.floor((t - TIMING.done) / TIMING.idleEvery) * TIMING.idleEvery; wave(iconX, wy, seg(t, b, b + 1.2), L.s, 0.45); }
        if (ears[1] >= 1 && tail >= 1) drawIcon(iconX, iconY, kk, { cat: true });
        else drawIcon(iconX, iconY, kk, { ears, tail, sx: 1 + 0.1 * squash, sy: 1 - 0.12 * squash });
        // ドロップのリング
        const rk = seg(t, TIMING.drop, TIMING.drop + 0.9);
        if (rk > 0 && rk < 1) {
          ctx!.save(); ctx!.strokeStyle = rgba(ORANGE, 0.8 * (1 - rk)); ctx!.lineWidth = 14 * L.s * (1 - rk * 0.8);
          ctx!.beginPath(); ctx!.arc(iconX, iconY - 60 * L.s, lerp(160, 900, easeOut(rk)) * L.s, 0, Math.PI * 2); ctx!.stroke(); ctx!.restore();
        }
      }

      // ロゴの文字
      const wIn = easeOut(seg(t, TIMING.word, TIMING.word + 0.4)), tIn = easeOut(seg(t, TIMING.tag, TIMING.tag + 0.6)), lIn = easeOut(seg(t, TIMING.lets, TIMING.lets + 0.5));
      if (wIn > 0) {
        ctx!.save();
        ctx!.translate(L.cx, L.top); ctx!.scale(L.s, L.s); ctx!.translate(-ICON.x, -LOCK.y0);
        ctx!.save(); ctx!.globalAlpha = wIn; ctx!.translate(0, 40 * (1 - wIn)); drawPart("word"); ctx!.restore();
        if (tIn > 0) { const p = PARTS.tag; ctx!.save(); ctx!.beginPath(); ctx!.rect(p.x - 10, p.y - 10, (690 + 20) * tIn, 75); ctx!.clip(); drawPart("tag"); ctx!.restore(); }
        if (lIn > 0) { const p = PARTS.lets; ctx!.save(); ctx!.beginPath(); ctx!.rect(960 - 330 * lIn, p.y - 5, 660 * lIn, 50); ctx!.clip(); drawPart("lets"); ctx!.restore(); }
        ctx!.restore();
      }
    }

    function popLine(text: string, cx: number, y: number, size: number, t: number, t0: number, accent: [number, number] | null) {
      ctx!.font = `700 ${size}px ${FONT}`;
      const chars = [...text];
      const widths = chars.map((c) => ctx!.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0);
      let x = cx - total / 2;
      chars.forEach((c, i) => {
        const a = seg(t, t0 + i * 0.035, t0 + i * 0.035 + 0.3);
        if (a > 0) {
          const e = easeOutBack(a);
          ctx!.save();
          ctx!.globalAlpha *= clamp(a * 1.8);
          ctx!.translate(x + widths[i] / 2, y + (1 - easeOut(a)) * size * 0.45); ctx!.scale(0.6 + 0.4 * e, 0.6 + 0.4 * e);
          ctx!.textAlign = "center"; ctx!.fillStyle = accent && i >= accent[0] && i <= accent[1] ? "#d9781a" : NAVY;
          ctx!.fillText(c, 0, 0);
          ctx!.restore();
        }
        x += widths[i];
      });
    }

    function frame(now: number) {
      if (!alive) return;
      if (visible && layout) {
        const t = reduced ? TIMING.done : (now - start) / 1000;
        render(t);
        if (!doneSent && t >= TIMING.cta) { doneSent = true; setPhase("done"); }
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => { resize(); if (reduced && layout) render(TIMING.done); });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    Promise.all([
      ...Object.entries(PARTS).map(([k, p]) => new Promise<void>((res) => { const im = new Image(); im.onload = () => res(); im.onerror = () => res(); im.src = p.src; imgs[k as PartKey] = im; })),
      document.fonts.load(`700 40px ${FONT}`).catch(() => undefined),
    ]).then(() => {
      if (!alive) return;
      resize();
      ro.observe(canvas); io.observe(canvas);
      start = performance.now();
      if (reduced) { render(TIMING.done); setPhase("done"); } else raf = requestAnimationFrame(frame);
    });
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [replayKey]);

  return (
    <section className="t-hero" aria-labelledby="hero-title">
      <canvas ref={canvasRef} className="t-hero-canvas" aria-hidden="true" />
      <h1 id="hero-title" className="visually-hidden">AI通訳ラジオ｜AIの難しい話を、わかる言葉に。</h1>
      <p className="visually-hidden">AIのニュース、むずかしすぎない？ 専門用語だらけのAIの話を、AI通訳ラジオがわかる言葉に通訳します。</p>
      <div className={`t-hero-cta${phase === "done" ? " is-visible" : ""}`}>
        <Link className="button button-amber" href="#translate">通訳をためしてみる<Arrow /></Link>
        <Link className="text-link t-hero-link" href="/episodes">エピソード一覧へ<Arrow /></Link>
      </div>
      {phase === "done" && <button type="button" className="t-hero-replay" onClick={replay}>もう一度見る</button>}
    </section>
  );
}
