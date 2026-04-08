import { useState } from "react";
import type { TravelApp } from "../types";
// import { VoteBar } from "./VoteBar";
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

  return (
    <div className="app-card" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="app-card-main">
        <div className="app-card-icon">
          {app.icon_url && (
            <img
              src={app.icon_url}
              alt={app.name}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fb = (e.target as HTMLImageElement)
                  .nextElementSibling as HTMLElement;
                if (fb) fb.style.display = "flex";
              }}
            />
          )}
          <div
            className="app-icon-fallback"
            style={{ display: app.icon_url ? "none" : "flex" }}
          >
            {app.name[0]}
          </div>
        </div>

        <div className="app-card-body">
          <div className="app-card-header">
            <span className="app-name">{app.name}</span>
            {app.is_cash_only_warning && (
              <span className="badge badge-cash">💴 Cash areas</span>
            )}
            {/* Live score badge if voted */}
            {counts.accurate + counts.inaccurate > 0 && (
              <span
                className="vote-score-badge"
                style={{
                  color:
                    counts.score >= 70
                      ? "#10b981"
                      : counts.score >= 45
                        ? "#f59e0b"
                        : "#ef4444",
                  background:
                    counts.score >= 70
                      ? "rgba(16,185,129,0.1)"
                      : counts.score >= 45
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(239,68,68,0.1)",
                  border: `1px solid ${counts.score >= 70 ? "rgba(16,185,129,0.2)" : counts.score >= 45 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                {counts.score}% ✓
              </span>
            )}
          </div>

          <p className="app-description">{app.description}</p>
          {app.notes && <p className="app-notes">ℹ️ {app.notes}</p>}

          <div className="app-links">
            {app.app_store_url && (
              <a
                href={app.app_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link ios"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04l-.03.1zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            )}
            {app.play_store_url && (
              <a
                href={app.play_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link android"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.18 23.76c.32.18.68.2 1.01.07l11.2-6.46-2.5-2.5-9.71 8.89zM20.8 9.27L4.91.54c-.33-.19-.7-.17-1.01.02L14.86 12 20.8 9.27zM2.5 1.7C2.19 2 2 2.5 2 3.06v17.88c0 .56.19 1.06.5 1.36L3 22.8 14.1 12 3 1.2l-.5.5zM21.04 10.72L18 12l3.04 1.28.76-.98v-.6l-.76-.98z" />
                </svg>
                Play Store
              </a>
            )}
            {app.website_url && (
              <a
                href={app.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link web"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Web
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Community voting */}
      <div className="vote-section">
        <button className="vote-toggle" onClick={() => setExpanded((v) => !v)}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {expanded ? "Hide community rating" : "Community accuracy rating"}
        </button>

        {/* {expanded && (
          <VoteBar
            appId={app.id}
            appName={app.name}
            countryCode={countryCode}
            counts={counts}
            userVote={userVote}
            onVote={(type) => onVote(app.id, app.name, countryCode, type)}
          />
        )} */}
      </div>
    </div>
  );
}
