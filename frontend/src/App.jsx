import { useState } from "react";
import Header from "./components/layout/Header";
import TopStatRow from "./components/cards/TopStatRow";
import LiveMonitoring from "./views/LiveMonitoring";
import SystemOverview from "./views/SystemOverview";
import AnomalyAnalysis from "./views/AnomalyAnalysis";
import Historical from "./views/Historical";
import Architecture from "./views/Architecture";
import ProfilePage from "./views/ProfilePage";
import { useLiveMetrics } from "./hooks/useLiveMetrics";

export default function App() {
  const [tab, setTab] = useState("live");
  const [showProfile, setShowProfile] = useState(false);
  const { metrics, stats, tick } = useLiveMetrics();

  return (
    <div className="min-h-screen">
      <Header
        activeTab={tab}
        onTabChange={setTab}
        onProfileClick={() => setShowProfile(true)}
      />

      <main className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">
        {showProfile ? (
          <ProfilePage onBack={() => setShowProfile(false)} />
        ) : (
          <>
            <TopStatRow stats={stats} tick={tick} />

            {tab === "live" && <LiveMonitoring metrics={metrics} />}
            {tab === "overview" && <SystemOverview />}
            {tab === "anomaly" && <AnomalyAnalysis />}
            {tab === "historical" && <Historical />}
            {tab === "architecture" && <Architecture />}
          </>
        )}
      </main>
    </div>
  );
}
