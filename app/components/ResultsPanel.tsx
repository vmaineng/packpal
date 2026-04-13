"use client";
import type { SearchState } from "../types";
import { AppCard } from "./AppCard";
import type { VoteMap } from "../lib/api";
import type { UserVotes } from "../hooks/useVotes";

const CATEGORY_META = {
  transport: {
    label: "Getting Around",
    emoji: "🚌",
    accentColor: "bg-blue-500",
    glowColor: "shadow-blue-500/10",
    borderColor: "border-blue-500/40",
    textColor: "text-blue-400",
    tip: "Taxis, rides, trains & buses",
  },
  food: {
    label: "Food & Dining",
    emoji: "🍜",
    accentColor: "bg-orange-500",
    glowColor: "shadow-orange-500/10",
    borderColor: "border-orange-500/40",
    textColor: "text-orange-400",
    tip: "Where to eat — and where to bring cash",
  },
  sleep: {
    label: "Places to Sleep",
    emoji: "🛏️",
    accentColor: "bg-purple-500",
    glowColor: "shadow-purple-500/10",
    borderColor: "border-purple-500/40",
    textColor: "text-purple-400",
    tip: "Hotels, hostels, and unique stays",
  },
} as const;

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e0 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...cp);
}

interface ResultsPanelProps {
  state: SearchState;
  voteMap: VoteMap;
  userVotes: UserVotes;
  castVote: (
    appId: string,
    appName: string,
    countryCode: string,
    type: "accurate" | "inaccurate",
  ) => Promise<void>;
}

export function ResultsPanel({
  state,
  voteMap,
  userVotes,
  castVote,
}: ResultsPanelProps) {
  // ── Idle ──
  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-moss-glow/10 blur-xl scale-150" />
          <span className="relative text-5xl">🌍</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[15px] font-semibold text-white tracking-tight">
            Drop a pin anywhere
          </h3>
          <p className="text-[12.5px] text-moss-muted/70 leading-relaxed max-w-[240px]">
            Search a city, click the globe, or use AI mode to describe your
            trip.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center mt-2">
          {["Thailand", "Tokyo", "Bali", "London"].map((place) => (
            <span
              key={place}
              className="text-[11px] px-3 py-1 bg-moss-dark border border-moss-muted/15 text-moss-muted/60 rounded-full hover:border-moss-glow/30 hover:text-moss-glow/70 transition-colors cursor-pointer"
            >
              {place}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (state.status === "searching" || state.status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 gap-4">
        <div className="relative">
          <div className="w-9 h-9 rounded-full border border-moss-muted/10 border-t-moss-glow animate-spin" />
          <div className="absolute inset-0 rounded-full bg-moss-glow/5 blur-md" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[13px] font-medium text-white/80">
            {state.status === "searching"
              ? "Identifying location"
              : "Loading recommendations"}
          </p>
          <p className="text-[11px] text-moss-muted/50 animate-pulse">
            just a moment…
          </p>
        </div>
        {state.location && (
          <span className="text-[11px] px-3 py-1.5 bg-moss-dark border border-moss-glow/20 text-moss-glow/60 rounded-full font-mono tracking-wide">
            {state.location.place_name}
          </span>
        )}
      </div>
    );
  }

  // ── Error ──
  if (state.status === "error") {
    return (
      <div className="mx-5 mt-5 flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3.5">
        <span className="text-[15px] shrink-0 mt-0.5">⚠️</span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[12px] font-semibold text-red-400">
            Something went wrong
          </p>
          <p className="text-[12px] text-red-400/70 leading-relaxed">
            {state.error}
          </p>
        </div>
      </div>
    );
  }

  if (!state.apps) return null;

  const { apps, location, cached } = state;
  const hasCashWarning = apps.food.some((a) => a.is_cash_only_warning);
  const categories = [
    { key: "transport" as const, apps: apps.transport },
    { key: "food" as const, apps: apps.food },
    { key: "sleep" as const, apps: apps.sleep },
  ];

  return (
    <div className="px-4 py-5 flex flex-col gap-5">
      {/* ── location header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* flag with glow ring */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-moss-dark border border-moss-muted/15">
            <span className="text-[28px] leading-none">
              {flagEmoji(apps.country_code)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[19px] font-bold text-white leading-none tracking-tight">
              {location?.city ?? apps.country_name}
            </h2>
            <p className="text-[11px] text-moss-muted/60 font-mono">
              {location?.place_name}
            </p>
          </div>
        </div>

        {cached && (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-moss-glow/8 text-moss-glow border border-moss-glow/15 font-mono tracking-wide">
            ⚡ cached
          </span>
        )}
      </div>

      {/* ── divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-moss-muted/20 to-transparent" />

      {/* ── cash warning ── */}
      {hasCashWarning && (
        <div className="flex gap-3 bg-orange-500/5 border border-orange-500/15 rounded-2xl p-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 shrink-0">
            <span className="text-[18px] leading-none">💴</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[12.5px] font-semibold text-orange-400 leading-tight">
              Cash is king here
            </p>
            <p className="text-[12px] text-orange-400/60 leading-relaxed">
              Many places in {apps.country_name} don&apos;t accept cards —
              always carry local currency.
            </p>
          </div>
        </div>
      )}

      {/* ── categories ── */}
      {categories.map(({ key, apps: catApps }) => {
        if (!catApps.length) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key} className="flex flex-col gap-2">
            {/* category header */}
            <div
              className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-moss-dark border ${meta.borderColor}`}
            >
              {/* color dot */}
              <div
                className={`w-1.5 h-6 rounded-full ${meta.accentColor} opacity-70 shrink-0`}
              />
              <span className="text-[17px] leading-none">{meta.emoji}</span>
              <div className="flex flex-col gap-0">
                <h3 className="text-[12.5px] font-semibold text-white leading-tight">
                  {meta.label}
                </h3>
                <p className={`text-[11px] ${meta.textColor} opacity-60`}>
                  {meta.tip}
                </p>
              </div>
              {/* count badge */}
              <span
                className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.borderColor} ${meta.textColor} opacity-70`}
              >
                {catApps.length}
              </span>
            </div>

            {/* app cards */}
            <div className="flex flex-col gap-1.5 pl-1">
              {catApps.map((app, i) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={i}
                  countryCode={apps.country_code}
                  voteMap={voteMap}
                  userVotes={userVotes}
                  onVote={castVote}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* ── local tips ── */}
      {apps.general_tips?.length > 0 && (
        <div className="bg-moss-dark border border-moss-muted/15 rounded-2xl px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[15px]">💡</span>
            <h3 className="text-[12.5px] font-semibold text-white">
              Local Tips
            </h3>
          </div>
          <div className="h-px bg-moss-muted/10" />
          <ul className="flex flex-col gap-2.5">
            {apps.general_tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[12px] text-moss-muted/70 leading-relaxed"
              >
                <span className="text-moss-glow/50 shrink-0 mt-0.5 font-mono text-[10px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
