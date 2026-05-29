import Link from "next/link";

export default function Landing() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-5xl font-bold tracking-tight">
        AI Components at{" "}
        <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">80% less</span>{" "}
        than competitors
      </h1>
      <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
        Same quality as v0.dev and bolt.new. Powered by next-gen AI infrastructure that costs 20x less.
        The savings go to you.
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <Link href="/signup" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold transition">
          Start Free — 20 gens/month
        </Link>
        <Link href="/pricing" className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 rounded-lg font-semibold transition">
          Pro $5/month
        </Link>
      </div>

      {/* Token arbitrage explainer */}
      <div className="mt-8 p-4 border border-zinc-800 rounded-xl bg-zinc-900/50 max-w-xl mx-auto">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">How we do it</p>
        <p className="text-sm text-zinc-400">
          We use next-generation AI infrastructure that costs <span className="text-emerald-400 font-semibold">10-50x less per token</span> than
          the APIs powering v0.dev and Cursor. We pass the savings to you — <span className="text-white font-medium">same quality code, fraction of the price</span>.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-8 text-center">
        {[
          { value: "5+", label: "Frameworks" },
          { value: "<30s", label: "Generation" },
          { value: "Copy-Paste", label: "No Lock-in" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-bold text-purple-400">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-bold">Simple Pricing</h2>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { tier: "Free", price: "$0", desc: "20 gens/month", href: "/signup" },
            { tier: "Pro", price: "$5/mo", desc: "Unlimited + all models", href: "/pricing" },
            { tier: "Team", price: "$15/seat", desc: "Pro + team lib + API", href: "/pricing" },
          ].map((p) => (
            <div key={p.tier} className="p-5 border border-zinc-800 rounded-xl text-center">
              <p className="text-sm font-semibold text-zinc-400">{p.tier}</p>
              <p className="text-3xl font-bold mt-2">{p.price}</p>
              <p className="text-xs text-zinc-500 mt-1">{p.desc}</p>
              <Link href={p.href} className="block mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-semibold transition">
                {p.tier === "Free" ? "Get Started" : "Learn More"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-24 text-sm text-zinc-600">ComponentAI — Built with FastAPI + DeepSeek + Next.js</footer>
    </div>
  );
}
