"use client";
import type { AISearchResult, AIAppSuggestion } from "../lib/api";

interface AIResultsPanelProps {
  result: AISearchResult;
}

const CATEGORY_META = {
  transport: { label: "Getting around", emoji: "🚌", color: "border-blue-500" },
  food: { label: "Food & dining", emoji: "🍜", color: "border-orange-500" },
  sleep: { label: "Places to sleep", emoji: "🛏️", color: "border-purple-500" },
} as const;

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e0 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...cp);
}

function AIAppRow({ app, index }: { app: AIAppSuggestion; index: number }) {
  return (
    <div
      className="bg-moss-darkest border border-moss-muted/20 rounded-xl px-4 py-3 mb-2 animate-fadeUp hover:border-moss-muted/40 transition-colors"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[14px] font-semibold text-white">{app.name}</span>
        {app.cash_warning && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            💴 Cash areas
          </span>
        )}
      </div>
      <p className="text-[12.5px] text-moss-muted leading-relaxed">
        {app.reason}
      </p>
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
    <div className="px-5 py-5 flex flex-col gap-5">
      {/* location header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl leading-none">
          {flagEmoji(result.country_code)}
        </span>
        <div>
          <h2 className="text-[20px] font-semibold text-white leading-tight">
            {result.city ?? result.country_name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-moss-glow/10 text-moss-glow border border-moss-glow/20">
              ✦ AI
            </span>
            {result.travel_style && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-moss-darkest border border-moss-muted/20 text-moss-muted capitalize">
                {result.travel_style}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* cash warning */}
      {result.cash_heavy && (
        <div className="flex gap-3 bg-orange-500/8 border border-orange-500/20 rounded-xl p-4">
          <span className="text-[22px] shrink-0">💴</span>
          <div>
            <p className="text-[13px] font-semibold text-orange-400 mb-0.5">
              Cash is king here
            </p>
            <p className="text-[12px] text-moss-muted leading-relaxed">
              Many places don&apos;t take cards — carry local currency.
            </p>
          </div>
        </div>
      )}

      {/* AI insights */}
      {result.ai_insights?.length > 0 && (
        <div className="bg-moss-darkest border-l-[3px] border-moss-glow border border-moss-muted/20 rounded-r-xl px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-moss-glow mb-2">
            ✦ AI insights for your trip
          </p>
          <ul className="flex flex-col gap-2">
            {result.ai_insights.map((insight, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12.5px] text-moss-muted leading-relaxed"
              >
                <span className="text-moss-glow shrink-0 mt-0.5">→</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* app categories */}
      {categories.map(({ key, apps }) => {
        if (!apps?.length) return null;
        const meta = CATEGORY_META[key];
        return (
          <div key={key} className="flex flex-col gap-2">
            {/* category header */}
            <div
              className={`flex items-center gap-2 bg-moss-darkest border border-moss-muted/20 border-l-[3px] ${meta.color} rounded-r-lg px-3 py-2`}
            >
              <span className="text-[16px]">{meta.emoji}</span>
              <span className="text-[13px] font-semibold text-white">
                {meta.label}
              </span>
            </div>
            {/* app rows */}
            {apps.map((app, i) => (
              <AIAppRow key={i} app={app} index={i} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
