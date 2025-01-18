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
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getArticlesFeed, saveArticle, unsaveArticle, checkIfArticleSaved, chatWithArticle } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Bookmark, BookmarkBorder, Send, Chat, Close } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [savedStates, setSavedStates] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesFeed();
        setArticles(data);
        // Check saved state for each article
        const savedStatesObj = {};
        for (const article of data) {
          const isSaved = await checkIfArticleSaved(article.id);
          savedStatesObj[article.id] = isSaved;
        }
        setSavedStates(savedStatesObj);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const formatArticleDate = (dateString) => {
    return formatDate(dateString);
  };

  const handleSaveToggle = async (articleId) => {
    try {
      if (savedStates[articleId]) {
        await unsaveArticle(articleId);
      } else {
        await saveArticle(articleId);
      }
      // Update saved state
      setSavedStates(prev => ({
        ...prev,
        [articleId]: !prev[articleId]
      }));
    } catch (error) {
      console.error('Error toggling save state:', error);
    }
  };

  const handleChatOpen = (article) => {
    setSelectedArticle(article);
    setMessages([]);
  };

  const handleChatClose = () => {
    setSelectedArticle(null);
    setMessages([]);
    setNewMessage('');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedArticle) return;

    setLoading(true);
    const userMessage = newMessage;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setNewMessage('');

    try {
      const response = await chatWithArticle(selectedArticle.id, userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      setMessages(prev => [...prev, { text: 'Bir hata oluştu. Lütfen tekrar deneyin.', isUser: false }]);
    } finally {
      setLoading(false);
    }
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
                      {formatArticleDate(article.created_at)}
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

              <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  onClick={() => handleChatOpen(article)}
                  sx={{
                    color: '#3498db',
                    borderColor: '#3498db',
                    '&:hover': {
                      borderColor: '#2980b9',
                      backgroundColor: 'rgba(52, 152, 219, 0.1)'
                    }
                  }}
                >
                  Chat with Article
                </Button>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleSaveToggle(article.id)}
                    sx={{
                      color: savedStates[article.id] ? '#3498db' : 'text.secondary'
                    }}
                  >
                    {savedStates[article.id] ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                  <Button 
                    variant="contained"
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#2980b9'
                      }
                    }}
                  >
                    Read More
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedArticle}
        onClose={handleChatClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '60vh',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <IconButton
            onClick={handleChatClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#2c3e50'
            }}
          >
            <Close />
          </IconButton>
          
          <Typography variant="h6" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold', pr: 4 }}>
            Chat with Article: {selectedArticle?.title}
          </Typography>

          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: message.isUser ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '10px'
                    }}
                  >
                    <ListItemText primary={message.text} />
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Makale hakkında bir soru sorun..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={loading || !newMessage.trim()}
              sx={{
                minWidth: '100px',
                bgcolor: '#3498db',
                '&:hover': {
                  bgcolor: '#2980b9'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : <Send />}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default HomePage; 