import { useState, useMemo } from "react";

export default function AlarmScheduler() {
  const [cycles, setCycles] = useState(5);

  const logs = useMemo(() => {
    const saved = localStorage.getItem("sleepLogs");
    return saved ? JSON.parse(saved) : [];
  }, []);

  function toMins(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function toTime(mins: number) {
    const total = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(total / 60).toString().padStart(2, "0");
    const m = Math.round(total % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  const recommendation = useMemo(() => {
    if (logs.length === 0) return null;
    const avgWake =
      logs.map((l: any) => toMins(l.wakeTime)).reduce((a: number, b: number) => a + b, 0) /
      logs.length;
    const options = [];
    for (let i = cycles - 1; i <= cycles + 1; i++) {
      options.push({ c: i, time: toTime(avgWake - i * 90) });
    }
    return { bedtime: options[1].time, options, avgWake: toTime(avgWake) };
  }, [logs, cycles]);

  return (
    <div style={card}>
      <h2 style={heading}>⏰ Alarm Scheduler</h2>
      <p style={sub}>Best bedtime based on 90-min sleep cycles</p>

      <label style={{ fontSize: 14, color: "#555" }}>
        Sleep cycles: <strong style={{ color: "#6c47ff" }}>{cycles}</strong>
      </label>
      <input
        type="range"
        min={3}
        max={7}
        value={cycles}
        onChange={(e) => setCycles(Number(e.target.value))}
        style={{ width: "100%", margin: "8px 0 20px", accentColor: "#6c47ff" }}
      />

      {!recommendation ? (
        <p style={{ color: "#bbb" }}>No logs found. Add sleep logs first.</p>
      ) : (
        <>
          <div style={highlight}>
            <div style={{ fontSize: 13, color: "#6c47ff" }}>
              Recommended bedtime for {cycles} cycles
            </div>
            <div style={{ fontSize: 40, fontWeight: "bold", color: "#6c47ff", margin: "8px 0" }}>
              {recommendation.bedtime}
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>
              To wake at your average: {recommendation.avgWake}
            </div>
          </div>

          <h3 style={{ color: "#444" }}>Other options</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {recommendation.options.map((o, i) => (
              <div key={i} style={optionBox}>
                <div style={{ fontSize: 11, color: "#888" }}>{o.c} cycles</div>
                <div style={{ fontSize: 22, fontWeight: "bold", color: "#6c47ff" }}>{o.time}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{o.c * 1.5}h sleep</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #6c47ff11" };
const heading: React.CSSProperties = { color: "#6c47ff", marginBottom: 4 };
const sub: React.CSSProperties = { color: "#888", marginTop: 0, marginBottom: 16 };
const highlight: React.CSSProperties = { background: "#f0eeff", borderRadius: 12, padding: 20, textAlign: "center", margin: "16px 0" };
const optionBox: React.CSSProperties = { background: "#f9f9ff", borderRadius: 10, padding: "12px 20px", textAlign: "center", flex: 1, minWidth: 80 };