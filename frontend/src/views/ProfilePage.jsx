import { useState } from "react";
import { ArrowLeft, Cpu, HardDrive } from "lucide-react";
import { profileInfo } from "../data/mockData";

export default function ProfilePage({ onBack }) {
  const [tab, setTab] = useState("software");

  return (
    <div className="space-y-5">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-agentx-border bg-agentx-card hover:bg-white text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">{profileInfo.hostname}</h1>
          <p className="text-xs text-agentx-muted mt-0.5">
            System details for this machine
          </p>
        </div>
      </div>

      {/* Tab switch */}
      <div className="flex gap-1 bg-agentx-card border border-agentx-border rounded-full p-1 w-fit">
        <SwitchBtn
          active={tab === "software"}
          onClick={() => setTab("software")}
          icon={<Cpu className="w-4 h-4" />}
          label="Software"
        />
        <SwitchBtn
          active={tab === "hardware"}
          onClick={() => setTab("hardware")}
          icon={<HardDrive className="w-4 h-4" />}
          label="Hardware"
        />
      </div>

      {/* Info card */}
      <div className="bg-agentx-card border border-agentx-border rounded-xl p-6">
        {tab === "software" ? (
          <InfoList
            title="Software Information"
            items={[
              ["OS Name",         profileInfo.software.osName],
              ["OS Type",         profileInfo.software.osType],
              ["GNOME Version",   profileInfo.software.gnomeVersion],
              ["Windowing System",profileInfo.software.windowingSystem],
              ["Kernel Version",  profileInfo.software.kernelVersion],
            ]}
          />
        ) : (
          <InfoList
            title="Hardware Information"
            items={[
              ["Hardware Model",  profileInfo.hardware.hardwareModel],
              ["Memory",          profileInfo.hardware.memory],
              ["Processor",       profileInfo.hardware.processor],
              ["Graphics",        profileInfo.hardware.graphics],
              ["Disk Capacity",   profileInfo.hardware.diskCapacity],
            ]}
          />
        )}
      </div>
    </div>
  );
}

function SwitchBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-white shadow-sm border border-agentx-border text-agentx-text"
          : "text-agentx-muted hover:text-agentx-text"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoList({ title, items }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="divide-y divide-agentx-border">
        {items.map(([k, v]) => (
          <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3">
            <span className="text-sm font-semibold text-agentx-muted">{k}</span>
            <span className="md:col-span-2 text-sm">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
