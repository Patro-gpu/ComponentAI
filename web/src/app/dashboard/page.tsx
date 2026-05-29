import { Generator } from "@/components/Generator";
import { History } from "@/components/History";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-zinc-500 text-sm mt-1">Generate, preview, and manage your components</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Generator — main area */}
        <div className="lg:col-span-3">
          <div className="p-5 border border-zinc-800 rounded-xl">
            <h2 className="font-semibold mb-4">New Component</h2>
            <Generator />
          </div>
        </div>

        {/* Sidebar: stats + history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 border border-zinc-800 rounded-xl">
            <h2 className="font-semibold mb-2">Plan</h2>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">FREE</span>
            <p className="text-zinc-500 text-xs mt-2">20 generations remaining this month</p>
            <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </div>

          <div className="p-5 border border-zinc-800 rounded-xl">
            <h2 className="font-semibold mb-3">History</h2>
            <History />
          </div>
        </div>
      </div>
    </div>
  );
}
