import { useState } from "react";
import type { TravelApp } from "../types";
import type { VoteMap } from "../lib/api";
import type { UserVotes } from "../hooks/useVotes";

interface AppCardProps {
  app: TravelApp;
  index: number;
  countryCode: string;
  voteMap: VoteMap;
  userVotes: UserVotes;
  onVote: (
    appId: string,
    appName: string,
    countryCode: string,
    type: "accurate" | "inaccurate",
  ) => void;
}

const AppleIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04l-.03.1zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const AndroidIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.18 23.76c.32.18.68.2 1.01.07l11.2-6.46-2.5-2.5-9.71 8.89zM20.8 9.27L4.91.54c-.33-.19-.7-.17-1.01.02L14.86 12 20.8 9.27zM2.5 1.7C2.19 2 2 2.5 2 3.06v17.88c0 .56.19 1.06.5 1.36L3 22.8 14.1 12 3 1.2l-.5.5zM21.04 10.72L18 12l3.04 1.28.76-.98v-.6l-.76-.98z" />
  </svg>
);

const WebIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className="transition-transform duration-200"
    style={{ transform: open ? "rotate(180deg)" : "none" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function AppCard({
  app,
  index,
  countryCode,
  voteMap,
  userVotes,
  onVote,
}: AppCardProps) {
  const [expanded, setExpanded] = useState(false);

  const voteData = voteMap[app.id];
  const counts = voteData
    ? {
        accurate: voteData.accurate,
        inaccurate: voteData.inaccurate,
        score: voteData.score,
      }
    : { accurate: 0, inaccurate: 0, score: 50 };
  const userVote = userVotes[app.id] ?? null;
  const hasVotes = counts.accurate + counts.inaccurate > 0;

  const scoreColor =
    counts.score >= 70
      ? "text-emerald-400"
      : counts.score >= 45
        ? "text-amber-400"
        : "text-red-400";
  const scoreBg =
    counts.score >= 70
      ? "bg-emerald-500/8 border-emerald-500/20"
      : counts.score >= 45
        ? "bg-amber-500/8 border-amber-500/20"
        : "bg-red-500/8 border-red-500/20";

  const storeLinks = [
    app.app_store_url && {
      href: app.app_store_url,
      label: "iOS",
      icon: <AppleIcon />,
    },
    app.play_store_url && {
      href: app.play_store_url,
      label: "Android",
      icon: <AndroidIcon />,
    },
    app.website_url && {
      href: app.website_url,
      label: "Web",
      icon: <WebIcon />,
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <div
      className="bg-moss-darkest border border-moss-muted/15 rounded-xl overflow-hidden opacity-0 animate-[fadeSlideIn_0.3s_ease_forwards]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* ── main row ── */}
      <div className="flex gap-3 px-3.5 pt-3.5 pb-3">
        {/* icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-moss-dark border border-moss-muted/15 flex items-center justify-center">
          {app.icon_url ? (
            <img
              src={app.icon_url}
              alt={app.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fb = (e.target as HTMLImageElement)
                  .nextElementSibling as HTMLElement;
                if (fb) fb.style.display = "flex";
              }}
            />
          ) : null}
          <span
            className="text-[14px] font-bold text-moss-accent hidden items-center justify-center w-full h-full"
            style={{ display: app.icon_url ? "none" : "flex" }}
          >
            {app.name[0]}
          </span>
        </div>

        {/* body */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* name row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-white leading-tight">
              {app.name}
            </span>
            {app.is_cash_only_warning && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-medium">
                💴 cash
              </span>
            )}
            {hasVotes && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-medium ${scoreColor} ${scoreBg}`}
              >
                {counts.score}%
              </span>
            )}
          </div>

          {/* description */}
          <p className="text-[11.5px] text-moss-muted/70 leading-relaxed line-clamp-2">
            {app.description}
          </p>

          {/* notes */}
          {app.notes && (
            <p className="text-[11px] text-moss-accent/60 leading-relaxed flex gap-1.5 items-start">
              <span className="shrink-0 mt-0.5 opacity-60">ℹ</span>
              {app.notes}
            </p>
          )}

          {/* store links */}
          {storeLinks.length > 0 && (
            <div className="flex gap-1.5 mt-0.5 flex-wrap">
              {storeLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10.5px] px-2 py-1 rounded-lg bg-moss-dark border border-moss-muted/15 text-moss-muted/70 hover:text-white hover:border-moss-muted/40 transition-colors"
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── community rating toggle ── */}
      <div className="border-t border-moss-muted/10">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-1.5 px-3.5 py-2 text-[11px] text-moss-muted/50 hover:text-moss-muted/80 transition-colors"
        >
          <ChevronIcon open={expanded} />
          {expanded ? "Hide community rating" : "Community accuracy rating"}
          {hasVotes && (
            <span className="ml-auto font-mono text-[10px]">
              {counts.accurate + counts.inaccurate} votes
            </span>
          )}
        </button>

        {expanded && (
          <div className="px-3.5 pb-3 flex flex-col gap-2.5">
            {/* score bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10.5px]">
                <span className="text-emerald-400/70">
                  {counts.accurate} accurate
                </span>
                <span className="text-red-400/70">
                  {counts.inaccurate} inaccurate
                </span>
              </div>
              <div className="h-1 rounded-full bg-moss-dark overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${hasVotes ? counts.score : 50}%` }}
                />
              </div>
            </div>

            {/* vote buttons */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onVote(app.id, app.name, countryCode, "accurate")
                }
                disabled={userVote === "accurate"}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                  userVote === "accurate"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : "bg-moss-dark border-moss-muted/15 text-moss-muted/60 hover:border-emerald-500/30 hover:text-emerald-400"
                }`}
              >
                <span>✓</span> Accurate
              </button>
              <button
                onClick={() =>
                  onVote(app.id, app.name, countryCode, "inaccurate")
                }
                disabled={userVote === "inaccurate"}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                  userVote === "inaccurate"
                    ? "bg-red-500/15 border-red-500/30 text-red-400"
                    : "bg-moss-dark border-moss-muted/15 text-moss-muted/60 hover:border-red-500/30 hover:text-red-400"
                }`}
              >
                <span>✕</span> Inaccurate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
