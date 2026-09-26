import { useMemo } from "react";
import { Grid3x3 } from "lucide-react";
import { generateAnomalyHeatmap } from "../../data/historicalData";

const HOURS = Array.from({ length: 24 }, (_, h) => h);

function cellColor(count, max) {
  if (count === 0) return "#f1f5f9";             // empty slate
  const r = count / Math.max(1, max);
  if (r >= 0.75) return "#dc2626";               // red
  if (r >= 0.50) return "#f59e0b";               // amber
  if (r >= 0.25) return "#fbbf24";               // yellow
  return "#86efac";                              // light green
}

export default function AnomalyHeatmap() {
  const cells = useMemo(() => generateAnomalyHeatmap(42), []);
  const max = Math.max(...cells.map((c) => c.count));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const lookup = (day, hour) =>
    cells.find((c) => c.day === day && c.hour === hour)?.count ?? 0;

  const total = cells.reduce((s, c) => s + c.count, 0);

  return (
    <section className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <header className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4 text-agentx-purple" />
            <h2 className="font-bold">Anomaly Heatmap</h2>
          </div>
          <p className="text-xs text-agentx-muted mt-1">
            Day × hour · {total} anomalies in the last 7 days · colour = count
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-agentx-muted">
          <span>Less</span>
          {["#f1f5f9", "#86efac", "#fbbf24", "#f59e0b", "#dc2626"].map((c) => (
            <span key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </header>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="min-w-[720px] border-separate border-spacing-0.5">
          <thead>
            <tr>
              <th />
              {HOURS.map((h) => (
                <th key={h} className="text-[9px] text-agentx-muted font-normal pb-1">
                  {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="text-[10px] text-agentx-muted pr-2 text-right whitespace-nowrap">{day}</td>
                {HOURS.map((h) => {
                  const c = lookup(day, h);
                  return (
                    <td
                      key={h}
                      title={`${day} ${String(h).padStart(2, "0")}:00 — ${c} anomal${c === 1 ? "y" : "ies"}`}
                      className="w-[18px] h-[18px] rounded-sm cursor-pointer hover:ring-2 hover:ring-agentx-teal/40 transition"
                      style={{ background: cellColor(c, max) }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight footer */}
      <div className="mt-4 p-3 rounded-lg bg-agentx-purpleSoft/40 border border-agentx-purple/20 flex items-start gap-2">
        <span className="text-xs">💡</span>
        <p className="text-xs text-agentx-muted leading-relaxed">
          <span className="font-semibold text-agentx-text">Pattern detected:</span> The heaviest
          cluster is at <span className="font-mono">03:00</span> on weekdays — likely your nightly
          backup cron job. Weekend afternoons show a secondary cluster around 14:00–16:00.
        </p>
      </div>
    </section>
  );
}
