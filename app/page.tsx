"use client";
import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import { MainMap } from "./components/MainMap";
import { useAppSearch } from "./hooks/useAppSearch";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SearchBar } from "./components/SearchBar";
import type { LocationResult } from "./types";

type Mode = "map" | "ai";

export default function Home() {
  const [mode, setMode] = useState<Mode>("map");
  const {
    handleMapClick,
    state,
    suggestions,
    searchLocation,
    handleSearch,
    clearSuggestions,
  } = useAppSearch();

  const handleSelect = useCallback(
    (loc: LocationResult) => {
      clearSuggestions();
      searchLocation(loc);
    },
    [searchLocation, clearSuggestions],
  );

  const isLoading = state.status === "searching" || state.status === "loading";

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-moss-darkest overflow-hidden">
        <Navbar />

        {/* main content — sidebar + map */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Sidebar ── */}
          <aside className="w-[380px] shrink-0 flex flex-col bg-moss-dark border-r border-moss-muted/20 overflow-hidden">
            {/* top: logo + tabs + search controls */}
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
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[7px] text-[12px] font-medium transition-all duration-150
                    ${
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
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[7px] text-[12px] font-medium transition-all duration-150
                    ${
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

              {/* map mode controls */}
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

              {/* ai mode controls */}
              {mode === "ai" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-moss-glow/10 text-moss-glow border border-moss-glow/20">
                      ✦ AI
                    </span>
                    <span className="text-[13px] text-moss-accent">
                      Tell me about your trip
                    </span>
                  </div>
                  <textarea
                    placeholder="e.g. I'm backpacking Thailand for 3 weeks on a budget..."
                    rows={3}
                    className="w-full bg-moss-darkest border border-moss-muted/20 rounded-xl px-3 py-3 text-[13px] text-white placeholder:text-moss-muted resize-none outline-none focus:border-moss-glow/40 focus:ring-1 focus:ring-moss-glow/10 transition-all"
                  />
                  <button className="self-end flex items-center gap-1.5 bg-moss-glow hover:bg-moss-glow/90 text-moss-darkest text-[12px] font-bold py-2 px-4 rounded-lg transition-colors">
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
                  </button>

                  {/* example chips */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {[
                      "Backpacking SE Asia",
                      "Tokyo fine dining",
                      "Solo Bali trip",
                      "London family trip",
                    ].map((ex) => (
                      <button
                        key={ex}
                        className="text-[10px] px-2.5 py-1 bg-moss-darkest border border-moss-muted/20 text-moss-muted rounded-full hover:border-moss-accent/40 hover:text-moss-accent transition-all"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Map pane ── */}
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
