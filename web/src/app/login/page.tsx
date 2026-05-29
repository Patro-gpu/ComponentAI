"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    else router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto px-6 pt-20">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500" />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg font-semibold transition">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        No account? <Link href="/signup" className="text-purple-400 hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}
