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
import EditArticle from './pages/EditArticle';
import SavedArticles from './pages/SavedArticles';
import { AuthProvider, useAuth } from './context/AuthContext';

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return null; // or a loading spinner
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
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
            element={<PrivateRoute><Profile /></PrivateRoute>} 
          />
          <Route 
            path="/settings" 
            element={<PrivateRoute><Settings /></PrivateRoute>} 
          />
          <Route 
            path="/write" 
            element={<PrivateRoute><WriteArticle /></PrivateRoute>} 
          />
          <Route 
            path="/edit-article/:id" 
            element={<PrivateRoute><EditArticle /></PrivateRoute>} 
          />
          <Route 
            path="/article/:id" 
            element={<PrivateRoute><ArticleDetail /></PrivateRoute>} 
          />
          <Route 
            path="/" 
            element={<PrivateRoute><HomePage /></PrivateRoute>} 
          />
          <Route 
            path="/saved-articles" 
            element={<PrivateRoute><SavedArticles /></PrivateRoute>} 
          />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;