import { useState } from "react";

export default function Logger() {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [logs, setLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem("sleepLogs");
    return saved ? JSON.parse(saved) : [];
  });

  function calcDuration(sleep: string, wake: string) {
    const [sh, sm] = sleep.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let mins = wh * 60 + wm - (sh * 60 + sm);
    if (mins < 0) mins += 1440;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  const handleLog = () => {
    if (!sleepTime || !wakeTime) return alert("Please enter both times!");
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      sleepTime,
      wakeTime,
      duration: calcDuration(sleepTime, wakeTime),
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("sleepLogs", JSON.stringify(updated));
    setSleepTime("");
    setWakeTime("");
  };

  const handleDelete = (id: number) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem("sleepLogs", JSON.stringify(updated));
  };

  return (
    <div style={card}>
      <h2 style={heading}>📝 Sleep-Wake Logger</h2>
      <p style={sub}>Log your daily sleep and wake times</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>🌙 Sleep Time</label><br />
          <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} style={input} />
        </div>
        <div>
          <label style={labelStyle}>☀️ Wake Time</label><br />
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={input} />
        </div>
      </div>

      <button onClick={handleLog} style={btn}>+ Log Sleep</button>

      <hr style={{ margin: "20px 0", borderColor: "#f0f0f0" }} />
      <h3 style={{ color: "#444" }}>Recent Logs</h3>
      {logs.length === 0 && <p style={{ color: "#bbb" }}>No logs yet. Start tracking!</p>}
      {logs.map((log) => (
        <div key={log.id} style={logItem}>
          <div>
            <strong>{log.date}</strong>
            <span style={{ color: "#888", marginLeft: 8, fontSize: 13 }}>
              🌙 {log.sleepTime} → ☀️ {log.wakeTime}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={badge}>{log.duration}</span>
            <button onClick={() => handleDelete(log.id)} style={deleteBtn}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #6c47ff11" };
const heading: React.CSSProperties = { color: "#6c47ff", marginBottom: 4 };
const sub: React.CSSProperties = { color: "#888", marginTop: 0, marginBottom: 16 };
const labelStyle: React.CSSProperties = { fontSize: 13, color: "#555" };
const input: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, marginTop: 4 };
const btn: React.CSSProperties = { background: "#6c47ff", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 15 };
const logItem: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5" };
const badge: React.CSSProperties = { background: "#f0eeff", color: "#6c47ff", borderRadius: 12, padding: "4px 10px", fontSize: 13 };
const deleteBtn: React.CSSProperties = { background: "none", border: "none", color: "#f44", cursor: "pointer", fontSize: 16 };