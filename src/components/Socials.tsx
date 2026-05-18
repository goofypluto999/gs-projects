"use client";

import { Mail } from "lucide-react";
import { socials, type SocialLink } from "@/data/projects";

const iconBase = "w-[15px] h-[15px]";

function GitHubIcon() {
  return (
    <svg className={iconBase} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.79.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className={iconBase} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45C23.21 24 24 23.22 24 22.27V1.73C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className={iconBase} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.81.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.81-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.81-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.81.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.55a5.87 5.87 0 0 0-2.12 1.38A5.87 5.87 0 0 0 .63 4.13c-.29.76-.49 1.64-.55 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.55 2.91.29.78.69 1.45 1.38 2.13a5.87 5.87 0 0 0 2.12 1.37c.76.29 1.64.49 2.91.55 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.55a5.87 5.87 0 0 0 2.12-1.37 5.87 5.87 0 0 0 1.38-2.13c.29-.76.49-1.64.55-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.55-2.91a5.87 5.87 0 0 0-1.38-2.12A5.87 5.87 0 0 0 19.87.63c-.76-.29-1.64-.49-2.91-.55C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

const iconMap: Record<SocialLink["icon"], React.ComponentType | null> = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  mail: null,
  twitter: null,
};

interface SocialsProps {
  className?: string;
  size?: "sm" | "md";
}

export function Socials({ className = "", size = "md" }: SocialsProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {socials.map((s: SocialLink) => {
        const Icon = iconMap[s.icon];
        return (
          <a
            key={s.label}
            href={s.url}
            target={s.icon === "mail" ? undefined : "_blank"}
            rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
            aria-label={s.label}
            className={`group relative inline-flex items-center justify-center rounded-md border border-border bg-surface/40 hover:bg-surface hover:border-border-hover text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer ${
              size === "sm" ? "w-8 h-8" : "w-9 h-9"
            }`}
          >
            {Icon ? <Icon /> : <Mail size={size === "sm" ? 13 : 15} strokeWidth={1.5} />}
          </a>
        );
      })}
    </div>
  );
}
