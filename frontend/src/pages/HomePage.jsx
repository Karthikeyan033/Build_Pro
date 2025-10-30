import React from 'react';

const HomePage = ({ showSection, isLoggedIn }) => {
  return (
    <div className="home">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-pill">BuildPro Suite</div>
          <h1 className="home-title">
            Plan, Estimate, and Deliver
            <span className="home-gradient"> Construction Projects</span>
            with Confidence
          </h1>
          <p className="home-subtitle">
            A modern platform for accurate cost estimation, smart planning, material quantification,
            and visual previews—built for contractors, architects, and homeowners.
          </p>

          <div className="home-cta">
            <button className="btn" onClick={() => showSection('planning')}>Start a Project</button>
            <button
              className="btn btn-secondary"
              onClick={() => showSection(isLoggedIn ? 'projects' : 'dashboard')}
            >
              {isLoggedIn ? 'View My Projects' : 'Explore Dashboard'}
            </button>
          </div>

          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-value">99.5%</div>
              <div className="home-stat-label">Estimation Accuracy</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-value">10,000+</div>
              <div className="home-stat-label">Sq ft Estimated</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-value">24×7</div>
              <div className="home-stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <h2 className="section-heading">Why BuildPro</h2>
        <p className="section-subtitle">Tools needed to manage every phase of the build</p>

        <div className="home-features">
          <div className="home-feature">
            <div className="home-feature-icon">📐</div>
            <h3>Cost Estimation</h3>
            <p>Compute cost-per-sqft with location multipliers and labor to get transparent budgets.</p>
            <a className="home-link" onClick={() => showSection('planning')}>Calculate now →</a>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🧱</div>
            <h3>Material Calculator</h3>
            <p>Get precise quantities for cement, bricks, steel, sand, and aggregate for your plan.</p>
            <a className="home-link" onClick={() => showSection('planning')}>Open calculator →</a>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">📅</div>
            <h3>Timeline Planner</h3>
            <p>Organize phases, track progress, and export schedules for on-time delivery.</p>
            <a className="home-link" onClick={() => showSection('planning')}>Plan timeline →</a>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🏠</div>
            <h3>3D Visualization</h3>
            <p>Preview the building form interactively using area, floors, and footprint.</p>
            <a className="home-link" onClick={() => showSection('planning')}>Preview 3D →</a>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="home-section">
        <h2 className="section-heading">How it Works</h2>
        <p className="section-subtitle">Three steps from idea to clarity</p>

        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-num">1</div>
            <h4>Enter Plan Details</h4>
            <p>Specify project type, length, width, floors, and location.</p>
          </div>
          <div className="home-step">
            <div className="home-step-num">2</div>
            <h4>Get Instant Estimate</h4>
            <p>See total cost, cost per sq ft, and a clean cost breakdown.</p>
          </div>
          <div className="home-step">
            <div className="home-step-num">3</div>
            <h4>Refine & Share</h4>
            <p>Adjust parameters, generate material lists, and share schedules.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-section">
        <h2 className="section-heading">Trusted by Professionals</h2>
        <p className="section-subtitle">What builders and homeowners say</p>

        <div className="home-testimonials">
          <Testimonial
            quote="Accurate, fast, and easy to use—the estimates helped win client trust."
            name="Ravi Kumar"
            role="Contractor, Chennai"
          />
          <Testimonial
            quote="The material calculator saved days of manual checks for our villa project."
            name="Divya Shah"
            role="Architect, Bengaluru"
          />
          <Testimonial
            quote="3D preview gave our family confidence before starting construction."
            name="Arun K."
            role="Homeowner, Coimbatore"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-band">
        <div className="home-cta-band-inner">
          <h3>Start planning with BuildPro today</h3>
          <p>Create a project in minutes and generate reliable estimates.</p>
          <div className="home-cta">
            <button className="btn" onClick={() => showSection('planning')}>Create Free Estimate</button>
            <button className="btn btn-secondary" onClick={() => showSection('projects')}>View Projects</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Testimonial = ({ quote, name, role }) => (
  <div className="home-testimonial">
    <div className="home-quote">“{quote}”</div>
    <div className="home-author">
      <div className="home-avatar">👤</div>
      <div>
        <div className="home-name">{name}</div>
        <div className="home-role">{role}</div>
      </div>
    </div>
  </div>
);

export default HomePage;
