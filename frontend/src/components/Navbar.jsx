import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setUserProfile(null);
    handleClose();
    navigate('/login', { replace: true });
  };

  const getUserDisplayName = () => {
    if (!userProfile) return 'Profile';
    if (userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return userProfile.username;
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#c6d2cf' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: '#2c3e50',
            fontWeight: 'bold'
          }}
        >
          Personal Blog
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 2,
            color: '#2c3e50',
            fontStyle: 'italic',
            textAlign: 'center',
            fontFamily: 'Georgia, serif',
            fontSize: '1.3rem'
          }}
        >
          "Knowledge transcends its ordinariness and reaches infinity when shared."
        </Typography>

        {isLoggedIn ? (
          <Box>
            <Button
              startIcon={<CreateIcon />}
              variant="contained"
              sx={{
                mr: 2,
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
              component={Link}
              to="/write"
            >
              Write
            </Button>
            <IconButton
              onClick={handleMenu}
              sx={{ 
                textTransform: 'none',
                color: '#2c3e50',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#2c3e50', fontSize: '0.875rem' }}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" sx={{ ml: 1, color: '#2c3e50' }}>
                {getUserDisplayName()}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => navigate('/write')}>
                Write Article
              </MenuItem>
              <MenuItem onClick={() => navigate('/profile')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/saved-articles')}>
                Saved Articles
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;