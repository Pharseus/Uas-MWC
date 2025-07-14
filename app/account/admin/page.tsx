"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import BookCard from "@/components/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  isNew: boolean;
  isPopular: boolean;
  cover: string;
  description: string;
}

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [filters, setFilters] = useState({
    available: false,
    popular: false,
    new: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const r = localStorage.getItem("role");
    const u = localStorage.getItem("username");
    if (!r) router.replace("/Login");
    else {
      setRole(r);
      setUsername(u || "");
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    fetch("https://686ca35014219674dcc8966f.mockapi.io/books")
      .then((res) => res.json())
      .then((d) => Array.isArray(d) && setBooks(d))
      .catch((e) => console.error("fetch error:", e));
  }, [ready]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus buku ini?")) return;
    try {
      const res = await fetch(`https://686ca35014219674dcc8966f.mockapi.io/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus buku.");
      setBooks((b) => b.filter((x) => x.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan saat menghapus buku.");
    }
  };

  const handleEdit = (b: Book) => router.push(`/edit/${b.id}`);
  const handleDetail = (b: Book) => router.push(`/detail/${b.id}`);
  const handleAdd = () => router.push("/add");

  const list = books.filter((b) => {
    const c = selectedCategory === "Semua" || b.category === selectedCategory;
    const s =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const a = !filters.available || b.available;
    const p = !filters.popular || b.isPopular;
    const n = !filters.new || b.isNew;
    return c && s && a && p && n;
  });

  if (!ready)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        🔄 Memuat...
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glow (optional) */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-300 opacity-25 blur-[120px] dark:bg-indigo-600" />
        <div className="absolute top-1/3 right-[-120px] h-80 w-80 rounded-full bg-fuchsia-300 opacity-20 blur-[120px] dark:bg-fuchsia-700" />
        <div className="absolute bottom-[-100px] left-1/4 h-96 w-96 rounded-full bg-cyan-200 opacity-25 blur-[140px] dark:bg-cyan-500" />
      </div>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={setFilters}
          onCategoryChange={setSelectedCategory}
        />

        {/* Main Content */}
        <main className="flex flex-col h-screen overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
              <h1 className="text-2xl font-bold text-blue-700 dark:text-indigo-200">
              My Fiance
              </h1>

              <div className="flex items-center gap-2">
                {role === "admin" && (
                  <button
                    onClick={handleAdd}
                    className="group relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="h-4 w-4" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Tambah Buku
                    </span>
                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-10" />
                  </button>
                )}

                {!username ? (
                  <button
                    onClick={() => router.push("/login")}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      👋 Hi, {username}
                    </span>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        setUsername("");
                        setRole("");
                        router.push("/");
                      }}
                      className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content Section */}
          <section className="mx-auto w-full max-w-7xl flex-1 p-6">
            {role === "admin" && selectedCategory !== "Semua" && (
              <div className="mb-4 text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                📚 Kategori: {selectedCategory}
              </div>
            )}

            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-2xl text-gray-500">📭 Tidak ada buku.</p>
                <span className="mt-1 text-sm text-gray-400">
                  Coba ubah filter/kata kunci.
                </span>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {list.map((b) => (
                  <BookCard
                    key={b.id}
                    book={b}
                    onEdit={role === "admin" ? () => handleEdit(b) : undefined}
                    onDelete={role === "admin" ? () => handleDelete(b.id) : undefined}
                    onDetail={() => handleDetail(b)}
                    role={role}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
