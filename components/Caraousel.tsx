"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import BtnModal from "./BtnModal";
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

interface BorrowRequest {
  bookId: string;
  status: "pending" | "accepted" | string;
}

interface CarouselProps {
  search: string;
  selectedCategory: string;
  setAvailableCategories: (categories: string[]) => void;
}

export default function Carousel({
  search,
  selectedCategory,
  setAvailableCategories,
}: CarouselProps) {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowedBookIds, setBorrowedBookIds] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://686ca35014219674dcc8966f.mockapi.io/books", {
          cache: "no-store",
        });
        const json: Book[] = await res.json();
        if (!Array.isArray(json)) {
          console.error("❌ Data dari API bukan array:", json);
          return;
        }
        setBookList(json);
        const categories = [...new Set(json.map((b) => b.category).filter(Boolean))];
        setAvailableCategories(categories);
      } catch (error) {
        console.error("❌ Gagal mengambil data buku:", error);
        setBookList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [setAvailableCategories]);

  useEffect(() => {
    if (!userEmail || bookList.length === 0) return;

    const fetchBorrowed = async () => {
      try {
        const res = await fetch(
          `https://6872285676a5723aacd3ce7f.mockapi.io/permintaanuser?borrowerEmail=${encodeURIComponent(userEmail)}`
        );
        const data: BorrowRequest[] = await res.json();
        if (!Array.isArray(data)) {
          console.warn("⚠️ Data permintaan bukan array:", data);
          return;
        }

        const aktif = data.filter((item) =>
          ["pending", "accepted"].includes(item?.status)
        );

        const borrowed = aktif.map((item) => item.bookId).filter(Boolean);
        setBorrowedBookIds(borrowed);
      } catch (err) {
        console.error("❌ Error saat ambil peminjaman:", err);
        setBorrowedBookIds([]);
      }
    };

    fetchBorrowed();
  }, [userEmail, bookList]);

  const filteredBooks = useMemo(() => {
    return bookList.filter((b) => {
      const matchSearch =
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "" || b.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [bookList, search, selectedCategory]);

  const openModal = (book: Book) => {
    setSelectedBook(book);
    (document.getElementById("book_modal") as HTMLDialogElement)?.showModal();
  };

  const handleBorrow = (book: Book) => {
    const isLoggedIn = !!localStorage.getItem("token") && !!localStorage.getItem("id");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!book.available) {
      alert("❌ Buku ini tidak tersedia.");
      return;
    }
    router.push(`/userBorrow?bookId=${book.id}`);
  };

  return (
    <div className="w-full py-6 px-4 bg-[#10192D]">
      <h2 className="text-lg md:text-xl font-bold text-white mb-4">
        {selectedCategory || "All Books"}
      </h2>

      {loading ? (
        <p className="text-white">Memuat buku…</p>
      ) : filteredBooks.length > 0 ? (
        <div className="p-4 bg-slate-800 rounded-box">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBooks.map((book) => {
              const isBorrowed = borrowedBookIds.includes(book.id);
              const isDisabled = isBorrowed || !book.available;

              return (
                <div key={book.id} className="w-full">
                  <div className="bg-gray-700 rounded-lg shadow flex flex-col items-center p-3">
                    <Image
                      src={book.cover || "/default-cover.jpg"}
                      alt={book.title}
                      width={144}
                      height={216}
                      className="w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44 lg:w-36 lg:h-48 object-cover rounded shadow"
                    />
                    <div className="mt-2 flex justify-center items-center gap-2 w-full">
                      <BtnModal
                        disabled={isDisabled}
                        borrowedByCurrentUser={isBorrowed}
                        onBorrowClick={() => handleBorrow(book)}
                        onDetailClick={() => openModal(book)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-white">📭 Tidak ada buku ditemukan.</p>
      )}

      <dialog id="book_modal" className="modal">
        <div className="modal-box bg-amber-50">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost bg-white absolute right-2 top-2 text-black">
              ✕
            </button>
          </form>
          {selectedBook && (
            <>
              <h3 className="font-bold text-lg text-black">{selectedBook.title}</h3>
              <Image
                src={selectedBook.cover || "/default-cover.jpg"}
                width={400}
                height={240}
                className="w-full h-60 object-cover rounded mb-2"
                alt="cover"
              />
              <p className="text-black">
                <strong>Author:</strong> {selectedBook.author}
              </p>
              <p className="text-black">
                <strong>Category:</strong> {selectedBook.category}
              </p>
              <p className="text-black mt-2">{selectedBook.description}</p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
