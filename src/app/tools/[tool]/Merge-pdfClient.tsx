"use client";

import { useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";
import Spinner from "@/Components/Spinner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FileItem = {
  id: string;
  file: File;
};

function SortableItem({
  item,
  onDelete,
}: {
  item: FileItem;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px 12px",
    marginBottom: "8px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "grab",
    minWidth: "250px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-yellow-500 text-gray-900"
    >
      
      <span className="truncate flex-1" {...listeners}>
        {item.file.name}
      </span>
      
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="text-red-600 hover:text-red-800 cursor-pointer ml-4 p-1 rounded  transition-colors"
        aria-label={`Delete ${item.file.name}`}
      >
        <FaTrash />
      </button>
    </div>
  );
}

export default function MergePDF() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      setFiles((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Select at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f.file));

      const res = await fetch("/api/tools/merge-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError("Merge failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-900 text-yellow-400 min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative z-10 max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Merge PDF</h1>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Upload multiple PDFs, reorder them by dragging, and merge into a
          single file.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        
        <div className="flex justify-center mb-4">
          <label className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition transform bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer hover:-translate-y-1 w-[200px] justify-center">
            <FaUpload /> Upload PDFs
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {files.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={files.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mb-4 flex flex-col items-center gap-2">
                {files.map((f) => (
                  <SortableItem
                    key={f.id}
                    item={f}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {files.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleMerge}
              disabled={loading}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-full transition transform w-[200px] sm:w-[250px] ${
                loading
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:-translate-y-1"
              }`}
            >
              {loading ? <Spinner /> : "Merge PDFs"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}