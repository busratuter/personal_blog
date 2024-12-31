import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import WriteArticle from './pages/WriteArticle';
import Settings from './pages/Settings';
import HomePage from './pages/HomePage';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated && window.location.pathname !== '/login') {
    window.location.href = '/login';
    return null;
  }

  return (
    <Router>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        {isAuthenticated && <Navbar />}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/write" 
              element={isAuthenticated ? <WriteArticle /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/article/:id" 
              element={isAuthenticated ? <ArticleDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;