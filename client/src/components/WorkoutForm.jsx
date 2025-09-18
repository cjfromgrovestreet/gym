import { useState, useMemo } from "react";

/* mali id helper */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function WorkoutForm({ exercises = [], onAdd }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");

  // Više vežbi (svaki red: exerciseId + opcioni set: reps/sec/m)
  const [rows, setRows] = useState([]);

  const noExercisesDefined = exercises.length === 0;

  function addRow() {
    setRows((prev) => [
      {
        id: uid(),
        exerciseId: exercises[0]?.id || "",
        reps: "",
        weight: "",
        timeSec: "",
        distanceM: "",
      },
      ...prev,
    ]);
  }
  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }
  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  // Može da se sačuva kad postoji naslov i bar jedna vežba izabrana
  const canSave = useMemo(() => {
    if (!title.trim() || noExercisesDefined) return false;
    return rows.length > 0 && rows.some((r) => r.exerciseId);
  }, [title, rows, noExercisesDefined]);

  function submit(e) {
    e.preventDefault();
    if (!canSave) return;

    // formiraj items: [{ exerciseId, sets: [ {reps?, timeSec?, distanceM?} ] }]
    const items = rows
      .filter((r) => r.exerciseId) // ignoriši prazne redove
      .map((r) => {
        const setObj = {};
        if (r.reps) setObj.reps = Number(r.reps);
        if (r.weight) setObj.weight = Number(r.weight);
        if (r.timeSec) setObj.timeSec = Number(r.timeSec);
        if (r.distanceM) setObj.distanceM = Number(r.distanceM);
        const sets = Object.keys(setObj).length ? [setObj] : []; // opcioni set
        return { exerciseId: r.exerciseId, sets };
      });

    onAdd({
      id: uid(),
      date,
      title: title.trim(),
      notes: "", // nema beleški u ovoj basic varijanti
      items,
    });

    // reset jednostavno
    setTitle("");
    setRows([]);
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <input
          className="inp"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="inp"
          placeholder="Naziv treninga (npr. Noge / Ruke / Kardio...)"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="sub">
          Broj vežbi: <strong>{rows.length}</strong>
        </div>
        <button
          type="button"
          className="btn"
          onClick={addRow}
          disabled={noExercisesDefined}
        >
          + Dodaj vežbu
        </button>
      </div>

      {/* Redovi za vežbe */}
      {rows.length === 0 ? (
        <div className="muted" style={{ margin: "12px 0" }}>
          Nema dodanih vežbi. Klikni na “+ Dodaj vežbu”.
        </div>
      ) : (
        rows.map((r, i) => (
          <div
            key={r.id}
            className="card"
            style={{ padding: 14, marginBottom: 8, background: "#f8fafc" }}
          >
            <div className="row" style={{ alignItems: "center", gap: 10 }}>
              <select
                className="inp"
                value={r.exerciseId}
                onChange={(e) =>
                  updateRow(r.id, { exerciseId: e.target.value })
                }
                disabled={noExercisesDefined}
                title="Izaberi vežbu"
                style={{ minWidth: 160 }}
              >
                {noExercisesDefined ? (
                  <option value="">
                    Nema vežbi — dodaj ih na stranici Vežbe
                  </option>
                ) : (
                  exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => removeRow(r.id)}
                style={{ marginLeft: 8 }}
              >
                Ukloni
              </button>
            </div>
            <div className="row" style={{ marginTop: 10, gap: 8 }}>
              <input
                className="inp"
                placeholder="Ponavljanja"
                value={r.reps}
                onChange={(e) => updateRow(r.id, { reps: e.target.value })}
                style={{ width: 80 }}
              />
              <input
                className="inp"
                placeholder="Kg"
                value={r.weight}
                onChange={(e) => updateRow(r.id, { weight: e.target.value })}
                style={{ width: 80 }}
              />
              <input
                className="inp"
                placeholder="Sekunde"
                value={r.timeSec}
                onChange={(e) => updateRow(r.id, { timeSec: e.target.value })}
                style={{ width: 80 }}
              />
              <input
                className="inp"
                placeholder="Metri"
                value={r.distanceM}
                onChange={(e) => updateRow(r.id, { distanceM: e.target.value })}
                style={{ width: 80 }}
              />
            </div>
          </div>
        ))
      )}

      <button className="btn" disabled={!canSave}>
        Sačuvaj trening
      </button>

      {noExercisesDefined && (
        <div className="muted">
          Nema definisanih vežbi. Najpre dodaj vežbe na stranici “Vežbe”.
        </div>
      )}
    </form>
  );
}
