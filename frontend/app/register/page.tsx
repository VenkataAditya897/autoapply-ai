"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "#EF4444", "#F59E0B", "#10B981"];

  const handleRegister = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    try {
      setError(""); setLoading(true);
      await register(email, password);
      router.push("/login");
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
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "5%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div style={{ position: "relative", maxWidth: "400px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
            <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #2563EB, #7C3AED)", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(37,99,235,0.5)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: "white" }}>AutoApply<span style={{ color: "#93C5FD" }}>.ai</span></span>
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "white", lineHeight: 1.2, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Your AI job application assistant awaits
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "40px" }}>
            Set up in 5 minutes. Start receiving personalized applications today.
          </p>

          {/* Feature list */}
          {[
            "Monitors Telegram job channels 24/7",
            "AI-written personalized emails",
            "Smart profile matching",
            "Instant delivery to recruiters",
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", textAlign: "left" }}>
              <div style={{ width: "20px", height: "20px", background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: "1", minWidth: "0", maxWidth: "560px",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "#F9FAFB",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }} className="lg:hidden">
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #2563EB, #7C3AED)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#111827" }}>AutoApply<span style={{ color: "#2563EB" }}>.ai</span></span>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", color: "#111827", marginBottom: "8px", letterSpacing: "-0.02em" }}>Create your account</h1>
          <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "36px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>

          <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "20px", padding: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Email address</label>
              <input
                type="email" value={email} placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRegister()}
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: "12px", fontSize: "0.9rem", color: "#111827", background: "white", outline: "none", transition: "all 0.2s" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} value={password} placeholder="Min. 6 characters"
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px 44px 12px 16px", border: "1.5px solid #E5E7EB", borderRadius: "12px", fontSize: "0.9rem", color: "#111827", background: "white", outline: "none", transition: "all 0.2s" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: "3px", borderRadius: "100px", background: i <= strength ? strengthColors[strength] : "#E5E7EB", transition: "all 0.3s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: strengthColors[strength], fontWeight: 600 }}>{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Confirm password</label>
              <input
                type="password" value={confirmPassword} placeholder="Re-enter password"
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRegister()}
                style={{
                  width: "100%", padding: "12px 16px",
                  border: `1.5px solid ${confirmPassword && confirmPassword !== password ? "#FCA5A5" : "#E5E7EB"}`,
                  borderRadius: "12px", fontSize: "0.9rem", color: "#111827", background: "white", outline: "none", transition: "all 0.2s"
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "#FCA5A5" : "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
              {confirmPassword && confirmPassword !== password && (
                <p style={{ fontSize: "0.75rem", color: "#EF4444", marginTop: "4px" }}>Passwords do not match</p>
              )}
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
              onClick={handleRegister} disabled={loading}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center", marginTop: "16px" }}>
              By signing up, you agree to our{" "}
              <a href="#" style={{ color: "#6B7280", textDecoration: "underline" }}>Terms</a>{" "}and{" "}
              <a href="#" style={{ color: "#6B7280", textDecoration: "underline" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
