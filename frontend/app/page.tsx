"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen mesh-bg overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: "0 2.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(249,250,251,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(229,231,235,0.8)" : "1px solid transparent",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeWidth="0"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#111827" }}>
            AutoApply<span style={{ color: "#2563EB" }}>.ai</span>
          </span>
        </div>

        {/* Nav links (desktop) */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
          {["Features", "How it works", "Pricing"].map(link => (
            <a key={link} href="#" style={{
              fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 500,
              color: "#6B7280", textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#2563EB")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
            >{link}</a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "8px 18px",
              fontSize: "0.875rem", fontWeight: 500,
              color: "#374151", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#2563EB"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/register")}
            style={{
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "0.875rem", fontWeight: 600,
              color: "white", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(37,99,235,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)"; }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", paddingBottom: "100px", paddingLeft: "5%", paddingRight: "5%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap" }}>

          {/* Left: Copy */}
          <div style={{ flex: "1", minWidth: "320px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)" }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#EFF6FF", border: "1px solid #BFDBFE",
              borderRadius: "100px", padding: "6px 14px",
              marginBottom: "28px",
            }}>
              <div style={{ width: "6px", height: "6px", background: "#2563EB", borderRadius: "50%", animation: "pulse-blue 2s infinite" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2563EB", fontFamily: "var(--font-body)" }}>
                AI-Powered Job Applications
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: 1.1, letterSpacing: "-0.03em",
              color: "#111827", marginBottom: "20px",
            }}>
              Apply to Jobs<br />
              <span style={{
                background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Automatically
              </span>{" "}
              with AI
            </h1>

            <p style={{
              fontSize: "1.1rem", lineHeight: 1.7, color: "#6B7280",
              maxWidth: "500px", marginBottom: "36px",
              fontFamily: "var(--font-body)", fontWeight: 400,
            }}>
              AutoApply reads job posts from Telegram, understands your profile, and generates personalized application emails — instantly, while you sleep.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/register")}
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  border: "none", borderRadius: "12px",
                  padding: "14px 28px", fontSize: "1rem", fontWeight: 600,
                  color: "white", cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
                  display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(37,99,235,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; }}
              >
                Start for Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                style={{
                  background: "white", border: "1px solid #E5E7EB",
                  borderRadius: "12px", padding: "14px 28px",
                  fontSize: "1rem", fontWeight: 500,
                  color: "#374151", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                See Demo
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "40px" }}>
              <div style={{ display: "flex" }}>
                {["#2563EB","#7C3AED","#10B981","#F59E0B"].map((c, i) => (
                  <div key={i} style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: c, border: "2px solid white",
                    marginLeft: i > 0 ? "-8px" : "0",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                <strong style={{ color: "#111827" }}>2,400+</strong> applications sent this week
              </p>
            </div>
          </div>

          {/* Right: Demo card */}
          <div style={{
            flex: "1", minWidth: "300px", maxWidth: "460px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.4,0,0.2,1) 0.15s",
            animation: "float 5s ease-in-out infinite",
          }}>
            <DemoCard />
          </div>
        </div>
      </section>

      {/* ── LOGOS / TRUST ── */}
      <section style={{ padding: "32px 5%", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", background: "rgba(255,255,255,0.5)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "48px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase" }}>Works with channels from</p>
          {["Naukri Jobs", "LinkedIn India", "We Work Remotely", "AngelList", "Freshers Jobs"].map(name => (
            <span key={name} style={{ fontSize: "0.9rem", fontWeight: 600, color: "#9CA3AF", letterSpacing: "-0.01em" }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "100px 5%", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase" }}>Features</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#111827", marginTop: "12px", letterSpacing: "-0.02em" }}>
            Everything you need to land the job
          </h2>
          <p style={{ color: "#6B7280", fontSize: "1.05rem", marginTop: "12px", maxWidth: "480px", margin: "12px auto 0" }}>
            From job detection to email delivery — AutoApply handles the entire pipeline.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "100px 5%", background: "linear-gradient(135deg, #1E3A8A 0%, #1E1B4B 100%)", position: "relative", overflow: "hidden" }}>
        {/* BG dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#93C5FD", letterSpacing: "0.1em", textTransform: "uppercase" }}>How It Works</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "white", marginTop: "12px", letterSpacing: "-0.02em" }}>
              Three steps to autopilot
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px" }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "32px",
                textAlign: "center",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "1.3rem", color: "white",
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "white", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 5%", textAlign: "center" }}>
        <div style={{
          maxWidth: "600px", margin: "0 auto",
          background: "linear-gradient(135deg, #2563EB, #7C3AED)",
          borderRadius: "28px", padding: "64px 48px",
          boxShadow: "0 20px 60px rgba(37,99,235,0.3)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "140px", height: "140px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "white", marginBottom: "16px", position: "relative" }}>
            Start Applying Smarter Today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: "32px", position: "relative" }}>
            Join thousands of candidates who let AI handle their job applications.
          </p>
          <button
            onClick={() => router.push("/register")}
            style={{
              background: "white", border: "none", borderRadius: "12px",
              padding: "14px 32px", fontSize: "1rem", fontWeight: 700,
              color: "#2563EB", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "all 0.25s", position: "relative",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
          >
            Get Started — It&apos;s Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#F3F4F6", borderTop: "1px solid #E5E7EB", padding: "48px 5%" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px",
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#111827" }}>AutoApply.ai</span>
          </div>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Privacy", "Terms", "Contact"].map(link => (
              <a key={link} href="#" style={{ fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2563EB")}
                onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
              >{link}</a>
            ))}
          </div>
          <p style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>© 2025 AutoApply.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── DEMO CARD ── */
function DemoCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.5)",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: "0 20px 60px rgba(37,99,235,0.12), 0 4px 20px rgba(0,0,0,0.06)",
    }}>
      {/* Job message bubble */}
      <div style={{
        background: "#F0F9FF",
        border: "1px solid #BAE6FD",
        borderRadius: "16px",
        padding: "16px 20px",
        marginBottom: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #0EA5E9, #2563EB)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0369A1" }}>Telegram Job Alert</span>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.6 }}>
          🚀 <strong>Python Backend Developer</strong> needed at TechCorp. 2+ yrs exp with FastAPI, PostgreSQL. Apply to hr@techcorp.com
        </p>
      </div>

      {/* Arrow */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{
          width: "40px", height: "40px",
          background: "linear-gradient(135deg, #2563EB, #7C3AED)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* Email preview */}
      <div style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ width: "28px", height: "28px", background: "#DCFCE7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827" }}>Application Generated ✓</p>
            <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>To: hr@techcorp.com</p>
          </div>
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: "100px", fontWeight: 600 }}>Sent</span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.6 }}>
          <strong>Subject:</strong> Application for Python Backend Developer<br /><br />
          Dear Hiring Manager,<br /><br />
          I am a backend developer with 3+ years experience in FastAPI and PostgreSQL...
        </p>
      </div>

      {/* Badge */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "100px", padding: "6px 14px" }}>
          <div style={{ width: "6px", height: "6px", background: "#22C55E", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16A34A" }}>AI generated & sent in 3.2s</span>
        </div>
      </div>
    </div>
  );
}

/* ── FEATURE CARD ── */
function FeatureCard({ icon, title, desc, color, delay }: any) {
  return (
    <div
      className="card-hover"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "18px",
        fontSize: "1.5rem",
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#111827", marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

const features = [
  { icon: "🎯", color: "#2563EB", title: "Smart Job Detection", desc: "Listens to Telegram job channels 24/7 and instantly detects relevant job postings." },
  { icon: "✍️", color: "#7C3AED", title: "AI Email Generation", desc: "Crafts personalized, professional application emails tailored to each job description." },
  { icon: "📱", color: "#10B981", title: "Telegram Integration", desc: "Connect your Telegram account in minutes and start receiving job alerts." },
  { icon: "🧠", color: "#F59E0B", title: "Profile Intelligence", desc: "Learns your skills, experience, and projects to write better applications every time." },
];

const steps = [
  { title: "Connect Telegram", desc: "Link your Telegram account and subscribe to job channels you want to monitor." },
  { title: "Add Your Profile", desc: "Fill in your skills, experience, and projects. AutoApply learns who you are." },
  { title: "AutoApply Does the Rest", desc: "Sit back while AI reads jobs, writes emails, and sends applications on your behalf." },
];
