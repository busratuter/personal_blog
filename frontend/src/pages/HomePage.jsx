import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ color: '#2c3e50', fontWeight: 'bold', mb: 2 }}>
          Welcome to Your Blog
        </Typography>
        <Typography variant="h6" sx={{ color: '#7f8c8d' }}>
          Share your thoughts and stories with the world
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#34495e', lineHeight: 1.6 }}>
          Use the "Write" button in the navigation bar to create a new article.
          <br />
          View your articles by clicking on your profile icon and selecting "Profile".
        </Typography>
      </Paper>
    </Container>
  );
};

export default HomePage; 