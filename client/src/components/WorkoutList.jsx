export default function WorkoutList({ workouts, exercisesById, onDelete }) {
  if (workouts.length === 0) return <div className="muted">Nema treninga.</div>;
  return (
    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
      {workouts.map((w) => (
        <div key={w.id} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 800 }}>{w.title}</div>
              <div className="muted">
                {w.date}
                {w.notes ? ` · ${w.notes}` : ""}
              </div>
            </div>
            <button className="btn-secondary" onClick={() => onDelete(w.id)}>
              Obriši
            </button>
          </div>

          {w.items?.length ? (
            <ul style={{ marginTop: 8 }}>
              {w.items.map((it, idx) => {
                const ex = exercisesById.get(it.exerciseId);
                return (
                  <li key={idx}>
                    <strong>{ex?.name || "Vežba"}</strong>
                    {it.sets?.length ? (
                      <ul>
                        {it.sets.map((s, i) => (
                          <li key={i} className="muted">
                            {s.reps ? `${s.reps}x ` : ""}
                            {s.weight ? `${s.weight}kg ` : ""}
                            {s.timeSec ? `${s.timeSec}s ` : ""}
                            {s.distanceM ? `${s.distanceM}m` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="muted">Nema definisanih setova.</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
