'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
}

export default function UserBorrowPage() {
  const router = useRouter();
  const params = useSearchParams();
  const bookId = params.get('bookId');

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    borrowerName: '',
    borrowerEmail: '',
    bookTitle: '',
    bookId: '',
    date: new Date().toISOString(),
    status: 'pending', // status default
  });

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;

      try {
        const res = await fetch(`https://686ca35014219674dcc8966f.mockapi.io/books/${bookId}`);
        const data = await res.json();
        setBook(data);
        setForm((prev) => ({
          ...prev,
          bookTitle: data.title,
          bookId: data.id,
        }));
      } catch {
        alert('Gagal mengambil data buku.');
      } finally {
        setLoading(false);
      }
    };

    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('email') || '';

    setForm((prev) => ({
      ...prev,
      borrowerName: username,
      borrowerEmail: email,
    }));

    fetchBook();
  }, [bookId]);

  const handleSubmit = async () => {
    if (!form.borrowerName || !form.borrowerEmail) {
      alert('Nama & email wajib diisi!');
      return;
    }

    try {
      const res = await fetch('https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // status: 'pending' sudah default
      });

      if (res.ok) {
        alert('Permintaan dikirim!');
        const userId = localStorage.getItem('id');
        router.push(userId ? `/account/users/${userId}/mybooks` : '/account');
      } else {
        alert('Gagal memproses.');
      }
    } catch {
      alert('Terjadi kesalahan.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Konfirmasi Peminjaman Buku</h1>

      {book ? (
        <div className="mb-4">
          <p><strong>Judul Buku:</strong> {book.title}</p>
          <p><strong>Penulis:</strong> {book.author}</p>
          <p><strong>Kategori:</strong> {book.category}</p>
        </div>
      ) : (
        <p className="text-red-500">Buku tidak ditemukan.</p>
      )}

      <div className="mb-4">
        <p><strong>Nama Peminjam:</strong> {form.borrowerName}</p>
        <p><strong>Email Peminjam:</strong> {form.borrowerEmail}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Konfirmasi Pinjam
        </button>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
