import TopStatRow from "../components/cards/TopStatRow";
import MetricCard from "../components/cards/MetricCard";

export default function LiveMonitoring({ metrics, stats, tick }) {
  return (
    <div className="space-y-5">
      <TopStatRow stats={stats} tick={tick} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.id} card={m} />
        ))}
      </div>
    </div>
  );
}
