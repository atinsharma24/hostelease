import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const ServiceRequest = () => {
  const { type } = useParams();
  const [serviceType, setServiceType] = useState(type);
  const [description, setDescription] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceType || !description) {
        alert("All fields are required");
        return;
    }
    // Submit form
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {getServiceTitle(type)}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This service request form is under development. Coming soon!
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Service Type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <option value="">Select a service</option>
            <option value="room-allocation">Room Allocation</option>
            <option value="cleaning">Cleaning Services</option>
            <option value="laundry">Laundry Services</option>
            <option value="electrical">Electrical Services</option>
            <option value="carpenter">Carpenter Services</option>
            <option value="wifi">WiFi Support</option>
            <option value="mess">Mess Complaints</option>
          </TextField>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Submit Request
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ServiceRequest;
