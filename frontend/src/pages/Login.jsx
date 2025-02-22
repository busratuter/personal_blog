import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import { login as loginApi, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [alert, setAlert] = useState({ message: '', severity: 'error' });
  const [loading, setLoading] = useState(false);
  
  // Register dialog state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setAlert({ message: '', severity: 'error' });
    setLoading(true);

    if (!formData.username.trim() || !formData.password.trim()) {
      setAlert({ message: 'Lütfen tüm alanları doldurun', severity: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await loginApi(formData.username.trim(), formData.password);
      if (response && response.access_token) {
        authLogin(response.access_token);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({ 
        message: 'Kullanıcı adı veya şifre hatalı', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setRegisterLoading(true);
    try {
      await register(
        registerData.username.trim(),
        registerData.email.trim(),
        registerData.password
      );
      setRegisterOpen(false);
      setAlert({ 
        message: 'Registration successful! Please login.', 
        severity: 'success'
      });
    } catch (err) {
      console.error('Register error:', err);
      setRegisterError(err.detail || 'Registration failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper 
        sx={{ 
          maxWidth: '400px',
          width: '100%',
          mx: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }} 
        elevation={3}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            textAlign: 'center',
            color: '#1976d2',
            fontWeight: 'bold'
          }}
        >
          Sign In
        </Typography>

        <Box 
          component="form" 
          id="login-form"
          noValidate
          autoComplete="off"
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleSubmit(e);
            return false;
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
            disabled={loading}
          />
          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            disabled={loading}
          />

          {alert.message && (
            <Alert severity={alert.severity} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
            or
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setRegisterOpen(true)}
          sx={{
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          Create New Account
        </Button>
      </Paper>

      {/* Register Dialog */}
      <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Create New Account</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            handleRegisterSubmit(e);
          }} style={{ marginTop: '16px' }}>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              margin="normal"
            />
            <TextField
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              margin="normal"
            />

            {registerError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {registerError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setRegisterOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            form="register-form"
            variant="contained"
            disabled={registerLoading}
            onClick={(e) => {
              e.preventDefault();
              handleRegisterSubmit(e);
            }}
          >
            {registerLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;