import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getArticleById } from '../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error('Makale yüklenirken hata:', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Makale yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2 }}
          title="Geri Dön"
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>
          {article.title}
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          {article.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {new Date(article.created_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" sx={{ 
          mb: 4, 
          lineHeight: 1.8,
          color: '#2c3e50',
          whiteSpace: 'pre-wrap'
        }}>
          {article.content}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ArticleDetail; 