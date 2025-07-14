'use client';

import { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel from Right */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-64 bg-[#f6f5ef] dark:bg-gray-800 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto shadow-lg`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-label"
      >
        {/* Header */}
        <div className="relative p-4 border-b border-gray-300">
          <h5 className="text-base font-semibold uppercase text-gray-700 dark:text-gray-300">Menu</h5>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Sections */}
        <nav className="px-4 py-6 space-y-6 text-sm text-gray-900 dark:text-white">
          {/* Section: Browse */}
          <div>
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Category</h3>
            <ul className="space-y-1 border-b pb-3 border-gray-300">
              <li><a href="#" className="block py-1 hover:underline">Subjects</a></li>
              <li><a href="#" className="block py-1 hover:underline">Trending</a></li>
              <li><a href="#" className="block py-1 hover:underline">Library Explorer</a></li>
              <li><a href="#" className="block py-1 hover:underline">Lists</a></li>
              <li><a href="#" className="block py-1 hover:underline">Collections</a></li>
              <li><a href="#" className="block py-1 hover:underline">K–12 Student Library</a></li>
              <li><a href="#" className="block py-1 hover:underline">Book Talks</a></li>
              <li><a href="#" className="block py-1 hover:underline">Random Book</a></li>
              <li><a href="#" className="block py-1 hover:underline">Advanced Search</a></li>
            </ul>
          </div>

          {/* Section: Contribute */}
          <div>
            <h6 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Contribute</h6>
            <ul className="space-y-1 border-b pb-3 border-gray-300">
              <li><a href="#" className="block py-1 hover:underline">Add a Book</a></li>
              <li><a href="#" className="block py-1 hover:underline">Recent Community Edits</a></li>
            </ul>
          </div>

          {/* Section: Resources */}
          <div>
            <h6 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Resources</h6>
            <ul className="space-y-1">
              <li><a href="#" className="block py-1 hover:underline">Help Center</a></li>
              <li><a href="#" className="block py-1 hover:underline">Terms of Use</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
