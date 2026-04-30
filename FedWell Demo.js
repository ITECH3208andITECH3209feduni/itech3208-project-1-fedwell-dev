import React, { useState, useEffect } from "react";

const THEME = {
  navy: "#1F4E79", blue: "#2E75B6", teal: "#00897B",
  mint: "#E0F2F1", light: "#DEEAF1", white: "#FFFFFF",
  offwhite: "#F4F8FB", grey: "#64748B", dark: "#1A1A2E",
  red: "#C62828", green: "#2E7D32", gold: "#F9A825",
  lightRed: "#FFEBEE", lightGreen: "#E8F5E9",
};

const RANGES = {
  bp_sys:   { low: 90,  high: 140, unit: "mmHg" },
  bp_dia:   { low: 60,  high: 90,  unit: "mmHg" },
  pulse:    { low: 60,  high: 100, unit: "bpm"  },
  resp:     { low: 12,  high: 20,  unit: "br/min" },
  oxysat:   { low: 95,  high: 100, unit: "%" },
  temp:     { low: 36.1,high: 37.2,unit: "°C" },
  bmi:      { low: 18.5,high: 24.9,unit: "kg/m²" },
  diab_risk:{ low: 0,   high: 11,  unit: "pts" },
};

function isFlag(metric, val) {
  const r = RANGES[metric];
  if (!r || val === "" || isNaN(Number(val))) return false;
  const v = Number(val);
  return v < r.low || v > r.high;
}

const HEALTH_LINKS = {
  bp_sys:    "Heart Foundation Australia — heartfoundation.org.au",
  bp_dia:    "Heart Foundation Australia — heartfoundation.org.au",
  pulse:     "Healthdirect Australia — healthdirect.gov.au",
  resp:      "Lung Foundation Australia — lungfoundation.com.au",
  oxysat:    "Lung Foundation Australia — lungfoundation.com.au",
  temp:      "Healthdirect Australia — healthdirect.gov.au",
  bmi:       "Obesity Australia — obesityaustralia.org",
  diab_risk: "Diabetes Australia — diabetesaustralia.com.au",
};

const METRIC_ICONS = {
  bp:    "🩸", pulse: "❤️", resp: "🫁",
  oxy:   "💧", temp:  "🌡️", body: "📏",
  bmi:   "⚖️", diab:  "🩺", other:"📝",
};

const SESSIONS_KEY = "fedwell_sessions";

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]"); }
  catch { return []; }
}

function saveSessions(sessions) {
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)); } catch {}
}

function genId() {
  const n = (loadSessions().length + 1).toString().padStart(4, "0");
  return "FW-" + n;
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole]     = useState(null);
  const [loginErr, setLoginErr] = useState("");
  const [creds, setCreds]   = useState({ username: "", password: "" });

  const [client, setClient] = useState({ name:"", age:"", dob:"", gender:"", seen_gp:"", location:"Ballarat" });
  const [nurses, setNurses] = useState({ student:"", registered:"" });
  const [metrics, setMetrics] = useState({ bp_sys:"", bp_dia:"", pulse:"", resp:"", oxysat:"", temp:"", waist:"", height:"", bmi:"", diab_risk:"", other:"" });
  const [metricStep, setMetricStep] = useState(0);
  const [sessions, setSessions] = useState(loadSessions);
  const [reportId, setReportId] = useState(null);
  const [dashFilter, setDashFilter] = useState("all");

  useEffect(() => { saveSessions(sessions); }, [sessions]);

  // auto-calc BMI
  useEffect(() => {
    const h = parseFloat(metrics.height), w = parseFloat(metrics.waist);
    if (h > 0 && w > 0) {
      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      setMetrics(m => ({ ...m, bmi }));
    }
  }, [metrics.height, metrics.waist]);

  function login() {
    if (creds.username === "nurse" && creds.password === "fedwell") { setRole("staff"); setScreen("client_details"); setLoginErr(""); }
    else if (creds.username === "supervisor" && creds.password === "teacher123") { setRole("supervisor"); setScreen("dashboard"); setLoginErr(""); }
    else setLoginErr("Invalid credentials. Try nurse/fedwell or supervisor/teacher123");
  }

  function submitHealthCheck() {
    const id = genId();
    const record = {
      id, check_date: new Date().toISOString().split("T")[0],
      age: client.age, dob: client.dob, gender: client.gender,
      seen_gp: client.seen_gp, location: client.location,
      student_nurse: nurses.student, registered_nurse: nurses.registered,
      ...metrics,
    };
    setSessions(s => [record, ...s]);
    setReportId(id);
    setScreen("report");
  }

  function resetAll() {
    setClient({ name:"", age:"", dob:"", gender:"", seen_gp:"", location:"Ballarat" });
    setNurses({ student:"", registered:"" });
    setMetrics({ bp_sys:"", bp_dia:"", pulse:"", resp:"", oxysat:"", temp:"", waist:"", height:"", bmi:"", diab_risk:"", other:"" });
    setMetricStep(0); setReportId(null);
    setScreen("client_details");
  }

  function logout() { setRole(null); setScreen("landing"); resetAll(); }

  const METRIC_SCREENS = [
    { key: "bp",   label: "Blood Pressure",        icon: "🩸", fields: [
      { k:"bp_sys", label:"Systolic", unit:"mmHg" },
      { k:"bp_dia", label:"Diastolic", unit:"mmHg" },
    ]},
    { key: "pulse",label: "Pulse Rate",             icon: "❤️", fields:[{ k:"pulse", label:"Pulse", unit:"bpm" }]},
    { key: "resp", label: "Respiratory Rate",       icon: "🫁", fields:[{ k:"resp",  label:"Rate",  unit:"br/min" }]},
    { key: "oxy",  label: "Oxygen Saturation",      icon: "💧", fields:[{ k:"oxysat",label:"SpO₂",  unit:"%" }]},
    { key: "temp", label: "Body Temperature",       icon: "🌡️", fields:[{ k:"temp",  label:"Temp",  unit:"°C" }]},
    { key: "body", label: "Body Measurements",      icon: "📏", fields:[
      { k:"height",label:"Height",unit:"cm" },
      { k:"waist", label:"Waist", unit:"cm" },
    ]},
    { key: "bmi",  label: "BMI",                   icon: "⚖️", fields:[{ k:"bmi",   label:"BMI",   unit:"kg/m²", readonly:true }]},
    { key: "diab", label: "Diabetes Risk Score",   icon: "🩺", fields:[{ k:"diab_risk",label:"Score",unit:"pts" }]},
    { key: "other",label: "Other Observations",    icon: "📝", fields:[{ k:"other", label:"Notes", textarea:true }]},
  ];

  const currentMetric = METRIC_SCREENS[metricStep];
  const flaggedMetrics = Object.entries(metrics).filter(([k, v]) => isFlag(k, v));
  const reportSession = sessions.find(s => s.id === reportId);

  const styles = {
    app: { fontFamily:"'Segoe UI', system-ui, sans-serif", minHeight:"100vh", background:"linear-gradient(135deg, #e8f4fd 0%, #deeaf1 30%, #e0f2f1 60%, #f0f9ff 100%)", color:THEME.dark },
    header: { background:THEME.navy, color:"white", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" },
    headerTitle: { fontSize:18, fontWeight:700, letterSpacing:0.5 },
    headerSub: { fontSize:12, opacity:0.7, marginTop:2 },
    logoutBtn: { background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", color:"white", padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:13 },
    card: { background:"rgba(255,255,255,0.88)", borderRadius:12, padding:24, boxShadow:"0 4px 20px rgba(31,78,121,0.10)", border:"1px solid rgba(255,255,255,0.7)", marginBottom:16 },
    btn: { background:THEME.blue, color:"white", border:"none", padding:"12px 28px", borderRadius:8, cursor:"pointer", fontSize:15, fontWeight:600, transition:"all 0.2s" },
    btnTeal: { background:THEME.teal, color:"white", border:"none", padding:"12px 28px", borderRadius:8, cursor:"pointer", fontSize:15, fontWeight:600 },
    btnGrey: { background:"#e2e8f0", color:THEME.grey, border:"none", padding:"12px 28px", borderRadius:8, cursor:"pointer", fontSize:15, fontWeight:600 },
    btnBig: { background:THEME.navy, color:"white", border:"none", padding:"20px 32px", borderRadius:12, cursor:"pointer", fontSize:16, fontWeight:700, display:"block", width:"100%", marginBottom:12, textAlign:"left", transition:"all 0.2s" },
    label: { fontSize:13, fontWeight:600, color:THEME.grey, marginBottom:4, display:"block" },
    input: { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:15, outline:"none", boxSizing:"border-box", transition:"border 0.2s" },
    inputFlag: { borderColor: THEME.red, background: THEME.lightRed },
    section: { maxWidth:720, margin:"0 auto", padding:"24px 16px" },
    pill: { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 },
    progressBar: { display:"flex", gap:6, marginBottom:24 },
    progressDot: (active, done) => ({
      width: active ? 28 : 10, height:10, borderRadius:5,
      background: done ? THEME.teal : active ? THEME.blue : "#d1d5db",
      transition:"all 0.3s",
    }),
  };

  // ── LANDING ─────────────────────────────────────────────────────────────
  if (screen === "landing") return (
    <div style={styles.app}>
      <div style={{ ...styles.header }}>
        <div>
          <div style={styles.headerTitle}>🏥 FedWELL</div>
          <div style={styles.headerSub}>Health Check Recording Website</div>
        </div>
        <div style={{ fontSize:12, opacity:0.6 }}>Federation University · Nursing Gippsland</div>
      </div>
      <div style={{ ...styles.section, paddingTop:48 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ background:"linear-gradient(135deg, #1F4E79 0%, #2E75B6 50%, #00897B 100%)", borderRadius:20, padding:"32px 24px", marginBottom:28, boxShadow:"0 8px 32px rgba(31,78,121,0.18)" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🏥</div>
            <div style={{ fontSize:36, fontWeight:800, color:"white", marginBottom:8, textShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>Welcome to FedWELL</div>
            <div style={{ fontSize:16, color:"rgba(255,255,255,0.85)" }}>Digital health check recording for pop-up community clinics</div>
            <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:20 }}>
              {[["🏥","Health Checks"],["📊","Analytics"],["🔒","De-identified"],["📍","Multi-site"]].map(([icon, label]) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22 }}>{icon}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth:400, margin:"0 auto" }}>
          <button style={{ ...styles.btnBig, background:THEME.navy }} onClick={() => setScreen("login_staff")}>
            <span style={{ fontSize:24 }}>🩺</span>
            <div style={{ marginTop:8 }}>Health Check Portal</div>
            <div style={{ fontSize:13, opacity:0.7, fontWeight:400, marginTop:4 }}>For nursing staff — enter patient data</div>
          </button>
          <button style={{ ...styles.btnBig, background:THEME.teal }} onClick={() => setScreen("login_supervisor")}>
            <span style={{ fontSize:24 }}>📊</span>
            <div style={{ marginTop:8 }}>Supervisor Dashboard</div>
            <div style={{ fontSize:13, opacity:0.7, fontWeight:400, marginTop:4 }}>For supervisors — view analytics</div>
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:32, fontSize:12, color:THEME.grey }}>
          Credentials: nurse / fedwell &nbsp;·&nbsp; supervisor / teacher123
        </div>
      </div>
    </div>
  );

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (screen === "login_staff" || screen === "login_supervisor") {
    const isStaff = screen === "login_staff";
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div><div style={styles.headerTitle}>🏥 FedWELL</div></div>
          <button style={styles.logoutBtn} onClick={() => setScreen("landing")}>← Back</button>
        </div>
        <div style={{ ...styles.section, paddingTop:48 }}>
          <div style={{ maxWidth:400, margin:"0 auto" }}>
            <div style={{ ...styles.card, borderTop:"none", background:`linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(${isStaff?"46,117,182":"0,137,123"},0.06) 100%)`, borderLeft:`4px solid ${isStaff ? THEME.blue : THEME.teal}` }}>
              <div style={{ fontSize:22, fontWeight:700, color:THEME.navy, marginBottom:4 }}>
                {isStaff ? "🩺 Health Check Portal" : "📊 Supervisor Login"}
              </div>
              <div style={{ fontSize:14, color:THEME.grey, marginBottom:24 }}>
                {isStaff ? "Nursing staff access" : "Supervisor & analytics access"}
              </div>
              <label style={styles.label}>Username</label>
              <input style={{ ...styles.input, marginBottom:16 }} value={creds.username}
                onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
                placeholder={isStaff ? "nurse" : "supervisor"} />
              <label style={styles.label}>Password</label>
              <input style={{ ...styles.input, marginBottom:8 }} type="password" value={creds.password}
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="••••••••" />
              {loginErr && <div style={{ color:THEME.red, fontSize:13, marginBottom:12 }}>{loginErr}</div>}
              <button style={{ ...styles.btn, width:"100%", marginTop:16, background: isStaff ? THEME.blue : THEME.teal }}
                onClick={login}>Log In</button>
            </div>
            <div style={{ textAlign:"center", fontSize:12, color:THEME.grey }}>
              Hint: {isStaff ? "nurse / fedwell" : "supervisor / teacher123"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CLIENT DETAILS ────────────────────────────────────────────────────────
  if (screen === "client_details") return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div><div style={styles.headerTitle}>🏥 FedWELL</div><div style={styles.headerSub}>New Health Check</div></div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
      <div style={styles.section}>
        <div style={{ ...styles.card, borderTop:`4px solid ${THEME.blue}` }}>
          <div style={{ fontSize:18, fontWeight:700, color:THEME.navy, marginBottom:20 }}>Patient Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div>
              <label style={styles.label}>Full Name (report only — not stored)</label>
              <input style={styles.input} value={client.name}
                onChange={e => setClient(c => ({ ...c, name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div>
              <label style={styles.label}>Age</label>
              <input style={styles.input} type="number" value={client.age}
                onChange={e => setClient(c => ({ ...c, age: e.target.value }))} placeholder="45" />
            </div>
            <div>
              <label style={styles.label}>Date of Birth</label>
              <input style={styles.input} type="date" value={client.dob}
                onChange={e => setClient(c => ({ ...c, dob: e.target.value }))} />
            </div>
            <div>
              <label style={styles.label}>Location</label>
              <select style={styles.input} value={client.location}
                onChange={e => setClient(c => ({ ...c, location: e.target.value }))}>
                {["Ballarat","Farm World","Men's Shed","Gippsland Campus","Other"].map(l =>
                  <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={styles.label}>Gender</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["Male","Female","Non-Binary","Prefer not to say","Other"].map(g => (
                <button key={g} onClick={() => setClient(c => ({ ...c, gender: g }))}
                  style={{ padding:"8px 16px", borderRadius:20, border:`2px solid ${client.gender===g?THEME.blue:"#e2e8f0"}`,
                    background:client.gender===g?THEME.light:"white", color:client.gender===g?THEME.navy:THEME.grey,
                    cursor:"pointer", fontSize:13, fontWeight:client.gender===g?600:400 }}>{g}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={styles.label}>Seen a GP in the last 12 months?</label>
            <div style={{ display:"flex", gap:8 }}>
              {["Yes","No"].map(v => (
                <button key={v} onClick={() => setClient(c => ({ ...c, seen_gp: v }))}
                  style={{ padding:"8px 24px", borderRadius:20, border:`2px solid ${client.seen_gp===v?(v==="Yes"?THEME.teal:THEME.red):"#e2e8f0"}`,
                    background:client.seen_gp===v?(v==="Yes"?THEME.mint:THEME.lightRed):"white",
                    cursor:"pointer", fontSize:14, fontWeight:600,
                    color:client.seen_gp===v?(v==="Yes"?THEME.teal:THEME.red):THEME.grey }}>{v}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ ...styles.card, borderTop:`4px solid ${THEME.teal}` }}>
          <div style={{ fontSize:18, fontWeight:700, color:THEME.navy, marginBottom:20 }}>Nurse Details</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={styles.label}>Student Nurse Name</label>
              <input style={styles.input} value={nurses.student}
                onChange={e => setNurses(n => ({ ...n, student: e.target.value }))} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={styles.label}>Registered Nurse Name</label>
              <input style={styles.input} value={nurses.registered}
                onChange={e => setNurses(n => ({ ...n, registered: e.target.value }))} placeholder="Jane Citizen" />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <button style={styles.btn} onClick={() => { setMetricStep(0); setScreen("metric_entry"); }}>
            Continue to Health Check →
          </button>
        </div>
      </div>
    </div>
  );

  // ── METRIC ENTRY ──────────────────────────────────────────────────────────
  if (screen === "metric_entry") {
    const ms = currentMetric;
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div><div style={styles.headerTitle}>🏥 FedWELL</div><div style={styles.headerSub}>Health Check · Step {metricStep+1} of {METRIC_SCREENS.length}</div></div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <select style={{ padding:"6px 10px", borderRadius:6, fontSize:13, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white" }}
              value={metricStep} onChange={e => setMetricStep(Number(e.target.value))}>
              {METRIC_SCREENS.map((m, i) => <option key={i} value={i} style={{ color:"black" }}>{m.label}</option>)}
            </select>
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </div>
        <div style={styles.section}>
          {/* Client summary */}
          <div style={{ background:THEME.light, borderRadius:10, padding:"12px 20px", marginBottom:16, display:"flex", gap:24, flexWrap:"wrap", fontSize:13 }}>
            <span><b>Patient:</b> {client.name||"—"}</span>
            <span><b>Age:</b> {client.age||"—"}</span>
            <span><b>Gender:</b> {client.gender||"—"}</span>
            <span><b>Nurse:</b> {nurses.student||"—"}</span>
            <span><b>Location:</b> {client.location}</span>
          </div>
          {/* Progress */}
          <div style={styles.progressBar}>
            {METRIC_SCREENS.map((_, i) => (
              <div key={i} style={styles.progressDot(i===metricStep, i<metricStep)} />
            ))}
          </div>
          {/* Metric card */}
          <div style={{ ...styles.card, borderTop:`4px solid ${THEME.blue}`, background:"linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(222,234,241,0.5) 100%)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <span style={{ fontSize:40 }}>{ms.icon}</span>
              <div>
                <div style={{ fontSize:22, fontWeight:700, color:THEME.navy }}>{ms.label}</div>
                {ms.fields[0] && RANGES[ms.fields[0].k] && (
                  <div style={{ fontSize:13, color:THEME.grey }}>
                    Normal range: {RANGES[ms.fields[0].k].low} – {RANGES[ms.fields[0].k].high} {RANGES[ms.fields[0].k].unit}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: ms.fields.length > 1 ? "1fr 1fr" : "1fr", gap:16 }}>
              {ms.fields.map(f => {
                const flagged = isFlag(f.k, metrics[f.k]);
                return (
                  <div key={f.k}>
                    <label style={styles.label}>{f.label} {f.unit && <span style={{ fontWeight:400 }}>({f.unit})</span>}</label>
                    {f.textarea ? (
                      <textarea style={{ ...styles.input, height:100, resize:"vertical" }} value={metrics[f.k]}
                        onChange={e => setMetrics(m => ({ ...m, [f.k]: e.target.value }))}
                        placeholder="Enter any additional observations..." />
                    ) : (
                      <input style={{ ...styles.input, ...(flagged ? styles.inputFlag : {}), ...(f.readonly ? { background:"#f0f9ff", color:THEME.blue, fontWeight:700 } : {}) }}
                        type={f.textarea ? "text" : "number"} step="0.1" readOnly={f.readonly}
                        value={metrics[f.k]} onChange={e => setMetrics(m => ({ ...m, [f.k]: e.target.value }))}
                        placeholder="Enter value" />
                    )}
                    {flagged && (
                      <div style={{ color:THEME.red, fontSize:12, marginTop:4, fontWeight:600 }}>
                        ⚠ Out of range — {HEALTH_LINKS[f.k]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <button style={styles.btnGrey} onClick={() => metricStep > 0 ? setMetricStep(s => s-1) : setScreen("client_details")}>
              ← Previous
            </button>
            {metricStep < METRIC_SCREENS.length - 1 ? (
              <button style={styles.btn} onClick={() => setMetricStep(s => s+1)}>Save & Next →</button>
            ) : (
              <button style={{ ...styles.btn, background:THEME.teal }} onClick={() => setScreen("review")}>
                Review & Submit →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW ────────────────────────────────────────────────────────────────
  if (screen === "review") return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div><div style={styles.headerTitle}>🏥 FedWELL</div><div style={styles.headerSub}>Review Health Data</div></div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
      <div style={styles.section}>
        <div style={{ ...styles.card, borderTop:`4px solid ${THEME.navy}`, background:"linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(232,240,248,0.6) 100%)" }}>
          <div style={{ fontSize:18, fontWeight:700, color:THEME.navy, marginBottom:16 }}>Confirm before submitting</div>
          <div style={{ background:THEME.light, borderRadius:8, padding:16, marginBottom:16, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:14 }}>
            <span><b>Patient:</b> {client.name||"—"}</span>
            <span><b>Age:</b> {client.age||"—"}</span>
            <span><b>Gender:</b> {client.gender||"—"}</span>
            <span><b>GP Visit:</b> {client.seen_gp||"—"}</span>
            <span><b>Location:</b> {client.location}</span>
            <span><b>Student Nurse:</b> {nurses.student||"—"}</span>
            <span><b>Reg. Nurse:</b> {nurses.registered||"—"}</span>
            <span><b>Date:</b> {new Date().toLocaleDateString("en-AU")}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[
              ["Blood Pressure", `${metrics.bp_sys||"—"}/${metrics.bp_dia||"—"} mmHg`, isFlag("bp_sys",metrics.bp_sys)||isFlag("bp_dia",metrics.bp_dia)],
              ["Pulse", `${metrics.pulse||"—"} bpm`, isFlag("pulse",metrics.pulse)],
              ["Resp Rate", `${metrics.resp||"—"} br/min`, isFlag("resp",metrics.resp)],
              ["SpO₂", `${metrics.oxysat||"—"} %`, isFlag("oxysat",metrics.oxysat)],
              ["Temperature", `${metrics.temp||"—"} °C`, isFlag("temp",metrics.temp)],
              ["Height / Waist", `${metrics.height||"—"} / ${metrics.waist||"—"} cm`, false],
              ["BMI", `${metrics.bmi||"—"} kg/m²`, isFlag("bmi",metrics.bmi)],
              ["Diabetes Risk", `${metrics.diab_risk||"—"} pts`, isFlag("diab_risk",metrics.diab_risk)],
              ["Other Notes", metrics.other||"—", false],
            ].map(([label, value, flagged]) => (
              <div key={label} style={{ background: flagged ? THEME.lightRed : "#f8fafc", borderRadius:8, padding:"10px 14px",
                border:`1px solid ${flagged ? THEME.red : "#e2e8f0"}` }}>
                <div style={{ fontSize:11, fontWeight:600, color: flagged ? THEME.red : THEME.grey, marginBottom:2 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:700, color: flagged ? THEME.red : THEME.dark }}>{value}</div>
                {flagged && <div style={{ fontSize:10, color:THEME.red }}>⚠ Out of range</div>}
              </div>
            ))}
          </div>
          {flaggedMetrics.length > 0 && (
            <div style={{ background:THEME.lightRed, borderRadius:8, padding:12, marginTop:16, border:`1px solid ${THEME.red}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:THEME.red, marginBottom:4 }}>
                ⚠ {flaggedMetrics.length} out-of-range reading{flaggedMetrics.length>1?"s":""} detected
              </div>
              <div style={{ fontSize:12, color:THEME.red }}>Health education resources will be included on the patient report.</div>
            </div>
          )}
          <div style={{ background:"#fffbeb", borderRadius:8, padding:12, marginTop:12, border:"1px solid #fcd34d", fontSize:12, color:"#92400e" }}>
            🔒 Privacy notice: The patient's name will appear on the printed report only. It will NOT be stored in the database.
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <button style={styles.btnGrey} onClick={() => { setMetricStep(METRIC_SCREENS.length-1); setScreen("metric_entry"); }}>
            ← Edit readings
          </button>
          <button style={{ ...styles.btn, background:THEME.green }} onClick={submitHealthCheck}>
            ✓ Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );

  // ── REPORT ────────────────────────────────────────────────────────────────
  if (screen === "report") {
    const s = reportSession;
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div><div style={styles.headerTitle}>🏥 FedWELL</div><div style={styles.headerSub}>Health Report — {s?.id}</div></div>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
        <div style={styles.section}>
          <div style={{ ...styles.card, borderTop:`4px solid ${THEME.green}`, background:"linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(232,245,233,0.6) 100%)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:700, color:THEME.navy }}>Health Check Report</div>
                <div style={{ fontSize:13, color:THEME.grey }}>Session: {s?.id} · {s?.check_date} · {s?.location}</div>
              </div>
              <div style={{ background:THEME.lightGreen, color:THEME.green, padding:"6px 16px", borderRadius:20, fontSize:13, fontWeight:700 }}>
                ✓ Saved
              </div>
            </div>
            <div style={{ background:THEME.light, borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:14 }}>
              <b>Patient:</b> {client.name||"—"} &nbsp;·&nbsp;
              <b>Age:</b> {s?.age||"—"} &nbsp;·&nbsp;
              <b>Gender:</b> {s?.gender||"—"} &nbsp;·&nbsp;
              <b>GP Visit (12m):</b> {s?.seen_gp||"—"}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr style={{ background:THEME.navy, color:"white" }}>
                  <th style={{ padding:"10px 14px", textAlign:"left", borderRadius:"8px 0 0 0" }}>Assessment</th>
                  <th style={{ padding:"10px 14px", textAlign:"center" }}>Result</th>
                  <th style={{ padding:"10px 14px", textAlign:"center" }}>Status</th>
                  <th style={{ padding:"10px 14px", textAlign:"left", borderRadius:"0 8px 0 0" }}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Blood Pressure", `${s?.bp_sys||"—"}/${s?.bp_dia||"—"} mmHg`, isFlag("bp_sys",s?.bp_sys)||isFlag("bp_dia",s?.bp_dia), "bp_sys"],
                  ["Pulse Rate",     `${s?.pulse||"—"} bpm`,                    isFlag("pulse",s?.pulse), "pulse"],
                  ["Respiratory Rate",`${s?.resp||"—"} br/min`,                 isFlag("resp",s?.resp),   "resp"],
                  ["Oxygen Saturation",`${s?.oxysat||"—"} %`,                   isFlag("oxysat",s?.oxysat),"oxysat"],
                  ["Body Temperature", `${s?.temp||"—"} °C`,                    isFlag("temp",s?.temp),   "temp"],
                  ["BMI",             `${s?.bmi||"—"} kg/m²`,                   isFlag("bmi",s?.bmi),     "bmi"],
                  ["Diabetes Risk",   `${s?.diab_risk||"—"} pts`,               isFlag("diab_risk",s?.diab_risk),"diab_risk"],
                ].map(([label, value, flagged, key], i) => (
                  <tr key={label} style={{ background: i%2===0 ? "#f8fafc" : "white" }}>
                    <td style={{ padding:"10px 14px", fontWeight:600 }}>{label}</td>
                    <td style={{ padding:"10px 14px", textAlign:"center", fontWeight:700, color:flagged?THEME.red:THEME.dark }}>{value}</td>
                    <td style={{ padding:"10px 14px", textAlign:"center" }}>
                      <span style={{ ...styles.pill, background:flagged?THEME.lightRed:THEME.lightGreen, color:flagged?THEME.red:THEME.green }}>
                        {flagged ? "⚠ Take Action" : "✓ Good"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px", fontSize:12, color:THEME.grey }}>
                      {flagged ? HEALTH_LINKS[key] : "Continue healthy habits"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {s?.other && <div style={{ marginTop:16, padding:12, background:"#f8fafc", borderRadius:8, fontSize:13 }}><b>Other notes:</b> {s.other}</div>}
            <div style={{ marginTop:16, padding:12, background:"#fffbeb", borderRadius:8, fontSize:12, color:"#92400e", border:"1px solid #fcd34d" }}>
              This is not a full medical check-up. Please see your GP for a complete assessment. · {s?.student_nurse} (Student) · {s?.registered_nurse} (Reg. Nurse)
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button style={{ ...styles.btn, background:THEME.blue }} onClick={() => window.print()}>🖨 Print Report</button>
            <button style={{ ...styles.btnTeal }} onClick={resetAll}>+ New Patient</button>
            <button style={{ ...styles.btnGrey }} onClick={() => { setRole("supervisor"); setScreen("dashboard"); }}>View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  if (screen === "dashboard") {
    const filtered = dashFilter === "all" ? sessions
      : sessions.filter(s => s.location === dashFilter);
    const locations = [...new Set(sessions.map(s => s.location))];
    const flagCount = (metric) => filtered.filter(s => isFlag(metric, s[metric])).length;
    const total = filtered.length;
    const noGP = filtered.filter(s => s.seen_gp === "No").length;

    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div><div style={styles.headerTitle}>🏥 FedWELL</div><div style={styles.headerSub}>Supervisor Dashboard</div></div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <select style={{ padding:"6px 10px", borderRadius:6, fontSize:13, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white" }}
              value={dashFilter} onChange={e => setDashFilter(e.target.value)}>
              <option value="all">All locations</option>
              {locations.map(l => <option key={l} value={l} style={{ color:"black" }}>{l}</option>)}
            </select>
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </div>
        <div style={styles.section}>
          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginBottom:20 }}>
            {[
              { label:"Total sessions", value:total, color:THEME.blue, grad:"linear-gradient(135deg,#e8f4fd 0%,#deeaf1 100%)" },
              { label:"Flagged readings", value:flaggedMetrics.length > 0 || filtered.some(s => Object.entries(s).some(([k,v]) => isFlag(k,v))) ? filtered.reduce((acc,s) => acc + Object.keys(RANGES).filter(k => isFlag(k,s[k])).length, 0) : 0, color:THEME.red, grad:"linear-gradient(135deg,#ffebee 0%,#fce4ec 100%)" },
              { label:"No GP in 12m", value:noGP, color:THEME.gold, grad:"linear-gradient(135deg,#fffde7 0%,#fff8e1 100%)" },
              { label:"Locations", value:[...new Set(sessions.map(s=>s.location))].length, color:THEME.teal, grad:"linear-gradient(135deg,#e0f2f1 0%,#e8f5e9 100%)" },
            ].map(({ label, value, color, grad }) => (
              <div key={label} style={{ ...styles.card, background:grad, borderTop:`4px solid ${color}`, textAlign:"center", padding:16, marginBottom:0 }}>
                <div style={{ fontSize:32, fontWeight:800, color }}>{value}</div>
                <div style={{ fontSize:12, color:THEME.grey, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Out-of-range rates */}
          <div style={{ ...styles.card, marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:THEME.navy, marginBottom:16 }}>Out-of-range rates</div>
            {total === 0 ? (
              <div style={{ color:THEME.grey, fontSize:14 }}>No data yet. Complete a health check first.</div>
            ) : (
              Object.entries(RANGES).map(([key, r]) => {
                const cnt = flagCount(key);
                const pct = total > 0 ? Math.round((cnt/total)*100) : 0;
                return (
                  <div key={key} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
                      <span style={{ fontWeight:600 }}>{key.replace("_"," ").toUpperCase()}</span>
                      <span style={{ color:pct>30?THEME.red:THEME.grey }}>{cnt}/{total} ({pct}%)</span>
                    </div>
                    <div style={{ background:"#f1f5f9", borderRadius:4, height:8 }}>
                      <div style={{ width:`${pct}%`, height:8, borderRadius:4, background:pct>30?THEME.red:pct>15?THEME.gold:THEME.teal, transition:"width 0.5s" }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Records table */}
          <div style={styles.card}>
            <div style={{ fontSize:16, fontWeight:700, color:THEME.navy, marginBottom:16 }}>
              Session records — de-identified ({filtered.length})
            </div>
            {filtered.length === 0 ? (
              <div style={{ color:THEME.grey, fontSize:14 }}>No records yet.</div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:THEME.light }}>
                      {["ID","Date","Age","Gender","Location","BP","Pulse","SpO₂","BMI","Flags"].map(h => (
                        <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:600, color:THEME.navy, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const flags = Object.keys(RANGES).filter(k => isFlag(k, s[k])).length;
                      return (
                        <tr key={s.id} style={{ background: i%2===0?"#f8fafc":"white" }}>
                          <td style={{ padding:"8px 10px", fontWeight:700, color:THEME.blue }}>{s.id}</td>
                          <td style={{ padding:"8px 10px" }}>{s.check_date}</td>
                          <td style={{ padding:"8px 10px" }}>{s.age||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>{s.gender||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>{s.location}</td>
                          <td style={{ padding:"8px 10px" }}>{s.bp_sys||"—"}/{s.bp_dia||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>{s.pulse||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>{s.oxysat||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>{s.bmi||"—"}</td>
                          <td style={{ padding:"8px 10px" }}>
                            {flags > 0 ? (
                              <span style={{ ...styles.pill, background:THEME.lightRed, color:THEME.red }}>{flags} flag{flags>1?"s":""}</span>
                            ) : (
                              <span style={{ ...styles.pill, background:THEME.lightGreen, color:THEME.green }}>Clear</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button style={styles.btn} onClick={() => { setRole("staff"); setScreen("client_details"); }}>
              + New Health Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}