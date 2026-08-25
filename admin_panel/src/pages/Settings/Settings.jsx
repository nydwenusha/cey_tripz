import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import MainLayout from '../../MainLayout';

const Settings = () => {
  return (

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            General Settings
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                defaultValue="Cey Tripz"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                defaultValue="admin@ceytripz.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website URL"
                defaultValue="https://ceytripz.com"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary">
              Save Settings
            </Button>
          </Box>
        </Paper>
      </Container>
   
  );
};

export default Settings;