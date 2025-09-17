"use client";

import { useState } from "react";
import { FaUpload } from "react-icons/fa";


export default function PNGToJPG({ tool }: { tool?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "image/png") {
        setError("Only PNG files are allowed!");
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    // TODO: handle conversion logic here (call backend API)
    alert(`Uploading ${file.name} for PNG → JPG conversion!`);
  };

  return (
    <>
    <section className="relative bg-gray-900 text-yellow-400 overflow-hidden min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative z-10 max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">PNG to JPG</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Convert your PNG images to JPG format instantly and easily. Upload your image and get the result in seconds!
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {file && (
          <p className="text-yellow-300 text-lg md:text-xl font-semibold mb-4 truncate">
            Selected File: {file.name}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1">
            <FaUpload /> {file ? "Change File" : "Upload PNG"}
            <input type="file" accept=".png" className="hidden" onChange={handleFileChange} />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              className="px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full hover:bg-yellow-400 transition transform hover:-translate-y-1"
            >
              Convert
            </button>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
