"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ---------------- NAVBAR ---------------- */}
      <div className="flex justify-between items-center px-10 py-5 border-b">
        <h1 className="text-xl font-bold">AutoApply AI</h1>

        <div className="space-x-4">
          <button onClick={() => router.push("/login")}>Login</button>
          <button
            onClick={() => router.push("/register")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ---------------- HERO ---------------- */}
      <div className="flex flex-col items-center text-center px-6 py-20">
        <h1 className="text-5xl font-bold mb-6">
          Apply to Jobs Automatically with AI
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Connect your Telegram job channels, and let AI generate personalized
          job applications instantly — no manual work needed.
        </p>

        <button
          onClick={() => router.push("/register")}
          className="bg-black text-white px-6 py-3 rounded text-lg"
        >
          Start Free
        </button>
      </div>

      {/* ---------------- FEATURES ---------------- */}
      <div className="grid md:grid-cols-3 gap-8 px-10 py-16 bg-gray-50">
        <Feature
          title="AI Email Generation"
          desc="Automatically generates job application emails tailored to each role."
        />
        <Feature
          title="Telegram Job Sync"
          desc="Fetch jobs directly from Telegram channels in real-time."
        />
        <Feature
          title="Auto Personalization"
          desc="Uses your profile, skills, and experience for perfect applications."
        />
      </div>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <div className="px-10 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Step number="1" title="Create Profile" />
          <Step number="2" title="Connect Telegram" />
          <Step number="3" title="Auto Apply" />
        </div>
      </div>

      {/* ---------------- CTA ---------------- */}
      <div className="text-center py-20 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6">
          Stop Manually Applying to Jobs
        </h2>

        <button
          onClick={() => router.push("/register")}
          className="bg-white text-black px-6 py-3 rounded text-lg"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Feature({ title, desc }: any) {
  return (
    <div className="border p-6 bg-white rounded shadow-sm">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ number, title }: any) {
  return (
    <div>
      <div className="text-3xl font-bold mb-2">{number}</div>
      <p>{title}</p>
    </div>
  );
}
