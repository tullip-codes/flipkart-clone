"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search, ShoppingCart, User, ChevronDown,
  Package, Heart, LogOut, LogIn,
} from "lucide-react";

import type { Category } from "@/types/product";
import { useAuth } from "@/context/AuthContext";

const STATIC_NAV = [
  { label: "For You",     slug: null },
  { label: "Fashion",     slug: "fashion" },
  { label: "Mobiles",     slug: "electronics" },
  { label: "Beauty",      slug: "beauty" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home",        slug: "home-furniture" },
  { label: "Appliances",  slug: "home-furniture" },
  { label: "Sports",      slug: "sports-fitness" },
  { label: "Furniture",   slug: "home-furniture" },
];

export default function Navbar() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();

  const [search, setSearch]             = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories]     = useState<Category[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Active category_id from URL (kept in sync automatically by useSearchParams)
  const activeCategoryId = searchParams.get("category_id");

  // Load categories once for href resolution
  useEffect(() => {
    import("@/services/api")
      .then(({ categoryApi }) => categoryApi.list())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  }

  function handleLogout() {
    setShowUserMenu(false);
    logout();
    router.push("/");
  }

  // Resolve each nav item to a real href with category_id
  function resolveHref(slug: string | null): string {
    if (!slug) return "/products";
    const cat = categories.find((c) => c.slug === slug);
    return cat ? `/products?category_id=${cat.id}` : "/products";
  }

  // Determine if a nav item is active based on current URL
  function isActive(slug: string | null, index: number): boolean {
    const onProducts = pathname === "/products";

    // "For You" is active when on /products with no category filter
    if (index === 0) {
      return onProducts && !activeCategoryId;
    }

    if (!slug || !onProducts) return false;

    const cat = categories.find((c) => c.slug === slug);
    return !!cat && activeCategoryId === String(cat.id);
  }

  const displayName = user?.full_name?.split(" ")[0] ?? "Account";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md">

      {/* ── Blue top bar ─────────────────────────────────────────────────── */}
      <div className="bg-[#2874F0]">
        <div className="max-w-screen-xl mx-auto px-3 h-14 flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex flex-col items-start mr-2">
            <span className="text-white font-bold text-xl italic tracking-tight leading-none">
              Flipkart
            </span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-[10px] text-[#FFE500] italic">Explore</span>
              <span className="text-[10px] text-white italic font-medium ml-0.5">Plus</span>
              <span className="text-[10px] text-[#FFE500] ml-0.5">+</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex bg-white rounded-sm overflow-hidden h-9">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for Products, Brands and More"
                className="flex-1 px-4 text-sm text-gray-700 outline-none"
              />
              <button
                type="submit"
                className="bg-[#2874F0] px-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-1.5 bg-white text-[#2874F0] px-4 h-9 rounded-sm text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                {isAuthenticated && <User className="w-4 h-4" />}
                <span className="max-w-[80px] truncate">
                  {isAuthenticated ? displayName : "Login"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-11 w-56 bg-white shadow-xl rounded-sm border border-gray-100 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      {[
                        { icon: Package, label: "My Orders",  href: "/orders" },
                        { icon: Heart,   label: "Wishlist",   href: "/wishlist" },
                        { icon: User,    label: "My Profile", href: "/profile" },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link key={label} href={href} onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Icon className="w-4 h-4 text-gray-400" />{label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                          <LogOut className="w-4 h-4" />Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">New customer?</span>
                        <Link href="/auth/signup" onClick={() => setShowUserMenu(false)}
                          className="text-sm text-[#2874F0] font-medium hover:underline">Sign Up</Link>
                      </div>
                      <Link href="/auth/login" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LogIn className="w-4 h-4 text-gray-400" />Login to your account
                      </Link>
                      {[
                        { icon: Package, label: "My Orders", href: "/orders" },
                        { icon: Heart,   label: "Wishlist",  href: "/wishlist" },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link key={label} href={href} onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Icon className="w-4 h-4 text-gray-400" />{label}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            

            <Link href="/cart" className="flex items-center gap-2 text-white px-3 h-9 text-sm font-medium hover:bg-blue-600 rounded-sm transition-colors">
              <ShoppingCart className="w-5 h-5" /><span>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category strip ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-3">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {STATIC_NAV.map((item, i) => {
              const href   = resolveHref(item.slug);
              const active = isActive(item.slug, i);
              return (
                <Link
                  key={`${item.label}-${i}`}
                  href={href}
                  className={`flex-shrink-0 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? "border-[#2874F0] text-[#2874F0]"
                      : "border-transparent text-gray-700 hover:text-[#2874F0] hover:border-[#2874F0]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}