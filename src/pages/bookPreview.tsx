import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import FlipBookViewer from "../components/FlipBookViewer";

interface Book {
  _id: string;
  title: string;
  author: string;
  shopifyHandle: string;
  previewImages: string[];
  previewPages: number;
  pdfUrl?: string;
}

export default function BookPreview() {
  const { handle } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/handle/${handle}`);
        setBook(res.data.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchBook();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* Page header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            {book.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {book.author}
          </p>
        </div>

        {/* FlipBook — centered, full width on mobile */}
        <div className="flex justify-center w-full overflow-hidden">
          <FlipBookViewer
            images={book.previewImages}
            handle={book.shopifyHandle}
            title={book.title}
            author={book.author}
          />
        </div>
      </div>
    </div>
  );
}