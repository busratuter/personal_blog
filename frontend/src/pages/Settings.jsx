import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Alert,
  Divider,
  CircularProgress,
  Grid
} from '@mui/material';
import { getUserProfile, updateUserProfile, updatePassword } from '../services/api';

const Settings = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Loading user data...');
        const response = await getUserProfile();
        console.log('User data received:', response);
        setUserData(response);
      } catch (error) {
        console.error('Error details:', error);
        setMessage({ 
          type: 'error', 
          text: error.detail || 'Failed to load user data. Please try again.' 
        });
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Updating profile with data:', userData);
      await updateUserProfile(userData);
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.detail || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.detail || 'Failed to update password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#2c3e50', fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#34495e' }}>
              Profile Information
            </Typography>
            <form onSubmit={handleProfileUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={userData.first_name || ''}
                    onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={userData.last_name || ''}
                    onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    variant="outlined"
                    margin="normal"
                    disabled={loading}
                    required
                  />
                </Grid>
                {message.text && (
                  <Grid item xs={12}>
                    <Alert 
                      severity={message.type} 
                      sx={{ mt: 2 }}
                      onClose={() => setMessage({ type: '', text: '' })}
                    >
                      {message.text}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#34495e' }}>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwords.current_password}
                onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                variant="outlined"
                margin="normal"
                disabled={loading}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                variant="outlined"
                margin="normal"
                disabled={loading}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwords.confirm_password}
                onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                variant="outlined"
                margin="normal"
                disabled={loading}
                required
              />

              {message.text && (
                <Alert 
                  severity={message.type} 
                  sx={{ mt: 2 }}
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Change Password'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings; 