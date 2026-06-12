import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    // hidden on mobile — Sidebar already shows the mobile topbar with hamburger
    <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Book Management</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Admin</p>
          <p className="text-xs text-gray-500">ZCAD Publication</p>
        </div>

        <div className="h-9 w-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold text-sm">
          A
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all text-sm"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}