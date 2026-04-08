"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const { token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [basic, setBasic] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState([
    {
      company: "",
      role: "",
      start_date: "",
      end_date: "",
      description: "",
      current: false,
    },
  ]);
  const [projects, setProjects] = useState([
    { name: "", description: "", tech: "" },
  ]);
  const [education, setEducation] = useState([
    {
      college: "",
      degree: "",
      gpa: "",
      type: "cgpa",
      start_year: "",
      end_year: "",
    },
  ]);
  const [gmail, setGmail] = useState<any>(null);
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/profile")
      .then((res) => {
        if (res.data.profile) router.push("/dashboard");
      })
      .catch(() => router.push("/login"));
  }, [token]);
  useEffect(() => {
    fetchGmailStatus();
  }, []);

  const fetchGmailStatus = async () => {
    try {
      const res = await api.get("/auth/google/status");
      setGmail(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const addSkill = (val: string) => {
    const vals = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newSkills = [...skills];
    vals.forEach((v) => {
      if (!newSkills.some((s) => s.toLowerCase() === v.toLowerCase()))
        newSkills.push(v);
    });
    setSkills(newSkills);
    setSkillInput("");
  };

  const handleSubmit = async () => {
    if (!gmail?.connected) {
      alert("Please connect Gmail before finishing onboarding");
      return;
    }
    if (skills.length === 0) {
      alert("Add at least one skill");
      return;
    }
    const validEdu = education.filter((e) => e.college && e.degree);
    if (validEdu.length === 0) {
      alert("Add at least one education entry");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/profile", {
        ...basic,
        phone: countryCode + basic.phone.replace(countryCode, ""),
      });
      for (const s of skills)
        if (s.trim()) await api.post("/profile/skills", { name: s });
      for (const exp of experience) {
        const { current, ...cleanExp } = exp;
        if (!cleanExp.company || !cleanExp.role) continue;
        await api.post("/profile/experience", cleanExp);
      }
      for (const p of projects) {
        if (!p.name) continue;
        await api.post("/profile/projects", p);
      }
      for (const e of validEdu)
        await api.post("/profile/education", {
          college: e.college,
          degree: e.degree,
          gpa: e.gpa,
          start_year: e.start_year,
          end_year: e.end_year,
        });
      router.push("/dashboard");
    } catch {
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 16px",
    border: "1.5px solid #E5E7EB",
    borderRadius: "12px",
    fontSize: "0.875rem",
    color: "#111827",
    background: "white",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };
  const focusIn = (e: any) => {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
  };
  const focusOut = (e: any) => {
    e.currentTarget.style.borderColor = "#E5E7EB";
    e.currentTarget.style.boxShadow = "none";
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };
  const connectGoogle = async () => {
    try {
      const res = await api.get("/auth/google/login"); // ✅ uses token automatically
      window.location.href = res.data.url;
    } catch (e) {
      console.log(e);
      alert("Login failed. Please login again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "#111827",
          }}
        >
          AutoApply<span style={{ color: "#2563EB" }}>.ai</span>
        </span>
      </div>

      {/* Progress */}
      <div style={{ width: "100%", maxWidth: "680px", marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6B7280" }}>
            Step {step} of {TOTAL_STEPS}
          </p>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563EB" }}>
            {Math.round((step / TOTAL_STEPS) * 100)}% complete
          </p>
        </div>
        <div
          style={{
            height: "6px",
            background: "#E5E7EB",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            className="progress-fill"
            style={{
              height: "100%",
              width: `${(step / TOTAL_STEPS) * 100}%`,
              borderRadius: "100px",
            }}
          />
        </div>
        {/* Steps indicator */}
        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          {["Basic Info", "Skills", "Experience", "Education"].map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "8px",
                textAlign: "center",
                borderRadius: "10px",
                background:
                  step === i + 1
                    ? "#EFF6FF"
                    : step > i + 1
                      ? "#F0FDF4"
                      : "white",
                border: `1.5px solid ${step === i + 1 ? "#BFDBFE" : step > i + 1 ? "#BBF7D0" : "#E5E7EB"}`,
                transition: "all 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color:
                    step === i + 1
                      ? "#2563EB"
                      : step > i + 1
                        ? "#16A34A"
                        : "#9CA3AF",
                }}
              >
                {step > i + 1 ? "✓ " : ""}
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        }}
      >
        {/* ── STEP 1: Basic Info ── */}
        {step === 1 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#111827",
                marginBottom: "6px",
              }}
            >
              Let's start with the basics
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "0.875rem",
                marginBottom: "28px",
              }}
            >
              This information will be used to personalize your applications.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  style={inputStyle}
                  placeholder="Venkata"
                  value={basic.first_name}
                  onChange={(e) =>
                    setBasic({ ...basic, first_name: e.target.value })
                  }
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={inputStyle}
                  placeholder="Aditya"
                  value={basic.last_name}
                  onChange={(e) =>
                    setBasic({ ...basic, last_name: e.target.value })
                  }
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    padding: "11px 12px",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "12px",
                    background: "white",
                    fontSize: "0.875rem",
                    outline: "none",
                    cursor: "pointer",
                    color: "#111827",
                  }}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="9876543210"
                  value={basic.phone}
                  onChange={(e) =>
                    setBasic({ ...basic, phone: e.target.value })
                  }
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Location</label>
              <input
                style={inputStyle}
                placeholder="Hyderabad, India"
                value={basic.location}
                onChange={(e) =>
                  setBasic({ ...basic, location: e.target.value })
                }
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>LinkedIn (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="linkedin.com/in/you"
                  value={basic.linkedin}
                  onChange={(e) =>
                    setBasic({ ...basic, linkedin: e.target.value })
                  }
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label style={labelStyle}>GitHub (optional)</label>
                <input
                  style={inputStyle}
                  placeholder="github.com/you"
                  value={basic.github}
                  onChange={(e) =>
                    setBasic({ ...basic, github: e.target.value })
                  }
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Skills ── */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#111827",
                marginBottom: "6px",
              }}
            >
              What are your skills?
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "0.875rem",
                marginBottom: "28px",
              }}
            >
              Type a skill and press Enter or comma. These power your AI
              applications.
            </p>

            <div
              style={{
                minHeight: "120px",
                padding: "14px",
                border: "1.5px solid #E5E7EB",
                borderRadius: "16px",
                background: "white",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignContent: "flex-start",
                cursor: "text",
              }}
              onClick={() => document.getElementById("skill-input")?.focus()}
            >
              {skills.map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    borderRadius: "100px",
                    padding: "5px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#2563EB",
                  }}
                >
                  {s}
                  <button
                    onClick={() =>
                      setSkills(skills.filter((_, idx) => idx !== i))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#93C5FD",
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
              <input
                id="skill-input"
                value={skillInput}
                placeholder={
                  skills.length === 0
                    ? "e.g. Python, React, FastAPI..."
                    : "Add more..."
                }
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (pasted.includes(",")) {
                    e.preventDefault();
                    addSkill(pasted);
                  }
                }}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "#111827",
                  minWidth: "160px",
                  flex: 1,
                  background: "transparent",
                }}
              />
            </div>

            {skills.length > 0 && (
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#10B981",
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                ✓ {skills.length} skill{skills.length > 1 ? "s" : ""} added
              </p>
            )}

            {/* Suggestions */}
            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  marginBottom: "10px",
                }}
              >
                POPULAR SKILLS — click to add
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "Python",
                  "FastAPI",
                  "React",
                  "Node.js",
                  "PostgreSQL",
                  "Docker",
                  "Machine Learning",
                  "JavaScript",
                  "AWS",
                  "Git",
                ]
                  .filter((s) => !skills.includes(s))
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => setSkills([...skills, s])}
                      style={{
                        background: "#F9FAFB",
                        border: "1.5px solid #E5E7EB",
                        borderRadius: "100px",
                        padding: "5px 12px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#6B7280",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#EFF6FF";
                        e.currentTarget.style.borderColor = "#BFDBFE";
                        e.currentTarget.style.color = "#2563EB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#F9FAFB";
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.color = "#6B7280";
                      }}
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Experience ── */}
        {step === 3 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#111827",
                marginBottom: "6px",
              }}
            >
              Your work experience
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "0.875rem",
                marginBottom: "28px",
              }}
            >
              Add your relevant work history. This helps AI write better
              applications.
            </p>

            {experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  background: "#F9FAFB",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "16px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#374151",
                    }}
                  >
                    Experience {i + 1}
                  </h4>
                  {experience.length > 1 && (
                    <button
                      onClick={() =>
                        setExperience(experience.filter((_, idx) => idx !== i))
                      }
                      style={{
                        background: "#FEF2F2",
                        border: "1px solid #FCA5A5",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#DC2626",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input
                      style={inputStyle}
                      placeholder="TechCorp"
                      value={exp.company}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].company = e.target.value;
                        setExperience(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <input
                      style={inputStyle}
                      placeholder="Backend Developer"
                      value={exp.role}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].role = e.target.value;
                        setExperience(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input
                      style={inputStyle}
                      placeholder="2022-01"
                      value={exp.start_date}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].start_date = e.target.value;
                        setExperience(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date</label>
                    <input
                      style={{
                        ...inputStyle,
                        background: exp.current ? "#F3F4F6" : "white",
                      }}
                      placeholder="2023-06"
                      value={exp.current ? "Present" : exp.end_date}
                      disabled={exp.current}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].end_date = e.target.value;
                        setExperience(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    onClick={() => {
                      const u = [...experience];
                      u[i].current = !u[i].current;
                      u[i].end_date = u[i].current ? "Present" : "";
                      setExperience(u);
                    }}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "5px",
                      border: exp.current ? "none" : "1.5px solid #D1D5DB",
                      background: exp.current ? "#2563EB" : "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {exp.current && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      color: "#6B7280",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const u = [...experience];
                      u[i].current = !u[i].current;
                      u[i].end_date = u[i].current ? "Present" : "";
                      setExperience(u);
                    }}
                  >
                    Currently working here
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: "90px",
                      resize: "vertical" as const,
                    }}
                    placeholder="Describe your responsibilities and achievements..."
                    value={exp.description}
                    onChange={(e) => {
                      const u = [...experience];
                      u[i].description = e.target.value;
                      setExperience(u);
                    }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setExperience([
                  ...experience,
                  {
                    company: "",
                    role: "",
                    start_date: "",
                    end_date: "",
                    description: "",
                    current: false,
                  },
                ])
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#EFF6FF",
                border: "1.5px dashed #BFDBFE",
                borderRadius: "12px",
                padding: "10px 20px",
                color: "#2563EB",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#DBEAFE")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#EFF6FF")
              }
            >
              + Add Another Experience
            </button>
          </div>
        )}

        {/* ── STEP 4: Projects + Education ── */}
        {step === 4 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#111827",
                marginBottom: "6px",
              }}
            >
              Projects & Education
            </h2>
            <p
              style={{
                color: "#6B7280",
                fontSize: "0.875rem",
                marginBottom: "28px",
              }}
            >
              Almost done! Add your projects and education details.
            </p>

            {/* Education */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#111827",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "#EFF6FF",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  🎓
                </span>
                Education
              </h3>
              {education.map((edu, i) => (
                <div
                  key={i}
                  style={{
                    background: "#F9FAFB",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#6B7280",
                      }}
                    >
                      Education {i + 1}
                    </span>
                    {education.length > 1 && (
                      <button
                        onClick={() =>
                          setEducation(education.filter((_, idx) => idx !== i))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#EF4444",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>College / University</label>
                      <input
                        style={inputStyle}
                        placeholder="Sreenidhi Institute..."
                        value={edu.college}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].college = e.target.value;
                          setEducation(u);
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Degree</label>
                      <input
                        style={inputStyle}
                        placeholder="B.Tech"
                        value={edu.degree}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].degree = e.target.value;
                          setEducation(u);
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>GPA / Percentage</label>
                      <input
                        style={inputStyle}
                        placeholder="8.5"
                        value={edu.gpa}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].gpa = e.target.value;
                          setEducation(u);
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Start Year</label>
                      <input
                        style={inputStyle}
                        placeholder="2021"
                        value={edu.start_year}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].start_year = e.target.value;
                          setEducation(u);
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>End Year</label>
                      <input
                        style={inputStyle}
                        placeholder="2025"
                        value={edu.end_year}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].end_year = e.target.value;
                          setEducation(u);
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setEducation([
                    ...education,
                    {
                      college: "",
                      degree: "",
                      gpa: "",
                      type: "cgpa",
                      start_year: "",
                      end_year: "",
                    },
                  ])
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#EFF6FF",
                  border: "1.5px dashed #BFDBFE",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: "#2563EB",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#DBEAFE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#EFF6FF")
                }
              >
                + Add Education
              </button>
            </div>

            {/* Projects */}
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#111827",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "#F0FDF4",
                    borderRadius: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  🚀
                </span>
                Projects{" "}
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    marginLeft: "4px",
                  }}
                >
                  Optional
                </span>
              </h3>
              {projects.map((proj, i) => (
                <div
                  key={i}
                  style={{
                    background: "#F9FAFB",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#6B7280",
                      }}
                    >
                      Project {i + 1}
                    </span>
                    {projects.length > 1 && (
                      <button
                        onClick={() =>
                          setProjects(projects.filter((_, idx) => idx !== i))
                        }
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#EF4444",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Project Name</label>
                    <input
                      style={inputStyle}
                      placeholder="AI CRM System"
                      value={proj.name}
                      onChange={(e) => {
                        const u = [...projects];
                        u[i].name = e.target.value;
                        setProjects(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      style={{
                        ...inputStyle,
                        minHeight: "80px",
                        resize: "vertical" as const,
                      }}
                      placeholder="What does this project do?"
                      value={proj.description}
                      onChange={(e) => {
                        const u = [...projects];
                        u[i].description = e.target.value;
                        setProjects(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tech Stack</label>
                    <input
                      style={inputStyle}
                      placeholder="React, Node.js, MongoDB"
                      value={proj.tech}
                      onChange={(e) => {
                        const u = [...projects];
                        u[i].tech = e.target.value;
                        setProjects(u);
                      }}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setProjects([
                    ...projects,
                    { name: "", description: "", tech: "" },
                  ])
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#F0FDF4",
                  border: "1.5px dashed #BBF7D0",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: "#16A34A",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#DCFCE7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#F0FDF4")
                }
              >
                + Add Project
              </button>
            </div>
            {/* 🔥 GMAIL CONNECTION */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: "10px",
                }}
              >
                📧 Connect Gmail (Required)
              </h3>

              {gmail?.connected ? (
                <p style={{ color: "green", fontWeight: 600 }}>
                  ✅ Connected: {gmail.email}
                </p>
              ) : (
                <button onClick={connectGoogle}>Connect Gmail</button>
              )}

              {!gmail?.connected && (
                <p
                  style={{ color: "red", marginTop: "8px", fontSize: "0.8rem" }}
                >
                  ⚠️ You must connect Gmail before finishing
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "36px",
            paddingTop: "24px",
            borderTop: "1px solid #F3F4F6",
          }}
        >
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            style={{
              padding: "11px 24px",
              borderRadius: "12px",
              border: "1.5px solid #E5E7EB",
              background: step === 1 ? "#F9FAFB" : "white",
              color: step === 1 ? "#D1D5DB" : "#374151",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: step === 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              style={{
                padding: "11px 28px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                border: "none",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(37,99,235,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(37,99,235,0.4)";
              }}
            >
              Continue
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "11px 28px",
                borderRadius: "12px",
                background: loading
                  ? "#93C5FD"
                  : "linear-gradient(135deg, #10B981, #059669)",
                border: "none",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: loading ? "none" : "0 4px 14px rgba(16,185,129,0.4)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Saving..." : "Finish Setup 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
