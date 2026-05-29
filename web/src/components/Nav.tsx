"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950">
      <Link href="/" className="text-lg font-bold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent">
        ComponentAI
      </Link>
      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link href="/dashboard" className="text-zinc-300 hover:text-white">Dashboard</Link>
            <Link href="/pricing" className="text-zinc-300 hover:text-white">Pricing</Link>
            <span className="text-zinc-500">{user.email}</span>
            <button onClick={handleLogout} className="text-zinc-400 hover:text-white">Logout</button>
          </>
        ) : (
          <>
            <Link href="/pricing" className="text-zinc-300 hover:text-white">Pricing</Link>
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign In</Link>
          </>
        )}
      </div>
    </nav>
  );
}
