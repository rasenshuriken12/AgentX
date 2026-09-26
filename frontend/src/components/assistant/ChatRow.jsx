import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pin, Pencil, Share2, Trash2, MessageSquare } from "lucide-react";

export default function ChatRow({ chat, active, onSelect, onRename, onPin, onShare, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(chat.title);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const commitRename = () => {
    if (draft.trim()) onRename(chat.id, draft.trim());
    setRenaming(false);
  };

  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        active ? "bg-agentx-tealSoft/50 border border-agentx-teal/30" : "hover:bg-agentx-bg"
      }`}
    >
      <MessageSquare className="w-3.5 h-3.5 text-agentx-muted flex-shrink-0" />

      {renaming ? (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(false); }}
          autoFocus
          className="flex-1 min-w-0 text-xs bg-white border border-agentx-teal/40 rounded px-2 py-1 outline-none"
        />
      ) : (
        <button
          onClick={() => onSelect(chat.id)}
          className="flex-1 min-w-0 text-left"
        >
          <span className="block text-xs font-medium truncate">{chat.title}</span>
          <span className="block text-[10px] text-agentx-muted truncate">{chat.preview}</span>
        </button>
      )}

      {chat.pinned && <Pin className="w-3 h-3 text-agentx-teal flex-shrink-0" />}

      {/* 3-dot menu */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Chat options"
          className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-agentx-muted" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-7 w-40 bg-agentx-card border border-agentx-border rounded-lg shadow-lg z-40 overflow-hidden">
            <MenuItem icon={<Pencil className="w-3.5 h-3.5" />} label="Rename"
              onClick={() => { setMenuOpen(false); setRenaming(true); }} />
            <MenuItem icon={<Pin className="w-3.5 h-3.5" />} label={chat.pinned ? "Unpin" : "Pin"}
              onClick={() => { setMenuOpen(false); onPin(chat.id); }} />
            <MenuItem icon={<Share2 className="w-3.5 h-3.5" />} label="Share"
              onClick={() => { setMenuOpen(false); onShare(chat.id); }} />
            <MenuItem icon={<Trash2 className="w-3.5 h-3.5" />} label="Delete" danger
              onClick={() => { setMenuOpen(false); onDelete(chat.id); }} />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-agentx-bg transition ${
        danger ? "text-agentx-red" : "text-agentx-text"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
