import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  Box, 
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/api';
import api from '../services/api';

const WriteArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setSnackbar({
          open: true,
          message: 'Failed to load categories',
          severity: 'error'
        });
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!article.category_id) {
      setShowCategoryError(true);
      setSnackbar({
        open: true,
        message: 'Please select a category!',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      await createArticle(article);
      setSnackbar({
        open: true,
        message: 'Article published successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Makale oluşturma hatası:', error);
      if (error.response?.status === 401 || error.detail === "Invalid token") {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setSnackbar({
        open: true,
        message: error.detail || 'Makale oluşturulurken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          Write New Article
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              required
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            <TextField
              fullWidth
              label="Content"
              multiline
              rows={15}
              variant="outlined"
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              required
              disabled={loading}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />

            <TextField
              select
              fullWidth
              label="Category"
              variant="outlined"
              value={article.category_id}
              onChange={(e) => {
                setArticle({ ...article, category_id: e.target.value });
                setShowCategoryError(false);
              }}
              required
              disabled={loading}
              error={showCategoryError}
              helperText={showCategoryError ? "Category selection is required" : ""}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                },
                '& .Mui-error': {
                  color: 'error.main'
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'error.main'
                }
              }}
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: '#2196F3',
                  '&:hover': {
                    backgroundColor: '#1976D2'
                  },
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Publish'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WriteArticle;