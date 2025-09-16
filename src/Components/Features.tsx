"use client"
import { FaFilePdf, FaFileWord, FaCompress, FaLink, FaCut } from "react-icons/fa";
import { motion } from "framer-motion";

const converters = [
  { name: "PDF to Word", icon: <FaFileWord size={40} /> },
  { name: "Word to PDF", icon: <FaFilePdf size={40} /> },
  { name: "Merge PDF", icon: <FaLink size={40} /> },
  { name: "Split PDF", icon: <FaCut size={40} /> },
  { name: "Compress PDF", icon: <FaCompress size={40} /> },
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
              key={tool.name}
              className="bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition transform text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Centered Icon */}
              <div className="flex justify-center items-center mb-4">
                {tool.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{tool.name}</h4>
              <p className="text-gray-300">
                Perform {tool.name.toLowerCase()} easily and quickly.
              </p>
              <button className="mt-4 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition">
                Start
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
