import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FEDERATION UNIVERSITY AUSTRALIA — Official Brand Colours
//   Navy  : #002060   Gold : #FFAB00   Dark gold : #E09600
// ─────────────────────────────────────────────────────────────────────────────

const FED_NAVY = "#002060";
const FED_GOLD = "#FFAB00";
const FED_GOLD2 = "#E09600";

// ─── CSS (responsive + theme + print) ────────────────────────────────────────
const buildStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',system-ui,sans-serif;transition:background 0.3s,color 0.3s}

  /* ── Light theme (default) ── */
  :root{
    --bg:#F1F5F9; --surface:#FFFFFF; --surface2:#F8FAFC; --text:#0F172A;
    --muted:#64748B; --border:#E2E8F0; --bdk:#CBD5E1;
    --input-bg:#FFFFFF; --shadow:rgba(0,0,0,0.06);
    --nav-bg:linear-gradient(90deg,${FED_NAVY},#0D2F80);
    --brand-left:linear-gradient(160deg,${FED_NAVY} 0%,#0A2060 55%,#003476 100%);
    --card-hover:#F0F4FF;
  }
  /* ── Dark theme ── */
  [data-theme="dark"]{
    --bg:#0F172A; --surface:#1E293B; --surface2:#162032; --text:#F1F5F9;
    --muted:#94A3B8; --border:#334155; --bdk:#475569;
    --input-bg:#243048; --shadow:rgba(0,0,0,0.3);
    --nav-bg:linear-gradient(90deg,#050E1F,#0A1A40);
    --brand-left:linear-gradient(160deg,#050E1F 0%,#061835 55%,#081E40 100%);
    --card-hover:#1E2D45;
  }

  /* ── Layout ── */
  .fw-page{min-height:100vh;background:var(--bg);color:var(--text)}
  .fw-login-wrap{min-height:100vh}
  .fw-login-brand{
    position:relative;overflow:hidden;color:white;padding:38px 34px;
    display:flex;flex-direction:column;justify-content:space-between;
    background:
      radial-gradient(circle at 12% 10%,rgba(255,171,0,0.18),transparent 28%),
      linear-gradient(155deg,${FED_NAVY} 0%,#08245E 52%,#0D357F 100%);
  }
  .fw-login-brand::after{
    content:"";position:absolute;right:-160px;bottom:-160px;width:360px;height:360px;
    border-radius:999px;border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03);pointer-events:none;
  }
  .fw-brand-top{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-start}
  .fw-theme-pill{
    padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.22);
    background:rgba(255,255,255,0.08);color:white;font-size:12px;font-weight:700;
    cursor:pointer;letter-spacing:0.02em;
  }
  .fw-brand-main{position:relative;z-index:1;max-width:420px;margin:0 auto;width:100%}
  .fw-brand-label{
    font-size:12px;font-weight:800;color:${FED_GOLD};text-transform:uppercase;
    letter-spacing:0.13em;margin-bottom:18px;
  }
  .fw-brand-title{font-size:48px;font-weight:900;color:white;line-height:1.04;letter-spacing:-0.04em;margin-bottom:22px}
  .fw-brand-title span{display:block;font-size:34px;letter-spacing:-0.03em;margin-top:8px}
  .fw-brand-text{font-size:15px;color:rgba(255,255,255,0.78);line-height:1.75;max-width:380px}
  .fw-brand-features{margin-top:32px;display:grid;gap:14px}
  .fw-brand-feature{display:flex;align-items:center;gap:12px;color:rgba(255,255,255,0.84);font-size:14px;line-height:1.5}
  .fw-brand-feature::before{content:"";width:7px;height:7px;border-radius:999px;background:${FED_GOLD};flex:0 0 auto}
  .fw-brand-footer{position:relative;z-index:1;display:grid;gap:16px}
  .fw-brand-footer-card{
    background:rgba(255,255,255,0.07);border:1px solid rgba(255,171,0,0.38);
    border-radius:14px;padding:18px 20px;
  }
  .fw-brand-footer-title{
    font-size:12px;color:${FED_GOLD};font-weight:800;text-transform:uppercase;
    letter-spacing:0.06em;margin-bottom:8px;
  }
  .fw-brand-footer-meta{font-size:12px;color:rgba(255,255,255,0.72);line-height:1.6}
  .fw-brand-copy{font-size:12px;color:rgba(255,255,255,0.42);text-align:center}
  .fw-role-icon{
    width:34px;height:34px;border-radius:10px;margin:0 auto 8px;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,32,96,0.08);color:${FED_NAVY};font-weight:900;font-size:13px;
    border:1px solid rgba(0,32,96,0.12);
  }
  [data-theme="dark"] .fw-role-icon{background:rgba(147,197,253,0.12);color:#93C5FD;border-color:rgba(147,197,253,0.18)}
  .fw-content{max-width:780px;margin:0 auto;padding:24px 16px}
  .fw-content-wide{max-width:1100px;margin:0 auto;padding:24px 16px}
  .fw-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .fw-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .fw-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .fw-grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
  .fw-chart-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .fw-result-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:16px;margin-top:16px}
  .fw-review-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .fw-role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
  .fw-gender-row{display:flex;gap:8px;flex-wrap:wrap}
  .fw-nav-title{color:rgba(255,255,255,0.4);font-size:13px;border-left:1px solid rgba(255,255,255,0.15);padding-left:12px}

  /* ── Cards & inputs ── */
  .fw-card{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:18px;box-shadow:0 1px 4px var(--shadow)}
  .fw-input{width:100%;padding:9px 11px;border:1.5px solid var(--bdk);border-radius:8px;font-size:14px;outline:none;background:var(--input-bg);color:var(--text);font-family:inherit;box-sizing:border-box}
  .fw-input:focus{border-color:${FED_NAVY};box-shadow:0 0 0 3px rgba(0,32,96,0.1)}
  .fw-select{width:100%;padding:9px 11px;border:1.5px solid var(--bdk);border-radius:8px;font-size:14px;outline:none;background:var(--input-bg);color:var(--text);font-family:inherit;box-sizing:border-box}
  [data-theme="dark"] .fw-input,[data-theme="dark"] .fw-select{color-scheme:dark}
  .fw-stat-card{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:14px;text-align:center}

  /* ── Responsive ── */
  @media(max-width:768px){
    .fw-login-wrap{grid-template-columns:1fr}
    .fw-login-brand{display:none}
    .fw-grid2,.fw-grid3,.fw-chart-row,.fw-result-grid{grid-template-columns:1fr}
    .fw-grid4,.fw-grid5{grid-template-columns:1fr 1fr}
    .fw-review-grid{grid-template-columns:1fr 1fr}
    .fw-nav-title{display:none}
    .fw-content,.fw-content-wide{padding:16px 12px}
    .fw-role-grid{grid-template-columns:1fr 1fr}
  }
  @media(max-width:900px){
    .fw-page > div > div > div{
      grid-template-columns:1fr!important;
      padding:34px 22px!important;
    }
  }
  @media(max-width:480px){
    .fw-grid2,.fw-grid3,.fw-chart-row,.fw-result-grid,.fw-review-grid,.fw-role-grid{grid-template-columns:1fr}
    .fw-grid4,.fw-grid5{grid-template-columns:1fr 1fr}
  }

  /* ── Print styles ── */
  @media print{
    .no-print{display:none!important}
    body{background:white!important;color:#000!important;font-size:11pt}
    .fw-page{background:white!important}
    .print-report{display:block!important}
    .fw-print-header{border-bottom:3pt solid ${FED_NAVY};margin-bottom:14pt;padding-bottom:10pt}
    .fw-print-row{display:flex;justify-content:space-between;padding:5pt 8pt;border-bottom:0.5pt solid #ccc;font-size:10pt}
    .fw-print-row-high{background:#FFEAEA!important;color:#990000!important;font-weight:bold}
    .fw-print-row-ok {background:#EAFFF0!important;color:#006600!important}
    .fw-print-row-low{background:#FFF8E8!important;color:#996600!important;font-weight:bold}
    .fw-sig-line{border-top:1pt solid #999;margin-top:20pt;padding-top:4pt;font-size:9pt;color:#555}
  }
`;

// ─── Clinical ranges ──────────────────────────────────────────────────────────
const RANGES = {
  bpSys: { lo: 100, hi: 140, u: "mmHg", l: "Systolic BP" },
  bpDia: { lo: 60, hi: 90, u: "mmHg", l: "Diastolic BP" },
  pulse: { lo: 60, hi: 100, u: "bpm", l: "Pulse" },
  resp: { lo: 12, hi: 20, u: "/min", l: "Resp Rate" },
  oxysat: { lo: 95, hi: 100, u: "%", l: "Oxygen Sat" },
  temp: { lo: 36.0, hi: 37.5, u: "°C", l: "Temperature" },
  waist: { lo: 0, hi: null, u: "cm", l: "Waist" },
  bmi: { lo: 18.5, hi: null, u: "kg/m²", l: "BMI" },
  diab: { lo: 0, hi: null, u: "pts", l: "Diabetes Risk" },
};

// ─── Australian health links ──────────────────────────────────────────────────
const HEALTH_LINKS = {
  bpSys: {
    high: [
      {
        l: "Healthdirect – Hypertension",
        u: "https://www.healthdirect.gov.au/high-blood-pressure-hypertension"
      }
    ],
    low: []
  },

  bpDia: {
    high: [
      {
        l: "Healthdirect – Hypertension",
        u: "https://www.healthdirect.gov.au/high-blood-pressure-hypertension"
      }
    ],
    low: []
  },

  pulse: {
    high: [
      {
        l: "Heart Foundation – Heart Health",
        u: "https://www.heartfoundation.org.au/"
      }
    ],
    low: [
      {
        l: "Heart Foundation – Heart Health",
        u: "https://www.heartfoundation.org.au/"
      }
    ]
  },

  resp: {
    high: [
      {
        l: "Lung Foundation Australia",
        u: "https://lungfoundation.com.au/"
      },
      {
        l: "Healthdirect – Breathing Problems",
        u: "https://www.healthdirect.gov.au/breathing-problems"
      }
    ],
    low: [
      {
        l: "Lung Foundation Australia",
        u: "https://lungfoundation.com.au/"
      }
    ]
  },

  oxysat: {
    low: [
      {
        l: "Lung Foundation Australia",
        u: "https://lungfoundation.com.au/"
      }
    ]
  },

  temp: {
    high: [
      {
        l: "Healthdirect – Fever",
        u: "https://www.healthdirect.gov.au/fever"
      }
    ],
    low: [
      {
        l: "Healthdirect – Hypothermia",
        u: "https://www.healthdirect.gov.au/hypothermia"
      }
    ]
  },

  waist: {
    risk: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ],
    high: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ]
  },

  bmi: {
    low: [
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      }
    ],
    risk: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ],
    high: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ],
    high2: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ],
    high3: [
      {
        l: "Healthdirect – Obesity",
        u: "https://www.healthdirect.gov.au/obesity"
      },
      {
        l: "Eat for Health",
        u: "https://www.eatforhealth.gov.au/"
      },
      {
        l: "Australian Government – BMI and Waist Measurement",
        u: "https://www.health.gov.au/topics/overweight-and-obesity/bmi-and-waist"
      },
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ]
  },

  diab: {
    risk: [
      {
        l: "Diabetes Australia",
        u: "https://www.diabetesaustralia.com.au/"
      },
      {
        l: "NDSS – National Diabetes Services Scheme",
        u: "https://www.ndss.com.au/"
      },
      {
        l: "Healthdirect – Diabetes",
        u: "https://www.healthdirect.gov.au/diabetes"
      }
    ],
    high: [
      {
        l: "Diabetes Australia",
        u: "https://www.diabetesaustralia.com.au/"
      },
      {
        l: "NDSS – National Diabetes Services Scheme",
        u: "https://www.ndss.com.au/"
      },
      {
        l: "Healthdirect – Diabetes",
        u: "https://www.healthdirect.gov.au/diabetes"
      }
    ]
  },

  lifestyle: {
    smoking: [
      {
        l: "Australian Government – How to Quit Smoking and Vaping",
        u: "https://www.health.gov.au/topics/smoking-vaping-and-tobacco/how-to-quit"
      }
    ],
    activity: [
      {
        l: "Australian Government – Physical Activity Guidelines",
        u: "https://www.health.gov.au/topics/physical-activity/24-hour-movement-guidelines-for-all-australians"
      }
    ]
  }
};

// ─── Metric screens ───────────────────────────────────────────────────────────
const METRICS = [
  {
    key: "bp",
    label: "Blood Pressure",
    icon: "BP",
    color: "#B91C1C",
    fields: [
      {
        k: "bpSys",
        label: "Systolic",
        unit: "mmHg",
        ph: "e.g. 120",
        hint: "Normal adult range: 100–140 mmHg"
      },
      {
        k: "bpDia",
        label: "Diastolic",
        unit: "mmHg",
        ph: "e.g. 80",
        hint: "Normal adult range: 60–90 mmHg"
      }
    ]
  },
  {
    key: "pulse",
    label: "Pulse Rate",
    icon: "PR",
    color: "#DC2626",
    fields: [
      {
        k: "pulse",
        label: "Pulse",
        unit: "bpm",
        ph: "e.g. 75",
        hint: "Normal adult range: 60–100 bpm"
      }
    ]
  },
  {
    key: "resp",
    label: "Respiratory Rate",
    icon: "RR",
    color: "#0891B2",
    fields: [
      {
        k: "resp",
        label: "Rate",
        unit: "/min",
        ph: "e.g. 16",
        hint: "Normal adult range: 12–20 /min"
      }
    ]
  },
  {
    key: "oxy",
    label: "Oxygen Saturation",
    icon: "O2",
    color: "#0284C7",
    fields: [
      {
        k: "oxysat",
        label: "SpO₂",
        unit: "%",
        ph: "e.g. 98",
        hint: "Normal adult range: 95% or greater"
      }
    ]
  },
  {
    key: "temp",
    label: "Body Temperature",
    icon: "T",
    color: "#EA580C",
    fields: [
      {
        k: "temp",
        label: "Temp",
        unit: "°C",
        ph: "e.g. 36.6",
        hint: "Normal adult range: 36.0–37.5°C"
      }
    ]
  },
  {
    key: "body",
    label: "Body Measurements",
    icon: "BM",
    color: "#6D28D9",
    fields: [
      {
        k: "height",
        label: "Height",
        unit: "cm",
        ph: "e.g. 170",
        noFlag: true
      },
      {
        k: "weight",
        label: "Weight",
        unit: "kg",
        ph: "e.g. 70",
        noFlag: true
      },
      {
        k: "waist",
        label: "Waist",
        unit: "cm",
        ph: "e.g. 80",
        hint: "Men: increased risk ≥94 cm, greatly increased ≥102 cm. Women: increased risk ≥80 cm, greatly increased ≥88 cm."
      }
    ]
  },
  {
    key: "bmi",
    label: "BMI",
    icon: "BMI",
    color: "#7C3AED",
    fields: [
      {
        k: "bmi",
        label: "BMI",
        unit: "kg/m²",
        ph: "e.g. 22.5",
        hint: "Adults: <18.5 underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30–34.9 obese class I, 35–39.9 obese class II, 40+ obese class III."
      }
    ]
  },
  {
    key: "diab",
    label: "Diabetes Risk Score",
    icon: "DR",
    color: "#B45309",
    fields: [
      {
        k: "diab",
        label: "Score",
        unit: "pts",
        ph: "e.g. 8",
        hint: "AUSDRISK: 6–11 points increased risk. 12+ points high risk or possible undiagnosed type 2 diabetes."
      }
    ]
  },
  {
    key: "other",
    label: "Other Observations",
    icon: "OBS",
    color: "#3730A3",
    fields: [
      {
        k: "notes",
        label: "Notes",
        textarea: true,
        ph: "Any other observations, interventions or referrals..."
      }
    ]
  }
];

const DEFAULT_LOCS = ["Campus – Gippsland", "Farm World", "Men's Shed", "Other Community Event"];

const SEED = [
  { id: "FW-0001", d: "2025-03-10", age: 47, gender: "Male", postcode: "3840", gp: "No", loc: "Farm World", clinicPostcode: "3818", sn: "Sarah J.", rn: "RN Davies", bpSys: 148, bpDia: 92, pulse: 78, resp: 16, oxysat: 97, temp: 36.8, waist: 105, height: 178, bmi: 27.3, diab: 14, notes: "" },
  { id: "FW-0002", d: "2025-03-10", age: 35, gender: "Female", postcode: "3840", gp: "Yes", loc: "Campus – Gippsland", clinicPostcode: "3842", sn: "Tom K.", rn: "RN Davies", bpSys: 118, bpDia: 76, pulse: 68, resp: 15, oxysat: 99, temp: 36.6, waist: 72, height: 165, bmi: 22.1, diab: 6, notes: "" },
  { id: "FW-0003", d: "2025-06-14", age: 64, gender: "Male", postcode: "3825", gp: "No", loc: "Men's Shed", clinicPostcode: "3825", sn: "Amy L.", rn: "RN Cruz", bpSys: 162, bpDia: 98, pulse: 82, resp: 18, oxysat: 96, temp: 37.0, waist: 108, height: 170, bmi: 31.4, diab: 18, notes: "Occasional headaches" },
  { id: "FW-0004", d: "2025-09-18", age: 28, gender: "Female", postcode: "3840", gp: "Yes", loc: "Campus – Gippsland", clinicPostcode: "3842", sn: "Tom K.", rn: "RN Davies", bpSys: 112, bpDia: 72, pulse: 72, resp: 14, oxysat: 99, temp: 36.5, waist: 68, height: 162, bmi: 21.8, diab: 4, notes: "" },
  { id: "FW-0005", d: "2026-01-21", age: 40, gender: "Male", postcode: "3869", gp: "No", loc: "Campus – Gippsland", clinicPostcode: "3842", sn: "Amy L.", rn: "RN Davies", bpSys: 125, bpDia: 80, pulse: 65, resp: 15, oxysat: 98, temp: 36.7, waist: 90, height: 182, bmi: 24.0, diab: 7, notes: "" },
  { id: "FW-0006", d: "2026-03-05", age: 70, gender: "Male", postcode: "3825", gp: "No", loc: "Men's Shed", clinicPostcode: "3825", sn: "Sarah J.", rn: "RN Cruz", bpSys: 172, bpDia: 102, pulse: 76, resp: 19, oxysat: 94, temp: 37.1, waist: 112, height: 168, bmi: 28.9, diab: 21, notes: "Shortness of breath" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getFlag(k, v, g = "") {
  const r = RANGES[k];
  if (!r || v === null || v === undefined || v === "") return "ok";

  const n = parseFloat(v);
  if (isNaN(n)) return "ok";

  // Waist risk based on gender
  if (k === "waist") {
    if (g === "Male") {
      if (n >= 102) return "high";
      if (n >= 94) return "risk";
      return "ok";
    }

    if (g === "Female") {
      if (n >= 88) return "high";
      if (n >= 80) return "risk";
      return "ok";
    }

    return "ok";
  }

  // Oxygen saturation
  if (k === "oxysat") {
    return n < 95 ? "low" : "ok";
  }

  // BMI categories
  if (k === "bmi") {
    if (n < 18.5) return "low";
    if (n >= 40) return "high3";
    if (n >= 35) return "high2";
    if (n >= 30) return "high";
    if (n >= 25) return "risk";
    return "ok";
  }

  // AUSDRISK diabetes score
  if (k === "diab") {
    if (n >= 12) return "high";
    if (n >= 6) return "risk";
    return "ok";
  }

  return n < r.lo ? "low" : n > r.hi ? "high" : "ok";
}
function hasFlag(rec) { return Object.keys(RANGES).some(k => getFlag(k, rec[k], rec.gender) !== "ok"); }
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—"; }
function pct(n, t) { return t ? Math.round((n / t) * 100) : 0; }

const AGE_GROUPS = [{ l: "Under 18", min: 0, max: 17 }, { l: "18–30", min: 18, max: 30 }, { l: "31–45", min: 31, max: 45 }, { l: "46–60", min: 46, max: 60 }, { l: "61+", min: 61, max: 999 }];
function ageGroup(age) { if (!age) return "Unknown"; const a = parseInt(age); return AGE_GROUPS.find(g => a >= g.min && a <= g.max)?.l || "Unknown"; }

// ─── Federation University Australia Logo SVG ─────────────────────────────────
// Faithful representation: gold slash-mark + wordmark in navy/white
const FedUniLogo = ({ white = false, height = 40 }) => {
  const textColor = white ? "#FFFFFF" : "#001EFF";
  const subColor = white ? "rgba(255,255,255,0.78)" : "#001EFF";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: height * 0.18,
      height,
      flexShrink: 0
    }}>
      <div style={{
        width: height * 0.78,
        height: height * 0.78,
        position: "relative",
        flexShrink: 0
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: height * 0.04,
          width: height * 0.34,
          height: height * 0.26,
          background: textColor,
          transform: "skewY(-8deg)"
        }} />

        <div style={{
          position: "absolute",
          left: height * 0.39,
          top: 0,
          width: height * 0.34,
          height: height * 0.26,
          background: textColor,
          transform: "skewY(-8deg)"
        }} />

        <div style={{
          position: "absolute",
          left: 0,
          top: height * 0.36,
          width: height * 0.34,
          height: height * 0.26,
          background: textColor,
          transform: "skewY(-8deg)"
        }} />

        <div style={{
          position: "absolute",
          left: height * 0.39,
          top: height * 0.32,
          width: height * 0.34,
          height: height * 0.26,
          background: textColor,
          transform: "skewY(-8deg)"
        }} />
      </div>

      <div style={{ lineHeight: 1 }}>
        <div style={{
          color: textColor,
          fontSize: height * 0.48,
          fontWeight: 700,
          letterSpacing: "-0.05em"
        }}>
          Federation
        </div>

        <div style={{
          color: subColor,
          fontSize: height * 0.39,
          fontWeight: 400,
          letterSpacing: "-0.04em",
          marginTop: -2
        }}>
          University
        </div>
      </div>
    </div>
  );
};

// ─── UI Atoms ─────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const m = {
    high3: { bg: "#FEF2F2", c: "#7F1D1D", t: "OBESE III" },
    high2: { bg: "#FEF2F2", c: "#991B1B", t: "OBESE II" },
    high: { bg: "#FEF2F2", c: "#B91C1C", t: "HIGH" },
    risk: { bg: "#FFF7ED", c: "#C2410C", t: "RISK" },
    low: { bg: "#FFFBEB", c: "#B45309", t: "LOW" },
    ok: { bg: "#F0FDF4", c: "#15803D", t: "OK" }
  };

  const s = m[status] || m.ok;

  return (
    <span style={{
      background: s.bg,
      color: s.c,
      fontWeight: 700,
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 999,
      whiteSpace: "nowrap"
    }}>
      {s.t}
    </span>
  );
};

const PrivacyBanner = ({ children, dark }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: dark ? "#0D2F1A" : "#E6F7F4", border: "1px solid #0B7A65", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
    <span style={{ fontSize: 13 }}>🔒</span>
    <div style={{ fontSize: 12, color: dark ? "#4ADE80" : "#0B7A65", lineHeight: 1.6 }}>{children}</div>
  </div>
);

const Bar = ({ label, n, total, color }) => {
  const p = pct(n, total);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>{label}</span>
        <span style={{ color, fontWeight: 700, flexShrink: 0 }}>{n}<span style={{ color: "var(--muted)", fontWeight: 400 }}> / {total} ({p}%)</span></span>
      </div>
      <div style={{ background: "var(--border)", borderRadius: 999, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: 7, borderRadius: 999, background: color }} />
      </div>
    </div>
  );
};

const HealthLinks = ({ flagKey, status }) => {
  const links = (HEALTH_LINKS[flagKey] || {})[status] || [];
  if (!links.length) return null;
  return (
    <div style={{ marginTop: 6 }}>
      {links.map((lk, i) => (
        <a key={i} href={lk.u} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#0284C7", marginRight: 8, marginBottom: 4, textDecoration: "underline" }}>
          🔗 {lk.l}
        </a>
      ))}
    </div>
  );
};

// ─── Location Autocomplete ────────────────────────────────────────────────────
function LocationInput({ value, onChange, locations, onAddLocation }) {
  const [show, setShow] = useState(false);
  const [q, setQ] = useState(value || "");
  const ref = useRef(null);
  const filtered = locations.filter(l => l.toLowerCase().includes(q.toLowerCase()));
  const isNew = q.trim().length > 2 && !locations.some(l => l.toLowerCase() === q.toLowerCase());
  useEffect(() => { setQ(value || ""); }, [value]);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setShow(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input className="fw-input" value={q}
        onChange={e => { setQ(e.target.value); onChange(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)} placeholder="e.g. Farm World, Men's Shed…" />
      {show && (filtered.length > 0 || isNew) && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--surface)", border: `1.5px solid ${FED_NAVY}`, borderRadius: "0 0 10px 10px", zIndex: 200, boxShadow: "0 4px 14px var(--shadow)", maxHeight: 200, overflowY: "auto" }}>
          {filtered.map(l => (
            <div key={l} onClick={() => { setQ(l); onChange(l); setShow(false); }}
              style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid var(--border)", color: "var(--text)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--card-hover)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "" }}>{l}</div>
          ))}
          {isNew && (
            <div onClick={() => { onAddLocation(q.trim()); onChange(q.trim()); setShow(false); }}
              style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", color: "#0B7A65", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>＋</span> Add "{q.trim()}" as new location
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Print Report Component ───────────────────────────────────────────────────
function PrintReport({ saved }) {
  const { patient, rec, flags } = saved;
  const flagged = Object.keys(flags).filter(k => flags[k] !== "ok");
  const allMetrics = [
    { label: "Blood Pressure", value: `${rec.bpSys || "—"}/${rec.bpDia || "—"}`, unit: "mmHg", flag: flags.bpSys === "ok" && flags.bpDia === "ok" ? "ok" : flags.bpSys || flags.bpDia },
    { label: "Pulse", value: rec.pulse, unit: "bpm", flag: flags.pulse, fk: "pulse" },
    { label: "Respiratory Rate", value: rec.resp, unit: "/min", flag: flags.resp, fk: "resp" },
    { label: "Oxygen Saturation", value: rec.oxysat, unit: "%", flag: flags.oxysat, fk: "oxysat" },
    { label: "Temperature", value: rec.temp, unit: "°C", flag: flags.temp, fk: "temp" },
    { label: "Height", value: rec.height, unit: "cm", flag: "ok" },
    { label: "Weight", value: rec.weight, unit: "kg", flag: "ok" },
    { label: "Waist", value: rec.waist, unit: "cm", flag: flags.waist, fk: "waist" },
    { label: "BMI", value: rec.bmi, unit: "kg/m²", flag: flags.bmi, fk: "bmi" },
    { label: "Diabetes Risk Score", value: rec.diab, unit: "pts", flag: flags.diab, fk: "diab" },
  ].filter(m => m.value !== null && m.value !== undefined && m.value !== "");

  const flagColor = f => f === "high" ? "#990000" : f === "low" ? "#996600" : "#006600";
  const flagBg = f => f === "high" ? "#FFEAEA" : f === "low" ? "#FFF8E8" : "#EAFFF0";
  const flagLabel = f => f === "high" ? "▲ HIGH" : f === "low" ? "▼ LOW" : "✓ OK";

  return (
    <div style={{ fontFamily: "'Inter',Arial,sans-serif", maxWidth: 700, margin: "0 auto", padding: 32, color: "#111", background: "#fff" }}>
      {/* ── Letterhead ── */}
      <div style={{ borderBottom: `3px solid ${FED_NAVY}`, paddingBottom: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            {/* Fed Uni wordmark in print */}
            <div style={{ background: FED_GOLD, borderRadius: 3, padding: "6px 10px" }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "Arial Black,Arial" }}>F</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: FED_NAVY, letterSpacing: "0.5px" }}>FEDERATION</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#4A5568", letterSpacing: "0.3px" }}>UNIVERSITY AUSTRALIA</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>Nursing Gippsland — Community Health Program</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>federation.edu.au/nursing</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#888" }}>Session ID</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: FED_NAVY }}>{rec.id}</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Date of Check</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fmtDate(rec.d)}</div>
        </div>
      </div>

      {/* ── Title ── */}
      <div style={{ background: FED_NAVY, color: "white", borderRadius: 8, padding: "12px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>COMMUNITY HEALTH CHECK REPORT</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Health Assessment Summary</div>
      </div>

      {/* ── Patient details ── */}
      <div style={{ border: `1px solid #ddd`, borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ background: FED_NAVY, color: "white", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>PATIENT INFORMATION</div>
        <div style={{ padding: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <tbody>
              {[
                ["Patient Name", patient.name, "Age", patient.age + " yrs"],
                ["Gender", patient.gender, "Home Postcode", rec.postcode || "—"],
                ["Seen GP (12 mo.)", patient.gp || "—", "Check Location", rec.loc || "—"],
                ["Student Nurse", rec.sn || "—", "Supervisor / RN", rec.rn || "—"],
              ].map(([l1, v1, l2, v2], i) => (
                <tr key={i} style={{ background: i % 2 ? "#F8FAFC" : "#fff" }}>
                  <td style={{ padding: "6px 10px", color: "#666", width: "20%", fontSize: 11 }}>{l1}</td>
                  <td style={{ padding: "6px 10px", fontWeight: 600, width: "30%" }}>{v1}</td>
                  <td style={{ padding: "6px 10px", color: "#666", width: "20%", fontSize: 11 }}>{l2}</td>
                  <td style={{ padding: "6px 10px", fontWeight: 600, width: "30%" }}>{v2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* temporary<div style={{marginTop:10,padding:"8px 10px",background:"#FFF8E0",border:"1px solid #E8A000",borderRadius:6,fontSize:11,color:"#7A5800"}}>
            ⚠ This patient's name is used on this report only and is not stored in the database (as per privacy agreement dated 25 March 2026).
          </div>*/}
        </div>
      </div>

      {/* ── Readings ── */}
      <div style={{ border: "1px solid #ddd", borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ background: FED_NAVY, color: "white", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>HEALTH CHECK READINGS</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F1F5F9" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "#555", fontWeight: 600, borderBottom: "1.5px solid #ddd" }}>Measurement</th>
              <th style={{ padding: "8px 12px", textAlign: "right", color: "#555", fontWeight: 600, borderBottom: "1.5px solid #ddd" }}>Result</th>
              <th style={{ padding: "8px 12px", textAlign: "center", color: "#555", fontWeight: 600, borderBottom: "1.5px solid #ddd" }}>Status</th>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "#555", fontWeight: 600, borderBottom: "1.5px solid #ddd" }}>Normal Range</th>
            </tr>
          </thead>
          <tbody>
            {allMetrics.map((m, i) => {
              const r = RANGES[m.fk];
              const range = r ? (m.fk === "waist" ? "M <102 / F <88" : m.fk === "oxysat" ? "≥95" : `${r.lo}–${r.hi}`) : "—";
              return (
                <tr key={i} style={{ background: m.flag !== "ok" ? flagBg(m.flag) : i % 2 ? "#F8FAFC" : "#fff", borderBottom: "0.5px solid #e2e8f0" }}>
                  <td style={{ padding: "7px 12px", fontWeight: m.flag !== "ok" ? 700 : 400 }}>{m.label}</td>
                  <td style={{ padding: "7px 12px", textAlign: "right", fontWeight: 700, fontSize: 14, color: m.flag !== "ok" ? flagColor(m.flag) : "#111" }}>
                    {m.value} <span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}>{m.unit}</span>
                  </td>
                  <td style={{ padding: "7px 12px", textAlign: "center" }}>
                    <span style={{ background: flagBg(m.flag), color: flagColor(m.flag), fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 999, border: `1px solid ${flagColor(m.flag)}` }}>
                      {flagLabel(m.flag)}
                    </span>
                  </td>
                  <td style={{ padding: "7px 12px", fontSize: 11, color: "#666" }}>{range} {m.unit && m.fk ? m.unit : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rec.notes && <div style={{ padding: "10px 14px", background: "#FAFAFA", borderTop: "1px solid #e2e8f0", fontSize: 12 }}><strong>Additional Notes:</strong> {rec.notes}</div>}
      </div>

      {/* ── Out of range / Recommendations ── */}
      {flagged.length > 0 && (
        <div style={{ border: `2px solid #990000`, borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ background: "#990000", color: "white", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>⚠ READINGS REQUIRING ATTENTION & HEALTH RESOURCES</div>
          <div style={{ padding: 14 }}>
            <p style={{ fontSize: 11, color: "#666", marginBottom: 12 }}>
              The following readings were outside the normal range. The nursing student has discussed these with you today.
              Please use the resources below and follow up with your GP if recommended.
            </p>
            {flagged.map(k => (
              <div key={k} style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "0.5px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: flagColor(flags[k]) }}>{RANGES[k]?.l}</div>
                  <span style={{ background: flagBg(flags[k]), color: flagColor(flags[k]), fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 999, border: `1px solid ${flagColor(flags[k])}` }}>
                    {flagLabel(flags[k])}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>🇦🇺 Australian Health Resources:</div>
                {(HEALTH_LINKS[k]?.[flags[k]] || []).map((lk, i) => (
                  <div key={i} style={{ fontSize: 11, marginBottom: 3 }}>
                    🔗 <a href={lk.u} style={{ color: "#0052CC" }}>{lk.l}</a>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ background: "#FFF3E0", border: "1px solid #E8A000", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#7A5800", marginTop: 10 }}>
              <strong>Recommendation:</strong> Please make an appointment with your GP to discuss your results and follow up on any highlighted readings.
              Bring this report with you to your appointment.
            </div>
          </div>
        </div>
      )}

      {flagged.length === 0 && (
        <div style={{ background: "#EAFFF0", border: "2px solid #006600", borderRadius: 8, padding: 16, marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#006600" }}>✓ All readings are within normal range</div>
          <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>Great job! Keep up the healthy lifestyle. Continue regular check-ups with your GP.</div>
        </div>
      )}

      {/* ── Healthy lifestyle tips ── */}
      <div style={{ border: "1px solid #ddd", borderRadius: 8, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ background: "#003476", color: "white", padding: "8px 16px", fontSize: 12, fontWeight: 700 }}>GENERAL HEALTHY LIFESTYLE TIPS</div>
        <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
          {["🥗 Eat a balanced diet rich in fruits, vegetables and whole grains",
            "🚶 Aim for at least 30 minutes of moderate activity most days",
            "🚭 If you smoke, seek support to quit — call Quitline 13 7848",
            "🍷 Limit alcohol to recommended guidelines",
            "😴 Get 7–9 hours of quality sleep each night",
            "💊 Take medications as prescribed by your doctor"].map((t, i) => (
              <div key={i} style={{ padding: "6px 8px", background: "#F8FAFC", borderRadius: 6 }}>{t}</div>
            ))}
        </div>
      </div>

      {/* ── Signature lines ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
        {[["Student Nurse", rec.sn || "_______________"], ["Supervisor / Registered Nurse", rec.rn || "_______________"]].map(([role, name]) => (
          <div key={role}>
            <div style={{ borderTop: `1.5px solid ${FED_NAVY}`, paddingTop: 8, marginTop: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: FED_NAVY }}>{role}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{name}</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 10 }}>Signature: ________________________</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 6 }}>Date: ____________________________</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `2px solid ${FED_NAVY}`, paddingTop: 12, marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 10, color: "#888" }}>
            <div><strong style={{ color: FED_NAVY }}>Federation University Australia</strong> — Nursing Gippsland</div>
            <div>CRICOS: 00103D · TEQSA ID: PRV12151 · RTO: 4909</div>
            <div>federation.edu.au · This report was generated by the FedWELL Health Check Platform</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#888" }}>
            <div>Session: {rec.id}</div>
            <div>Printed: {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</div>
            <div style={{ marginTop: 4, fontStyle: "italic" }}>Patient name not stored in database</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: "#aaa", marginTop: 8, textAlign: "center", borderTop: "0.5px solid #ddd", paddingTop: 6 }}>
          CONFIDENTIAL: This document contains personal health information. Please store securely and share only with your treating health practitioners.
        </div>
      </div>
    </div>
  );
}

// ─── Input styling ────────────────────────────────────────────────────────────
function iStyle(flag, hasValue) {
  if (flag === "high") return { borderColor: "#B91C1C", background: "#FEF2F2", color: "#0F172A" };
  if (flag === "low") return { borderColor: "#B45309", background: "#FFFBEB", color: "#0F172A" };
  if (hasValue) return { borderColor: "#15803D", background: "#F0FDF4", color: "#0F172A" };
  return {};
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
// ── SCARD helper ─────────────────────────────────────────────────────────────
const SCard = ({ gradient, icon, label, children }) => (
  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 14, boxShadow: "0 2px 8px var(--shadow)" }}>
    <div style={{ background: gradient, padding: "11px 18px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 13, color: "white" }}>{label}</span>
    </div>
    <div style={{ background: "var(--surface)", padding: 18 }}>{children}</div>
  </div>
);

export default function App() {
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState("login");
  const [form, setForm] = useState({ checkDate: new Date().toISOString().split("T")[0] });
  const [saved, setSaved] = useState(null);
  const [metricStep, setMS] = useState(0);
  const [records, setRecords] = useState([]);
  const [nextId, setNextId] = useState(7);
  const [locations, setLocs] = useState(DEFAULT_LOCS);
  const [dashFilter, setDF] = useState({
    year: "All",
    postcode: "All",
    gender: "All",
    gp: "All",
    loc: "All",
    clinicPostcode: "All"
  });
  const [dashTab, setDashTab] = useState("overview");
  const [selRole, setSelRole] = useState("staff");
  const [pw, setPw] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [token, setToken] = useState("");
  const [loginErr, setLE] = useState("");
  const [genderOther, setGO] = useState(false);
  const [showPrint, setSP] = useState(false);

  // Inject styles + apply theme
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "fw-styles";
    el.innerHTML = buildStyles();
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = theme === "dark" ? "#0F172A" : "#F1F5F9";
  }, [theme]);

  // Load saved health-check records from Neon after login
  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/records`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;

        const mapped = data.map(r => ({
          id: r.session_id,
          d: r.check_date,
          age: r.age === null || r.age === undefined ? null : parseFloat(r.age),
          gender: r.gender || "",
          postcode: r.postcode || "",
          gp: r.seen_gp || "",
          loc: r.loc || "Not specified",
          clinicPostcode: r.clinic_postcode || "",
          sn: r.student_nurse || "",
          rn: r.supervisor || "",
          bpSys: r.bp_sys === null || r.bp_sys === undefined ? null : parseFloat(r.bp_sys),
          bpDia: r.bp_dia === null || r.bp_dia === undefined ? null : parseFloat(r.bp_dia),
          pulse: r.pulse === null || r.pulse === undefined ? null : parseFloat(r.pulse),
          resp: r.resp === null || r.resp === undefined ? null : parseFloat(r.resp),
          oxysat: r.oxysat === null || r.oxysat === undefined ? null : parseFloat(r.oxysat),
          temp: r.temp === null || r.temp === undefined ? null : parseFloat(r.temp),
          waist: r.waist === null || r.waist === undefined ? null : parseFloat(r.waist),
          height: r.height === null || r.height === undefined ? null : parseFloat(r.height),
          weight: r.weight === null || r.weight === undefined ? null : parseFloat(r.weight),
          bmi: r.bmi === null || r.bmi === undefined ? null : parseFloat(r.bmi),
          diab: r.diab === null || r.diab === undefined ? null : parseFloat(r.diab),
          notes: r.notes || ""
        }));

        setRecords(mapped);

        const maxNum = mapped.reduce((max, r) => {
          const n = parseInt(String(r.id || "").replace("FW-", ""), 10);
          return Number.isFinite(n) ? Math.max(max, n) : max;
        }, 0);
        if (maxNum >= nextId) setNextId(maxNum + 1);
      })
      .catch(err => console.error("Failed to load records:", err));
  }, [token]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");
  const isDark = theme === "dark";
  const brandText = isDark ? "#93C5FD" : FED_NAVY;
  const brandSoftBg = isDark ? "rgba(147,197,253,0.14)" : "rgba(0,32,96,0.08)";

  const calculateBMI = (heightCm, weightKg) => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);

    if (!h || !w || h <= 0 || w <= 0) return "";

    const heightM = h / 100;
    return (w / (heightM * heightM)).toFixed(1);
  };

  const setF = (k, v) => {
    setForm(f => {
      const updated = { ...f, [k]: v };

      if (k === "height" || k === "weight") {
        updated.bmi = calculateBMI(updated.height, updated.weight);
      }

      return updated;
    });
  };
  const addLoc = loc => { if (!locations.includes(loc)) setLocs(ls => [...ls, loc]); };
  const resetForm = () => { setForm({ checkDate: new Date().toISOString().split("T")[0] }); setMS(0); setSaved(null); setGO(false); setSP(false); };
  const startNew = () => { resetForm(); setScreen("clientdetails"); };

  const doLogin = async () => {
    setLE("");

    if (!pwEmail.trim() || !pw) {
      setLE("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pwEmail.trim(),
          password: pw
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLE(data.error || "Login failed");
        return;
      }

      setToken(data.token);
      setRole(data.role);

      if (data.role === "staff") {
        setScreen("clientdetails");
        resetForm();
      } else if (data.role === "teacher") {
        setScreen("dashboard");
      } else {
        setLE("Unknown user role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLE("Could not connect to server. Make sure the backend is running on port 3001.");
    }
  };

  const proceed = () => {
    const f = form;
    const miss = [];
    if (!f.name) miss.push("Full Name");
    if (!f.age) miss.push("Age");
    if (!f.gender) miss.push("Gender");
    if (!f.postcode) miss.push("Patient Postcode");
    if (!f.checkDate) miss.push("Check Date");
    if (!f.sn) miss.push("Student Nurse");
    if (!f.rn) miss.push("Supervisor / Registered Nurse");
    if (miss.length) { alert("Please fill in:\n• " + miss.join("\n• ")); return; }
    setMS(0); setScreen("metric");
  };

  const doSave = async () => {
    if (!token) {
      alert("You must be logged in before saving.");
      return;
    }

    const id = `FW-${String(nextId).padStart(4, "0")}`;
    setNextId(n => n + 1);

    const flags = {};
    Object.keys(RANGES).forEach(k => { flags[k] = getFlag(k, form[k], form.gender || ""); });

    const body = {
      session_id: id,
      check_date: form.checkDate,
      age: form.age ? parseInt(form.age, 10) : null,
      gender: form.gender || "",
      postcode: form.postcode || "",
      seen_gp: form.seenGP || "",
      loc: form.loc || "Not specified",
      clinic_postcode: form.clinicPostcode || "",
      student_nurse: form.sn || "",
      supervisor: form.rn || "",
      bp_sys: form.bpSys ? parseFloat(form.bpSys) : null,
      bp_dia: form.bpDia ? parseFloat(form.bpDia) : null,
      pulse: form.pulse ? parseFloat(form.pulse) : null,
      resp: form.resp ? parseFloat(form.resp) : null,
      oxysat: form.oxysat ? parseFloat(form.oxysat) : null,
      temp: form.temp ? parseFloat(form.temp) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      bmi: form.bmi ? parseFloat(form.bmi) : null,
      diab: form.diab ? parseFloat(form.diab) : null,
      notes: form.notes || ""
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Save failed:", data);
        throw new Error(data.error || "Save failed");
      }

      const rec = {
        id,
        d: form.checkDate,
        age: form.age ? parseFloat(form.age) : null,
        gender: form.gender || "",
        postcode: form.postcode || "",
        gp: form.seenGP || "",
        loc: form.loc || "Not specified",
        clinicPostcode: form.clinicPostcode || "",
        sn: form.sn || "",
        rn: form.rn || "",
        bpSys: body.bp_sys,
        bpDia: body.bp_dia,
        pulse: body.pulse,
        resp: body.resp,
        oxysat: body.oxysat,
        temp: body.temp,
        waist: body.waist,
        height: body.height,
        weight: body.weight,
        bmi: body.bmi,
        diab: body.diab,
        notes: body.notes
      };

      setRecords(rs => [rec, ...rs]);
      setSaved({ patient: { name: form.name, age: form.age, gender: form.gender, gp: form.seenGP }, rec, flags });
      setScreen("result");
    } catch (err) {
      alert("Error saving record. Check the browser console and backend terminal.");
      console.error(err);
    }
  };

  const logout = () => { setRole(null); setScreen("login"); setPw(""); setPwEmail(""); setToken(""); setRecords([]); };

  // ── Theme Toggle Button ─────────────────────────────────────────────────────
  const ThemeBtn = () => (
    <button onClick={toggleTheme} title="Toggle light/dark mode"
      style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "white", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>
      {isDark ? "☀️" : "🌙"}
    </button>
  );

  // ── LOGIN PAGE ──────────────────────────────────────────────────────────────
  if (!role) return (
    <div className="fw-page" style={{
      minHeight: "100vh",
      background: isDark ? "#0F172A" : "#F6F7FB",
      color: "var(--text)"
    }}>
      <div style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "28px 24px 40px"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28
        }}>
          <FedUniLogo white={isDark} height={42} />

          <button
            onClick={toggleTheme}
            style={{
              padding: "5px 9px",
              borderRadius: 7,
              border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,32,96,0.18)",
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,32,96,0.06)",
              color: isDark ? "white" : FED_NAVY,
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Main homepage card */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 18,
          minHeight: 640,
          background: isDark
            ? "linear-gradient(135deg, #071C42 0%, #092B66 48%, #79137E 100%)"
            : "linear-gradient(135deg, #B9F2DD 0%, #B9F2DD 48%, #E85AF5 48%, #E85AF5 100%)",
          boxShadow: isDark
            ? "0 24px 70px rgba(0,0,0,0.35)"
            : "0 24px 70px rgba(0,32,96,0.12)"
        }}>
          {/* FedUni style shape */}
          <div style={{
            position: "absolute",
            right: -110,
            top: 0,
            width: "48%",
            height: "100%",
            background: "#7A137C",
            clipPath: "polygon(32% 0, 100% 0, 68% 100%, 0 100%)",
            opacity: isDark ? 0.82 : 0.95
          }} />

          <div style={{
            position: "relative",
            zIndex: 2,
            minHeight: 640,
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 34,
            alignItems: "center",
            padding: "58px 64px"
          }}>
            {/* Hero */}
            <div style={{
              maxWidth: 520
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 900,
                color: isDark ? FED_GOLD : FED_NAVY,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 26
              }}>
                Nursing Gippsland · Community Health
              </div>

              <div style={{
                fontSize: 68,
                fontWeight: 900,
                color: isDark ? "white" : "#001EFF",
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
                marginBottom: 12
              }}>
                FedWELL
              </div>

              <div style={{
                fontSize: 44,
                fontWeight: 900,
                color: isDark ? FED_GOLD : "#7A137C",
                lineHeight: 1.06,
                letterSpacing: "-0.045em",
                marginBottom: 24
              }}>
                Health Check Platform
              </div>

              <p style={{
                fontSize: 17,
                color: isDark ? "rgba(255,255,255,0.78)" : FED_NAVY,
                lineHeight: 1.75,
                maxWidth: 470,
                margin: 0,
                fontWeight: 500
              }}>
                A secure platform for recording community health screening data and preparing
                clear summary reports for staff review.
              </p>
            </div>

            {/* Login card */}
            <div style={{
              background: isDark ? "rgba(15,23,42,0.86)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(14px)",
              border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.72)",
              borderRadius: 18,
              padding: "32px 30px",
              boxShadow: isDark
                ? "0 18px 50px rgba(0,0,0,0.35)"
                : "0 18px 50px rgba(0,32,96,0.18)"
            }}>
              <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
                <FedUniLogo white={isDark} height={34} />
              </div>

              <div style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: 4,
                textAlign: "center"
              }}>
                Sign in to FedWELL
              </div>

              <div style={{
                fontSize: 14,
                color: "var(--muted)",
                marginBottom: 24,
                textAlign: "center"
              }}>
                Enter your FedWELL email and password.
              </div>

              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
                textAlign: "center"
              }}>
                I am a…
              </div>

              <div className="fw-role-grid">
                {[["staff", "S", "Student / Staff", "Enter patient data"], ["teacher", "A", "Teachers / Admin", "View analytics"]].map(([r, icon, label, desc]) => {
                  const sel = selRole === r;
                  return (
                    <button key={r} onClick={() => { setSelRole(r); setPw(""); setLE(""); }}
                      style={{
                        padding: "14px 10px",
                        borderRadius: 12,
                        textAlign: "center",
                        border: `2px solid ${sel ? FED_NAVY : isDark ? "#334155" : "#E2E8F0"}`,
                        background: sel ? (isDark ? `rgba(0,32,96,0.4)` : `rgba(0,32,96,0.06)`) : (isDark ? "#243048" : "#fff"),
                        cursor: "pointer",
                        minHeight: 90
                      }}>
                      <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        margin: "0 auto 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: sel ? FED_NAVY : (isDark ? "#334155" : "#EEF2F7"),
                        color: sel ? "white" : FED_NAVY,
                        fontSize: 13,
                        fontWeight: 900
                      }}>
                        {icon}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: sel ? brandText : "var(--text)" }}>{label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{desc}</div>
                    </button>
                  );
                })}
              </div>

              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>Email</label>
              <input type="email" value={pwEmail} onChange={e => { setPwEmail(e.target.value); setLE(""); }}
                onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="staff@fedwell.edu.au" className="fw-input"
                style={{ marginBottom: 12, padding: "12px 14px", fontSize: 15 }} />

              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" value={pw} onChange={e => { setPw(e.target.value); setLE(""); }}
                onKeyDown={e => e.key === "Enter" && doLogin()} placeholder="Enter password" className="fw-input"
                style={{ marginBottom: 12, padding: "12px 14px", fontSize: 15 }} />

              {loginErr && <div style={{ background: "#FEF2F2", color: "#B91C1C", padding: "9px 12px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>{loginErr}</div>}

              <button onClick={doLogin}
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 10,
                  background: `linear-gradient(135deg,${FED_NAVY},#003476)`,
                  color: "white",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 4px 14px rgba(0,32,96,0.35)`
                }}>
                Sign In →
              </button>

              <div style={{
                marginTop: 14,
                padding: "11px 13px",
                background: isDark ? "#243048" : "#F1F5F9",
                borderRadius: 9,
                fontSize: 12,
                color: "var(--muted)",
                lineHeight: 1.8,
                textAlign: "center"
              }}>
                <strong style={{ color: "var(--text)" }}>Demo credentials:</strong><br />
                Staff: <code style={{ background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>staff@fedwell.edu.au / fedwell2026</code><br />
                Teacher: <code style={{ background: isDark ? "#334155" : "#E2E8F0", padding: "1px 5px", borderRadius: 4 }}>teacher@fedwell.edu.au / teacher2026</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── NAV BAR ─────────────────────────────────────────────────────────────────
  const Nav = () => (
    <div className="no-print" style={{ background: isDark ? "linear-gradient(90deg,#050E1F,#0A1A40)" : "linear-gradient(90deg,#002060,#003476)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <FedUniLogo white height={28} />
        <span className="fw-nav-title">{role === "teacher" ? "Teachers & Admin" : "Student / Staff Portal"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {role === "staff" && (
          <button onClick={startNew} style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${FED_GOLD}`, background: "transparent", color: FED_GOLD, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ➕ New Check
          </button>
        )}
        <ThemeBtn />
        <button onClick={logout} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}>Sign out</button>
      </div>
    </div>
  );

  // ── Print view ──────────────────────────────────────────────────────────────
  if (showPrint && saved) return (
    <div>
      <div className="no-print" style={{ background: FED_NAVY, color: "white", padding: "12px 20px", display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => setSP(false)} style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", cursor: "pointer", fontSize: 13 }}>← Back</button>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Patient Health Report — {saved.rec.id}</span>
        <button onClick={() => window.print()} style={{ padding: "6px 18px", borderRadius: 7, border: "none", background: FED_GOLD, color: brandText, fontWeight: 700, cursor: "pointer", fontSize: 13, marginLeft: "auto" }}>🖨 Print / Save PDF</button>
      </div>
      <PrintReport saved={saved} />
    </div>
  );


  // ── CLIENT DETAILS ───────────────────────────────────────────────────────────
  if (screen === "clientdetails") {
    const f = form;
    const PRESET = ["Male", "Female", "Non-Binary", "Prefer not to say"];
    const isOther = genderOther || (f.gender && !PRESET.includes(f.gender));
    return (
      <div className="fw-page">
        <Nav />
        <div className="fw-content">
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FED_GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Step 1 of 3</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>Patient & Clinic Details</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Name appears on the printed report only — never stored in the database.</p>
          </div>

          <SCard gradient={`linear-gradient(135deg,${FED_NAVY},#003476)`} icon="👤" label="Patient Details">
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Full Name <span style={{ color: "#B91C1C" }}>*</span></label>
              <input className="fw-input" value={f.name || ""} onChange={e => setF("name", e.target.value)} placeholder="e.g. Jane Smith" />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Used on printed/emailed report only — not stored in database</div>
            </div>
            <div className="fw-grid2" style={{ marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Age <span style={{ color: "#B91C1C" }}>*</span></label>
                <input className="fw-input" type="number" value={f.age || ""} onChange={e => setF("age", e.target.value)} placeholder="e.g. 45" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Date of Birth</label>
                <input className="fw-input" type="date" value={f.dob || ""} onChange={e => setF("dob", e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Patient Home Postcode <span style={{ color: "#B91C1C" }}>*</span></label>
              <input className="fw-input" value={f.postcode || ""} onChange={e => setF("postcode", e.target.value)} placeholder="e.g. 3840" maxLength={4}
                style={{ ...iStyle("ok", !!f.postcode) }} />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Patient's home postcode — used to map future pop-up clinic locations</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8, color: "var(--text)" }}>Gender <span style={{ color: "#B91C1C" }}>*</span></label>
              <div className="fw-gender-row">
                {PRESET.map(g => {
                  const sel = f.gender === g && !isOther; return (
                    <button key={g} onClick={() => { setF("gender", g); setGO(false); }}
                      style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${sel ? FED_NAVY : "var(--bdk)"}`, background: sel ? (isDark ? `rgba(0,32,96,0.4)` : `rgba(0,32,96,0.06)`) : "var(--surface)", color: sel ? brandText : "var(--text)", fontSize: 13, fontWeight: sel ? 700 : 400, cursor: "pointer" }}>{g}</button>
                  );
                })}
                <button onClick={() => { setGO(true); setF("gender", ""); }}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${isOther ? FED_NAVY : "var(--bdk)"}`, background: isOther ? (isDark ? `rgba(0,32,96,0.4)` : `rgba(0,32,96,0.06)`) : "var(--surface)", color: isOther ? FED_NAVY : "var(--text)", fontSize: 13, fontWeight: isOther ? 700 : 400, cursor: "pointer" }}>Other…</button>
              </div>
              {isOther && <input className="fw-input" autoFocus value={(!PRESET.includes(f.gender) && f.gender) || ""} onChange={e => setF("gender", e.target.value)} placeholder="Please specify gender…" style={{ marginTop: 8 }} />}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8, color: "var(--text)" }}>Seen a GP in last 12 months?</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Yes", "No"].map(v => {
                  const sel = f.seenGP === v, c = v === "Yes" ? "#15803D" : "#B45309"; return (
                    <button key={v} onClick={() => setF("seenGP", v)}
                      style={{ padding: "8px 24px", borderRadius: 8, border: `1.5px solid ${sel ? c : "var(--bdk)"}`, background: sel ? (v === "Yes" ? (isDark ? "#0D2F1A" : "#F0FDF4") : (isDark ? "#2D1A00" : "#FFFBEB")) : "var(--surface)", color: sel ? c : "var(--text)", fontSize: 13, fontWeight: sel ? 700 : 400, cursor: "pointer" }}>{v}</button>
                  );
                })}
              </div>
            </div>
          </SCard>

          <SCard gradient="linear-gradient(135deg,#0B7A65,#065f46)" icon="📍" label="Clinic Details">
            <div style={{ marginBottom: 14 }}>
              <label style={{
                fontSize: 13,
                fontWeight: 600,
                display: "block",
                marginBottom: 5,
                color: "var(--text)"
              }}>
                Event / Pop-up Location
              </label>

              <input
                className="fw-input"
                value={f.loc || ""}
                onChange={e => setF("loc", e.target.value)}
                placeholder="Enter event or pop-up location"
              />
            </div>
            <div className="fw-grid2" style={{ marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Check Date <span style={{ color: "#B91C1C" }}>*</span></label>
                <input className="fw-input" type="date" value={f.checkDate || ""} onChange={e => setF("checkDate", e.target.value)} />
              </div>
            </div>
            <div className="fw-grid2">
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Student Nurse <span style={{ color: "#B91C1C" }}>*</span></label>
                <input className="fw-input" value={f.sn || ""} onChange={e => setF("sn", e.target.value)} placeholder="e.g. Sarah Johnson"
                  style={{ ...iStyle("ok", !!f.sn) }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 5, color: "var(--text)" }}>Supervisor / RN <span style={{ color: "#B91C1C" }}>*</span></label>
                <input className="fw-input" value={f.rn || ""} onChange={e => setF("rn", e.target.value)} placeholder="e.g. RN Davies"
                  style={{ ...iStyle("ok", !!f.rn) }} />
              </div>
            </div>
          </SCard>

          {/* temporary <PrivacyBanner dark={isDark}>Patient name &amp; home postcode stored separately. Name appears on report only — discarded after printing/emailing.</PrivacyBanner> */}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button onClick={proceed} style={{ padding: "11px 24px", borderRadius: 9, background: FED_NAVY, color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 12px rgba(0,32,96,0.3)` }}>
              Continue to Health Check →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── METRIC SCREENS ───────────────────────────────────────────────────────────
  if (screen === "metric") {
    const m = METRICS[metricStep];
    const f = form;
    const flaggedFields = m.fields.filter(fld => !fld.noFlag && fld.k !== "notes" && getFlag(fld.k, f[fld.k], f.gender || "") !== "ok");
    return (
      <div className="fw-page">
        <Nav />
        <div className="fw-content">
          {/* Patient banner */}
          <div style={{ background: isDark ? "rgba(0,32,96,0.3)" : "rgba(0,32,96,0.06)", border: `1px solid ${FED_NAVY}`, borderRadius: 10, padding: "10px 16px", marginBottom: 18, display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12, color: "var(--text)" }}>
            <span><strong>Patient:</strong> {f.name || "—"}</span>
            <span><strong>Age:</strong> {f.age || "—"}</span>
            <span><strong>Gender:</strong> {f.gender || "—"}</span>
            <span><strong>Postcode:</strong> {f.postcode || "—"}</span>
            <span><strong>Nurse:</strong> {f.sn || "—"}</span>
            <span><strong>Supervisor:</strong> {f.rn || "—"}</span>
          </div>
          {/* Step + navigate */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FED_GOLD, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step {metricStep + 2} of {METRICS.length + 2}</div>
            <select className="fw-select" value={metricStep} onChange={e => setMS(parseInt(e.target.value))} style={{ maxWidth: 220 }}>
              {METRICS.map((mt, i) => <option key={i} value={i}>{i + 1}. {mt.label}</option>)}
            </select>
          </div>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {METRICS.map((_, i) => { const a = i === metricStep, d = i < metricStep; return <div key={i} style={{ width: a ? 28 : 10, height: 10, borderRadius: 5, background: d ? "#0B7A65" : a ? FED_NAVY : "var(--border)", transition: "all 0.3s" }} />; })}
          </div>
          {/* Metric card */}
          <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "0 4px 14px var(--shadow)", marginBottom: 14 }}>
            <div style={{ background: `linear-gradient(135deg,${m.color},rgba(0,0,0,0.12))`, padding: "20px 24px", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 40, lineHeight: 1 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.75 }}>Health Metric</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{m.label}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 24 }}>
              {m.fields.map(fld => {
                const v = f[fld.k] || "";
                const fl = (!fld.noFlag && fld.k !== "notes") ? getFlag(fld.k, v, f.gender || "") : "ok";
                const hasVal = v !== "" && !isNaN(parseFloat(v));
                const inputExtra = (!fld.noFlag && fld.k !== "notes") ? iStyle(fl, hasVal) : {};
                return (
                  <div key={fld.k} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{fld.label}</label>
                      {fl !== "ok" && <Badge status={fl} />}
                      {fl === "ok" && hasVal && !fld.noFlag && fld.k !== "notes" && <Badge status="ok" />}
                    </div>
                    {fld.textarea ? (
                      <textarea className="fw-input" value={v} onChange={e => setF(fld.k, e.target.value)} placeholder={fld.ph}
                        style={{ resize: "vertical", height: 100 }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input className="fw-input" type="number" value={v} onChange={e => setF(fld.k, e.target.value)} placeholder={fld.ph}
                          style={{ flex: 1, fontSize: 20, fontWeight: 600, ...inputExtra }} />
                        {fld.unit && <span style={{ fontSize: 14, color: "var(--muted)", marginLeft: 10, fontWeight: 500, flexShrink: 0 }}>{fld.unit}</span>}
                      </div>
                    )}
                    {fld.hint && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>{fld.hint}</div>}
                    {fl !== "ok" && <HealthLinks flagKey={fld.k} status={fl} />}
                  </div>
                );
              })}

              {flaggedFields.length > 0 && (
                <div style={{ background: isDark ? "#2D0A0A" : "#FEF2F2", border: "1.5px solid #B91C1C", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#B91C1C" }}>
                  <strong>⚠ Out of range</strong>
                </div>
              )}

            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button onClick={() => metricStep > 0 ? setMS(s => s - 1) : setScreen("clientdetails")}
              style={{ padding: "11px 20px", borderRadius: 9, background: "var(--surface)", color: "var(--muted)", border: "1.5px solid var(--border)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Previous</button>
            {metricStep < METRICS.length - 1 ? (
              <button onClick={() => setMS(s => s + 1)}
                style={{ padding: "11px 22px", borderRadius: 9, background: FED_NAVY, color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Save &amp; Next →</button>
            ) : (
              <button onClick={() => setScreen("review")}
                style={{ padding: "11px 22px", borderRadius: 9, background: "#0B7A65", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Review &amp; Submit →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── REVIEW ───────────────────────────────────────────────────────────────────
  if (screen === "review") {
    const f = form;
    const flags = {}; Object.keys(RANGES).forEach(k => { flags[k] = getFlag(k, f[k], f.gender || ""); });
    const rows = [
      ["Blood Pressure", `${f.bpSys || "—"}/${f.bpDia || "—"}`, "mmHg", flags.bpSys === "ok" && flags.bpDia === "ok" ? "ok" : "high"],
      ["Pulse", f.pulse, "bpm", flags.pulse], ["Resp Rate", f.resp, "/min", flags.resp],
      ["Oxygen Sat", f.oxysat, "%", flags.oxysat], ["Temp", f.temp, "°C", flags.temp],
      ["Height", f.height, "cm", "ok"],
      ["Weight", f.weight, "kg", "ok"],
      ["Waist", f.waist, "cm", flags.waist],
      ["BMI", f.bmi, "kg/m²", flags.bmi], ["Diabetes Risk", f.diab, "pts", flags.diab],
    ].filter(r => r[1] && r[1] !== "—/—");
    const fc = Object.values(flags).filter(v => v !== "ok").length;
    return (
      <div className="fw-page">
        <Nav />
        <div className="fw-content">
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: FED_GOLD, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Final Step · Review</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>Review Health Data</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>Check everything before submitting.</p>
          </div>
          <div className="fw-card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Patient Summary</div>
            <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div className="fw-grid2" style={{ fontSize: 13, gap: 8 }}>
                {[["Patient", f.name || "—"], ["Age", f.age || "—"], ["Gender", f.gender || "—"], ["GP Visit", f.seenGP || "—"], ["Home Postcode", f.postcode || "—"], ["Date", fmtDate(f.checkDate)], ["Event Location", f.loc || "—"], ["Student", f.sn || "—"], ["Supervisor/RN", f.rn || "—"]].map(([l, v]) => (
                  <span key={l} style={{ color: "var(--text)" }}><strong style={{ color: "var(--muted)", fontWeight: 600 }}>{l}:</strong> {v}</span>
                ))}
              </div>
            </div>
            <div className="fw-review-grid">
              {rows.map(([label, value, unit, flag]) => (
                <div key={label} style={{ background: flag !== "ok" ? "#FEF2F2" : value && value !== "—" ? "#F0FDF4" : "var(--surface2)", borderRadius: 8, padding: "10px 14px", border: `1px solid ${flag !== "ok" ? "#B91C1C" : value && value !== "—" ? "#15803D" : "var(--border)"}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: flag !== "ok" ? "#B91C1C" : "var(--muted)", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: flag !== "ok" ? "#B91C1C" : "var(--text)" }}>{value} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted)" }}>{unit}</span></div>
                  {flag !== "ok" && <div style={{ fontSize: 10, color: "#B91C1C", marginTop: 2 }}>⚠ Out of range</div>}
                  {flag === "ok" && value && value !== "—" && <div style={{ fontSize: 10, color: "#15803D", marginTop: 2 }}>✓ In range</div>}
                </div>
              ))}
            </div>
            {fc > 0 && <div style={{ background: isDark ? "#2D0A0A" : "#FEF2F2", border: "1px solid #B91C1C", borderRadius: 8, padding: 12, marginTop: 14, fontSize: 13, color: "#B91C1C" }}>
              ⚠ {fc} out-of-range reading{fc > 1 ? "s" : ""} — Australian health links will be included on the report.
            </div>}
            <div style={{ background: isDark ? "#1A1500" : "#FFFBEB", border: "1px solid #F59E0B", borderRadius: 8, padding: 12, marginTop: 10, fontSize: 12, color: isDark ? "#FCD34D" : "#92400E" }}>
              🔒 Patient name appears on the printed/emailed report only — <strong>NOT</strong> stored in the database.
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button onClick={() => { setMS(METRICS.length - 1); setScreen("metric"); }}
              style={{ padding: "11px 22px", borderRadius: 9, background: "var(--surface)", color: "var(--muted)", border: "1.5px solid var(--border)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Edit readings</button>
            <button onClick={doSave}
              style={{ padding: "11px 26px", borderRadius: 9, background: "#15803D", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✓ Confirm &amp; Submit</button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (screen === "result" && saved) {
    const { patient, rec, flags } = saved;
    const flagged = Object.keys(flags).filter(k => flags[k] !== "ok");
    const rows = [
      ["Blood Pressure", `${rec.bpSys}/${rec.bpDia}`, "mmHg", flags.bpSys === "ok" && flags.bpDia === "ok" ? "ok" : "high"],
      ["Pulse", rec.pulse, "bpm", flags.pulse], ["Resp Rate", rec.resp, "/min", flags.resp],
      ["Oxygen Sat", rec.oxysat, "%", flags.oxysat], ["Temperature", rec.temp, "°C", flags.temp],
      ["Weight", rec.weight, "kg", "ok"],
      ["Waist", rec.waist, "cm", flags.waist],
      ["BMI", rec.bmi, "kg/m²", flags.bmi],
    ].filter(r => r[1] !== null && r[1] !== undefined && !isNaN(parseFloat(r[1])));
    return (
      <div className="fw-page">
        <Nav />
        <div className="fw-content-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 10 }} className="no-print">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#0B7A65,#065f46)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20 }}>✓</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0B7A65", textTransform: "uppercase", letterSpacing: "0.07em" }}>Saved · {rec.id}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>Health Check Complete</div>
              </div>
            </div>
          </div>
          <PrivacyBanner dark={isDark}><strong>{patient.name}</strong>'s name removed. Readings stored under <strong>{rec.id}</strong>.</PrivacyBanner>
          <div className="fw-result-grid">
            <div className="fw-card">
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Results · {fmtDate(rec.d)}</div>
              <div style={{ borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
                {rows.map(([label, value, unit, flag], i) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", background: flag !== "ok" ? (isDark ? "#2D0A0A" : "#FEF2F2") : (isDark ? "#0D2F1A" : "#F0FDF4"), borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{value} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted)" }}>{unit}</span></span>
                      <Badge status={flag} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {flagged.length ? (
                <div style={{ background: isDark ? "#2D0A0A" : "#FEF2F2", border: "1.5px solid #B91C1C", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C", marginBottom: 8 }}>⚠ Take Action</div>
                  {flagged.map(k => (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: "var(--text)" }}>{RANGES[k]?.l}</span><Badge status={flags[k]} />
                      </div>
                      <HealthLinks flagKey={k} status={flags[k]} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: isDark ? "#0D2F1A" : "#F0FDF4", border: "1.5px solid #15803D", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, color: "#15803D" }}>✓ All readings normal</div>
              )}
              <div className="fw-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Deliver Report</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 10px", background: "rgba(0,32,96,0.06)", borderRadius: 8, border: `1px solid ${FED_NAVY}` }}>
                  <FedUniLogo white={isDark} height={22} />
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 }}>Report includes <strong style={{ color: "var(--text)" }}>{patient.name}</strong>'s name, full results &amp; Australian health links.</p>
                <button onClick={() => setSP(true)}
                  style={{ width: "100%", padding: 11, borderRadius: 9, background: FED_NAVY, color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                  🖨 Preview &amp; Print Report
                </button>
                <button onClick={() => alert("Email functionality available in the final backend build.")}
                  style={{ width: "100%", padding: 11, borderRadius: 9, background: "#0B7A65", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  ✉ Email Report to Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  if (screen === "dashboard") {
    const allYears = [
      "All",
      ...Array.from(new Set(records.map(r => r.d?.slice(0, 4)).filter(Boolean))).sort()
    ];

    const allPostcodes = [
      "All",
      ...Array.from(new Set(records.map(r => r.postcode).filter(Boolean))).sort()
    ];

    const allLocations = [
      "All",
      ...Array.from(new Set(records.map(r => r.loc).filter(Boolean))).sort()
    ];

    const allClinicPostcodes = [
      "All",
      ...Array.from(new Set(records.map(r => r.clinicPostcode).filter(Boolean))).sort()
    ];

    const df = dashFilter;

    const recs = records.filter(r => {
      if (df.year !== "All" && r.d?.slice(0, 4) !== df.year) return false;
      if (df.postcode !== "All" && r.postcode !== df.postcode) return false;
      if (df.gender !== "All" && r.gender !== df.gender) return false;
      if (df.gp !== "All" && r.gp !== df.gp) return false;
      if (df.loc !== "All" && r.loc !== df.loc) return false;
      if (df.clinicPostcode !== "All" && r.clinicPostcode !== df.clinicPostcode) return false;
      return true;
    });
    const total = recs.length;
    const avg = k => total ? (recs.reduce((s, r) => s + (parseFloat(r[k]) || 0), 0) / total).toFixed(1) : "—";
    const fc = k => recs.filter(r => getFlag(k, r[k], r.gender) !== "ok").length;

    // Postcode analysis
    const pcData = Array.from(new Set(records.map(r => r.postcode).filter(Boolean))).sort().map(pc => {
      const pr = records.filter(r => r.postcode === pc);
      const ageDist = {}; AGE_GROUPS.forEach(g => { ageDist[g.l] = pr.filter(r => ageGroup(r.age) === g.l).length; });
      return {
        postcode: pc, count: pr.length, flagged: pr.filter(r => hasFlag(r)).length,
        avgBP: pr.length ? (pr.reduce((s, r) => s + (parseFloat(r.bpSys) || 0), 0) / pr.length).toFixed(0) : "—",
        avgBMI: pr.length ? (pr.reduce((s, r) => s + (parseFloat(r.bmi) || 0), 0) / pr.length).toFixed(1) : "—",
        avgAge: pr.length ? (pr.reduce((s, r) => s + (parseFloat(r.age) || 0), 0) / pr.length).toFixed(0) : "—",
        ageDist,
        topIssue: Object.entries(Object.keys(RANGES).reduce((acc, k) => { acc[RANGES[k].l] = (acc[RANGES[k].l] || 0) + pr.filter(r => getFlag(k, r[k], r.gender) !== "ok").length; return acc; }, {})).sort((a, b) => b[1] - a[1]).filter(([, n]) => n > 0)[0]?.[0] || "—",
      };
    });

    return (
      <div className="fw-page">
        <Nav />
        <div className="fw-content-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>Health Trends Dashboard</h2>
              <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}><strong>{records.length}</strong> total sessions · Postcode-based demographic analysis · No patient names stored</p>
            </div>
            <FedUniLogo white={isDark} height={30} />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {[["overview", "📊 Overview"], ["postcodes", "📮 By Postcode"], ["records", "🗂 Records"]].map(([t, label]) => (
              <button key={t} onClick={() => setDashTab(t)}
                style={{ padding: "8px 16px", borderRadius: 9, border: `1.5px solid ${dashTab === t ? FED_NAVY : "var(--border)"}`, background: dashTab === t ? (isDark ? `rgba(0,32,96,0.4)` : `rgba(0,32,96,0.08)`) : "var(--surface)", color: dashTab === t ? FED_NAVY : "var(--muted)", fontSize: 13, fontWeight: dashTab === t ? 700 : 400, cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="fw-card" style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Filter Records</div>
            {/* Date mode buttons — from the screenshot */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
              {[
                ["year", "Year", allYears],
                ["loc", "Event Location", allLocations],
                ["clinicPostcode", "Event Postcode", allClinicPostcodes],
                ["postcode", "Patient Postcode", allPostcodes],
                ["gender", "Gender", ["All", "Male", "Female", "Non-Binary", "Prefer not to say", "Other"]],
                ["gp", "GP Visit?", ["All", "Yes", "No"]]
              ].map(([k, label, opts]) => (
                <div key={k}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 5
                  }}>
                    {label}
                  </div>

                  <select
                    className="fw-select"
                    value={df[k]}
                    onChange={e => setDF(f => ({ ...f, [k]: e.target.value }))}
                    style={{ minWidth: 150 }}
                  >
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                <span style={{
                  background: brandSoftBg,
                  color: brandText,
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "5px 12px",
                  borderRadius: 999,
                  border: `1px solid ${FED_NAVY}`
                }}>
                  {total} records
                </span>

                <button
                  onClick={() => setDF({
                    year: "All",
                    postcode: "All",
                    gender: "All",
                    gp: "All",
                    loc: "All",
                    clinicPostcode: "All"
                  })}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 7,
                    border: "1px solid var(--border)",
                    background: "none",
                    color: "var(--muted)",
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ── OVERVIEW TAB ── */}
          {dashTab === "overview" && <>
            <div className="fw-grid5" style={{ marginBottom: 18 }}>
              {[{ l: "Total Sessions", v: total, u: "", c: FED_NAVY }, { l: "Avg Sys BP", v: avg("bpSys"), u: "mmHg", w: parseFloat(avg("bpSys")) > 120, c: "#B91C1C" }, { l: "Avg BMI", v: avg("bmi"), u: "kg/m²", w: parseFloat(avg("bmi")) > 24.9, c: "#6D28D9" }, { l: "Avg Diabetes", v: avg("diab"), u: "pts", w: parseFloat(avg("diab")) > 11, c: "#B45309" }, { l: "Avg SpO₂", v: avg("oxysat"), u: "%", w: parseFloat(avg("oxysat")) < 95, c: "#0B7A65" }].map(s => (
                <div key={s.l} className="fw-stat-card" style={{ borderTop: `3px solid ${s.w ? "#B91C1C" : s.c}` }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.w ? "#B91C1C" : s.c, lineHeight: 1 }}>{s.v}</div>
                  {s.u && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{s.u}</div>}
                </div>
              ))}
            </div>
            <div className="fw-chart-row">
              <div className="fw-card">
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Out-of-range Rates</div>
                {[["Systolic BP", "bpSys", "#B91C1C"], ["Diastolic BP", "bpDia", "#B91C1C"], ["BMI", "bmi", "#B45309"], ["Diabetes Risk", "diab", "#B45309"], ["Waist", "waist", "#B45309"], ["Oxygen Sat", "oxysat", "#0284C7"], ["Pulse", "pulse", "#0284C7"], ["Resp Rate", "resp", "#0284C7"]].map(([l, k, c]) => (
                  <Bar key={l} label={l} n={fc(k)} total={total} color={c} />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="fw-card">
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Age Group Distribution</div>
                  {AGE_GROUPS.map(g => <Bar key={g.l} label={g.l} n={recs.filter(r => ageGroup(r.age) === g.l).length} total={total} color="#6D28D9}" />)}
                </div>
                <div className="fw-card">
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>GP Visit in Last 12 Months</div>
                  {["Yes", "No"].map(g => <Bar key={g} label={g} n={recs.filter(r => r.gp === g).length} total={total} color={g === "No" ? "#B45309" : "#15803D"} />)}
                </div>
                <div className="fw-card">
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>By Gender</div>
                  {["Male", "Female", "Non-Binary", "Prefer not to say"].map(g => <Bar key={g} label={g} n={recs.filter(r => r.gender === g).length} total={total} color={FED_NAVY} />)}
                </div>
              </div>
            </div>
          </>}

          {/* ── POSTCODE TAB ── */}
          {dashTab === "postcodes" && (
            <div>
              <div className="fw-card" style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Patient Home Postcode Analysis</div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Each postcode = patients' home area — used to identify future pop-up clinic locations. Age group distribution helps identify demographics per area.</p>
                {pcData.map(pc => (
                  <div key={pc.postcode} style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
                    <div style={{ background: `linear-gradient(135deg,${FED_NAVY},#003476)`, padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>📮</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{pc.postcode}</span>
                        <span style={{ background: "rgba(255,171,0,0.2)", color: FED_GOLD, fontSize: 11, padding: "2px 8px", borderRadius: 999, border: `1px solid ${FED_GOLD}` }}>{pc.count} patient{pc.count !== 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.7)", flexWrap: "wrap" }}>
                        <span>Avg age: <strong style={{ color: "white" }}>{pc.avgAge}</strong></span>
                        <span>Avg BP: <strong style={{ color: "white" }}>{pc.avgBP} mmHg</strong></span>
                        <span>Avg BMI: <strong style={{ color: "white" }}>{pc.avgBMI}</strong></span>
                        <span style={{ color: pc.flagged > 0 ? "#FCA5A5" : "rgba(255,255,255,0.7)" }}>⚠ {pc.flagged} flagged ({pct(pc.flagged, pc.count)}%)</span>
                      </div>
                    </div>
                    <div style={{ padding: 16, background: "var(--surface)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Age Group Distribution</div>
                        {AGE_GROUPS.map(g => (
                          <div key={g.l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, width: 60, flexShrink: 0, color: "var(--text)" }}>{g.l}</span>
                            <div style={{ flex: 1, background: "var(--border)", borderRadius: 999, height: 8, overflow: "hidden" }}>
                              <div style={{
                                width: `${pct(pc.ageDist[g.l] || 0, pc.count)}%`, height: 8,
                                background: g.l === "Under 18" ? FED_NAVY : g.l === "18–30" ? "#0B7A65" : g.l === "31–45" ? "#15803D" : g.l === "46–60" ? FED_GOLD : "#B45309",
                                borderRadius: 999
                              }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", width: 20, flexShrink: 0 }}>{pc.ageDist[g.l] || 0}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Quick Stats</div>
                        <div className="fw-grid2" style={{ gap: 8 }}>
                          {[["Avg Age", pc.avgAge, "yrs"], ["Avg Sys BP", pc.avgBP, "mmHg"], ["Avg BMI", pc.avgBMI, "kg/m²"], ["Top Issue", pc.topIssue, ""]].map(([l, v, u]) => (
                            <div key={l} style={{ background: "var(--surface2)", borderRadius: 8, padding: "8px 10px" }}>
                              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>{l}</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{v}{u ? ` ${u}` : ""}</div>
                            </div>
                          ))}
                        </div>
                        {(() => {
                          const dom = AGE_GROUPS.reduce((a, g) => (pc.ageDist[g.l] || 0) > (pc.ageDist[a.l] || 0) ? g : a, AGE_GROUPS[0]);
                          const dp = pct(pc.ageDist[dom.l] || 0, pc.count);
                          if (dp >= 50) return (
                            <div style={{ marginTop: 8, padding: "8px 12px", background: dp >= 70 ? (isDark ? "#2D1A00" : "#FFFBEB") : (isDark ? `rgba(0,32,96,0.2)` : `rgba(0,32,96,0.06)`), border: `1px solid ${dp >= 70 ? FED_GOLD : FED_NAVY}`, borderRadius: 8, fontSize: 12, color: dp >= 70 ? FED_GOLD : FED_NAVY, fontWeight: 600 }}>
                              {dp >= 70 ? "⚠" : "ℹ"} Predominantly <strong>{dom.l}</strong> population ({dp}%)
                            </div>
                          );
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RECORDS TAB ── */}
          {dashTab === "records" && (
            <div className="fw-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>De-identified Session Records</div>
                <PrivacyBanner dark={isDark}>No patient names stored. Session ID, age, postcode &amp; gender only — as agreed with clients 25 March 2026.</PrivacyBanner>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "var(--surface2)" }}>
                      {["ID", "Date", "Age", "Gender", "Postcode", "GP", "Event Location", "Sys", "Dia", "Pulse", "SpO₂", "Temp", "Waist", "BMI", "Diab", "Status"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "var(--muted)", whiteSpace: "nowrap", borderBottom: "1.5px solid var(--border)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recs.map((r, i) => {
                      const hf = hasFlag(r);
                      return (
                        <tr key={r.id} style={{ background: i % 2 ? "var(--surface2)" : "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "7px 10px", fontWeight: 700, color: brandText, whiteSpace: "nowrap" }}>{r.id}</td>
                          <td style={{ padding: "7px 10px", whiteSpace: "nowrap", color: "var(--text)" }}>{fmtDate(r.d)}</td>
                          <td style={{ padding: "7px 10px", color: "var(--text)" }}>{r.age}</td>
                          <td style={{ padding: "7px 10px", color: "var(--text)" }}>{r.gender}</td>
                          <td style={{ padding: "7px 10px", fontWeight: 700, color: "#6D28D9" }}>{r.postcode || "—"}</td>
                          <td style={{ padding: "7px 10px", color: "var(--text)" }}>{r.gp}</td>
                          <td style={{ padding: "7px 10px", whiteSpace: "nowrap", color: "var(--text)" }}>{r.loc}</td>
                          {["bpSys", "bpDia", "pulse", "oxysat", "temp", "waist", "bmi", "diab"].map(k => {
                            const fl = getFlag(k, r[k], r.gender);
                            return <td key={k} style={{ padding: "7px 10px", fontWeight: fl !== "ok" ? 700 : 400, color: fl !== "ok" ? "#B91C1C" : fl === "ok" && r[k] ? "#15803D" : "var(--muted)" }}>{r[k] || "—"}</td>;
                          })}
                          <td style={{ padding: "7px 10px" }}>
                            <span style={{ background: hf ? (isDark ? "#2D0A0A" : "#FEF2F2") : (isDark ? "#0D2F1A" : "#F0FDF4"), color: hf ? "#B91C1C" : "#15803D", fontWeight: 700, fontSize: 10, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
                              {hf ? "⚠ Action" : "✓ Good"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}