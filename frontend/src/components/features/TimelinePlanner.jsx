
import React, { useMemo, useState } from 'react';

const TimelinePlanner = ({ projectData = {} }) => {
  const defaultPhases = useMemo(() => ([
    { name: 'Site Preparation', durationWeeks: 2, progress: 100 },
    { name: 'Foundation', durationWeeks: 3, progress: 80 },
    { name: 'Structure', durationWeeks: 6, progress: 45 },
    { name: 'Roofing', durationWeeks: 2, progress: 10 },
    { name: 'Electrical & Plumbing', durationWeeks: 4, progress: 0 },
    { name: 'Interior Finishing', durationWeeks: 8, progress: 0 }
  ]), []);

  const [phases, setPhases] = useState(defaultPhases);

  const updatePhaseProgress = (idx, v) => {
    const copy = [...phases];
    copy[idx] = { ...copy[idx], progress: Math.max(0, Math.min(100, v)) };
    setPhases(copy);
  };

  const totalWeeks = phases.reduce((s, p) => s + p.durationWeeks, 0);
  const totalProgress = Math.round(phases.reduce((s, p) => s + p.progress, 0) / phases.length);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18 }}>
        <div style={{ fontWeight: 800, color: '#334155', marginBottom: 12 }}>Project Timeline</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#475569' }}>
            <span>Overall Progress</span>
            <span style={{ fontWeight: 800 }}>{totalProgress}%</span>
          </div>
          <div style={{ height: 10, background: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: `${totalProgress}%`, height: '100%', background: 'linear-gradient(90deg,#22c55e,#84cc16)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {phases.map((p, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#111827' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.durationWeeks} weeks</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button aria-label="Decrease progress" onClick={() => updatePhaseProgress(i, p.progress - 10)} style={iconBtn}>−</button>
                  <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 700 }}>{p.progress}%</span>
                  <button aria-label="Increase progress" onClick={() => updatePhaseProgress(i, p.progress + 10)} style={iconBtn}>+</button>
                </div>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${p.progress}%`,
                    height: '100%',
                    background: p.progress === 100 ? '#22c55e' : p.progress > 0 ? '#f59e0b' : '#94a3b8',
                    transition: 'width 0.25s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button className="btn" style={{ width: 'auto' }} onClick={() => alert('Exporting Gantt...')}>🗓️ Export Gantt</button>
          {/* FIX: removed extra closing brace in onClick */}
          <button
            className="btn"
            style={{ width: 'auto', background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}
            onClick={() => alert('Share timeline link')}
          >
            🔗 Share Timeline
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
        <Info title="Milestone Targets">
          <ul className="list">
            <li>Structure top-out by week 12</li>
            <li>Services rough-ins by week 16</li>
            <li>Hand-over prep by week 24</li>
          </ul>
        </Info>
        <Info title="Risk Buffers">
          <ul className="list">
            <li>Rain delays: +2 weeks (monsoon)</li>
            <li>Material lead times for MEP</li>
            <li>Inspection rework windows</li>
          </ul>
        </Info>
        <MiniStats totalWeeks={totalWeeks} floors={projectData.floors || 1} />
      </div>
    </div>
  );
};

const iconBtn = {
  background: '#e2e8f0',
  border: '1px solid #cbd5e0',
  color: '#334155',
  width: 28,
  height: 28,
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 800
};

const Info = ({ title, children }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
    <div style={{ fontWeight: 800, color: '#334155', marginBottom: 8 }}>{title}</div>
    {children}
  </div>
);

const MiniStats = ({ totalWeeks, floors }) => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
      <Stat label="Total Duration" value={`${totalWeeks} weeks`} />
      <Stat label="Floors" value={`${floors}`} />
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
    <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    <div style={{ fontWeight: 800, color: '#111827' }}>{value}</div>
  </div>
);

export default TimelinePlanner;
