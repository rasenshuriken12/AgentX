import { useState } from "react";
import { ArrowLeft, Languages, Palette, Type, Sparkles } from "lucide-react";

export default function GeneralSettings({ onBack }) {
  const [language, setLanguage]   = useState("English (US)");
  const [appearance, setAppearance] = useState("System");
  const [fontSize, setFontSize]   = useState("Medium");
  const [personalization, setPersonalization] = useState(true);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-agentx-border bg-agentx-card hover:bg-white text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">General</h1>
          <p className="text-xs text-agentx-muted mt-0.5">
            Language, appearance, and personalization preferences
          </p>
        </div>
      </div>

      {/* Settings card */}
      <div className="bg-agentx-card border border-agentx-border rounded-xl divide-y divide-agentx-border">
        <Row
          icon={<Languages className="w-4 h-4 text-agentx-teal" />}
          title="Language"
          subtitle="Preferred language for the interface"
        >
          <Select
            value={language}
            onChange={setLanguage}
            options={["English (US)", "English (UK)", "हिन्दी", "Español", "Français", "Deutsch", "日本語"]}
          />
        </Row>

        <Row
          icon={<Palette className="w-4 h-4 text-agentx-purple" />}
          title="Appearance"
          subtitle="Light, dark, or follow system"
        >
          <SegmentedControl
            value={appearance}
            onChange={setAppearance}
            options={["Light", "Dark", "System"]}
          />
        </Row>

        <Row
          icon={<Type className="w-4 h-4 text-agentx-blue" />}
          title="Font Size"
          subtitle="Adjust text size across the dashboard"
        >
          <SegmentedControl
            value={fontSize}
            onChange={setFontSize}
            options={["Small", "Medium", "Large"]}
          />
        </Row>

        <Row
          icon={<Sparkles className="w-4 h-4 text-agentx-yellow" />}
          title="Personalization"
          subtitle="Allow AgentX to tailor insights to your workflow"
        >
          <Toggle value={personalization} onChange={setPersonalization} />
        </Row>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Row({ icon, title, subtitle, children }) {
  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="w-9 h-9 rounded-lg bg-agentx-bg flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-agentx-muted mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm bg-agentx-bg border border-agentx-border rounded-lg px-3 py-2 outline-none focus:border-agentx-teal/50"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="flex bg-agentx-bg border border-agentx-border rounded-lg p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
            value === o
              ? "bg-white shadow-sm text-agentx-text"
              : "text-agentx-muted hover:text-agentx-text"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value}
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
