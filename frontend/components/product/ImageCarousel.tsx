"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  title: string;
}

/**
 * ImageCarousel — left thumbnail strip + large main image, Flipkart-style.
 *
 * Accessibility: keyboard-navigable thumbnails, proper alt text.
 * Performance: only the active image is visible; others stay in DOM for instant switching.
 */
export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Normalise: always at least one image
  const allImages = images.length > 0 ? images : ["/placeholder-product.png"];

  const prev = () => setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="flex gap-3 sticky top-20">
      {/* ── Thumbnail strip (visible when > 1 image) ──────────────────────── */}
      {allImages.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
          {allImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 transition-colors ${
                i === activeIndex ? "border-blue-600" : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${title} — view ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main image ────────────────────────────────────────────────────── */}
      <div className="relative flex-1 aspect-square bg-white border border-gray-100 rounded overflow-hidden group">
        <Image
          src={allImages[activeIndex]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6"
          priority
        />

        {/* Navigation arrows — only when multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Dot indicators for mobile */}
        {allImages.length > 1 && (
          <div className="sm:hidden absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}