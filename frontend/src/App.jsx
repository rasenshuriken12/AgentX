import { useState } from "react";
import Header from "./components/layout/Header";
import TabNav from "./components/layout/TabNav";
import TopStatRow from "./components/cards/TopStatRow";
import LiveMonitoring from "./views/LiveMonitoring";
import AnomalyAnalysis from "./views/AnomalyAnalysis";
import Historical from "./views/Historical";
import Architecture from "./views/Architecture";
import { useLiveMetrics } from "./hooks/useLiveMetrics";

export default function App() {
  const [tab, setTab] = useState("live");
  const { metrics, stats, tick } = useLiveMetrics();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">
        <TopStatRow stats={stats} tick={tick} />
        <TabNav active={tab} onChange={setTab} />
        {tab === "live" && <LiveMonitoring metrics={metrics} />}
        {tab === "anomaly" && <AnomalyAnalysis />}
        {tab === "historical" && <Historical />}
        {tab === "architecture" && <Architecture />}
      </main>
    </div>
  );
}