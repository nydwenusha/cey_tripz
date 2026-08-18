import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme, { darkTheme } from './theme';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ToursList from './pages/Tours/ToursList';
import TourEdit from './pages/Tours/TourEdit';
import Booking from './pages/Bookings/Booking';
import Customers from './pages/Customers/Customers';
import Payments from './pages/Payments/Payments';
import Content from './pages/Content/Content';
import Reviews from './pages/Reviews/Reviews';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Vehicles from './pages/Tours/Vehicles.jsx';
import AddVehicles from './pages/Tours/AddVehicles.jsx';
import BlogPostManagement from './pages/Content/BlogPostManagement.jsx';
import AddBlogPost from './pages/Content/AddBlogPost.jsx';

// Layout
import MainLayout from './MainLayout.jsx';

// Auth Context
import { AuthProvider } from './services/auth/AuthContext.jsx';

// Styles
import './styles/global.scss';
import ProtectedRoute from './services/ProtectedRoute.jsx';
import PublicRoute from './services/PublicRoute.jsx';

function App() {
    const [themeMode, setThemeMode] = useState('light');

    const currentTheme = useMemo(() => {
        return themeMode === 'dark' ? darkTheme : theme;
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    return (
        <AuthProvider>
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <Signup />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes with Layout */}
                        <Route element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/tours" element={<ToursList />} />
                            <Route path="/addtours" element={<TourEdit />} />
                            <Route path="/categories" element={<Navigate to="/tours" replace />} />
                            <Route path="/vehicles" element={<Vehicles />} />
                            <Route path="/AddVehicles" element={<AddVehicles />} />
                            <Route path="/bookings" element={<Booking />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/content/*" element={<Content />} />
                            <Route path="/blogs" element={<BlogPostManagement />} />
                            <Route path="/blogs/add" element={<AddBlogPost />} />
                            <Route path="/reviews" element={<Reviews />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings/*" element={<Settings />} />
                        </Route>
                    </Routes>
                </LocalizationProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
