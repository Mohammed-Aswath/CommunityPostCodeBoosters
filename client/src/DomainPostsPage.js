import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function DomainPostsPage() {
  const { domainName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://communitypost-5g0u.onrender.com/api/links")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(link => link.domain === domainName);
        setPosts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, [domainName]);

  return (
    <div className="view-container">
      <button 
        className="button secondary" 
        onClick={() => navigate('/')}
        style={{ 
          alignSelf: 'flex-start', 
          marginBottom: 'var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)'
        }}
      >
        ← Back to Domains
      </button>
      
      <h1 className="page-title">📌 {domainName}</h1>
      <p className="page-subtitle">Educational resources in {domainName}</p>
      
      <div className="section-divider"></div>
      
      {loading && (
        <div style={{ 
          width: '100%', 
          maxWidth: '600px',
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
            <div className="loading-spinner">📂</div>
            Loading {domainName} resources...
          </div>
          <div className="loading-skeleton" style={{ height: '120px', marginBottom: '1.5rem' }}></div>
          <div className="loading-skeleton" style={{ height: '120px', marginBottom: '1.5rem' }}></div>
          <div className="loading-skeleton" style={{ height: '120px', marginBottom: '1.5rem' }}></div>
        </div>
      )}
      
      {!loading && posts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius-xl)',
          backdropFilter: 'var(--glass-blur)',
          color: 'var(--text-secondary)',
          fontSize: '1.2rem'
        }}>
          No posts found for this domain yet. 🌱<br/>
          <button 
            className="button primary" 
            onClick={() => navigate('/post')}
            style={{ marginTop: 'var(--space-lg)' }}
          >
            Create First Post
          </button>
        </div>
      ) : (
        !loading && posts.map((link, idx) => (
          <div 
            key={link._id} 
            className="link-card"
            style={{ 
              animationDelay: `${idx * 0.1}s`,
              maxWidth: '700px'
            }}
          >
            <div>
              <h3>{link.title}</h3>
              <p>{link.description}</p>

              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-md)', 
                marginTop: 'var(--space-md)',
                flexWrap: 'wrap'
              }}>
                {link.fileUrl && (
                  <a
                    href={link.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="button secondary"
                    style={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)'
                    }}
                  >
                    ⬇️ Download File
                  </a>
                )}
                {link.url && (
                  <a
                    href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button primary"
                    style={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)'
                    }}
                  >
                    🔗 Visit Link
                  </a>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DomainPostsPage;
