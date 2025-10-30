


import React, { useMemo, useState } from 'react';
import { apiRequest } from '../utils/api';

const CATEGORY_DEFS = [
  { id: 'residential', title: 'Residential Projects', emoji: '🏠', match: (p) => p.houseType === 'residential' },
  { id: 'commercial',  title: 'Commercial Projects',  emoji: '🏢', match: (p) => p.houseType === 'commercial'  },
  { id: 'villaapt',    title: 'Villa / Apartment',    emoji: '🏗️', match: (p) => ['villa','apartment'].includes(p.houseType) },
  { id: 'analytics',   title: 'Project Analytics',    emoji: '📊', match: (_) => true },
];

const ProjectsPage = ({ projects, showSection, loading, token, setProjects }) => {
  const [view, setView] = useState({ mode: 'overview', category: null }); // overview | category
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent | budget | area

  const updateProject = async (id, patch) => {
    try {
      const updated = await apiRequest(`/projects/${id}`, { method: 'PATCH', body: patch, token, auth: true });
      setProjects((prev) => prev.map((p) => (p._id === id ? updated : p)));
      return updated;
    } catch (e) {
      alert('Failed to update project');
    }
  };

  const deleteProject = async (id) => {
    try {
      await apiRequest(`/projects/${id}`, { method: 'DELETE', token, auth: true });
      setProjects((prev) => prev.filter((p) => p._id !== id));
      alert('Project deleted successfully');
    } catch (e) {
      alert('Failed to delete project');
    }
  };

  const counts = useMemo(() => ({
    residential: projects.filter((p) => p.houseType === 'residential').length,
    commercial: projects.filter((p) => p.houseType === 'commercial').length,
    villaapt: projects.filter((p) => ['villa', 'apartment'].includes(p.houseType)).length,
    total: projects.length
  }), [projects]);

  const openCategory = (id) => setView({ mode: 'category', category: id });
  const backToOverview = () => setView({ mode: 'overview', category: null });

  const filteredList = useMemo(() => {
    let list = projects.slice();
    const def = CATEGORY_DEFS.find((c) => c.id === view.category);
    if (def && def.id !== 'analytics') {
      list = list.filter(def.match);
    }
    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.projectName || '').toLowerCase().includes(q) ||
        (p.constructionType || '').toLowerCase().includes(q)
      );
    }
    // sort
    if (sortBy === 'budget') {
      list.sort((a, b) => (b.calculationResults?.grandTotal || 0) - (a.calculationResults?.grandTotal || 0));
    } else if (sortBy === 'area') {
      list.sort((a, b) => (b.calculationResults?.totalArea || 0) - (a.calculationResults?.totalArea || 0));
    } else { // recent (assuming createdAt exists or fallback to order)
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return list;
  }, [projects, view.category, search, sortBy]);

  if (view.mode === 'category') {
    const def = CATEGORY_DEFS.find((c) => c.id === view.category);
    const title = def?.title || 'Projects';
    const emoji = def?.emoji || '📁';

    // KPIs for this category
    const kProjects = filteredList.length;
    const kArea = filteredList.reduce((s, p) => s + (p.calculationResults?.totalArea || 0), 0);
    const kBudget = filteredList.reduce((s, p) => s + (p.calculationResults?.grandTotal || 0), 0);

    return (
      <div className="container">
        <div className="dashboard" style={{ paddingTop: 20 }}>
          {/* Sticky header for category view */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 1, background: '#fff',
            paddingBottom: 12, marginBottom: 16, borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={backToOverview}
                  aria-label="Back"
                  style={{
                    background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '8px 12px', cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <h2 style={{ color: '#111827', margin: 0 }}>{emoji} {title}</h2>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or type"
                  style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', minWidth: 220 }}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px' }}
                >
                  <option value="recent">Sort: Recent</option>
                  <option value="budget">Sort: Budget</option>
                  <option value="area">Sort: Area</option>
                </select>
                <button className="btn" style={{ width: 'auto' }} onClick={() => showSection('planning')}>+ New Project</button>
              </div>
            </div>

            {/* KPI chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginTop: 12 }}>
              <Kpi label="Projects" value={kProjects} />
              <Kpi label="Total Area" value={`${kArea.toLocaleString()} sq ft`} />
              <Kpi label="Estimated Budget" value={`₹${kBudget.toLocaleString()}`} />
            </div>
          </div>

          {/* List for this category */}
          <div className="recent-projects" style={{ marginTop: 0 }}>
            <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Projects</h3>
            {filteredList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No projects in this category. Create one to get started!
              </p>
            ) : (
              filteredList.map((p) => (
                <div key={p._id} className="project-item">
                  <div>
                    <strong>{p.projectName}</strong>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                      {(p.calculationResults?.totalArea || 0).toLocaleString()} sq ft • Type: {p.constructionType}
                    </div>
                  </div>
                  <div className="project-status status-active">
                    ₹{(p.calculationResults?.grandTotal || 0).toLocaleString()}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button
                      className="btn"
                      style={{ width: 'auto', marginTop: 0, padding: '8px 16px' }}
                      onClick={() => updateProject(p._id, { projectName: p.projectName + ' (Updated)' })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      style={{ width: 'auto', marginTop: 0, padding: '8px 16px', background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)' }}
                      onClick={() => deleteProject(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Overview (default)
  return (
    <div className="container">
      <div className="section-title">
        <h1>📁 My Projects</h1>
        <p className="subtitle">Manage and track all your construction projects</p>
      </div>

      <div className="dashboard">
        <div className="dashboard-header">
          <h2 style={{ color: '#667eea' }}>Project Management</h2>
          <button className="btn" onClick={() => showSection('planning')} style={{ width: 'auto' }}>Add New Project</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="features-grid">
              <button className="feature-item" onClick={() => openCategory('residential')} style={asButton}>
                <h3>🏠 Residential Projects</h3>
                <p>{counts.residential} Active Projects</p>
              </button>
              <button className="feature-item" onClick={() => openCategory('commercial')} style={asButton}>
                <h3>🏢 Commercial Projects</h3>
                <p>{counts.commercial} Active Projects</p>
              </button>
              <button className="feature-item" onClick={() => openCategory('villaapt')} style={asButton}>
                <h3>🏗️ Villa / Apartment</h3>
                <p>{counts.villaapt} Active</p>
              </button>
              <button className="feature-item" onClick={() => openCategory('analytics')} style={asButton}>
                <h3>📊 Project Analytics</h3>
                <p>Total: {counts.total}</p>
              </button>
            </div>

            <div className="recent-projects" style={{ marginTop: 20 }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px' }}>My Projects</h3>
              {projects.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  No projects yet. Start by creating a new project!
                </p>
              ) : (
                projects.map((p) => (
                  <div key={p._id} className="project-item">
                    <div>
                      <strong>{p.projectName}</strong>
                      <div style={{ color: '#666', fontSize: '0.9em' }}>
                        {p.calculationResults?.totalArea?.toLocaleString?.() || 0} sq ft • Type: {p.constructionType}
                      </div>
                    </div>
                    <div className="project-status status-active">
                      ₹{(p.calculationResults?.grandTotal || 0).toLocaleString?.()}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        className="btn"
                        style={{ width: 'auto', marginTop: 0, padding: '8px 16px' }}
                        onClick={() => updateProject(p._id, { projectName: p.projectName + ' (Updated)' })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        style={{ width: 'auto', marginTop: 0, padding: '8px 16px', background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)' }}
                        onClick={() => deleteProject(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const asButton = { width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'transparent' };

const Kpi = ({ label, value }) => (
  <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
    <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    <div style={{ fontWeight: 800, color: '#111827', fontSize: 18 }}>{value}</div>
  </div>
);

export default ProjectsPage;
