"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    try {
      setError(""); setLoading(true);
      const res = await login(email, password);
      res.has_profile ? router.push("/dashboard") : router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: "1", minWidth: "0",
        background: "linear-gradient(135deg, #1E3A8A 0%, #1E1B4B 60%, #0F172A 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "48px", position: "relative", overflow: "hidden",
      }} className="hidden lg:flex">
        {/* BG orbs */}
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "5%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div style={{ position: "relative", maxWidth: "400px", textAlign: "center" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
            <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #2563EB, #7C3AED)", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(37,99,235,0.5)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>AutoApply<span style={{ color: "#93C5FD" }}>.ai</span></span>
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "white", lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Let AI handle your<br />job applications
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "48px" }}>
            Connect once, apply everywhere. AutoApply monitors job channels and sends personalized emails while you focus on what matters.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { n: "2,400+", l: "Applications sent" },
              { n: "94%", l: "Response rate" },
              { n: "3.2s", l: "Avg generation time" },
              { n: "50+", l: "Job channels supported" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px", padding: "16px",
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "white" }}>{s.n}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: "1", minWidth: "0", maxWidth: "560px",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px",
        background: "#F9FAFB",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }} className="lg:hidden">
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #2563EB, #7C3AED)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#111827" }}>AutoApply<span style={{ color: "#2563EB" }}>.ai</span></span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "#111827", marginBottom: "8px", letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "36px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>

          {/* Form card */}
          <div style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Email address</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #E5E7EB", borderRadius: "12px",
                  fontSize: "0.9rem", color: "#111827",
                  background: "white",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>Password</label>
                <a href="#" style={{ fontSize: "0.8rem", color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "12px 44px 12px 16px",
                    border: "1.5px solid #E5E7EB", borderRadius: "12px",
                    fontSize: "0.9rem", color: "#111827",
                    background: "white", transition: "all 0.2s", outline: "none",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}
                >
                  {showPassword
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <div
                onClick={() => setRemember(!remember)}
                style={{
                  width: "18px", height: "18px", borderRadius: "5px",
                  border: remember ? "none" : "1.5px solid #D1D5DB",
                  background: remember ? "#2563EB" : "white",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {remember && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <label onClick={() => setRemember(!remember)} style={{ fontSize: "0.85rem", color: "#6B7280", cursor: "pointer" }}>Remember me</label>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "10px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ fontSize: "0.82rem", color: "#DC2626" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                border: "none", borderRadius: "12px",
                fontSize: "0.95rem", fontWeight: 700,
                color: "white", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(37,99,235,0.4)"; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin-slow 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
