import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch } from "../services/api";


/* helperi */
function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}
function daysBetween(aIso, bIso) {
  const a = new Date(aIso), b = new Date(bIso);
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
}
function ageFromDob(d) {
  if (!d) return 0;
  const dob = new Date(d), t = new Date();
  let age = t.getFullYear() - dob.getFullYear();
  const m = t.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < dob.getDate())) age--;
  return age;
}

/* mapiranje BMI → labela + boja */
function bmiInfo(bmi) {
  if (!bmi) return { label: "—", color: "#9aa4b2" };
  if (bmi < 18.5) return { label: "Pothranjenost", color: "#f59e0b" };   // amber
  if (bmi < 25)   return { label: "Normalna telesna masa", color: "#22c55e" }; // green
  if (bmi < 30)   return { label: "Prekomerna telesna masa", color: "#eab308" }; // yellow
  return { label: "Gojaznost", color: "#ef4444" }; // red
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState("");

  async function fetchMe() {
    try {
      const u = await apiGet("/users/me");
      setUser(u);
    } catch (e) {
      console.error("Greška učitavanje korisnika:", e);
      setNotice("Greška pri učitavanju korisnika.");
    }
  }
  useEffect(() => { fetchMe(); }, []);

  // forma state
  const [name, setName] = useState("");
  const [dob, setDob] = useState("1998-01-01");
  const [heightCm, setHeight] = useState("");
  const [weightKg, setWeight] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [validDays, setValidDays] = useState(30);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setDob(user.dateOfBirth || "1998-01-01");
    setHeight(user.heightCm ?? "");
    setWeight(user.weightKg ?? "");
    setBloodType(user.bloodType || "O+");
    setPaidAt(user.membershipPaidAt || new Date().toISOString().slice(0, 10));
    setValidDays(user.membershipValidDays ?? 30);
  }, [user]);

  const validUntil = useMemo(() => addDays(paidAt, Number(validDays || 0)), [paidAt, validDays]);
  const todayIso = new Date().toISOString().slice(0, 10);
  const left = useMemo(() => daysBetween(todayIso, validUntil), [todayIso, validUntil]);
  const expired = left < 0;

  const age = useMemo(() => ageFromDob(dob), [dob]);
  const bmi = useMemo(() => {
    const h = Number(heightCm) / 100, w = Number(weightKg);
    if (!h || !w) return 0;
    return +(w / (h * h)).toFixed(1);
  }, [heightCm, weightKg]);
  const { label: bmiLabel, color: bmiColor } = bmiInfo(bmi);

  async function save(e) {
    e.preventDefault();
    try {
      const res = await apiPatch("/users/me", {
        name,
        dateOfBirth: dob,
        heightCm: Number(heightCm) || 0,
        weightKg: Number(weightKg) || 0,
        bloodType,
        membershipPaidAt: paidAt,
        membershipValidDays: Number(validDays) || 0,
      });
      setUser(res?.user ?? res);
      setNotice(res?.message || `Korisnik je ažuriran: ${(res?.user ?? res)?.name || name}`);
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      console.error("Greška update profila:", err);
      setNotice("Greška pri čuvanju profila.");
    }
  }

  const row = { display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: "10px" };
  const lab = { fontWeight: 600, color: "var(--muted, #9aa4b2)" };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {notice && <div className="card" style={{ color: notice.startsWith("Greška") ? "#fca5a5" : "#86efac" }}>{notice}</div>}

      {/* PROFIL */}
      <div className="card">
        <h2 className="h1" style={{ fontSize: 20, marginBottom: 10 }}>Moj profil</h2>

        <form onSubmit={save} style={{ display: "grid", gap: 10, maxWidth: 760 }}>
          <div style={row}><label style={lab}>Ime i prezime</label><input className="inp" value={name} onChange={e => setName(e.target.value)} /></div>
          <div style={row}><label style={lab}>Datum rođenja</label><input className="inp" type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
          <div style={row}><label style={lab}>Visina (cm)</label><input className="inp" value={heightCm} onChange={e => setHeight(e.target.value)} inputMode="numeric" /></div>
          <div style={row}><label style={lab}>Težina (kg)</label><input className="inp" value={weightKg} onChange={e => setWeight(e.target.value)} inputMode="numeric" /></div>
          <div style={row}><label style={lab}>Krvna grupa</label>
            <select className="select inp" value={bloodType} onChange={e => setBloodType(e.target.value)}>
              {["O-","O+","A-","A+","B-","B+","AB-","AB+"].map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn">Sačuvaj</button>
          </div>
        </form>

        <div className="divider" />

        {/* BMI – vrednost + rang u boji + mini legenda i objašnjenje */}
        <div style={{ display: "grid", gap: 8 }}>
          <div className="row" style={{ alignItems: "center", gap: 12 }}>
            <div style={{ fontWeight: 700 }}>BMI:</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#ffffffff",
                color: "#000000ff",
                border: `1px solid ${bmiColor}`
              }}
              title="Body Mass Index = težina (kg) / (visina (m))²"
            >
              <span style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{bmi || "—"}</span>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: bmiColor }} />
              <span className="muted" style={{ color: bmiColor, fontWeight: 700 }}>{bmiLabel}</span>
            </div>
          </div>

          {/* legenda opsega */}
          <div className="muted" style={{ fontSize: 14 }}>
            <div><strong>Formula:</strong> BMI = težina (kg) / (visina (m))<sup>2</sup>.</div>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.5 }}>
              <li><span style={{ color: "#f59e0b", fontWeight: 700 }}>Pothranjenost</span>: &lt; 18.5</li>
              <li><span style={{ color: "#22c55e", fontWeight: 700 }}>Normalna masa</span>: 18.5 – 24.9</li>
              <li><span style={{ color: "#eab308", fontWeight: 700 }}>Prekomerna masa</span>: 25.0 – 29.9</li>
              <li><span style={{ color: "#ef4444", fontWeight: 700 }}>Gojaznost</span>: ≥ 30.0</li>
            </ul>
            <div style={{ marginTop: 6 }}>
              <em>Napomena:</em> BMI ne razlikuje mišićnu i masnu masu — koristite ga orijentaciono, uz druge mere.
            </div>
          </div>
        </div>
      </div>

      {/* ČLANARINA */}
      <div className="card">
        <h3 className="h1" style={{ fontSize: 18, marginBottom: 8 }}>Članarina</h3>
        <div style={row}><label style={lab}>Plaćeno</label><input className="inp" type="date" value={paidAt} onChange={e => setPaidAt(e.target.value)} /></div>
        <div style={row}><label style={lab}>Trajanje (dana)</label><input className="inp" type="number" value={validDays} onChange={e => setValidDays(e.target.value)} /></div>
        <div className="divider" />
        <div className="sub">Važi do: <strong>{validUntil}</strong></div>
        <div style={{ marginTop: 6, fontWeight: 700, color: expired ? "#fca5a5" : "#86efac" }}>
          {expired ? `Istekla pre ${Math.abs(left)} dana` : `Preostalo dana: ${left}`}
        </div>
      </div>
    </div>  
  );
}