"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { MainMap } from "./components/MainMap";
import { useAppSearch } from "./hooks/useAppSearch";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Mode = "map" | "ai";

export default function Home() {
  const [mode, setMode] = useState<Mode>("map");
  const { handleMapClick, state } = useAppSearch();

  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        <div>
          <button
            className={`mode-tab ${mode === "map" ? "active" : ""}`}
            onClick={() => setMode("map")}
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Map search
          </button>
        </div>
        <button
          className={`mode-tab ${mode === "ai" ? "active" : ""}`}
          onClick={() => setMode("ai")}
        >
          <span>Ask AI</span>
        </button>
        <MainMap
          onMapClick={(lng, lat) => {
            if (mode === "ai") setMode("map");
            handleMapClick(lng, lat);
          }}
          selectedCoords={state.location?.coordinates ?? null}
        />
      </div>
    </ErrorBoundary>
  );
}
