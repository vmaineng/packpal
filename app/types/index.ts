
export type AppCategory = "transport" | "food" | "sleep";

export interface TravelApp {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  icon_url: string;
  app_store_url?: string;
  play_store_url?: string;
  website_url?: string;
  is_cash_only_warning?: boolean; 
  notes?: string; 
}

export interface RegionAppData {
  country_code: string;
  country_name: string;
  city?: string;
  transport: TravelApp[];
  food: TravelApp[];
  sleep: TravelApp[];
  cash_only_regions?: string[]; 
  general_tips?: string[];
}

export interface LocationResult {
  place_name: string;
  country: string;
  country_code: string;
  city?: string;
  coordinates: [number, number]; 
}

export interface SearchState {
  status: "idle" | "searching" | "loading" | "success" | "error";
  location: LocationResult | null;
  apps: RegionAppData | null;
  error: string | null;
  cached: boolean;
}
