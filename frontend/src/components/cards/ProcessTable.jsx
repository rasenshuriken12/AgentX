import { Search } from "lucide-react";

export default function ProcessTable({ processes }) {
  return (
    <div className="bg-agentx-card border border-agentx-border rounded-xl">
      <div className="p-5 border-b border-agentx-border flex items-center justify-between">
        <div>
          <h2 className="font-bold">Top Processes</h2>
          <p className="text-xs text-agentx-muted mt-1">
            Sorted by CPU usage · updates every 2s
          </p>
        </div>
        <div className="flex items-center gap-2 border border-agentx-border rounded-md px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-agentx-muted" />
          <input
            placeholder="Filter..."
            className="text-xs outline-none bg-transparent w-32"
          />
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-agentx-muted border-b border-agentx-border">
            <th className="text-left px-5 py-2 font-medium">PID</th>
            <th className="text-left px-3 py-2 font-medium">Name</th>
            <th className="text-left px-3 py-2 font-medium">User</th>
            <th className="text-right px-3 py-2 font-medium">CPU %</th>
            <th className="text-right px-3 py-2 font-medium">MEM %</th>
            <th className="text-center px-5 py-2 font-medium">State</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.pid} className="border-b border-agentx-border last:border-0 hover:bg-agentx-bg/60">
              <td className="px-5 py-2.5 font-mono text-xs">{p.pid}</td>
              <td className="px-3 py-2.5 font-medium">{p.name}</td>
              <td className="px-3 py-2.5 text-agentx-muted">{p.user}</td>
              <td className="px-3 py-2.5 text-right font-mono">{p.cpu.toFixed(1)}</td>
              <td className="px-3 py-2.5 text-right font-mono">{p.mem.toFixed(1)}</td>
              <td className="px-5 py-2.5 text-center">
                <span className="inline-block w-5 h-5 rounded bg-agentx-bg text-[10px] font-bold leading-5">
                  {p.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}