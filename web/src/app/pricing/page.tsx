import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For trying it out",
    features: ["20 generations / month", "DeepSeek V4 model", "All UI libraries", "Code + Preview", "Copy-paste ready"],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    desc: "For professional developers",
    features: ["Unlimited generations", "GPT-4o + Claude models", "Private component history", "Shareable preview links", "Priority generation queue", "All frameworks & UI libs"],
    cta: "Go Pro — $5/mo",
    href: "/api/stripe/checkout?plan=pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$15",
    period: "/seat/month",
    desc: "For teams and agencies",
    features: ["Everything in Pro", "Shared component library", "Custom project specs", "Team management", "API access", "Priority support"],
    cta: "Contact Sales",
    href: "mailto:sales@componentai.app",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center">Simple, transparent pricing</h1>
      <p className="text-zinc-500 text-center mt-2">80% cheaper than alternatives. Same AI quality, smarter infrastructure.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div key={t.name} className={`p-6 rounded-xl border ${t.highlight ? "border-purple-500 ring-1 ring-purple-500/30" : "border-zinc-800"}`}>
            <h2 className="text-lg font-bold">{t.name}</h2>
            <p className="text-sm text-zinc-500">{t.desc}</p>
            <p className="mt-3 text-4xl font-bold">{t.price}<span className="text-lg text-zinc-500 font-normal">{t.period}</span></p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-400">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><span className="text-purple-400">&#10003;</span> {f}</li>
              ))}
            </ul>
            <Link href={t.href}
              className={`block mt-8 text-center py-2.5 rounded-lg font-semibold text-sm transition ${
                t.highlight ? "bg-purple-600 hover:bg-purple-500 text-white" : "border border-zinc-700 hover:border-zinc-500"
              }`}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
