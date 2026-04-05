"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Onboarding() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ---------------- BASIC ----------------
  const [basic, setBasic] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/profile")
      .then((res) => {
        if (res.data.profile) {
          router.push("/dashboard"); // already onboarded
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  // ---------------- SKILLS ----------------
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // ---------------- EXPERIENCE ----------------
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

  // ---------------- PROJECTS ----------------
  const [projects, setProjects] = useState([
    { name: "", description: "", tech: "" },
  ]);

  // ---------------- EDUCATION ----------------
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

  // ---------------- HANDLERS ----------------
  const addExperience = () =>
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
    ]);

  const addProject = () =>
    setProjects([...projects, { name: "", description: "", tech: "" }]);

  const addEducation = () =>
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
    ]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    // 🔥 VALIDATION

    if (skills.length === 0) {
      alert("Please add at least one skill");
      setLoading(false);
      return;
    }

    const validEducation = education.filter((e) => e.college && e.degree);

    if (validEducation.length === 0) {
      alert("At least one education is required");
      setLoading(false);
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      await api.post("/profile", basic);

      for (let s of skills) {
        if (s.trim()) await api.post("/profile/skills", { name: s });
      }

      for (let exp of experience) {
        const { current, ...cleanExp } = exp;

        if (!cleanExp.company || !cleanExp.role) continue;

        await api.post("/profile/experience", cleanExp);
      }

      for (let p of projects) {
        if (!p.name) continue;
        await api.post("/profile/projects", p);
      }

      for (let e of education) {
        if (!e.college || !e.degree) continue;

        await api.post("/profile/education", {
          college: e.college,
          degree: e.degree,
          gpa: e.gpa,
          start_year: e.start_year,
          end_year: e.end_year,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };
  const [countryCode, setCountryCode] = useState("+91");

  return (
    <div className="max-w-3xl mx-auto p-10 flex flex-col gap-10">
      {/* ---------------- BASIC ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-3">Basic Info</h2>

        <input
          placeholder="First Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setBasic({ ...basic, first_name: e.target.value })}
        />

        <input
          placeholder="Last Name"
          className="border p-2 w-full mb-2"
          onChange={(e) => setBasic({ ...basic, last_name: e.target.value })}
        />

        {/* PHONE WITH COUNTRY CODE */}
        <div className="flex gap-2 mb-2">
          <select
            className="border p-2"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>

          <input
            placeholder="Phone"
            className="border p-2 w-full"
            onChange={(e) =>
              setBasic({
                ...basic,
                phone: countryCode + e.target.value,
              })
            }
          />
        </div>

        <input
          placeholder="Location"
          className="border p-2 w-full"
          onChange={(e) => setBasic({ ...basic, location: e.target.value })}
        />
      </div>

      {/* ---------------- SKILLS ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-3">Skills</h2>

        <div className="border p-2 flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <div
              key={i}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {s}
              <span
                className="cursor-pointer text-red-500"
                onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
              >
                ×
              </span>
            </div>
          ))}

          <input
            className="outline-none flex-1"
            placeholder="Type skill + Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();

                const values = skillInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);

                const newSkills = [...skills];

                values.forEach((val) => {
                  if (
                    !newSkills.some(
                      (s) => s.toLowerCase() === val.toLowerCase(),
                    )
                  ) {
                    newSkills.push(val);
                  }
                });

                setSkills(newSkills);
                setSkillInput("");
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");

              if (pasted.includes(",")) {
                e.preventDefault();

                const values = pasted
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);

                const newSkills = [...skills];

                values.forEach((val) => {
                  if (
                    !newSkills.some(
                      (s) => s.toLowerCase() === val.toLowerCase(),
                    )
                  ) {
                    newSkills.push(val);
                  }
                });

                setSkills(newSkills);
                setSkillInput("");
              }
            }}
          />
        </div>
      </div>

      {/* ---------------- EXPERIENCE ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-3">Experience</h2>

        {experience.map((exp, i) => (
          <div key={i} className="border p-4 mb-3">
            {/* REMOVE BUTTON */}
            <button
              onClick={() =>
                setExperience(experience.filter((_, idx) => idx !== i))
              }
              className="text-red-500 text-sm mb-2"
            >
              Remove
            </button>

            <input
              placeholder="Company"
              value={exp.company}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...experience];
                updated[i].company = e.target.value;
                setExperience(updated);
              }}
            />

            <input
              placeholder="Role"
              value={exp.role}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...experience];
                updated[i].role = e.target.value;
                setExperience(updated);
              }}
            />

            <input
              placeholder="Start Date"
              value={exp.start_date}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...experience];
                updated[i].start_date = e.target.value;
                setExperience(updated);
              }}
            />

            {/* STILL WORKING */}
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  const updated = [...experience];
                  updated[i].current = e.target.checked;
                  updated[i].end_date = e.target.checked ? "Present" : "";
                  setExperience(updated);
                }}
              />
              Still Working
            </label>

            <input
              className="border p-2 w-full mb-2"
              disabled={exp.current}
              value={exp.current ? "Present" : exp.end_date}
              onChange={(e) => {
                const updated = [...experience];
                updated[i].end_date = e.target.value;
                setExperience(updated);
              }}
            />

            <textarea
              placeholder="Description"
              value={exp.description}
              className="border p-2 w-full"
              onChange={(e) => {
                const updated = [...experience];
                updated[i].description = e.target.value;
                setExperience(updated);
              }}
            />
          </div>
        ))}

        <button onClick={addExperience} className="text-blue-500">
          + Add Experience
        </button>
      </div>
      {/* ---------------- PROJECTS ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-3">Projects (Optional)</h2>

        {projects.map((proj, i) => (
          <div key={i} className="border p-4 mb-3">
            <button
              onClick={() =>
                setProjects(projects.filter((_, idx) => idx !== i))
              }
              className="text-red-500 text-sm mb-2"
            >
              Remove
            </button>

            <input
              placeholder="Project Name"
              value={proj.name}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...projects];
                updated[i].name = e.target.value;
                setProjects(updated);
              }}
            />

            <textarea
              placeholder="Description"
              value={proj.description}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...projects];
                updated[i].description = e.target.value;
                setProjects(updated);
              }}
            />

            <input
              placeholder="Tech (comma separated)"
              value={proj.tech}
              className="border p-2 w-full"
              onChange={(e) => {
                const updated = [...projects];
                updated[i].tech = e.target.value;
                setProjects(updated);
              }}
            />
          </div>
        ))}

        <button onClick={addProject} className="text-blue-500">
          + Add Project
        </button>
      </div>

      {/* ---------------- EDUCATION ---------------- */}
      <div>
        <h2 className="text-xl font-bold mb-3">Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="border p-4 mb-3">
            {/* REMOVE */}
            <button
              onClick={() =>
                setEducation(education.filter((_, idx) => idx !== i))
              }
              className="text-red-500 text-sm mb-2"
            >
              Remove
            </button>

            {/* COLLEGE */}
            <input
              placeholder="College"
              value={edu.college}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...education];
                updated[i].college = e.target.value;
                setEducation(updated);
              }}
            />

            {/* DEGREE */}
            <input
              placeholder="Degree (e.g. B.Tech)"
              value={edu.degree}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...education];
                updated[i].degree = e.target.value;
                setEducation(updated);
              }}
            />

            {/* TYPE */}
            <select
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...education];
                updated[i].type = e.target.value;
                setEducation(updated);
              }}
            >
              <option value="cgpa">CGPA</option>
              <option value="percentage">Percentage</option>
            </select>

            {/* GPA */}
            <input
              placeholder={
                edu.type === "cgpa"
                  ? "CGPA (e.g. 8.5)"
                  : "Percentage (e.g. 85%)"
              }
              value={edu.gpa}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...education];
                updated[i].gpa = e.target.value;
                setEducation(updated);
              }}
            />

            {/* START YEAR */}
            <input
              placeholder="Start Year (e.g. 2021)"
              value={edu.start_year}
              className="border p-2 w-full mb-2"
              onChange={(e) => {
                const updated = [...education];
                updated[i].start_year = e.target.value;
                setEducation(updated);
              }}
            />

            {/* END YEAR */}
            <input
              placeholder="End Year (e.g. 2025)"
              value={edu.end_year}
              className="border p-2 w-full"
              onChange={(e) => {
                const updated = [...education];
                updated[i].end_year = e.target.value;
                setEducation(updated);
              }}
            />
          </div>
        ))}

        <button onClick={addEducation} className="text-blue-500">
          + Add Education
        </button>
        <input
          placeholder="LinkedIn (optional)"
          className="border p-2 w-full mb-2"
          onChange={(e) => setBasic({ ...basic, linkedin: e.target.value })}
        />

        <input
          placeholder="GitHub (optional)"
          className="border p-2 w-full"
          onChange={(e) => setBasic({ ...basic, github: e.target.value })}
        />
        {/* ---------------- RESUME ---------------- */}
        <div>
          <h2 className="text-xl font-bold mb-3">Resume</h2>

          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              await api.post("/profile/upload-resume", formData);
            }}
          />
        </div>
      </div>

      {/* ---------------- SUBMIT ---------------- */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white p-3"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
