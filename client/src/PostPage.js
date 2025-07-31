// PostPage.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function PostPage() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [links, setLinks] = useState([]);
  const [domains, setDomains] = useState([]);
  const [editId, setEditId] = useState(null);

  const [newDomain, setNewDomain] = useState('');
  const [editingDomain, setEditingDomain] = useState(null);
  const [editingDomainName, setEditingDomainName] = useState('');
  const [expandedDomains, setExpandedDomains] = useState({});

  const linkAPI = "https://communitypost-5g0u.onrender.com/api/links";
  const domainAPI = "https://communitypost-5g0u.onrender.com/api/domains";
  const uploadAPI = "https://communitypost-5g0u.onrender.com/api/upload";

  useEffect(() => {
    fetchLinks();
    fetchDomains();
  }, []);

  const fetchLinks = async () => {
    const res = await fetch(linkAPI);
    const data = await res.json();
    setLinks(data);
  };

  const fetchDomains = async () => {
    const res = await fetch(domainAPI);
    const data = await res.json();
    setDomains(data);
  };

  const handleSubmit = async () => {
    if (!title || !domain) {
      alert("Please fill title and domain");
      return;
    }

    let fileUrl = null;
    let externalUrl = url;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadRes = await fetch(uploadAPI, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          fileUrl = uploadData.url;
        } else {
          alert("File upload failed");
          return;
        }
      } catch (err) {
        alert("Error during file upload");
        return;
      }
    }

    const method = editId ? 'PUT' : 'POST';
    const endpoint = editId ? `${linkAPI}/${editId}` : linkAPI;

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, url: externalUrl, fileUrl, domain }),
    });

    if (res.ok) {
      alert(editId ? "Link updated" : "Link posted");
      setTitle('');
      setDescription('');
      setUrl('');
      setFile(null);
      setDomain('');
      setEditId(null);
      fetchLinks();
    } else {
      alert("Error while posting/updating");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const res = await fetch(`${linkAPI}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Link deleted");
      fetchLinks();
    } else {
      alert("Delete failed");
    }
  };

  const handleEdit = (link) => {
    setEditId(link._id);
    setTitle(link.title);
    setDescription(link.description);
    setUrl(link.url);
    setDomain(link.domain);
    setFile(null);
  };

  const handleAddDomain = async () => {
    if (!newDomain) return;
    const res = await fetch(domainAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newDomain }),
    });
    if (res.ok) {
      setNewDomain('');
      fetchDomains();
    } else {
      alert("Error adding domain");
    }
  };

  const handleEditDomain = async (id) => {
    const res = await fetch(`${domainAPI}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editingDomainName }),
    });
    if (res.ok) {
      setEditingDomain(null);
      setEditingDomainName('');
      fetchDomains();
    } else {
      alert("Error updating domain");
    }
  };

  const handleDeleteDomain = async (id) => {
    if (!window.confirm("Delete this domain?")) return;
    const res = await fetch(`${domainAPI}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      fetchDomains();
    } else {
      alert("Error deleting domain");
    }
  };

  

  const groupedLinks = domains.reduce((acc, dom) => {
    acc[dom.name] = links.filter(link => link.domain === dom.name);
    return acc;
  }, {});

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
        ← Back to Home
      </button>
      
      <h1 className="page-title">
        <span className="emoji">✍️</span>
        <span>{editId ? "Edit Post" : "Create Post"}</span>
      </h1>
      <p className="page-subtitle">Share educational resources with the community</p>
      
      <div className="section-divider"></div>

      <form className="post-form" style={{ maxWidth: "600px", width: "100%" }}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows="4"
        />
        <input 
          type="text" 
          placeholder="Optional External URL" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
        />
        {editId && file === null && (
          <div style={{ 
            marginBottom: "var(--space-sm)", 
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            fontStyle: "italic"
          }}>
            Existing file will remain unless a new one is selected
          </div>
        )}
        <input 
          type="file" 
          onChange={e => setFile(e.target.files[0])} 
        />
        <select value={domain} onChange={e => setDomain(e.target.value)}>
          <option value="">Select Domain</option>
          {domains.map(d => (
            <option key={d._id} value={d.name}>{d.name}</option>
          ))}
        </select>
        <div className="button-group">
          <button 
            type="button"
            className="button primary" 
            onClick={handleSubmit}
          >
            {editId ? "Update Post" : "Create Post"}
          </button>
          {editId && (
            <button 
              type="button"
              className="button secondary" 
              onClick={() => {
                setEditId(null); setTitle(''); setDescription(''); setUrl(''); setFile(null); setDomain('');
              }}
            >
              Cancel
            </button>
          )}
          <button 
            type="button"
            className="button danger" 
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </form>

      <div className="section-divider"></div>
      
      <h2 className="section-title">🏷️ Manage Domains</h2>
      
      <div className="post-form" style={{ maxWidth: "600px", width: "100%" }}>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <input 
            type="text" 
            placeholder="New Domain Name" 
            value={newDomain} 
            onChange={e => setNewDomain(e.target.value)} 
            style={{ flexGrow: 1 }} 
          />
          <button 
            type="button"
            className="button primary" 
            onClick={handleAddDomain}
          >
            Add Domain
          </button>
        </div>
        
        <div style={{ marginTop: "var(--space-lg)" }}>
          {domains.map(d => (
            <div 
              key={d._id} 
              className="link-card" 
              style={{ 
                marginBottom: "var(--space-md)",
                maxWidth: "100%"
              }}
            >
              {editingDomain === d._id ? (
                <div style={{ 
                  display: "flex", 
                  gap: "var(--space-lg)", 
                  alignItems: "center",
                  width: "100%"
                }}>
                  <input 
                    type="text" 
                    value={editingDomainName} 
                    onChange={e => setEditingDomainName(e.target.value)}
                    style={{ flex: "1" }}
                  />
                  <div className="button-group" style={{ 
                    margin: 0, 
                    justifyContent: 'flex-end',
                    flexShrink: 0
                  }}>
                    <button 
                      type="button"
                      className="button secondary" 
                      onClick={() => handleEditDomain(d._id)}
                    >
                      Save
                    </button>
                    <button 
                      type="button"
                      className="button secondary" 
                      onClick={() => setEditingDomain(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  width: "100%",
                  gap: "var(--space-lg)"
                }}>
                  <span style={{ 
                    fontWeight: "600", 
                    color: "var(--text-primary)",
                    flex: "1"
                  }}>{d.name}</span>
                  <div className="button-group" style={{ 
                    margin: 0, 
                    justifyContent: 'flex-end',
                    flexShrink: 0
                  }}>
                    <button 
                      type="button"
                      className="button secondary" 
                      onClick={() => {
                        setEditingDomain(d._id);
                        setEditingDomainName(d.name);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      className="button danger" 
                      onClick={() => handleDeleteDomain(d._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider"></div>
      
      <h2 className="section-title">📎 Posts by Domain</h2>
      
      <div style={{ width: "100%", maxWidth: "700px" }}>
        {domains.map(d => (
          <div key={d._id} style={{ marginBottom: "var(--space-lg)" }}>
            <div 
              className="link-card"
              style={{ 
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onClick={() => setExpandedDomains(prev => ({ ...prev, [d.name]: !prev[d.name] }))}
            >
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                📁 {d.name} ({groupedLinks[d.name]?.length || 0} posts)
              </h3>
              <span style={{ fontSize: "1.2rem" }}>
                {expandedDomains[d.name] ? '▼' : '▶'}
              </span>
            </div>
            {expandedDomains[d.name] && groupedLinks[d.name]?.length > 0 ? (
              groupedLinks[d.name].map((link, idx) => (
                <div 
                  key={link._id} 
                  className="link-card" 
                  style={{ 
                    marginTop: "var(--space-md)",
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 var(--space-sm) 0", color: "var(--text-primary)" }}>
                      {link.title}
                    </h4>
                    <p style={{ margin: "0 0 var(--space-md) 0", color: "var(--text-secondary)" }}>
                      {link.description}
                    </p>
                    
                    <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
                      {link.fileUrl && (
                        <a 
                          href={link.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="button secondary"
                          style={{ textDecoration: "none" }}
                        >
                          📎 Download File
                        </a>
                      )}
                      {link.url && (
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="button primary"
                          style={{ textDecoration: "none" }}
                        >
                          🔗 Visit Link
                        </a>
                      )}
                    </div>
                    
                    <div className="button-group" style={{ margin: 0, justifyContent: 'flex-end' }}>
                      <button 
                        type="button"
                        className="button secondary" 
                        onClick={() => handleEdit(link)}
                      >
                        Edit
                      </button>
                      <button 
                        type="button"
                        className="button danger" 
                        onClick={() => handleDelete(link._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : expandedDomains[d.name] ? (
              <div style={{ 
                margin: "var(--space-md) 0", 
                padding: "var(--space-lg)",
                background: "var(--glass-bg)",
                borderRadius: "var(--radius-lg)",
                color: "var(--text-secondary)",
                textAlign: "center"
              }}>
                No posts in this domain yet.
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
