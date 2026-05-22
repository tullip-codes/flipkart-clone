export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-500">
      <div className="rounded-xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-red-500">
          Tailwind Working Successfully 🚀
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Flipkart Clone Setup Ready
        </p>

        <button className="mt-6 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
          Continue Setup
        </button>
      </div>
    </main>
  );
}