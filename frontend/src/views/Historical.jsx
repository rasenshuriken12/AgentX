import HistoricalChart from "../components/cards/HistoricalChart";
import AnomalyDonut from "../components/cards/AnomalyDonut";

export default function Historical() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <HistoricalChart />
      </div>
      <AnomalyDonut />
    </div>
  );
}