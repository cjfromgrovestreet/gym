import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import WorkoutForm from "../components/WorkoutForm.jsx";
import WorkoutList from "../components/WorkoutList.jsx";

function isSameYearMonth(iso, y, m) {
  const d = new Date(iso);
  return d.getFullYear() === y && d.getMonth() === m;
}

export default function WorkoutsPage() {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);


  async function fetchExercises() {
    const data = await apiGet("/exercises/all");
    setExercises(data.exercises || []);
  }
  async function fetchWorkouts() {
    const data = await apiGet(`/workouts/all`);
    setWorkouts(data.workouts || []);
  }

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([fetchExercises(), fetchWorkouts()]);
      } catch (e) {
        console.error("Greška initial load:", e);
      }
    })();
  }, []);

  const exercisesById = useMemo(
    () => new Map(exercises.map(e => [e.id, e])),
    [exercises]
  );

  const ym = { y: new Date().getFullYear(), m: new Date().getMonth() };
  const thisMonthCount = workouts.filter(w => isSameYearMonth(w.date, ym.y, ym.m)).length;

  const add = async ({ date, title, notes, items }) => {
    try {
      await apiPost("/workouts/create", {
        date,
        title,
        notes,
        items,
      });
      await fetchWorkouts();
    } catch (e) {
      console.error("Greška create workout:", e);
    }
  };

  const del = async (id) => {
    try {
      await apiPost("/workouts/delete", { id });
      await fetchWorkouts();
    } catch (e) {
      console.error("Greška delete workout:", e);
    }
  };


  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <h2 className="h1" style={{ fontSize: 20 }}>Dodaj trening</h2>
        <WorkoutForm exercises={exercises} onAdd={add} />
      </div>

      <div className="two-col">
        <div className="card">
          <h3 className="h1" style={{ fontSize: 18 }}>Statistika (tekući mesec)</h3>
          <div className="sub">
            Broj odrađenih treninga: <strong style={{ color: "#00ff15ff" }}>{thisMonthCount}</strong>
          </div>
        </div>
        <div className="card">
          <h3 className="h1" style={{ fontSize: 18 }}>Brza napomena</h3>
          <div className="sub">Kombinuj snagu i kardio 3–5x nedeljno.</div>
        </div>
      </div>

      <div className="card">
        <h2 className="h1" style={{ fontSize: 20 }}>Moji treninzi</h2>
        <WorkoutList workouts={workouts} exercisesById={exercisesById} onDelete={del} />
      </div>
    </div>
  );
}