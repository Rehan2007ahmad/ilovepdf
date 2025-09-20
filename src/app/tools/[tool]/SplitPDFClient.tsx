"use client";

import { useState } from "react";
import { FaUpload, FaTrash, FaPlus, FaHandScissors } from "react-icons/fa";
import Spinner from "@/Components/Spinner";

type SplitRange = {
  id: string;
  startPage: number;
  endPage: number;
  name: string;
};

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/tools/pdf-info", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setTotalPages(data.pageCount);

        setSplitRanges([
          {
            id: crypto.randomUUID(),
            startPage: 1,
            endPage: data.pageCount,
            name: "Full Document",
          },
        ]);
      }
    } catch (err) {
      console.error("Error getting PDF info:", err);
      setTotalPages(0);
    }
  };

  const addSplitRange = () => {
    const newRange: SplitRange = {
      id: crypto.randomUUID(),
      startPage: 1,
      endPage: totalPages,
      name: `Split ${splitRanges.length + 1}`,
    };
    setSplitRanges((prev) => [...prev, newRange]);
  };

  const updateSplitRange = (
    id: string,
    field: keyof SplitRange,
    value: string | number
  ) => {
    setSplitRanges((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, [field]: value } : range
      )
    );
  };

  const deleteSplitRange = (id: string) => {
    setSplitRanges((prev) => prev.filter((range) => range.id !== id));
  };

  const validateRanges = (): boolean => {
    for (const range of splitRanges) {
      if (range.startPage < 1 || range.endPage > totalPages) {
        setError(`Page range must be between 1 and ${totalPages}`);
        return false;
      }
      if (range.startPage > range.endPage) {
        setError("Start page cannot be greater than end page");
        return false;
      }
    }
    return true;
  };

  const handleSplit = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    if (splitRanges.length === 0) {
      setError("Please add at least one split range.");
      return;
    }

    if (!validateRanges()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ranges", JSON.stringify(splitRanges));

      const res = await fetch("/api/tools/split-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Split failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "split-pdfs.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setTotalPages(0);
    setSplitRanges([]);
    setError(null);
  };

  return (
    <section className="relative bg-gray-900 text-yellow-400 min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="relative z-10 max-w-3xl w-full text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Split PDF</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Upload a PDF file and split it into multiple documents by page ranges.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center mb-6">
          <label className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition transform bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1 w-[200px] justify-center">
            <FaUpload /> Upload PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {file && (
          <div className="mb-6">
            <div className="bg-yellow-500 text-gray-900 inline-flex items-center justify-between px-4 py-2 rounded-full mb-4 max-w-md">
              <span className="truncate mr-4 font-semibold capitalize">
                {file.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">
                  ({totalPages} pages)
                </span>
                <button
                  onClick={clearFile}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  aria-label="Remove file"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        )}

        {file && totalPages > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h3 className="text-xl font-semibold">Split Ranges</h3>
              <button
                onClick={addSplitRange}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-full transition-colors font-semibold"
              >
                <FaPlus className="text-sm" /> Add Range
              </button>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {splitRanges.map((range) => (
                <div
                  key={range.id}
                  className="bg-gray-800/10 rounded-2xl p-6 border border-gray-700/20"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col items-center">
                      <label className="text-sm font-medium mb-2 text-yellow-400">
                        Name
                      </label>
                      <input
                        type="text"
                        value={range.name}
                        onChange={(e) =>
                          updateSplitRange(range.id, "name", e.target.value)
                        }
                        className="w-[200px] md:w-full px-4 py-2 sm:py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full text-center focus:bg-yellow-400 focus:outline-none transition-colors placeholder-gray-700"
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <label className="text-sm font-medium mb-2 text-yellow-400">
                        Start Page
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={range.startPage}
                        onChange={(e) =>
                          updateSplitRange(
                            range.id,
                            "startPage",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-[200px] md:w-full px-4 py-2 sm:py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full text-center focus:bg-yellow-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <label className="text-sm font-medium mb-2 text-yellow-400">
                        End Page
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={range.endPage}
                        onChange={(e) =>
                          updateSplitRange(
                            range.id,
                            "endPage",
                            parseInt(e.target.value) || totalPages
                          )
                        }
                        className="w-[200px] md:w-full px-4 py-2 sm:py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full text-center focus:bg-yellow-400 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="hidden md:block h-6 mb-2"></div>
                      <button
                        onClick={() => deleteSplitRange(range.id)}
                        className="flex items-center justify-center gap-2 w-[200px] md:w-auto px-4 py-2 sm:py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 rounded-full transition-colors font-semibold"
                        aria-label={`Delete ${range.name}`}
                      >
                        <FaTrash className="text-sm" />
                        Delete Range
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                      Pages {range.startPage} to {range.endPage}
                      <span className="text-yellow-300">
                        • {Math.max(0, range.endPage - range.startPage + 1)}{" "}
                        pages
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {file && splitRanges.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleSplit}
              disabled={loading}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition transform w-[200px] sm:w-[250px] justify-center ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <FaHandScissors /> Split PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}