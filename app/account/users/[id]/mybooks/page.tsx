"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  bookId: string;
  bookTitle: string;
  date: string;
  status: "pending" | "accepted" | "rejected" | "returned";
  borrowerEmail: string;
}

export default function MyBooksPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("Email tidak ditemukan! Pastikan Anda sudah login.");
        return setLoading(false);
      }

      try {
        const res = await fetch(
          "https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch");

        const data: Request[] = await res.json();
        setRequests(data.filter((req) => req.borrowerEmail === email));
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data peminjaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleReturn = async (requestId: string, bookId: string) => {
    try {
      // 1. Update status peminjaman
      await fetch(`https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "returned" }),
      });

      // 2. Update status buku
      await fetch(`https://686ca35014219674dcc8966f.mockapi.io/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: true }),
      });

      // 3. Update state lokal
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "returned" } : req
        )
      );

      alert("Buku berhasil dikembalikan.");
    } catch (err) {
      console.error(err);
      alert("Gagal mengembalikan buku.");
    }
  };

  const statusBadge = (status: Request["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
            ⏳ Menunggu
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
            ✓ Diterima
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-medium text-rose-400">
            ✗ Ditolak
          </span>
        );
      case "returned":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/20 px-2 py-0.5 text-xs font-medium text-gray-300">
            🔁 Dikembalikan
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600" />
      </div>
    );

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-blue-600 md:text-4xl">
          Buku yang Anda Pinjam
        </h1>
        <p className="text-sm text-gray-400">
          Riwayat dan status permintaan peminjaman Anda.
        </p>
      </header>

      {requests.length === 0 ? (
        <p className="rounded-lg bg-gray-800 p-6 text-center text-gray-400">
          Belum ada permintaan peminjaman.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <li
              key={req.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 shadow transition hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="space-y-2 text-sm text-gray-200">
                <p className="text-base font-semibold text-white">
                  {req.bookTitle}
                </p>
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(req.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="flex items-center gap-1">
                  <strong>Status:</strong> {statusBadge(req.status)}
                </p>

                {/* Tombol Kembalikan Buku */}
                {req.status === "accepted" && (
                  <button
                    onClick={() => handleReturn(req.id, req.bookId)}
                    className="mt-3 inline-block rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    🔄 Kembalikan Buku
                  </button>
                )}
              </div>

              {/* gradient dekorasi */}
              <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/20 blur-xl transition group-hover:scale-125" />
            </li>
          ))}
        </ul>
      )}
      {/* Tombol Kembali ke Beranda */}
          <div className="text-center mt-10">
            <button
              onClick={() =>  router.push('/')}
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md shadow"
            >
              ⬅️ Kembali
            </button>
          </div>

    </section>
    
  );
}
