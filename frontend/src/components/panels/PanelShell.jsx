import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PanelShell({ title, subtitle, icon, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-agentx-card border border-agentx-border rounded-xl overflow-hidden">
      <header
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none"
      >
        <span className="w-9 h-9 rounded-lg bg-agentx-bg flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate">{title}</h3>
          {subtitle && <p className="text-xs text-agentx-muted mt-0.5 truncate">{subtitle}</p>}
        </div>
        {badge}
        <ChevronDown
          className={`w-4 h-4 text-agentx-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </header>
      {open && <div className="px-5 pb-5">{children}</div>}
    </section>
  );
}
