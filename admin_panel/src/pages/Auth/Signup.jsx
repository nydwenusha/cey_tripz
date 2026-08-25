import React, { useContext, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Container,
    Typography,
    Paper,
    Grid,
    Alert,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Signup.scss';
import { AuthContext } from '../../services/auth/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'admin',
        status: 'active'
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const { register } = useContext(AuthContext);

    const roles = [
        { value: 'admin', label: 'Admin' },
        { value: 'tourist', label: 'Tourist' },
        { value: 'guide', label: 'Travel Guide' },
        { value: 'agent', label: 'Travel Agent' }
    ];

    const statuses = [
        { value: 'active', label: 'Active' },
        { value: 'deactive', label: 'Deactive' },
        { value: 'banned', label: 'Banned' }
    ];

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,14}$/;
        if (!formData.phone_number) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone_number.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone_number = 'Please enter a valid phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {

            const result = await register(formData);
            console.log('1');
            if (!result.successs) {
                const messages = result.message || {};
                setErrors({
                    name: messages.name || '',
                    email: messages.email || '',
                    phone_number: messages.phone_number || '',
                    password: messages.password || '',
                });
            }
            console.log('1');
            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone_number: '',
                password: '',
                role: 'admin',
                status: 'active'
            });
            console.log('3');

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Registration failed. Please try again.'
            });
            console.log(error);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({
            ...prev,
            phone_number: value
        }));
    };

    const formatPhoneNumber = (phone_number) => {
        if (!phone_number) return ''; // safe check
        const cleaned = phone_number.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const intlCode = match[1] ? `+${match[1]}` : '';
            const first = match[2] ? ` ${match[2]}` : '';
            const second = match[3] ? `-${match[3]}` : '';
            return `${intlCode}${first}${second}`;
        }
        return phone_number; // fallback
    };

    return (
        <Container maxWidth="md" className="signup-container">
            <Paper elevation={3} className="signup-paper">
                <Box className="signup-header">
                    <Typography variant="h4" component="h1" className="signup-title">
                        Create Account
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="signup-subtitle">
                        Register for your travel management system account
                    </Typography>
                </Box>

                {submitStatus && (
                    <Alert
                        severity={submitStatus.type}
                        className="signup-alert"
                        onClose={() => setSubmitStatus(null)}
                    >
                        {submitStatus.message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className="signup-form">
                    <Grid container spacing={3}>
                        {/* Name Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                                variant="outlined"
                                className="signup-field"
                            />
                        </Grid>

                        {/* Email Field */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                                variant="outlined"
                                className="signup-field"
                            />
                        </Grid>

                        {/* Phone Number Field */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone_number"
                                value={formatPhoneNumber(formData.phone_number)}
                                onChange={handlePhoneChange}
                                error={!!errors.phone_number}
                                helperText={errors.phone_number}
                                required
                                variant="outlined"
                                className="signup-field"
                                placeholder="+1 234-5678"
                            />
                        </Grid>

                        {/* Password Field */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                                variant="outlined"
                                className="signup-field"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        {/* Confirm Password Field */}
                        {/* <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                required
                                variant="outlined"
                                className="signup-field"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid> */}

                        {/* Role Field */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" className="signup-field">
                                <InputLabel>Role *</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    label="Role *"
                                    required
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status Field */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" className="signup-field">
                                <InputLabel>Status *</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    label="Status *"
                                    required
                                >
                                    {statuses.map((status) => (
                                        <MenuItem key={status.value} value={status.value}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                className="signup-button"
                            >
                                Create Account
                            </Button>
                        </Grid>

                        {/* Additional Info */}
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" align="center">
                                By registering, you agree to our Terms of Service and Privacy Policy
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;