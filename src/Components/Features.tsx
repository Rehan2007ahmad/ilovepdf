"use client";
import { TbResize } from "react-icons/tb";
import {
  FaFilePdf,
  FaFileImage,
  FaLink,
  FaCut,
  FaCompress,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const converters = [
  {
    name: "JPG to PNG",
    icon: <FaFileImage size={40} />,
    slug: "jpg-to-png",
    cta: "Convert JPG to PNG Free",
  },
  {
    name: "PNG to JPG",
    icon: <FaFileImage size={40} />,
    slug: "png-to-jpg",
    cta: "Convert PNG to JPG Instantly",
  },
  {
    name: "WEBP to JPG",
    icon: <FaFileImage size={40} />,
    slug: "webp-to-jpg",
    cta: "Change WEBP to JPG Online",
  },
  {
    name: "JPG to WEBP",
    icon: <FaFileImage size={40} />,
    slug: "jpg-to-webp",
    cta: "Convert JPG to WEBP Easily",
  },
  {
    name: "Resize Image",
    icon: <TbResize size={40} />,
    slug: "resize-image",
    cta: "Resize Your Images Online",
  },
  {
    name: "Image to PDF",
    icon: <FaFilePdf size={40} />,
    slug: "image-to-pdf",
    cta: "Turn Images into PDF Fast",
  },
  {
    name: "Merge PDF",
    icon: <FaLink size={40} />,
    slug: "merge-pdf",
    cta: "Combine PDFs Online",
  },
  {
    name: "Split PDF",
    icon: <FaCut size={40} />,
    slug: "split-pdf",
    cta: "Split PDF Files Quickly",
  },
  {
    name: "Compress PDF",
    icon: <FaCompress size={40} />,
    slug: "compress-pdf",
    cta: "Reduce PDF Size Free",
  },
  {
    name: "Word to PDF",
    icon: <FaFilePdf size={40} />,
    slug: "word-to-pdf",
    cta: "Convert Word to PDF Fast",
  },
];

export default function Features() {
  return (
    <motion.section
      className="py-20 bg-gray-800 text-yellow-400"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All-in-One Image & File Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {converters.map((tool) => (
            <motion.div
              key={tool.slug}
              className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition transform text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-center items-center mb-4">
                {tool.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{tool.name}</h4>
              <p className="text-gray-300">
                Perform {tool.name.toLowerCase()} easily and quickly.
              </p>

              <Link href={`/tools/${tool.slug}`}>
                <button className="cursor-pointer mt-4 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition">
                  {tool.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
