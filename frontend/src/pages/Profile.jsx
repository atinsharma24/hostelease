import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';
import { Person, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hostelBlock: user?.hostelBlock || '',
    roomNumber: user?.roomNumber || '',
    roomType: user?.roomType || '',
    acType: user?.acType || '',
    hostelType: user?.hostelType || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      hostelBlock: user?.hostelBlock || '',
      roomNumber: user?.roomNumber || '',
      roomType: user?.roomType || '',
      acType: user?.acType || '',
      hostelType: user?.hostelType || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
        My Profile
      </Typography>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
              color: 'white',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '2.5rem'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} • {user?.email}
            </Typography>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h3">
                  Personal Information
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Person />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing} sx={{ mb: 2 }}>
                    <InputLabel>Hostel Block</InputLabel>
                    <Select
                      name="hostelBlock"
                      value={formData.hostelBlock}
                      onChange={handleChange}
                      label="Hostel Block"
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'].map((block) => (
                        <MenuItem key={block} value={block}>Block {block}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Room Number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing} sx={{ mb: 2 }}>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleChange}
                      label="Room Type"
                    >
                      <MenuItem value="1-bedded">1-Bedded</MenuItem>
                      <MenuItem value="2-bedded">2-Bedded</MenuItem>
                      <MenuItem value="3-bedded">3-Bedded</MenuItem>
                      <MenuItem value="4-bedded">4-Bedded</MenuItem>
                      <MenuItem value="6-bedded">6-Bedded</MenuItem>
                      <MenuItem value="8-bedded">8-Bedded</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing} sx={{ mb: 2 }}>
                    <InputLabel>AC Type</InputLabel>
                    <Select
                      name="acType"
                      value={formData.acType}
                      onChange={handleChange}
                      label="AC Type"
                    >
                      <MenuItem value="AC">AC</MenuItem>
                      <MenuItem value="Non-AC">Non-AC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={!isEditing} sx={{ mb: 2 }}>
                    <InputLabel>Hostel Type</InputLabel>
                    <Select
                      name="hostelType"
                      value={formData.hostelType}
                      onChange={handleChange}
                      label="Hostel Type"
                    >
                      <MenuItem value="Men's">Men's Hostel</MenuItem>
                      <MenuItem value="Women's">Women's Hostel</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Profile Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Chip 
                  label={user?.isActive ? 'Active' : 'Inactive'} 
                  color={user?.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Login
                </Typography>
                <Typography variant="body1">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
