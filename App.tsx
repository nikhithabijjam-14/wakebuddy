import { useState } from 'react';
import Logger from './components/Logger';
import PatternAnalyzer from './components/PatternAnalyzer';
import AlarmScheduler from './components/AlarmScheduler';
import Notifier from './components/Notifier';
import SleepHistory from './components/SleepHistory';

export default function App() {
  const [activePage, setActivePage] = useState('logger');

  const nav = [
    { id: 'logger', label: '📝 Logger' },
    { id: 'pattern', label: '📊 Pattern' },
    { id: 'alarm', label: '⏰ Alarm' },
    { id: 'notifier', label: '🔔 Notifier' },
    { id: 'history', label: '📈 History' },
  ];

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        maxWidth: 700,
        margin: '0 auto',
        padding: 16,
        background: '#f5f5ff',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#6c47ff', marginBottom: 4 }}>
        🌙 WakeBuddy
      </h1>
      <p style={{ textAlign: 'center', color: '#888', marginTop: 0 }}>
        Your smart sleep companion
      </p>

      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setActivePage(n.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              background: activePage === n.id ? '#6c47ff' : '#fff',
              color: activePage === n.id ? '#fff' : '#6c47ff',
              fontWeight: activePage === n.id ? 'bold' : 'normal',
              boxShadow: '0 1px 4px #0001',
            }}
          >
            {n.label}
          </button>
        ))}
      </div>

      {activePage === 'logger' && <Logger />}
      {activePage === 'pattern' && <PatternAnalyzer />}
      {activePage === 'alarm' && <AlarmScheduler />}
      {activePage === 'notifier' && <Notifier />}
      {activePage === 'history' && <SleepHistory />}
    </div>
  );
}
