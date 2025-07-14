// FILE: app/detail/[id]/DetailBookClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export interface DetailBookPageProps {
  id: string;
}

export default function DetailBookPage({ id }: DetailBookPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(
        `https://686ca35014219674dcc8966f.mockapi.io/books/${id}`
      );
      const data = await res.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  if (!book)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-blue-600">
          Memuat detail buku...
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Gambar Buku */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={book.cover}
            alt={book.title}
            width={400}
            height={400}
            className="w-full max-h-[500px] rounded-lg border shadow-md object-contain bg-gray-100"
          />
        </div>

        {/* Info Buku */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {book.title}
          </h1>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Category:</span> {book.category}
          </p>

          {/* Badge */}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.available && (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs rounded-full font-medium">
                Tersedia
              </span>
            )}
            {book.isNew && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 text-xs rounded-full font-medium">
                Baru
              </span>
            )}
            {book.isPopular && (
              <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 text-xs rounded-full font-medium">
                Populer
              </span>
            )}
          </div>

          {/* Deskripsi */}
          <p className="mt-6 text-gray-800 leading-relaxed text-justify">
            {book.description}
          </p>

          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-200"
          >
            ⬅️ Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
