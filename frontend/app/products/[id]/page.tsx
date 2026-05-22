import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productApi } from "@/services/api";
import ImageCarousel from "@/components/product/ImageCarousel";
import ProductActions from "@/components/product/ProductActions";
import RatingBadge from "@/components/product/RatingBadge";
import SpecificationsTable from "@/components/product/SpecificationsTable";
import {
  formatPrice,
  stockStatus,
  parseSpecifications,
  savingsAmount,
} from "@/utils/formatters";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await productApi.getById(Number(params.id));
    return { title: `${product.title} | Flipkart Clone` };
  } catch {
    return { title: "Product Not Found" };
  }
}

/**
 * ProductDetailPage — server component.
 *
 * Fetches product on the server for SEO + fast first paint.
 * ProductActions is extracted as a client component for Add-to-Cart / Buy Now buttons.
 */
export default async function ProductDetailPage({ params }: Props) {
  let product;
  try {
    product = await productApi.getById(Number(params.id));
  } catch {
    notFound();
  }

  const allImages = product.images?.length ? product.images : product.image_url ? [product.image_url] : [];
  const specs = parseSpecifications(product.specifications);
  const stock = stockStatus(product.stock);
  const savings = product.original_price ? savingsAmount(product.original_price, product.price) : 0;

  return (
    <main className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4">

        {/* Breadcrumb  */}
        <nav className="text-xs text-gray-500 mb-3">
          <a href="/" className="hover:text-blue-600">Home</a>
          {" › "}
          <a href="/products" className="hover:text-blue-600">Products</a>
          {product.category && (
            <>
              {" › "}
              <a href={`/products?category_id=${product.category.id}`} className="hover:text-blue-600">
                {product.category.name}
              </a>
            </>
          )}
          {" › "}
          <span className="text-gray-700 truncate">{product.title}</span>
        </nav>

        {/* Main card  */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">

            {/* Left: Image carousel  */}
            <div className="lg:col-span-2 p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <ImageCarousel images={allImages} title={product.title} />
            </div>

            {/* Right: Product info  */}
            <div className="lg:col-span-3 p-5 flex flex-col gap-4">

              {/* Brand + Title */}
              {product.brand && (
                <p className="text-sm text-blue-600 font-medium">{product.brand}</p>
              )}
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <RatingBadge rating={product.rating} count={product.rating_count} />
              )}

              <hr className="border-gray-100" />

              {/* Pricing block */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {product.discount_percent > 0 && (
                    <span className="text-base font-semibold text-green-600">
                      {product.discount_percent}% off
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <p className="text-sm text-green-600">
                    You save {formatPrice(savings)}
                  </p>
                )}

                <p className="text-xs text-gray-400">Inclusive of all taxes</p>
              </div>

              {/* Delivery info */}
              <div className="flex items-start gap-2 text-sm">
                <span className="text-gray-500 min-w-[100px] font-medium">Delivery</span>
                <span className="text-gray-800">
                  <span className="font-semibold text-green-700">FREE</span> delivery by{" "}
                  <span className="font-medium">
                    {new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 min-w-[100px] font-medium">Availability</span>
                <span
                  className={`font-semibold ${
                    stock.level === "out"
                      ? "text-red-600"
                      : stock.level === "low"
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {stock.label}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* CTA buttons — client component handles cart/buy logic */}
              <ProductActions product={product} />

              {/* Description */}
              {product.description && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">About this item</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications  */}
        {Object.keys(specs).length > 0 && (
          <div className="bg-white rounded-sm shadow-sm mt-4 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Specifications</h2>
            <SpecificationsTable specs={specs} />
          </div>
        )}

      </div>
    </main>
  );
}