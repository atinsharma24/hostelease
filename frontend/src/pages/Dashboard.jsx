import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import {
  Home,
  CleaningServices,
  LocalLaundryService,
  ElectricalServices,
  Build,
  Wifi,
  Restaurant,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const services = [
    {
      title: 'Room Allocation',
      description: 'Request room changes or view current allocation',
      icon: <Home sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      path: '/service/room-allocation'
    },
    {
      title: 'Cleaning Services',
      description: 'Request room cleaning or maintenance',
      icon: <CleaningServices sx={{ fontSize: 40 }} />,
      color: '#2196f3',
      path: '/service/cleaning'
    },
    {
      title: 'Laundry Services',
      description: 'Schedule laundry pickup and delivery',
      icon: <LocalLaundryService sx={{ fontSize: 40 }} />,
      color: '#ff9800',
      path: '/service/laundry'
    },
    {
      title: 'Electrical Services',
      description: 'Report electrical issues or repairs',
      icon: <ElectricalServices sx={{ fontSize: 40 }} />,
      color: '#f44336',
      path: '/service/electrical'
    },
    {
      title: 'Carpenter Services',
      description: 'Request furniture repairs or maintenance',
      icon: <Build sx={{ fontSize: 40 }} />,
      color: '#795548',
      path: '/service/carpenter'
    },
    {
      title: 'WiFi Support',
      description: 'Report connectivity issues',
      icon: <Wifi sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/service/wifi'
    },
    {
      title: 'Mess Complaints',
      description: 'Submit food quality feedback',
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: '#607d8b',
      path: '/service/mess'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'rgba(255,255,255,0.2)',
              fontSize: '1.5rem'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Block {user?.hostelBlock} • Room {user?.roomNumber} • {user?.roomType}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
          Manage your hostel life efficiently with HostelEase. Request services, track maintenance, 
          and stay connected with all the amenities you need for a comfortable stay.
        </Typography>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="primary" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Services Grid */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Available Services
      </Typography>

      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    color: service.color
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(service.path)}
                  sx={{
                    background: service.color,
                    '&:hover': {
                      background: service.color,
                      opacity: 0.8
                    }
                  }}
                >
                  Access Service
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/my-requests')}
            startIcon={<DashboardIcon />}
          >
            View My Requests
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/profile')}
            startIcon={<DashboardIcon />}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
