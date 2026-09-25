import ProcessTable from "../components/cards/ProcessTable";
import AnomalyDonut from "../components/cards/AnomalyDonut";
import { topProcesses } from "../data/mockData";

export default function SystemOverview() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ProcessTable processes={topProcesses} />
        </div>
        <AnomalyDonut />
      </div>
    </div>
  );
}
