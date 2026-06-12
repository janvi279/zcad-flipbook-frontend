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
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-2xl font-semibold text-gray-800">Book Management</h1>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Admin</p>

          <p className="text-xs text-gray-500">ZCAD Publication</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
          A
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
