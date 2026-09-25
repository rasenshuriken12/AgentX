import MetricCard from "../components/cards/MetricCard";
import ProcessTable from "../components/cards/ProcessTable";
import TemperatureCard from "../components/cards/TemperatureCard";
import HealthGauge from "../components/cards/HealthGauge";
import { topProcesses, temperatureSensors } from "../data/mockData";

export default function LiveMonitoring({ metrics }) {
  return (
    <div className="space-y-5">
      {/* Health gauge + thermals side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HealthGauge score={82} />
        </div>
        <TemperatureCard sensors={temperatureSensors} />
      </div>

      {/* Live metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.id} card={m} />
        ))}
      </div>

      {/* Processes table */}
      <ProcessTable processes={topProcesses} />
    </div>
  );
}