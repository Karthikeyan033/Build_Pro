
import React, { useEffect, useState } from 'react';
import './App.css';
import backgroundImage from './assets/back.jpg';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PlanningPage from './pages/PlanningPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { apiRequest } from './utils/api';

const App = () => {
  // UI
  const [activeSection, setActiveSection] = useState('home'); // default to Home
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  // Auth
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const userName = user?.name || user?.email || 'User';

  // Data
  const [projects, setProjects] = useState([]);

  // Effects
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.setProperty('--bg-image', `url(${backgroundImage})`);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) setShowUserDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const me = await apiRequest('/users/me', { token, auth: true });
        setUser(me);
        const list = await apiRequest('/projects', { token, auth: true });
        setProjects(list);
      } catch {
        setToken('');
        setUser(null);
        setProjects([]);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  // Navigation
  const showSection = (section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleUserMenu = () => setShowUserDropdown((v) => !v);

  // Auth modal controls
  const openAuthModal = (type) => {
    setAuthModal(type);
    document.body.style.overflow = 'hidden';
  };
  const closeAuthModal = () => {
    setAuthModal(null);
    document.body.style.overflow = 'unset';
  };
  const switchAuthMode = () => {
    setAuthModal((m) => (m === 'login' ? 'signup' : 'login'));
  };

  // Auth actions
  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    setShowUserDropdown(false);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setProjects([]);
    localStorage.removeItem('token');
    setShowUserDropdown(false);
    setActiveSection('home');
  };

  // Auth Modal renderer
  const renderAuthModal = () => {
    if (!authModal) return null;
    return (
      <div className="modal-overlay auth-modal-overlay" onClick={closeAuthModal}>
        <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close auth-modal-close" onClick={closeAuthModal}>✕</button>
          {authModal === 'login' ? (
            <LoginPage onLogin={handleLogin} switchToSignup={switchAuthMode} onClose={closeAuthModal} />
          ) : (
            <SignupPage onLogin={handleLogin} switchToLogin={switchAuthMode} onClose={closeAuthModal} />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-icon">🏗️</div>
          <h2>Loading BuildPro...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        minHeight: '100vh',
        backgroundImage: 'url(/assets/back.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header
        isScrolled={isScrolled}
        activeSection={activeSection}
        showSection={showSection}
        user={user}
        userName={userName}
        showUserDropdown={showUserDropdown}
        toggleUserMenu={toggleUserMenu}
        openAuthModal={openAuthModal}
        logout={logout}
      />

      <main className="main-content">
        {activeSection === 'home' && (
          <HomePage showSection={showSection} isLoggedIn={!!user} />
        )}
        {activeSection === 'dashboard' && (
          <DashboardPage projects={projects} showSection={showSection} />
        )}
        {activeSection === 'planning' && (
          <PlanningPage token={token} setProjects={setProjects} />
        )}
        {activeSection === 'projects' && (
          <ProjectsPage
            projects={projects}
            showSection={showSection}
            loading={loading}
            token={token}
            setProjects={setProjects}
          />
        )}
        {activeSection === 'contact' && <ContactPage />}
      </main>

      <Footer />
      {renderAuthModal()}
    </div>
  );
};

export default App;
