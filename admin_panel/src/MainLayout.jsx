// MainLayout.jsx
import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Header from './components/layout/Header/Header.jsx';

const MainLayout = ({children}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [themeMode, setThemeMode] = useState('light');

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleThemeToggle = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            
            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => isMobile && setSidebarOpen(false)}
                onToggle={handleDrawerToggle}
                variant={isMobile ? 'temporary' : 'permanent'}
            />

            {/* Header - Pass sidebarOpen prop */}
            <Header
                onMenuClick={handleDrawerToggle}
                onThemeToggle={handleThemeToggle}
                themeMode={themeMode}
                sidebarOpen={sidebarOpen} // Pass this!
            />

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                   
                    width: '100%',
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                {/* This is where your page content renders */}
                <Box>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;