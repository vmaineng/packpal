"use client";
import type { SearchState } from "../types";
import { AppCard } from "./AppCard";
import type { VoteMap } from "../lib/api";
import type { UserVotes } from "../hooks/useVotes";

const CATEGORY_META = {
  transport: {
    label: "Getting Around",
    emoji: "🚌",
    borderColor: "border-blue-500",
    tip: "Taxis, rides, trains & buses",
  },
  food: {
    label: "Food & Dining",
    emoji: "🍜",
    borderColor: "border-orange-500",
    tip: "Where to eat — and where to bring cash",
  },
  sleep: {
    label: "Places to Sleep",
    emoji: "🛏️",
    borderColor: "border-purple-500",
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
      <div className="flex flex-col items-center justify-center text-center px-6 py-14 gap-3">
        <span className="text-5xl mb-1">🌍</span>
        <h3 className="text-[16px] font-semibold text-white">
          Drop a pin anywhere
        </h3>
        <p className="text-[13px] text-moss-muted leading-relaxed max-w-[260px]">
          Click the globe, search for a city, or switch to AI mode to describe
          your trip.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {["Thailand", "Tokyo", "Bali", "London"].map((place) => (
            <span
              key={place}
              className="text-[11px] px-3 py-1 bg-moss-darkest border border-moss-muted/20 text-moss-muted rounded-full"
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
      <div className="flex flex-col items-center justify-center px-6 py-14 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-moss-muted/20 border-t-moss-glow animate-spin" />
        <p className="text-[13px] text-moss-muted">
          {state.status === "searching"
            ? "Identifying location..."
            : "Loading recommendations..."}
        </p>
        {state.location && (
          <span className="text-[11px] px-3 py-1 bg-moss-darkest border border-moss-muted/20 text-moss-muted rounded-full">
            {state.location.place_name}
          </span>
        )}
      </div>
    );
  }

  // ── Error ──
  if (state.status === "error") {
    return (
      <div className="mx-5 mt-5 flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
        <span className="text-[16px] shrink-0">⚠️</span>
        <p className="text-[13px] text-red-400 leading-relaxed">
          {state.error}
        </p>
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
    <div className="px-5 py-5 flex flex-col gap-5">
      {/* location header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">
            {flagEmoji(apps.country_code)}
          </span>
          <div>
            <h2 className="text-[20px] font-semibold text-white leading-tight">
              {location?.city ?? apps.country_name}
            </h2>
            <p className="text-[11px] text-moss-muted mt-0.5">
              {location?.place_name}
            </p>
          </div>
        </div>
        {cached && (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-moss-glow/10 text-moss-glow border border-moss-glow/20">
            ⚡ Cached
          </span>
        )}
      </div>

      {/* cash warning */}
      {hasCashWarning && (
        <div className="flex gap-3 bg-orange-500/8 border border-orange-500/20 rounded-xl p-4">
          <span className="text-[22px] shrink-0">💴</span>
          <div>
            <p className="text-[13px] font-semibold text-orange-400 mb-0.5">
              Cash is king here
            </p>
            <p className="text-[12px] text-moss-muted leading-relaxed">
              Many places in {apps.country_name} don&apos;t accept cards. Always
              carry local currency.
            </p>
          </div>
        </div>
      )}

      {/* categories */}
      {categories.map(({ key, apps: catApps }) => {
        if (!catApps.length) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key} className="flex flex-col gap-2">
            {/* category header */}
            <div
              className={`flex items-start gap-2.5 bg-moss-darkest border border-moss-muted/20 border-l-[3px] ${meta.borderColor} rounded-r-lg px-3 py-2.5`}
            >
              <span className="text-[18px] leading-none mt-0.5">
                {meta.emoji}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold text-white leading-tight">
                  {meta.label}
                </h3>
                <p className="text-[11px] text-moss-muted mt-0.5">{meta.tip}</p>
              </div>
            </div>

            {/* app cards */}
            <div className="flex flex-col gap-2">
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

      {apps.general_tips?.length > 0 && (
        <div className="bg-moss-darkest border border-moss-muted/20 rounded-xl px-4 py-4">
          <h3 className="text-[13px] font-semibold text-white mb-3">
            💡 Local Tips
          </h3>
          <ul className="flex flex-col gap-2">
            {apps.general_tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12.5px] text-moss-muted leading-relaxed"
              >
                <span className="text-moss-accent shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
