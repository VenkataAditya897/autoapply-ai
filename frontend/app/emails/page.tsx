"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";

export default function Emails() {
  const [emails, setEmails] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 8;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/analytics/emails?status=${filter}`);
        setEmails(res.data);
      } catch {}
    };
    fetch();
    const i = setInterval(fetch, 3000);
    return () => clearInterval(i);
  }, [filter]);

  const paged = emails.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(emails.length / perPage);

  const tableStyle = { width: "100%", borderCollapse: "collapse" as const };
  const thStyle = {
    padding: "10px 16px",
    textAlign: "left" as const,
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#555",
    borderBottom: "1px solid #222",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ padding: "32px 36px", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
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
            Emails
          </h1>
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            AI-generated job applications sent on your behalf.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
            padding: "3px",
          }}
        >
          {["all", "sent", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(0);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: filter === f ? "#2a2a2a" : "transparent",
                color: filter === f ? "#ffffff" : "#555",
                fontSize: "0.8rem",
                fontWeight: filter === f ? 600 : 500,
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {emails.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <p
              style={{ color: "#ffffff", fontWeight: 600, marginBottom: "6px" }}
            >
              No emails yet
            </p>
            <p style={{ fontSize: "0.82rem", color: "#555" }}>
              Start the Telegram listener to begin processing job posts.
            </p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "36px" }} />
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Receiver</th>
                <th style={thStyle}>Message</th>
                <th style={thStyle}>Generated Email</th>
                <th style={thStyle}>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => {
                const isOpen = expanded === e.id;
                const jobId = `EM-${String(e.id).padStart(4, "0")}`;
                return (
                  <React.Fragment key={e.id}>
                    <tr
                      key={e.id}
                      onClick={() => setExpanded(isOpen ? null : e.id)}
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
                        {jobId}
                      </td>
                      {/* Receiver */}
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
                          {e.emails?.[0] || "—"}
                        </span>
                      </td>
                      {/* Message preview */}
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.82rem",
                          color: "#666",
                          maxWidth: "220px",
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
                          {e.message ? e.message.slice(0, 60) + "..." : "—"}
                        </span>
                      </td>
                      {/* Generated email preview */}
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "0.82rem",
                          color: "#666",
                          maxWidth: "220px",
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
                          {e.subject ? e.subject : "—"}
                        </span>
                      </td>
                      {/* Attachment */}
                      <td style={{ padding: "14px 16px" }}>
                        {e.attachment_path ? (
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
                              {e.attachment_path.split("/").pop()}
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
                      <tr key={`${e.id}-expanded`}>
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
                            {/* Original message */}
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
                                Original Job Post
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
                                  {e.message || "No message"}
                                </p>
                              </div>
                            </div>
                            {/* Generated email */}
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
                                Generated Email
                              </p>
                              <div
                                style={{
                                  background: "#0d1a2a",
                                  border: "1px solid #1e3a5a",
                                  borderRadius: "8px",
                                  padding: "12px 14px",
                                }}
                              >
                                {e.subject && (
                                  <p
                                    style={{
                                      fontSize: "0.78rem",
                                      fontWeight: 700,
                                      color: "#60a5fa",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Subject: {e.subject}
                                  </p>
                                )}
                                <p
                                  style={{
                                    fontSize: "0.82rem",
                                    color: "#999",
                                    lineHeight: 1.7,
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {e.body || "Not generated yet"}
                                </p>
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
                fontWeight: page === i ? 700 : 500,
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
