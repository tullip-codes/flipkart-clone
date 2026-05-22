import type { SortOption } from "@/types/product";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "created_at", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
  { value: "price", label: "Price: Low to High" },
  { value: "discount_percent", label: "Biggest Discount" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}