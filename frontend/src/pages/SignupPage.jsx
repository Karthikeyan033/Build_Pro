import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

const SignupPage = ({ onLogin, switchToLogin, onClose }) => {
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateStep1 = () => {
    if (!signupForm.name || !signupForm.email) {
      setError('Please fill in all fields');
      return false;
    }
    if (signupForm.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!signupForm.password || !signupForm.confirmPassword) {
      setError('Please fill in all password fields');
      return false;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      await apiRequest('/auth/register', { 
        method: 'POST', 
        body: { 
          name: signupForm.name, 
          email: signupForm.email, 
          password: signupForm.password 
        }, 
        auth: false 
      });

      // Auto login after successful registration
      const loginData = await apiRequest('/auth/login', { 
        method: 'POST', 
        body: { email: signupForm.email, password: signupForm.password }, 
        auth: false 
      });

      onLogin(loginData.token, loginData.user);
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
      onClose();
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🎯</div>
          <h2>Create Account</h2>
          <p>Join BuildPro and start planning your construction projects</p>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNext} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={signupForm.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-btn primary">
              <span>➡️</span>
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="password-strength">
                <div className={`strength-bar ${signupForm.password.length >= 6 ? 'strong' : signupForm.password.length >= 3 ? 'medium' : 'weak'}`}></div>
                <span className="strength-text">
                  {signupForm.password.length >= 6 ? 'Strong' : signupForm.password.length >= 3 ? 'Medium' : 'Weak'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                {signupForm.confirmPassword && (
                  <span className={`match-indicator ${signupForm.password === signupForm.confirmPassword ? 'match' : 'no-match'}`}>
                    {signupForm.password === signupForm.confirmPassword ? '✅' : '❌'}
                  </span>
                )}
              </div>
            </div>

            <div className="terms-wrapper">
              <label className="checkbox-wrapper">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleBack} className="auth-btn secondary">
                <span>⬅️</span>
                Back
              </button>
              <button 
                type="submit" 
                className="auth-btn primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>🎉</span>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have an account? 
            <button onClick={switchToLogin} className="link-btn">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
