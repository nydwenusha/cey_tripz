// Booking.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Card,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Terrain as TerrainIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ConfirmationNumber as TicketIcon,
  Archive as ArchiveIcon,
  Print,
  Email
} from '@mui/icons-material';
import './Booking.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const Booking = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Extended sample data
  const bookingsData = [
    { id: 1, customer: 'John Doe', email: 'john@example.com', tour: 'Sigiriya Adventure', date: '2024-01-15', status: 'confirmed', guests: 2, amount: '$450', phone: '+1 234-567-8901' },
    { id: 2, customer: 'Jane Smith', email: 'jane@example.com', tour: 'Beach Paradise', date: '2024-01-20', status: 'pending', guests: 4, amount: '$720', phone: '+1 234-567-8902' },
    { id: 3, customer: 'Robert Johnson', email: 'robert@example.com', tour: 'Mountain Trek', date: '2024-02-05', status: 'confirmed', guests: 1, amount: '$220', phone: '+1 234-567-8903' },
    { id: 4, customer: 'Sarah Williams', email: 'sarah@example.com', tour: 'Cultural Heritage', date: '2024-01-28', status: 'cancelled', guests: 3, amount: '$380', phone: '+1 234-567-8904' },
    { id: 5, customer: 'Michael Chen', email: 'michael@example.com', tour: 'Wild Safari', date: '2024-02-10', status: 'confirmed', guests: 2, amount: '$520', phone: '+1 234-567-8905' },
    { id: 6, customer: 'Emma Davis', email: 'emma@example.com', tour: 'Sigiriya Adventure', date: '2024-01-25', status: 'pending', guests: 2, amount: '$450', phone: '+1 234-567-8906' },
    { id: 7, customer: 'David Wilson', email: 'david@example.com', tour: 'Beach Paradise', date: '2024-02-01', status: 'confirmed', guests: 5, amount: '$900', phone: '+1 234-567-8907' },
    { id: 8, customer: 'Lisa Brown', email: 'lisa@example.com', tour: 'City Lights Tour', date: '2024-01-30', status: 'confirmed', guests: 2, amount: '$300', phone: '+1 234-567-8908' },
  ];

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleAction = (action, booking = selectedBooking) => {
    handleMenuClose();

    switch (action) {
      case 'view':
        setDialogType('view');
        setOpenDialog(true);
        break;
      case 'edit':
        setDialogType('edit');
        setOpenDialog(true);
        break;
      case 'delete':
        setDialogType('delete');
        setOpenDialog(true);
        break;
      case 'confirm':
        handleStatusChange('confirmed', booking);
        break;
      case 'cancel':
        handleStatusChange('cancelled', booking);
        break;
      case 'sendEmail':
        showSnackbar('Email sent successfully!', 'success');
        break;
      case 'printTicket':
        showSnackbar('Ticket printed successfully!', 'success');
        break;
      case 'duplicate':
        showSnackbar('Booking duplicated!', 'info');
        break;
      case 'archive':
        showSnackbar('Booking archived!', 'info');
        break;
      default:
        break;
    }
  };

  const handleStatusChange = (newStatus, booking) => {
    // In a real app, you would update the backend here
    showSnackbar(`Booking ${newStatus} successfully!`, 'success');
  };

  const handleDeleteConfirm = () => {
    // In a real app, you would delete from backend here
    showSnackbar('Booking deleted successfully!', 'success');
    setOpenDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleExport = () => {
    showSnackbar('Exporting bookings data...', 'info');
    // In a real app, you would implement CSV/Excel export here
  };

  const handleBulkActions = (action) => {
    switch (action) {
      case 'export':
        handleExport();
        break;
      case 'printAll':
        showSnackbar('Printing all bookings...', 'info');
        break;
      case 'emailAll':
        showSnackbar('Sending emails to all customers...', 'info');
        break;
      default:
        break;
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon fontSize="small" /> },
      cancelled: { label: 'Cancelled', color: 'error', icon: <CloseIcon fontSize="small" /> }
    };

    const config = statusConfig[status] || { label: status, color: 'default' };

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter bookings
  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <MainLayout>
      <>



        <Card className="booking-container" elevation={0}>

          <PageHeader
            title="Bookings Management"
            subtitle="Manage and track all tour bookings in one place"
            primaryAction={{
              label: 'Export',
              onClick: () => handleExport(),
              icon: <DownloadIcon />
            }}
            secondaryActions={[
              {
                label: 'Print All',
                onClick: () => handlePrintAll(),
                icon: <Print />
              },
              {
                label: 'Email All',
                onClick: () => handleEmailAll(),
                icon: <Email />
              }
            ]}
            variant="gradient"
          />

          <Box className="booking-controls">
            <TextField
              placeholder="Search bookings..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box className="filter-buttons">
              {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                <Chip
                  key={status}
                  label={status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  onClick={() => setStatusFilter(status)}
                  color={statusFilter === status ? 'primary' : 'default'}
                  variant={statusFilter === status ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
              <Tooltip title="More filters">
                <IconButton size="small">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TableContainer component={Paper} className="booking-table-container" elevation={0}>
            <Table className="booking-table">
              <TableHead className="table-head">
                <TableRow>
                  <TableCell className="table-header-cell">Customer</TableCell>
                  <TableCell className="table-header-cell">Tour Package</TableCell>
                  <TableCell className="table-header-cell">Date</TableCell>
                  <TableCell className="table-header-cell">Guests</TableCell>
                  <TableCell className="table-header-cell">Amount</TableCell>
                  <TableCell className="table-header-cell">Status</TableCell>
                  <TableCell className="table-header-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBookings.map((booking) => (
                  <TableRow key={booking.id} className="table-row" hover>
                    <TableCell>
                      <Box className="customer-cell">
                        <Box className="customer-avatar">
                          <PersonIcon />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {booking.customer}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="tour-cell">
                        <TerrainIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                        {booking.tour}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className="date-cell">
                        <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                        {formatDate(booking.date)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="primary.main">
                        {booking.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(booking.status)}
                    </TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleAction('view', booking)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit booking">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleAction('edit', booking)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {booking.status === 'pending' && (
                          <Tooltip title="Confirm booking">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleAction('confirm', booking)}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {booking.status !== 'cancelled' && (
                          <Tooltip title="Cancel booking">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleAction('cancel', booking)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More options">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, booking)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="booking-footer">
            <Typography variant="body2" color="text.secondary">
              Showing {paginatedBookings.length} of {filteredBookings.length} bookings
            </Typography>
            <TablePagination
              component="div"
              count={filteredBookings.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </Card>

        {/* More Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 200 }
          }}
        >
          <MenuItem onClick={() => handleAction('sendEmail')}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            Send Email
          </MenuItem>
          <MenuItem onClick={() => handleAction('printTicket')}>
            <ListItemIcon>
              <TicketIcon fontSize="small" />
            </ListItemIcon>
            Print Ticket
          </MenuItem>
          <MenuItem onClick={() => handleAction('duplicate')}>
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => handleAction('archive')}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            Archive
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleAction('delete')}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>

        {/* View Dialog */}
        <Dialog
          open={openDialog && dialogType === 'view'}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Booking Details</DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box className="booking-details">
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">CUSTOMER</Typography>
                  <Typography variant="h6">{selectedBooking.customer}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBooking.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBooking.phone}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">TOUR DETAILS</Typography>
                  <Typography variant="body1">{selectedBooking.tour}</Typography>
                  <Typography variant="body2">Date: {formatDate(selectedBooking.date)}</Typography>
                  <Typography variant="body2">Guests: {selectedBooking.guests}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">BOOKING INFORMATION</Typography>
                  <Typography variant="body2">Booking ID: #{selectedBooking.id}</Typography>
                  <Typography variant="body2">Amount: {selectedBooking.amount}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {getStatusChip(selectedBooking.status)}
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenDialog(false);
                handleAction('edit', selectedBooking);
              }}
            >
              Edit Booking
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog && dialogType === 'delete'}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the booking for {selectedBooking?.customer}?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Delete Booking
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    </MainLayout>
  );
};

export default Booking;