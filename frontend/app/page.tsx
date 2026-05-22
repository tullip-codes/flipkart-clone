/**
 * app/page.tsx — Homepage (Server Component)
 */

import { categoryApi, productApi } from "@/services/api";
import HeroBanner from "@/components/layout/HeroBanner";
import CategorySection from "@/components/layout/CategorySection";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

const DEAL_TILES = [
  {
    label: "Up to 25% Off",
    sublabel: "Beauty & Skincare",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop&q=85",
    href: "/products",
    bg: "#006838",
  },
  {
    label: "Min. 70% Off",
    sublabel: "Sports & Fitness",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=300&fit=crop&q=85",
    href: "/products",
    bg: "#EF6C00",
  },
  {
    label: "Up to 70% Off",
    sublabel: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=300&fit=crop&q=85",
    href: "/products",
    bg: "#1A237E",
  },
  {
    label: "Min. 40% Off",
    sublabel: "Electronics",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop&q=85",
    href: "/products",
    bg: "#880E4F",
  },
];

async function getHomeData() {
  try {
    const [categories, featuredProducts] = await Promise.all([
      categoryApi.list(),
      productApi.getFeatured(10),
    ]);
    return { categories, featuredProducts };
  } catch {
    return { categories: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#F1F3F6]">

      {/* ── Hero Banner — full width ───────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto">
        <HeroBanner />
      </div>

      {/* ── Deal tiles grid — like Flipkart's ad row below banner ─────────── */}
      <div className="max-w-screen-xl mx-auto mt-2 px-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEAL_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="relative rounded overflow-hidden group"
              style={{ height: "160px" }}
            >
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/20" />
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ backgroundColor: tile.bg }}
              >
                <p className="text-white text-sm font-bold leading-tight">{tile.label}</p>
                <p className="text-white/80 text-xs">{tile.sublabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Category strip ─────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="max-w-screen-xl mx-auto mt-2">
          <CategorySection categories={categories} />
        </div>
      )}

      {/* ── Featured products ──────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto mt-3 px-2">
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link
              href="/products"
              className="text-sm text-[#2874F0] font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} skeletonCount={10} />
        </div>
      </section>

      {/* ── Trust badges ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto mt-3 px-2 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹499" },
            { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
            { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout" },
          ].map((item) => (
            <div key={item.title} className="bg-white shadow-sm flex items-center gap-3 px-4 py-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}