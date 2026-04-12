"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";

export default function Dashboard() {
  const [data, setData] = useState<any>({});
  const [gmailStatus, setGmailStatus] = useState<any>(null);
  const [telegramStatus, setTelegramStatus] = useState<any>(null);
  const isBlocked = !gmailStatus?.connected;
  const connectGoogle = async () => {
    try {
      const res = await API.get("/auth/google/login");
      window.location.href = res.data.url;
    } catch (e) {
      console.log(e);
      alert("Login failed. Please login again.");
    }
  };
  const disconnectGoogle = async () => {
    try {
      await API.post("/auth/google/disconnect");
      fetchData(); // refresh UI instantly
    } catch (e) {
      console.log(e);
      alert("Failed to disconnect");
    }
  };
  const toggleTelegram = async () => {
    try {
      if (!telegramStatus?.connected) return;

      if (telegramStatus.running) {
        await API.post("/telegram/stop");
      } else {
        await API.post("/telegram/start");
      }

      fetchData(); // refresh instantly
    } catch (e) {
      console.log(e);
      alert("Failed to toggle Telegram");
    }
  };

  const fetchData = async () => {
    try {
      const res = await API.get("/analytics/dashboard");
      setData(res.data);
    } catch {}
    try {
      const g = await API.get("/auth/google/status");
      setGmailStatus(g.data);
    } catch {}
    try {
      const t = await API.get("/telegram/status");
      setTelegramStatus(t.data);
    } catch {}
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  const cardStyle = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "20px",
  };

  const stats = [
    {
      label: "Total Jobs",
      value: data.total_jobs ?? 0,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Emails",
      value: `${data.emails?.sent ?? 0} / ${data.emails?.total ?? 0}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },

    {
      label: "Links",
      value: `${data.links?.sent ?? 0} / ${data.links?.total ?? 0}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L10 5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
        </svg>
      ),
    },
    {
      label: "Forms",
      value: `${data.forms?.sent ?? 0} / ${data.forms?.total ?? 0}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M4 4h16v16H4z" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="12" y2="16" />
        </svg>
      ),
    },
    {
      label: "Phones",
      value: `${data.phones?.sent ?? 0} / ${data.phones?.total ?? 0}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.37 1.78.72 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.48a2 2 0 0 1 2.11-.45c.82.35 1.7.6 2.6.72A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: `${data.linkedin?.sent ?? 0} / ${data.linkedin?.total ?? 0}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="2"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "32px 36px",
        fontFamily: "var(--font-body)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#ffffff",
          marginBottom: "24px",
        }}
      >
        Dashboard
      </h1>
      {isBlocked && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            color: "#ef4444",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          ⚠️ Please connect Gmail to start using the platform
        </div>
      )}

      <div
        style={{
          pointerEvents: isBlocked ? "none" : "auto",
          opacity: isBlocked ? 0.6 : 1,
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  {s.label}
                </span>
                {s.icon}
              </div>
              <p
                style={{ fontSize: "2rem", fontWeight: 600, color: "#ffffff" }}
              >
                {s.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1rem",
          color: "#ffffff",
          marginBottom: "14px",
        }}
      >
        Connections
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Google */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: gmailStatus?.connected ? "#22c55e" : "#ef4444",
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Google
                  {!gmailStatus?.connected && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.4)",
                        padding: "2px 6px",
                        borderRadius: "999px",
                      }}
                    >
                      REQUIRED
                    </span>
                  )}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#555" }}>
                  {gmailStatus?.connected
                    ? gmailStatus.email || "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
            {gmailStatus?.connected ? (
              <button
                onClick={disconnectGoogle}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ef4444",
                  background: "#ef4444",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={connectGoogle}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #2563eb",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Connect
              </button>
            )}
          </div>
        </div>
        <div
          style={{
            pointerEvents: isBlocked ? "none" : "auto",
            opacity: isBlocked ? 0.6 : 1,
          }}
        >
          {/* Telegram */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: telegramStatus?.connected
                      ? "#22c55e"
                      : "#ef4444",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    Telegram
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#555" }}>
                    {telegramStatus?.connected
                      ? telegramStatus.phone || "Connected"
                      : "Not connected"}
                  </p>
                </div>
              </div>
              <label
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  style={{ display: "none" }}
                  checked={telegramStatus?.running ?? false}
                  onChange={toggleTelegram}
                  disabled={!telegramStatus?.connected || isBlocked}
                />
                <div
                  style={{
                    width: "36px",
                    height: "18px",
                    borderRadius: "20px",
                    background: telegramStatus?.running ? "#2563EB" : "#333",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: telegramStatus?.running ? "#fff" : "#666",
                      position: "absolute",
                      top: "3px",
                      left: telegramStatus?.running ? "21px" : "3px",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
