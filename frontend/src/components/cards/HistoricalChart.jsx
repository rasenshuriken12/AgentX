import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { RefreshCw, ChevronDown } from "lucide-react";
import { historicalSeries } from "../../data/mockData";

export default function HistoricalChart() {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold">Historical Metric Trend</h2>
          <p className="text-xs text-agentx-muted mt-1">
            Pulled from the cloud DB · last 600 samples
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-agentx-border rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-agentx-bg transition">
            CPU Usage <ChevronDown className="w-3 h-3" />
          </button>
          <button className="p-2 rounded-md border border-agentx-border hover:bg-agentx-bg transition">
            <RefreshCw className="w-3.5 h-3.5 text-agentx-muted" />
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={historicalSeries}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Line type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}