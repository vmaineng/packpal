import { useState, useRef, useEffect } from "react";
import type { LocationResult } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (location: LocationResult) => void;
  suggestions: LocationResult[];
  onClearSuggestions: () => void;
  isLoading: boolean;
}

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e0 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...cp);
}

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className="animate-spin"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export function SearchBar({
  onSearch,
  onSelect,
  suggestions,
  onClearSuggestions,
  isLoading,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(v), 300);
  };

  const handleSelect = (loc: LocationResult) => {
    setValue(loc.place_name);
    onClearSuggestions();
    onSelect(loc);
    setIsFocused(false);
  };

  const handleClear = () => {
    setValue("");
    onClearSuggestions();
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClearSuggestions();
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClearSuggestions]);

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* input row */}
      <div
        className={`flex items-center gap-2.5 px-3 h-10 rounded-xl border bg-moss-darkest transition-all duration-150 ${
          isFocused
            ? "border-moss-glow/30 shadow-[0_0_0_3px_rgba(162,255,134,0.06)]"
            : "border-moss-muted/20 hover:border-moss-muted/35"
        }`}
      >
        {/* icon */}
        <span
          className={`shrink-0 transition-colors duration-150 ${isFocused ? "text-moss-glow/60" : "text-moss-muted/50"}`}
        >
          {isLoading ? <SpinnerIcon /> : <SearchIcon />}
        </span>

        {/* input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search any city or country…"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-[13px] text-white placeholder:text-moss-muted/40 outline-none min-w-0"
        />

        {/* clear button */}
        {value && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-moss-muted/20 text-moss-muted/60 hover:bg-moss-muted/35 hover:text-white transition-all text-[13px] leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* dropdown */}
      {showDropdown && (
        <ul className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-moss-dark border border-moss-muted/20 rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          {suggestions.map((loc, i) => (
            <li key={i}>
              <button
                onMouseDown={() => handleSelect(loc)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-moss-muted/10 transition-colors ${
                  i !== 0 ? "border-t border-moss-muted/10" : ""
                }`}
              >
                {/* flag */}
                <span className="text-[18px] leading-none shrink-0">
                  {flagEmoji(loc.country_code)}
                </span>

                {/* text */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[12.5px] font-semibold text-white leading-tight truncate">
                    {loc.city ?? loc.country}
                  </span>
                  <span className="text-[11px] text-moss-muted/60 leading-tight truncate">
                    {loc.place_name}
                  </span>
                </div>

                {/* arrow hint */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="shrink-0 ml-auto text-moss-muted/30"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
