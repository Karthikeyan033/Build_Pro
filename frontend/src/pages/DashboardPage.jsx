import React from 'react';

const DashboardPage = ({ projects, showSection }) => {
  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <span>📊</span>
            Project Dashboard
          </h1>
          <button className="btn" onClick={() => showSection('planning')} style={{width: 'auto'}}>Start New Project</button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{projects.length}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {projects.filter(p => ['residential','commercial','villa','apartment'].includes(p.houseType)).length}
            </div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              ₹{projects.reduce((sum, p) => sum + (p.calculationResults?.grandTotal || 0), 0).toLocaleString()}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">78%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        <div className="recent-projects">
          <h3 style={{color: '#667eea', marginBottom: '20px'}}>Recent Projects</h3>
          {projects.length === 0 ? (
            <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>No projects yet. Start by creating a new project!</p>
          ) : (
            projects.slice(0, 3).map(p => (
              <div className="project-item" key={p._id}>
                <div>
                  <strong>{p.projectName}</strong>
                  <div style={{color: '#666', fontSize: '0.9em'}}>
                    {(p.calculationResults?.totalArea || 0).toLocaleString()} sq ft • Type: {p.constructionType}
                  </div>
                </div>
                <div className="project-status status-active">
                  ₹{(p.calculationResults?.grandTotal || 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
          <div style={{background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', padding: '28px', borderRadius: '20px', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <span style={{fontSize: '2em'}}>📱</span>
              <h3 style={{fontSize: '1.5em', fontWeight: '700'}}>WhatsApp</h3>
            </div>
            <a href="https://wa.me/919486049112" target="_blank" rel="noopener noreferrer" style={{display: 'block', color: 'white', textDecoration: 'none', fontSize: '1.1em', marginBottom: '8px', opacity: 0.95}}>+91 9486049112</a>
            <a href="https://wa.me/919123530692" target="_blank" rel="noopener noreferrer" style={{display: 'block', color: 'white', textDecoration: 'none', fontSize: '1.1em', opacity: 0.95}}>+91 9123530692</a>
          </div>
          
          <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '28px', borderRadius: '20px', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <span style={{fontSize: '2em'}}>📧</span>
              <h3 style={{fontSize: '1.5em', fontWeight: '700'}}>Email</h3>
            </div>
            <a href="mailto:2312121@nec.edu.in" style={{display: 'block', color: 'white', textDecoration: 'none', fontSize: '1.05em', marginBottom: '8px', opacity: 0.95, wordBreak: 'break-word'}}>2312121@nec.edu.in</a>
            <a href="mailto:karthikeyanbharathi005@gmail.com" style={{display: 'block', color: 'white', textDecoration: 'none', fontSize: '1.05em', opacity: 0.95, wordBreak: 'break-word'}}>karthikeyanbharathi005@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
