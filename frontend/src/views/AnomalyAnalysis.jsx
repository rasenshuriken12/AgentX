import AnomalyFeed from "../components/cards/AnomalyFeed";
import DiagnosisReports from "../components/cards/DiagnosisReports";
import AIAssistant from "../components/assistant/AIAssistant";
import { anomalies, aiReports } from "../data/mockData";

export default function AnomalyAnalysis() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnomalyFeed anomalies={anomalies} count={anomalies.length} />
        <DiagnosisReports reports={aiReports} onRefresh={() => {}} />
      </div>
      <AIAssistant />
    </>
  );
}
