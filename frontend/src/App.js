import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from './AuthContext';
import Profile from "./Pages/Profile";

// Auth Callback Component
function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading, checkOnboardedStatus } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!loading && user) {
        const urlParams = new URLSearchParams(window.location.search);
        const fromDataCollection = urlParams.get('from') === 'datacollection';

        if (fromDataCollection) {
          // Coming from data collection, user is onboarded
          navigate('/');
          return;
        }

        // Check if user is onboarded
        const isOnboarded = await checkOnboardedStatus(user.id);
        if (!isOnboarded) {
          // Redirect to data collection app
          window.location.href = 'http://localhost:5173';
          return;
        }

        // User is onboarded, go to main app
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [loading, user, navigate, checkOnboardedStatus]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '18px'
    }}>
      Completing authentication...
    </div>
  );
}



function App() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [schemes, setSchemes] = useState([
    {
      _id: 1,
      scheme_name: 'PM Fasal Bima Yojana',
      category: 'Farmers',
      state: 'All India',
      income_level: 'All',
      summary: 'Low-premium crop insurance against natural disasters and weather events.',
      eligibility_criteria: 'Farmers across India',
      benefits: 'Insurance coverage',
      application_link: '#',
      eligibility_score: 65
    },
    {
      _id: 2,
      scheme_name: 'Beti Bachao Beti Padhao',
      category: 'Women',
      state: 'All India',
      income_level: 'All',
      summary: 'Empowering girl child through education and financial security schemes.',
      eligibility_criteria: 'Girl children',
      benefits: 'Educational and financial support',
      application_link: '#',
      eligibility_score: 55
    },
    {
      _id: 3,
      scheme_name: 'Pradhan Mantri Mudra Yojana',
      category: 'Business',
      state: 'All India',
      income_level: 'All',
      summary: 'Collateral-free business loans up to ₹10 lakh for micro entrepreneurs.',
      eligibility_criteria: 'Entrepreneurs without collateral',
      benefits: 'Business loans',
      application_link: '#',
      eligibility_score: 65
    }
  ]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterSchemes();
  }, [schemes, selectedCategory, selectedState, selectedIncome]);

  const filterSchemes = () => {
    let filtered = schemes;

    if (selectedCategory) {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    if (selectedState) {
      filtered = filtered.filter(scheme => scheme.state === selectedState);
    }

    if (selectedIncome) {
      filtered = filtered.filter(scheme => scheme.income_level === selectedIncome);
    }

    setFilteredSchemes(filtered);
  };

  const categories = ['Farmers', 'Women', 'Business', 'Education', 'Health', 'Senior Citizens', 'Youth', 'Housing', 'General'];
  const states = ['All India', 'Punjab', 'Maharashtra', 'Tamil Nadu', 'Gujarat', 'Karnataka', 'Rajasthan', 'Delhi'];
  const incomes = ['All', 'Below Poverty Line', 'Low Income', 'Middle Income'];
  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు'];

  const getCategoryColor = (category) => {
    const colors = {
      'Farmers': '#2d5a3d',
      'Women': '#8b3a8b',
      'Business': '#d97706',
      'Education': '#1e5a96',
      'Health': '#10b981',
      'Senior Citizens': '#6366f1',
      'Youth': '#ec4899',
      'Housing': '#f59e0b',
      'General': '#06b6d4'
    };
    return colors[category] || '#003366';
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          {/* Top Banner */}
          <div className="top-banner">
            🇮🇳 भारत सरकार | Government of India | LOKSEVA — Powered by Firecrawl · Gemini · LangGraph
          </div>

          <div className="app-container">
            {/* Left Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-header">
                <div className="logo">🏛️</div>
                <h1>LOKSEVA</h1>
                <p>Smart Scheme Finder for Every Citizen</p>
              </div>

              {/* Language Section */}
              <div className="sidebar-section">
                <h3>🌐 LANGUAGE</h3>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="language-select">
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Filters Section */}
              <div className="sidebar-section">
                <h3>🔍 SCHEME FILTERS</h3>
                
                <div className="filter-group">
                  <label>Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
                    <option value="">All categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>State / UT</label>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="filter-select">
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Income Level</label>
                  <div className="income-tags">
                    {selectedIncome && (
                      <span className="income-tag">
                        {selectedIncome}
                        <button onClick={() => setSelectedIncome('')}>✕</button>
                      </span>
                    )}
                    {!selectedIncome && (
                      <select value={selectedIncome} onChange={(e) => setSelectedIncome(e.target.value)} className="filter-select">
                        <option value="">All</option>
                        {incomes.map(inc => (
                          <option key={inc} value={inc}>{inc}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Section */}
              <div className="sidebar-section">
                <h3>👤 MY PROFILE</h3>
                {user ? (
                  <>
                    <p className="user-email">{user.email}</p>
                    <button className="profile-btn" onClick={() => navigate("/profile")}>
                      View Profile
                    </button>
                    <button className="logout-btn" onClick={signOut}>
                      Logout
                    </button>
                  </>
                ) : (
                  <button className="login-btn" onClick={signInWithGoogle}>
                    Login with Google
                  </button>
                )}
              </div>

              {/* Data Sync */}
              <div className="sidebar-section">
                <h3>☁️ DATA SYNC</h3>
                <button className="sync-btn">📊 Sync Live Schemes</button>
              </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
              {/* Header with Stats */}
              <div className="main-header">
                <div className="header-left">
                  <h1>LOKSEVA</h1>
                  <p>सरकारी योजना खोजें | Government Scheme Finder</p>
                </div>
                <div className="header-stats">
                  <div className="stat-badge">
                    <span className="number">10</span> Schemes
                  </div>
                  <div className="stat-badge">
                    <span className="number">8</span> Languages
                  </div>
                  <div className="stat-badge">
                    <span className="number">🛡️</span> Fraud Guard
                  </div>
                  <div className="stat-badge ai-badge">
                    <span className="number">✨</span> AI Powered
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <section className="hero-section">
                <h2>🏛️ Find Your Government Benefit</h2>
                <p>Discover schemes you're entitled to — in your language, instantly.</p>
                <div className="hero-stats">
                  <div className="stat-pill">
                    <span>10+</span> Active Schemes
                  </div>
                  <div className="stat-pill">
                    <span>9</span> Categories
                  </div>
                  <div className="stat-pill">
                    <span>8</span> Languages
                  </div>
                  <div className="stat-pill">
                    <span>AI</span> Fraud Protection
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
                  onClick={() => setActiveTab('browse')}
                >
                  📋 Browse Schemes
                </button>
                <button
                  className={`tab ${activeTab === 'assistant' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assistant')}
                >
                  🤖 AI Assistant + Voice
                </button>
                <button
                  className={`tab ${activeTab === 'fraud' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fraud')}
                >
                  🗺️ Fraud Heatmap
                </button>
              </div>

              {/* Available Schemes */}
              {activeTab === 'browse' && (
                <div className="schemes-container">
                  <h3>📋 Available Schemes</h3>
                  {isLoading ? (
                    <div className="loading">Loading schemes...</div>
                  ) : filteredSchemes.length > 0 ? (
                    <div className="schemes-grid">
                      {filteredSchemes.map((scheme) => (
                        <div key={scheme._id} className="scheme-card">
                          <div className="card-header" style={{ backgroundColor: getCategoryColor(scheme.category) }}>
                            <div className="card-category">⭐ {scheme.category.toUpperCase()}</div>
                            <h3 className="card-title">{scheme.scheme_name}</h3>
                          </div>
                          <div className="card-body">
                            <p className="card-summary">{scheme.summary}</p>
                            <div className="card-meta">
                              <span className="meta-tag">📍 {scheme.state}</span>
                              <span className="meta-tag">💰 {scheme.income_level}</span>
                            </div>
                            <div className="eligibility-score">
                              <div className="score-label">Your Eligibility Score: <strong>{scheme.eligibility_score}%</strong></div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${scheme.eligibility_score}%` }}></div>
                              </div>
                            </div>
                            <a href={scheme.application_link} className="btn-apply">
                              Apply Now →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-schemes">No schemes found matching your filters.</div>
                  )}
                </div>
              )}

              {activeTab === 'assistant' && (
                <div className="tab-content">
                  <h3>🤖 AI Assistant + Voice</h3>
                  <p>Chat with our AI assistant or use voice search to find schemes.</p>
                </div>
              )}

              {activeTab === 'fraud' && (
                <div className="tab-content">
                  <h3>🗺️ Fraud Heatmap</h3>
                  <p>View fraud alerts and scams related to government schemes.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      }/>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;