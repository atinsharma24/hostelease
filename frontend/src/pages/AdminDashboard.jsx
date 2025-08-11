import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive admin panel for managing users and services. Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
