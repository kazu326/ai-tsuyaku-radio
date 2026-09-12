import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { usePanelMotion } from "../Composition";

export type PanelState = {
  at: number;
  title: string;
  text?: string;
  steps?: string[];
  active?: number;
  note?: string;
};

// Episode-local content updates; the existing panel entry/exit stays unchanged.
export const AgentPanel: React.FC<{
  durationInFrames: number;
  states: PanelState[];
}> = ({ durationInFrames, states }) => {
  const frame = useCurrentFrame();
  const { panelScaleX, contentOpacity } = usePanelMotion(durationInFrames);
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
      {states.map((state, index) => {
        const next = states[index + 1];
        const enter =
          index === 0
            ? 1
            : interpolate(frame, [state.at, state.at + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
        const exit = next
          ? interpolate(frame, [next.at, next.at + 8], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;
        const opacity = enter * exit * contentOpacity;
        if (opacity === 0) return null;
        return (
          <div
            key={state.at}
            style={{
              position: "absolute",
              inset: 0,
              opacity,
              padding: "34px 42px",
              boxSizing: "border-box",
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                borderLeft: "4px solid #3498DB",
                paddingLeft: 18,
                lineHeight: 1.35,
              }}
            >
              {state.title}
            </div>
            {state.steps ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 58,
                }}
              >
                {state.steps.map((step, i) => (
                  <React.Fragment key={step}>
                    {i > 0 && (
                      <div
                        style={{
                          fontSize: 36,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        →
                      </div>
                    )}
                    <div
                      style={{
                        width: 270,
                        height: 110,
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: 27,
                        fontWeight: 600,
                        border: `2px solid ${state.active === i ? "#3498DB" : "rgba(255,255,255,0.42)"}`,
                        backgroundColor:
                          state.active === i
                            ? "rgba(52,152,219,0.22)"
                            : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {step}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  marginTop: 62,
                  textAlign: "center",
                }}
              >
                {state.text}
              </div>
            )}
            {state.note && (
              <div
                style={{
                  marginTop: 36,
                  fontSize: 27,
                  lineHeight: 1.5,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                }}
              >
                {state.note}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
