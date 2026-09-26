import { Search } from "lucide-react";

export default function ProcessTable({ processes, scrollable = false, maxHeight = 420 }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl">
      <div className="p-5 border-b border-agentx-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold">Top Processes</h2>
          <p className="text-xs text-agentx-muted mt-1">
            {scrollable
              ? `Showing ${processes.length} processes · scroll to explore`
              : "Sorted by CPU usage · updates every 2s"}
          </p>
        </div>
        <div className="flex items-center gap-2 border border-agentx-border rounded-md px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-agentx-muted" />
          <input placeholder="Filter..." className="text-xs outline-none bg-transparent w-32" />
        </div>
      </div>

      {/* Single table — widths are locked via colgroup so header & body align */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px] table-fixed">
          <colgroup>
            <col style={{ width: "90px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "70px" }} />
          </colgroup>
          <thead>
            <tr className="text-xs text-agentx-muted border-b border-agentx-border">
              <th className="text-left  px-5 py-2 font-medium">PID</th>
              <th className="text-left  px-3 py-2 font-medium">Name</th>
              <th className="text-left  px-3 py-2 font-medium">User</th>
              <th className="text-right px-3 py-2 font-medium">CPU %</th>
              <th className="text-right px-3 py-2 font-medium">MEM %</th>
              <th className="text-center px-3 py-2 font-medium">State</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable body wrapper — table continues below with same colgroup */}
      <div
        className="overflow-x-auto overflow-y-auto no-scrollbar"
        style={{ maxHeight: scrollable ? `${maxHeight}px` : "400px" }}
      >
        <table className="w-full text-sm min-w-[640px] table-fixed">
          <colgroup>
            <col style={{ width: "90px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "70px" }} />
          </colgroup>
          <tbody>
            {processes.map((p) => (
              <tr key={p.pid} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
                <td className="px-5 py-2.5 font-mono text-xs">{p.pid}</td>
                <td className="px-3 py-2.5 font-medium truncate">{p.name}</td>
                <td className="px-3 py-2.5 text-agentx-muted truncate">{p.user}</td>
                <td className="px-3 py-2.5 text-right font-mono">{p.cpu.toFixed(1)}</td>
                <td className="px-3 py-2.5 text-right font-mono">{p.mem.toFixed(1)}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className="inline-block w-5 h-5 rounded bg-agentx-bg text-[10px] font-bold leading-5">
                    {p.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
