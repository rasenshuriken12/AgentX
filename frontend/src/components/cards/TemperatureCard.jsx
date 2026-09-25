import { Thermometer, Fan } from "lucide-react";

export default function TemperatureCard({ sensors }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="w-4 h-4 text-agentx-red" />
        <h3 className="font-bold text-sm">Thermals & Cooling</h3>
      </div>
      <div className="space-y-3">
        {sensors.map((s) => (
          <div key={s.name} className="flex items-center justify-between">
            <span className="text-xs text-agentx-muted">{s.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold">
                {s.value}
                <span className="text-xs font-medium text-agentx-muted ml-1">{s.unit}</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  s.status === "NORMAL"
                    ? "bg-agentx-greenSoft text-agentx-green"
                    : "bg-agentx-yellowSoft text-agentx-yellow"
                }`}
              >
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}