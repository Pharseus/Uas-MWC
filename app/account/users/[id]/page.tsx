"use client";

import Caraousel from "@/components/Caraousel";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PreLoader } from "@/components/PreLoader";
import React, { useState } from 'react';

export default function Page() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  return (
    <div className="bg-[#E1DCC5]">
      <PreLoader />
      <Navbar
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
      />
      <Caraousel
        search={search}
        selectedCategory={selectedCategory}
        setAvailableCategories={setAvailableCategories}
      />
      <Footer />
    </div>
  );
}
