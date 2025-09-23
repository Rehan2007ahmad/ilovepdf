"use client";

import Spinner from "@/Components/Spinner";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputName, setOutputName] = useState("");
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [unit, setUnit] = useState<"px" | "%">("px");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("image/")) {
        setError("Only image files are allowed!");
        setFile(null);
        setOutputName("");
        setPreviewUrl(null);
        return;
      }
      setFile(selected);
      setOutputName(selected.name.replace(/\.[^/.]+$/, ""));
      setError(null);

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleResize = async () => {
    if (!file || !width || !height) {
      setError("Please upload an image and set width & height.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => (img.onload = res));

      const canvas = document.createElement("canvas");

      let newWidth = Number(width);
      let newHeight = Number(height);
      if (unit === "%") {
        newWidth = (img.width * newWidth) / 100;
        newHeight = (img.height * newHeight) / 100;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Failed to resize image.");
          setLoading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = (outputName || "resized") + ".png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false);
      }, "image/png");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Try again!");
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-yellow-400 overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="relative z-10 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
            Resize Image
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-2">
            Upload your image, set the width and height, and download the resized
            version instantly.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center mb-6">
            <p className="text-red-500 text-sm sm:text-base bg-red-100 bg-opacity-10 px-4 py-2 rounded-lg inline-block">
              {error}
            </p>
          </div>
        )}

         {!file && (
          <div className="text-center mb-8">
            <label
              className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition transform text-sm sm:text-base ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1"
              }`}
            >
              <FaUpload className="text-sm sm:text-base" /> Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {file && (
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10">
            {/* Controls */}
            <div className="flex-1 w-full flex flex-col items-center">
              <p className="text-yellow-300 text-base sm:text-lg md:text-xl font-semibold break-words mb-6 text-center">
                Selected File: {file.name}
              </p>

              {/* Inputs */}
              <div className="flex items-start gap-4 mb-6 flex-wrap justify-center">
                <div className="flex flex-col items-center">
                  <label className="text-yellow-300 text-sm font-medium mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) =>
                      setWidth(e.target.value ? Number(e.target.value) : "")
                    }
                    disabled={loading}
                    placeholder={originalWidth.toString()}
                    className="w-28 px-3 py-2 rounded border border-gray-300 text-gray-900 bg-white text-center focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="text-yellow-300 text-sm font-medium mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) =>
                      setHeight(e.target.value ? Number(e.target.value) : "")
                    }
                    disabled={loading}
                    placeholder={originalHeight.toString()}
                    className="w-28 px-3 py-2 rounded border border-gray-300 text-gray-900 bg-white text-center focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <label className="text-yellow-300 text-sm font-medium mb-2">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as "px" | "%")}
                    disabled={loading}
                    className="w-15 px-3 py-2 rounded border border-gray-300 text-gray-900 bg-white text-center focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="px">Px</option>
                    <option value="%">%</option>
                  </select>
                </div>
              </div>

              {/* File name */}
              <div className="w-full max-w-sm mb-8">
                <label className="block text-yellow-300 text-sm sm:text-base font-medium mb-2 text-center">
                  New File Name:
                </label>
                <input
                  type="text"
                  value={outputName}
                  disabled={loading}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900 bg-white text-center text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  placeholder="Enter file name"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-row sm:flex-row items-center justify-center gap-4 mt-auto">
                <label
                  className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition transform text-sm sm:text-base flex-1 ${
                    loading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1"
                  }`}
                >
                  <FaUpload className="text-sm sm:text-base" /> Change File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                    onChange={handleFileChange}
                  />
                </label>

                <button
                  onClick={handleResize}
                  disabled={loading}
                  className={`px-8 py-3 font-semibold rounded-full transition transform text-sm sm:text-base ${
                    loading
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? <Spinner /> : "Resize & Download"}
                </button>
              </div>

            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md flex flex-col items-center">
                  <h3 className="text-gray-300 mb-4 text-lg font-semibold text-center">
                    Preview
                  </h3>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-96 object-contain rounded-lg border border-gray-700 shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
