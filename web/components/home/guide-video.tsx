/*
  Hero直後の案内動画（MVP）。
  現在はCM本編（Canvas 2D）の後半を約36秒に編集したもの：こんな人に → むずかしいを、やさしく。
  → ElevenLabs V4の女性音声「AIで、もっといい明日を。」。
  Heroで見せた「専門用語 → マイク → ロゴ」は入れず、内容の重複を避けている。
  制作元：canvas2Ｄ動画/cm_full.html?cut=short（WebM書き出し → ffmpegでH.264に変換）
*/
export function GuideVideo() {
  return (
    <section className="guide-section" aria-labelledby="guide-title">
      <div className="container guide-inner">
        <div className="guide-copy">
          <p className="eyebrow"><span className="heading-bar" /> ABOUT · 36 SEC</p>
          <h2 id="guide-title">AI通訳ラジオは、<br />こんな人のための番組です。</h2>
          <p>エンジニアじゃなくても。専門用語が苦手でも。<br className="desktop-break" />ニュースを追う時間がなくても。</p>
        </div>
        <div className="guide-frame">
          <video className="guide-video" controls playsInline preload="none" poster="/images/guide-short-poster.jpg" aria-label="AI通訳ラジオの案内動画（約36秒・音声あり）">
            <source src="/video/guide-short.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
