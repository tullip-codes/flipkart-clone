"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * SearchBar — debounced controlled input.
 *
 * The component holds its own "local" value to keep the input snappy,
 * then calls onChange after debounceMs of silence. This avoids
 * firing an API request on every keystroke.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search for products, brands and more",
  debounceMs = 400,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state if parent resets the value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: fire onChange after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}