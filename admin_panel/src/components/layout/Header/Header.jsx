import React, { useContext, useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Box,
    Avatar,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Tooltip,
    Divider,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';
import './Header.scss';
import { AuthContext } from '../../../services/auth/AuthContext.jsx';
import api from '../../../services/api/api.js';

const Header = ({
    onMenuClick,
    onThemeToggle,
    themeMode = 'light',
    sidebarOpen = true  // Add this prop
}) => {
    const [todayBookings, setTodayBookings] = useState();

    useEffect(() => {
        let isActive = true;

        const fetchBookingStats = async () => {
            try {
                const todayResponse = await api.get('/TodayBookings');

                if (!isActive) {
                    return;
                }

                setTodayBookings(todayResponse.data.today_bookings);
            } catch (error) {
                console.error('Error fetching booking stats:', error);
            }
        };

        fetchBookingStats();

        const intervalId = window.setInterval(fetchBookingStats, 30000);
        window.addEventListener('focus', fetchBookingStats);

        return () => {
            isActive = false;
            window.clearInterval(intervalId);
            window.removeEventListener('focus', fetchBookingStats);
        };
    }, []);

    const { user } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState(null);



    // Calculate dynamic width based on sidebar state
    const sidebarWidth = sidebarOpen ? 280 : 72;

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = (event) => {
        setNotificationsAnchor(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchor(null);
    };

    const handleLogout = () => {
        api.post('/logout').then(() => {
            console.log('Logout successful');
            window.location.href = '/login'; // Redirect to login page after logout
        }).catch(error => {
            console.error('Error during logout:', error);
        });
    };

    const notifications = [
        { id: 1, message: 'New booking received for Bali Tour', time: '10 min ago', read: false },
        { id: 2, message: 'Payment of $1,200 received', time: '1 hour ago', read: true },
        { id: 3, message: 'Customer review submitted', time: '2 hours ago', read: false },
        { id: 4, message: 'Tour availability updated', time: '5 hours ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;





    return (
        <AppBar
            position="fixed"
            sx={{
                width: { xs: `100%`, sm: `100%`, md: `calc(100% - ${sidebarWidth}px)` },
                ml: { sm: `${sidebarWidth}px` },
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: (theme) => theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                zIndex: 1500,
            }}
        >
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <TextField
                        placeholder="Search tours, customers, bookings..."
                        variant="outlined"
                        size="small"
                        sx={{
                            width: { xs: '100%', sm: sidebarOpen ? 320 : 280 }, // Adjust search width
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 20,
                                backgroundColor: 'background.default',
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{
                        display: {
                            xs: 'none',
                            md: sidebarOpen ? 'flex' : 'none' // Hide chips when sidebar collapsed
                        },
                        gap: 1
                    }}>
                        <Chip label={`Today: ${todayBookings || 0} Bookings`} size="small" color="primary" variant="outlined" />
                        <Chip label="Revenue: $12,450" size="small" color="success" variant="outlined" />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Toggle theme">
                        <IconButton onClick={onThemeToggle} size="small">
                            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Notifications">
                        <IconButton
                            size="small"
                            onClick={handleNotificationsClick}
                            sx={{ position: 'relative' }}
                        >
                            <Badge badgeContent={unreadCount} color="error" variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Messages">
                        <IconButton size="small">
                            <Badge badgeContent={3} color="error">
                                <EmailIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                        onClick={handleProfileClick}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{
                            display: {
                                xs: 'none',
                                sm: sidebarOpen ? 'block' : 'none' // Hide user name when sidebar collapsed
                            }
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {user?.name || ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.role || ''}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            minWidth: 200,
                            borderRadius: 2,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem>
                        <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                        My Profile
                    </MenuItem>
                    <MenuItem>
                        <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                        Account Settings
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                        Logout
                    </MenuItem>
                </Menu>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notificationsAnchor}
                    open={Boolean(notificationsAnchor)}
                    onClose={handleNotificationsClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            mt: 1.5,
                            width: 360,
                            maxHeight: 400,
                            borderRadius: 2,
                        },
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Notifications
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {unreadCount} unread messages
                        </Typography>
                    </Box>
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {notifications.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                sx={{
                                    py: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                                }}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                                        {notification.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {notification.time}
                                    </Typography>
                                </Box>
                                {!notification.read && (
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main',
                                        }}
                                    />
                                )}
                            </MenuItem>
                        ))}
                    </Box>
                    <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                            View All Notifications
                        </Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
