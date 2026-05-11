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
    Paper,
    List,
    ListSubheader,
    ListItemButton,
    ListItemText,
    CircularProgress,
    ClickAwayListener,
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
import { useLocation, useNavigate } from 'react-router-dom';
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
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState({
        bookings: [],
        customers: [],
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isActive = true;

        const fetchBookingStats = async () => {
            try {
                const [todayResponse, revenueResponse] = await Promise.all([
                    api.get('/TodayBookings'),
                    api.get('/PaymentStats'),
                ]);

                if (!isActive) {
                    return;
                }

                setTodayBookings(todayResponse.data.today_bookings);
                setTotalRevenue(Number(revenueResponse.data?.stats?.total || 0));
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

    useEffect(() => {
        const currentSearch = new URLSearchParams(location.search).get('search') || '';
        setSearchInput(currentSearch);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const query = searchInput.trim();

        if (query.length < 2) {
            setSearchResults({ bookings: [], customers: [] });
            setSearchLoading(false);
            return undefined;
        }

        let isActive = true;

        const timeoutId = window.setTimeout(async () => {
            setSearchLoading(true);

            try {
                const [bookingsResponse, customersResponse] = await Promise.all([
                    api.get('/GetBookings', {
                        params: {
                            page: 1,
                            per_page: 5,
                            search: query,
                        },
                    }),
                    api.get('/GetCustomers', {
                        params: {
                            search: query,
                        },
                    }),
                ]);

                if (!isActive) {
                    return;
                }

                setSearchResults({
                    bookings: (bookingsResponse.data?.bookings || []).slice(0, 5),
                    customers: (customersResponse.data?.customers || []).slice(0, 5),
                });
                setSearchOpen(true);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                console.error('Error searching admin data:', error);
                setSearchResults({ bookings: [], customers: [] });
            } finally {
                if (isActive) {
                    setSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            isActive = false;
            window.clearTimeout(timeoutId);
        };
    }, [searchInput]);

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

    const hasSearchResults =
        searchResults.bookings.length > 0 || searchResults.customers.length > 0;

    const navigateToSearchPage = (path, searchValue) => {
        const trimmedValue = searchValue.trim();

        navigate(trimmedValue ? `${path}?search=${encodeURIComponent(trimmedValue)}` : path);
        setSearchOpen(false);
    };

    const handleSearchSubmit = () => {
        const trimmedQuery = searchInput.trim();

        if (!trimmedQuery) {
            return;
        }

        if (location.pathname.startsWith('/customers')) {
            navigateToSearchPage('/customers', trimmedQuery);
            return;
        }

        navigateToSearchPage('/bookings', trimmedQuery);
    };





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
                    <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                        <Box sx={{ position: 'relative', width: { xs: '100%', sm: sidebarOpen ? 320 : 280 } }}>
                            <TextField
                                placeholder="Search tours, customers, bookings..."
                                variant="outlined"
                                size="small"
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value);
                                    setSearchOpen(true);
                                }}
                                onFocus={() => {
                                    if (searchInput.trim().length >= 2) {
                                        setSearchOpen(true);
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleSearchSubmit();
                                    }
                                }}
                                sx={{
                                    width: '100%',
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

                            {searchOpen && searchInput.trim().length >= 2 && (
                                <Paper
                                    elevation={4}
                                    sx={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        right: 0,
                                        zIndex: 1602,
                                        borderRadius: 2,
                                        maxHeight: 420,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        overscrollBehavior: 'contain',
                                    }}
                                >
                                    {searchLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : (
                                        <List sx={{ py: 0 }}>
                                            <ListSubheader sx={{ bgcolor: 'background.paper', fontWeight: 700 }}>
                                                Quick Search
                                            </ListSubheader>
                                            <ListItemButton onClick={() => navigateToSearchPage('/bookings', searchInput)}>
                                                <ListItemText
                                                    primary={`Search bookings for "${searchInput.trim()}"`}
                                                    secondary="View matching booking records"
                                                />
                                            </ListItemButton>
                                            <ListItemButton onClick={() => navigateToSearchPage('/customers', searchInput)}>
                                                <ListItemText
                                                    primary={`Search customers for "${searchInput.trim()}"`}
                                                    secondary="View matching customer records"
                                                />
                                            </ListItemButton>

                                            {searchResults.bookings.length > 0 && (
                                                <ListSubheader sx={{ bgcolor: 'background.paper', fontWeight: 700 }}>
                                                    Bookings
                                                </ListSubheader>
                                            )}
                                            {searchResults.bookings.map((booking) => (
                                                <ListItemButton
                                                    key={`booking-${booking.id}`}
                                                    onClick={() =>
                                                        navigateToSearchPage(
                                                            '/bookings',
                                                            booking.customer_email || booking.customer_name || searchInput
                                                        )
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={`${booking.customer_name} • ${booking.vehicle_type}`}
                                                        secondary={`#${booking.id} • ${booking.customer_email} • ${booking.pickup_location} to ${booking.drop_location}`}
                                                    />
                                                </ListItemButton>
                                            ))}

                                            {searchResults.customers.length > 0 && (
                                                <ListSubheader sx={{ bgcolor: 'background.paper', fontWeight: 700 }}>
                                                    Customers
                                                </ListSubheader>
                                            )}
                                            {searchResults.customers.map((customer) => (
                                                <ListItemButton
                                                    key={`customer-${customer.id}`}
                                                    onClick={() =>
                                                        navigateToSearchPage(
                                                            '/customers',
                                                            customer.customer_email || customer.customer_name || searchInput
                                                        )
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={customer.customer_name}
                                                        secondary={`${customer.customer_email} • ${customer.customer_phone || 'No phone'}`}
                                                    />
                                                </ListItemButton>
                                            ))}

                                            {!hasSearchResults && (
                                                <Box sx={{ px: 2, py: 2.5 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No matching customers or bookings found.
                                                    </Typography>
                                                </Box>
                                            )}
                                        </List>
                                    )}
                                </Paper>
                            )}
                        </Box>
                    </ClickAwayListener>

                    <Box sx={{
                        display: {
                            xs: 'none',
                            md: sidebarOpen ? 'flex' : 'none' // Hide chips when sidebar collapsed
                        },
                        gap: 1
                    }}>
                        <Chip label={`Today: ${todayBookings || 0} Bookings`} size="small" color="primary" variant="outlined" />
                        <Chip
                            label={`Revenue: $${totalRevenue.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}`}
                            size="small"
                            color="success"
                            variant="outlined"
                        />
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
