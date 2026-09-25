import { useEffect, useState } from "react";
import { metricCards, topStats } from "../data/mockData";

export function useLiveMetrics(intervalMs = 2000) {
  const [metrics, setMetrics] = useState(metricCards);
  const [stats, setStats] = useState(topStats);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setMetrics((prev) =>
        prev.map((m) => {
          const delta = (Math.random() - 0.5) * (m.unit === "%" ? 6 : 8);
          const next = Math.max(0, m.value + delta);
          return {
            ...m,
            value: Number(next.toFixed(1)),
            sparkline: [...m.sparkline.slice(1), { t: m.sparkline.length, v: next }],
            status:
              m.unit === "%" && next > 95 ? "CRITICAL" :
              m.unit === "%" && next > 85 ? "WARNING" : "HEALTHY",
          };
        })
      );
      if (Math.random() > 0.7) {
        setStats((s) => ({ ...s, anomalies24h: s.anomalies24h + 1 }));
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { metrics, stats, tick };
}
