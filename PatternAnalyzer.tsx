import { useMemo } from "react";

export default function PatternAnalyzer() {
  const logs = useMemo(() => {
    const saved = localStorage.getItem("sleepLogs");
    return saved ? JSON.parse(saved) : [];
  }, []);

  function toMins(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  const analysis = useMemo(() => {
    if (logs.length < 2) return null;
    const wakeTimes = logs.map((l: any) => toMins(l.wakeTime));
    const avg = wakeTimes.reduce((a: number, b: number) => a + b, 0) / wakeTimes.length;
    const variance = wakeTimes.map((t: number) => Math.abs(t - avg));
    const maxVar = Math.max(...variance);
    const consistent = maxVar < 30;
    const avgHr = Math.floor(avg / 60);
    const avgMin = Math.round(avg % 60).toString().padStart(2, "0");
    return { avg: `${avgHr}:${avgMin}`, maxVar: Math.round(maxVar), consistent };
  }, [logs]);

  return (
    <div style={card}>
      <h2 style={heading}>📊 Pattern Analyzer</h2>
      <p style={sub}>Detects irregular sleep-wake cycles</p>

      {logs.length < 2 ? (
        <p style={{ color: "#bbb" }}>Log at least 2 entries to see patterns.</p>
      ) : (
        <>
          <div style={statRow}>
            <StatBox label="Avg wake time" value={analysis!.avg} />
            <StatBox label="Max variation" value={`${analysis!.maxVar} min`} />
            <StatBox
              label="Consistency"
              value={analysis!.consistent ? "✅ Regular" : "⚠️ Irregular"}
              color={analysis!.consistent ? "#22c55e" : "#f59e0b"}
            />
          </div>
          {!analysis!.consistent ? (
            <div style={warnBox}>
              ⚠️ Your wake times vary by more than 30 minutes. Try to maintain a consistent schedule for better energy levels.
            </div>
          ) : (
            <div style={goodBox}>
              ✅ Great job! Your sleep schedule is consistent. Keep it up!
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: "#f9f9ff", borderRadius: 10, padding: "16px 20px", flex: 1, textAlign: "center" }}>
      <div style={{ color: "#888", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: "bold", color: color || "#6c47ff", marginTop: 4 }}>{value}</div>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #6c47ff11" };
const heading: React.CSSProperties = { color: "#6c47ff", marginBottom: 4 };
const sub: React.CSSProperties = { color: "#888", marginTop: 0, marginBottom: 16 };
const statRow: React.CSSProperties = { display: "flex", gap: 12, margin: "16px 0", flexWrap: "wrap" };
const warnBox: React.CSSProperties = { background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 10, padding: 14, color: "#92400e", marginTop: 12 };
const goodBox: React.CSSProperties = { background: "#f0fdf4", border: "1px solid #22c55e", borderRadius: 10, padding: 14, color: "#166534", marginTop: 12 };