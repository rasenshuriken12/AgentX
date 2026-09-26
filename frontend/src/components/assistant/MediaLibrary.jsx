import { FileText, Image as ImageIcon, FileCode, Download } from "lucide-react";

const SAMPLE_MEDIA = [
  { id: 1, type: "image", name: "cpu_spike.png",       meta: "PNG · 240 KB" },
  { id: 2, type: "doc",   name: "root_cause_report.md",meta: "MD  · 12 KB"  },
  { id: 3, type: "code",  name: "ewma_config.json",    meta: "JSON · 3 KB"  },
  { id: 4, type: "image", name: "thermal_graph.png",   meta: "PNG · 180 KB" },
  { id: 5, type: "doc",   name: "diagnostic_full.pdf", meta: "PDF · 890 KB" },
];

const ICON_FOR = { image: ImageIcon, doc: FileText, code: FileCode };

export default function MediaLibrary() {
  return (
    <div className="px-4 pt-3 pb-2 border-b border-agentx-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-agentx-muted">
          Library
        </p>
        <span className="text-[10px] text-agentx-muted">{SAMPLE_MEDIA.length} items</span>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {SAMPLE_MEDIA.map((m) => {
          const Icon = ICON_FOR[m.type] || FileText;
          return (
            <div
              key={m.id}
              className="flex-shrink-0 w-32 bg-agentx-bg border border-agentx-border rounded-lg p-2 hover:border-agentx-teal/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-4 h-4 text-agentx-teal" />
                <Download className="w-3 h-3 text-agentx-muted" />
              </div>
              <p className="text-[11px] font-medium truncate">{m.name}</p>
              <p className="text-[10px] text-agentx-muted truncate">{m.meta}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
