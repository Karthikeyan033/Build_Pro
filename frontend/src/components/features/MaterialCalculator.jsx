import React, { useState, useMemo } from 'react';

const MaterialCalculator = ({ projectData }) => {
  const [materials, setMaterials] = useState(null);

  const base = useMemo(() => {
    const area = Number(projectData.totalArea || 0);
    const floors = Number(projectData.floors || 1);
    return { area, floors };
  }, [projectData]);

  const calculateMaterials = () => {
    const a = base.area;
    const results = {
      cementBags: Math.ceil(a * 0.4),
      bricks: Math.ceil(a * 8),
      steelKg: Math.ceil(a * 4),
      sandCft: Math.ceil(a * 0.02),
      aggregateCft: Math.ceil(a * 0.03)
    };
    setMaterials(results);
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
      <div style={{background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18}}>
        <div style={{fontWeight: 800, color: '#334155', marginBottom: 12}}>Bill of Quantities</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12}}>
          <Card label="Total Area" value={`${base.area.toLocaleString()} sq ft`} />
          <Card label="Floors" value={`${base.floors}`} />
          <Card label="Type" value={(projectData.constructionType || 'basic')} />
        </div>

        <div style={{marginTop: 16}}>
          <button className="btn" style={{width: 'auto'}} onClick={calculateMaterials}>🧮 Calculate Quantities</button>
        </div>

        {materials && (
          <div style={{marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12}}>
            <Card label="Cement" value={`${materials.cementBags} bags`} />
            <Card label="Bricks" value={`${materials.bricks.toLocaleString()} pcs`} />
            <Card label="Steel" value={`${materials.steelKg.toLocaleString()} kg`} />
            <Card label="Sand" value={`${materials.sandCft} cft`} />
            <Card label="Aggregate" value={`${materials.aggregateCft} cft`} />
          </div>
        )}

        <div style={{marginTop: 18}}>
          <div style={{fontWeight: 700, color: '#334155', marginBottom: 8}}>Notes</div>
          <ul style={{marginLeft: 16, color: '#475569', lineHeight: 1.8}}>
            <li>Quantities are indicative; refine by structural drawings.</li>
            <li>Add 3–5% wastage based on site logistics.</li>
          </ul>
        </div>
      </div>

      <div style={{display: 'grid', gap: 12, alignContent: 'start'}}>
        <InfoBlock title="Recommended Vendors">
          <p style={{margin: 0}}>Shortlist local suppliers for concrete, steel, and bricks; compare logistics and payment terms.</p>
        </InfoBlock>
        <InfoBlock title="Download Options">
          <button className="btn" style={{marginTop: 8}} onClick={() => alert('Exporting BOQ...')}>📥 Export BOQ (CSV)</button>
        </InfoBlock>
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div style={{background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14}}>
    <div style={{fontSize: 12, color: '#64748b'}}>{label}</div>
    <div style={{fontWeight: 800, color: '#111827', fontSize: 18}}>{value}</div>
  </div>
);

const InfoBlock = ({ title, children }) => (
  <div style={{background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16}}>
    <div style={{fontWeight: 800, color: '#334155', marginBottom: 8}}>{title}</div>
    {children}
  </div>
);

export default MaterialCalculator;
