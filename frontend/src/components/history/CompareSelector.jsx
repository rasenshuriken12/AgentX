import { useState, useRef, useEffect } from "react";
import { ChevronDown, GitCompare, Check } from "lucide-react";

const OPTIONS = [
  { id: "off",           label: "Off" },
  { id: "prev",          label: "Previous period" },
  { id: "yesterday",     label: "Yesterday" },
  { id: "last_week",     label: "Last week" },
  { id: "last_month",    label: "Last month" },
  { id: "before_update", label: "Before update" },
];

export default function CompareSelector({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = OPTIONS.find((c) => c.id === value) || OPTIONS[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-2 border border-agentx-border rounded-lg px-3 py-2 text-xs font-medium transition min-w-[180px] ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-agentx-bg"
            : "bg-agentx-card hover:border-agentx-teal/40"
        }`}
      >
        <span className="flex items-center gap-2">
          <GitCompare className="w-3.5 h-3.5 text-agentx-muted" />
          Compare: <span className="font-semibold">{selected.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-agentx-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute right-0 mt-2 w-60 bg-agentx-card border border-agentx-border rounded-xl shadow-lg z-30 overflow-hidden">
          <ul className="py-1">
            {OPTIONS.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <li key={opt.id}>
                  <button
                    onClick={() => { onChange(opt.id); setOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-agentx-bg transition ${
                      isSelected ? "bg-agentx-bg font-semibold" : ""
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-agentx-teal" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
