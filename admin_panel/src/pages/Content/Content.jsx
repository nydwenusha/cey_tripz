import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import MainLayout from '../../MainLayout';

const Content = () => {
  return (
   
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Content Management
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Website Content
          </Typography>
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="textSecondary">
              Content management interface will be implemented here
            </Typography>
          </Box>
        </Paper>
      </Container>
    
  );
};

export default Content;