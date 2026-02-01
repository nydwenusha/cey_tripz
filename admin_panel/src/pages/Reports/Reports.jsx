import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
} from '@mui/material';

const Reports = () => {
  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generate Reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined">Sales Report</Button>
              <Button variant="outlined">Booking Report</Button>
              <Button variant="outlined">Customer Report</Button>
              <Button variant="outlined">Revenue Report</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">
                Analytics charts will be displayed here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </MainLayout>
  );
};

export default Reports;