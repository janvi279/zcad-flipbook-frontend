import React, { useState, useEffect } from "react";
import { updateBook } from "../../services/bookService";
import toast from "react-hot-toast";

interface EditBookModalProps {
  show: boolean;
  onClose: () => void;
  book?: {
    _id: string;
    title?: string;
    author?: string;
    shopifyHandle?: string;
  } | null;
  onSuccess: () => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  show,
  onClose,
  book,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    shopifyHandle: "",
  });

  const [pdf, setPdf] = useState<File | null>(null);
   const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (book) {
      // defer to a microtask to avoid calling setState synchronously within the effect
      Promise.resolve().then(() =>
        setFormData({
          title: book.title || "",
          author: book.author || "",
          shopifyHandle: book.shopifyHandle || "",
        })
      );
    }
  }, [book]);

  const handleSubmit = async () => {
    if (!book) return;

    try {
       setUploading(true);
      const data = new FormData();

      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("shopifyHandle", formData.shopifyHandle);

      if (pdf) {
        data.append("pdf", pdf);
      }

      await updateBook(book._id, data);
         toast.success("Book updated successfully!");

      onSuccess();
      onClose();

      setPdf(null);
    } catch (error) {
      console.error("Update Book Error:", error);
      toast.error("Failed to update book!");
    }
    finally {
      setUploading(false);
    }
  };

  if (!show || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-5">Edit Book</h2>

        {/* Title */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Author */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                author: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Shopify Handle */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Shopify Handle</label>
          <input
            type="text"
            value={formData.shopifyHandle}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shopifyHandle: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* PDF Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Change PDF (Optional)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="w-full border border-dashed border-gray-300 rounded-lg p-4"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
              {uploading ? "Update..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookModal;
