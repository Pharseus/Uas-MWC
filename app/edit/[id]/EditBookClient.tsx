'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const categories = ['Fiksi', 'Non-Fiksi', 'Sains', 'Sejarah', 'Teknologi'];

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

export default function EditBookClient({ id }: { id: string }) {
  const [form, setForm] = useState<Book | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://686ca35014219674dcc8966f.mockapi.io/books/${id}`
        );
        if (!res.ok) throw new Error("Buku tidak ditemukan");

        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
        alert("Terjadi kesalahan saat memuat data buku.");
        router.push('/');
      }
    };
    fetchBook();
  }, [id, router]); // ✅ Perbaikan disini

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!form) return;

    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    await fetch(`https://686ca35014219674dcc8966f.mockapi.io/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    router.push('/');
  };

  const getCoverFromOpenLibrary = async (title: string, author: string) => {
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
      );
      const data = await res.json();
      const doc = data?.docs?.[0];

      if (doc?.isbn?.[0]) {
        return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
      } else if (doc?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      }
    } catch (error) {
      console.error("Gagal mengambil cover:", error);
    }
    return null;
  };

  if (!form)
    return (
      <div className="flex justify-center items-center h-screen font-medium">
        Memuat data buku...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-gray-700 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Buku</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Judul Buku</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul buku"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Penulis</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama penulis"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" className="text-black">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-black">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">URL Cover Buku</label>
          <input
            name="cover"
            value={form.cover}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  alert("Cover tidak ditemukan.");
                }
              } else {
                alert("Isi judul buku terlebih dahulu.");
              }
            }}
            className="text-sm text-blue-400 underline ml-2 mt-1"
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
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tulis deskripsi buku..."
          ></textarea>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
              className="accent-blue-600"
            />
            Tersedia
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="accent-blue-600"
            />
            Baru
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isPopular"
              checked={form.isPopular}
              onChange={handleChange}
              className="accent-blue-600"
            />
            Populer
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
