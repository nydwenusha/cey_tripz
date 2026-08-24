import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  AccountBalanceWallet,
  ArrowForward,
  CalendarMonth,
  DirectionsCar,
  Download,
  EventAvailable,
  Groups,
  Payments,
  PendingActions,
  People,
  Print,
  Refresh,
  Route,
  Tour,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../../services/api/api';
import './Dashboard.scss';

const rangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last 12 months' },
];

const statusConfig = {
  pending: { color: 'warning', label: 'Pending' },
  confirmed: { color: 'success', label: 'Confirmed' },
  completed: { color: 'info', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
  failed: { color: 'error', label: 'Failed' },
  refunded: { color: 'default', label: 'Refunded' },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${value}T00:00:00`));
};

const escapeCsvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const createReportCsv = (data, rangeLabel) => {
  const rows = [
    ['CeyTripz Management Report'],
    ['Period', `${data.period.start} to ${data.period.end} (${rangeLabel})`],
    ['Generated', data.generated_at],
    [],
    ['OVERVIEW'],
    ['Metric', 'Value'],
    ['Bookings', data.overview.bookings.value],
    ['Collected revenue', data.overview.revenue.value],
    ['Active tours', data.overview.active_tours.value],
    ['Active customers', data.overview.active_customers.value],
    [],
    ['BOOKING STATUS'],
    ['Status', 'Bookings'],
    ...data.booking_statuses.map((item) => [item.status, item.count]),
    [],
    ['PAYMENT STATUS'],
    ['Status', 'Transactions', 'Amount'],
    ...data.payment_statuses.map((item) => [item.status, item.count, item.amount]),
    [],
    ['POPULAR ROUTES'],
    ['Pickup', 'Drop-off', 'Bookings', 'Booking value'],
    ...data.popular_routes.map((item) => [item.pickup, item.drop, item.bookings, item.value]),
    [],
    ['UPCOMING BOOKINGS'],
    ['ID', 'Customer', 'Pickup', 'Drop-off', 'Pickup date', 'Vehicle', 'Status', 'Amount'],
    ...data.upcoming_bookings.map((item) => [
      item.id,
      item.customer_name,
      item.pickup_location,
      item.drop_location,
      item.pickup_date,
      item.vehicle_type,
      item.status,
      item.amount,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rangeLabel = useMemo(
    () => rangeOptions.find((option) => option.value === range)?.label || 'Selected period',
    [range],
  );

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/DashboardAnalytics', { params: { range } });
      setData(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleDownloadReport = () => {
    if (!data) return;

    const blob = new Blob([createReportCsv(data, rangeLabel)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ceytripz-report-${data.period.start}-to-${data.period.end}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const overviewCards = data ? [
    {
      label: 'Bookings in period',
      value: data.overview.bookings.value.toLocaleString(),
      change: data.overview.bookings.change,
      helper: 'vs previous period',
      icon: <CalendarMonth />,
      tone: 'blue',
    },
    {
      label: 'Collected revenue',
      value: formatCurrency(data.overview.revenue.value),
      change: data.overview.revenue.change,
      helper: 'completed payments',
      icon: <Payments />,
      tone: 'green',
    },
    {
      label: 'Active tours',
      value: data.overview.active_tours.value.toLocaleString(),
      helper: 'currently published',
      icon: <Tour />,
      tone: 'orange',
    },
    {
      label: 'Active customers',
      value: data.overview.active_customers.value.toLocaleString(),
      helper: 'confirmed customers',
      icon: <People />,
      tone: 'purple',
    },
  ] : [];

  const operations = data ? [
    {
      label: 'Bookings awaiting action',
      value: data.operations.pending_bookings,
      icon: <PendingActions />,
      action: () => navigate('/bookings?status=pending'),
    },
    {
      label: 'Departures in next 7 days',
      value: data.operations.upcoming_seven_days,
      icon: <EventAvailable />,
      action: () => navigate('/bookings'),
    },
    {
      label: 'Pending collections',
      value: formatCurrency(data.operations.pending_payment_amount),
      icon: <AccountBalanceWallet />,
      action: () => navigate('/payments'),
    },
    {
      label: 'Active fleet',
      value: data.operations.active_vehicles,
      icon: <DirectionsCar />,
      action: () => navigate('/vehicles'),
    },
  ] : [];

  const totalStatusBookings = data
    ? data.booking_statuses.reduce((sum, item) => sum + item.count, 0)
    : 0;

  return (
    <Box className="dashboard">
      <Box className="dashboard-toolbar">
        <Box>
          <Typography variant="h4" className="dashboard-heading">Operations overview</Typography>
          <Typography color="text.secondary">
            Live bookings, revenue, fleet activity, and work requiring attention.
          </Typography>
        </Box>

        <Box className="dashboard-actions no-print">
          <FormControl size="small" className="range-control">
            <Select value={range} onChange={(event) => setRange(Number(event.target.value))}>
              {rangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchDashboard} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()} disabled={!data}>
            Print
          </Button>
          <Button variant="contained" startIcon={<Download />} onClick={handleDownloadReport} disabled={!data}>
            Export CSV
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" action={<Button color="inherit" onClick={fetchDashboard}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {loading && !data ? (
        <Box className="dashboard-loading">
          <CircularProgress />
          <Typography color="text.secondary">Loading live business data…</Typography>
        </Box>
      ) : data && (
        <>
          <Box className="overview-grid">
            {overviewCards.map((card) => {
              const hasChange = card.change !== undefined && card.change !== null;
              const positive = Number(card.change) >= 0;

              return (
                <Card key={card.label} className={`overview-card overview-card--${card.tone}`}>
                  <CardContent>
                    <Box className="overview-card__top">
                      <Box className="overview-card__icon">{card.icon}</Box>
                      {hasChange && (
                        <Chip
                          size="small"
                          icon={positive ? <TrendingUp /> : <TrendingDown />}
                          label={`${positive ? '+' : ''}${card.change}%`}
                          className={positive ? 'change-positive' : 'change-negative'}
                        />
                      )}
                    </Box>
                    <Typography className="overview-card__value">{card.value}</Typography>
                    <Typography className="overview-card__label">{card.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{card.helper}</Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          <Card className="section-card operations-card">
            <CardContent>
              <Box className="section-heading">
                <Box>
                  <Typography variant="h6">Today’s operations pulse</Typography>
                  <Typography variant="body2" color="text.secondary">Current workload across the business</Typography>
                </Box>
              </Box>
              <Box className="operations-grid">
                {operations.map((item) => (
                  <Button key={item.label} className="operation-item" onClick={item.action}>
                    <Box className="operation-item__icon">{item.icon}</Box>
                    <Box className="operation-item__copy">
                      <Typography className="operation-item__value">{item.value}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    </Box>
                    <ArrowForward className="operation-item__arrow" />
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Box className="analytics-grid">
            <Card className="section-card revenue-card">
              <CardContent>
                <Box className="section-heading">
                  <Box>
                    <Typography variant="h6">Revenue performance</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed payments during {rangeLabel.toLowerCase()}
                    </Typography>
                  </Box>
                  <Chip label={formatCurrency(data.overview.revenue.value)} color="success" variant="outlined" />
                </Box>
                <Box className="revenue-chart" aria-label="Revenue performance chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue_trend} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1f9d72" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#1f9d72" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e6eaf0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#718096', fontSize: 12 }}
                        tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                        width={72}
                      />
                      <ChartTooltip
                        formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Revenue' : 'Bookings']}
                        labelFormatter={(label, payload) => payload?.[0]?.payload
                          ? `${payload[0].payload.start} – ${payload[0].payload.end}`
                          : label}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1f9d72"
                        strokeWidth={3}
                        fill="url(#revenueFill)"
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card className="section-card status-card">
              <CardContent>
                <Box className="section-heading">
                  <Box>
                    <Typography variant="h6">Booking pipeline</Typography>
                    <Typography variant="body2" color="text.secondary">Status mix for the selected period</Typography>
                  </Box>
                  <Typography className="status-total">{totalStatusBookings}</Typography>
                </Box>
                <Box className="status-list">
                  {data.booking_statuses.map((item) => {
                    const percentage = totalStatusBookings ? (item.count / totalStatusBookings) * 100 : 0;
                    const config = statusConfig[item.status] || { color: 'default', label: item.status };

                    return (
                      <Box key={item.status} className="status-row">
                        <Box className="status-row__label">
                          <Chip size="small" label={config.label} color={config.color} variant="outlined" />
                          <Typography fontWeight={700}>{item.count}</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={config.color === 'default' ? 'primary' : config.color}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {percentage.toFixed(0)}% of bookings
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box className="activity-grid">
            <Card className="section-card schedule-card">
              <CardContent>
                <Box className="section-heading">
                  <Box>
                    <Typography variant="h6">Upcoming trip schedule</Typography>
                    <Typography variant="body2" color="text.secondary">Next confirmed and pending departures</Typography>
                  </Box>
                  <Button endIcon={<ArrowForward />} onClick={() => navigate('/bookings')}>All bookings</Button>
                </Box>
                {data.upcoming_bookings.length ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Booking</TableCell>
                          <TableCell>Route</TableCell>
                          <TableCell>Pickup</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.upcoming_bookings.map((booking) => {
                          const config = statusConfig[booking.status] || { color: 'default', label: booking.status };
                          return (
                            <TableRow key={booking.id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight={700}>#{booking.id}</Typography>
                                <Typography variant="caption" color="text.secondary">{booking.customer_name}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{booking.pickup_location}</Typography>
                                <Typography variant="caption" color="text.secondary">to {booking.drop_location}</Typography>
                              </TableCell>
                              <TableCell>{formatDate(booking.pickup_date)}</TableCell>
                              <TableCell>{booking.vehicle_type}</TableCell>
                              <TableCell><Chip size="small" label={config.label} color={config.color} /></TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box className="empty-state"><EventAvailable /><Typography>No upcoming trips found.</Typography></Box>
                )}
              </CardContent>
            </Card>

            <Card className="section-card routes-card">
              <CardContent>
                <Box className="section-heading">
                  <Box>
                    <Typography variant="h6">Popular routes</Typography>
                    <Typography variant="body2" color="text.secondary">Most-booked routes in this period</Typography>
                  </Box>
                  <Route color="primary" />
                </Box>
                <Box className="routes-list">
                  {data.popular_routes.length ? data.popular_routes.map((routeItem, index) => (
                    <Box key={`${routeItem.pickup}-${routeItem.drop}`} className="route-row">
                      <Box className="route-rank">{index + 1}</Box>
                      <Box className="route-copy">
                        <Typography variant="body2" fontWeight={700}>{routeItem.pickup}</Typography>
                        <Typography variant="caption" color="text.secondary">to {routeItem.drop}</Typography>
                      </Box>
                      <Box className="route-value">
                        <Typography variant="body2" fontWeight={700}>{routeItem.bookings} bookings</Typography>
                        <Typography variant="caption" color="text.secondary">{formatCurrency(routeItem.value)}</Typography>
                      </Box>
                    </Box>
                  )) : (
                    <Box className="empty-state"><Route /><Typography>No route activity for this period.</Typography></Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box className="report-banner no-print">
            <Box className="report-banner__icon"><Groups /></Box>
            <Box className="report-banner__copy">
              <Typography variant="h6">Need a management report?</Typography>
              <Typography variant="body2">
                Open Reports & Analytics for detailed booking, payment, route, and schedule tables.
              </Typography>
            </Box>
            <Button variant="contained" color="inherit" endIcon={<ArrowForward />} onClick={() => navigate('/reports')}>
              Open reports
            </Button>
          </Box>

          <Typography className="generated-time" variant="caption" color="text.secondary">
            Last refreshed {new Date(data.generated_at).toLocaleString()}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
