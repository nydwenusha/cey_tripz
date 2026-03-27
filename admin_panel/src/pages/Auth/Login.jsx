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
  Alert
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
import { AuthContext } from '../../services/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      const result = await login(formData);
      if (!result.success) {
        const messages = result.message || {};
        setErrors({
          name: messages.name || '',
          email: messages.email || '',
          phone_number: messages.phone_number || '',
          password: messages.password || '',
        });
        return;
      }

      console.log('Login successful:', result);
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'admin',
        status: 'active'
      });
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

            {/* <Box className="form-options">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label="Remember me"
              />
              <Button size="small" className="forgot-link">
                Forgot password?
              </Button>
            </Box> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              disabled={loading}
              size="medium"
              sx={{color:'white !important'}}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Typography variant="body2" className="signup-text">
              Don't have an account? <Button className="signup-link">Sign up</Button>
            </Typography>

          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Login;