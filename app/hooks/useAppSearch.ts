import { useState, useCallback } from "react";
import { fetchAppsForLocation, reverseGeocode, searchPlaces } from "../lib/api";
import type { LocationResult, SearchState } from "../types";

export function useAppSearch() {
  const [state, setState] = useState<SearchState>({
    status: "idle",
    location: null,
    apps: null,
    error: null,
    cached: false,
  });

  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);

  const searchLocation = useCallback(async (location: LocationResult) => {
    setState({ status: "loading", location, apps: null, error: null, cached: false });
    try {
      const apps = await fetchAppsForLocation(location);
      setState({
        status: "success",
        location,
        apps,
        error: null,
        cached: apps.cached,
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        status: "error",
        error: err.message ?? "Failed to load recommendations",
      }));
    }
  }, []);

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      setState((s) => ({ ...s, status: "searching" }));
      const location = await reverseGeocode(lng, lat);
      if (!location) {
        setState((s) => ({ ...s, status: "error", error: "Could not identify location" }));
        return;
      }
      await searchLocation(location);
    },
    [searchLocation]
  );

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const results = await searchPlaces(query);
    setSuggestions(results);
  }, []);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return {
    state,
    suggestions,
    searchLocation,
    handleMapClick,
    handleSearch,
    clearSuggestions,
  };
}
