'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Request {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerEmail: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'returned';
}

export default function HandleRequestBookPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Anda tidak memiliki akses!');
      router.replace('/');
      return;
    }

    fetch('https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser')
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort(
          (a: Request, b: Request) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRequests(sortedData);
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleStatusUpdate = async (
    id: string,
    newStatus: 'accepted' | 'rejected'
  ) => {
    try {
      const request = requests.find((r) => r.id === id);
      if (!request) return;

      await fetch(
        `https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (newStatus === 'accepted') {
        await updateBookAvailability(request.bookId, false);
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui status.');
    }
  };

  const updateBookAvailability = async (
    bookId: string,
    available: boolean
  ) => {
    await fetch(
      `https://686ca35014219674dcc8966f.mockapi.io/books/${bookId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available }),
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📥 Permintaan Peminjaman Buku</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">Tidak ada permintaan.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="bg-white p-4 rounded shadow border">
              <p className="text-black">
                <strong>Buku:</strong> {req.bookTitle}
              </p>
              <p className="text-black">
                <strong>Nama:</strong> {req.borrowerName}
              </p>
              <p className="text-black">
                <strong>Email:</strong> {req.borrowerEmail}
              </p>
              <p className="text-black">
                <strong>Tanggal:</strong>{' '}
                {new Date(req.date).toLocaleString()}
              </p>
              <p className="text-black">
                <strong>Status:</strong>{' '}
                {req.status === 'pending' ? (
                  <span className="text-yellow-600">Menunggu</span>
                ) : req.status === 'accepted' ? (
                  <span className="text-green-600">Diterima</span>
                ) : req.status === 'rejected' ? (
                  <span className="text-red-600">Ditolak</span>
                ) : (
                  <span className="text-blue-600">Dikembalikan</span>
                )}
              </p>

              {req.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    ✔️ Terima
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    ❌ Tolak
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/account/admin')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          🔙 Kembali ke Beranda Admin
        </button>
      </div>
    </div>
  );
}
