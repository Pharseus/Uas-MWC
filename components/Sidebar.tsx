"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LucideBookOpen,
  LucideSearch,
  LucideCheckCircle,
  LucideFlame,
  LucideSparkles,
  LucideMenu,
  LucideX,
  LucideClipboardList,
} from "lucide-react";

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  onFilterChange: (filters: {
    available: boolean;
    popular: boolean;
    new: boolean;
  }) => void;
  filters: { available: boolean; popular: boolean; new: boolean };
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export default function Sidebar({
  onCategoryChange,
  onFilterChange,
  filters,
  searchTerm,
  onSearchChange,
}: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r || "");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked });
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    onCategoryChange(cat);
    setIsOpen(false);
  };

  const categories = ["Semua", "Fiksi", "Nonfiksi", "Sains", "Sejarah", "Teknologi"];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed right-4 top-4 z-40 flex items-center justify-center rounded-md bg-blue-700 p-2 text-white shadow md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Buka menu sidebar"
      >
        <LucideMenu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          z-40 w-64 text-white p-6 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg
          transform transition-transform duration-300 ease-out overflow-y-auto
          fixed inset-y-0 right-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}

          md:sticky md:top-0 md:left-0 md:right-auto md:translate-x-0 md:inset-y-auto md:h-screen md:z-auto md:border-r md:border-blue-800
        `}
      >
        {/* Close Button */}
        <div className="mb-4 flex justify-end md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-400"
            aria-label="Tutup sidebar"
          >
            <LucideX size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 rounded-lg bg-blue-800/60 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
          <LucideSearch size={18} className="text-blue-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari buku..."
            className="w-full bg-transparent text-sm placeholder:text-blue-300 focus:outline-none"
          />
        </div>

        {/* Kategori */}
        <div className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <LucideBookOpen size={16} /> Kategori
          </h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`cursor-pointer rounded-lg px-4 py-2 transition ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-600 font-bold"
                    : "hover:bg-blue-700/50"
                }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Filter */}
        <div className="mt-10">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Filter
          </h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between rounded-lg bg-blue-800/30 px-3 py-2 hover:bg-blue-700/30">
              <span className="flex items-center gap-2 text-sm">
                <LucideCheckCircle className="text-green-400" size={16} />
                Tersedia
              </span>
              <input
                type="checkbox"
                name="available"
                checked={filters.available}
                onChange={handleFilter}
                className="h-5 w-5 accent-green-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg bg-blue-800/30 px-3 py-2 hover:bg-blue-700/30">
              <span className="flex items-center gap-2 text-sm">
                <LucideFlame className="text-yellow-400" size={16} />
                Populer
              </span>
              <input
                type="checkbox"
                name="popular"
                checked={filters.popular}
                onChange={handleFilter}
                className="h-5 w-5 accent-yellow-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-lg bg-blue-800/30 px-3 py-2 hover:bg-blue-700/30">
              <span className="flex items-center gap-2 text-sm">
                <LucideSparkles className="text-blue-400" size={16} />
                Baru
              </span>
              <input
                type="checkbox"
                name="new"
                checked={filters.new}
                onChange={handleFilter}
                className="h-5 w-5 accent-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Admin Only: Lihat Permintaan Peminjaman */}
        {role === "admin" && (
          <div className="mt-10">
            <button
              onClick={() => router.push("/account/admin/HandleRequestBook")}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold shadow hover:bg-blue-800"
            >
              <LucideClipboardList size={18} />
              Lihat Permintaan
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
