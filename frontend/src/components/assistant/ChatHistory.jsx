import { Search, Plus } from "lucide-react";
import ChatRow from "./ChatRow";

export default function ChatHistory({ chats, activeId, onSelect, onNew, onRename, onPin, onShare, onDelete }) {
  const pinned = chats.filter((c) => c.pinned);
  const recent = chats.filter((c) => !c.pinned);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3">
      <button
        onClick={onNew}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 rounded-lg border border-dashed border-agentx-border text-xs font-semibold text-agentx-muted hover:border-agentx-teal/40 hover:text-agentx-teal transition"
      >
        <Plus className="w-3.5 h-3.5" /> New chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-agentx-bg border border-agentx-border">
        <Search className="w-3.5 h-3.5 text-agentx-muted" />
        <input
          placeholder="Search chats..."
          className="flex-1 bg-transparent text-xs outline-none"
        />
      </div>

      {pinned.length > 0 && (
        <>
          <GroupLabel>Pinned</GroupLabel>
          <div className="space-y-1 mb-3">
            {pinned.map((c) => (
              <ChatRow key={c.id} chat={c} active={activeId === c.id} onSelect={onSelect}
                onRename={onRename} onPin={onPin} onShare={onShare} onDelete={onDelete} />
            ))}
          </div>
        </>
      )}

      <GroupLabel>Recent</GroupLabel>
      <div className="space-y-1">
        {recent.map((c) => (
          <ChatRow key={c.id} chat={c} active={activeId === c.id} onSelect={onSelect}
            onRename={onRename} onPin={onPin} onShare={onShare} onDelete={onDelete} />
        ))}
        {recent.length === 0 && (
          <p className="text-[11px] text-agentx-muted px-3 py-2">No recent chats</p>
        )}
      </div>
    </div>
  );
}

function GroupLabel({ children }) {
  return (
    <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-agentx-muted">
      {children}
    </p>
  );
}
