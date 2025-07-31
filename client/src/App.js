import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PostPage from './PostPage';
import ViewPage from './ViewPage';
import LoginPage from './LoginPage';
import { AuthProvider, AuthContext } from './AuthContext';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import PrivateRoute from './PrivateRoute'; 
import DomainPostsPage from './DomainPostsPage';
import Footer from './Footer';

import './App.css';

function ThemeEffect() {
  const { darkMode } = useContext(ThemeContext);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll progress indicator
  React.useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progressBar = document.getElementById('scrollProgressBar');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return null;
}

function Header() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header">
      <div
        className="title"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={require('./assets/codeboosters-logo.png')} 
          alt="Codeboosters Logo" 
          className="header-logo"
        />
        Codeboosters Community
      </div>
      <div className="actions">
        {token ? (
          // Logged in - show Create and Logout buttons
          <>
            <button
              className="button"
              onClick={() => navigate('/post')}
              title="Create New Post"
            >
              ✏️ Create
            </button>
            <button
              className="button"
              onClick={handleLogout}
              title="Logout"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          // Not logged in - show Login button
          <button
            className="button"
            onClick={() => navigate('/login')}
            title="Teacher Login"
          >
            👨‍🏫 Login
          </button>
        )}
        <button
          className="button"
          onClick={() => setDarkMode(prev => !prev)}
          title="Toggle Theme"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <div className="app-container">
      <div className="scroll-progress">
        <div className="scroll-progress-bar" id="scrollProgressBar"></div>
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<ViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/domain/:domainName" element={<DomainPostsPage />} />

        <Route
          path="/post"
          element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeEffect />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
