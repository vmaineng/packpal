import type { LocationResult, RegionAppData } from "../types";

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1` : "/api";

const HEADERS = () => ({
    "Content-Type": "application/json",
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}`,
})


export interface AIAppSuggestion {
  name: string;
  reason: string;
  cash_warning?: boolean;
}

export interface AISearchResult {
  search_id: string;
  country_code: string;
  country_name: string;
  city?: string;
  travel_style?: string;
  cash_heavy: boolean;
  ai_insights: string[];
  transport: AIAppSuggestion[];
  food: AIAppSuggestion[];
  sleep: AIAppSuggestion[];
}


export interface VoteMap {
  [app_id: string]: { accurate: number; inaccurate: number; score: number };
}

export async function fetchVotes(countryCode: string): Promise<VoteMap> {
  const res = await fetch(`${BASE}/vote?country_code=${countryCode}`, { headers: HEADERS() });
  if (!res.ok) return {};
  return res.json();
}


export async function fetchAppsForLocation(
  location: LocationResult
): Promise<RegionAppData & { cached: boolean }> {
  const params = new URLSearchParams({
    country_code: location.country_code,
    place_name: location.place_name,
    lat: location.coordinates[1].toString(),
    lng: location.coordinates[0].toString(),
  });
  if (location.city) params.set("city", location.city);
  const res = await fetch(`${BASE}/get-apps?${params}`, { headers: HEADERS() });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `${res.status}`);
  const data = await res.json();
  return { ...data, cached: res.headers.get("X-Cache") === "HIT" };
}

export async function runAISearch(
  query: string,
  locationContext?: string
): Promise<AISearchResult> {
  const res = await fetch(`${BASE}/ai-search`, {
    method: "POST",
    headers: HEADERS(),
    body: JSON.stringify({ query, location_context: locationContext }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `${res.status}`);
  return res.json();

}

export async function submitVote(
  appId: string,
  countryCode: string,
  voteType: "accurate" | "inaccurate",
  fingerprint: string
): Promise<{ success: boolean; counts?: { accurate_count: number; inaccurate_count: number } }> {
  const res = await fetch(`${BASE}/vote`, {
    method: "POST",
    headers: HEADERS(),
    body: JSON.stringify({ app_id: appId, country_code: countryCode, vote_type: voteType, fingerprint }),
  });
  const data = await res.json();
  if (res.status === 409) return { success: false };
  if (!res.ok) throw new Error(data.error ?? `${res.status}`);
  return data;
}

export async function reverseGeocode(lng: number, lat: number): Promise<LocationResult | null> {
  const token = process.env.MAPBOX_TOKEN || "";
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=country,place`
  );
  const data = await res.json();
  const features = data.features ?? [];
  if (!features.length) return null;
  const place = features[0];
  const countryFeature = features.find((f: any) => f.place_type.includes("country"));
  const cityFeature = features.find((f: any) => f.place_type.includes("place"));
  return {
    place_name: place.place_name,
    country: countryFeature?.text ?? place.text,
    country_code: (countryFeature?.properties?.short_code ?? place.properties?.short_code ?? "UN").toUpperCase(),
    city: cityFeature?.text,
    coordinates: [lng, lat],
  };
}

export async function searchPlaces(query: string): Promise<LocationResult[]> {
  if (!query.trim()) return [];
  const token = process.env.VITE_MAPBOX_TOKEN;
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&types=country,place,region&limit=5`
  );
  const data = await res.json();
  return (data.features ?? []).map((f: any) => {
    const countryCtx = f.context?.find((c: any) => c.id.startsWith("country"));
    const placeCtx = f.context?.find((c: any) => c.id.startsWith("place"));
    return {
      place_name: f.place_name,
      country: countryCtx?.text ?? f.text,
      country_code: (countryCtx?.short_code ?? f.properties?.short_code ?? "UN").toUpperCase(),
      city: placeCtx?.text ?? (f.place_type.includes("place") ? f.text : undefined),
      coordinates: f.center as [number, number],
    };
  });
}

export function getBrowserFingerprint(): string {
  const key = "packpal_fp";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, fp);
  }
  return fp;
}
