"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    if (err) setError(err.message);
    else {
      setError("Check your email for the confirmation link!");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto px-6 pt-20">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" />
        <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" />
        {error && <p className={`text-xs ${error.includes("Check") ? "text-emerald-400" : "text-red-400"}`}>{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg font-semibold transition">
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have one? <Link href="/login" className="text-purple-400 hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
