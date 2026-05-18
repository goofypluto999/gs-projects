"use client";

interface WindowChromeProps {
  /** Optional URL text shown in the address bar */
  url?: string;
  /** Background tone for the chrome bar */
  tone?: "dark" | "light";
}

/**
 * Tiny macOS-style window chrome — 3 traffic-light dots + slim url pill.
 * Sits on top of project preview images for that "this is a real product
 * window" framing.
 */
export function WindowChrome({ url, tone = "dark" }: WindowChromeProps) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 h-7 ${
        tone === "dark"
          ? "bg-bg/80 border-b border-border/80"
          : "bg-white/85 border-b border-zinc-200"
      } backdrop-blur-md`}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      </div>

      {url && (
        <div className="flex-1 max-w-[260px] mx-auto truncate text-center text-[10px] tracking-wide text-text-tertiary px-2 py-0.5 rounded bg-bg/40 border border-border/40 font-mono">
          {url}
        </div>
      )}
    </div>
  );
}
