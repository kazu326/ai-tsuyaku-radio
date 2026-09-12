import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import {
  BackgroundAsset,
  BackgroundPool,
  backgroundAssets,
} from "./data/background-assets";

// ============================================================
// AIラジオ Remotion MVP v0.1
// End-to-End test
//
// Audio:
// public/test-2m.mp3
//
// Existing data:
// src/data/background-assets.ts
//
// NOTE:
// 実音声128.679125秒。末尾字幕・結論Exitを130秒以内に収める。
// ============================================================

const FPS = 30;
const TOTAL_SECONDS = 130;
const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

const CROSSFADE_FRAMES = 9; // 0.3秒
const DEFAULT_NON_LOOP_SECONDS = 10;

// ============================================================
// Background Playlist v0.3
// ============================================================

const getPool = (pool: "A" | "B" | "C"): BackgroundAsset[] =>
  backgroundAssets.filter((asset) => asset.pool === pool);

const A_POOL = getPool("A");
const B_POOL = getPool("B");
const C_POOL = getPool("C");

const pickFromArray = <T,>(items: T[], seed: string): T => {
  const index = Math.floor(random(seed) * items.length);
  return items[index];
};

const pickIntroClip = (): BackgroundAsset => {
  const preferredIds = new Set(["A1", "A2", "A3", "A4", "A5"]);
  const preferred = A_POOL.filter((asset) => preferredIds.has(asset.id));

  const usePreferred = random("mvp-intro-preferred") < 0.75;

  return usePreferred
    ? pickFromArray(preferred, "mvp-intro-preferred-file")
    : pickFromArray(A_POOL, "mvp-intro-any-a-file");
};

const pickNextPool = (
  previousPools: BackgroundPool[],
  seed: string
): "A" | "B" | "C" => {
  let candidates: Array<"A" | "B" | "C"> = ["A", "B", "C"];
  const lastTwo = previousPools.slice(-2);

  if (lastTwo.length === 2 && lastTwo[0] === lastTwo[1]) {
    candidates = candidates.filter((pool) => pool !== lastTwo[0]);
  }

  return pickFromArray(candidates, seed);
};

const pickClipFromPool = (
  pool: "A" | "B" | "C",
  previousFile: string | null,
  seed: string
): BackgroundAsset => {
  const source = pool === "A" ? A_POOL : pool === "B" ? B_POOL : C_POOL;
  const candidates = source.filter((asset) => asset.file !== previousFile);

  return pickFromArray(candidates, seed);
};

const getTargetDurationFrames = (
  asset: BackgroundAsset,
  index: number
): number => {
  if (!asset.loopable) {
    const seconds = asset.maxSeconds ?? DEFAULT_NON_LOOP_SECONDS;
    return Math.round(seconds * FPS);
  }

  // Background Baseline:
  // 固定秒数ではなく、16〜22秒程度で揺らす。
  const seconds = 16 + Math.floor(random(`mvp-bg-duration-${index}`) * 7);
  return seconds * FPS;
};

type PlaylistItem = {
  asset: BackgroundAsset;
  startFrame: number;
  durationInFrames: number;
};

const createBackgroundPlaylist = (
  totalDurationInFrames: number
): PlaylistItem[] => {
  const playlist: PlaylistItem[] = [];

  const introAsset = pickIntroClip();
  const introDuration = getTargetDurationFrames(introAsset, 0);

  playlist.push({
    asset: introAsset,
    startFrame: 0,
    durationInFrames: introDuration,
  });

  let timelineEnd = introDuration;
  let previousFile = introAsset.file;
  const previousPools: BackgroundPool[] = ["A"];
  let index = 1;

  while (timelineEnd < totalDurationInFrames) {
    const pool = pickNextPool(previousPools, `mvp-pool-${index}`);
    const asset = pickClipFromPool(
      pool,
      previousFile,
      `mvp-clip-${index}-${pool}`
    );

    const durationInFrames = getTargetDurationFrames(asset, index);
    const startFrame = Math.max(0, timelineEnd - CROSSFADE_FRAMES);

    playlist.push({
      asset,
      startFrame,
      durationInFrames,
    });

    timelineEnd = startFrame + durationInFrames;
    previousFile = asset.file;
    previousPools.push(asset.pool);
    index++;
  }

  return playlist;
};

const BackgroundVideo: React.FC<{
  asset: BackgroundAsset;
  durationInFrames: number;
  fadeIn: boolean;
  fadeOut: boolean;
  videoComponent?: React.ComponentType<{asset: BackgroundAsset}>;
}> = ({asset, durationInFrames, fadeIn, fadeOut, videoComponent: VideoComponent}) => {
  const frame = useCurrentFrame();

  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const fadeOutOpacity = fadeOut
    ? interpolate(
        frame,
        [
          Math.max(0, durationInFrames - CROSSFADE_FRAMES),
          durationInFrames,
        ],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 1;

  return (
    <AbsoluteFill style={{opacity: Math.min(fadeInOpacity, fadeOutOpacity)}}>
      {VideoComponent ? <VideoComponent asset={asset} /> : <Video
        src={staticFile(`video/${asset.file}`)}
        muted
        loop={asset.loopable}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />}
    </AbsoluteFill>
  );
};

export const BackgroundPlaylist: React.FC<{
  totalDurationInFrames: number;
  videoComponent?: React.ComponentType<{asset: BackgroundAsset}>;
}> = ({totalDurationInFrames, videoComponent}) => {
  const playlist = createBackgroundPlaylist(totalDurationInFrames);

  return (
    <AbsoluteFill>
      {playlist.map((item, index) => (
        <Sequence
          key={`${item.asset.id}-${index}`}
          from={item.startFrame}
          durationInFrames={item.durationInFrames}
          name={`${item.asset.id} / loop=${item.asset.loopable ? "YES" : "NO"}`}
        >
          <BackgroundVideo
            videoComponent={videoComponent}
            asset={item.asset}
            durationInFrames={item.durationInFrames}
            fadeIn={index !== 0}
            fadeOut={index !== playlist.length - 1}
          />
        </Sequence>
      ))}

      <AbsoluteFill style={{backgroundColor: "rgba(0,0,0,0.18)"}} />
    </AbsoluteFill>
  );
};

// ============================================================
// Subtitle Baseline
// ============================================================

export const SubtitleBox: React.FC<{
  children: React.ReactNode;
  barColor?: string;
}> = ({children, barColor = "#F39C12"}) => (
  <div
    style={{
      position: "absolute",
      left: 240,
      bottom: 30,
      width: 920,
      height: 150,
      backgroundColor: "rgba(0,0,0,0.60)",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: 28,
      paddingRight: 28,
    }}
  >
    <div
      style={{
        width: "100%",
        borderLeft: `4px solid ${barColor}`,
        paddingLeft: 18,
        color: "white",
        fontSize: 28,
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: "left",
      }}
    >
      {children}
    </div>
  </div>
);

// ============================================================
// Cat placeholder
// ============================================================

export const CatCirclePlaceholder: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 20,
      bottom: 20,
      width: 200,
      height: 200,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.10)",
      border: "3px solid rgba(255,255,255,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255,255,255,0.8)",
      fontSize: 26,
      fontWeight: 600,
    }}
  >
    CAT
  </div>
);

// ============================================================
// SE / Cognitive Punctuation
// ============================================================

export const PanelCueSE: React.FC = () => (
  <Audio src={staticFile("se/panel-cue.mp3")} volume={0.08} />
);

// ============================================================
// Shared panel motion
// ============================================================

export const usePanelMotion = (durationInFrames: number) => {
  const frame = useCurrentFrame();

  const panelIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const contentIn = interpolate(frame, [4, 11], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 12), Math.max(0, durationInFrames - 6)],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const panelOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 8), durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );

  return {
    panelScaleX: Math.min(panelIn, panelOut),
    contentOpacity: Math.min(contentIn, contentOut),
  };
};

// ============================================================
// Meaning Cluster 1: CPU → GPU
// ============================================================

const CpuGpuCluster: React.FC<{
  durationInFrames: number;
  switchFrame: number;
}> = ({durationInFrames, switchFrame}) => {
  const frame = useCurrentFrame();
  const {panelScaleX, contentOpacity} = usePanelMotion(durationInFrames);

  const INNER_FADE = 8;

  const cpuOpacity = interpolate(
    frame,
    [switchFrame - INNER_FADE, switchFrame + INNER_FADE],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const gpuOpacity = interpolate(
    frame,
    [switchFrame - INNER_FADE, switchFrame + INNER_FADE],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const ClusterContent: React.FC<{
    file: string;
    title: string;
    shortText: string;
    accent: string;
    opacity: number;
  }> = ({file, title, shortText, accent, opacity}) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacity * contentOpacity,
        boxSizing: "border-box",
        padding: 28,
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: 30,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Video
          src={staticFile(`video/${file}`)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          borderLeft: `4px solid ${accent}`,
          paddingLeft: 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: 24,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.86)",
            fontSize: 29,
            fontWeight: 500,
            lineHeight: 1.55,
          }}
        >
          {shortText}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 50,
        width: 1040,
        height: 450,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(8,8,8,0.92)",
          transform: `scaleX(${panelScaleX})`,
          transformOrigin: "center",
        }}
      />

      <ClusterContent
        file="cpu1.mp4"
        title="CPU"
        shortText="少人数の器用なチーム。複雑な仕事を判断しながら順番に片づける。"
        accent="#4CAF50"
        opacity={cpuOpacity}
      />

      <ClusterContent
        file="gpu1.mp4"
        title="GPU"
        shortText="大勢で、似た計算を同時に一気に進めるのが得意。"
        accent="#F39C12"
        opacity={gpuOpacity}
      />
    </div>
  );
};

// ============================================================
// Bar Graph
// ============================================================

const SpeedBarRow: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  delay?: number;
}> = ({label, value, maxValue, delay = 0}) => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [delay, delay + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barProgress = interpolate(frame, [delay + 4, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const valueOpacity = interpolate(frame, [delay + 16, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetWidth = (value / maxValue) * 100;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 120px",
        alignItems: "center",
        gap: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: 600,
          opacity: labelOpacity,
        }}
      >
        {label}
      </div>

      <div
        style={{
          height: 48,
          backgroundColor: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${targetWidth * barProgress}%`,
            backgroundColor: "white",
          }}
        />
      </div>

      <div
        style={{
          color: "white",
          fontSize: 34,
          fontWeight: 700,
          opacity: valueOpacity,
        }}
      >
        {value}×
      </div>
    </div>
  );
};

const SpeedComparisonSlide: React.FC<{
  durationInFrames: number;
}> = ({durationInFrames}) => {
  const {panelScaleX, contentOpacity} = usePanelMotion(durationInFrames);

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 50,
        width: 1040,
        height: 450,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(8,8,8,0.92)",
          transform: `scaleX(${panelScaleX})`,
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: contentOpacity,
          boxSizing: "border-box",
          padding: "34px 42px",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 38,
            fontWeight: 700,
            marginBottom: 48,
            borderLeft: "4px solid #F39C12",
            paddingLeft: 18,
          }}
        >
          計算だけ14倍でも、全体は14倍とは限らない
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <SpeedBarRow label="計算性能" value={14} maxValue={14} delay={4} />
          <SpeedBarRow label="全体の体感" value={6} maxValue={14} delay={14} />
        </div>

        <div
          style={{
            marginTop: 40,
            color: "rgba(255,255,255,0.72)",
            fontSize: 25,
          }}
        >
          ※説明用の概念図。実測値の比較ではありません。
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Flow Diagram
// ============================================================

const DataFlowDiagram: React.FC<{
  durationInFrames: number;
}> = ({durationInFrames}) => {
  const {panelScaleX, contentOpacity} = usePanelMotion(durationInFrames);

  const items = ["計算する", "データを渡す", "次の処理へつなぐ"];

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 50,
        width: 1040,
        height: 450,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(8,8,8,0.92)",
          transform: `scaleX(${panelScaleX})`,
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: contentOpacity,
          boxSizing: "border-box",
          padding: 38,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 38,
            fontWeight: 700,
            borderLeft: "4px solid #3498DB",
            paddingLeft: 18,
            marginBottom: 70,
          }}
        >
          速さは「計算」だけでは決まらない
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={item}>
              <div
                style={{
                  width: 250,
                  height: 110,
                  border: "2px solid rgba(255,255,255,0.42)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 27,
                  fontWeight: 650,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {item}
              </div>

              {index < items.length - 1 && (
                <div
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 42,
                    padding: "0 8px",
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// System → Server cluster
// ============================================================

const SystemServerCluster: React.FC<{
  durationInFrames: number;
  switchFrame: number;
}> = ({durationInFrames, switchFrame}) => {
  const frame = useCurrentFrame();
  const {panelScaleX, contentOpacity} = usePanelMotion(durationInFrames);

  const INNER_FADE = 8;

  const systemOpacity = interpolate(
    frame,
    [switchFrame - INNER_FADE, switchFrame + INNER_FADE],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const serverOpacity = interpolate(
    frame,
    [switchFrame - INNER_FADE, switchFrame + INNER_FADE],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 50,
        width: 1040,
        height: 450,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(8,8,8,0.92)",
          transform: `scaleX(${panelScaleX})`,
          transformOrigin: "center",
        }}
      />

      {/* System Diagram */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: systemOpacity * contentOpacity,
          boxSizing: "border-box",
          padding: 34,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 38,
            fontWeight: 700,
            borderLeft: "4px solid #3498DB",
            paddingLeft: 18,
            marginBottom: 58,
          }}
        >
          AIの速さはシステム全体で決まる
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
          }}
        >
          {["CPU", "GPU", "Memory", "Server", "Network"].map((label) => (
            <div
              key={label}
              style={{
                height: 105,
                border: "2px solid rgba(255,255,255,0.42)",
                color: "white",
                fontSize: 24,
                fontWeight: 650,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 45,
            color: "rgba(255,255,255,0.75)",
            fontSize: 26,
            textAlign: "center",
          }}
        >
          部品同士を近づけ、待ち時間を減らす
        </div>
      </div>

      {/* Server visual */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: serverOpacity * contentOpacity,
          boxSizing: "border-box",
          padding: 28,
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 30,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        >
          <Video
            src={staticFile("video/server1.mp4")}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            borderLeft: "4px solid #3498DB",
            paddingLeft: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              marginBottom: 22,
            }}
          >
            Server
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.86)",
              fontSize: 28,
              lineHeight: 1.55,
            }}
          >
            GPUだけでなく、メモリや接続、ネットワークまで含めて全体を設計する。
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Closing text
// ============================================================

const ClosingText: React.FC<{
  durationInFrames: number;
}> = ({durationInFrames}) => {
  const {panelScaleX, contentOpacity} = usePanelMotion(durationInFrames);

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 110,
        width: 1040,
        height: 300,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(8,8,8,0.92)",
          transform: `scaleX(${panelScaleX})`,
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: contentOpacity,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 40,
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.45,
        }}
      >
        AIの速さは、
        <br />
        一人の天才ではなく
        <br />
        チーム全体の連携で決まる
      </div>
    </div>
  );
};

// ============================================================
// Subtitle timeline
//
// 音声に合わせた初期ドラフト。
// ElevenLabsの実音声をStudioで確認し、
// 必要なら from / duration のみ微調整する。
// ============================================================

const subtitles = [
  {
    from: 0,
    duration: 270,
    color: "#4CAF50",
    text: "AIのニュースを見ていると、「新しいGPUが速い」とか、「このAIは処理速度が上がった」といった話をよく聞きます。",
  },
  {
    from: 270,
    duration: 240,
    color: "#4CAF50",
    text: "すると、なんとなく、AIの速さはGPUの性能だけで決まるように感じますよね。",
  },
  {
    from: 510,
    duration: 180,
    color: "#4CAF50",
    text: "でも実際には、もう少しチーム戦に近いです。ちょっと会社で例えてみます。",
  },
  {
    from: 690,
    duration: 300,
    color: "#4CAF50",
    text: "CPUは、少人数だけどかなり器用な人たちです。複雑な仕事を判断しながら、順番に片づけていくのが得意です。",
  },
  {
    from: 990,
    duration: 300,
    color: "#F39C12",
    text: "一方GPUは、同じような仕事を大勢で一気に進めるのが得意です。",
  },
  {
    from: 1290,
    duration: 330,
    color: "#F39C12",
    text: "AIでは、似た計算をものすごい回数繰り返すので、この「大勢で同時に進める」というGPUの特徴が効いてきます。",
  },
  {
    from: 1620,
    duration: 270,
    color: "#F39C12",
    text: "ここだけ聞くと、「じゃあGPUをもっと速くすれば全部解決するじゃん」と思いますよね。",
  },
  {
    from: 1890,
    duration: 240,
    color: "#3498DB",
    text: "でも、ここにもう一つ問題があります。いくら計算する人が速くても、必要な資料が机まで届かなかったら仕事は止まります。",
  },
  {
    from: 2130,
    duration: 360,
    color: "#3498DB",
    text: "AIも同じです。計算する場所だけ速くても、データを置く場所や運ぶ仕組みが遅ければ、全体の速度はそこで頭打ちになります。",
  },
  {
    from: 2490,
    duration: 330,
    color: "#3498DB",
    text: "例えば、計算そのものが14倍速くなっても、データの受け渡しに長い待ち時間があるなら、体感では14倍にはなりません。",
  },
  {
    from: 2820,
    duration: 221,
    color: "#3498DB",
    text: "だから最近のAIインフラでは、GPU単体だけでなく、メモリ、チップ同士の接続、サーバー、ネットワークまで含めた設計が重要になります。",
  },
  {
    from: 3041,
    duration: 181,
    color: "#4CAF50",
    text: "つまり、AIの速さを考えるときは、一番速い部品を見るだけでは足りません。",
  },
  {
    from: 3222,
    duration: 260,
    color: "#4CAF50",
    text: "大事なのは、「計算する」「データを渡す」「次の処理へつなぐ」。この流れ全体です。",
  },
  {
    from: 3493,
    duration: 154,
    color: "#4CAF50",
    text: "AIの速さは、一人の天才ではなく、チーム全体の連携で決まる。",
  },
  {
    from: 3647,
    duration: 206,
    color: "#4CAF50",
    text: "まずはこのイメージを持っておくと、これからAIのハードウェアやインフラのニュースが、かなり分かりやすくなると思います。",
  },
];

// ============================================================
// End-to-End MVP timeline
//
// 130秒。末尾は実音声の発話位置に合わせて補正。
// ============================================================

const MvpEndToEnd: React.FC = () => {
  // CPU/GPU cluster
  const CPU_GPU_START = 660;
  const CPU_GPU_DURATION = 930; // 約31秒
  const CPU_GPU_SWITCH = 330;   // cluster内 約11秒後

  // Bar graph
  const BAR_START = 2430;
  const BAR_DURATION = 300;

  // Data flow
  const FLOW_START = 2730;
  const FLOW_DURATION = 330;

  // System → Server
  const SYSTEM_START = 3030;
  const SYSTEM_DURATION = 444;
  const SYSTEM_SWITCH = 300;

  // Closing
  const CLOSING_START = 3486;
  const CLOSING_DURATION = 161;

  return (
    <AbsoluteFill style={{backgroundColor: "#111111"}}>
      {/* 1. Background */}
      <BackgroundPlaylist totalDurationInFrames={TOTAL_FRAMES} />

      {/* 2. Narration */}
      <Audio src={staticFile("test-2m.mp3")} />

      {/* 3. Meaning Cluster: CPU → GPU */}
      <Sequence from={CPU_GPU_START - 6} durationInFrames={45}>
        <PanelCueSE />
      </Sequence>

      <Sequence
        from={CPU_GPU_START}
        durationInFrames={CPU_GPU_DURATION}
        name="Meaning Cluster: CPU vs GPU"
      >
        <CpuGpuCluster
          durationInFrames={CPU_GPU_DURATION}
          switchFrame={CPU_GPU_SWITCH}
        />
      </Sequence>

      {/* 4. Bar Graph */}
      <Sequence from={BAR_START - 6} durationInFrames={45}>
        <PanelCueSE />
      </Sequence>

      <Sequence
        from={BAR_START}
        durationInFrames={BAR_DURATION}
        name="Visual Segment: 14x concept"
      >
        <SpeedComparisonSlide durationInFrames={BAR_DURATION} />
      </Sequence>

      {/* 5. Flow Diagram
          前のSegmentから近いためSEは追加しない */}
      <Sequence
        from={FLOW_START}
        durationInFrames={FLOW_DURATION}
        name="Visual Segment: Data flow"
      >
        <DataFlowDiagram durationInFrames={FLOW_DURATION} />
      </Sequence>

      {/* 6. System → Server */}
      <Sequence from={SYSTEM_START - 6} durationInFrames={45}>
        <PanelCueSE />
      </Sequence>

      <Sequence
        from={SYSTEM_START}
        durationInFrames={SYSTEM_DURATION}
        name="Meaning Cluster: System to Server"
      >
        <SystemServerCluster
          durationInFrames={SYSTEM_DURATION}
          switchFrame={SYSTEM_SWITCH}
        />
      </Sequence>

      {/* 7. Closing */}
      <Sequence
        from={CLOSING_START}
        durationInFrames={CLOSING_DURATION}
        name="Closing message"
      >
        <ClosingText durationInFrames={CLOSING_DURATION} />
      </Sequence>

      {/* 8. Cat */}
      <CatCirclePlaceholder />

      {/* 9. Subtitle */}
      {subtitles.map((item, index) => (
        <Sequence
          key={index}
          from={item.from}
          durationInFrames={item.duration}
        >
          <SubtitleBox barColor={item.color}>{item.text}</SubtitleBox>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ============================================================
// Composition
// ============================================================

export const MyComposition: React.FC = () => (
  <Composition
    id="AI-Radio-MVP-EndToEnd-v01"
    component={MvpEndToEnd}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1280}
    height={720}
  />
);
