"use client";

import { useRef, useState } from "react";

/*
  Hero直後の案内動画（MVP）。
  現在はCM本編（Canvas 2D）の後半を約36秒に編集したもの：こんな人に → むずかしいを、やさしく。
  → ElevenLabs V4の女性音声「AIで、もっといい明日を。」。
  Heroで見せた「専門用語 → マイク → ロゴ」は入れず、内容の重複を避けている。
  制作元：canvas2Ｄ動画/cm_full.html?cut=short（WebM書き出し → ffmpegでH.264に変換）

  再生前はポスターとブランドの再生ボタンだけを見せ、ブラウザ標準のコントロールは再生を始めてから出す。
*/
export function GuideVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play().catch(() => undefined);
  }

  return (
    <section className="guide-section" aria-labelledby="guide-title">
      <div className="container guide-inner">
        <div className="guide-copy">
          <p className="eyebrow"><span className="heading-bar" /> ABOUT · 36 SEC</p>
          <h2 id="guide-title">AI通訳ラジオは、<br />こんな人のための番組です。</h2>
          <p>エンジニアじゃなくても。専門用語が苦手でも。<br className="desktop-break" />ニュースを追う時間がなくても。</p>
        </div>
        <div className={`guide-frame${started ? " is-started" : ""}`}>
          <video ref={videoRef} className="guide-video" controls={started} playsInline preload="none" poster="/images/guide-short-poster.jpg" aria-label="AI通訳ラジオの案内動画（約36秒・音声あり）">
            <source src="/video/guide-short.mp4" type="video/mp4" />
          </video>
          {!started && (
            <button type="button" className="guide-play" onClick={play}>
              <span className="guide-play-mark" aria-hidden="true" />
              <span className="guide-play-label">案内を再生する</span>
              <span className="guide-play-meta">0:36 ・ 音声あり</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
