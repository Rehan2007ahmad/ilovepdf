"use client"
import React from "react";
import { FaFilePdf, FaFileWord, FaCompress } from "react-icons/fa";
import { motion } from "framer-motion";
import Wave from "./Wave"; // Make sure Wave.tsx is in the same folder

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-yellow-400 overflow-hidden">
      {/* Animated Wave at bottom */}
      <motion.div
        className="absolute bottom-0 w-full"
        animate={{ y: [0, 10, 0] }} // subtle up-down animation
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wave fill="#111827" />
      </motion.div>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto px-4 py-32 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Your Online PDF Tools
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Merge, Split, Compress, and Convert PDFs instantly. Dark mode + yellow accent theme.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1">
            <FaFileWord /> Word to PDF
          </button>
          <button className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1">
            <FaFilePdf /> PDF to Word
          </button>
          <button className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1">
            <FaCompress /> Compress PDF
          </button>
        </div>
      </div>
    </section>
  );
}
