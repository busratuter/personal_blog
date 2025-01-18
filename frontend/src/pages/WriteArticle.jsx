import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createArticle, generateArticle, searchCategories, createCategory } from '../services/api';
import api from '../services/api';

const WriteArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category_id: '',
  });
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
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
        const response = await searchCategories();
        setCategories(response);
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

  useEffect(() => {
    if (categoryInput.length >= 2) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(categoryInput.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [categoryInput, categories]);

  const handleCategorySelect = (category) => {
    setArticle(prev => ({ ...prev, category_id: category.id }));
    setCategoryInput(category.name);
    setFilteredCategories([]);
    setShowCategoryError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Now check if we have a category input
    if (!categoryInput.trim()) {
      setShowCategoryError(true);
      setSnackbar({
        open: true,
        message: 'Please enter a category name',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      let finalCategoryId = article.category_id;

      // If we don't have a category_id, we need to create or find the category
      if (!finalCategoryId) {
        // First check if a category with this name already exists
        const existingCategory = categories.find(
          cat => cat.name.toLowerCase() === categoryInput.trim().toLowerCase()
        );

        if (existingCategory) {
          // If it exists, use its ID
          finalCategoryId = existingCategory.id;
        } else {
          // If it doesn't exist, create a new one
          try {
            const newCategory = await createCategory(categoryInput.trim());
            finalCategoryId = newCategory.id;
            // Update categories list
            setCategories(prev => [...prev, newCategory]);
          } catch (error) {
            console.error('Category creation error:', error);
            let errorMessage = 'Failed to create new category';
            if (error.detail) {
              if (Array.isArray(error.detail)) {
                errorMessage = error.detail.map(err => err.msg).join(', ');
              } else if (typeof error.detail === 'object') {
                errorMessage = error.detail.msg || JSON.stringify(error.detail);
              } else {
                errorMessage = error.detail.toString();
              }
            }
            setSnackbar({
              open: true,
              message: errorMessage,
              severity: 'error'
            });
            setLoading(false);
            return;
          }
        }
      }

      // Now we have a valid category ID, create the article
      const articleToSubmit = {
        ...article,
        category_id: finalCategoryId
      };

      await createArticle(articleToSubmit);
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

      let errorMessage = 'Makale oluşturulurken bir hata oluştu';
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          errorMessage = error.detail.map(err => err.msg).join(', ');
        } else if (typeof error.detail === 'object') {
          errorMessage = error.detail.msg || JSON.stringify(error.detail);
        } else {
          errorMessage = error.detail.toString();
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a prompt',
        severity: 'warning'
      });
      return;
    }

    setGenerating(true);
    try {
      const generatedArticle = await generateArticle(prompt);
      
      // Find or create category based on the generated category name
      let categoryObj = categories.find(cat => 
        cat.name.toLowerCase() === generatedArticle.category.toLowerCase()
      );

      if (!categoryObj) {
        try {
          categoryObj = await createCategory(generatedArticle.category);
          setCategories([...categories, categoryObj]);
        } catch (error) {
          console.error('Category creation error:', error);
          let errorMessage = 'Failed to create category';
          
          if (error.detail) {
            if (Array.isArray(error.detail)) {
              errorMessage = error.detail.map(err => err.msg).join(', ');
            } else if (typeof error.detail === 'object') {
              errorMessage = error.detail.msg || JSON.stringify(error.detail);
            } else {
              errorMessage = error.detail.toString();
            }
          }

          setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error'
          });
          setGenerating(false);
          return;
        }
      }

      setArticle({
        title: generatedArticle.title,
        content: generatedArticle.content,
        category_id: categoryObj.id
      });
      setCategoryInput(categoryObj.name);

      setOpenDialog(false);
      setPrompt('');
      
      setSnackbar({
        open: true,
        message: 'Article generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Article generation error:', error);
      let errorMessage = 'Failed to generate article';
      
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          errorMessage = error.detail.map(err => err.msg).join(', ');
        } else if (typeof error.detail === 'object') {
          errorMessage = error.detail.msg || JSON.stringify(error.detail);
        } else {
          errorMessage = error.detail.toString();
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setGenerating(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            disabled={generating}
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
            {generating ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
        </Box>

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

            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                label="Category"
                variant="outlined"
                value={categoryInput}
                onChange={(e) => {
                  setCategoryInput(e.target.value);
                  if (showCategoryError && e.target.value.trim()) {
                    setShowCategoryError(false);
                  }
                }}
                required
                disabled={loading || creatingCategory}
                error={showCategoryError}
                helperText={showCategoryError ? "Please enter a category name" : "Type to search or create new category"}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
              {filteredCategories.length > 0 && (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    zIndex: 1000,
                    maxHeight: 200,
                    overflowY: 'auto',
                    mt: 1
                  }}
                >
                  <List>
                    {filteredCategories.map((category) => (
                      <ListItem 
                        key={category.id} 
                        button 
                        onClick={() => handleCategorySelect(category)}
                      >
                        <ListItemText primary={category.name} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading || creatingCategory}
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
                {loading || creatingCategory ? <CircularProgress size={24} /> : 'Publish'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>What do you want to write?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter your prompt"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={generating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} variant="contained" disabled={generating}>
            {generating ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

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