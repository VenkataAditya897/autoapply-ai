"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function Dashboard() {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get("/analytics/dashboard");
      setData(res.data);
    } catch {
      setError("Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  const Card = ({ title, value }: any) => (
    <div
      style={{
        padding: "20px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        flex: 1,
      }}
    >
      <h3>{value}</h3>
      <p style={{ color: "#6B7280" }}>{title}</p>
    </div>
  );
  const start = async () => {
    await API.post("/telegram/start");
  };

  const stop = async () => {
    await API.post("/telegram/stop");
  };

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Card title="Total Messages" value={data.total || 0} />
        <Card title="Emails Sent" value={data.sent || 0} />
        <Card title="Pending" value={data.pending || 0} />
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={start}>Start Listener</button>
        <button onClick={stop}>Stop Listener</button>
      </div>
    </div>
  );
}
