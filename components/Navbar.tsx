"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";

interface NavbarProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  availableCategories: string[];
}

export default function Navbar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
}: NavbarProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  // Fungsi untuk update status login
  const syncLoginStatus = () => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const userId = localStorage.getItem("id");

    setIsLogin(!!token);
    setUsername(storedUsername || "");
    setId(userId || "");
  };

  useEffect(() => {
    syncLoginStatus();

    // Dengarkan perubahan login dari tab lain atau logout manual
    const handleStatusChange = () => syncLoginStatus();
    window.addEventListener("loginStatusChanged", handleStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleStatusChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("loginStatusChanged")); // trigger global event
    setShowSidebar(false);
    router.push("/");
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setShowSidebar(false);
  };

  return (
    <>
      <div className="navbar bg-[#1B283C] py-3 shadow-sm px-4 md:px-10">
        <div className="w-full flex flex-wrap justify-between items-center gap-4">
          <Link
            href="/"
            className="text-xl font-semibold text-white hover:text-black hover:bg-white rounded"
          >
            My Fiance
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-6">
            <ul className="menu menu-horizontal px-1 flex items-center gap-6">
              <li>
                <Link
                  href={isLogin ? `/account/users/${id}/mybooks` : "/login"}
                  className="text-white hover:underline text-sm font-medium hover:bg-white hover:text-black"
                >
                  My Books
                </Link>
              </li>
              <li tabIndex={0}>
                <details>
                  <summary className="hover:bg-white min-w-[80px] text-white hover:text-black text-sm font-medium rounded-lg px-4 py-2">
                    {selectedCategory || "Category"}
                  </summary>
                  <ul className="p-2 bg-[#F2F0E7] rounded-box w-40 mt-2 shadow">
                    <li>
                      <button
                        onClick={() => setSelectedCategory("")}
                        className="text-[#333] hover:underline w-full text-left"
                      >
                        All
                      </button>
                    </li>
                    {availableCategories.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className="text-[#333] hover:underline w-full text-left"
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </ul>

            <div className="relative w-full max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-300 text-sm text-black bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0376B8]"
                placeholder="Search"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center gap-3">
            {!isLogin ? (
              <>
                <Link href="/login" className="btn btn-outline text-white border-gray-300 text-sm px-4">
                  Log In
                </Link>
                <Link href="/register" className="btn bg-[#0376B8] text-white text-sm px-4">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-white text-sm hidden sm:inline">👋 Hi, {username}</span>
                <button
                  onClick={handleLogout}
                  className="btn bg-red-600 hover:bg-red-700 text-white text-sm px-4"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Burger */}
          <button className="md:hidden text-white" onClick={() => setShowSidebar(true)}>
            <HiOutlineMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2 bg-[#1B283C]">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-300 text-sm text-white placeholder:text-gray-400 bg-[#1B283C] focus:outline-none focus:ring-2 focus:ring-[#0376B8]"
            placeholder="Search"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowSidebar(false)}>
          <div
            className="fixed right-0 top-0 w-2/3 max-w-xs h-full z-50 bg-[#1B283C]/90 text-white p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">My Fiance</h2>
              {isLogin && <p className="text-sm mb-4">👋 Hi, {username}</p>}

              <ul className="space-y-2">
                <li>
                  <Link
                    href={isLogin ? `/account/users/${id}/mybooks` : "/login"}
                    className="block py-2 hover:underline"
                  >
                    My Books
                  </Link>
                </li>
                <li className="font-semibold text-sm mt-4">Category</li>
                <li>
                  <button
                    onClick={() => handleSelectCategory("")}
                    className="w-full text-left hover:underline"
                  >
                    All
                  </button>
                </li>
                {availableCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleSelectCategory(cat)}
                      className="w-full text-left hover:underline"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom auth buttons */}
            <div className="mt-6 border-t border-gray-600 pt-4">
              {isLogin ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setShowSidebar(false)}
                    className="w-full text-center border border-gray-300 text-white py-2 rounded hover:bg-white hover:text-black"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowSidebar(false)}
                    className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
