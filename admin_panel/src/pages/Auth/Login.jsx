import React, { useContext, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  FlightTakeoff
} from '@mui/icons-material';
import './Login.scss';
import { AuthContext } from '../../services/auth/AuthState';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validateForm()) {
      return;
    }

    setAlert({ show: false, type: 'error', message: '' });
    setLoading(true);

    try {

      const result = await login({ email: formData.email.trim(), password: formData.password });
      if (!result.success) {
        setAlert({ show: true, type: 'error', message: result.message || 'Login failed.' });
        return;
      }

      navigate('/dashboard');

    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Login failed. Please try again.'
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="login-page">
      {/* Sri Lanka travel background */}
      <div className="srilanka-background"></div>

      <div className="login-container">
        <Paper className="login-card" elevation={6}>

          <Box className="login-header">
            <img src="/favicon.png" width="50px" alt="CeyTripz Logo" className="logo-image" />
            {/* <Box className="logo">
              <Typography variant="h6" className="logo-text">
                CeyTripz
              </Typography>
            </Box> */}
            <Typography variant="h6" className="login-title">
              Welcome to CeyTripz!!
            </Typography>
            <Typography variant="body2" className="login-subtitle">
              Sign in to continue
            </Typography>
          </Box>

          {alert.show && (
            <Alert
              severity={alert.type}
              className="login-alert"
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              fullWidth
              label="Email"
              name="email"
              autoComplete="username"
              disabled={loading}
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="dense"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              autoComplete="current-password"
              disabled={loading}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="dense"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />



            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              disabled={loading}
              size="medium"
              sx={{color:'white !important'}}
            >
              {loading && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>



          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Login;