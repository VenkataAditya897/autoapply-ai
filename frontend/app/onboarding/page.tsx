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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const years = Array.from({ length: 50 }, (_, i) => 1980 + i);
  const [resume, setResume] = useState<File | null>(null);
  const [certifications, setCertifications] = useState([
    { name: "", year: "" },
  ]);

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

  // ── VALIDATION ──
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!basic.first_name.trim())
        newErrors.first_name = "First name is required";
      if (!basic.last_name.trim())
        newErrors.last_name = "Last name is required";
      if (!basic.phone.trim()) newErrors.phone = "Phone number is required";
      if (!basic.location.trim()) newErrors.location = "Location is required";
    }

    if (currentStep === 2) {
      if (skills.length === 0) newErrors.skills = "Add at least one skill";
    }

    if (currentStep === 3) {
    }

    if (currentStep === 4) {
      const validEdu = education.filter(
        (e) => e.college.trim() && e.degree.trim(),
      );

      if (validEdu.length === 0)
        newErrors.education =
          "Add at least one education entry with college and degree";

      if (!resume) newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
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
      // Only submit projects that have a name
      for (const p of projects) {
        if (!p.name.trim()) continue;
        await api.post("/profile/projects", p);
      }
      const validEdu = education.filter((e) => e.college && e.degree);
      for (const e of validEdu)
        await api.post("/profile/education", {
          college: e.college,
          degree: e.degree,
          gpa: e.gpa,
          start_year: e.start_year,
          end_year: e.end_year,
        });
      // ✅ certifications
      for (const c of certifications) {
        if (!c.name.trim()) continue;

        await api.post("/profile/certifications", {
          name: c.name,
          year: c.year || null,
        });
      }
      // ✅ Upload resume
      if (resume) {
        const formData = new FormData();
        formData.append("file", resume);

        await api.post("/profile/upload-resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      router.push("/dashboard");
    } catch {
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  // ── STYLES (matching profile page dark theme) ──
  const inputStyle: React.CSSProperties = {
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
    boxSizing: "border-box",
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    border: "1px solid #ef4444",
  };

  const focusIn = (e: any) => {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
  };
  const focusOut = (e: any) => {
    e.currentTarget.style.borderColor = "#2a2a2a";
    e.currentTarget.style.boxShadow = "none";
  };
  const focusOutError = (fieldName: string) => (e: any) => {
    if (errors[fieldName]) {
      e.currentTarget.style.borderColor = "#ef4444";
      e.currentTarget.style.boxShadow = "none";
    } else {
      e.currentTarget.style.borderColor = "#2a2a2a";
      e.currentTarget.style.boxShadow = "none";
    }
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

  const optionalBadge = (
    <span
      style={{
        fontSize: "0.65rem",
        fontWeight: 600,
        color: "#444",
        background: "#1e1e1e",
        border: "1px solid #2a2a2a",
        borderRadius: "100px",
        padding: "2px 7px",
        marginLeft: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        verticalAlign: "middle",
      }}
    >
      Optional
    </span>
  );

  const cardStyle: React.CSSProperties = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
  };

  const sectionIconStyle = (bg: string): React.CSSProperties => ({
    width: "28px",
    height: "28px",
    background: bg,
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const errorText = (msg: string) => (
    <p
      style={{
        fontSize: "0.75rem",
        color: "#ef4444",
        marginTop: "6px",
        fontWeight: 500,
      }}
    >
      ⚠ {msg}
    </p>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "var(--font-body)",
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
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#ffffff",
          }}
        >
          AutoApply<span style={{ color: "#60a5fa" }}>.ai</span>
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
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#555" }}>
            Step {step} of {TOTAL_STEPS}
          </p>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#60a5fa" }}>
            {Math.round((step / TOTAL_STEPS) * 100)}% complete
          </p>
        </div>
        <div
          style={{
            height: "4px",
            background: "#222",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(step / TOTAL_STEPS) * 100}%`,
              borderRadius: "100px",
              background: "linear-gradient(90deg, #2563EB, #7C3AED)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        {/* Step indicators */}
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
                    ? "#1a1a2e"
                    : step > i + 1
                      ? "#0d1f14"
                      : "#1a1a1a",
                border: `1px solid ${step === i + 1 ? "#2563EB44" : step > i + 1 ? "#16a34a44" : "#2a2a2a"}`,
                transition: "all 0.3s",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color:
                    step === i + 1
                      ? "#60a5fa"
                      : step > i + 1
                        ? "#34d399"
                        : "#444",
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
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "20px",
          padding: "36px",
        }}
      >
        {/* ── STEP 1: Basic Info ── */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                Let's start with the basics
              </h2>
              <p style={{ color: "#555", fontSize: "0.875rem" }}>
                This information will be used to personalize your applications.
              </p>
            </div>

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
                  style={errors.first_name ? inputErrorStyle : inputStyle}
                  placeholder="Venkata"
                  value={basic.first_name}
                  onChange={(e) => {
                    setBasic({ ...basic, first_name: e.target.value });
                    setErrors({ ...errors, first_name: "" });
                  }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                {errors.first_name && errorText(errors.first_name)}
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={errors.last_name ? inputErrorStyle : inputStyle}
                  placeholder="Aditya"
                  value={basic.last_name}
                  onChange={(e) => {
                    setBasic({ ...basic, last_name: e.target.value });
                    setErrors({ ...errors, last_name: "" });
                  }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                {errors.last_name && errorText(errors.last_name)}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #2a2a2a",
                    borderRadius: "10px",
                    background: "#141414",
                    fontSize: "0.875rem",
                    outline: "none",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <div style={{ flex: 1 }}>
                  <input
                    style={
                      errors.phone
                        ? { ...inputErrorStyle, width: "100%" }
                        : { ...inputStyle, width: "100%" }
                    }
                    placeholder="9876543210"
                    value={basic.phone}
                    onChange={(e) => {
                      setBasic({ ...basic, phone: e.target.value });
                      setErrors({ ...errors, phone: "" });
                    }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  {errors.phone && errorText(errors.phone)}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Location</label>
              <input
                style={errors.location ? inputErrorStyle : inputStyle}
                placeholder="Hyderabad, India"
                value={basic.location}
                onChange={(e) => {
                  setBasic({ ...basic, location: e.target.value });
                  setErrors({ ...errors, location: "" });
                }}
                onFocus={focusIn}
                onBlur={focusOut}
              />
              {errors.location && errorText(errors.location)}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>LinkedIn {optionalBadge}</label>
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
                <label style={labelStyle}>GitHub {optionalBadge}</label>
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
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                What are your skills?
              </h2>
              <p style={{ color: "#555", fontSize: "0.875rem" }}>
                Type a skill and press Enter or comma. These power your AI
                applications.
              </p>
            </div>

            <div
              style={{
                minHeight: "120px",
                padding: "14px",
                border: `1px solid ${errors.skills ? "#ef4444" : "#2a2a2a"}`,
                borderRadius: "12px",
                background: "#141414",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignContent: "flex-start",
                cursor: "text",
                transition: "border-color 0.2s",
              }}
              onClick={() => document.getElementById("skill-input")?.focus()}
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
                    onClick={() =>
                      setSkills(skills.filter((_, idx) => idx !== i))
                    }
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
              <input
                id="skill-input"
                value={skillInput}
                placeholder={
                  skills.length === 0
                    ? "e.g. Python, React, FastAPI..."
                    : "Add more..."
                }
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setErrors({ ...errors, skills: "" });
                }}
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
                  color: "#ffffff",
                  minWidth: "160px",
                  flex: 1,
                  background: "transparent",
                }}
              />
            </div>
            {errors.skills && errorText(errors.skills)}

            {skills.length > 0 && (
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#34d399",
                  marginTop: "8px",
                  fontWeight: 600,
                }}
              >
                ✓ {skills.length} skill{skills.length > 1 ? "s" : ""} added
              </p>
            )}

            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#444",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Popular Skills — click to add
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
                      onClick={() => {
                        setSkills([...skills, s]);
                        setErrors({ ...errors, skills: "" });
                      }}
                      style={{
                        background: "#141414",
                        border: "1px solid #2a2a2a",
                        borderRadius: "100px",
                        padding: "5px 12px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#555",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(37,99,235,0.12)";
                        e.currentTarget.style.borderColor =
                          "rgba(96,165,250,0.25)";
                        e.currentTarget.style.color = "#60a5fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#141414";
                        e.currentTarget.style.borderColor = "#2a2a2a";
                        e.currentTarget.style.color = "#555";
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
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                Your work experience
              </h2>
              <p style={{ color: "#555", fontSize: "0.875rem" }}>
                Add your work experience (optional for freshers) with company
                and role is required.
              </p>
            </div>

            {errors.experience && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                }}
              >
                {errorText(errors.experience)}
              </div>
            )}

            {experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  background: "#141414",
                  border: "1px solid #2a2a2a",
                  borderRadius: "14px",
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
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "#888",
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
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#ef4444",
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
                        setErrors({ ...errors, experience: "" });
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
                        setErrors({ ...errors, experience: "" });
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
                    <label style={labelStyle}>Start Date </label>
                    <input
                      type="month"
                      style={inputStyle}
                      value={exp.start_date}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].start_date = e.target.value;
                        setExperience(u);
                      }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date </label>
                    <input
                      type="month"
                      style={{
                        ...inputStyle,
                        background: exp.current ? "#111" : "#141414",
                        color: exp.current ? "#555" : "#ffffff",
                      }}
                      value={exp.current ? "" : exp.end_date}
                      disabled={exp.current}
                      onChange={(e) => {
                        const u = [...experience];
                        u[i].end_date = e.target.value;
                        setExperience(u);
                      }}
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
                      border: exp.current ? "none" : "1.5px solid #333",
                      background: exp.current ? "#2563EB" : "#141414",
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
                      color: "#555",
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
                background: "transparent",
                border: "1px dashed #2a2a2a",
                borderRadius: "12px",
                padding: "10px 20px",
                color: "#60a5fa",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37,99,235,0.08)";
                e.currentTarget.style.borderColor = "#2563EB44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            >
              + Add Another Experience
            </button>
          </div>
        )}

        {/* ── STEP 4: Projects + Education ── */}
        {step === 4 && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                Projects & Education
              </h2>
              <p style={{ color: "#555", fontSize: "0.875rem" }}>
                Almost done! Education is required. Projects and Gmail
                connection are required too.
              </p>
            </div>

            {/* Education */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  marginBottom: "14px",
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
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </span>
                Education
              </h3>

              {errors.education && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "14px",
                  }}
                >
                  {errorText(errors.education)}
                </div>
              )}

              {education.map((edu, i) => (
                <div
                  key={i}
                  style={{
                    background: "#141414",
                    border: "1px solid #2a2a2a",
                    borderRadius: "14px",
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
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#555",
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
                          color: "#ef4444",
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
                          setErrors({ ...errors, education: "" });
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
                          setErrors({ ...errors, education: "" });
                        }}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        GPA / Percentage {optionalBadge}
                      </label>
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
                      <label style={labelStyle}>
                        Start Year {optionalBadge}
                      </label>
                      <select
                        style={inputStyle}
                        value={edu.start_year}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].start_year = e.target.value;
                          setEducation(u);
                        }}
                      >
                        <option value="">Select Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>End Year {optionalBadge}</label>
                      <select
                        style={inputStyle}
                        value={edu.end_year}
                        onChange={(e) => {
                          const u = [...education];
                          u[i].end_year = e.target.value;
                          setEducation(u);
                        }}
                      >
                        <option value="">Select Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
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
                  background: "transparent",
                  border: "1px dashed #2a2a2a",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: "#60a5fa",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(37,99,235,0.08)";
                  e.currentTarget.style.borderColor = "#2563EB44";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }}
              >
                + Add Education
              </button>
            </div>

            {/* Projects */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  marginBottom: "14px",
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
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                Projects {optionalBadge}
              </h3>
              {projects.map((proj, i) => (
                <div
                  key={i}
                  style={{
                    background: "#141414",
                    border: "1px solid #2a2a2a",
                    borderRadius: "14px",
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
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#555",
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
                          color: "#ef4444",
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
                  background: "transparent",
                  border: "1px dashed #2a2a2a",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: "#34d399",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(52,211,153,0.06)";
                  e.currentTarget.style.borderColor = "#34d39944";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }}
              >
                + Add Project
              </button>
            </div>
            {/* Certifications */}
            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>Certifications {optionalBadge}</label>

              {certifications.map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  <input
                    placeholder="AWS Certified Developer"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[i].name = e.target.value;
                      setCertifications(updated);
                    }}
                    style={inputStyle}
                  />

                  <input
                    placeholder="2023"
                    value={c.year}
                    onChange={(e) => {
                      const updated = [...certifications];
                      updated[i].year = e.target.value;
                      setCertifications(updated);
                    }}
                    style={{ ...inputStyle, width: "120px" }}
                  />
                </div>
              ))}

              <button
                onClick={() =>
                  setCertifications([...certifications, { name: "", year: "" }])
                }
                style={{
                  background: "transparent",
                  border: "1px dashed #2a2a2a",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  color: "#60a5fa",
                  cursor: "pointer",
                }}
              >
                + Add Certification
              </button>
            </div>
            {/* Resume Upload */}
            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>
                Resume <span style={{ color: "#ef4444" }}>*</span>
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                style={{ ...inputStyle, padding: "8px" }}
              />

              {!resume && errors.resume && errorText(errors.resume)}
            </div>
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #222",
          }}
        >
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              border: "1px solid #2a2a2a",
              background: "transparent",
              color: step === 1 ? "#333" : "#888",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: step === 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (step !== 1) {
                e.currentTarget.style.background = "#1a1a1a";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = step === 1 ? "#333" : "#888";
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
              onClick={handleNext}
              style={{
                padding: "10px 28px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                border: "none",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                padding: "10px 28px",
                borderRadius: "10px",
                background: loading
                  ? "#1e3a2e"
                  : "linear-gradient(135deg, #10B981, #059669)",
                border: "none",
                color: loading ? "#34d39966" : "white",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Saving..." : "Finish Setup ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
