import { Link } from "react-router-dom";

export default function SliderHome() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 md:p-12 border border-gray-200">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="relative max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Everything for your beloved pets
        </h1>
        <p className="mt-4 text-slate-600 md:text-lg">
          Discover adorable pets, quality supplies, and friendly services — all
          in one place.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/pet"
            className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow-sm hover:bg-blue-700 hover:shadow-md transition"
          >
            Explore Pets
          </Link>
          <Link
            to="/production"
            className="rounded-xl bg-white px-5 py-3 font-medium text-blue-700 border border-blue-200 hover:bg-blue-50 hover:shadow-sm transition"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </section>
  );
}
