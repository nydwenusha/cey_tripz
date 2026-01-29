import React from 'react';
import {
    Grid,
    Paper,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    MoreVert,
    Visibility,
    ShoppingCart,
    AttachMoney,
    People,
    CalendarToday,
    ArrowForward,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import PageContainer from '../../components/layout/PageContainer/PageContainer';
import KpiCard from '../../components/common/KpiCard/KpiCard';
import DataTable from '../../components/common/DataTable/DataTable';
import './Dashboard.scss';
import MainLayout from '../../MainLayout';

// Remove MainLayout import - it's already wrapping routes in App.jsx
// import MainLayout from '../../MainLayout';

const Dashboard = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    // KPI Data
    const kpiData = [
        {
            title: 'Total Bookings',
            value: '1,842',
            change: 12.5,
            trend: 'up',
            icon: <ShoppingCart />,
            color: '#1a4d8c',
            subtitle: 'Last 30 days',
        },
        {
            title: 'Total Revenue',
            value: '$124,580',
            change: 8.2,
            trend: 'up',
            icon: <AttachMoney />,
            color: '#28a745',
            subtitle: 'Year to date',
        },
        {
            title: 'Active Tours',
            value: '42',
            change: -3.2,
            trend: 'down',
            icon: <Visibility />,
            color: '#ff7e5f',
            subtitle: 'Currently running',
        },
        {
            title: 'Customers',
            value: '3,248',
            change: 15.7,
            trend: 'up',
            icon: <People />,
            color: '#6f42c1',
            subtitle: 'Registered users',
        },
    ];

    // Monthly Booking Data
    const bookingData = [
        { month: 'Jan', bookings: 120, revenue: 24000 },
        { month: 'Feb', bookings: 180, revenue: 36000 },
        { month: 'Mar', bookings: 150, revenue: 30000 },
        { month: 'Apr', bookings: 220, revenue: 44000 },
        { month: 'May', bookings: 280, revenue: 56000 },
        { month: 'Jun', bookings: 320, revenue: 64000 },
        { month: 'Jul', bookings: 380, revenue: 76000 },
        { month: 'Aug', bookings: 420, revenue: 84000 },
        { month: 'Sep', bookings: 380, revenue: 76000 },
        { month: 'Oct', bookings: 340, revenue: 68000 },
        { month: 'Nov', bookings: 300, revenue: 60000 },
        { month: 'Dec', bookings: 260, revenue: 52000 },
    ];

    // Top Destinations Data
    const destinationData = [
        { name: 'Bali', value: 35, color: '#1a4d8c' },
        { name: 'Thailand', value: 25, color: '#28a745' },
        { name: 'Maldives', value: 20, color: '#ff7e5f' },
        { name: 'Japan', value: 15, color: '#6f42c1' },
        { name: 'Europe', value: 5, color: '#fd7e14' },
    ];

    // Recent Bookings Data
    const recentBookings = [
        {
            id: 'BK001',
            customer: 'John Smith',
            tour: 'Bali Adventure',
            date: '2024-03-15',
            guests: 2,
            amount: '$2,400',
            status: 'Confirmed',
        },
        {
            id: 'BK002',
            customer: 'Sarah Johnson',
            tour: 'Thai Cultural Tour',
            date: '2024-03-14',
            guests: 4,
            amount: '$3,200',
            status: 'Pending',
        },
        {
            id: 'BK003',
            customer: 'Michael Brown',
            tour: 'Maldives Luxury',
            date: '2024-03-13',
            guests: 2,
            amount: '$4,800',
            status: 'Confirmed',
        },
        {
            id: 'BK004',
            customer: 'Emily Davis',
            tour: 'Japan Cherry Blossom',
            date: '2024-03-12',
            guests: 3,
            amount: '$3,600',
            status: 'Cancelled',
        },
        {
            id: 'BK005',
            customer: 'Robert Wilson',
            tour: 'European Highlights',
            date: '2024-03-11',
            guests: 2,
            amount: '$5,200',
            status: 'Confirmed',
        },
    ];

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: 'id', headerName: 'Booking ID', width: 120 },
        { field: 'customer', headerName: 'Customer', width: 150 },
        { field: 'tour', headerName: 'Tour', width: 180 },
        { field: 'date', headerName: 'Date', width: 120 },
        { field: 'guests', headerName: 'Guests', width: 100 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor:
                            params.value === 'Confirmed'
                                ? 'success.light'
                                : params.value === 'Pending'
                                    ? 'warning.light'
                                    : 'error.light',
                        color:
                            params.value === 'Confirmed'
                                ? 'success.dark'
                                : params.value === 'Pending'
                                    ? 'warning.dark'
                                    : 'error.dark',
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: () => (
                <IconButton size="small" onClick={handleMenuClick}>
                    <MoreVert />
                </IconButton>
            ),
        },
    ];

    return (
        // REMOVE MainLayout wrapper - only PageContainer
        // MainLayout is already wrapping all routes in App.jsx
        <MainLayout>
            <PageContainer title="Dashboard Overview">
                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {kpiData.map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <KpiCard {...kpi} />
                        </Grid>
                    ))}
                </Grid>

                {/* Charts and Tables */}
                <Grid container spacing={3}>
                    {/* Booking Trends Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Booking Trends
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    endIcon={<ArrowForward />}
                                >
                                    View Report
                                </Button>
                            </Box>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={bookingData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="month" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="bookings"
                                            stroke="#1a4d8c"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                            name="Bookings"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#ff7e5f"
                                            strokeWidth={2}
                                            name="Revenue ($)"
                                            yAxisId={1}
                                        />
                                        <YAxis yAxisId={1} orientation="right" stroke="#ff7e5f" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Top Destinations Chart */}
                    <Grid item xs={12} lg={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Top Destinations
                            </Typography>
                            <Box sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
                                <ResponsiveContainer width="100%" height="80%">
                                    <PieChart>
                                        <Pie
                                            data={destinationData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {destinationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                    {destinationData.map((dest) => (
                                        <Box
                                            key={dest.name}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 1,
                                                backgroundColor: `${dest.color}15`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: dest.color,
                                                }}
                                            />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                {dest.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Recent Bookings Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Recent Bookings
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<CalendarToday />}
                                >
                                    View All Bookings
                                </Button>
                            </Box>
                            <DataTable
                                rows={recentBookings}
                                columns={columns}
                                pageSize={5}
                                autoHeight
                                disableSelectionOnClick
                            />
                        </Paper>
                    </Grid>

                    {/* Quick Stats */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Quick Stats
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { label: 'Avg. Booking Value', value: '$2,450', change: '+5.2%' },
                                    { label: 'Conversion Rate', value: '12.5%', change: '+1.8%' },
                                    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.3' },
                                    { label: 'Repeat Customers', value: '42%', change: '+3.1%' },
                                ].map((stat, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Card variant="outlined" sx={{ height: '100%' }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {stat.label}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: stat.change.startsWith('+') ? 'success.main' : 'error.main',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {stat.change}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Upcoming Tours */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Upcoming Tours
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { tour: 'Bali Adventure', date: 'Mar 20-27', seats: '8/12', status: 'Almost Full' },
                                    { tour: 'Thai Cultural', date: 'Mar 22-29', seats: '5/15', status: 'Available' },
                                    { tour: 'Maldives Luxury', date: 'Mar 25-30', seats: '2/8', status: 'Limited' },
                                    { tour: 'Japan Spring', date: 'Apr 1-10', seats: '12/20', status: 'Available' },
                                ].map((tour, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 2,
                                            borderRadius: 1,
                                            backgroundColor: 'background.default',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {tour.tour}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {tour.date}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body2">{tour.seats} seats</Typography>
                                            <Box
                                                sx={{
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    backgroundColor:
                                                        tour.status === 'Almost Full'
                                                            ? 'warning.light'
                                                            : tour.status === 'Limited'
                                                                ? 'error.light'
                                                                : 'success.light',
                                                    color:
                                                        tour.status === 'Almost Full'
                                                            ? 'warning.dark'
                                                            : tour.status === 'Limited'
                                                                ? 'error.dark'
                                                                : 'success.dark',
                                                }}
                                            >
                                                {tour.status}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Actions Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Edit Booking</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Send Invoice</MenuItem>
                    <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                        Cancel Booking
                    </MenuItem>
                </Menu>
            </PageContainer>
        </MainLayout>

        
    );
};

export default Dashboard;