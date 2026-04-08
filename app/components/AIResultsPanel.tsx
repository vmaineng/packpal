import type { AISearchResult, AIAppSuggestion } from "../lib/api";

interface AIResultsPanelProps {
  result: AISearchResult;
}

const CATEGORY_META = {
  transport: { label: "Getting around", emoji: "🚌", color: "#3b82f6" },
  food: { label: "Food & dining", emoji: "🍜", color: "#f97316" },
  sleep: { label: "Places to sleep", emoji: "🛏️", color: "#8b5cf6" },
} as const;

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e0 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...cp);
}

function AIAppRow({ app, index }: { app: AIAppSuggestion; index: number }) {
  return (
    <div className="ai-app-row" style={{ animationDelay: `${index * 55}ms` }}>
      <div className="ai-app-name-row">
        <span className="ai-app-name">{app.name}</span>
        {app.cash_warning && (
          <span className="badge badge-cash">💴 Cash areas</span>
        )}
      </div>
      <p className="ai-app-reason">{app.reason}</p>
    </div>
  );
}

export function AIResultsPanel({ result }: AIResultsPanelProps) {
  const categories = [
    { key: "transport" as const, apps: result.transport },
    { key: "food" as const, apps: result.food },
    { key: "sleep" as const, apps: result.sleep },
  ];

  return (
    <div className="ai-results">
      <div className="ai-results-header">
        <div className="ai-results-location">
          <span className="location-flag">
            {flagEmoji(result.country_code)}
          </span>
          <div>
            <h2 className="location-name">
              {result.city ?? result.country_name}
            </h2>
            <div className="ai-meta-row">
              <span className="ai-badge-sm">✦ AI</span>
              {result.travel_style && (
                <span className="ai-style-tag">{result.travel_style}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {result.cash_heavy && (
        <div className="cash-alert">
          <span>💴</span>
          <div>
            <strong>Cash is king here</strong>
            <p>Many places don't take cards — carry local currency.</p>
          </div>
        </div>
      )}

      {result.ai_insights?.length > 0 && (
        <div className="ai-insights-box">
          <p className="ai-insights-label">✦ AI insights for your trip</p>
          <ul className="ai-insights-list">
            {result.ai_insights.map((insight, i) => (
              <li key={i} className="ai-insight-item">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.map(({ key, apps }) => {
        if (!apps?.length) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key} className="ai-category-section">
            <div
              className="ai-category-header"
              style={{ borderColor: meta.color }}
            >
              <span>{meta.emoji}</span>
              <span className="category-label">{meta.label}</span>
            </div>
            {apps.map((app, i) => (
              <AIAppRow key={i} app={app} index={i} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
