import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const ServiceRequest = () => {
  const { type } = useParams();

  const getServiceTitle = (type) => {
    const titles = {
      'room-allocation': 'Room Allocation',
      'cleaning': 'Cleaning Services',
      'laundry': 'Laundry Services',
      'electrical': 'Electrical Services',
      'carpenter': 'Carpenter Services',
      'wifi': 'WiFi Support',
      'mess': 'Mess Complaints'
    };
    return titles[type] || 'Service Request';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getServiceTitle(type)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This service request form is under development. Coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default ServiceRequest;
