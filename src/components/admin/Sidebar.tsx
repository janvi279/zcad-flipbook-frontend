import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const navContent = (
    <>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">ZCAD Admin</h2>
        <p className="text-sm text-gray-500 mt-1">Publication Management</p>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
        >
          <FaBookOpen size={18} />
          <span className="font-medium">Books</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Admin info */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold text-sm shrink-0">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-500">ZCAD Publication</p>
          </div>
        </div>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm"
        >
          <FiLogOut size={16} />
          Logout
        </button>
        <p className="text-xs text-center text-gray-400">© ZCAD Publication</p>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 shadow-sm flex-col z-40">
        {navContent}
      </aside>

      {/* ── Mobile topbar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <HiMenu size={22} />
          </button>
          <h2 className="text-base font-bold text-gray-800">ZCAD Admin</h2>
        </div>

        {/* Logout on mobile topbar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm"
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <HiX size={20} />
        </button>
        {navContent}
      </aside>
    </>
  );
}