import CPUPanel     from "../components/panels/CPUPanel";
import GPUPanel     from "../components/panels/GPUPanel";
import MemoryPanel  from "../components/panels/MemoryPanel";
import TempPanel    from "../components/panels/TempPanel";
import DiskPanel    from "../components/panels/DiskPanel";
import NetworkPanel from "../components/panels/NetworkPanel";
import ProcessTable from "../components/cards/ProcessTable";
import { topProcesses } from "../data/mockData";

export default function SystemOverview() {
  return (
    <div className="space-y-5">
      <CPUPanel />
      <GPUPanel />
      <MemoryPanel />
      <TempPanel />
      <DiskPanel />
      <NetworkPanel />

      {/* Processes — scrollable inside a fixed-height box */}
      <ProcessTable processes={topProcesses} scrollable maxHeight={520} />
    </div>
  );
}
