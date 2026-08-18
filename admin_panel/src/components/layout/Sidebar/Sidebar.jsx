import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    Tooltip,
    IconButton,
    Box,
    Typography,
    Avatar,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Luggage as TourIcon,
    CalendarMonth as BookingIcon,
    People as CustomerIcon,
    Payment as PaymentIcon,
    Article as ContentIcon,
    Reviews as ReviewIcon,
    Analytics as AnalyticsIcon,
    Settings as SettingsIcon,
    ExpandLess,
    ExpandMore,
    ChevronLeft,
    ChevronRight,
    Menu as MenuIcon,
    FlightTakeoff,
    Article as BlogIcon, // Use Article icon for blog (or use Description, LibraryBooks, etc.)
    Description,
    LibraryBooks,
    PostAdd,
    Category,
} from '@mui/icons-material';
import './Sidebar.scss';
import { AuthContext } from '../../../services/auth/AuthContext';

const menuItems = [
    {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
    },
    {
        title: 'Tour Management',
        icon: <TourIcon />,
        path: '/tours',
        subItems: [
            { title: 'All Tours', path: '/tours' },
            { title: 'Vehicles', path: '/vehicles' },
        ],
    },
    {
        title: 'Booking Management',
        icon: <BookingIcon />,
        path: '/bookings',
    },
    {
        title: 'Customer Management',
        icon: <CustomerIcon />,
        path: '/customers',
    },
    {
        title: 'Payment Management',
        icon: <PaymentIcon />,
        path: '/payments',
    },
    {
        title: 'Content Management',
        icon: <ContentIcon />,
        path: '/content',
        subItems: [
            // { title: 'Destinations', path: '/content/destinations' },
            { title: 'Blog Posts', path: '/blogs' },
            // { title: 'Offers', path: '/content/offers' },
        ],
    },
    {
        title: 'Reviews & Ratings',
        icon: <ReviewIcon />,
        path: '/reviews',
    },
    {
        title: 'Reports & Analytics',
        icon: <AnalyticsIcon />,
        path: '/reports',
    },
    {
        title: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
        subItems: [
            { title: 'General', path: '/settings/general' },
            { title: 'Users & Roles', path: '/settings/users' },
            { title: 'Notifications', path: '/settings/notifications' },
        ],
    },
];

const Sidebar = ({ open, onClose, variant = 'permanent', onToggle }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleExpand = (title) => {
        setExpandedItems((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const renderMenuItem = (item, depth = 0) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems[item.title];

        return (
            <React.Fragment key={item.title}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        component={hasSubItems ? 'div' : NavLink}
                        to={hasSubItems ? null : item.path}
                        onClick={hasSubItems ? () => toggleExpand(item.title) : null}
                        sx={{
                            pl: depth * 2 + 2,
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                            color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
                            '&:hover': {
                                backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                            sx={{ opacity: open ? 1 : 0 }}
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: isActive(item.path) ? 600 : 400,
                            }}
                        />
                        {hasSubItems && open && (
                            <Box sx={{ ml: 'auto' }}>
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </Box>
                        )}
                    </ListItemButton>
                </ListItem>
                {hasSubItems && open && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.subItems.map((subItem) => (
                                <ListItem key={subItem.title} disablePadding>
                                    <ListItemButton
                                        component={NavLink}
                                        to={subItem.path}
                                        sx={{
                                            pl: depth * 2 + 6,
                                            minHeight: 40,
                                            backgroundColor: isActive(subItem.path) ? 'primary.light' : 'transparent',
                                            color: isActive(subItem.path) ? 'primary.contrastText' : 'text.secondary',
                                            '&:hover': {
                                                backgroundColor: isActive(subItem.path) ? 'primary.main' : 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={subItem.title}
                                            sx={{ opacity: 1 }}
                                            primaryTypographyProps={{
                                                fontSize: '0.8125rem',
                                                fontWeight: isActive(subItem.path) ? 500 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                width: open ? 280 : 72,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? 280 : 72,
                    boxSizing: 'border-box',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                },
                zIndex: 2000,
            }}
        >
            {/* Header with toggle button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0,
                    minHeight: { xs: 56, sm: 64 },
                    boxSizing: 'border-box',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative',
                }}
            >
                {open ? (
                    <> 
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> 
                            <img src="/favicon.png" width="50px" alt="CeyTripz Logo" className="logo-image" /> 
                            <Box> 
                                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}> 
                                    CeyTripz 
                                </Typography> 
                                <Typography variant="caption" color="text.secondary">
                                    Management Dashboard
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={onToggle}
                            size="small"
                            sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <img src="/favicon.png" width="40px" alt="CeyTripz Logo" className="logo-image" />
                        <IconButton
                            onClick={onToggle}
                            size="small"
                            sx={{
                                position: 'absolute',
                                right: -12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                                width: 24,
                                height: 24,
                                display: variant === 'permanent' ? 'flex' : 'none',
                                zIndex: 2000,
                            }}
                        >
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Menu items */}
            <List sx={{ flexGrow: 1, py: 1, overflow: 'auto' }}>
                {menuItems.map((item) => renderMenuItem(item))}
            </List>

            <Divider />

            {/* User profile */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            fontSize: '1rem',
                        }}
                    >
                        {user?.name?.charAt(0) || 'A'}
                    </Avatar>
                    {open && (
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                                {user?.name || 'Admin User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {user?.role || 'Administrator'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
