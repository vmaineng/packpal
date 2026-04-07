"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { MainMap } from "./components/MainMap";
import { useAppSearch } from "./hooks/useAppSearch";

type Mode = "map" | "ai";

export default function Home() {
  const [mode, setMode] = useState<Mode>("map");
  const { handleMapClick, state } = useAppSearch();

  return (
    <div>
      <Navbar />
      <MainMap
        onMapClick={(lng, lat) => {
          if (mode === "ai") setMode("map");
          handleMapClick(lng, lat);
        }}
        selectedCoords={state.location?.coordinates ?? null}
      />
    </div>
  );
}
