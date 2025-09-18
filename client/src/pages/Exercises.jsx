import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import ExerciseForm from "../components/ExerciseForm.jsx";
import ExerciseList from "../components/ExerciseList.jsx";

export default function ExercisesPage() {
  const [groups] = useState(["Grudi", "Leđa", "Noge", "Ramena", "Ruke", "Stomak", "Core"]);
  const [exercises, setExercises] = useState([]);

  async function fetchExercises() {
    try {
      const data = await apiGet("/exercises/all");
      setExercises(data.exercises || []);
    } catch (e) {
      console.error("Greška vežbe:", e);
    } 
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  const addExercise = async ({ name, type, muscleGroup }) => {
    try {
      await apiPost("/exercises/create", { name, type, muscleGroup });
      await fetchExercises();
    } catch (e) {
      console.error("Greška dodaj vežbu:", e);
    }
  };

  const delExercise = async (id) => {
    try {
      await apiPost("/exercises/delete", { id });
      await fetchExercises();
    } catch (e) {
      console.error("Greška briši vežbu:", e);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section className="card">
        <div className="card-h">Dodaj vežbu</div>
        <ExerciseForm onAdd={addExercise} groups={groups} />
      </section>

      <section className="card">
        <div className="card-h">Vežbe</div>
          <ExerciseList exercises={exercises} onDelete={delExercise} />
      </section>
    </div>
  );
}