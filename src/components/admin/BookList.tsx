import { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";

import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import DataTable from "react-data-table-component";

import AdminLayout from "../../components/admin/AdminLayout";

import AddBookModal from "../../components/admin/AddBookModal";

import ViewBookModal from "../../components/admin/ViewBookModal";

import EditBookModal from "../../components/admin/EditBookModal";

import { getBooks, deleteBook } from "../../services/bookService";

import type { Book } from "../../types/book";
import toast from "react-hot-toast";

export default function BookList() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks();
      setBooks(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleView = (book: Book) => {
    setSelectedBook(book);

    setViewModal(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);

    setEditModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure?");

    if (!confirmDelete) return;

    try {
      await deleteBook(id);
toast.success("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      console.log(error);
       toast.error("Failed to delete book!");
    }
  };

  useEffect(() => {
    // defer calling fetchBooks so setState is not invoked synchronously within the effect
    void Promise.resolve().then(fetchBooks);
  }, []);

  const columns = [
    {
      name: "#",
      cell: (_row: Book, index: number) => index + 1,
      width: "60px",
    },
    {
      name: "Book Title",
      selector: (row: Book) => row.title,
      sortable: true,
    },
    {
      name: "Author",
      selector: (row: Book) => row.author,
    },
    {
      name: "Preview Pages",
      selector: (row: Book) => row.previewPages,
      center: true,
    },
    {
      name: "Status",
      cell: (row: Book) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            row.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Action",

      cell: (row: Book) => (
        <div className="flex gap-3">
          <button onClick={() => handleView(row)} className="text-blue-600 cursor-pointer">
            <FiEye />
          </button>

          <button onClick={() => handleEdit(row)} className="text-green-600 cursor-pointer">
            <FiEdit />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-600 cursor-pointer"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book Management</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Add Book
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Books..."
            className="border rounded-lg px-4 py-2 w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />

        <AddBookModal
          isOpen={openModal}
          onSuccess={fetchBooks}
          onClose={() => setOpenModal(false)}
        />
        <ViewBookModal
          show={viewModal}
          onClose={() => setViewModal(false)}
          book={selectedBook}
        />

        <EditBookModal
          show={editModal}
          onClose={() => setEditModal(false)}
          book={selectedBook}
          onSuccess={fetchBooks}
        />
      </div>
    </AdminLayout>
  );
}
