"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://686de4f9c9090c4953878bab.mockapi.io/Register");
      const users: User[] = await res.json();

      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        localStorage.setItem("role", foundUser.role);
        localStorage.setItem("username", foundUser.username);
        localStorage.setItem("email", foundUser.email);
        localStorage.setItem("id", foundUser.id);
        localStorage.setItem("token", "dummy_token");

        window.dispatchEvent(new Event("loginStatusChanged"));

        if (foundUser.role === "admin") {
          router.push("/account/admin");
        } else {
          router.push(`/account/users/id=${foundUser.id}`);
        }
      } else {
        alert("Email atau password salah!");
      }
    } catch (err) {
      alert("Gagal login.");
      console.error(err);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background books */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl dark:bg-indigo-700"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-300 blur-3xl dark:bg-blue-700"
      />

      <motion.section
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-2xl dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 text-center text-3xl font-extrabold text-blue-800 dark:text-indigo-200"
        >
          Login Perpustakaan
        </motion.h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white/90 px-4 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/70 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-300"
              placeholder="name@library.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white/90 px-4 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/70 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-300"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 py-2 text-lg font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:from-blue-600 dark:via-indigo-600 dark:to-blue-500 dark:focus:ring-indigo-500"
          >
            Masuk
          </motion.button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Belum punya akun?{" "}
            <a href="/register" className="font-medium text-blue-600 hover:underline dark:text-indigo-300">
              Daftar di sini
            </a>
          </p>
        </form>
      </motion.section>
    </div>
  );
}
