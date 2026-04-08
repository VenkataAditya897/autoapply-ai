"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Emails() {
  const [emails, setEmails] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    const res = await api.get(`/analytics/emails?status=${filter}`);
    setEmails(res.data);
  };

  useEffect(() => {
    load();
  }, [filter]);
  const fetchEmails = async () => {
    try {
      const res = await api.get("/analytics/emails");
      setEmails(res.data);
    } catch {}
  };
  useEffect(() => {
    fetchEmails();

    const i = setInterval(fetchEmails, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div>
      <h1>Emails</h1>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="sent">Sent</option>
        <option value="pending">Pending</option>
      </select>

      {emails.map((e) => (
        <div
          key={e.id}
          style={{
            background: "white",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "12px",
          }}
        >
          <h3>{e.subject}</h3>
          <p>Status: {e.status}</p>
          <p>{new Date(e.created_at).toLocaleString()}</p>

          <details>
            <summary>View Email</summary>
            <p>{e.body}</p>
          </details>
        </div>
      ))}
    </div>
  );
}
