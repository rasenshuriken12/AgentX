import { useState } from "react";
import { Mail, X, Check, Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, h) => h);

export default function DigestModal({ open, onClose }) {
  const [enabled, setEnabled] = useState(true);
  const [email, setEmail] = useState("deviprasad@example.com");
  const [day, setDay] = useState("Monday");
  const [hour, setHour] = useState(9);
  const [include, setInclude] = useState({
    anomalies: true,
    peaks: true,
    trends: true,
    topProcesses: true,
  });
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const toggleInclude = (key) =>
    setInclude((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-agentx-card border border-agentx-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-agentx-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-agentx-tealSoft flex items-center justify-center">
              <Mail className="w-4 h-4 text-agentx-teal" />
            </div>
            <div>
              <h2 className="font-bold">Weekly email digest</h2>
              <p className="text-xs text-agentx-muted mt-0.5">
                Auto-generated summary of anomalies, peaks, and trends
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-agentx-bg">
            <X className="w-4 h-4 text-agentx-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Enable toggle */}
          <Row label="Enable weekly digest" subtitle="Turn off to stop all emails">
            <Toggle value={enabled} onChange={setEnabled} />
          </Row>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-agentx-muted uppercase tracking-wider">
              Deliver to
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!enabled}
              className="w-full mt-2 text-sm bg-agentx-bg border border-agentx-border rounded-lg px-3 py-2 outline-none focus:border-agentx-teal/50 disabled:opacity-50"
            />
          </div>

          {/* Schedule */}
          <div>
            <label className="text-xs font-semibold text-agentx-muted uppercase tracking-wider">
              Schedule
            </label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                disabled={!enabled}
                className="text-sm bg-agentx-bg border border-agentx-border rounded-lg px-3 py-2 outline-none disabled:opacity-50"
              >
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                disabled={!enabled}
                className="text-sm bg-agentx-bg border border-agentx-border rounded-lg px-3 py-2 outline-none disabled:opacity-50"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-agentx-muted mt-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Sent every {day} at {String(hour).padStart(2, "0")}:00 (local time)
            </p>
          </div>

          {/* Include in digest */}
          <div>
            <label className="text-xs font-semibold text-agentx-muted uppercase tracking-wider">
              Include in digest
            </label>
            <div className="mt-2 space-y-1">
              <CheckRow label="Top anomalies (10)"      checked={include.anomalies}     onChange={() => toggleInclude("anomalies")}     disabled={!enabled} />
              <CheckRow label="Peak CPU / RAM / Disk"   checked={include.peaks}         onChange={() => toggleInclude("peaks")}         disabled={!enabled} />
              <CheckRow label="Trends vs. last week"    checked={include.trends}        onChange={() => toggleInclude("trends")}        disabled={!enabled} />
              <CheckRow label="Top processes by usage"  checked={include.topProcesses}  onChange={() => toggleInclude("topProcesses")}  disabled={!enabled} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-agentx-border flex items-center justify-between gap-3 bg-agentx-bg">
          <p className="text-[11px] text-agentx-muted">
            You can unsubscribe anytime from any digest email.
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-agentx-border hover:bg-white transition">
              Cancel
            </button>
            <button onClick={handleSave}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-agentx-teal text-white hover:bg-agentx-teal/90 transition flex items-center gap-1.5">
              {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : "Save schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, subtitle, children }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {subtitle && <p className="text-xs text-agentx-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        value ? "bg-agentx-teal" : "bg-agentx-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function CheckRow({ label, checked, onChange, disabled }) {
  return (
    <label className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-agentx-bg cursor-pointer transition ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-agentx-teal"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
