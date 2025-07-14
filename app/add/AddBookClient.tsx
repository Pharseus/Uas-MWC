"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LucideCheckCircle,
  LucideFlame,
  LucideSparkles,
  LucideArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const categories = ["Fiksi", "Non-Fiksi", "Sains", "Sejarah", "Teknologi"];

interface OpenLibraryDoc {
  isbn?: string[];
  cover_i?: number;
}

export default function AddBookClient() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    available: true,
    isNew: false,
    isPopular: false,
    cover: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showCat, setShowCat] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Judul tidak boleh kosong";
    if (!form.author.trim()) return "Penulis tidak boleh kosong";
    if (!form.category) return "Kategori harus dipilih";
    if (!/^https?:\/\/.+/.test(form.cover)) return "URL cover tidak valid";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) return setError(vErr);
    setError(null);
    await fetch("https://686ca35014219674dcc8966f.mockapi.io/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/account/admin");
  };

  const getCoverFromOpenLibrary = async (title: string, author: string) => {
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
      );
      const data = await res.json();
      const doc = data?.docs?.find((d: OpenLibraryDoc) => (Array.isArray(d.isbn) && d.isbn.length > 0) || !!d.cover_i);


      if (!doc) {
        return null;
      }

      if (doc.isbn?.[0]) {
        return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
      } else if (doc.cover_i) {
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      }
    } catch (error) {
      console.error("Gagal mengambil cover:", error);
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-xl border border-blue-100 bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80"
    >
      <motion.button
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="group mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white/60 px-4 py-2 text-sm font-medium text-blue-600 shadow-md backdrop-blur-sm transition hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-700/40 dark:text-indigo-200 dark:hover:bg-slate-600"
      >
        <LucideArrowLeft
          size={18}
          className="transition-transform group-hover:-translate-x-1"
        />
        <span className="group-hover:underline">Kembali</span>
      </motion.button>

      <h1 className="mb-6 text-center text-4xl font-extrabold text-blue-700 dark:text-indigo-200">
        📚 Tambah Buku Baru
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-800/40 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-blue-800 dark:text-slate-200">
            Judul Buku
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-400"
            placeholder="Contoh: Laskar Pelangi"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-blue-800 dark:text-slate-200">
            Penulis
          </label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-400"
            placeholder="Contoh: Andrea Hirata"
          />
        </div>

        <div className="relative">
          <label className="mb-2 block text-sm font-semibold text-blue-800 dark:text-slate-200">
            Kategori
          </label>
          <button
            type="button"
            onClick={() => setShowCat(!showCat)}
            className="flex w-full items-center justify-between rounded-md border border-blue-200 px-4 py-3 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-400"
          >
            {form.category || "-- Pilih Kategori --"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${showCat ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCat && (
            <motion.ul
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-blue-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700"
            >
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setForm((p) => ({ ...p, category: cat }));
                    setShowCat(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 dark:text-white dark:hover:bg-slate-600"
                >
                  {cat}
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-blue-800 dark:text-slate-200">
            URL Cover Buku
          </label>
          <input
            name="cover"
            value={form.cover}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-400"
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={async () => {
              if (form?.title && form?.author) {
                const coverUrl = await getCoverFromOpenLibrary(form.title, form.author);
                if (coverUrl) {
                  setForm({ ...form, cover: coverUrl });
                } else {
                  setForm({ ...form, cover: "" });
                  alert("Cover tidak ditemukan.");
                }
              } else {
                alert("Isi judul dan penulis terlebih dahulu.");
              }
            }}
            className="text-sm text-blue-500 underline ml-2 mt-1"
          >
            🔍 Cari Cover Otomatis
          </button>

          {form.cover && (
            <div className="mt-2">
              <Image
                src={form.cover}
                alt="Preview Cover"
                width={128}
                height={192}
                className="rounded border object-cover"
                onError={(e) => {
                  console.error("❌ Gagal memuat gambar:", form.cover);
                  e.currentTarget.style.border = "2px solid red";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-blue-800 dark:text-slate-200">
            Deskripsi Buku
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md border border-blue-200 px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-indigo-400"
            placeholder="Tuliskan ringkasan isi buku..."
          ></textarea>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {[
            {
              name: "available",
              label: "Tersedia",
              icon: <LucideCheckCircle size={16} />,
              color: "green",
            },
            {
              name: "isNew",
              label: "Baru",
              icon: <LucideSparkles size={16} />,
              color: "blue",
            },
            {
              name: "isPopular",
              label: "Populer",
              icon: <LucideFlame size={16} />,
              color: "yellow",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="group relative flex cursor-pointer items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              <input
                type="checkbox"
                name={item.name}
                checked={form[item.name as keyof typeof form] as boolean}
                onChange={handleChange}
                className="peer sr-only"
              />
              {item.icon}
              <span className="peer-checked:font-semibold peer-checked:text-green-600">
                {item.label}
              </span>
              <span
                className={`absolute inset-0 -z-10 rounded-full opacity-0 peer-checked:animate-ping peer-checked:opacity-30 ${
                  item.color === "green"
                    ? "bg-green-100"
                    : item.color === "blue"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                }`}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-xl dark:from-blue-700 dark:via-indigo-700 dark:to-blue-600"
        >
          Simpan Buku
        </button>
      </form>
    </motion.div>
  );
}
