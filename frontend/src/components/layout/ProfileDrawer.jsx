import {
  X, User, Shield, Database, Sliders, Bell, Mic, Cpu, HardDrive,
  HelpCircle, Bug, FileText, Lock, Info, ChevronRight
} from "lucide-react";

export default function ProfileDrawer({ open, onClose, onSelect }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[60] transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[380px] max-w-full bg-agentx-bg z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-agentx-border bg-agentx-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-agentx-tealSoft border border-agentx-teal/30 flex items-center justify-center">
              <User className="w-5 h-5 text-agentx-teal" />
            </div>
            <div>
              <p className="text-sm font-bold">deviprasad-shetty</p>
              <p className="text-xs text-agentx-muted">deviprasad-shetty-HP-Notebook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full hover:bg-agentx-bg flex items-center justify-center"
          >
            <X className="w-4 h-4 text-agentx-muted" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <Section title="Account">
            <Item icon={<User />} label="Profile"            sub="System details"   onClick={() => onSelect("profile")} />
            <Item icon={<Shield />} label="Security"         sub="Password, 2FA"    onClick={() => onSelect("security")} />
            <Item icon={<Database />} label="Data Controls"  sub="Export, delete"   onClick={() => onSelect("data-controls")} />
          </Section>

          <Section title="AgentX">
            <Item icon={<Sliders />}  label="General"        sub="Language, Appearance" onClick={() => onSelect("general")} />
            <Item icon={<Bell />}     label="Notifications"                          onClick={() => onSelect("notifications")} />
            <Item icon={<Mic />}      label="Voice"                                  onClick={() => onSelect("voice")} />
            <Item icon={<Cpu />}      label="Model"          sub="Ollama, Gemma 3"  onClick={() => onSelect("model")} />
            <Item icon={<HardDrive />} label="Storage"       sub="Local cache"      onClick={() => onSelect("storage")} />
          </Section>

          <Section title="About">
            <Item icon={<HelpCircle />} label="Help Center"                     onClick={() => onSelect("help")} />
            <Item icon={<Bug />}        label="Report Bug"                      onClick={() => onSelect("bug")} />
            <Item icon={<FileText />}   label="Terms of Use"                    onClick={() => onSelect("terms")} />
            <Item icon={<Lock />}       label="Privacy Policy"                  onClick={() => onSelect("privacy")} />
            <Item icon={<Info />}       label="Version"        sub="v0.1.0"       onClick={() => onSelect("version")} />
          </Section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-agentx-border text-[10px] text-agentx-muted text-center bg-agentx-card">
          AgentX · Hybrid edge detection · cloud LLM root-cause analysis
        </div>
      </aside>
    </>
  );
}

/* ---------- Sub-components ---------- */

function Section({ title, children }) {
  return (
    <div>
      <p className="px-3 mb-2 text-xs font-semibold text-agentx-muted uppercase tracking-wider">
        {title}
      </p>
      <div className="bg-agentx-card border border-agentx-border rounded-2xl overflow-hidden divide-y divide-agentx-border">
        {children}
      </div>
    </div>
  );
}

function Item({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-agentx-bg text-left transition-colors"
    >
      <span className="w-9 h-9 rounded-lg bg-agentx-bg flex items-center justify-center flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-agentx-muted">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-agentx-text truncate">{label}</span>
        {sub && <span className="block text-xs text-agentx-muted truncate">{sub}</span>}
      </span>
      <ChevronRight className="w-4 h-4 text-agentx-muted flex-shrink-0" />
    </button>
  );
}
