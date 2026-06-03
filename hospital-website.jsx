import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── Mock Data ───────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    id: 1,
    nameBn: "ডাঃ নেসার আহমেদ",
    nameEn: "Dr. Nesar Ahmed",
    specialtyBn: "ডায়াবেটিস, হৃদরোগ ও গ্যাস্ট্রোলিভার বিশেষজ্ঞ",
    specialtyEn: "Diabetes, Cardiology & Gastro-Liver Specialist",
    degrees: ["MBBS (CMC)", "BCS (Health)", "MCPS (Medicine)", "FCPS (FP)", "MRCPI (UK) - PACES", "PGDT (Gastroenterology)"],
    visitingBn: "প্রতি বৃহস্পতিবার, বিকাল ৩:৩০ থেকে রাত ৯টা",
    visitingEn: "Every Thursday, 3:30 PM – 9:00 PM",
    days: [4], // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    startTime: "15:30", endTime: "21:00",
    tag: "Cardiology", color: "#FF6B00", initial: "NA",
  },
  {
    id: 2,
    nameBn: "অধ্যাপক মোঃ মাহাবুবুল ইসলাম মজুমদার",
    nameEn: "Prof. Md. Mahabubul Islam Majumdar",
    specialtyBn: "মেডিসিন বিশেষজ্ঞ",
    specialtyEn: "Medicine Specialist",
    degrees: ["FCPS (Medicine)", "FMARCP (Glasgow)", "MACP", "Former Head, Medicine Dept, Comilla Medical College & Hospital"],
    visitingBn: "প্রতি মঙ্গলবার, দুপুর ২টা থেকে সন্ধ্যা ৬টা",
    visitingEn: "Every Tuesday, 2:00 PM – 6:00 PM",
    days: [2],
    startTime: "14:00", endTime: "18:00",
    tag: "Medicine", color: "#1A2B4A", initial: "MM",
  },
  {
    id: 3,
    nameBn: "ডা. মিল্টন শাহরিয়ার অর্পণ",
    nameEn: "Dr. Milton Shahriyar Arpon",
    specialtyBn: "মেডিসিন ও হৃদরোগ চিকিৎসক",
    specialtyEn: "Medicine & Cardiology Physician",
    degrees: ["MBBS", "MD", "MRCP (UK) - PACES", "MD - Cardiology (Course), National Heart Institute, Dhaka"],
    visitingBn: "বৃহস্পতিবার (বিকাল ৪টা – রাত ৮টা), শুক্রবার (সকাল ১০টা – সন্ধ্যা ৪টা)",
    visitingEn: "Thursday 4–8 PM | Friday 10 AM–4 PM",
    days: [4, 5],
    startTime: "10:00", endTime: "20:00",
    tag: "Cardiology", color: "#FF6B00", initial: "MA",
  },
];

const SERVICES = [
  { id: 1, icon: "🏥", title: "ICU", full: "Intensive Care Unit", desc: "State-of-the-art intensive care with 24/7 critical monitoring, ventilator support, and expert intensivists.", color: "#FF6B00" },
  { id: 2, icon: "❤️", title: "CCU", full: "Coronary Care Unit", desc: "Specialized cardiac monitoring for heart attack, arrhythmia, and post-cardiac surgery patients.", color: "#e53e3e" },
  { id: 3, icon: "👶", title: "NICU", full: "Neonatal ICU", desc: "Advanced neonatal care for premature and critically ill newborns with incubators and phototherapy.", color: "#9f7aea" },
  { id: 4, icon: "🧒", title: "PICU", full: "Pediatric ICU", desc: "Dedicated pediatric critical care unit for children requiring intensive monitoring and treatment.", color: "#38b2ac" },
  { id: 5, icon: "🩺", title: "HDU", full: "High Dependency Unit", desc: "Step-down care between ICU and general wards for patients needing close observation.", color: "#4299e1" },
  { id: 6, icon: "💧", title: "Dialysis", full: "Renal Dialysis Center", desc: "Hemodialysis and peritoneal dialysis services for chronic and acute kidney failure patients.", color: "#48bb78" },
  { id: 7, icon: "🦴", title: "Physiotherapy", full: "Physiotherapy & Rehab", desc: "Comprehensive rehabilitation, pain management, and physiotherapy by certified specialists.", color: "#ed8936" },
  { id: 8, icon: "🚨", title: "Emergency", full: "24/7 Emergency & Trauma", desc: "Round-the-clock emergency and trauma center with dedicated trauma surgeons and resuscitation bays.", color: "#fc4040" },
];

const MOCK_SERIALS = [
  { serial: "SL-2026-0038", name: "Rahim Uddin", doctor: "Dr. Nesar Ahmed", date: "2026-06-05", status: "completed", queue: 0, wait: 0 },
  { serial: "SL-2026-0039", name: "Fatema Begum", doctor: "Dr. Nesar Ahmed", date: "2026-06-05", status: "called", queue: 0, wait: 0 },
  { serial: "SL-2026-0040", name: "Kamal Hossain", doctor: "Dr. Nesar Ahmed", date: "2026-06-05", status: "waiting", queue: 1, wait: 20 },
  { serial: "SL-2026-0041", name: "Nasreen Akter", doctor: "Prof. Mahabubul Islam", date: "2026-06-03", status: "waiting", queue: 2, wait: 40 },
  { serial: "SL-2026-0042", name: "Jamal Uddin", doctor: "Dr. Milton Arpon", date: "2026-06-06", status: "waiting", queue: 3, wait: 60 },
];

const MOCK_REPORTS = [
  { id: 1, name: "Complete Blood Count (CBC)", type: "Blood Test", date: "2026-06-01", status: "ready", icon: "🩸" },
  { id: 2, name: "Chest X-Ray", type: "X-Ray", date: "2026-06-01", status: "ready", icon: "🫁" },
  { id: 3, name: "ECG Report", type: "ECG", date: "2026-06-01", status: "processing", icon: "📈" },
  { id: 4, name: "Abdominal USG", type: "USG", date: "2026-06-01", status: "ready", icon: "🔊" },
];

// ─── Utilities ───────────────────────────────────────────────────────────────
function generateTimeSlots(start, end, interval = 20) {
  const slots = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur < endMin) {
    const h = Math.floor(cur / 60), m = cur % 60;
    const hf = h > 12 ? h - 12 : h, ampm = h >= 12 ? "PM" : "AM";
    slots.push(`${String(hf).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`);
    cur += interval;
  }
  return slots;
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "#1A2B4A" : "#e53e3e",
      color: "#fff", padding: "14px 22px", borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10,
      animation: "slideInRight 0.3s ease", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, maxWidth: 320,
    }}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navLinks = [
    { id: "home", label: "Home" }, { id: "doctors", label: "Doctors" },
    { id: "services", label: "Services" }, { id: "appointment", label: "Appointment" },
    { id: "serial", label: "Serial Status" }, { id: "reports", label: "Reports" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(26,43,74,0.97)" : "#1A2B4A",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.18)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#FF6B00,#ff9a00)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 0 3px rgba(255,107,0,0.3)" }}>🏥</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, lineHeight: 1.1, fontFamily: "'Hind Siliguri', sans-serif", letterSpacing: 0.3 }}>Famous Specialized</div>
            <div style={{ color: "#FF6B00", fontWeight: 700, fontSize: 12, letterSpacing: 0.5, fontFamily: "'Hind Siliguri', sans-serif" }}>Hospital & Trauma Center</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} style={{
              background: page === n.id ? "rgba(255,107,0,0.18)" : "none",
              border: page === n.id ? "1px solid rgba(255,107,0,0.5)" : "1px solid transparent",
              color: page === n.id ? "#FF6B00" : "rgba(255,255,255,0.82)",
              padding: "7px 13px", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13.5, fontWeight: 600,
              transition: "all 0.2s",
            }}>{n.label}</button>
          ))}
          <a href="tel:01689464646" style={{
            background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
            padding: "7px 16px", borderRadius: 8, textDecoration: "none",
            fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, fontWeight: 700,
            marginLeft: 4, whiteSpace: "nowrap",
          }}>📞 Emergency</a>
        </nav>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="hamburger" style={{
          display: "none", background: "none", border: "none", color: "#fff", fontSize: 26, cursor: "pointer",
        }}>☰</button>
      </div>
      {mobileOpen && (
        <div style={{ background: "#0f1d35", padding: "8px 20px 20px", borderTop: "1px solid rgba(255,107,0,0.15)" }}>
          {navLinks.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left",
              background: page === n.id ? "rgba(255,107,0,0.12)" : "none",
              border: "none", color: page === n.id ? "#FF6B00" : "rgba(255,255,255,0.85)",
              padding: "11px 10px", cursor: "pointer",
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, fontWeight: 600,
              borderRadius: 8, marginBottom: 2,
            }}>{n.label}</button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #1A2B4A 50%, #0f2040 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 20px 60px", position: "relative", overflow: "hidden",
      }}>
        {/* Animated background circles */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)", animation: "pulse 3s infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)", animation: "pulse 4s infinite 1s" }} />
        {/* Heartbeat SVG */}
        <svg style={{ position: "absolute", bottom: 60, left: 0, right: 0, width: "100%", opacity: 0.2 }} height="60" viewBox="0 0 1200 60">
          <polyline points="0,30 200,30 220,10 240,50 260,5 280,55 300,30 1200,30" fill="none" stroke="#FF6B00" strokeWidth="2.5" style={{ animation: "drawLine 2s linear infinite" }} />
        </svg>
        <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.4)", borderRadius: 50, padding: "6px 18px", marginBottom: 24 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6B00", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "#FF6B00", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>24/7 EMERGENCY & TRAUMA CENTER</span>
          </div>
          <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 56px)", lineHeight: 1.15, marginBottom: 16 }}>
            Famous Specialized<br />
            <span style={{ color: "#FF6B00" }}>Hospital</span> & Trauma Center
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: "clamp(14px, 2vw, 18px)", marginBottom: 8 }}>
            বিশ্বমানের চিকিৎসাসেবা, আপনার দোরগোড়ায়
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, marginBottom: 36 }}>
            246, Zico Tower, Comilla Road, Chandpur, Bangladesh
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("appointment")} style={{
              background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
              border: "none", padding: "14px 32px", borderRadius: 50, fontSize: 16,
              fontWeight: 700, cursor: "pointer", fontFamily: "'Hind Siliguri', sans-serif",
              boxShadow: "0 8px 24px rgba(255,107,0,0.4)", transition: "transform 0.2s",
            }}>📅 Book Appointment</button>
            <a href="tel:01689464646" style={{
              background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)",
              padding: "14px 32px", borderRadius: 50, fontSize: 16, fontWeight: 700,
              textDecoration: "none", fontFamily: "'Hind Siliguri', sans-serif",
            }}>📞 01689-464646</a>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section style={{ background: "#fff", padding: "60px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 32, color: "#1A2B4A", marginBottom: 8 }}>Our Specialized Services</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 44, fontFamily: "'Hind Siliguri', sans-serif" }}>আমাদের বিশেষায়িত সেবাসমূহ</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 20 }}>
            {SERVICES.map(s => (
              <div key={s.id} onClick={() => setPage("services")} style={{
                background: "#f8f9ff", borderRadius: 16, padding: "24px 16px", textAlign: "center",
                cursor: "pointer", border: "2px solid transparent", transition: "all 0.25s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
                onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${s.color}`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.12)`; }}
                onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ color: s.color, fontWeight: 800, fontSize: 16, fontFamily: "'Hind Siliguri', sans-serif" }}>{s.title}</div>
                <div style={{ color: "#666", fontSize: 11, marginTop: 4, fontFamily: "'Hind Siliguri', sans-serif" }}>{s.full.split(" ").slice(0, 3).join(" ")}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section style={{ background: "#f4f6fb", padding: "60px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 32, color: "#1A2B4A", marginBottom: 8 }}>Our Expert Doctors</h2>
          <p style={{ textAlign: "center", color: "#888", marginBottom: 44, fontFamily: "'Hind Siliguri', sans-serif" }}>আমাদের বিশেষজ্ঞ চিকিৎসকগণ</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {DOCTORS.map(doc => <DoctorCard key={doc.id} doc={doc} setPage={setPage} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={() => setPage("doctors")} style={{
              background: "#1A2B4A", color: "#fff", border: "none", padding: "12px 32px",
              borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Hind Siliguri', sans-serif",
            }}>View All Doctors →</button>
          </div>
        </div>
      </section>

      {/* About */}
      <section style={{ background: "#1A2B4A", padding: "60px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🏥</div>
          <h2 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 32, marginBottom: 16 }}>About Our Hospital</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Famous Specialized Hospital & Trauma Center is a premier multi-specialty healthcare facility located in Chandpur, Bangladesh. We are committed to providing world-class medical care with compassion, integrity, and clinical excellence.
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, lineHeight: 1.8 }}>
            ফেমাস স্পেশালাইজড হাসপাতাল ও ট্রমা সেন্টার চাঁদপুরের একটি শীর্ষস্থানীয় বহু-বিশেষজ্ঞ স্বাস্থ্যসেবা প্রতিষ্ঠান। আমরা বিশ্বমানের চিকিৎসাসেবা প্রদানে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>
      </section>

      {/* Appointment CTA */}
      <section style={{ background: "linear-gradient(135deg,#FF6B00,#ff8c00)", padding: "50px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 30, marginBottom: 12 }}>Book Your Appointment Today</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, marginBottom: 28 }}>
            আজই আপনার অ্যাপয়েন্টমেন্ট বুক করুন। সিরিয়ালের জন্য কল করুন: 01747-474719
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("appointment")} style={{
              background: "#fff", color: "#FF6B00", border: "none", padding: "13px 30px",
              borderRadius: 50, fontSize: 15, fontWeight: 800, cursor: "pointer",
              fontFamily: "'Hind Siliguri', sans-serif",
            }}>📅 Book Now</button>
            <a href="tel:01747474719" style={{
              background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)",
              padding: "13px 30px", borderRadius: 50, fontSize: 15, fontWeight: 700,
              textDecoration: "none", fontFamily: "'Hind Siliguri', sans-serif",
            }}>📞 01747-474719</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer setPage={setPage} />
    </div>
  );
}

function DoctorCard({ doc, setPage }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
      border: "2px solid transparent", transition: "all 0.3s", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${doc.color}`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.13)`; }}
      onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle, ${doc.color}18 0%, transparent 70%)`, borderRadius: "0 0 0 80px" }} />
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${doc.color}, ${doc.color}aa)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 22, fontFamily: "'Hind Siliguri', sans-serif",
          boxShadow: `0 4px 16px ${doc.color}44`,
        }}>{doc.initial}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", background: `${doc.color}18`, color: doc.color, padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700, marginBottom: 6, fontFamily: "'Hind Siliguri', sans-serif" }}>{doc.tag}</div>
          <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 15, color: "#1A2B4A", margin: 0, marginBottom: 2 }}>{doc.nameBn}</h3>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: "#888", margin: 0 }}>{doc.nameEn}</p>
        </div>
      </div>
      <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: "#555", marginBottom: 10, fontWeight: 600 }}>{doc.specialtyBn}</p>
      <div style={{ marginBottom: 14 }}>
        {doc.degrees.slice(0, 3).map((d, i) => (
          <span key={i} style={{ display: "inline-block", background: "#f0f4ff", color: "#1A2B4A", borderRadius: 6, padding: "2px 8px", fontSize: 11, marginRight: 5, marginBottom: 5, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 }}>{d}</span>
        ))}
      </div>
      <div style={{ background: "#f8f9ff", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `3px solid ${doc.color}` }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 2, fontFamily: "'Hind Siliguri', sans-serif" }}>⏰ Visiting Hours</div>
        <div style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 700, fontFamily: "'Hind Siliguri', sans-serif" }}>{doc.visitingBn}</div>
      </div>
      <button onClick={() => setPage("appointment")} style={{
        width: "100%", background: `linear-gradient(135deg, ${doc.color}, ${doc.color}cc)`,
        color: "#fff", border: "none", padding: "10px", borderRadius: 10, fontSize: 14,
        fontWeight: 700, cursor: "pointer", fontFamily: "'Hind Siliguri', sans-serif",
      }}>📅 Book Appointment</button>
    </div>
  );
}

// ─── DOCTORS PAGE ────────────────────────────────────────────────────────────
function DoctorsPage({ setPage }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const tags = ["All", "Cardiology", "Medicine"];
  const filtered = DOCTORS.filter(d =>
    (filter === "All" || d.tag === filter) &&
    (d.nameEn.toLowerCase().includes(search.toLowerCase()) || d.specialtyEn.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 90 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 38, marginBottom: 8 }}>Our Doctors</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 16, marginBottom: 28 }}>আমাদের বিশেষজ্ঞ চিকিৎসকগণ</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." style={{
              padding: "12px 20px", borderRadius: 50, border: "none", fontSize: 15,
              width: 280, fontFamily: "'Hind Siliguri', sans-serif", outline: "none",
            }} />
            <div style={{ display: "flex", gap: 8 }}>
              {tags.map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{
                  padding: "11px 20px", borderRadius: 50, border: "2px solid",
                  borderColor: filter === t ? "#FF6B00" : "rgba(255,255,255,0.3)",
                  background: filter === t ? "#FF6B00" : "transparent",
                  color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700,
                  fontSize: 14, cursor: "pointer",
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#888", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 18 }}>No doctors found.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
            {filtered.map(doc => (
              <div key={doc.id} style={{ background: "#fff", borderRadius: 22, padding: 30, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "2px solid transparent", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${doc.color}`; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${doc.color}, ${doc.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 900, fontSize: 26, flexShrink: 0, fontFamily: "'Hind Siliguri', sans-serif",
                    boxShadow: `0 6px 20px ${doc.color}33`,
                  }}>{doc.initial}</div>
                  <div>
                    <div style={{ background: `${doc.color}18`, color: doc.color, display: "inline-block", padding: "3px 12px", borderRadius: 50, fontSize: 12, fontWeight: 700, marginBottom: 6, fontFamily: "'Hind Siliguri', sans-serif" }}>{doc.tag}</div>
                    <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A2B4A", margin: "0 0 2px" }}>{doc.nameBn}</h3>
                    <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#999", fontSize: 13, margin: 0 }}>{doc.nameEn}</p>
                  </div>
                </div>
                <div style={{ background: `${doc.color}08`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, margin: "0 0 4px" }}>{doc.specialtyBn}</p>
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#777", fontSize: 13, margin: 0 }}>{doc.specialtyEn}</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Qualifications</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {doc.degrees.map((d, i) => (
                      <span key={i} style={{ background: "#f0f4ff", color: "#1A2B4A", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 }}>{d}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "12px 16px", marginBottom: 18, borderLeft: `4px solid ${doc.color}` }}>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4, fontFamily: "'Hind Siliguri', sans-serif" }}>⏰ Visiting Schedule</div>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#1A2B4A", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{doc.visitingBn}</div>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#666", fontSize: 13 }}>{doc.visitingEn}</div>
                </div>
                <button onClick={() => setPage("appointment")} style={{
                  width: "100%", background: `linear-gradient(135deg, ${doc.color}, ${doc.color}bb)`,
                  color: "#fff", border: "none", padding: "12px", borderRadius: 12,
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>📅 Book Appointment</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APPOINTMENT PAGE ─────────────────────────────────────────────────────────
function AppointmentPage() {
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "Male", problem: "" });
  const [confirmed, setConfirmed] = useState(null);

  const slots = selectedDoc && selectedDate
    ? generateTimeSlots(selectedDoc.startTime, selectedDoc.endTime)
    : [];

  const getAvailableDates = (doc) => {
    if (!doc) return [];
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (doc.days.includes(d.getDay())) {
        dates.push(d.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  const handleConfirm = () => {
    if (!form.name || !form.phone) { showToast("Please fill in Name and Phone.", "error"); return; }
    const slNum = `SL-2026-00${42 + Math.floor(Math.random() * 10)}`;
    setConfirmed({ serial: slNum, doctor: selectedDoc.nameEn, date: selectedDate, slot: selectedSlot, name: form.name });
    showToast("Appointment confirmed! " + slNum, "success");
  };

  if (confirmed) return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 44, maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 16px 60px rgba(0,0,0,0.12)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 28, color: "#1A2B4A", marginBottom: 8 }}>Appointment Confirmed!</h2>
        <div style={{ background: "linear-gradient(135deg,#FF6B00,#ff8c00)", borderRadius: 16, padding: 22, margin: "20px 0", color: "#fff" }}>
          <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, marginBottom: 6, opacity: 0.85 }}>Serial Number</div>
          <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>{confirmed.serial}</div>
        </div>
        <div style={{ textAlign: "left", background: "#f8f9ff", borderRadius: 14, padding: 20, marginBottom: 24 }}>
          {[["Patient", confirmed.name], ["Doctor", confirmed.doctor], ["Date", confirmed.date], ["Time", confirmed.slot]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #eee", fontFamily: "'Hind Siliguri', sans-serif" }}>
              <span style={{ color: "#888", fontSize: 14 }}>{k}</span>
              <span style={{ color: "#1A2B4A", fontWeight: 700, fontSize: 14 }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ color: "#888", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, marginBottom: 20 }}>📱 SMS confirmation will be sent to your registered number.</p>
        <button onClick={() => { setConfirmed(null); setStep(1); setSelectedDoc(null); setSelectedDate(""); setSelectedSlot(""); setForm({ name: "", phone: "", age: "", gender: "Male", problem: "" }); }} style={{
          background: "#1A2B4A", color: "#fff", border: "none", padding: "12px 30px",
          borderRadius: 50, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, cursor: "pointer", fontSize: 14,
        }}>Book Another</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 88 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Book Appointment</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif" }}>অ্যাপয়েন্টমেন্ট বুক করুন</p>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36, gap: 0 }}>
          {["Select Doctor", "Choose Date & Time", "Patient Info"].map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#FF6B00" : "#ddd",
                  color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 6, transition: "all 0.3s",
                }}>{step > i + 1 ? "✓" : i + 1}</div>
                <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: step === i + 1 ? "#FF6B00" : "#999", fontWeight: step === i + 1 ? 700 : 400, textAlign: "center" }}>{label}</div>
              </div>
              {i < 2 && <div style={{ height: 2, flex: 0.3, background: step > i + 1 ? "#22c55e" : "#ddd", transition: "all 0.3s", marginBottom: 22 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A2B4A", marginBottom: 20 }}>Select a Doctor</h3>
              {DOCTORS.map(doc => (
                <div key={doc.id} onClick={() => setSelectedDoc(doc)} style={{
                  border: `2px solid ${selectedDoc?.id === doc.id ? doc.color : "#e8ecf0"}`,
                  borderRadius: 16, padding: "16px 20px", marginBottom: 14, cursor: "pointer", transition: "all 0.2s",
                  background: selectedDoc?.id === doc.id ? `${doc.color}06` : "#fff",
                }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${doc.color},${doc.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontFamily: "'Hind Siliguri', sans-serif", flexShrink: 0 }}>{doc.initial}</div>
                    <div>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 15 }}>{doc.nameBn}</div>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#888", fontSize: 13 }}>{doc.specialtyEn}</div>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: doc.color, fontSize: 12, fontWeight: 700, marginTop: 3 }}>⏰ {doc.visitingEn}</div>
                    </div>
                    {selectedDoc?.id === doc.id && <div style={{ marginLeft: "auto", color: doc.color, fontSize: 22 }}>✓</div>}
                  </div>
                </div>
              ))}
              <button disabled={!selectedDoc} onClick={() => setStep(2)} style={{
                width: "100%", marginTop: 8, background: selectedDoc ? "linear-gradient(135deg,#FF6B00,#ff8c00)" : "#ccc",
                color: "#fff", border: "none", padding: "13px", borderRadius: 12,
                fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 15, cursor: selectedDoc ? "pointer" : "not-allowed",
              }}>Next: Choose Date & Time →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A2B4A", marginBottom: 6 }}>Select Date & Time</h3>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#888", fontSize: 13, marginBottom: 20 }}>Available dates for {selectedDoc?.nameEn}</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 8 }}>Select Date</label>
                <select value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(""); }} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", cursor: "pointer",
                }}>
                  <option value="">-- Choose a date --</option>
                  {getAvailableDates(selectedDoc).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {selectedDate && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 10 }}>Select Time Slot</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                    {slots.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)} style={{
                        padding: "9px 6px", borderRadius: 8, border: `2px solid ${selectedSlot === slot ? "#FF6B00" : "#e8ecf0"}`,
                        background: selectedSlot === slot ? "#FF6B00" : "#f8f9ff",
                        color: selectedSlot === slot ? "#fff" : "#333",
                        fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}>{slot}</button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "#f4f6fb", color: "#333", border: "none", padding: "13px", borderRadius: 12, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>← Back</button>
                <button disabled={!selectedDate || !selectedSlot} onClick={() => setStep(3)} style={{
                  flex: 2, background: selectedDate && selectedSlot ? "linear-gradient(135deg,#FF6B00,#ff8c00)" : "#ccc",
                  color: "#fff", border: "none", padding: "13px", borderRadius: 12,
                  fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 15, cursor: selectedDate && selectedSlot ? "pointer" : "not-allowed",
                }}>Next: Patient Info →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A2B4A", marginBottom: 20 }}>Patient Information</h3>
              <div style={{ background: "#f8f9ff", borderRadius: 12, padding: "14px 18px", marginBottom: 22, borderLeft: "4px solid #FF6B00" }}>
                <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, color: "#666" }}>
                  <b style={{ color: "#1A2B4A" }}>{selectedDoc?.nameEn}</b> · {selectedDate} · {selectedSlot}
                </div>
              </div>
              {[["Full Name / পূর্ণ নাম", "name", "text", "Enter your full name"],
                ["Phone / ফোন", "phone", "tel", "01XXXXXXXXX"],
                ["Age / বয়স", "age", "number", "Age"]].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[key]} placeholder={ph} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
                  }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>Gender</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Male", "Female", "Other"].map(g => (
                    <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))} style={{
                      flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${form.gender === g ? "#FF6B00" : "#e8ecf0"}`,
                      background: form.gender === g ? "#FF6B0010" : "#fff",
                      color: form.gender === g ? "#FF6B00" : "#333",
                      fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>{g}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>Problem Description / সমস্যার বিবরণ</label>
                <textarea value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} placeholder="Briefly describe your symptoms or reason for visit..." rows={4} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box",
                }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "#f4f6fb", color: "#333", border: "none", padding: "13px", borderRadius: 12, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>← Back</button>
                <button onClick={handleConfirm} style={{
                  flex: 2, background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
                  border: "none", padding: "13px", borderRadius: 12,
                  fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}>✅ Confirm Appointment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SERIAL PAGE ──────────────────────────────────────────────────────────────
function SerialPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!result) return;
    const t = setInterval(() => setLastRefresh(new Date()), 30000);
    return () => clearInterval(t);
  }, [result]);

  const search = () => {
    const found = MOCK_SERIALS.find(s => s.serial === input.toUpperCase() || s.serial.includes(input));
    if (found) { setResult(found); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  };

  const statusConfig = {
    waiting: { label: "Waiting", bg: "#fef3c7", color: "#d97706", dot: "#f59e0b", emoji: "🟡" },
    called: { label: "Called – Please Come In", bg: "#d1fae5", color: "#065f46", dot: "#10b981", emoji: "🟢" },
    completed: { label: "Completed", bg: "#e0e7ff", color: "#3730a3", dot: "#6366f1", emoji: "✅" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 88 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Serial Status</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif" }}>আপনার সিরিয়ালের অবস্থান জানুন</p>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", marginBottom: 16, fontSize: 18 }}>Enter Serial or Phone Number</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="e.g. SL-2026-0040 or 017..." style={{
              flex: 1, padding: "13px 18px", borderRadius: 12, border: "2px solid #e8ecf0",
              fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, outline: "none",
            }} />
            <button onClick={search} style={{
              background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff", border: "none",
              padding: "13px 24px", borderRadius: 12, fontFamily: "'Hind Siliguri', sans-serif",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>Search</button>
          </div>
          {notFound && <p style={{ color: "#e53e3e", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, marginTop: 12 }}>❌ Serial not found. Please check and try again.</p>}
        </div>

        {result && (() => {
          const sc = statusConfig[result.status];
          return (
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", margin: 0 }}>{result.serial}</h3>
                <div style={{ background: sc.bg, color: sc.color, padding: "6px 14px", borderRadius: 50, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  {result.status === "called" && <span style={{ width: 10, height: 10, background: sc.dot, borderRadius: "50%", display: "inline-block", animation: "pulse 1s infinite" }} />}
                  {sc.emoji} {sc.label}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[["Patient", result.name], ["Doctor", result.doctor], ["Date", result.date], ["Queue Position", result.queue > 0 ? `#${result.queue}` : "—"]].map(([k, v]) => (
                  <div key={k} style={{ background: "#f8f9ff", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: "#999", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 15, color: "#1A2B4A", fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>
              {result.wait > 0 && (
                <div style={{ background: "linear-gradient(135deg,#FF6B0010,#ff8c0010)", border: "1px solid #FF6B0030", borderRadius: 12, padding: "14px 18px", textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#FF6B00", fontWeight: 800, fontSize: 22 }}>~{result.wait} min</div>
                  <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#888", fontSize: 13 }}>Estimated wait time</div>
                </div>
              )}
              <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#aaa", fontSize: 12, textAlign: "center" }}>
                🔄 Auto-refreshes every 30 seconds · Last: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          );
        })()}

        {/* Live Queue */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginTop: 24 }}>
          <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", marginBottom: 18, fontSize: 17 }}>📋 Live Queue Overview</h3>
          {MOCK_SERIALS.map(s => {
            const sc = statusConfig[s.status];
            return (
              <div key={s.serial} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: sc.dot, flexShrink: 0, animation: s.status === "called" ? "pulse 1s infinite" : "none" }} />
                <div style={{ flex: 1, fontFamily: "'Hind Siliguri', sans-serif" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1A2B4A" }}>{s.serial}</span>
                  <span style={{ color: "#aaa", fontSize: 13, marginLeft: 8 }}>{s.name}</span>
                </div>
                <div style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 50, fontSize: 12, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700 }}>{sc.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [pin, setPin] = useState("");
  const [verified, setVerified] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [unlocking, setUnlocking] = useState(false);

  const search = () => {
    if (!form.name || !form.phone || !form.date) { showToast("Please fill all fields.", "error"); return; }
    setSubmitted(true);
  };

  const verifyPin = () => {
    if (pin === "1234") { setUnlocking(true); setTimeout(() => { setVerified(true); setUnlocking(false); showToast("Verified! Reports unlocked.", "success"); }, 1200); }
    else showToast("Incorrect PIN. Try 1234 (demo).", "error");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 88 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Report Download</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif" }}>আপনার রিপোর্ট ডাউনলোড করুন</p>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
        {!submitted ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 20 }}>Access Your Reports</h3>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#888", fontSize: 14 }}>Enter your details to retrieve available reports</p>
            </div>
            {[["Full Name / পূর্ণ নাম", "name", "text", "Your full name"],
              ["Phone Number / ফোন", "phone", "tel", "01XXXXXXXXX"],
              ["Date of Visit / পরিদর্শনের তারিখ", "date", "date", ""]].map(([label, key, type, ph]) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>{label}</label>
                <input type={type} value={form[key]} placeholder={ph} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{
                  width: "100%", padding: "13px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
                }} />
              </div>
            ))}
            <button onClick={search} style={{
              width: "100%", background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
              border: "none", padding: "14px", borderRadius: 12, fontFamily: "'Hind Siliguri', sans-serif",
              fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4,
            }}>🔍 Search Reports</button>
          </div>
        ) : !verified ? (
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 12, animation: unlocking ? "spin 0.8s linear" : "none" }}>🔐</div>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 18, marginBottom: 6 }}>Enter Security PIN</h3>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#888", fontSize: 13, marginBottom: 22 }}>Your PIN was sent to your registered mobile number. <em>(Demo PIN: 1234)</em></p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
                <input value={pin} onChange={e => setPin(e.target.value)} maxLength={4} placeholder="• • • •" style={{
                  padding: "13px 24px", borderRadius: 12, border: "2px solid #e8ecf0",
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 22, outline: "none",
                  textAlign: "center", letterSpacing: 8, width: 160,
                }} />
                <button onClick={verifyPin} style={{
                  background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
                  border: "none", padding: "13px 24px", borderRadius: 12,
                  fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>Verify</button>
              </div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {MOCK_REPORTS.map(r => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14, opacity: 0.6 }}>
                  <div style={{ fontSize: 32 }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#1A2B4A", fontSize: 15 }}>{r.name}</div>
                    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#aaa", fontSize: 13 }}>{r.type} · {r.date}</div>
                  </div>
                  <div style={{ fontSize: 24 }}>🔒</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ background: "#d1fae5", borderRadius: 16, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>🔓</span>
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#065f46", fontWeight: 700, fontSize: 15 }}>Reports unlocked for {form.name}</span>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {MOCK_REPORTS.map(r => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.border = "2px solid #FF6B00"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = ""; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 36 }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#1A2B4A", fontSize: 15, marginBottom: 3 }}>{r.name}</div>
                      <div style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#aaa", fontSize: 13 }}>{r.type} · {r.date}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{
                        background: r.status === "ready" ? "#d1fae5" : "#fef3c7",
                        color: r.status === "ready" ? "#065f46" : "#d97706",
                        padding: "3px 10px", borderRadius: 50, fontSize: 12, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700,
                      }}>{r.status === "ready" ? "✅ Ready" : "⏳ Processing"}</span>
                      {r.status === "ready" && (
                        <button onClick={() => showToast(`Downloading ${r.name}...`, "success")} style={{
                          background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff", border: "none",
                          padding: "8px 16px", borderRadius: 8, fontFamily: "'Hind Siliguri', sans-serif",
                          fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        }}>📄 Download PDF</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
function ServicesPage() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 88 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Our Services</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif" }}>আমাদের সেবাসমূহ</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {SERVICES.map(s => (
            <div key={s.id} style={{
              background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: `2px solid transparent`, transition: "all 0.3s", cursor: "pointer",
              borderColor: expanded === s.id ? s.color : "transparent",
            }}
              onMouseEnter={e => { if (expanded !== s.id) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.12)"; } }}
              onMouseLeave={e => { if (expanded !== s.id) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 58, height: 58, borderRadius: 16, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ background: `${s.color}18`, color: s.color, display: "inline-block", padding: "3px 10px", borderRadius: 50, fontSize: 12, fontWeight: 800, fontFamily: "'Hind Siliguri', sans-serif", marginBottom: 4 }}>{s.title}</div>
                  <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 15, margin: 0 }}>{s.full}</h3>
                </div>
              </div>
              <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#666", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
              <button onClick={() => setExpanded(expanded === s.id ? null : s.id)} style={{
                background: expanded === s.id ? s.color : "transparent",
                color: expanded === s.id ? "#fff" : s.color,
                border: `2px solid ${s.color}`, padding: "8px 18px", borderRadius: 8,
                fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
              }}>
                {expanded === s.id ? "▲ Show Less" : "▼ Learn More"}
              </button>
              {expanded === s.id && (
                <div style={{ marginTop: 16, background: `${s.color}08`, borderRadius: 12, padding: 18, borderLeft: `4px solid ${s.color}`, animation: "fadeIn 0.3s ease" }}>
                  <p style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#555", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                    Our {s.full} is equipped with the latest technology and staffed by experienced specialists. We ensure round-the-clock monitoring, patient-centered care, and adherence to international protocols. For emergencies, call: <strong>01689-464646</strong>.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function ContactPage() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const submit = () => {
    if (!form.name || !form.message) { showToast("Please fill required fields.", "error"); return; }
    showToast("Message sent! We'll contact you soon.", "success");
    setForm({ name: "", email: "", phone: "", message: "" });
  };
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 88 }}>
      <div style={{ background: "linear-gradient(135deg,#1A2B4A,#0f2040)", padding: "40px 20px 50px", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Hind Siliguri', sans-serif" }}>আমাদের সাথে যোগাযোগ করুন</p>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "44px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 20, marginBottom: 22 }}>Get In Touch</h3>
              {[["Full Name *", "name", "text", "Your name"],
                ["Email Address", "email", "email", "your@email.com"],
                ["Phone Number", "phone", "tel", "01XXXXXXXXX"]].map(([label, key, type, ph]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>{label}</label>
                  <input type={type} value={form[key]} placeholder={ph} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                    fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
                  }} />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#333", fontSize: 14, display: "block", marginBottom: 6 }}>Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="How can we help you?" rows={4} style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10, border: "2px solid #e8ecf0",
                  fontFamily: "'Hind Siliguri', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box",
                }} />
              </div>
              <button onClick={submit} style={{
                width: "100%", background: "linear-gradient(135deg,#FF6B00,#ff8c00)", color: "#fff",
                border: "none", padding: "13px", borderRadius: 12, fontFamily: "'Hind Siliguri', sans-serif",
                fontWeight: 700, fontSize: 15, cursor: "pointer",
              }}>📨 Send Message</button>
            </div>
          </div>
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, color: "#1A2B4A", fontSize: 18, marginBottom: 20 }}>📍 Hospital Information</h3>
              {[
                ["📍 Address", "246, Zico Tower, Comilla Road, Chandpur, Bangladesh"],
                ["📞 Hotline", "01689-464646"],
                ["📋 Serial Booking", "01747-474719"],
                ["⏰ Emergency", "24 Hours / 7 Days"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", gap: 12, marginBottom: 16, padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 700, color: "#FF6B00", fontSize: 14, flexShrink: 0, minWidth: 130 }}>{label}</span>
                  <span style={{ fontFamily: "'Hind Siliguri', sans-serif", color: "#555", fontSize: 14 }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Map embed */}
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", height: 220 }}>
              <iframe
                title="Hospital Location"
                src="https://maps.google.com/maps?q=Zico+Tower,Chandpur,Bangladesh&output=embed"
                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer setPage={() => {}} />
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0a1628", padding: "48px 20px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>🏥</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, fontFamily: "'Hind Siliguri', sans-serif" }}>Famous Specialized</div>
                <div style={{ color: "#FF6B00", fontWeight: 700, fontSize: 12, fontFamily: "'Hind Siliguri', sans-serif" }}>Hospital & Trauma Center</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, lineHeight: 1.7 }}>246, Zico Tower, Comilla Road, Chandpur, Bangladesh</p>
          </div>
          <div>
            <h4 style={{ color: "#FF6B00", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>Quick Links</h4>
            {["home", "doctors", "services", "appointment", "serial", "reports", "contact"].map(p => (
              <div key={p} onClick={() => setPage(p)} style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 7, textTransform: "capitalize", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#FF6B00"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
              >{p.replace("-", " ")}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#FF6B00", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>Contact</h4>
            <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, lineHeight: 2 }}>
              <div>📞 Hotline: 01689-464646</div>
              <div>📋 Serial: 01747-474719</div>
              <div>⏰ Emergency: 24/7</div>
            </div>
          </div>
          <div>
            <h4 style={{ color: "#FF6B00", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 800, fontSize: 14, marginBottom: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>Services</h4>
            <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13, lineHeight: 2 }}>
              {["ICU / CCU / NICU", "PICU / HDU", "Dialysis", "Physiotherapy", "24/7 Emergency"].map(s => <div key={s}>{s}</div>)}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Hind Siliguri', sans-serif", fontSize: 13 }}>
          © 2026 Famous Specialized Hospital & Trauma Center. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── WHATSAPP BUTTON ──────────────────────────────────────────────────────────
function WhatsAppButton() {
  return (
    <a href="https://wa.me/8801689464646" target="_blank" rel="noopener noreferrer" style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 2000,
      width: 56, height: 56, borderRadius: "50%",
      background: "linear-gradient(135deg,#25D366,#128C7E)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 24px rgba(37,211,102,0.45)", textDecoration: "none",
      fontSize: 26, transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
      title="WhatsApp: 01689-464646"
    >💬</a>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  const pageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const pages = {
    home: <HomePage setPage={pageChange} />,
    doctors: <DoctorsPage setPage={pageChange} />,
    appointment: <AppointmentPage />,
    serial: <SerialPage />,
    reports: <ReportsPage />,
    services: <ServicesPage />,
    contact: <ContactPage />,
  };

  return (
    <AppContext.Provider value={{ showToast }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f4f6fb; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:none} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes drawLine { 0%{stroke-dashoffset:1200} 100%{stroke-dashoffset:0} }
        .desktop-nav { display: flex; }
        .hamburger { display: none !important; }
        @media (max-width: 800px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
      <Header page={page} setPage={pageChange} />
      <main style={{ minHeight: "100vh", animation: "fadeIn 0.35s ease" }} key={page}>
        {pages[page] || pages.home}
      </main>
      <WhatsAppButton />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AppContext.Provider>
  );
}
