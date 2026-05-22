"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// High-quality banner images — product/lifestyle focused like real Flipkart banners
const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=400&fit=crop&q=90",
    href: "/products",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&h=400&fit=crop&q=90",
    href: "/products",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=400&fit=crop&q=90",
    href: "/products",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop&q=90",
    href: "/products",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=400&fit=crop&q=90",
    href: "/products",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(
    () => setCurrent((i) => (i === BANNERS.length - 1 ? 0 : i + 1)),
    []
  );
  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? BANNERS.length - 1 : i - 1)),
    []
  );

  // Pause auto-advance on hover
  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [isHovered, next]);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-300"
      style={{ height: "280px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {BANNERS.map((banner, i) => (
        <Link
          key={banner.id}
          href={banner.href}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          tabIndex={i === current ? 0 : -1}
        >
          <Image
            src={banner.image}
            alt={`Promotional banner ${banner.id}`}
            fill
            sizes="(max-width: 1280px) 100vw, 1060px"
            className="object-cover object-center"
            priority={i === 0}
            quality={90}
          />
        </Link>
      ))}

      {/* Prev/Next arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute left-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 transition-all"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-6 h-6 text-white drop-shadow" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute right-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-l from-black/30 to-transparent hover:from-black/50 transition-all"
        aria-label="Next banner"
      >
        <ChevronRight className="w-6 h-6 text-white drop-shadow" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-5 h-1.5" : "bg-white/50 w-1.5 h-1.5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}