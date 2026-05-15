// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    IconButton,
    LinearProgress,
    useTheme,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    People,
    AttachMoney,
    Tour,
    ArrowForward,
} from '@mui/icons-material';
import './Dashboard.scss';
import MainLayout from '../../MainLayout';
import api from '../../services/api/api';

const Dashboard = () => {
    const theme = useTheme();
    const [dashboardStats, setDashboardStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        customers: 0,
    });

    // Booking trends data
    const bookingTrends = [
        { month: 'Mar', bookings: 320, revenue: 45000 },
        { month: 'Jun', bookings: 480, revenue: 68000 },
        { month: 'Sep', bookings: 520, revenue: 78000 },
        { month: 'Dec', bookings: 620, revenue: 92500 },
    ];

    // Top destinations data
    const destinations = [
        { name: 'Bali', percentage: 35, color: '#FF6B6B' },
        { name: 'Thailand', percentage: 25, color: '#4ECDC4' },
        { name: 'Japan', percentage: 15, color: '#45B7D1' },
        { name: 'Maldives', percentage: 20, color: '#96CEB4' },
        { name: 'Europe', percentage: 5, color: '#FFEAA7' },
    ];

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardStats = async () => {
            try {
                const [bookingsResponse, revenueResponse, customersResponse] = await Promise.all([
                    api.get('/TotalBookings'),
                    api.get('/PaymentStats'),
                    api.get('/GetCustomers'),
                ]);

                if (!isMounted) {
                    return;
                }

                setDashboardStats({
                    totalBookings: Number(bookingsResponse.data?.total_bookings || 0),
                    totalRevenue: Number(revenueResponse.data?.stats?.total || 0),
                    customers: Array.isArray(customersResponse.data?.customers)
                        ? customersResponse.data.customers.length
                        : 0,
                });
            } catch {
                if (!isMounted) {
                    return;
                }

                setDashboardStats({
                    totalBookings: 0,
                    totalRevenue: 0,
                    customers: 0,
                });
            }
        };

        fetchDashboardStats();

        return () => {
            isMounted = false;
        };
    }, []);

    // Stats cards data
    const statsCards = [
        {
            title: 'Total Bookings',
            value: dashboardStats.totalBookings.toLocaleString(),
            icon: <Tour sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
        },
        {
            title: 'Total Revenue',
            value: `$${dashboardStats.totalRevenue.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            icon: <AttachMoney sx={{ fontSize: 40, color: theme.palette.success.main }} />,
        },
        {
            title: 'Active Tours',
            value: '42',
            icon: <Tour sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
        },
        {
            title: 'Customers',
            value: dashboardStats.customers.toLocaleString(),
            icon: <People sx={{ fontSize: 40, color: theme.palette.info.main }} />,
        },
    ];

    // Performance metrics
    const metrics = [
        { label: 'Last 30 days', value: '12.5%', trend: 'up', color: 'success' },
        { label: 'Year to date', value: '8.2%', trend: 'up', color: 'success' },
        { label: 'Currently running', value: '-3.2%', trend: 'down', color: 'error' },
        { label: 'Registered users', value: '15.7%', trend: 'up', color: 'success' },
    ];

    return (

            <Box className="dashboard">

                {/* Stats Cards - Full Width Grid */}
                <Grid container spacing={3} className="stats-grid" sx={{ 
                    width: '100%', 
                    mx: 0,
                    marginLeft: '0 !important',
                    marginRight: '0 !important'
                }}>
                    {statsCards.map((card, index) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={3} 
                            key={index}
                            sx={{ 
                                display: 'flex',
                                flex: { 
                                    xs: '1 1 100%', 
                                    sm: '1 1 calc(50% - 12px)', 
                                    md: '1 1 calc(25% - 18px)' 
                                },
                                maxWidth: { 
                                    xs: '100%', 
                                    sm: 'calc(50% - 12px)', 
                                    md: 'calc(25% - 18px)' 
                                },
                                minWidth: 0
                            }}
                        >
                            <Card className="stat-card" sx={{ width: '100%' }}>
                                <CardContent className="stat-card-content">
                                    <Box className="stat-card-header">
                                        {card.icon}
                                    </Box>
                                    <Typography variant="h3" className="stat-value">
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="stat-title">
                                        {card.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content Grid */}
                <Grid container spacing={3} className="content-grid" sx={{ 
                    width: '100%', 
                    mx: 0,
                    marginLeft: '0 !important',
                    marginRight: '0 !important'
                }}>
                    {/* Left Column - Performance Metrics */}
                    <Grid item xs={12} sx={{width:{lg:'calc(60% - 24px)'}}}>
                        {/* Performance Metrics */}
                        <Card className="metrics-card">
                            <CardContent>
                                <Typography variant="h6" gutterBottom className="section-title">
                                    Performance Metrics
                                </Typography>
                                <Grid container spacing={2}>
                                    {metrics.map((metric, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Paper className="metric-paper" elevation={0}>
                                                <Box className="metric-content">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {metric.label}
                                                    </Typography>
                                                    <Box className="metric-value-container">
                                                        <Typography
                                                            variant="h6"
                                                            className={`metric-value metric-${metric.color}`}
                                                        >
                                                            {metric.value}
                                                        </Typography>
                                                        {metric.trend === 'up' ? (
                                                            <TrendingUp className={`trend-icon trend-${metric.color}`} />
                                                        ) : (
                                                            <TrendingDown className={`trend-icon trend-${metric.color}`} />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Booking Trends */}
                        <Card className="trends-card">
                            <CardContent>
                                <Box className="trends-header">
                                    <Typography variant="h6" className="section-title">
                                        Booking Trends
                                    </Typography>
                                    <IconButton size="small" className="view-report-btn">
                                        <Typography variant="body2">View Report</Typography>
                                        <ArrowForward sx={{ fontSize: 16, ml: 1 }} />
                                    </IconButton>
                                </Box>

                                {/* Chart visualization */}
                                <Box className="chart-container">
                                    <Box className="chart-bars">
                                        {bookingTrends.map((trend, index) => (
                                            <Box key={index} className="chart-column">
                                                <Box className="bar-container">
                                                    {/* Bookings Bar */}
                                                    <Box
                                                        className="booking-bar"
                                                        sx={{
                                                            height: `${(trend.bookings / 700) * 100}%`,
                                                        }}
                                                    />
                                                    {/* Revenue Bar */}
                                                    <Box
                                                        className="revenue-bar"
                                                        sx={{
                                                            height: `${(trend.revenue / 100000) * 100}%`,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" className="month-label">
                                                    {trend.month}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Legends */}
                                    <Box className="chart-legends">
                                        <Box className="legend-item">
                                            <Box className="legend-color bookings-legend" />
                                            <Typography variant="caption">Bookings</Typography>
                                        </Box>
                                        <Box className="legend-item">
                                            <Box className="legend-color revenue-legend" />
                                            <Typography variant="caption">Revenue ($)</Typography>
                                        </Box>
                                    </Box>

                                    {/* Y-axis labels */}
                                    <Box className="y-axis-labels">
                                        <Typography variant="caption">600</Typography>
                                        <Typography variant="caption">450</Typography>
                                        <Typography variant="caption">300</Typography>
                                        <Typography variant="caption">150</Typography>
                                        <Typography variant="caption">0</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - Top Destinations */}
                    <Grid item xs={12} sx={{width:{lg:'calc(40%)'}}}>
                        <Card className="destinations-card" sx={{width:'100%'}}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom className="section-title">
                                    Top Destinations
                                </Typography>

                                {/* Destinations List */}
                                <Box className="destinations-list">
                                    {destinations.map((destination, index) => (
                                        <Box key={index} className="destination-item">
                                            <Box className="destination-header">
                                                <Typography variant="body1" className="destination-name">
                                                    {destination.name}
                                                </Typography>
                                                <Typography variant="body1" className="destination-percentage">
                                                    {destination.percentage}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={destination.percentage}
                                                className="destination-progress"
                                                sx={{
                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: destination.color,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>

                                {/* Color Legend */}
                                <Box className="color-legend">
                                    {destinations.map((destination, index) => (
                                        <Box key={index} className="legend-item">
                                            <Box
                                                className="legend-color"
                                                sx={{ backgroundColor: destination.color }}
                                            />
                                            <Typography variant="caption">{destination.name}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
  
    );
};

export default Dashboard;
