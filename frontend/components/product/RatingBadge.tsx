import { Star } from "lucide-react";
import { formatRatingCount } from "@/utils/formatters";

interface RatingBadgeProps {
  rating: number;
  count: number;
}

export default function RatingBadge({ rating, count }: RatingBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded">
        {rating.toFixed(1)}
        <Star className="w-3.5 h-3.5 fill-white" />
      </span>
      <span className="text-sm text-gray-500">{formatRatingCount(count)}</span>
    </div>
  );
}