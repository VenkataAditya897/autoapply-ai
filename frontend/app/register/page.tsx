"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    try {
      setError("");
      await register(email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Register</h1>

      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-black text-white p-2" onClick={handleRegister}>
        Register
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
