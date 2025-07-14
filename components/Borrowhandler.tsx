"use client";

import { useRouter } from "next/navigation";

interface BorrowHandlerProps {
  bookId: string;
  isAvailable: boolean;
  isPhysichAvailable: boolean;
}

const BorrowHandler = ({ bookId, isAvailable, isPhysichAvailable }: BorrowHandlerProps) => {
  const router = useRouter();

  const handleClick = () => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!username || !email) {
      alert("Silakan login terlebih dahulu.");
      return router.push("/account/login");
    }

    if (!(isAvailable && isPhysichAvailable)) {
      return alert("Buku tidak tersedia untuk dipinjam.");
    }

    // Redirect ke halaman konfirmasi pinjam
    router.push(`/userBorrow?bookId=${bookId}`);
  };

  return (
    <button
      className="btn btn-sm btn-info bg-white border-none text-black"
      onClick={handleClick}
      disabled={!(isAvailable && isPhysichAvailable)}
    >
      {isAvailable && isPhysichAvailable ? "Pinjam" : "Unavailable"}
    </button>
  );
};

export default BorrowHandler;
