import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Flipkart
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart">Cart</Link>
        </div>
      </div>
    </nav>
  );
}