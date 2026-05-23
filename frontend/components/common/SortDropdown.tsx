export interface SortValue {
  sort_by: "created_at" | "price" | "rating" | "discount_percent";
  order: "asc" | "desc";
}

const SORT_OPTIONS: { label: string; value: string; sort_by: SortValue["sort_by"]; order: SortValue["order"] }[] = [
  { label: "Newest First",       value: "newest",     sort_by: "created_at",       order: "desc" },
  { label: "Top Rated",          value: "rating",     sort_by: "rating",           order: "desc" },
  { label: "Price: Low to High", value: "price_asc",  sort_by: "price",            order: "asc"  },
  { label: "Price: High to Low", value: "price_desc", sort_by: "price",            order: "desc" },
  { label: "Biggest Discount",   value: "discount",   sort_by: "discount_percent", order: "desc" },
];

interface SortDropdownProps {
  sortBy: SortValue["sort_by"];
  order: SortValue["order"];
  onChange: (val: SortValue) => void;
}

export default function SortDropdown({ sortBy, order, onChange }: SortDropdownProps) {
  const currentValue =
    SORT_OPTIONS.find((o) => o.sort_by === sortBy && o.order === order)?.value ?? "newest";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const opt = SORT_OPTIONS.find((o) => o.value === e.target.value);
    if (opt) onChange({ sort_by: opt.sort_by, order: opt.order });
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
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