import { useState } from "react";
import {
  Sparkles, Send, X, History, MessageSquarePlus, ChevronLeft,
} from "lucide-react";
import MediaLibrary from "./MediaLibrary";
import ChatHistory from "./ChatHistory";

const INITIAL_CHATS = [
  { id: "c1", title: "CPU spike at 14:32",       preview: "Root cause: Chrome renderer storm", pinned: true,  messages: [] },
  { id: "c2", title: "Swap thrashing diagnosis", preview: "Recommended: reduce Chrome tabs",    pinned: false, messages: [] },
  { id: "c3", title: "Disk I/O below baseline",  preview: "IQR anomaly, no action needed",      pinned: false, messages: [] },
];

const SUGGESTIONS = [
  { icon: "🔥", title: "Why is my CPU at 60%?", subtitle: "Analyze current processes" },
  { icon: "🧠", title: "Any memory leaks?",     subtitle: "Scan per-process RSS trends" },
  { icon: "🌐", title: "Unusual network activity?", subtitle: "Check for suspicious connections" },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("home");  // "home" | "history"
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");

  /* ---------- Chat actions ---------- */
  const newChat = () => {
    const id = `c${Date.now()}`;
    setChats((cs) => [{ id, title: "New chat", preview: "Start typing…", pinned: false, messages: [] }, ...cs]);
    setActiveChatId(id);
    setView("home");
  };
  const renameChat = (id, title) => setChats((cs) => cs.map((c) => c.id === id ? { ...c, title } : c));
  const pinChat    = (id) => setChats((cs) => cs.map((c) => c.id === id ? { ...c, pinned: !c.pinned } : c));
  const shareChat  = (id) => alert(`Share link copied for chat ${id}`);   // placeholder
  const deleteChat = (id) => setChats((cs) => cs.filter((c) => c.id !== id));

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full bg-agentx-teal shadow-lg shadow-agentx-teal/30 flex items-center justify-center hover:scale-105 transition"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[80] w-[400px] max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-48px)] bg-agentx-card border border-agentx-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-agentx-teal text-white">
            <div className="flex items-center gap-2">
              {view === "history" ? (
                <button onClick={() => setView("home")} className="p-1 rounded hover:bg-white/20">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <div>
                <p className="text-sm font-bold leading-none">
                  {view === "history" ? "Chat history" : "AgentX Assistant"}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5">
                  {view === "history" ? `${chats.length} chats` : "Ask about your system"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {view === "home" && (
                <button onClick={() => setView("history")} title="Chat history"
                  className="p-1.5 rounded hover:bg-white/20">
                  <History className="w-4 h-4" />
                </button>
              )}
              {view === "home" && (
                <button onClick={newChat} title="New chat"
                  className="p-1.5 rounded hover:bg-white/20">
                  <MessageSquarePlus className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} title="Close"
                className="p-1.5 rounded hover:bg-white/20">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {view === "history" ? (
            <>
              <MediaLibrary />
              <ChatHistory
                chats={chats}
                activeId={activeChatId}
                onSelect={(id) => { setActiveChatId(id); setView("home"); }}
                onNew={newChat}
                onRename={renameChat}
                onPin={pinChat}
                onShare={shareChat}
                onDelete={deleteChat}
              />
            </>
          ) : (
            <ChatHome activeChat={chats.find((c) => c.id === activeChatId)} />
          )}

          {/* Input */}
          <div className="border-t border-agentx-border p-3">
            <div className="flex items-end gap-2 bg-agentx-bg border border-agentx-border rounded-xl p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) { setInput(""); }
                  }
                }}
                rows={1}
                placeholder="Ask anything about your PC…"
                className="flex-1 bg-transparent text-sm outline-none resize-none max-h-24 py-1"
              />
              <button
                onClick={() => setInput("")}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-agentx-teal text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- Home view ---------------- */

function ChatHome({ activeChat }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {/* Greeting */}
      <div className="mb-5">
        <p className="text-lg font-bold">Hi deviprasad 👋</p>
        <p className="text-xs text-agentx-muted mt-1">
          I'm your on-device AI assistant. I've been watching your system metrics and can
          explain what's happening, diagnose anomalies, and suggest fixes.
        </p>
      </div>

      {activeChat && (
        <div className="mb-4 p-3 rounded-lg bg-agentx-bg border border-agentx-border">
          <p className="text-[10px] uppercase tracking-wider text-agentx-muted">Active chat</p>
          <p className="text-sm font-semibold mt-0.5">{activeChat.title}</p>
        </div>
      )}

      {/* Suggestions */}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-agentx-muted mb-2">
        Suggested for you
      </p>
      <div className="space-y-2 mb-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            className="w-full flex items-start gap-3 p-3 rounded-xl bg-agentx-bg border border-agentx-border hover:border-agentx-teal/40 hover:bg-white transition text-left"
          >
            <span className="text-lg flex-shrink-0">{s.icon}</span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold truncate">{s.title}</span>
              <span className="block text-[11px] text-agentx-muted truncate">{s.subtitle}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-agentx-muted text-center mt-6">
        Powered by local LLM · your data never leaves this device
      </p>
    </div>
  );
}
