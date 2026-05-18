import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 28,
          color: "white",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.05em",
          borderRadius: 12,
        }}
      >
        GS
      </div>
    ),
    size
  );
}
