"use client";

import React from "react";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Wave from "./Wave";

const heroTools = [
  { name: "JPG to PNG", icon: <FaFileImage size={40} />, slug: "jpg-to-png" },
  { name: "Image to PDF", icon: <FaFilePdf size={40} />, slug: "image-to-pdf" },
  { name: "WEBP to JPG", icon: <FaFileImage size={40} />, slug: "webp-to-jpg" },
];

export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-yellow-400 overflow-hidden">
      <motion.div
        className="absolute bottom-0 w-full"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wave fill="#111827" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-32 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Your Online PDF Tools
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Merge, Split, Compress, and Convert PDFs instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {heroTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <button className="cursor-pointer flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1">
                {tool.icon} {tool.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
