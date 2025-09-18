import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ExercisesPage from "./pages/Exercises.jsx";
import WorkoutsPage from "./pages/Workouts.jsx";
import NavTabs from "./components/NavTabs.jsx";
import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <header className="head">
          <div>
            <h1 className="ttl">GymTracker</h1>
            <div className="sub">Profil, vežbe i treninzi — jednostavno i brzo</div>
          </div>
          <NavTabs />
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/vezbe" element={<ExercisesPage />} />
            <Route path="/treninzi" element={<WorkoutsPage />} />
            <Route path="*" element={<div className="card muted">404 — Stranica nije pronađena</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}