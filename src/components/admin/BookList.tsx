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

  const handleView = (book: Book) => { setSelectedBook(book); setViewModal(true); };
  const handleEdit = (book: Book) => { setSelectedBook(book); setEditModal(true); };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
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
    void Promise.resolve().then(fetchBooks);
  }, []);

  const columns = [
    {
      name: "#",
      cell: (_row: Book, index: number) => index + 1,
      width: "55px",
    },
    {
      name: "Book Title",
      selector: (row: Book) => row.title,
      sortable: true,
      wrap: true,
      minWidth: "140px",
    },
    {
      name: "Author",
      selector: (row: Book) => row.author,
      wrap: true,
      minWidth: "120px",
    },
    {
      name: "Preview Pages",
      selector: (row: Book) => row.previewPages,
      center: true,
      width: "110px",
    },
    {
      name: "Status",
      cell: (row: Book) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
      width: "90px",
    },
    {
      name: "Action",
      cell: (row: Book) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleView(row)} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg" title="View">
            <FiEye size={15} />
          </button>
          <button onClick={() => handleEdit(row)} className="text-green-600 p-1.5 hover:bg-green-50 rounded-lg" title="Edit">
            <FiEdit size={15} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="text-red-600 p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
            <FiTrash2 size={15} />
          </button>
        </div>
      ),
      width: "105px",
    },
  ];

  const filteredData = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold">Book Management</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
          >
            <FaPlus size={13} />
            Add Book
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search books..."
            className="border rounded-lg px-4 py-2 w-full sm:w-72 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table — allow horizontal scroll on small screens */}
        <div className="overflow-x-auto w-full">
          <DataTable
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
            highlightOnHover
            responsive
          />
        </div>

        <AddBookModal isOpen={openModal} onSuccess={fetchBooks} onClose={() => setOpenModal(false)} />
        <ViewBookModal show={viewModal} onClose={() => setViewModal(false)} book={selectedBook} />
        <EditBookModal show={editModal} onClose={() => setEditModal(false)} book={selectedBook} onSuccess={fetchBooks} />
      </div>
    </AdminLayout>
  );
}