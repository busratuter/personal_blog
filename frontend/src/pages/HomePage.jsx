import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getArticlesFeed } from '../services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

const HomePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesFeed();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
        py: 8,
        px: 2,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(44, 62, 80, .3)'
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Welcome to Your Blog
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9 }}>
          Discover stories from other writers
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} key={article.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#3498db',
                      width: 40,
                      height: 40
                    }}
                  >
                    {article.author?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {article.author?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {formatDate(article.created_at)}
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}
                >
                  {article.title}
                </Typography>

                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {article.content}
                </Typography>

                {article.category && (
                  <Chip 
                    label={article.category}
                    size="small"
                    sx={{ 
                      backgroundColor: '#e1f5fe',
                      color: '#0288d1',
                      fontWeight: 'medium'
                    }}
                  />
                )}
              </CardContent>

              <Divider sx={{ my: 1 }} />

              <CardActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained"
                  onClick={() => navigate(`/article/${article.id}`)}
                  sx={{
                    backgroundColor: '#e2e2e2',
                    color: '#805b10',
                    '&:hover': {
                      backgroundColor: '#ffffd'
                    }
                  }}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage; 