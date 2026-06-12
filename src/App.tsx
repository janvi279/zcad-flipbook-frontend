import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookPreview from "./pages/bookPreview";
import BookList from "./components/admin/BookList";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Routes>
          {/* Public */}

          <Route path="/preview/:handle" element={<BookPreview />} />

          <Route path="/login" element={<Login />} />

          {/* Protected */}

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            }
          />

          {/* 404 */}

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold">Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
