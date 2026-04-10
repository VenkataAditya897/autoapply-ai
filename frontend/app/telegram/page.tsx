"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function TelegramPage() {
  const [state, setState] = useState<any>({});
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [channels, setChannels] = useState<string[]>([]);
  const [channel, setChannel] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [gmailStatus, setGmailStatus] = useState<any>(null);
  const isBlocked = !gmailStatus?.connected;

  const load = async () => {
    try {
      const r = await api.get("/telegram/status");
      setState(r.data);
    } catch {}
  };
  const loadChannels = async () => {
    try {
      const r = await api.get("/telegram/channels");
      setChannels(r.data);
    } catch {}
  };

  useEffect(() => {
    load();
    loadChannels();
    api.get("/auth/google/status").then((r) => {
      setGmailStatus(r.data);
    });
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 4000);
  };
  const showErr = (e: string) => {
    setError(e);
    setTimeout(() => setError(""), 4000);
  };
  const blockIfRunning = () => {
    if (state.running) {
      showErr("Stop listener before making changes");
      return true;
    }
    return false;
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      await api.post("/telegram/send-otp", null, { params: { phone } });
      setOtpSent(true);
      showMsg("OTP sent!");
    } catch (e: any) {
      showErr(e.response?.data?.detail || "Failed");
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setLoading(true);
    try {
      await api.post("/telegram/verify", null, {
        params: { phone, code: otp },
      });
      showMsg("Connected!");
      setOtpSent(false);
      load();
    } catch (e: any) {
      showErr(e.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  const addChannel = async () => {
    if (blockIfRunning() || !channel.trim()) return;
    await api.post("/telegram/add-channel", null, { params: { channel } });
    setChannel("");
    loadChannels();
    showMsg("Channel added!");
  };
  const removeChannel = async (name: string) => {
    if (blockIfRunning()) return;
    await api.post("/telegram/remove-channel", null, {
      params: { channel: name },
    });
    loadChannels();
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
  const cardStyle = {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "16px",
  };
  const cardTitle = {
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#ffffff",
    marginBottom: "16px",
  };

  return (
    <div
      style={{
        padding: "32px 36px",
        fontFamily: "var(--font-body)",
        maxWidth: "720px",
        opacity: isBlocked ? 0.5 : 1,
        pointerEvents: isBlocked ? "none" : "auto",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#ffffff",
          marginBottom: "6px",
        }}
      >
        Telegram
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
          ⚠️ Please connect Gmail in Dashboard to use Telegram features
        </div>
      )}
      <p style={{ color: "#555", fontSize: "0.85rem", marginBottom: "24px" }}>
        Connect your Telegram account to monitor job channels.
      </p>

      {(error || msg) && (
        <div
          style={{
            background: error ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
            border: `1px solid ${error ? "#ef444444" : "#22c55e44"}`,
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: error ? "#ef4444" : "#22c55e",
              fontWeight: 500,
            }}
          >
            {error || msg}
          </p>
        </div>
      )}

      {/* Status */}
      <div style={cardStyle}>
        <p style={cardTitle}>Connection Status</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "10px",
          }}
        >
          {[
            {
              label: "Account",
              val: state.connected ? "Connected" : "Not connected",
              ok: state.connected,
              sub: state.phone || "No phone linked",
            },
            {
              label: "Listener",
              val: state.running ? "Running" : "Stopped",
              ok: state.running,
              sub: state.running ? "Monitoring channels" : "Not active",
            },
            {
              label: "Channels",
              val: `${channels.length} channel${channels.length !== 1 ? "s" : ""}`,
              ok: channels.length > 0,
              sub: channels.length > 0 ? "Configured" : "None added",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "#141414",
                border: "1px solid #222",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "6px",
                }}
              >
                {item.label}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "3px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: item.ok ? "#22c55e" : "#ef4444",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {item.val}
                </p>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#444" }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connect flow */}
      {!state.connected && (
        <div style={cardStyle}>
          <p style={cardTitle}>Connect your account</p>
          <p
            style={{ fontSize: "0.82rem", color: "#555", marginBottom: "16px" }}
          >
            Enter your phone with country code. You'll receive an OTP via
            Telegram.
          </p>
          {!otpSent ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
              <button
                onClick={sendOtp}
                disabled={loading || !phone}
                style={{
                  padding: "10px 20px",
                  background: phone
                    ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                    : "#222",
                  border: "none",
                  borderRadius: "10px",
                  color: phone ? "white" : "#555",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: phone ? "pointer" : "not-allowed",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : (
            <div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#555",
                  marginBottom: "10px",
                }}
              >
                OTP sent to <strong style={{ color: "#aaa" }}>{phone}</strong>
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  style={{
                    ...inputStyle,
                    flex: 1,
                    letterSpacing: "0.15em",
                    fontWeight: 700,
                  }}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                />
                <button
                  onClick={verifyOtp}
                  disabled={loading || !otp}
                  style={{
                    padding: "10px 20px",
                    background: otp
                      ? "linear-gradient(135deg,#10B981,#059669)"
                      : "#222",
                    border: "none",
                    borderRadius: "10px",
                    color: otp ? "white" : "#555",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: otp ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap",
                  }}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                  fontSize: "0.78rem",
                  marginTop: "8px",
                  padding: 0,
                }}
              >
                ← Change number
              </button>
            </div>
          )}
        </div>
      )}

      {/* Channels */}
      {state.connected && (
        <div style={cardStyle}>
          <p style={cardTitle}>Job Channels</p>
          <p
            style={{ fontSize: "0.82rem", color: "#555", marginBottom: "16px" }}
          >
            Add Telegram channel usernames (e.g. @pythonjobs) to monitor.
          </p>
          {channels.length === 0 && (
            <p
              style={{
                fontSize: "0.82rem",
                color: "#444",
                marginBottom: "14px",
                textAlign: "center",
                padding: "12px",
                background: "#141414",
                borderRadius: "8px",
              }}
            >
              No channels added yet.
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "14px",
            }}
          >
            {channels.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#141414",
                  border: "1px solid #222",
                  borderRadius: "9px",
                  padding: "9px 12px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      background: "#1e1e3a",
                      borderRadius: "7px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    >
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    {c}
                  </span>
                </div>
                <button
                  onClick={() => removeChannel(c)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#444",
                    padding: "4px",
                    borderRadius: "6px",
                    display: "flex",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a0a0a";
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "#444";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="@channel or channel_name"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChannel()}
            />
            <button
              onClick={addChannel}
              disabled={!channel.trim()}
              style={{
                padding: "10px 20px",
                background: channel.trim()
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "#222",
                border: "none",
                borderRadius: "10px",
                color: channel.trim() ? "white" : "#555",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: channel.trim() ? "pointer" : "not-allowed",
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      {state.connected && (
        <div style={cardStyle}>
          <p style={cardTitle}>Listener Controls</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={async () => {
                await api.post("/telegram/start");
                load();
                showMsg("Listener started!");
              }}
              style={{
                padding: "9px 18px",
                background: "linear-gradient(135deg,#10B981,#059669)",
                border: "none",
                borderRadius: "9px",
                color: "white",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>{" "}
              Start Listener
            </button>
            <button
              onClick={async () => {
                await api.post("/telegram/stop");
                load();
                showMsg("Stopped.");
              }}
              style={{
                padding: "9px 18px",
                background: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "9px",
                color: "#888",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>{" "}
              Stop Listener
            </button>
            <button
              onClick={async () => {
                if (blockIfRunning()) return;
                await api.post("/telegram/disconnect");
                load();
                showMsg("Disconnected.");
              }}
              style={{
                padding: "9px 18px",
                background: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "9px",
                color: "#555",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
