"use client";
import { FaFilePdf, FaFileImage, FaFileWord, FaLink, FaCut, FaCompress } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";


const converters = [
  { name: "JPG to PNG", icon: <FaFileImage size={40} />, slug: "jpg-to-png" },
  { name: "PNG to JPG", icon: <FaFileImage size={40} />, slug: "png-to-jpg" },
  { name: "WEBP to JPG", icon: <FaFileImage size={40} />, slug: "webp-to-jpg" },
  { name: "JPG to WEBP", icon: <FaFileImage size={40} />, slug: "jpg-to-webp" },
  { name: "Image to PDF", icon: <FaFilePdf size={40} />, slug: "image-to-pdf" },
  { name: "PDF to Word", icon: <FaFileWord size={40} />, slug: "pdf-to-word" }, 
  { name: "Word to PDF", icon: <FaFilePdf size={40} />, slug: "word-to-pdf" },
  { name: "Merge PDF", icon: <FaLink size={40} />, slug: "merge-pdf" },
  { name: "Split PDF", icon: <FaCut size={40} />, slug: "split-pdf" },
  { name: "Compress PDF", icon: <FaCompress size={40} />, slug: "compress-pdf" },
];


export default function Features() {
  return (
    <motion.section
      className="py-20 bg-gray-800 text-yellow-400"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All Your PDF Needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {converters.map((tool) => (
            <motion.div
              key={tool.slug}
              className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition transform text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex justify-center items-center mb-4">
                {tool.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{tool.name}</h4>
              <p className="text-gray-300">
                Perform {tool.name.toLowerCase()} easily and quickly.
              </p>
     
              <Link href={`/tools/${tool.slug}`}>
                <button className="cursor-pointer mt-4 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition ">
                  Start
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
