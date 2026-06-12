import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      {/* lg: push right of sidebar | mobile: pt-14 clears the mobile topbar */}
      <div className="lg:ml-72 pt-14 lg:pt-0">
        <Topbar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}