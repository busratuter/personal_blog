import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api, { getMyArticles, deleteArticle } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category_id: '',
    file: null
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getMyArticles();
      setArticles(data);
    } catch (error) {
      console.error('Articles yüklenirken hata:', error);
      setSnackbar({
        open: true,
        message: 'Makaleler yüklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (articleId) => {
    navigate(`/edit-article/${articleId}`);
  };

  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedArticle) {
      try {
        await deleteArticle(selectedArticle.id);
        setArticles(articles.filter(article => article.id !== selectedArticle.id));
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Makale başarıyla silindi',
          severity: 'success'
        });
      } catch (error) {
        console.error('Makale silinirken hata:', error);
        setSnackbar({
          open: true,
          message: 'Makale silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setNewArticle({ ...newArticle, file: file });
    } else {
      setSnackbar({
        open: true,
        message: 'Lütfen sadece PDF veya TXT dosyası yükleyin',
        severity: 'error'
      });
    }
  };

  const handleUploadSubmit = async () => {
    if (!newArticle.title || !newArticle.category_id || !newArticle.file) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm alanları doldurun',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', newArticle.title);
    formData.append('category_id', newArticle.category_id);
    formData.append('file', newArticle.file);

    try {
      await api.post('/articles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadDialogOpen(false);
      fetchArticles();
      setNewArticle({ title: '', category_id: '', file: null });
      setSnackbar({
        open: true,
        message: 'Makale başarıyla yüklendi',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error uploading article:', error);
      setSnackbar({
        open: true,
        message: 'Makale yüklenirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 6,
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: '#2c3e50', 
            fontWeight: 'bold'
          }}
        >
          My Articles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{
            backgroundColor: '#3498db',
            '&:hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          Add Article
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {articles.map((article) => (
          <Card key={article.id} elevation={2} sx={{ minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h5" component="h2" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(article.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {article.content.substring(0, 300)}...
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {article.tags?.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              px: 2,
              py: 1,
              borderTop: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/article/${article.id}`)}
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: '#3498db',
                  '&:hover': {
                    backgroundColor: '#2980b9'
                  }
                }}
                size="small"
              >
                Read More
              </Button>

              <Box>
                <IconButton 
                  onClick={() => handleEdit(article.id)}
                  sx={{ 
                    color: '#007bff',
                    '&:hover': {
                      backgroundColor: 'rgba(243, 156, 18, 0.1)'
                    }
                  }}
                  title="Düzenle"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick(article)}
                  sx={{ 
                    color: '#e74c3c',
                    '&:hover': {
                      backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    }
                  }}
                  title="Sil"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Makaleyi Sil</DialogTitle>
        <DialogContent>
          Bu makaleyi silmek istediğinizden emin misiniz?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Article</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newArticle.category_id}
                onChange={(e) => setNewArticle({ ...newArticle, category_id: e.target.value })}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              accept=".pdf,.txt"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
              >
                {newArticle.file ? newArticle.file.name : 'Choose PDF or TXT file'}
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadSubmit}
            variant="contained"
            color="primary"
          >
            Upload
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

export default Profile;