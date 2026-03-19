import { useState, useEffect } from 'react';

export default function Notifier() {
  const [alarmTime, setAlarmTime] = useState('');
  const [label, setLabel] = useState('Wake up! 🌅');
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    const saved = localStorage.getItem('alarms');
    if (saved) setScheduled(JSON.parse(saved));
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const scheduleAlarm = () => {
    if (!alarmTime) return alert('Set a time first!');
    const alarm = { id: Date.now(), time: alarmTime, label };
    const updated = [...scheduled, alarm];
    setScheduled(updated);
    localStorage.setItem('alarms', JSON.stringify(updated));

    const [h, m] = alarmTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= new Date()) target.setDate(target.getDate() + 1);
    const delay = target.getTime() - new Date().getTime();

    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('🌙 WakeBuddy', { body: label });
      } else {
        alert(`⏰ ${label}`);
      }
    }, delay);

    alert(
      `✅ Alarm set for ${alarmTime} — ${Math.round(
        delay / 60000
      )} mins from now`
    );
    setAlarmTime('');
  };

  const deleteAlarm = (id: number) => {
    const updated = scheduled.filter((a) => a.id !== id);
    setScheduled(updated);
    localStorage.setItem('alarms', JSON.stringify(updated));
  };

  return (
    <div style={card}>
      <h2 style={heading}>🔔 Reminder Notifier</h2>
      <p style={sub}>Set dynamic wake-up alarms with browser notifications</p>

      {permission !== 'granted' && (
        <div style={warnBox}>
          🔕 Notifications not enabled.
          <button
            onClick={requestPermission}
            style={{
              ...btn,
              marginLeft: 12,
              padding: '4px 14px',
              fontSize: 13,
            }}
          >
            Enable
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <div style={goodBox}>🔔 Notifications are enabled! ✅</div>
      )}

      <div
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '16px 0' }}
      >
        <div>
          <label style={labelStyle}>⏰ Alarm time</label>
          <br />
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            style={input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>📝 Label</label>
          <br />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ ...input, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <button onClick={scheduleAlarm} style={btn}>
        Set Alarm
      </button>

      <hr style={{ margin: '20px 0', borderColor: '#f0f0f0' }} />
      <h3 style={{ color: '#444' }}>Scheduled Alarms</h3>
      {scheduled.length === 0 && (
        <p style={{ color: '#bbb' }}>No alarms set yet.</p>
      )}
      {scheduled.map((a) => (
        <div key={a.id} style={logItem}>
          <div>
            <strong style={{ color: '#6c47ff' }}>{a.time}</strong>
            <span style={{ color: '#888', marginLeft: 8 }}>{a.label}</span>
          </div>
          <button onClick={() => deleteAlarm(a.id)} style={deleteBtn}>
            ✕
          </button>
        </div>
      ))}
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
const labelStyle: React.CSSProperties = { fontSize: 13, color: '#555' };
const input: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: 15,
  marginTop: 4,
};
const btn: React.CSSProperties = {
  background: '#6c47ff',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: 15,
};
const logItem: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #f5f5f5',
};
const warnBox: React.CSSProperties = {
  background: '#fffbeb',
  border: '1px solid #f59e0b',
  borderRadius: 10,
  padding: 12,
  color: '#92400e',
  marginBottom: 12,
};
const goodBox: React.CSSProperties = {
  background: '#f0fdf4',
  border: '1px solid #22c55e',
  borderRadius: 10,
  padding: 12,
  color: '#166534',
  marginBottom: 12,
};
const deleteBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#f44',
  cursor: 'pointer',
  fontSize: 16,
};
