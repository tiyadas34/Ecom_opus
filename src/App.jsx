import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CartPage from "./pages/CartPage.jsx";

function App() {
  return (
    <BrowserRouter>
      
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-6 py-3 flex gap-6">
        <Link to="/" className="font-semibold hover:underline">Home</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-6 text-xl">
              Home Page (Add products later)
            </div>
          }
        />

        <Route path="/cart" element={<CartPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;