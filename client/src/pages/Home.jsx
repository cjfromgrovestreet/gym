// src/pages/Home.jsx
import { NavLink } from "react-router-dom";
// Ako imaš svoje slike, stavi ih u /src/assets i importuj umesto ovih URL-ova.
const imgProfile   = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop";
const imgExercises = "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1200&auto=format&fit=crop";
const imgWorkouts  = "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop";

export default function Home() {
  return (
    <section
      className="page page--home"
      style={{ "--bg": `url(${imgExercises})` }} 
    >
      <div className="page-inner">
        <header className="hero">
          <div className="hero__text">
            <h2 className="ttl">GymTracker</h2>
            <p className="sub">
              Mini aplikacija za profil, vežbe i trening sesije. Izaberi sekciju i kreni!
            </p>
          </div>
        </header>

        <div className="card-grid">
          <article className="card card--link">
            <div className="card__img" style={{ backgroundImage: `url(${imgProfile})` }} />
            <div className="card__body">
              <h3>Profil</h3>
              <p>Osnovni podaci, BMI i članarina.</p>
              <NavLink className="btn" to="/profil">Otvori profil</NavLink>
            </div>
          </article>

          <article className="card card--link">
            <div className="card__img" style={{ backgroundImage: `url(${imgExercises})` }} />
            <div className="card__body">
              <h3>Vežbe</h3>
              <p>Dodaj vežbe i organizuj po grupama mišića.</p>
              <NavLink className="btn" to="/vezbe">Idi na vežbe</NavLink>
            </div>
          </article>

          <article className="card card--link">
            <div className="card__img" style={{ backgroundImage: `url(${imgWorkouts})` }} />
            <div className="card__body">
              <h3>Treninzi</h3>
              <p>Sačuvaj trening, setove i rezultate.</p>
              <NavLink className="btn" to="/treninzi">Idi na treninge</NavLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}