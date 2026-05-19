import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Giovanni Sizino Ennes — Digital Products & Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0B",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          color: "#FAFAFA",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Aurora-ish glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        {/* Brand pill top-left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "auto",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#34D399",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A1A1AA",
            }}
          >
            All 5 sites · live now
          </span>
        </div>

        {/* Name display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: "120px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
            }}
          >
            Giovanni Sizino
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                fontSize: "120px",
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                color: "#A1A1AA",
                lineHeight: 0.9,
              }}
            >
              Ennes
            </span>
            <span
              style={{
                fontSize: "120px",
                fontWeight: 800,
                color: "#2563EB",
                lineHeight: 0.9,
              }}
            >
              .
            </span>
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            marginTop: "32px",
            fontSize: "32px",
            color: "#A1A1AA",
            maxWidth: "880px",
            zIndex: 1,
          }}
        >
          Five live digital products. Built end-to-end.
        </span>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "32px",
            borderTop: "1px solid #232326",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: "16px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#71717A",
            }}
          >
            gs-projects.vercel.app
          </span>
          <span
            style={{
              fontSize: "16px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#71717A",
            }}
          >
            UK · Lisbon
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
