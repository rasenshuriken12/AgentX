import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown, Check } from "lucide-react";
import { generateSeriesForRange, METRIC_OPTIONS, TIME_RANGES } from "../../data/historicalData";

export default function ExportMenu({ metric, range, compare }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  /* -------- CSV export -------- */
  const exportCSV = () => {
    setOpen(false);
    const meta = METRIC_OPTIONS.find((m) => m.id === metric) || METRIC_OPTIONS[0];
    const rmeta = TIME_RANGES.find((r) => r.id === range) || TIME_RANGES[0];
    const series = generateSeriesForRange(metric, range, 0, Date.now());

    const header = "timestamp_iso,epoch_ms,value,unit,metric,range\n";
    const body = series
      .map((pt) => {
        const iso = new Date(pt.t).toISOString();
        return `${iso},${pt.t},${pt.v},${meta.unit},${meta.id},${rmeta.id}`;
      })
      .join("\n");

    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentx_${metric}_${range}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    flash(`CSV downloaded (${series.length} rows)`);
  };

  /* -------- PDF export (print-to-PDF) -------- */
  const exportPDF = () => {
    setOpen(false);
    // Snapshot the main chart panel into a print stylesheet.
    const el = document.getElementById("agentx-historical-chart");
    if (!el) { flash("Chart not found"); return; }

    const w = window.open("", "_blank", "width=900,height=1100");
    if (!w) { flash("Popup blocked — allow popups"); return; }

    // Grab computed CSS from the page so Tailwind classes carry over
    const styles = Array.from(document.querySelectorAll("style, link[rel=stylesheet]"))
      .map((n) => n.outerHTML)
      .join("\n");

    w.document.write(`<!doctype html><html><head><title>AgentX Report</title>${styles}
      <style>
        body { font-family: Inter, sans-serif; padding: 24px; background: #fff; }
        .agentx-report-header { border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 16px; }
        .agentx-report-header h1 { font-size: 20px; margin: 0; }
        .agentx-report-header p { font-size: 12px; color: #64748b; margin: 4px 0 0; }
        button, .no-print { display: none !important; }
      </style>
    </head><body>
      <div class="agentx-report-header">
        <h1>AgentX — Historical Metric Report</h1>
        <p>Metric: <b>${metric}</b> · Range: <b>${range}</b> · Generated: ${new Date().toLocaleString()}</p>
      </div>
      ${el.outerHTML}
    </body></html>`);
    w.document.close();

    setTimeout(() => { w.focus(); w.print(); }, 500);
    flash("PDF print dialog opened");
  };

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 border border-agentx-border bg-agentx-card rounded-lg px-3 py-2 text-xs font-medium hover:border-agentx-teal/40 transition"
        >
          <Download className="w-3.5 h-3.5 text-agentx-muted" />
          Export
          <ChevronDown className={`w-3.5 h-3.5 text-agentx-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-agentx-card border border-agentx-border rounded-xl shadow-lg z-30 overflow-hidden">
            <ul className="py-1">
              <li>
                <button onClick={exportCSV}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-agentx-bg transition">
                  <FileSpreadsheet className="w-4 h-4 text-agentx-green" />
                  <span className="flex-1">
                    Download CSV
                    <span className="block text-[10px] text-agentx-muted">Raw data · {range}</span>
                  </span>
                </button>
              </li>
              <li>
                <button onClick={exportPDF}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-agentx-bg transition">
                  <FileText className="w-4 h-4 text-agentx-red" />
                  <span className="flex-1">
                    Download PDF
                    <span className="block text-[10px] text-agentx-muted">Formatted report</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-agentx-text text-white text-xs px-4 py-2 rounded-lg shadow-xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}
    </>
  );
}
