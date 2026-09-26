import { TIME_RANGES } from "../../data/historicalData";

export default function TimeRangeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-agentx-bg border border-agentx-border rounded-full p-1 overflow-x-auto no-scrollbar max-w-full">
      {TIME_RANGES.map((r) => {
        const active = value === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              active
                ? "bg-white shadow-sm border border-agentx-border text-agentx-text"
                : "text-agentx-muted hover:text-agentx-text"
            }`}
          >
            {r.label}
          </button>
        );
      })}
      <button
        onClick={() => onChange("custom")}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
          value === "custom"
            ? "bg-white shadow-sm border border-agentx-border text-agentx-text"
            : "text-agentx-muted hover:text-agentx-text"
        }`}
      >
        Custom
      </button>
    </div>
  );
}
