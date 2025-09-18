import { useEffect, useState } from "react";

export default function ExerciseForm({ onAdd, groups = [] }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Snaga"); 
  const [muscleGroup, setMuscleGroup] = useState(groups[0] || "");

  // Ako se lista grupa promeni, uzmi prvu kao default
  useEffect(() => {
    if (groups.length && !muscleGroup) setMuscleGroup(groups[0]);
  }, [groups, muscleGroup]);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      type,                 
      muscleGroup,         
    });
    setName("");
    setType("Snaga");
    setMuscleGroup(groups[0] || "");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
      <input
        className="inp"
        placeholder="Naziv vežbe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="row">
        <select
          className="inp"
          value={type}
          onChange={(e) => setType(e.target.value)}
          title="Tip vežbe"
        >
          <option value="Snaga">Snaga</option>
          <option value="Kardio">Kardio</option>
        </select>

        <select
          className="inp"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          title="Grupa mišića"
        >
          {groups.length === 0 ? (
            <option value="">(Nema grupa)</option>
          ) : (
            groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))
          )}
        </select>
      </div>

      <button className="btn" disabled={!name.trim()}>Dodaj vežbu</button>
    </form>
  );
}