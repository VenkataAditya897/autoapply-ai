"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        setProfile(res.data.profile || {});
        setSkills(res.data.skills?.map((s: any) => s.name) || []);
        setExperience(res.data.experience || []);
      })
      .catch(() => router.push("/login"));
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    try {
      await api.post("/profile", {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        location: profile.location,
        linkedin: profile.linkedin,
        github: profile.github,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/profile/upload-resume", formData);
    setResumeName(file.name);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    fontSize: "0.875rem",
    color: "#ffffff",
    background: "#141414",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };
  const focusIn = (e: any) => {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
  };
  const focusOut = (e: any) => {
    e.currentTarget.style.borderColor = "#2a2a2a";
    e.currentTarget.style.boxShadow = "none";
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };
  const cardStyle = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  };
  const sectionIconStyle = (bg: string) => ({
    width: "30px",
    height: "30px",
    background: bg,
    borderRadius: "8px",
    display: "inline-flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  });

  return (
    <div style={{ padding: "32px 36px", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#ffffff",
              marginBottom: "4px",
            }}
          >
            Profile Settings
          </h1>
          <p style={{ color: "#555", fontSize: "0.875rem" }}>
            Keep your profile updated for better AI-generated applications.
          </p>
        </div>
        <button
          onClick={updateProfile}
          disabled={loading}
          style={{
            padding: "10px 24px",
            background: saved
              ? "linear-gradient(135deg, #10B981, #059669)"
              : loading
                ? "#1e3a5a"
                : "linear-gradient(135deg, #2563EB, #1D4ED8)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s",
          }}
        >
          {saved ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>{" "}
              Saved!
            </>
          ) : loading ? (
            "Saving..."
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>{" "}
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* ── PERSONAL INFO ── */}
      <div style={cardStyle}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#ffffff",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={sectionIconStyle("#1e1e3a")}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          Personal Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>First Name</label>
            <input
              style={inputStyle}
              value={profile?.first_name || ""}
              placeholder="Venkata"
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input
              style={inputStyle}
              value={profile?.last_name || ""}
              placeholder="Aditya"
              onChange={(e) =>
                setProfile({ ...profile, last_name: e.target.value })
              }
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              style={inputStyle}
              value={profile?.phone || ""}
              placeholder="+91 9876543210"
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input
              style={inputStyle}
              value={profile?.location || ""}
              placeholder="Hyderabad, India"
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              onFocus={focusIn}
              onBlur={focusOut}
            />
          </div>
        </div>
      </div>

      {/* ── PROFESSIONAL LINKS ── */}
      <div style={cardStyle}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#ffffff",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={sectionIconStyle("#0d1f14")}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          Professional Links
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#0A66C2",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <input
                style={{ ...inputStyle, paddingLeft: "38px" }}
                value={profile?.linkedin || ""}
                placeholder="linkedin.com/in/you"
                onChange={(e) =>
                  setProfile({ ...profile, linkedin: e.target.value })
                }
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#888",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <input
                style={{ ...inputStyle, paddingLeft: "38px" }}
                value={profile?.github || ""}
                placeholder="github.com/you"
                onChange={(e) =>
                  setProfile({ ...profile, github: e.target.value })
                }
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── RESUME ── */}
      <div style={cardStyle}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#ffffff",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={sectionIconStyle("#1a1200")}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          Resume / CV
        </h3>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
          onClick={() => document.getElementById("resume-input")?.click()}
          style={{
            border: `1.5px dashed ${dragOver ? "#2563EB" : "#2a2a2a"}`,
            borderRadius: "12px",
            padding: "36px",
            textAlign: "center",
            background: dragOver ? "rgba(37,99,235,0.06)" : "#141414",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
            {resumeName ? "📄" : "☁️"}
          </div>
          {resumeName ? (
            <>
              <p
                style={{
                  fontWeight: 600,
                  color: "#34d399",
                  marginBottom: "3px",
                  fontSize: "0.9rem",
                }}
              >
                {resumeName}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#555" }}>
                Click to replace
              </p>
            </>
          ) : profile?.resume_url ? (
            <>
              <p
                style={{
                  fontWeight: 600,
                  color: "#aaa",
                  marginBottom: "3px",
                  fontSize: "0.9rem",
                }}
              >
                Resume uploaded
              </p>
              <p style={{ fontSize: "0.75rem", color: "#555" }}>
                Click or drag to replace
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  fontWeight: 600,
                  color: "#888",
                  marginBottom: "3px",
                  fontSize: "0.9rem",
                }}
              >
                Drop your resume here
              </p>
              <p style={{ fontSize: "0.75rem", color: "#444" }}>
                PDF, DOC, DOCX — max 10MB
              </p>
            </>
          )}
          <input
            id="resume-input"
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
          />
        </div>
      </div>

      {/* ── SKILLS ── */}
      <div style={cardStyle}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#ffffff",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={sectionIconStyle("#150d1f")}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          Skills
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {skills.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(96,165,250,0.25)",
                borderRadius: "100px",
                padding: "5px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#60a5fa",
              }}
            >
              {s}
              <button
                onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#3b82f6",
                  padding: 0,
                  fontSize: "1rem",
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                ×
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p style={{ fontSize: "0.82rem", color: "#444" }}>
              No skills added yet.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Add a skill and press Enter"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onFocus={focusIn}
            onBlur={focusOut}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newSkill.trim()) {
                if (!skills.includes(newSkill.trim())) {
                  setSkills([...skills, newSkill.trim()]);
                  api.post("/profile/skills", { name: newSkill.trim() });
                }
                setNewSkill("");
              }
            }}
          />
          <button
            onClick={() => {
              if (newSkill.trim() && !skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
                api.post("/profile/skills", { name: newSkill.trim() });
                setNewSkill("");
              }
            }}
            style={{
              padding: "10px 18px",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <div style={cardStyle}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#ffffff",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={sectionIconStyle("#1e1e3a")}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </span>
            Work Experience
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "#444",
                marginLeft: "4px",
              }}
            >
              — view only
            </span>
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {experience.map((exp: any, i: number) => (
              <div
                key={i}
                style={{
                  background: "#141414",
                  border: "1px solid #222",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#1e1e3a",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      marginBottom: "2px",
                    }}
                  >
                    {exp.role}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#555" }}>
                    {exp.company} · {exp.start_date} – {exp.end_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
