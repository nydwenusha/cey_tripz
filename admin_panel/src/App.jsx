import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme, { darkTheme } from './theme';

// Layout Components

import Header from './components/layout/Header/Header';

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

// Auth Context
import { AuthProvider, useAuth } from './hooks/useAuth';

// Styles
import './styles/global.scss';
import Sidebar from './components/layout/Sidebar/Sidebar.jsx';
import Categories from './pages/Tours/Categories.jsx';
import Vehicles from './pages/Tours/Vehicles.jsx';
import AddVehicles from './pages/Tours/AddVehicles.jsx';
import BlogPostManagement from './pages/Content/BlogPostManagement.jsx';
import AddBlogPage from './pages/Content/AddBlogPage.jsx';
import dotenv from 'dotenv';

// Main Layout Component
const MainLayout = ({ themeMode, toggleTheme }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (



        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tours" element={<ToursList />} />
            <Route path="/addtours" element={<TourEdit />} />
            <Route path="/addtours" element={<TourEdit />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/AddVehicles" element={<AddVehicles />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/content/*" element={<Content />} />
            <Route path="/blogs" element={<BlogPostManagement />} />
            <Route path="/AddBlogs" element={<AddBlogPage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>


    );
};

function App() {
    const [themeMode, setThemeMode] = useState('light');

    const currentTheme = useMemo(() => {
        return themeMode === 'dark' ? darkTheme : theme;
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/*" element={
                                <MainLayout themeMode={themeMode} toggleTheme={toggleTheme} />
                            } />
                        </Routes>
                    </Router>
                </AuthProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;