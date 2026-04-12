"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";

export default function Others() {
  const [data, setData] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 8;
  const [typeFilter, setTypeFilter] = useState("all");
  const typeCounts = {
    all: data.length,
    phone: data.filter((d) => d.type === "phone").length,
    link: data.filter((d) => d.type === "link").length,
    form: data.filter((d) => d.type === "google_form").length,
    linkedin: data.filter((d) => d.type === "linkedin").length, // ✅ ADD

    unknown: data.filter((d) => !d.type || d.type === "unknown").length,
  };
  const markCompleted = async (id: number) => {
    try {
      await API.post(`/analytics/complete/${id}`);

      // remove instantly from UI (no wait for refresh)
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error("Failed to mark complete");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/analytics/others");
        setData(res.data);
      } catch {}
    };
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);
  const [filter, setFilter] = useState("pending"); // all | pending | completed

  const others = data.filter((d) => {
    // status filter
    if (filter === "pending" && d.status !== "pending") return false;
    if (filter === "completed" && d.status !== "sent") return false;

    // type filter
    if (typeFilter !== "all" && d.type !== typeFilter) return false;

    return true;
  });
  const paged = others.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(others.length / perPage);

  const thStyle = {
    padding: "10px 16px",
    textAlign: "left" as const,
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#555",
    borderBottom: "1px solid #222",
    whiteSpace: "nowrap" as const,
  };

  const typeColors: Record<string, { bg: string; color: string }> = {
    phone: { bg: "rgba(37,99,235,0.12)", color: "#60a5fa" },
    google_form: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    link: { bg: "rgba(124,58,237,0.12)", color: "#a78bfa" },
    email: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    unknown: { bg: "rgba(100,100,100,0.12)", color: "#888" },
  };

  return (
    <div style={{ padding: "32px 36px", fontFamily: "var(--font-body)" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#ffffff",
            marginBottom: "4px",
          }}
        >
          Others
        </h1>
        <p style={{ color: "#555", fontSize: "0.85rem" }}>
          Non-email job messages — phone numbers, forms, and links.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #2a2a2a",
              background: filter === f ? "#ffffff" : "#1a1a1a",
              color: filter === f ? "#000" : "#888",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}

        {/* ✅ TYPE DROPDOWN */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#888",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          <option value="all">ALL ({typeCounts.all})</option>
          <option value="phone">PHONE ({typeCounts.phone})</option>
          <option value="link">LINK ({typeCounts.link})</option>
          <option value="google_form">FORM ({typeCounts.form})</option>
          <option value="linkedin">LINKEDIN ({typeCounts.linkedin})</option>

          <option value="unknown">UNKNOWN ({typeCounts.unknown})</option>
        </select>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {others.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p
              style={{ color: "#ffffff", fontWeight: 600, marginBottom: "6px" }}
            >
              Nothing here yet
            </p>
            <p style={{ fontSize: "0.82rem", color: "#555" }}>
              Messages without email addresses will appear here.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "36px" }} />
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((d) => {
                const isOpen = expanded === d.id;
                const itemId = `OT-${String(d.id).padStart(4, "0")}`;
                const typeKey = (d.type || "unknown")
                  .toLowerCase()
                  .replace(" ", "_");
                const tc = typeColors[typeKey] ?? typeColors["unknown"];
                const contact = d.phones?.[0] || d.links?.[0] || "—";

                return (
                  <React.Fragment key={d.id}>
                    <tr
                      onClick={() => setExpanded(isOpen ? null : d.id)}
                      style={{
                        borderTop: "1px solid #222",
                        cursor: "pointer",
                        background: isOpen ? "#1e1e2e" : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isOpen)
                          (e.currentTarget as HTMLElement).style.background =
                            "#1f1f1f";
                      }}
                      onMouseLeave={(e) => {
                        if (!isOpen)
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                      }}
                    >
                      {/* Chevron */}
                      <td
                        style={{ padding: "14px 8px 14px 16px", color: "#555" }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{
                            transition: "transform 0.2s",
                            transform: isOpen
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </td>
                      {/* ID */}
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                          color: "#666",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {itemId}
                      </td>
                      {/* Type badge */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            background: tc.bg,
                            color: tc.color,
                            border: `1px solid ${tc.color}33`,
                            borderRadius: "6px",
                            padding: "3px 10px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.type || "unknown"}
                        </span>
                      </td>
                      {/* Contact */}
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.85rem",
                          color: "#ccc",
                          maxWidth: "200px",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {contact}
                        </span>
                      </td>
                      {/* Message preview */}
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.82rem",
                          color: "#666",
                          maxWidth: "260px",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.message ? d.message.slice(0, 60) + "..." : "—"}
                        </span>
                      </td>
                      {/* Attachment */}
                      <td style={{ padding: "14px 16px" }}>
                        {d.attachment_path ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#888"
                              strokeWidth="2"
                            >
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            <span
                              style={{ fontSize: "0.75rem", color: "#888" }}
                            >
                              {d.attachment_path.split("/").pop()}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: "#333", fontSize: "0.75rem" }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isOpen && (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            background: "#141414",
                            borderTop: "1px solid #222",
                            borderBottom: "1px solid #222",
                            padding: "20px 24px",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "20px",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  color: "#444",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  marginBottom: "8px",
                                }}
                              >
                                Original Message
                              </p>
                              <div
                                style={{
                                  background: "#1a1a1a",
                                  border: "1px solid #222",
                                  borderRadius: "8px",
                                  padding: "12px 14px",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "0.82rem",
                                    color: "#999",
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {d.message || "No message"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  color: "#444",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  marginBottom: "8px",
                                }}
                              >
                                Contact Info
                              </p>
                              <div
                                style={{
                                  background: "#1a1a1a",
                                  border: "1px solid #222",
                                  borderRadius: "8px",
                                  padding: "12px 14px",
                                }}
                              >
                                {d.phones?.length > 0 && (
                                  <p
                                    style={{
                                      fontSize: "0.82rem",
                                      color: "#60a5fa",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    📞 {d.phones.join(", ")}
                                  </p>
                                )}
                                {d.links?.length > 0 &&
                                  d.links.map((l: string, i: number) => (
                                    <p
                                      key={l}
                                      style={{
                                        fontSize: "0.78rem",
                                        color: "#a78bfa",
                                        marginBottom: "4px",
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      🔗 {l}
                                    </p>
                                  ))}
                                {d.emails?.length > 0 && (
                                  <p
                                    style={{
                                      fontSize: "0.82rem",
                                      color: "#fbbf24",
                                    }}
                                  >
                                    ✉️ {d.emails.join(", ")}
                                  </p>
                                )}
                              </div>
                              <div style={{ marginTop: "16px" }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // ✅ IMPORTANT
                                    markCompleted(d.id);
                                  }}
                                  style={{
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    background: "#22c55e",
                                    color: "#000",
                                    border: "none",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Mark as Completed
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "20px",
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: page === i ? "#ffffff" : "#1a1a1a",
                border: `1px solid ${page === i ? "#ffffff" : "#2a2a2a"}`,
                color: page === i ? "#000000" : "#666",
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
