import MiniLineChart from "../charts/MiniLineChart";

const STATUS_STYLES = {
  HEALTHY: "bg-agentx-greenSoft text-agentx-green",
  WARNING: "bg-agentx-yellowSoft text-agentx-yellow",
  CRITICAL: "bg-agentx-redSoft text-agentx-red",
};

export default function MetricCard({ card }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold">{card.title}</h3>
          <p className="text-xs text-agentx-muted mt-0.5">{card.subtitle}</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLES[card.status]}`}
        >
          {card.status}
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-3">
        <span className="text-3xl font-extrabold tracking-tight">{card.value}</span>
        <span className="text-sm font-semibold text-agentx-muted">{card.unit}</span>
      </div>

      <MiniLineChart data={card.sparkline} />
    </div>
  );
}