// Payments.jsx
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Download,
  Receipt,
  Payment,
  CreditCard,
  AccountBalance,
  CalendarToday,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
  Refresh
} from '@mui/icons-material';
import './Payments.scss';
import MainLayout from '../../MainLayout';

const Payments = () => {
  // Initial data
  const initialPayments = [
    {
      id: 'PAY-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      bookingId: 'BK-2024-001',
      amount: 450.00,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN-789012',
      paymentDate: '2024-03-20 14:30:00',
      dueDate: '2024-03-15',
      description: 'Bali Tour Package'
    },
    {
      id: 'PAY-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      bookingId: 'BK-2024-002',
      amount: 320.50,
      currency: 'USD',
      paymentMethod: 'PayPal',
      status: 'completed',
      transactionId: 'TXN-789013',
      paymentDate: '2024-03-18 10:15:00',
      dueDate: '2024-03-12',
      description: 'Paris City Tour'
    },
    {
      id: 'PAY-003',
      customerName: 'Robert Johnson',
      customerEmail: 'robert@example.com',
      bookingId: 'BK-2024-003',
      amount: 780.00,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      status: 'pending',
      transactionId: 'TXN-789014',
      paymentDate: '',
      dueDate: '2024-03-25',
      description: 'Japan Tour Package'
    },
    {
      id: 'PAY-004',
      customerName: 'Emily Davis',
      customerEmail: 'emily@example.com',
      bookingId: 'BK-2024-004',
      amount: 125.75,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'failed',
      transactionId: 'TXN-789015',
      paymentDate: '2024-03-17 16:45:00',
      dueDate: '2024-03-10',
      description: 'Local Day Tour'
    },
    {
      id: 'PAY-005',
      customerName: 'Michael Wilson',
      customerEmail: 'michael@example.com',
      bookingId: 'BK-2024-005',
      amount: 920.00,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'completed',
      transactionId: 'TXN-789016',
      paymentDate: '2024-03-22 09:20:00',
      dueDate: '2024-03-20',
      description: 'Australia Adventure'
    },
    {
      id: 'PAY-006',
      customerName: 'Sarah Brown',
      customerEmail: 'sarah@example.com',
      bookingId: 'BK-2024-006',
      amount: 560.25,
      currency: 'USD',
      paymentMethod: 'Debit Card',
      status: 'refunded',
      transactionId: 'TXN-789017',
      paymentDate: '2024-03-10 11:30:00',
      dueDate: '2024-03-05',
      description: 'Maldives Package'
    },
    {
      id: 'PAY-007',
      customerName: 'David Miller',
      customerEmail: 'david@example.com',
      bookingId: 'BK-2024-007',
      amount: 340.00,
      currency: 'USD',
      paymentMethod: 'PayPal',
      status: 'pending',
      transactionId: 'TXN-789018',
      paymentDate: '',
      dueDate: '2024-03-28',
      description: 'Italy Tour'
    },
    {
      id: 'PAY-008',
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa@example.com',
      bookingId: 'BK-2024-008',
      amount: 670.80,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      transactionId: 'TXN-789019',
      paymentDate: '2024-03-21 13:10:00',
      dueDate: '2024-03-18',
      description: 'Thailand Tour'
    }
  ];

  // State
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('paymentDate');
  const [order, setOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 8567.30,
    completed: 6542.55,
    pending: 1120.00,
    failed: 125.75,
    refunded: 560.25
  });

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedPayments = [...filteredPayments].sort((a, b) => {
      if (property === 'amount') {
        return isAsc ? a[property] - b[property] : b[property] - a[property];
      }
      if (property === 'paymentDate') {
        const dateA = a.paymentDate ? new Date(a.paymentDate) : new Date(0);
        const dateB = b.paymentDate ? new Date(b.paymentDate) : new Date(0);
        return isAsc ? dateA - dateB : dateB - dateA;
      }
      return isAsc
        ? String(a[property]).localeCompare(String(b[property]))
        : String(b[property]).localeCompare(String(a[property]));
    });

    setPayments(sortedPayments);
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Action menu
  const handleMenuOpen = (event, payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleAction = (action) => {
    console.log(`${action} payment:`, selectedPayment);
    if (action === 'View Receipt') {
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  // Status chip color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Completed' };
      case 'pending':
        return { color: 'warning', icon: <Pending fontSize="small" />, label: 'Pending' };
      case 'failed':
        return { color: 'error', icon: <Cancel fontSize="small" />, label: 'Failed' };
      case 'refunded':
        return { color: 'info', icon: <Refresh fontSize="small" />, label: 'Refunded' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };

  // Method icon
  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return <CreditCard fontSize="small" />;
      case 'Debit Card':
        return <CreditCard fontSize="small" />;
      case 'PayPal':
        return <Payment fontSize="small" />;
      case 'Bank Transfer':
        return <AccountBalance fontSize="small" />;
      default:
        return <Payment fontSize="small" />;
    }
  };

  const handleExport = () => {
    console.log('Exporting payments data...');
  };

  return (
    <MainLayout>
      <div className="payments-container">
        {/* Stats Cards */}
        <Grid container spacing={3} className="stats-grid">
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper className="stat-card total">
              <AttachMoney className="stat-icon" />
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5">${stats.total.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper className="stat-card completed">
              <CheckCircle className="stat-icon" />
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h5">${stats.completed.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper className="stat-card pending">
              <Pending className="stat-icon" />
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h5">${stats.pending.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper className="stat-card failed">
              <Cancel className="stat-icon" />
              <Typography variant="h6">Failed</Typography>
              <Typography variant="h5">${stats.failed.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper className="stat-card refunded">
              <Refresh className="stat-icon" />
              <Typography variant="h6">Refunded</Typography>
              <Typography variant="h5">${stats.refunded.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Table */}
        <Paper className="payments-paper">
          {/* Header */}
          <div className="table-header">
            <Typography variant="h5" className="table-title">
              <Receipt className="title-icon" />
              Payment Management
            </Typography>
            <div className="header-actions">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                className="search-field"
              />

              <FormControl size="small" className="filter-field">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" className="filter-field">
                <InputLabel>Method</InputLabel>
                <Select
                  value={filterMethod}
                  label="Method"
                  onChange={(e) => setFilterMethod(e.target.value)}
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="PayPal">PayPal</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>

              <Tooltip title="Export">
                <IconButton onClick={handleExport}>
                  <Download />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'desc'}
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'paymentDate'}
                      direction={orderBy === 'paymentDate' ? order : 'desc'}
                      onClick={() => handleSort('paymentDate')}
                    >
                      Payment Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);

                    return (
                      <TableRow key={payment.id} hover>
                        <TableCell>
                          <div className="payment-id-cell">
                            <Typography variant="body1" fontWeight="medium">
                              {payment.id}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {payment.bookingId}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="customer-cell">
                            <Typography variant="body1" fontWeight="medium">
                              {payment.customerName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {payment.customerEmail}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="amount-cell">
                            <AttachMoney fontSize="small" className="currency-icon" />
                            <Typography variant="body1" fontWeight="medium">
                              {payment.amount.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {payment.currency}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getMethodIcon(payment.paymentMethod)}
                            label={payment.paymentMethod}
                            variant="outlined"
                            size="small"
                            className="method-chip"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            className="status-chip"
                          />
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate ? (
                            <div className="date-cell">
                              <CalendarToday fontSize="small" className="date-icon" />
                              <div>
                                <Typography variant="body2">
                                  {new Date(payment.paymentDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </div>
                            </div>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              Not Paid
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="date-cell">
                            <CalendarToday fontSize="small" className="date-icon" />
                            <Typography variant="body2">
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, payment)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleAction('View Receipt')}>
            <Receipt fontSize="small" className="menu-icon" />
            View Receipt
          </MenuItem>
          <MenuItem onClick={() => handleAction('Process Refund')}>
            <Refresh fontSize="small" className="menu-icon" />
            Process Refund
          </MenuItem>
          <MenuItem onClick={() => handleAction('Resend Invoice')}>
            <Payment fontSize="small" className="menu-icon" />
            Resend Invoice
          </MenuItem>
          <MenuItem onClick={() => handleAction('Mark as Complete')}>
            <CheckCircle fontSize="small" className="menu-icon" />
            Mark as Complete
          </MenuItem>
        </Menu>

        {/* Receipt Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Receipt className="dialog-icon" />
            Payment Receipt
          </DialogTitle>
          <DialogContent>
            {selectedPayment && (
              <div className="receipt-content">
                <div className="receipt-header">
                  <Typography variant="h6" gutterBottom>
                    TravelPro Payment Receipt
                  </Typography>
                  <Chip
                    label={getStatusConfig(selectedPayment.status).label}
                    color={getStatusConfig(selectedPayment.status).color}
                  />
                </div>

                <div className="receipt-details">
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Payment ID:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.id}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Transaction ID:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.transactionId}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Customer:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.customerName}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Booking ID:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.bookingId}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Description:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.description}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Payment Method:</Typography>
                    <Typography variant="body2" fontWeight="medium">{selectedPayment.paymentMethod}</Typography>
                  </div>
                  <div className="receipt-row">
                    <Typography variant="body2" color="textSecondary">Amount:</Typography>
                    <Typography variant="h6" color="primary">
                      {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
                    </Typography>
                  </div>
                  {selectedPayment.paymentDate && (
                    <div className="receipt-row">
                      <Typography variant="body2" color="textSecondary">Paid On:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(selectedPayment.paymentDate).toLocaleString()}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button variant="contained" startIcon={<Download />} onClick={() => console.log('Download receipt')}>
              Download Receipt
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Payments;