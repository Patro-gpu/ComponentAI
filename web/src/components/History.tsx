"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ComponentRecord {
  id: string;
  component_type: string;
  framework: string;
  prompt: string;
  code: string;
  created_at: string;
}

export function History() {
  const [items, setItems] = useState<ComponentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      const { data: comps } = await supabase
        .from("components")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setItems(comps ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-500 text-sm">Loading history...</p>;
  if (!items.length) return <p className="text-zinc-500 text-sm">No generated components yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="p-3 border border-zinc-800 rounded-lg hover:border-zinc-700 transition cursor-pointer"
          onClick={() => {
            const w = window.open("", "_blank")!;
            w.document.write(`<pre style="background:#111;color:#eee;padding:16px;font-size:12px;white-space:pre-wrap;font-family:monospace">${item.code.replace(/</g,"&lt;")}</pre>`);
          }}>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{item.component_type}</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{item.framework}</span>
            <span className="text-xs text-zinc-600 ml-auto">{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-zinc-400 mt-1.5 truncate">{item.prompt}</p>
        </div>
      ))}
    </div>
  );
}
