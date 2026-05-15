// Payments.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  Popper
} from '@mui/material';
import {
  AccountBalance,
  AccountBalanceWallet,
  AttachMoney,
  Autorenew,
  CalendarToday,
  Cancel,
  CheckCircle,
  CheckCircleOutline,
  CreditCard,
  Download,
  Email,
  ErrorOutline,
  Edit,
  Add,
  MoreVert,
  Payment,
  Pending,
  Print,
  Receipt,
  Refresh,
  Schedule,
  Search,
  TrendingDown,
  TrendingUp
} from '@mui/icons-material';
import './Payments.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const PAYMENT_METHOD_OPTIONS = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash'];
const STATUS_OPTIONS = ['pending', 'completed', 'failed', 'refunded'];

const createInitialStats = () => ({
  total: 0,
  completed: 0,
  pending: 0,
  failed: 0,
  refunded: 0,
  totalTrend: 12.5,
  completedTrend: 8.2,
  pendingTrend: -3.5,
  failedTrend: 2.1,
  refundedTrend: -1.8,
});

const createInitialPaymentForm = () => ({
  booking_id: '',
  customer_name: '',
  customer_email: '',
  amount: '',
  currency: 'USD',
  payment_method: 'Credit Card',
  status: 'pending',
  transaction_id: '',
  payment_date: '',
  due_date: '',
  description: '',
});

const createInitialEditForm = (payment = null) => ({
  id: payment?.id ?? null,
  payment_code: payment?.payment_code ?? '',
  booking_label: payment?.booking_id ? `Booking #${payment.booking_id}` : 'No booking',
  customer_name: payment?.customer_name ?? '',
  customer_email: payment?.customer_email ?? '',
  amount: payment?.amount !== undefined && payment?.amount !== null ? String(payment.amount) : '',
  currency: payment?.currency ?? 'USD',
  payment_method: payment?.payment_method ?? 'Credit Card',
  status: payment?.status ?? 'pending',
  transaction_id: payment?.transaction_id ?? '',
  payment_date: payment?.payment_date ?? '',
  due_date: payment?.due_date ?? '',
  description: payment?.description ?? '',
});

const dialogSx = {
  zIndex: 1601,
  '& .MuiDialog-paper': {
    mt: { xs: 10, sm: 12 },
    mb: 3,
    maxHeight: 'calc(100% - 120px)',
  },
};

const dialogSelectMenuProps = {
  sx: {
    zIndex: 1702,
  },
  PaperProps: {
    sx: {
      zIndex: 1702,
      maxHeight: 320,
    },
  },
};

const DialogAutocompletePopper = (props) => (
  <Popper {...props} placement="bottom-start" style={{ ...(props.style || {}), zIndex: 1702 }} />
);

const getPaymentsPage = (page, perPage, search = '', status = 'all', paymentMethod = 'all') =>
  api.get('/GetPayments', {
    params: {
      page,
      per_page: perPage,
      search: search || undefined,
      status: status !== 'all' ? status : undefined,
      payment_method: paymentMethod !== 'all' ? paymentMethod : undefined,
    },
  });

const getPaymentStats = () => api.get('/PaymentStats');

const mapStatsState = (statsData = {}) => ({
  total: Number(statsData.total || 0),
  completed: Number(statsData.completed || 0),
  pending: Number(statsData.pending || 0),
  failed: Number(statsData.failed || 0),
  refunded: Number(statsData.refunded || 0),
});

const mapPayment = (payment) => ({
  recordId: payment.id,
  id: payment.payment_code || `PAY-${String(payment.id).padStart(5, '0')}`,
  customerName: payment.customer_name || 'N/A',
  customerEmail: payment.customer_email || 'N/A',
  bookingId: payment.booking_id ? `Booking #${payment.booking_id}` : 'No booking',
  amount: Number(payment.amount || 0),
  currency: payment.currency || 'USD',
  paymentMethod: payment.payment_method || 'Credit Card',
  status: payment.status || 'pending',
  transactionId: payment.transaction_id || 'Not assigned',
  paymentDate: payment.payment_date || '',
  dueDate: payment.due_date || '',
  description: payment.description || 'N/A',
});

const formatDateTimeInputValue = (value) => {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Payments = () => {
  const skipNextLoadRef = useRef(false);

  const [payments, setPayments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPaymentsCount, setTotalPaymentsCount] = useState(0);
  const [orderBy, setOrderBy] = useState('paymentDate');
  const [order, setOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [bookingOptions, setBookingOptions] = useState([]);
  const [paymentForm, setPaymentForm] = useState(createInitialPaymentForm());
  const [paymentFormErrors, setPaymentFormErrors] = useState({});
  const [editFormData, setEditFormData] = useState(createInitialEditForm());
  const [editFormErrors, setEditFormErrors] = useState({});
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [stats, setStats] = useState(createInitialStats());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0);
      setSearchTerm(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      try {
        const response = await getPaymentStats();

        if (!isActive) {
          return;
        }

        setStats((prev) => ({
          ...prev,
          ...mapStatsState(response.data.stats),
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Error fetching payment stats:', error);
      }
    };

    loadStats();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadPayments = async () => {
      if (skipNextLoadRef.current) {
        skipNextLoadRef.current = false;
        return;
      }

      setTableLoading(true);

      try {
        const response = await getPaymentsPage(
          page + 1,
          rowsPerPage,
          searchTerm,
          filterStatus,
          filterMethod
        );

        if (!isActive) {
          return;
        }

        setPayments((response.data.payments || []).map(mapPayment));
        setTotalPaymentsCount(response.data.pagination?.total || 0);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Error fetching payments:', error);
        setPayments([]);
        setTotalPaymentsCount(0);
        showSnackbar(error.response?.data?.message || 'Failed to retrieve payments.', 'error');
      } finally {
        if (isActive) {
          setTableLoading(false);
        }
      }
    };

    loadPayments();

    return () => {
      isActive = false;
    };
  }, [page, rowsPerPage, searchTerm, filterStatus, filterMethod]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarState({
      open: true,
      severity,
      message,
    });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const loadBookingOptions = async () => {
    try {
      const response = await api.get('/GetBookings', {
        params: {
          page: 1,
          per_page: 50,
        },
      });

      setBookingOptions(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching booking options:', error);
      showSnackbar('Unable to load booking options.', 'error');
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (orderBy === 'amount') {
      return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }

    if (orderBy === 'paymentDate') {
      const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
      const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    }

    const valueA = String(a[orderBy] || '');
    const valueB = String(b[orderBy] || '');

    return order === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = (clearSelection = true) => {
    setAnchorEl(null);

    if (clearSelection) {
      setSelectedPayment(null);
    }
  };

  const handleAction = (action) => {
    console.log(`${action} payment:`, selectedPayment);

    if (action === 'View Receipt') {
      setOpenDialog(true);
      handleMenuClose(false);
      return;
    }

    if (action === 'Edit Payment') {
      handleEditPayment(selectedPayment?.recordId);
      handleMenuClose(false);
      return;
    }

    if (action === 'Mark as Complete') {
      handleMarkAsComplete(selectedPayment);
      handleMenuClose();
      return;
    }

    handleMenuClose();
  };

  const handleCloseReceiptDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
  };

  const handleOpenSaveDialog = async () => {
    setPaymentForm(createInitialPaymentForm());
    setPaymentFormErrors({});
    setSaveDialogOpen(true);

    if (bookingOptions.length === 0) {
      await loadBookingOptions();
    }
  };

  const handleCloseSaveDialog = () => {
    if (saveLoading) {
      return;
    }

    setSaveDialogOpen(false);
    setPaymentForm(createInitialPaymentForm());
    setPaymentFormErrors({});
  };

  const handlePaymentFieldChange = (field) => (event) => {
    const value = event.target.value;

    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPaymentFormErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleEditFieldChange = (field) => (event) => {
    const value = event.target.value;

    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setEditFormErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleBookingSelection = (_, selectedBooking) => {
    setPaymentForm((prev) => ({
      ...prev,
      booking_id: selectedBooking ? String(selectedBooking.id) : '',
      customer_name: selectedBooking ? selectedBooking.customer_name || '' : prev.customer_name,
      customer_email: selectedBooking ? selectedBooking.customer_email || '' : prev.customer_email,
      amount: selectedBooking && !prev.amount ? String(selectedBooking.amount || '') : prev.amount,
      due_date: selectedBooking && !prev.due_date ? selectedBooking.pickup_date || '' : prev.due_date,
      description: selectedBooking && !prev.description
        ? `${selectedBooking.vehicle_type || 'Booking'} payment`
        : prev.description,
    }));
  };

  const validatePaymentForm = () => {
    const errors = {};

    if (!paymentForm.customer_name.trim()) {
      errors.customer_name = 'Customer name is required.';
    }

    if (!paymentForm.customer_email.trim()) {
      errors.customer_email = 'Customer email is required.';
    } else if (!/\S+@\S+\.\S+/.test(paymentForm.customer_email.trim())) {
      errors.customer_email = 'Enter a valid email address.';
    }

    if (paymentForm.amount === '') {
      errors.amount = 'Amount is required.';
    } else if (Number(paymentForm.amount) < 0) {
      errors.amount = 'Amount must be 0 or greater.';
    }

    if (paymentForm.transaction_id.length > 191) {
      errors.transaction_id = 'Transaction ID must be 191 characters or less.';
    }

    if (paymentForm.description.length > 255) {
      errors.description = 'Description must be 255 characters or less.';
    }

    setPaymentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};

    if (editFormData.amount === '') {
      errors.amount = 'Amount is required.';
    } else if (Number(editFormData.amount) < 0) {
      errors.amount = 'Amount must be 0 or greater.';
    }

    if (editFormData.transaction_id.length > 191) {
      errors.transaction_id = 'Transaction ID must be 191 characters or less.';
    }

    if (editFormData.description.length > 255) {
      errors.description = 'Description must be 255 characters or less.';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const refreshPaymentStats = async () => {
    try {
      const response = await getPaymentStats();

      setStats((prev) => ({
        ...prev,
        ...mapStatsState(response.data.stats),
      }));
    } catch (error) {
      console.error('Error refreshing payment stats:', error);
    }
  };

  const handleSavePayment = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    setSaveLoading(true);

    try {
      const payload = {
        booking_id: paymentForm.booking_id ? Number(paymentForm.booking_id) : null,
        customer_name: paymentForm.customer_name.trim(),
        customer_email: paymentForm.customer_email.trim(),
        amount: Number(paymentForm.amount),
        currency: (paymentForm.currency || 'USD').trim().toUpperCase(),
        payment_method: paymentForm.payment_method,
        status: paymentForm.status,
        transaction_id: paymentForm.transaction_id.trim() || null,
        payment_date: paymentForm.payment_date || null,
        due_date: paymentForm.due_date || null,
        description: paymentForm.description.trim() || null,
      };

      const response = await api.post('/AddPayment', payload);
      const createdPayment = mapPayment(response.data.payment);

      skipNextLoadRef.current = true;
      setPage(0);
      setSearchInput('');
      setSearchTerm('');
      setFilterStatus('all');
      setFilterMethod('all');
      setPayments((prev) => [
        createdPayment,
        ...prev.filter((payment) => payment.recordId !== createdPayment.recordId),
      ]);
      setTotalPaymentsCount((prev) => prev + 1);
      await refreshPaymentStats();
      setSaveDialogOpen(false);
      setPaymentForm(createInitialPaymentForm());
      setPaymentFormErrors({});
      showSnackbar(response.data.message || 'Payment created successfully.');
    } catch (error) {
      console.error('Error saving payment:', error);

      if (error.response?.status === 422) {
        const backendErrors = error.response.data?.errors || {};

        setPaymentFormErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(backendErrors).map(([key, value]) => [
              key,
              Array.isArray(value) ? value[0] : value,
            ])
          ),
        }));
      }

      showSnackbar(error.response?.data?.message || 'Failed to save payment.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const refreshPaymentsPage = async (targetPage = page) => {
    const response = await getPaymentsPage(
      targetPage + 1,
      rowsPerPage,
      searchTerm,
      filterStatus,
      filterMethod
    );

    const nextPayments = (response.data.payments || []).map(mapPayment);
    const total = response.data.pagination?.total || 0;

    if (targetPage > 0 && nextPayments.length === 0 && total > 0) {
      const fallbackPage = targetPage - 1;
      const fallbackResponse = await getPaymentsPage(
        fallbackPage + 1,
        rowsPerPage,
        searchTerm,
        filterStatus,
        filterMethod
      );

      setPage(fallbackPage);
      setPayments((fallbackResponse.data.payments || []).map(mapPayment));
      setTotalPaymentsCount(fallbackResponse.data.pagination?.total || 0);
      return;
    }

    setPayments(nextPayments);
    setTotalPaymentsCount(total);
  };

  const syncPaymentState = (updatedPayment) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.recordId === updatedPayment.recordId ? updatedPayment : payment
      )
    );

    if (selectedPayment?.recordId === updatedPayment.recordId) {
      setSelectedPayment(updatedPayment);
    }
  };

  const handleEditPayment = async (id) => {
    if (!id) {
      return;
    }

    setEditDialogOpen(true);
    setEditLoading(true);
    setEditFormErrors({});

    try {
      const response = await api.get(`/GetPayments/${id}`);
      const payment = response.data.payment;

      if (!payment) {
        throw new Error('Payment not found');
      }

      setEditFormData(createInitialEditForm(payment));
    } catch (error) {
      console.error('Error fetching payment for edit:', error);
      setEditDialogOpen(false);
      setEditFormData(createInitialEditForm());
      showSnackbar('Unable to load payment for editing.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const resetEditDialog = () => {
    setEditDialogOpen(false);
    setEditLoading(false);
    setEditFormErrors({});
    setEditFormData(createInitialEditForm());
  };

  const handleCloseEditDialog = () => {
    if (saveLoading) {
      return;
    }

    resetEditDialog();
  };

  const handleUpdatePayment = async () => {
    if (!validateEditForm()) {
      return;
    }

    setSaveLoading(true);

    try {
      const payload = {
        amount: Number(editFormData.amount),
        payment_method: editFormData.payment_method,
        status: editFormData.status,
        transaction_id: editFormData.transaction_id.trim() || null,
        payment_date: editFormData.payment_date || null,
        due_date: editFormData.due_date || null,
        description: editFormData.description.trim() || null,
      };

      const response = await api.put(`/UpdatePayment/${editFormData.id}`, payload);
      const updatedPayment = mapPayment(response.data.payment);

      if (searchTerm !== '' || filterStatus !== 'all' || filterMethod !== 'all') {
        await refreshPaymentsPage();
      } else {
        syncPaymentState(updatedPayment);
      }

      await refreshPaymentStats();
      resetEditDialog();
      showSnackbar(response.data.message || 'Payment updated successfully.');
    } catch (error) {
      console.error('Error updating payment:', error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const fieldErrors = Object.entries(error.response.data.errors).reduce((acc, [field, messages]) => {
          acc[field] = Array.isArray(messages) ? messages[0] : messages;
          return acc;
        }, {});

        setEditFormErrors(fieldErrors);
      }

      showSnackbar(error.response?.data?.message || 'Failed to update payment.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleMarkAsComplete = async (payment) => {
    if (!payment?.recordId) {
      return;
    }

    if (payment.status === 'completed') {
      showSnackbar('Payment is already completed.', 'info');
      return;
    }

    setSaveLoading(true);

    try {
      const payload = {
        amount: Number(payment.amount),
        payment_method: payment.paymentMethod,
        status: 'completed',
        transaction_id: payment.transactionId === 'Not assigned' ? null : payment.transactionId,
        payment_date: payment.paymentDate || null,
        due_date: payment.dueDate || null,
        description: payment.description === 'N/A' ? null : payment.description,
      };

      const response = await api.put(`/UpdatePayment/${payment.recordId}`, payload);
      const updatedPayment = mapPayment(response.data.payment);

      if (searchTerm !== '' || filterStatus !== 'all' || filterMethod !== 'all') {
        await refreshPaymentsPage();
      } else {
        syncPaymentState(updatedPayment);
      }

      await refreshPaymentStats();
      showSnackbar(response.data.message || 'Payment marked as completed.');
    } catch (error) {
      console.error('Error marking payment as complete:', error);
      showSnackbar(error.response?.data?.message || 'Failed to mark payment as completed.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

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

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card':
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

  const handlePrintAll = () => {
    console.log('Printing all payments...');
  };

  const handleEmailAll = () => {
    console.log('Emailing all payments...');
  };

  // Stats grid data
  const statCards = [
    {
      type: 'total',
      icon: <AccountBalanceWallet fontSize="large" />,
      value: stats.total,
      label: 'Total Revenue',
      trend: stats.totalTrend,
      progress: 85
    },
    {
      type: 'completed',
      icon: <CheckCircleOutline fontSize="large" />,
      value: stats.completed,
      label: 'Completed',
      trend: stats.completedTrend,
      progress: null
    },
    {
      type: 'pending',
      icon: <Schedule fontSize="large" />,
      value: stats.pending,
      label: 'Pending',
      trend: stats.pendingTrend,
      progress: null
    },
    {
      type: 'failed',
      icon: <ErrorOutline fontSize="large" />,
      value: stats.failed,
      label: 'Failed',
      trend: stats.failedTrend,
      progress: null
    },
    {
      type: 'refunded',
      icon: <Autorenew fontSize="large" />,
      value: stats.refunded,
      label: 'Refunded',
      trend: stats.refundedTrend,
      progress: null
    }
  ];

  return (
    <div className="payments-container">
      <PageHeader
        title="Payment Management"
        subtitle="View and manage all your payments in one place"
        primaryAction={{
          label: 'Add',
          onClick: handleOpenSaveDialog,
          icon: <Add />
        }}
        secondaryActions={[
          {
            label: 'Print All',
            onClick: handlePrintAll,
            icon: <Print />
          },
          {
            label: 'Email All',
            onClick: handleEmailAll,
            icon: <Email />
          }
        ]}
        variant="gradient"
      />

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.type} className={`stat-card ${stat.type}`}>
            <div className="card-header">
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className={`stat-trend ${stat.trend >= 0 ? 'positive' : 'negative'}`}>
                {stat.trend >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div className="card-content">
              <div className="stat-value">
                <span className="currency">$</span>
                {stat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
            {stat.progress && (
              <div className="stat-progress">
                <div className="progress-label">
                  <span>Monthly Target</span>
                  <span>{stat.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Table */}
      <Paper className="payments-paper">
        {/* Header */}
        <div className="table-header">
          <div className="header-actions">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search payments..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              className="search-field"
            />

            <FormControl size="small" className="filter-field" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(event) => {
                  setFilterStatus(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" className="filter-field" sx={{ minWidth: 200 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={filterMethod}
                label="Method"
                onChange={(event) => {
                  setFilterMethod(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
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
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box className="payments-table-state">
                      <Typography>Loading payments...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : sortedPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box className="payments-table-state">
                      <Typography>No payments found.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                sortedPayments.map((payment) => {
                  const statusConfig = getStatusConfig(payment.status);

                  return (
                    <TableRow key={payment.recordId} hover>
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
                        {payment.dueDate ? (
                          <div className="date-cell">
                            <CalendarToday fontSize="small" className="date-icon" />
                            <Typography variant="body2">
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </Typography>
                          </div>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No due date
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuOpen(event, payment)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalPaymentsCount}
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
        onClose={() => handleMenuClose()}
      >
        <MenuItem onClick={() => handleAction('Edit Payment')}>
          <Edit fontSize="small" className="menu-icon" />
          Edit Payment
        </MenuItem>
        <MenuItem onClick={() => handleAction('View Receipt')}>
          <Receipt fontSize="small" className="menu-icon" />
          View Receipt
        </MenuItem>
        <MenuItem onClick={() => handleAction('Mark as Complete')}>
          <CheckCircle fontSize="small" className="menu-icon" />
          Mark as Complete
        </MenuItem>
      </Menu>

      <Dialog open={saveDialogOpen} onClose={handleCloseSaveDialog} maxWidth="md" fullWidth sx={dialogSx}>
        <DialogTitle className="payment-dialog-title">
          Save Payment
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
              pt: 1,
            }}
          >
            <Autocomplete
              options={bookingOptions}
              value={bookingOptions.find((booking) => String(booking.id) === String(paymentForm.booking_id)) || null}
              onChange={handleBookingSelection}
              getOptionLabel={(booking) => `#${booking.id} - ${booking.customer_name} (${booking.vehicle_type})`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              PopperComponent={DialogAutocompletePopper}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Booking"
                  placeholder="Search booking..."
                  fullWidth
                />
              )}
            />

            <TextField
              label="Currency"
              value={paymentForm.currency}
              InputProps={{ readOnly: true }}
              disabled
              fullWidth
            />

            <TextField
              label="Customer Name"
              value={paymentForm.customer_name}
              onChange={handlePaymentFieldChange('customer_name')}
              error={Boolean(paymentFormErrors.customer_name)}
              helperText={paymentFormErrors.customer_name}
              fullWidth
            />

            <TextField
              label="Customer Email"
              type="email"
              value={paymentForm.customer_email}
              onChange={handlePaymentFieldChange('customer_email')}
              error={Boolean(paymentFormErrors.customer_email)}
              helperText={paymentFormErrors.customer_email}
              fullWidth
            />

            <TextField
              label="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={handlePaymentFieldChange('amount')}
              error={Boolean(paymentFormErrors.amount)}
              helperText={paymentFormErrors.amount}
              inputProps={{ min: 0, step: '0.01' }}
              fullWidth
            />

            <TextField
              label="Transaction ID"
              value={paymentForm.transaction_id}
              onChange={handlePaymentFieldChange('transaction_id')}
              error={Boolean(paymentFormErrors.transaction_id)}
              helperText={paymentFormErrors.transaction_id}
              fullWidth
            />

            <TextField
              label="Payment Method"
              select
              value={paymentForm.payment_method}
              onChange={handlePaymentFieldChange('payment_method')}
              error={Boolean(paymentFormErrors.payment_method)}
              helperText={paymentFormErrors.payment_method}
              fullWidth
              SelectProps={{ MenuProps: dialogSelectMenuProps }}
            >
              {PAYMENT_METHOD_OPTIONS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Status"
              select
              value={paymentForm.status}
              onChange={handlePaymentFieldChange('status')}
              error={Boolean(paymentFormErrors.status)}
              helperText={paymentFormErrors.status}
              fullWidth
              SelectProps={{ MenuProps: dialogSelectMenuProps }}
            >
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Payment Date"
              type="datetime-local"
              value={formatDateTimeInputValue(paymentForm.payment_date)}
              onChange={handlePaymentFieldChange('payment_date')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Due Date"
              type="date"
              value={paymentForm.due_date}
              onChange={handlePaymentFieldChange('due_date')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Description"
              value={paymentForm.description}
              onChange={handlePaymentFieldChange('description')}
              error={Boolean(paymentFormErrors.description)}
              helperText={paymentFormErrors.description}
              multiline
              rows={4}
              fullWidth
              sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog} disabled={saveLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSavePayment} disabled={saveLoading}>
            {saveLoading ? 'Saving...' : 'Save Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth sx={dialogSx}>
        <DialogTitle className="payment-dialog-title">
          Edit Payment
        </DialogTitle>
        <DialogContent dividers>
          {editLoading ? (
            <Typography>Loading payment for editing...</Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="Payment ID"
                value={editFormData.payment_code}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Booking"
                value={editFormData.booking_label}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Customer Name"
                value={editFormData.customer_name}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Customer Email"
                value={editFormData.customer_email}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <TextField
                label="Currency"
                value={editFormData.currency}
                InputProps={{ readOnly: true }}
                disabled
                fullWidth
              />

              <TextField
                label="Amount"
                type="number"
                value={editFormData.amount}
                onChange={handleEditFieldChange('amount')}
                error={Boolean(editFormErrors.amount)}
                helperText={editFormErrors.amount}
                inputProps={{ min: 0, step: '0.01' }}
                fullWidth
              />

              <TextField
                label="Payment Method"
                select
                value={editFormData.payment_method}
                onChange={handleEditFieldChange('payment_method')}
                error={Boolean(editFormErrors.payment_method)}
                helperText={editFormErrors.payment_method}
                fullWidth
                SelectProps={{ MenuProps: dialogSelectMenuProps }}
              >
                {PAYMENT_METHOD_OPTIONS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Status"
                select
                value={editFormData.status}
                onChange={handleEditFieldChange('status')}
                error={Boolean(editFormErrors.status)}
                helperText={editFormErrors.status}
                fullWidth
                SelectProps={{ MenuProps: dialogSelectMenuProps }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Transaction ID"
                value={editFormData.transaction_id}
                onChange={handleEditFieldChange('transaction_id')}
                error={Boolean(editFormErrors.transaction_id)}
                helperText={editFormErrors.transaction_id}
                fullWidth
              />

              <TextField
                label="Payment Date"
                type="datetime-local"
                value={formatDateTimeInputValue(editFormData.payment_date)}
                onChange={handleEditFieldChange('payment_date')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Due Date"
                type="date"
                value={editFormData.due_date}
                onChange={handleEditFieldChange('due_date')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Description"
                value={editFormData.description}
                onChange={handleEditFieldChange('description')}
                error={Boolean(editFormErrors.description)}
                helperText={editFormErrors.description}
                multiline
                rows={4}
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={saveLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdatePayment} disabled={editLoading || saveLoading}>
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={openDialog} onClose={handleCloseReceiptDialog} maxWidth="sm" fullWidth sx={dialogSx}>
        <DialogTitle className="payment-dialog-title">
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
          <Button onClick={handleCloseReceiptDialog}>Close</Button>
          <Button variant="contained" startIcon={<Download />} onClick={() => console.log('Download receipt')}>
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} sx={{ width: '100%' }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Payments;
