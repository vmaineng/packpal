import {useState, useCallback} from 'react';
import type { LocationResult, SearchState } from "../types";

export function useAppSearch() {
  const [searchState, setSearchState] = useState<SearchState>({
       status: "idle",
    location: null,
    apps: null,
    error: null,
    cached: false,
  });

  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);

  const searchLocation = useCallback(async (location: LocationResult) => {
    setSearchState({ status: "loading", location, apps: null, error: null, cached: false });
    try {
      const apps = await fetchAppsForLocation(location);
      setSearchState({
        status: "success",
        location,
        apps,
        error: null,
        cached: apps.cached,
      });
    } catch (err: any) {
      setSearchState((s) => ({
        ...s,
        status: "error",
        error: err.message ?? "Failed to load recommendations",
      }));
    }
  }, []);

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
        setSearchState((s) => ({...s, status:"searching"}));
        const location = await reverseGeocode(lng, lat);
       if (!location) {
        setSearchState((s) => ({ ...s, status: "error", error: "Could not identify location" }));
        return;
      }
      await searchLocation(location);
    }
    [searchLocation]
  );

}