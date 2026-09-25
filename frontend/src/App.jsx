import { useState } from "react";
import Header from "./components/layout/Header";
import ProfileDrawer from "./components/layout/ProfileDrawer";
import TopStatRow from "./components/cards/TopStatRow";
import LiveMonitoring from "./views/LiveMonitoring";
import SystemOverview from "./views/SystemOverview";
import AnomalyAnalysis from "./views/AnomalyAnalysis";
import Historical from "./views/Historical";
import Architecture from "./views/Architecture";
import ProfilePage from "./views/ProfilePage";
import GeneralSettings from "./views/GeneralSettings";
import { useLiveMetrics } from "./hooks/useLiveMetrics";

export default function App() {
  const [tab, setTab] = useState("live");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlay, setOverlay] = useState(null);   // null | "profile" | "general" | ...

  const { metrics, stats, tick } = useLiveMetrics();

  const handleDrawerSelect = (key) => {
    setDrawerOpen(false);
    // For now, only "profile" and "general" have real views. Others are placeholders.
    if (key === "profile" || key === "general") {
      setOverlay(key);
    } else {
      setOverlay(key); // will render a simple placeholder
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        activeTab={tab}
        onTabChange={(t) => { setTab(t); setOverlay(null); }}
        onProfileClick={() => setDrawerOpen(true)}
      />

      <ProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleDrawerSelect}
      />

      <main className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">
        {overlay === "profile" && <ProfilePage onBack={() => setOverlay(null)} />}
        {overlay === "general" && <GeneralSettings onBack={() => setOverlay(null)} />}
        {overlay && overlay !== "profile" && overlay !== "general" && (
          <PlaceholderPage name={overlay} onBack={() => setOverlay(null)} />
        )}

        {!overlay && (
          <>
            <TopStatRow stats={stats} tick={tick} />
            {tab === "live"       && <LiveMonitoring metrics={metrics} />}
            {tab === "overview"   && <SystemOverview />}
            {tab === "anomaly"    && <AnomalyAnalysis />}
            {tab === "historical" && <Historical />}
            {tab === "architecture" && <Architecture />}
          </>
        )}
      </main>
    </div>
  );
}

function PlaceholderPage({ name, onBack }) {
  const pretty = name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-3 py-2 rounded-lg border border-agentx-border bg-agentx-card text-sm font-medium hover:bg-white transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">{pretty}</h1>
          <p className="text-xs text-agentx-muted mt-0.5">Coming soon</p>
        </div>
      </div>
      <div className="bg-agentx-card border border-agentx-border rounded-xl p-8 text-center">
        <p className="text-sm text-agentx-muted">
          This section is a placeholder. Wire it to real logic when ready.
        </p>
      </div>
    </div>
  );
}
