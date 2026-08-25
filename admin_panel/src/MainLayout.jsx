// MainLayout.jsx
import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar.jsx';
import Header from './components/layout/Header/Header.jsx';
import './MainLayout.scss';

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [themeMode, setThemeMode] = useState('light');

    
    


    // Calculate sidebar width
    const sidebarWidth = sidebarOpen ? 280 : 72;

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleThemeToggle = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => isMobile && setSidebarOpen(false)}
                onToggle={handleDrawerToggle}
                variant={isMobile ? 'temporary' : 'permanent'}
            />

            {/* Header */}
            <Header
                onMenuClick={handleDrawerToggle}
                onThemeToggle={handleThemeToggle}
                themeMode={themeMode}
                sidebarOpen={sidebarOpen}
            />

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: { xs: 8, sm: 9 }, // Top padding to account for fixed header
                    width: {
                        xs: '100%',
                        sm: '100%',
                        md: `calc(100% - ${sidebarWidth}px)` // Simplified calculation
                    },
                    ml: {
                        xs: 0,
                        sm: 0, // Margin left for sidebar

                    },
                    position: 'absolute',
                    left: {
                        md: sidebarWidth,
                        sm: 0,
                        xs: 0,
                    },
                    minHeight: '100vh',
                    backgroundColor: 'background.default', // Changed from 'red'
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Page container with padding */}
                <Box className="page-container" sx={{ width: '100%' }}>
                    {children || <Outlet />} {/* Support both children and Outlet */}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;