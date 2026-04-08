import { useState, useRef, useEffect } from "react";
import type { LocationResult } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (location: LocationResult) => void;
  suggestions: LocationResult[];
  onClearSuggestions: () => void;
  isLoading: boolean;
}

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
  };

  // Close on outside click
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
    <div ref={wrapperRef} className="search-wrapper">
      <div className="search-input-row">
        <span className="search-icon">
          {isLoading ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )}
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search any city or country..."
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button
            className="clear-btn"
            onClick={() => {
              setValue("");
              onClearSuggestions();
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {showDropdown && (
        <ul className="suggestions-list">
          {suggestions.map((loc, i) => (
            <li
              key={i}
              className="suggestion-item"
              onMouseDown={() => handleSelect(loc)}
            >
              <span className="suggestion-flag">
                {flagEmoji(loc.country_code)}
              </span>
              <div className="suggestion-text">
                <span className="suggestion-primary">
                  {loc.city ?? loc.country}
                </span>
                <span className="suggestion-secondary">{loc.place_name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function flagEmoji(code: string) {
  if (!code || code.length !== 2) return "🌍";
  const cp = [...code.toUpperCase()].map((c) => 0x1f1e0 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...cp);
}
