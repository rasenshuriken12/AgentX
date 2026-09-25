import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export default function HealthGauge({ score = 82 }) {
  // score 0-100 → status
  let status, color, bg, Icon, message;
  if (score >= 80) {
    status = "Healthy"; color = "text-agentx-green"; bg = "bg-agentx-greenSoft";
    Icon = ShieldCheck; message = "All systems nominal";
  } else if (score >= 55) {
    status = "Warning"; color = "text-agentx-yellow"; bg = "bg-agentx-yellowSoft";
    Icon = ShieldAlert; message = "Some metrics need attention";
  } else {
    status = "Critical"; color = "text-agentx-red"; bg = "bg-agentx-redSoft";
    Icon = ShieldX; message = "Immediate action recommended";
  }

  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5 flex items-center gap-5">
      {/* Circular score */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="50" cy="50" r="42"
            stroke={score >= 80 ? "#16a34a" : score >= 55 ? "#f59e0b" : "#dc2626"}
            strokeWidth="8" fill="none" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 264} 264`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-[10px] text-agentx-muted uppercase tracking-wider">Score</span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} ${color} text-sm font-bold mb-2`}>
          <Icon className="w-4 h-4" />
          {status}
        </div>
        <p className="text-sm text-agentx-muted">{message}</p>
      </div>
    </div>
  );
}