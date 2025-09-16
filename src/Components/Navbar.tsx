'use client'
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <header className="bg-gray-900 text-yellow-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">iLovePDF</h1>
        <nav className="hidden md:flex space-x-6 items-center font-medium">
          <div className="group relative">
            <button className="hover:text-yellow-300 transition">Features ▼</button>
            <div className="absolute hidden group-hover:block bg-gray-800 text-yellow-400 mt-2 rounded-md shadow-lg min-w-[150px]">
              <a href="#" className="block px-4 py-2 hover:bg-gray-700">Merge PDF</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700">Split PDF</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700">Compress PDF</a>
            </div>
          </div>
          <a href="#" className="hover:text-yellow-300 transition">Pricing</a>
          <a href="#" className="hover:text-yellow-300 transition">Login</a>
        </nav>

        <div className="md:hidden">
          <button onClick={toggle}>{open ? <HiX size={28} /> : <HiMenu size={28} />}</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-900 text-yellow-400">
          <a href="#" className="block px-4 py-2 hover:bg-gray-800">Merge PDF</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-800">Split PDF</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-800">Compress PDF</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-800">Pricing</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-800">Login</a>
        </div>
      )}
    </header>
  );
}
