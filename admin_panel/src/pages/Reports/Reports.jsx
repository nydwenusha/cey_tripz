import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
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
  CalendarMonth,
  Download,
  Payments,
  Print,
  Refresh,
  Route,
  Summarize,
} from '@mui/icons-material';
import api from '../../services/api/api';
import './Reports.scss';

const ranges = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'Last 12 months' },
];

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'info',
  cancelled: 'error',
  failed: 'error',
  refunded: 'default',
};

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const buildCsv = (report) => {
  const rows = [
    ['CeyTripz Detailed Management Report'],
    ['Period', `${report.period.start} to ${report.period.end}`],
    ['Generated', report.generated_at],
    [],
    ['SUMMARY'],
    ['Bookings', report.overview.bookings.value],
    ['Collected revenue', report.overview.revenue.value],
    ['Active tours', report.overview.active_tours.value],
    ['Active customers', report.overview.active_customers.value],
    ['Active vehicles', report.operations.active_vehicles],
    ['Pending payment amount', report.operations.pending_payment_amount],
    [],
    ['BOOKING STATUS'],
    ['Status', 'Count'],
    ...report.booking_statuses.map((item) => [item.status, item.count]),
    [],
    ['PAYMENT STATUS'],
    ['Status', 'Transactions', 'Amount'],
    ...report.payment_statuses.map((item) => [item.status, item.count, item.amount]),
    [],
    ['POPULAR ROUTES'],
    ['Pickup', 'Drop-off', 'Bookings', 'Booking value'],
    ...report.popular_routes.map((item) => [item.pickup, item.drop, item.bookings, item.value]),
    [],
    ['RECENT BOOKINGS'],
    ['ID', 'Customer', 'Pickup', 'Drop-off', 'Pickup date', 'Vehicle', 'Status', 'Amount'],
    ...report.recent_bookings.map((item) => [
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

  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
};

const Reports = () => {
  const [range, setRange] = useState(30);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/DashboardAnalytics', { params: { range } });
      setReport(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate this report.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const downloadReport = () => {
    if (!report) return;

    const blob = new Blob([buildCsv(report)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ceytripz-detailed-report-${report.period.start}-to-${report.period.end}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="reports-page">
      <Box className="reports-header">
        <Box>
          <Typography variant="h4">Reports & Analytics</Typography>
          <Typography color="text.secondary">
            Generate auditable booking, payment, route, and operations reports from live data.
          </Typography>
        </Box>
        <Box className="reports-actions no-print">
          <FormControl size="small">
            <Select value={range} onChange={(event) => setRange(Number(event.target.value))}>
              {ranges.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Refresh />} onClick={loadReport} disabled={loading}>Refresh</Button>
          <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()} disabled={!report}>Print</Button>
          <Button variant="contained" startIcon={<Download />} onClick={downloadReport} disabled={!report}>Export CSV</Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && !report ? (
        <Box className="reports-loading"><CircularProgress /><Typography>Generating report…</Typography></Box>
      ) : report && (
        <>
          <Box className="report-cover">
            <Box className="report-cover__icon"><Summarize /></Box>
            <Box>
              <Typography variant="h5">Management performance report</Typography>
              <Typography variant="body2">
                Reporting period: {formatDate(report.period.start)} – {formatDate(report.period.end)}
              </Typography>
              <Typography variant="caption">Generated {new Date(report.generated_at).toLocaleString()}</Typography>
            </Box>
          </Box>

          <Box className="report-summary">
            <Card><CardContent><CalendarMonth /><Typography variant="h5">{report.overview.bookings.value}</Typography><Typography>Bookings</Typography></CardContent></Card>
            <Card><CardContent><Payments /><Typography variant="h5">{formatCurrency(report.overview.revenue.value)}</Typography><Typography>Collected revenue</Typography></CardContent></Card>
            <Card><CardContent><Route /><Typography variant="h5">{report.popular_routes.length}</Typography><Typography>Active route pairs</Typography></CardContent></Card>
            <Card><CardContent><Summarize /><Typography variant="h5">{formatCurrency(report.operations.pending_payment_amount)}</Typography><Typography>Pending collections</Typography></CardContent></Card>
          </Box>

          <Box className="report-grid">
            <Card className="report-section">
              <CardContent>
                <Typography variant="h6">Booking status summary</Typography>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Status</TableCell><TableCell align="right">Bookings</TableCell></TableRow></TableHead>
                  <TableBody>
                    {report.booking_statuses.map((item) => (
                      <TableRow key={item.status}>
                        <TableCell><Chip size="small" label={item.status} color={statusColors[item.status]} /></TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="report-section">
              <CardContent>
                <Typography variant="h6">Payment status summary</Typography>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Status</TableCell><TableCell align="right">Transactions</TableCell><TableCell align="right">Amount</TableCell></TableRow></TableHead>
                  <TableBody>
                    {report.payment_statuses.map((item) => (
                      <TableRow key={item.status}>
                        <TableCell><Chip size="small" label={item.status} color={statusColors[item.status]} /></TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>

          <Card className="report-section report-table-card">
            <CardContent>
              <Typography variant="h6">Popular routes</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Pickup</TableCell><TableCell>Drop-off</TableCell><TableCell align="right">Bookings</TableCell><TableCell align="right">Booking value</TableCell></TableRow></TableHead>
                  <TableBody>
                    {report.popular_routes.length ? report.popular_routes.map((item) => (
                      <TableRow key={`${item.pickup}-${item.drop}`}>
                        <TableCell>{item.pickup}</TableCell><TableCell>{item.drop}</TableCell><TableCell align="right">{item.bookings}</TableCell><TableCell align="right">{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={4} align="center">No route activity in this period.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card className="report-section report-table-card">
            <CardContent>
              <Typography variant="h6">Recent bookings</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Customer</TableCell><TableCell>Route</TableCell><TableCell>Pickup</TableCell><TableCell>Vehicle</TableCell><TableCell>Status</TableCell><TableCell align="right">Amount</TableCell></TableRow></TableHead>
                  <TableBody>
                    {report.recent_bookings.length ? report.recent_bookings.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>#{item.id}</TableCell>
                        <TableCell>{item.customer_name}</TableCell>
                        <TableCell>{item.pickup_location} → {item.drop_location}</TableCell>
                        <TableCell>{formatDate(item.pickup_date)}</TableCell>
                        <TableCell>{item.vehicle_type}</TableCell>
                        <TableCell><Chip size="small" label={item.status} color={statusColors[item.status]} /></TableCell>
                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={7} align="center">No bookings in this period.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default Reports;
