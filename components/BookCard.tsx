'use client';

import { BookOpen, Star, Pencil, Trash2, Info } from 'lucide-react';
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

interface BookCardProps {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  onDetail: () => void;
  onBorrow?: () => void;
  isBorrowedByUser?: boolean; // ➕ Tambahkan ini
  role?: string;
}


export default function BookCard({
  book,
  onEdit,
  onDelete,
  onDetail,
  onBorrow,
  isBorrowedByUser = false,
  role,
}: BookCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
      {/* Cover */}
      <div className="relative">
        <Image
          src={book.cover || "/placeholder.jpg"} // fallback lokal
          alt={book.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover rounded-t"
          unoptimized
        />

        {!book.available && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
            Dipinjam
          </div>
        )}
        {book.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow">
            Baru
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 truncate">{book.title}</h3>
        <p className="text-gray-500 text-sm">{book.author}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {book.category}
          </span>
          {book.isPopular && (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <Star size={14} /> Populer
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{book.description}</p>

        {/* Penjelasan jika sedang dipinjam */}
        {!book.available && (
          <p className="text-xs font-semibold text-red-600 mt-2">
            ❌ Buku ini sedang dipinjam
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <button
            onClick={onDetail}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm"
          >
            <Info size={16} /> Detail
          </button>

          {/* Hanya muncul jika bukan admin dan buku tersedia */}
          {role !== 'admin' && book.available && !isBorrowedByUser && (
            <button
              onClick={onBorrow}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm"
            >
              <BookOpen size={16} /> Borrow
            </button>
          )}

          {/* Jika user sudah meminjam buku ini */}
          {role !== 'admin' && isBorrowedByUser && (
            <button
              disabled
              className="flex items-center justify-center gap-2 bg-gray-400 text-white py-2 px-4 rounded-md text-sm cursor-not-allowed"
            >
              ✅ Already Borrowed
            </button>
          )}

          {/* Admin buttons */}
          {role === 'admin' && (
            <>
              <button
                onClick={onEdit}
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-sm"
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
