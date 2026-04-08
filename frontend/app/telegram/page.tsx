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

  const load = async () => {
    const res = await api.get("/telegram/status");
    setState(res.data);
  };

  useEffect(() => {
    load();
    loadChannels();

    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  const loadChannels = async () => {
    try {
      const res = await api.get("/telegram/channels"); // 👈 we’ll add backend
      setChannels(res.data);
    } catch {}
  };

  const blockIfRunning = () => {
    if (state.running) {
      setError("Stop listener before making changes");
      return true;
    }
    return false;
  };

  // ---------------- OTP FLOW ----------------

  const sendOtp = async () => {
    try {
      await api.post("/telegram/send-otp", null, {
        params: { phone },
      });
      setOtpSent(true);
      setMsg("OTP sent!");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post("/telegram/verify", null, {
        params: { phone, code: otp },
      });
      setMsg("Connected successfully!");
      setOtpSent(false);
      load();
    } catch (e: any) {
      setError(e.response?.data?.detail || "Invalid OTP");
    }
  };

  // ---------------- CHANNEL ----------------

  const addChannel = async () => {
    if (blockIfRunning()) return;

    await api.post("/telegram/add-channel", null, {
      params: { channel },
    });

    setChannel("");
    loadChannels();
  };

  const removeChannel = async (name: string) => {
    if (blockIfRunning()) return;

    await api.post("/telegram/remove-channel", null, {
      params: { channel: name },
    });

    loadChannels();
  };

  return (
    <div>
      <h1>Telegram Integration</h1>

      {/* STATUS */}
      <div style={{ marginTop: "20px" }}>
        <p>Status: {state.connected ? "🟢 Connected" : "🔴 Not Connected"}</p>

        <p>Phone: {state.phone || "-"}</p>

        <p>Listener: {state.running ? "🟢 Running" : "🔴 Stopped"}</p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {/* CONNECT FLOW */}
      {!state.connected && (
        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={sendOtp}>Send OTP</button>

          {otpSent && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOtp}>Verify</button>
            </>
          )}
        </div>
      )}

      {/* CHANNELS */}
      {state.connected && (
        <>
          <div style={{ marginTop: "20px" }}>
            <h3>Channels</h3>

            {channels.length === 0 && <p>No channels added</p>}

            {channels.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                }}
              >
                <span>{c}</span>
                <button onClick={() => removeChannel(c)}>Remove</button>
              </div>
            ))}

            <input
              placeholder="@channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            />

            <button onClick={addChannel}>Add Channel</button>
          </div>

          {/* CONTROLS */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={async () => {
                await api.post("/telegram/start");
                load();
              }}
            >
              Start Listener
            </button>

            <button
              onClick={async () => {
                await api.post("/telegram/stop");
                load();
              }}
            >
              Stop Listener
            </button>

            <button
              onClick={async () => {
                if (blockIfRunning()) return;
                await api.post("/telegram/disconnect");
                load();
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
