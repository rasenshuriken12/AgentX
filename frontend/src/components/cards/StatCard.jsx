export default function StatCard({ icon, iconColor, label, value, sub, footer }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl p-5 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-agentx-muted">
          {label}
        </span>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="mt-2">
        {value}
        {sub}
      </div>
      {footer && <div className="text-xs text-agentx-muted mt-1">{footer}</div>}
    </div>
  );
}