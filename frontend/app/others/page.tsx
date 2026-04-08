"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function Others() {
  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await API.get("/analytics/emails"); // reuse jobs
      setData(res.data);
    } catch {}
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div>
      <h1>Other Messages</h1>

      {data.map((d) => (
        <div key={d.id} style={{ marginTop: "10px" }}>
          <p>{d.message}</p>
        </div>
      ))}
    </div>
  );
}
