export default function ExerciseList({ exercises, onDelete }) {
  if (exercises.length === 0) return <div className="muted">Nema vežbi.</div>;

  return (
    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
      {exercises.map((e) => (
        <div
          key={e.id}
          className="card"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>{e.name}</div>
            <div className="muted">
              {e.type} {e.muscleGroup ? `· ${e.muscleGroup}` : ""}
            </div>
          </div>
          <button className="btn-secondary" onClick={() => onDelete(e.id)}>
            Obriši
          </button>
        </div>
      ))}
    </div>
  );
}