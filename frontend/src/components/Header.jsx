
import React from 'react';

const Header = ({
  isScrolled,
  activeSection,
  showSection,
  user,
  userName,
  showUserDropdown,
  toggleUserMenu,
  openAuthModal,
  logout
}) => {
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <a href="#" className="logo" onClick={() => showSection('home')}>
          <span>🏗️</span>
          SK Reals
        </a>

        <nav className="nav">
          <a
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => showSection('home')}
          >
            Home
          </a>
          <a
            className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => showSection('dashboard')}
          >
            Dashboard
          </a>
          <a
            className={`nav-link ${activeSection === 'planning' ? 'active' : ''}`}
            onClick={() => showSection('planning')}
          >
            Planning
          </a>
          <a
            className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
            onClick={() => showSection('projects')}
          >
            Projects
          </a>
          <a
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={() => showSection('contact')}
          >
            Contact
          </a>
        </nav>

        <div className="header-actions">
          {!user ? (
            <div className="auth-buttons">
              <button
                className="header-btn secondary"
                onClick={() => openAuthModal && openAuthModal('login')}
              >
                Sign In
              </button>
              <button
                className="header-btn primary"
                onClick={() => openAuthModal && openAuthModal('signup')}
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="user-menu">
              <button className="user-btn" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  <span>{userName?.charAt(0)?.toUpperCase()}</span>
                </div>
                <span className="user-name">{userName}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className={`dropdown-menu ${showUserDropdown ? 'show' : ''}`}>
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar large">
                      <span>{userName?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user?.name}</div>
                      <div className="user-email">{user?.email}</div>
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={() => showSection('dashboard')}>
                  <span>📊</span> Dashboard
                </a>
                <a className="dropdown-item" onClick={() => showSection('projects')}>
                  <span>📁</span> My Projects
                </a>
                <a className="dropdown-item" onClick={() => showSection('planning')}>
                  <span>📐</span> New Estimate
                </a>
                <a className="dropdown-item" onClick={() => showSection('contact')}>
                  <span>📞</span> Contact
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item logout" onClick={logout}>
                  <span>🚪</span> Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
