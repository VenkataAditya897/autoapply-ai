"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    api.get("/profile").then((res) => {
      setProfile(res.data.profile);
    });
  }, []);

  const updateProfile = async () => {
    await api.post("/profile", profile);
    alert("Updated!");
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <input
        className="border p-2 w-full"
        value={profile?.phone || ""}
        placeholder="Phone"
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
      />

      <input
        className="border p-2 w-full"
        value={profile?.linkedin || ""}
        placeholder="LinkedIn"
        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
      />

      <input
        className="border p-2 w-full"
        value={profile?.github || ""}
        placeholder="GitHub"
        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
      />

      {/* RESUME REPLACE */}
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          await api.post("/profile/upload-resume", formData);
          alert("Resume updated!");
        }}
      />

      <button className="bg-black text-white p-2" onClick={updateProfile}>
        Save
      </button>
    </div>
  );
}
