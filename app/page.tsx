"use client";
import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import { MainMap } from "./components/MainMap";
import { useAppSearch } from "./hooks/useAppSearch";
import { useVotes } from "./hooks/useVotes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SearchBar } from "./components/SearchBar";
import { ResultsPanel } from "./components/ResultsPanel";
import { AISearchPanel } from "./components/AISearchPanel";
import { AIResultsPanel } from "./components/AIResultsPanel";
import type { LocationResult } from "./types";
import type { AISearchResult } from "./lib/api";

type Mode = "map" | "ai";

export default function Home() {
  const [mode, setMode] = useState<Mode>("map");
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);

  const {
    handleMapClick,
    state,
    suggestions,
    searchLocation,
    handleSearch,
    clearSuggestions,
  } = useAppSearch();

  const { voteMap, userVotes, loadVotes, castVote } = useVotes();

  const handleSelect = useCallback(
    (loc: LocationResult) => {
      clearSuggestions();
      searchLocation(loc);
    },
    [searchLocation, clearSuggestions],
  );

  const handleAIResult = (result: AISearchResult) => {
    setAiResult(result);
    if (result.country_code) loadVotes(result.country_code);
  };

  const isLoading = state.status === "searching" || state.status === "loading";
  const locationContext = state.location?.place_name;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-moss-darkest overflow-hidden">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar ── */}
          <aside className="w-[380px] shrink-0 flex flex-col bg-moss-dark border-r border-moss-muted/20 overflow-hidden">
            {/* top controls — pinned, never scrolls */}
            <div className="px-5 pt-5 pb-4 border-b border-moss-muted/20 shrink-0">
              {/* logo */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">🎒</span>
                <div>
                  <p className="text-[19px] font-semibold text-moss-glow tracking-tight leading-none">
                    PackPal
                  </p>
                  <p className="text-[10px] text-moss-muted uppercase tracking-widest mt-0.5">
                    Your travel app guide
                  </p>
                </div>
              </div>

              {/* mode tabs */}
              <div className="flex gap-1 bg-moss-darkest border border-moss-muted/20 rounded-[10px] p-1 mb-4">
                <button
                  onClick={() => setMode("map")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[7px] text-[12px] font-medium transition-all duration-150 ${
                    mode === "map"
                      ? "bg-moss-muted/30 text-white border border-moss-muted/30"
                      : "text-moss-muted hover:text-moss-accent"
                  }`}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Map search
                </button>
                <button
                  onClick={() => setMode("ai")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[7px] text-[12px] font-medium transition-all duration-150 ${
                    mode === "ai"
                      ? "bg-moss-muted/30 text-white border border-moss-muted/30"
                      : "text-moss-muted hover:text-moss-accent"
                  }`}
                >
                  <span
                    className={`text-[13px] ${mode === "ai" ? "text-moss-glow" : "text-moss-accent"}`}
                  >
                    ✦
                  </span>
                  Ask AI
                </button>
              </div>

              {/* map mode: search bar + hint */}
              {mode === "map" && (
                <div className="flex flex-col gap-2">
                  <SearchBar
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    suggestions={suggestions}
                    onClearSuggestions={clearSuggestions}
                    isLoading={isLoading}
                  />
                  <p className="flex items-center gap-1.5 text-[11px] text-moss-muted">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Or click anywhere on the globe
                  </p>
                </div>
              )}

              {/* ai mode: query input */}
              {mode === "ai" && (
                <AISearchPanel
                  locationContext={locationContext}
                  onResult={handleAIResult}
                />
              )}
            </div>

            {/* scrollable results */}
            <div className="flex-1 overflow-y-auto">
              <ErrorBoundary>
                {mode === "map" && (
                  <ResultsPanel
                    state={state}
                    voteMap={voteMap}
                    userVotes={userVotes}
                    castVote={castVote}
                  />
                )}

                {mode === "ai" &&
                  (aiResult ? (
                    <AIResultsPanel result={aiResult} />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-6 py-14 gap-3">
                      <span className="text-[40px] text-moss-accent leading-none">
                        ✦
                      </span>
                      <h3 className="text-[16px] font-semibold text-white">
                        Ask me anything
                      </h3>
                      <p className="text-[13px] text-moss-muted leading-relaxed max-w-[260px]">
                        Describe your trip and I'll recommend apps tailored to
                        your style and budget.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mt-1">
                        {[
                          "3 weeks in Japan, foodie",
                          "Backpacking SE Asia on $30/day",
                          "Family trip to London",
                        ].map((ex) => (
                          <span
                            key={ex}
                            className="text-[11px] px-3 py-1 bg-moss-darkest border border-moss-muted/20 text-moss-muted rounded-full"
                          >
                            "{ex}"
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </ErrorBoundary>
            </div>
          </aside>

          {/* ── Map ── */}
          <main className="flex-1 relative overflow-hidden">
            <MainMap
              onMapClick={(lng, lat) => {
                if (mode === "ai") setMode("map");
                handleMapClick(lng, lat);
              }}
              selectedCoords={state.location?.coordinates ?? null}
            />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
