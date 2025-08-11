import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const MyRequests = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Service Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your service requests and their status. Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default MyRequests;
