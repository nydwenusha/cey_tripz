import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme from './theme';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ToursList = lazy(() => import('./pages/Tours/ToursList'));
const TourEdit = lazy(() => import('./pages/Tours/TourEdit'));
const Booking = lazy(() => import('./pages/Bookings/Booking'));
const Customers = lazy(() => import('./pages/Customers/Customers'));
const Payments = lazy(() => import('./pages/Payments/Payments'));
const Content = lazy(() => import('./pages/Content/Content'));
const Reviews = lazy(() => import('./pages/Reviews/Reviews'));
const Reports = lazy(() => import('./pages/Reports/Reports'));
import Login from './pages/Auth/Login';
const Vehicles = lazy(() => import('./pages/Tours/Vehicles.jsx'));
const AddVehicles = lazy(() => import('./pages/Tours/AddVehicles.jsx'));
const BlogPostManagement = lazy(() => import('./pages/Content/BlogPostManagement.jsx'));
const AddBlogPost = lazy(() => import('./pages/Content/AddBlogPost.jsx'));

// Layout
import MainLayout from './MainLayout.jsx';

// Auth Context
import { AuthProvider } from './services/auth/AuthContext.jsx';

// Styles
import './styles/global.scss';
import ProtectedRoute from './services/ProtectedRoute.jsx';
import PublicRoute from './services/PublicRoute.jsx';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Suspense fallback={<Box sx={{ p: 4 }} role="status"><CircularProgress aria-label="Loading page" /></Box>}>
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
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Routes>
                    </Suspense>
                </LocalizationProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
