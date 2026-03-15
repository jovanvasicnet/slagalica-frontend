import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import CreateTournament from "./pages/CreateTournament";
import TournamentTeams from "./pages/TournamentTeams";


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

        <Route path="/admin/panel" element={<AdminPanel />} />

        <Route path="/admin/create" element={<CreateTournament />} />     

        <Route path="/admin/tournament/:id" element={<TournamentTeams />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
