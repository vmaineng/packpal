"use client";
import { useState, useRef } from "react";
import { runAISearch } from "../lib/api";
import type { AISearchResult } from "../lib/api";

interface AISearchPanelProps {
  locationContext?: string;
  onResult: (result: AISearchResult) => void;
}

export function AISearchPanel({
  locationContext,
  onResult,
}: AISearchPanelProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState(".");
  const dotsRef = useRef<ReturnType<typeof setInterval>>();

  const startDots = () => {
    let count = 1;
    dotsRef.current = setInterval(() => {
      count = (count % 3) + 1;
      setDots(".".repeat(count));
    }, 400);
  };

  const stopDots = () => {
    clearInterval(dotsRef.current);
    setDots(".");
  };

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    startDots();
    try {
      const result = await runAISearch(query, locationContext);
      onResult(result);
      setQuery("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "AI search failed";
      setError(msg);
    } finally {
      setLoading(false);
      stopDots();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* header */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-moss-glow/10 text-moss-glow border border-moss-glow/20">
          ✦ AI
        </span>
        <span className="text-[13px] text-moss-accent">
          Tell me about your trip
        </span>
      </div>

      {/* textarea + submit */}
      <div className="relative">
        <textarea
          placeholder="e.g. I'm backpacking Southeast Asia for a month on a budget..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={3}
          disabled={loading}
          className="w-full bg-moss-darkest border border-moss-muted/20 rounded-xl px-3 pt-3 pb-10 text-[13px] text-white placeholder:text-moss-muted resize-none outline-none focus:border-moss-glow/40 focus:ring-1 focus:ring-moss-glow/10 transition-all disabled:opacity-60"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          className={`absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
            loading
              ? "bg-moss-muted/20 text-moss-muted border border-moss-muted/20 cursor-not-allowed"
              : "bg-moss-glow hover:bg-moss-glow/90 text-moss-darkest disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="tracking-wide">Thinking{dots}</span>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Ask AI
            </>
          )}
        </button>
      </div>

      {/* error message */}
      {error && (
        <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      {/* example chips */}
    </div>
  );
}
