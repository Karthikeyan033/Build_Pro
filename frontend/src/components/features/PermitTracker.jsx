// import React, { useState } from 'react';

// const PermitTracker = () => {
//   const [permits, setPermits] = useState([
//     { name: 'Building Plan Approval', status: 'pending', date: '2025-01-15' },
//     { name: 'Environmental Clearance', status: 'approved', date: '2025-01-20' },
//     { name: 'Fire Safety Certificate', status: 'pending', date: '2025-02-01' },
//     { name: 'Electrical Safety Permit', status: 'not-started', date: '2025-02-15' }
//   ]);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'approved': return '#22c55e';
//       case 'pending': return '#f59e0b';
//       case 'not-started': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const updatePermitStatus = (index) => {
//     const statuses = ['not-started', 'pending', 'approved'];
//     const newPermits = [...permits];
//     const currentStatusIndex = statuses.indexOf(permits[index].status);
//     const nextStatusIndex = (currentStatusIndex + 1) % statuses.length;
//     newPermits[index].status = statuses[nextStatusIndex];
//     setPermits(newPermits);
//   };

//   return (
//     <div className="feature-item" style={{cursor: 'default', transform: 'none'}}>
//       <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
//         <span style={{fontSize: '2.5em'}}>📋</span>
//         <h3 style={{fontSize: '1.8em', fontWeight: '700'}}>Permit Tracker</h3>
//       </div>
      
//       <p style={{marginBottom: '20px', opacity: 0.9}}>Track construction permits and approvals</p>
      
//       <div style={{textAlign: 'left'}}>
//         {permits.map((permit, index) => (
//           <div key={index} style={{
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             marginBottom: '12px',
//             padding: '12px',
//             background: 'rgba(255, 255, 255, 0.1)',
//             borderRadius: '8px'
//           }}>
//             <div>
//               <div style={{fontWeight: '600', marginBottom: '4px'}}>{permit.name}</div>
//               <div style={{fontSize: '0.9em', opacity: 0.8}}>Due: {permit.date}</div>
//             </div>
//             <button
//               onClick={() => updatePermitStatus(index)}
//               style={{
//                 background: getStatusColor(permit.status),
//                 color: 'white',
//                 border: 'none',
//                 padding: '6px 12px',
//                 borderRadius: '6px',
//                 fontSize: '0.8em',
//                 cursor: 'pointer',
//                 textTransform: 'capitalize'
//               }}
//             >
//               {permit.status.replace('-', ' ')}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PermitTracker;


import React, { useState } from 'react';

const PermitTracker = () => {
  const [permits, setPermits] = useState([
    { name: 'Building Plan Approval', status: 'pending', date: '2025-01-15' },
    { name: 'Environmental Clearance', status: 'approved', date: '2025-01-20' },
    { name: 'Fire Safety Certificate', status: 'pending', date: '2025-02-01' },
    { name: 'Electrical Safety Permit', status: 'not-started', date: '2025-02-15' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'not-started': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const cycleStatus = (s) => {
    if (s === 'not-started') return 'pending';
    if (s === 'pending') return 'approved';
    return 'not-started';
  };

  const updatePermitStatus = (index) => {
    const list = [...permits];
    list[index] = { ...list[index], status: cycleStatus(list[index].status) };
    setPermits(list);
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20}}>
      <div style={{background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 18}}>
        <div style={{fontWeight: 800, color: '#334155', marginBottom: 12}}>Permit Checklist</div>
        <div style={{display: 'grid', gap: 10}}>
          {permits.map((p, i) => (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: 12}}>
              <div>
                <div style={{fontWeight: 700, color: '#111827'}}>{p.name}</div>
                <div style={{fontSize: 12, color: '#64748b'}}>Target: {p.date}</div>
              </div>
              <button
                onClick={() => updatePermitStatus(i)}
                style={{
                  background: getStatusColor(p.status), color: 'white', border: 'none',
                  padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textTransform: 'capitalize'
                }}
              >
                {p.status.replace('-', ' ')}
              </button>
            </div>
          ))}
        </div>

        <div style={{marginTop: 16}}>
          <button className="btn" style={{width: 'auto'}} onClick={() => alert('Exporting permit tracker...')}>📤 Export Tracker</button>
        </div>
      </div>

      <div style={{display: 'grid', gap: 12, alignContent: 'start'}}>
        <Info title="Required Documents">
          <ul className="list">
            <li>Ownership proof and site plan</li>
            <li>Structural drawings and soil report</li>
            <li>Environmental and fire safety compliance</li>
          </ul>
        </Info>
        <Info title="Processing Tips">
          <ul className="list">
            <li>Track acknowledgments and fee receipts</li>
            <li>Respond quickly to queries to avoid delays</li>
            <li>Keep soft copies organized by permit type</li>
          </ul>
        </Info>
      </div>
    </div>
  );
};

const Info = ({ title, children }) => (
  <div style={{background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16}}>
    <div style={{fontWeight: 800, color: '#334155', marginBottom: 8}}>{title}</div>
    {children}
  </div>
);

export default PermitTracker;

