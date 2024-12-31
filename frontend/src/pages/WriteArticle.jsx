import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, MenuItem, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const WriteArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/articles', article);
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create article');
    }
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
          Write a New Article
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
              onChange={(e) => setArticle({ ...article, category_id: e.target.value })}
              required
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
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
                Publish
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default WriteArticle;