import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export default function SleepHistory() {
  const logs = useMemo(() => {
    const saved = localStorage.getItem('sleepLogs');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const data = useMemo(() => {
    return [...logs]
      .reverse()
      .slice(0, 7)
      .map((log: any) => {
        const [sh, sm] = log.sleepTime.split(':').map(Number);
        const [wh, wm] = log.wakeTime.split(':').map(Number);
        let mins = wh * 60 + wm - (sh * 60 + sm);
        if (mins < 0) mins += 1440;
        return { date: log.date, hours: parseFloat((mins / 60).toFixed(1)) };
      });
  }, [logs]);

  const avg = data.length
    ? (data.reduce((a, b) => a + b.hours, 0) / data.length).toFixed(1)
    : 0;

  return (
    <div style={card}>
      <h2 style={heading}>📈 Sleep History</h2>
      <p style={sub}>Your sleep consistency over the last 7 days</p>

      {data.length === 0 ? (
        <p style={{ color: '#bbb' }}>
          No history yet. Log some sleep entries first!
        </p>
      ) : (
        <>
          <div style={statRow}>
            <StatBox label="Total entries" value={String(logs.length)} />
            <StatBox label="Avg sleep" value={`${avg}h`} />
            <StatBox label="Goal" value="8h" color="#22c55e" />
          </div>
          <h3 style={{ color: '#444' }}>Sleep duration (hours)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}h`, 'Sleep']} />
              <ReferenceLine
                y={8}
                stroke="#22c55e"
                strokeDasharray="4 2"
                label={{
                  value: '8h goal',
                  fontSize: 11,
                  fill: '#22c55e',
                  position: 'right',
                }}
              />
              <Bar dataKey="hours" fill="#6c47ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: '#f9f9ff',
        borderRadius: 10,
        padding: '14px 20px',
        flex: 1,
        textAlign: 'center',
      }}
    >
      <div style={{ color: '#888', fontSize: 13 }}>{label}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: color || '#6c47ff',
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 16px #6c47ff11',
};
const heading: React.CSSProperties = { color: '#6c47ff', marginBottom: 4 };
const sub: React.CSSProperties = {
  color: '#888',
  marginTop: 0,
  marginBottom: 16,
};
const statRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  margin: '16px 0',
  flexWrap: 'wrap',
};
