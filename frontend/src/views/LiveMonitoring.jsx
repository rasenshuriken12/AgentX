import MetricCard from "../components/cards/MetricCard";
import ProcessTable from "../components/cards/ProcessTable";
import { topProcesses } from "../data/mockData";

export default function LiveMonitoring({ metrics }) {
  return (
    <div className="space-y-5">
      {/* 6 metric cards: 3 per row on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.id} card={m} />
        ))}
      </div>

      {/* Processes table */}
      <ProcessTable processes={topProcesses} />
    </div>
  );
}
