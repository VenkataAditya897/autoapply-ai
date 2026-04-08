"use client";

import Link from "next/link";

export default function DashboardLayout({ children }: any) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: "220px",
          background: "white",
          borderRight: "1px solid #E5E7EB",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2>AutoApply</h2>

        <Link href="/dashboard">Dashboard</Link>
        <Link href="/emails">Emails</Link>
        <Link href="/telegram">Telegram</Link>
        <Link href="/others">Others</Link>
        <Link href="/profile">Profile</Link>
      </aside>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}
