import type { SearchState } from "../types";
import { AppCard } from "./AppCard";
import type { VoteMap } from "../lib/api";
import type { UserVotes } from "../hooks/useVotes";

const CATEGORY_META = {
  transport: {
    label: "Getting Around",
    emoji: "🚌",
    color: "#3b82f6",
    tip: "Taxis, rides, trains & buses",
  },
  food: {
    label: "Food & Dining",
    emoji: "🍜",
    color: "#f97316",
    tip: "Where to eat — and where to bring cash",
  },
  sleep: {
    label: "Places to Sleep",
    emoji: "🛏️",
    color: "#8b5cf6",
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
  if (state.status === "idle") {
    return (
      <div className="panel-empty">
        <div className="panel-empty-icon">🌍</div>
        <h3>Drop a pin anywhere</h3>
        <p>
          Click the globe, search for a city, or switch to AI mode to describe
          your trip.
        </p>
        <div className="panel-empty-examples">
          <span>Thailand</span>
          <span>Tokyo</span>
          <span>Bali</span>
          <span>London</span>
        </div>
      </div>
    );
  }

  if (state.status === "searching" || state.status === "loading") {
    return (
      <div className="panel-loading">
        <div className="loading-spinner" />
        <p>
          {state.status === "searching"
            ? "Identifying location..."
            : "Loading recommendations..."}
        </p>
        {state.location && (
          <span className="loading-location">{state.location.place_name}</span>
        )}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="panel-error">
        <span>⚠️</span>
        <p>{state.error}</p>
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
    <div className="results-panel">
      <div className="results-header">
        <div className="results-location">
          <span className="location-flag">{flagEmoji(apps.country_code)}</span>
          <div>
            <h2 className="location-name">
              {location?.city ?? apps.country_name}
            </h2>
            <p className="location-sub">{location?.place_name}</p>
          </div>
        </div>
        {cached && <span className="cache-badge">⚡ Cached</span>}
      </div>

      {hasCashWarning && (
        <div className="cash-alert">
          <span>💴</span>
          <div>
            <strong>Cash is king here</strong>
            <p>
              Many places in {apps.country_name} don't accept cards. Always
              carry local currency.
            </p>
          </div>
        </div>
      )}

      {categories.map(({ key, apps: catApps }) => {
        if (!catApps.length) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key} className="category-section">
            <div
              className="category-header"
              style={{ borderColor: meta.color }}
            >
              <span className="category-emoji">{meta.emoji}</span>
              <div>
                <h3 className="category-label">{meta.label}</h3>
                <p className="category-tip">{meta.tip}</p>
              </div>
            </div>
            <div className="apps-list">
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
        <div className="tips-section">
          <h3 className="tips-title">💡 Local Tips</h3>
          <ul className="tips-list">
            {apps.general_tips.map((tip, i) => (
              <li key={i} className="tip-item">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
