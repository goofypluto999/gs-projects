"use client";

import { useEffect, useState } from "react";

/**
 * Tiny dual-city clock pill — London + São Paulo, premium signal of
 * cross-continent presence. Updates every second, no FOUT on hydration.
 */
function format(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const d = new Date();
      const london = format(d, "Europe/London");
      const saoPaulo = format(d, "America/Sao_Paulo");
      setTime(`${london} LDN · ${saoPaulo} SP`);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <span className="inline-block h-5 w-32 rounded bg-surface/40" aria-hidden="true" />
    );
  }

  return (
    <span
      className="hidden lg:inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-text-tertiary tabular-nums px-2.5 py-1 rounded-md border border-border bg-surface/30 backdrop-blur-sm"
      title="London / São Paulo"
    >
      <span className="w-1 h-1 rounded-full bg-emerald-400/80" />
      {time}
    </span>
  );
}
