"use client";

import Spinner from "@/Components/Spinner";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function WEBPToJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputName, setOutputName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "image/webp") {
        setError("Only WEBP files are allowed!");
        setFile(null);
        setOutputName("");
        return;
      }
      setFile(selected);
      setOutputName(selected.name.replace(/\.[^/.]+$/, ""));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tools/webp-to-jpg", {
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
      link.download = (outputName || "converted") + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err)
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-yellow-400 overflow-hidden min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative z-10 max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">WEBP to JPG</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Convert your WEBP images to JPG format instantly. Upload your image and get the result in seconds!
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {file && (
          <div className="mb-4">
            <p className="text-yellow-300 text-lg md:text-xl font-semibold truncate mb-2">
              Selected File: {file.name}
            </p>
            <input
              type="text"
              value={outputName}
              disabled={loading}
              onChange={(e) => setOutputName(e.target.value)}
              className="px-4 py-2 rounded-full w-full max-w-[150px] lg:w-[200px] text-gray-900 bg-yellow-100 placeholder-gray-500"
              placeholder="Enter new file name"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <label
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition transform ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1"
            }`}
          >
            <FaUpload /> {file ? "Change File" : "Upload WEBP"}
            <input
              type="file"
              accept=".webp"
              className="hidden"
              disabled={loading}
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`px-6 py-3 font-semibold rounded-full transition transform ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:-translate-y-1"
              }`}
            >
              {loading ? <Spinner /> : "Convert"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
