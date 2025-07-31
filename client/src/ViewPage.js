import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

// Enhanced emoji icons with more variety
const icons = [
  '💡', '🧑‍💻', '📚', '🛠️', '🌐', '🎨', '🔬', '📈', '📝', '🚀', 
  '🔗', '🧩', '📦', '🗂️', '🧠', '🎯', '🧪', '🗣️', '📊', '🎮',
  '⚡', '🎭', '📐', '🔮', '🌟', '💎', '🏆', '🎪', '🎨', '🎵'
];

function ViewPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://communitypost-5g0u.onrender.com/api/domains")
      .then(res => res.json())
      .then(data => {
        setDomains(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching domains:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="view-container">
      <h1 className="page-title">
        <span className="emoji">🚀</span>
        <span>Explore Domains</span>
      </h1>
      <p className="page-subtitle">
        Discover educational resources organized by subject areas
      </p>
      
      <div className="section-divider"></div>
      
      {loading && (
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          textAlign: 'center',
          marginBottom: 'var(--space-xl)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}>
            <div className="loading-spinner">⏳</div>
            Loading domains...
          </div>
          <div className="loading-skeleton" style={{ height: '80px', marginBottom: '1.5rem' }}></div>
          <div className="loading-skeleton" style={{ height: '80px', marginBottom: '1.5rem' }}></div>
          <div className="loading-skeleton" style={{ height: '80px', marginBottom: '1.5rem' }}></div>
        </div>
      )}
      
      {!loading && domains.length === 0 && (
        <div style={{
          marginTop: '2rem', 
          color: 'var(--text-secondary)', 
          fontSize: '1.2rem',
          textAlign: 'center',
          padding: 'var(--space-xl)',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius-xl)',
          backdropFilter: 'var(--glass-blur)'
        }}>
          No domains available yet. 🌱
        </div>
      )}
      
      {!loading && domains.length > 0 && (
        <div className="domains-grid">
          {domains.map((domain, idx) => (
            <div
              key={domain._id}
              className="link-card domain-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate(`/domain/${encodeURIComponent(domain.name)}`)}
            >
              <span className="domain-icon">{icons[idx % icons.length]}</span>
              <div>
                <h3>{domain.name}</h3>
                <p>Click to view resources in this domain</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewPage;
