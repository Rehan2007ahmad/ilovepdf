"use client";

import Spinner from "@/Components/Spinner";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function ImageToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputName, setOutputName] = useState("document"); // default name

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;

    // Allow only images
    const validFiles = selectedFiles.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length !== selectedFiles.length) {
      setError("Some files were not images and were skipped.");
    } else {
      setError(null);
    }

    setFiles((prev) => [...prev, ...validFiles]); // add to existing
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/tools/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Conversion failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = (outputName || "converted") + ".pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-yellow-400 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative z-10 max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Image to PDF</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Upload multiple images (JPG, PNG, WEBP, etc.) and combine them into a single PDF instantly.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-yellow-300 text-lg font-semibold mb-2">
              Selected Files:
            </p>
            <ul className="text-gray-300 max-h-32 overflow-y-auto text-sm mb-2">
              {files.map((file, idx) => (
                <li key={idx} className="truncate">{file.name}</li>
              ))}
            </ul>
            <input
              type="text"
              value={outputName}
              disabled={loading}
              onChange={(e) => setOutputName(e.target.value)}
              className="px-4 py-2 rounded-full w-full max-w-[200px] text-gray-900 bg-yellow-100 placeholder-gray-500"
              placeholder="Enter PDF name"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <label
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition transform ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1"
            }`}
          >
            <FaUpload /> {files.length > 0 ? "Add More" : "Upload Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={loading}
              onChange={handleFileChange}
            />
          </label>

          {files.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-6 py-3 font-semibold rounded-full transition transform ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:-translate-y-1"
              }`}
            >
              {loading ? <Spinner /> : "Convert to PDF"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
