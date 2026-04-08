"use client";

import { useState, useRef, useEffect } from "react";
import type { LocationResult } from "../types";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onSelect: (location: LocationResult) => void;
    suggestions: LocationResult[];
    onClearSuggestions = () => void;
    isLoading: boolean;
}

export function SearchBar({
    onSearch,
    onSelect,
    suggestions,
    onClearSuggestions,
    isLoading
}: SearchBarProps) {
    const [value, setValue] = useState("")
    const [isFocused, setIsFocused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement) => {
        const v = e.target.value;
        setValue(v);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onSearch(v), 300)
    }

    const handleSelect = (loc: LocationResult) => {
        setValue(loc.place_name)
        onClearSuggestions();
        onSelect(loc);
    }

    useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClearSuggestions();
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClearSuggestions]);

  const showDropdown = isFocused && suggestions.length > 0;
}
