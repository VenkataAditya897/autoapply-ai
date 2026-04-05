"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [channel, setChannel] = useState("");

  useEffect(() => {
    api.get("/profile/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4">
          <p>Total Experience</p>
          <h2 className="text-xl">{data.total_experience}</h2>
        </div>

        <div className="border p-4">
          <p>Skills</p>
          <h2 className="text-xl">{data.skills_count}</h2>
        </div>

        <div className="border p-4">
          <p>Profile Completion</p>
          <h2 className="text-xl">{data.profile_completeness}%</h2>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold">Recent Jobs</h2>

        {data.recent_jobs.length === 0 ? (
          <p>No jobs yet</p>
        ) : (
          data.recent_jobs.map((job: any) => (
            <div key={job.id} className="border p-3 mt-2">
              <p>{job.message_text}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-bold">Telegram</h2>

        <input
          placeholder="Phone (+91...)"
          className="border p-2"
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          disabled={!phone}
          onClick={() => {
            if (!phone.startsWith("+")) {
              setPhoneError(
                "Please include country code without any spaces (e.g. +918978057144)",
              );
              return;
            }

            setPhoneError("");

            api.post("/telegram/send-otp", null, { params: { phone } });
          }}
        >
          Send OTP
        </button>
        {phoneError && <p className="text-red-500">{phoneError}</p>}

        <input
          placeholder="OTP"
          className="border p-2"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={() =>
            api.post("/telegram/verify", null, { params: { phone, code: otp } })
          }
        >
          Verify
        </button>

        <input
          placeholder="Channel name"
          className="border p-2"
          onChange={(e) => setChannel(e.target.value)}
        />

        <button
          onClick={() =>
            api.post("/telegram/add-channel", null, { params: { channel } })
          }
        >
          Add Channel
        </button>

        <button onClick={() => api.post("/telegram/start")}>
          Start Listening
        </button>

        <button onClick={() => api.post("/telegram/stop")}>
          Stop Listening
        </button>
      </div>
    </div>
  );
}
