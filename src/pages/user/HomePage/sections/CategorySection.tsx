import { Link } from "react-router-dom";
import { FaDog, FaCat, FaFish, FaBone } from "react-icons/fa";
import type { ReactNode } from "react";

type Category = {
  key: string;
  name: string;
  icon: ReactNode;
  to: string;
  description: string;
};

const categories: Category[] = [
  {
    key: "dogs",
    name: "Dogs",
    icon: <FaDog size={28} />,
    to: "/pet",
    description: "Puppies and adult dogs looking for a home.",
  },
  {
    key: "cats",
    name: "Cats",
    icon: <FaCat size={28} />,
    to: "/pet",
    description: "Adorable kittens and cats to cuddle.",
  },
  {
    key: "fish",
    name: "Fish",
    icon: <FaFish size={28} />,
    to: "/pet",
    description: "Colorful aquarium fish and care guides.",
  },
  {
    key: "supplies",
    name: "Supplies",
    icon: <FaBone size={28} />,
    to: "/production",
    description: "Food, toys, and accessories for every pet.",
  },
];

function CategoryCard({ item }: { item: Category }) {
  return (
    <Link
      to={item.to}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 ring-1 ring-blue-100">
          {item.icon}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-slate-800 group-hover:text-blue-700">
            {item.name}
          </div>
          <div className="mt-1 text-sm text-slate-500 line-clamp-2">
            {item.description}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategorySection() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Browse by category
        </h2>
        <Link to="/production" className="text-blue-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.key} item={c} />
        ))}
      </div>
    </section>
  );
}

