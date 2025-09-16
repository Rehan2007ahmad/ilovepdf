"use client";

import {
  FaFilePdf,
  FaFileWord,
  FaCompress,
  FaLink,
  FaCut,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  { name: "Merge PDF", icon: <FaLink size={40} /> },
  { name: "Split PDF", icon: <FaCut size={40} /> },
  { name: "Compress PDF", icon: <FaCompress size={40} /> },
  { name: "PDF ↔ Word", icon: <FaFileWord size={40} /> },
  { name: "Excel ↔ PDF", icon: <FaFileExcel size={40} /> },
  { name: "PPT ↔ PDF", icon: <FaFilePowerpoint size={40} /> },
  { name: "Images ↔ PDF", icon: <FaFileImage size={40} /> },
];

export default function WhatWeDo() {
  return (
    <section className="py-20 bg-gray-900 text-yellow-400 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">What We Do</h2>
        <p className="text-gray-300 mb-12">
          We provide a full suite of online PDF & Document tools to help you manage files efficiently.
        </p>
      </div>

      {/* Gradient fade edges for smooth effect */}
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-gray-900 to-transparent z-20"></div>
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-gray-900 to-transparent z-20"></div>

      {/* Marquee Rows */}
      <div className="overflow-hidden space-y-8">
        {/* First Row - left scroll */}
        <motion.div
          className="flex gap-8 whitespace-nowrap group"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          whileHover={{ animationPlayState: "paused" }} // Hover pause
        >
          {[...features, ...features].map((feature, idx) => (
            <div
              key={`row1-${idx}`}
              className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-xl shadow inline-block min-w-[180px] text-center"
            >
              <div className="mb-2">{feature.icon}</div>
              <h4 className="text-lg font-semibold">{feature.name}</h4>
            </div>
          ))}
        </motion.div>

        {/* Second Row - right scroll */}
        <motion.div
          className="flex gap-8 whitespace-nowrap group"
          animate={{ x: ["-100%", "0%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          whileHover={{ animationPlayState: "paused" }} // Hover pause
        >
          {[...features, ...features].map((feature, idx) => (
            <div
              key={`row2-${idx}`}
              className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-xl shadow inline-block min-w-[180px] text-center"
            >
              <div className="mb-2">{feature.icon}</div>
              <h4 className="text-lg font-semibold">{feature.name}</h4>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
