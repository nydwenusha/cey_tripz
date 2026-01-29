import React from 'react';
import { Box, Typography } from '@mui/material';

const PageContainer = ({ title, children, ...props }) => {
  return (
    <Box sx={{ p: 0 }} {...props}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default PageContainer;