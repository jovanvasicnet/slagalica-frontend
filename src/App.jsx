import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {

  useEffect(() => {

    const interval = setInterval(() => {
      fetch("https://slagalica-1-xzha.onrender.com/ping")
        .catch(() => {});
    }, 240000); 

    return () => clearInterval(interval);

  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
