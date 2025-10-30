

import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import MaterialCalculator from '../components/features/MaterialCalculator';
import PermitTracker from '../components/features/PermitTracker';
import TimelinePlanner from '../components/features/TimelinePlanner';
import Visualization3D from '../components/features/Visualization3D';

const PlanningPage = ({ token, setProjects }) => {
  const [showResults, setShowResults] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [projectForm, setProjectForm] = useState({
    projectName: '',
    houseType: 'residential',
    length: '',
    width: '',
    floors: '1',
    constructionType: 'basic',
    location: 'urban',
    timeline: '6'
  });

  const [calculationResults, setCalculationResults] = useState({
    totalArea: 0,
    totalCost: 0,
    costPerSqFt: 0,
    completionTime: 0,
    foundationCost: 0,
    wallsCost: 0,
    electricalCost: 0,
    interiorCost: 0,
    laborTotal: 0,
    grandTotal: 0,
    length: 0,
    width: 0,
    floors: 0,
    constructionType: 'basic'
  });

  useEffect(() => {
    if (activeModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [activeModal]);

  const handleProjectFormChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const createProject = async (withResults = true) => {
    try {
      const body = {
        ...projectForm,
        length: Number(projectForm.length),
        width: Number(projectForm.width),
        floors: Number(projectForm.floors),
        timeline: Number(projectForm.timeline),
        ...(withResults ? { calculationResults } : {}),
      };
      const created = await apiRequest('/projects', { method: 'POST', body, token, auth: true });
      setProjects((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      console.warn('Failed to create project', e);
      throw e;
    }
  };

  const calculateEstimate = async () => {
    const { length, width, floors, constructionType, location, timeline } = projectForm;
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const floorsNum = parseInt(floors, 10);
    const laborCost = 35;

    if (!lengthNum || !widthNum || !floorsNum) {
      alert('Please fill in all required fields (Length, Width, Floors)');
      return;
    }

    const totalArea = lengthNum * widthNum * floorsNum;
    const baseCosts = { basic: 80, standard: 120, premium: 180, luxury: 250 };
    const locationMultiplier = { urban: 1.2, suburban: 1.0, rural: 0.8 };
    const baseCostPerSqFt = baseCosts[constructionType];
    const locationFactor = locationMultiplier[location];
    const finalCostPerSqFt = baseCostPerSqFt * locationFactor;
    const materialCost = totalArea * finalCostPerSqFt;
    const totalLaborCost = totalArea * laborCost;
    const totalCost = materialCost + totalLaborCost;
    const foundationCost = totalCost * 0.20;
    const wallsCost = totalCost * 0.25;
    const electricalCost = totalCost * 0.15;
    const interiorCost = totalCost * 0.25;

    setCalculationResults({
      totalArea,
      totalCost: Math.round(totalCost),
      costPerSqFt: Math.round(finalCostPerSqFt + laborCost),
      completionTime: parseInt(timeline, 10),
      foundationCost: Math.round(foundationCost),
      wallsCost: Math.round(wallsCost),
      electricalCost: Math.round(electricalCost),
      interiorCost: Math.round(interiorCost),
      laborTotal: Math.round(totalLaborCost),
      grandTotal: Math.round(totalCost),
      length: lengthNum,
      width: widthNum,
      floors: floorsNum,
      constructionType
    });

    setShowResults(true);
    setTimeout(() => {
      const resultsElement = document.getElementById('resultSection');
      if (resultsElement) resultsElement.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    if (token) {
      try {
        await createProject(true);
      } catch (e) {
        console.warn('Project auto-save failed', e);
      }
    }
  };

  const features = [
    {
      id: 'material',
      title: 'Material Calculator',
      icon: '🧱',
      description: 'Calculate exact quantities of materials needed for your construction project',
      component: MaterialCalculator
    },
    {
      id: 'permit',
      title: 'Permit Tracker',
      icon: '📋',
      description: 'Track construction permits and approvals with status updates',
      component: PermitTracker
    },
    {
      id: 'timeline',
      title: 'Timeline Planner',
      icon: '📅',
      description: 'Create detailed construction schedule with milestones and progress tracking',
      component: TimelinePlanner
    },
    {
      id: 'visualization',
      title: '3D Visualization',
      icon: '🏠',
      description: 'View your construction project in three dimensions with multiple views',
      component: Visualization3D
    }
  ];

  const openModal = (featureId) => setActiveModal(featureId);
  const closeModal = () => setActiveModal(null);

  const renderModal = () => {
    if (!activeModal) return null;
    const feature = features.find(f => f.id === activeModal);
    if (!feature) return null;
    const FeatureComponent = feature.component;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    // Full-page
   return (
  <div
    id={`feature-full-${feature.id}`}
    className="feature-fullpage"
    role="dialog"
    aria-modal="true"
    aria-labelledby={`feature-title-${feature.id}`}
    onKeyDown={onKeyDown}
  >
    {/* Sticky top app bar */}
    <div className="feature-appbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="feature-back" onClick={closeModal} aria-label="Back to Planning">←</button>
        <div
          id={`feature-title-${feature.id}`}
          style={{ fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 20 }}>{feature.icon}</span> {feature.title}
        </div>
      </div>
      <button className="feature-close" onClick={closeModal} aria-label="Close">✕</button>
    </div>

    {/* Scrollable content area */}
    <div className="feature-scroll">
      <div className="feature-hero">
        <div className="feature-hero-content">
          <div className="feature-hero-pill">BuildPro Suite</div>
          <h1>{feature.icon} {feature.title}</h1>
          <p>{feature.description}</p>

          {/* Quick stats bar */}
          <div className="feature-stats">
            <div className="stat">
              <div className="stat-label">Project Area</div>
              <div className="stat-value">{(calculationResults.totalArea || 0).toLocaleString()} sq ft</div>
            </div>
            <div className="stat">
              <div className="stat-label">Floors</div>
              <div className="stat-value">{calculationResults.floors || projectForm.floors || 1}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Type</div>
              <div className="stat-value" style={{ textTransform: 'capitalize' }}>
                {calculationResults.constructionType || projectForm.constructionType}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Estimate</div>
              <div className="stat-value">₹{(calculationResults.grandTotal || 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-body">
        {/* Main feature component */}
        <div className="feature-main">
          <FeatureComponent projectData={calculationResults} />
        </div>

        {/* Sidebar: Tips/Resources vary by feature */}
        <aside className="feature-aside">
          {activeModal === 'material' && (
            <>
              <Section title="Estimator Tips">
                <ul className="list">
                  <li>Adjust wastage factor by 3–5% for breakage and cutting.</li>
                  <li>Cross-check steel requirements with span and load assumptions.</li>
                  <li>Use local supplier conversions (e.g., sand by CFT vs. m³).</li>
                </ul>
              </Section>
              <Section title="Material Standards">
                <ul className="list">
                  <li>Cement: OPC 43/53 as per IS 12269.</li>
                  <li>Steel: Fe 500/550 as per IS 1786.</li>
                  <li>Bricks: Class designation ≥ 35.</li>
                </ul>
              </Section>
              <CTA text="Export Bill of Quantities" icon="📤" />
            </>
          )}

          {activeModal === 'permit' && (
            <>
              <Section title="Approval Checklist">
                <ul className="list">
                  <li>Building plan & structural stability certificate.</li>
                  <li>Soil test & environmental impact notes if applicable.</li>
                  <li>Fire NOC for high-rise/commercial buildings.</li>
                </ul>
              </Section>
              <Section title="Regional Notes">
                <ul className="list">
                  <li>Timelines vary by municipality—buffer 2–4 weeks.</li>
                  <li>Track fee payments and acknowledgment numbers.</li>
                </ul>
              </Section>
              <CTA text="Download Permit Checklist" icon="✅" />
            </>
          )}

          {activeModal === 'timeline' && (
            <>
              <Section title="Planning Guidance">
                <ul className="list">
                  <li>Keep slack time for monsoon delays in exterior works.</li>
                  <li>Overlap interior works with MEP snagging where possible.</li>
                  <li>Weekly progress reviews improve on-time delivery.</li>
                </ul>
              </Section>
              <Section title="Milestone Examples">
                <ul className="list">
                  <li>Plinth completed</li>
                  <li>Structure topped-out</li>
                  <li>MEP rough-ins completed</li>
                  <li>Interiors 80% done</li>
                </ul>
              </Section>
              <CTA text="Export Gantt as PDF" icon="🗓️" />
            </>
          )}

          {activeModal === 'visualization' && (
            <>
              <Section title="View Controls">
                <ul className="list">
                  <li>Use “Enable Interactive” to rotate model via drag.</li>
                  <li>Switch views: Front, Side, Top, Isometric.</li>
                  <li>Length/Width/Floors influence shape and height.</li>
                </ul>
              </Section>
              <Section title="Render Tips">
                <ul className="list">
                  <li>Ensure estimate computed for accurate dimensions.</li>
                  <li>Try different construction types to change facade theme.</li>
                </ul>
              </Section>
              <CTA text="Save Preview Image" icon="🖼️" />
            </>
          )}
        </aside>
      </div>

      {/* Sticky bottom action bar inside the scroll container */}
      <div className="feature-bottom">
        <div className="bottom-left">
          <span style={{ fontWeight: 700 }}>Need help?</span> Explore docs and templates tailored to this module.
        </div>
        <div className="bottom-actions">
          <button className="btn" onClick={closeModal}>Back to Planning</button>
        </div>
      </div>
    </div>
  </div>
);

  };

  return (
    <div className="planning-root">
      <div
        className={`page-wrapper ${activeModal ? 'hidden' : ''}`}
        aria-hidden={activeModal ? 'true' : 'false'}
        style={{ display: activeModal ? 'none' : 'block' }}
      >
        <div className="container">
          <div className="section-title">
            <h1>🏗️ Construction Planning</h1>
            <p className="subtitle">Professional Construction Planning & Cost Estimation</p>
          </div>

          <div className="planning-content">
            <div className="card">
              <h2><span>📐</span>Project Details</h2>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" name="projectName" value={projectForm.projectName} onChange={handleProjectFormChange} placeholder="Enter your project name" />
              </div>
              <div className="form-group">
                <label>House Type</label>
                <select name="houseType" value={projectForm.houseType} onChange={handleProjectFormChange}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Length (feet)</label>
                <input type="number" name="length" value={projectForm.length} onChange={handleProjectFormChange} placeholder="Enter length" min="1" />
              </div>
              <div className="form-group">
                <label>Width (feet)</label>
                <input type="number" name="width" value={projectForm.width} onChange={handleProjectFormChange} placeholder="Enter width" min="1" />
              </div>
              <div className="form-group">
                <label>Number of Floors</label>
                <select name="floors" value={projectForm.floors} onChange={handleProjectFormChange}>
                  <option value="1">1 Floor</option>
                  <option value="2">2 Floors</option>
                  <option value="3">3 Floors</option>
                  <option value="4">4+ Floors</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h2><span>💰</span>Cost Parameters</h2>
              <div className="form-group">
                <label>Construction Type</label>
                <select name="constructionType" value={projectForm.constructionType} onChange={handleProjectFormChange}>
                  <option value="basic">Basic (₹80/sq ft)</option>
                  <option value="standard">Standard (₹120/sq ft)</option>
                  <option value="premium">Premium (₹180/sq ft)</option>
                  <option value="luxury">Luxury (₹250/sq ft)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <select name="location" value={projectForm.location} onChange={handleProjectFormChange}>
                  <option value="urban">Urban Area</option>
                  <option value="suburban">Suburban Area</option>
                  <option value="rural">Rural Area</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expected Timeline</label>
                <select name="timeline" value={projectForm.timeline} onChange={handleProjectFormChange}>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                  <option value="18">1.5 years</option>
                  <option value="24">2 years</option>
                </select>
              </div>
              <button className="btn" onClick={calculateEstimate}>📊 Calculate Estimate</button>
            </div>
          </div>

          {showResults && (
            <div className="result-section" id="resultSection">
              <h2 style={{color: '#667eea', marginBottom: '20px'}}>📋 Construction Plan Summary</h2>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-value">{calculationResults.totalArea.toLocaleString()}</div>
                  <div className="result-label">Total Area (sq ft)</div>
                </div>
                <div className="result-item">
                  <div className="result-value">₹{calculationResults.totalCost.toLocaleString()}</div>
                  <div className="result-label">Estimated Cost</div>
                </div>
                <div className="result-item">
                  <div className="result-value">₹{calculationResults.costPerSqFt}</div>
                  <div className="result-label">Cost per sq ft</div>
                </div>
                <div className="result-item">
                  <div className="result-value">{calculationResults.completionTime}</div>
                  <div className="result-label">Completion Time</div>
                </div>
              </div>

              <div className="cost-breakdown">
                <h3 style={{color: '#667eea', marginBottom: '15px'}}>💡 Cost Breakdown</h3>
                <div className="cost-item">
                  <span>Foundation & Structure:</span>
                  <span>₹{calculationResults.foundationCost.toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Walls & Roofing:</span>
                  <span>₹{calculationResults.wallsCost.toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Electrical & Plumbing:</span>
                  <span>₹{calculationResults.electricalCost.toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Interior Finishing:</span>
                  <span>₹{calculationResults.interiorCost.toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Labor Costs:</span>
                  <span>₹{calculationResults.laborTotal.toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Total Estimated Cost:</span>
                  <span>₹{calculationResults.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div style={{marginTop: '20px'}}>
                <h4 style={{color: '#667eea'}}>Project Progress Tracker</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '100%'}}></div>
                </div>
                <p style={{marginTop: '10px', color: '#666'}}>Planning Phase Complete</p>
              </div>
            </div>
          )}

          <div className="features-section">
            <h2 style={{color: '#667eea', marginBottom: '20px'}}>🚀 Additional Features</h2>
            <div className="features-grid">
              {features.map(feature => (
                <button 
                  key={feature.id}
                  className="feature-button"
                  onClick={() => openModal(feature.id)}
                  aria-haspopup="dialog"
                  aria-controls={`feature-full-${feature.id}`}
                >
                  <div className="feature-icon">
                    <span style={{fontSize: '2.5em'}}>{feature.icon}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16}}>
    <div style={{fontWeight: 800, color: '#334155', marginBottom: 10}}>{title}</div>
    {children}
  </div>
);

const CTA = ({ text, icon }) => (
  <button
    style={{
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '14px 16px',
      borderRadius: 10,
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer'
    }}
    onClick={() => alert('Coming soon')}
  >
    <span style={{marginRight: 8}}>{icon}</span>{text}
  </button>
);

export default PlanningPage;
