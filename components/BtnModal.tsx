'use client';
import React from 'react';

interface BtnModalProps {
  onBorrowClick: () => void;
  onDetailClick: () => void;
  disabled?: boolean; // Menonaktifkan tombol jika sudah dipinjam
  borrowedByCurrentUser?: boolean; // True jika buku dipinjam oleh user saat ini
}

const BtnModal = ({
  onBorrowClick,
  onDetailClick,
  disabled = false,
  borrowedByCurrentUser = false,
}: BtnModalProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center">
      <button
        onClick={onBorrowClick}
        disabled={disabled}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium shadow-md transition-transform duration-200 focus:outline-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-gray-400 text-white hover:scale-100 hover:shadow-md'
            : 'bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white hover:shadow-lg hover:scale-105'
        }`}
      >
        {disabled
          ? borrowedByCurrentUser
            ? '✅ Borrowed'
            : '❌ Unavailable'
          : '📚 Borrow'}
      </button>

      <button
        onClick={onDetailClick}
        className="w-full sm:w-auto px-4 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium bg-white hover:bg-blue-50 hover:shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none"
      >
        🔍 Detail
      </button>
    </div>
  );
};

export default BtnModal;
