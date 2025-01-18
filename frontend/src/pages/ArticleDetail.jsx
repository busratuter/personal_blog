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
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Chat, Send } from '@mui/icons-material';
import { getArticleById, chatWithArticle } from '../services/api';
import { formatDate } from '../utils/dateUtils';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  const formatArticleDate = (dateString) => {
    return formatDate(dateString);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    const userMessage = newMessage;
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setNewMessage('');

    try {
      const response = await chatWithArticle(id, userMessage);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      setMessages(prev => [...prev, { text: 'Bir hata oluştu. Lütfen tekrar deneyin.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

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
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }} title="Geri Dön">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>
          {article.title}
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          {article.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {formatArticleDate(article.created_at)}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: '#2c3e50', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Chat />}
            onClick={() => setChatOpen(!chatOpen)}
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
        </Box>
      </Paper>

      <Collapse in={chatOpen} sx={{ mb: 4 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            mx: 'auto',
            maxWidth: '60%',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>
            Ask About the Article
          </Typography>

          <Box sx={{ height: '300px', overflow: 'auto', mb: 3 }}>
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
        </Paper>
      </Collapse>
    </Container>
  );
};

export default ArticleDetail; 