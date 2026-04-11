export type ProjectStatus = "live" | "beta" | "development";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  url: string;
  /** URL used for iframe preview — may differ from main url to avoid popups/blocks */
  previewUrl: string | null;
  /** iframe sandbox policy — strip allow-same-origin to prevent cookie popups */
  sandboxPolicy?: string;
  status: ProjectStatus;
  tags: string[];
  accent: string;
  year: number;
  /** If true, iframe embedding is blocked — use styled fallback everywhere */
  iframeBlocked?: boolean;
}

export const projects: Project[] = [
  {
    id: "foresay-labs",
    name: "Foresay Labs",
    tagline: "Scenario intelligence for strategic decisions",
    description:
      "Multi-agent simulation engine that models real-world scenarios to surface blind spots before they become costly mistakes. Feed it a decision, and it runs parallel futures — showing you what happens when variables shift.",
    problem:
      "Businesses make high-stakes decisions with incomplete information. Traditional forecasting looks backward. Foresay looks sideways — across multiple possible futures simultaneously.",
    url: "https://foresay-labs-live.vercel.app/",
    previewUrl: null,
    iframeBlocked: true,
    status: "live",
    tags: ["AI", "Simulation", "Strategy", "Multi-Agent"],
    accent: "#6366F1",
    year: 2025,
  },
  {
    id: "stagplanner",
    name: "StagPlanner",
    tagline: "Group event planning, simplified",
    description:
      "Takes the chaos out of planning group events. Handles itineraries, budgets, polls, and coordination across the group — so one person doesn't have to carry the entire mental load.",
    problem:
      "Planning a stag do, group trip, or big event means endless WhatsApp threads, spreadsheets, and someone always out of the loop. StagPlanner puts everything in one place.",
    url: "https://stagplanner.vercel.app/#demo",
    previewUrl: "https://stagplanner.vercel.app/#demo",
    sandboxPolicy: "allow-scripts allow-same-origin",
    status: "live",
    tags: ["Events", "Planning", "Groups", "Coordination"],
    accent: "#10B981",
    year: 2025,
  },
  {
    id: "vantage",
    name: "Vantage",
    tagline: "AI-powered job preparation platform",
    description:
      "Prepares candidates for interviews and applications with AI-driven mock interviews, CV analysis, and personalised coaching. Turns preparation into a competitive advantage.",
    problem:
      "Job seekers spend hours guessing what interviewers want. Vantage uses AI to simulate real interview conditions and give targeted feedback — before the real thing.",
    url: "https://vantage-livid.vercel.app/",
    previewUrl: "https://vantage-livid.vercel.app/",
    sandboxPolicy: "allow-scripts allow-same-origin",
    status: "live",
    tags: ["AI", "Career", "Interviews", "SaaS"],
    accent: "#F59E0B",
    year: 2025,
  },
];
