import {
  LineChart, Line, ResponsiveContainer, YAxis, Tooltip, ReferenceArea, ReferenceDot,
} from "recharts";

export default function MiniLineChart({ data, color = "#0d9488", max = 100, anomalies = [] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <YAxis
          domain={[0, max]}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <ReferenceArea y1={0} y2={max * 0.75} fill="#dcfce7" fillOpacity={0.3} />
        <ReferenceArea y1={max * 0.75} y2={max} fill="#fef3c7" fillOpacity={0.3} />
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        {anomalies.map((a, i) => (
          <ReferenceDot key={i} x={a.t} y={a.v} r={4} fill="#dc2626" stroke="white" strokeWidth={2} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
