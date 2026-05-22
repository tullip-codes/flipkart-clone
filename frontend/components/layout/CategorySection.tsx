import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/product";

interface CategorySectionProps {
  categories: Category[];
}

// Real category images mapped by slug
const CATEGORY_IMAGES: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80",
  "home-furniture": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80",
  books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80",
  "sports-fitness": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80",
};

export default function CategorySection({ categories }: CategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-stretch divide-x divide-gray-100 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const imgSrc = CATEGORY_IMAGES[cat.slug] ?? "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80";
            return (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 py-4 px-5 group hover:text-blue-600 transition-colors min-w-[100px]"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-medium text-center text-gray-700 group-hover:text-blue-600 leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}