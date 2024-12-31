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
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
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

    fetchArticles();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#2c3e50', fontWeight: 'bold' }}>
        My Articles
      </Typography>

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
                {article.content.substring(0, 150)}...
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
                    color: '#f39c12',
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