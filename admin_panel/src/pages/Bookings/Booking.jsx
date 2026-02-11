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
  Divider,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
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
  Email,
  LocationOn as LocationIcon,
  Notes as NotesIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import './Booking.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const Booking = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Updated vehicle booking data to match first image
  const bookingsData = [
    {
      id: 1,
      customer: 'John Doe',
      email: 'john@example.com',
      pickupLocation: 'Colombo Airport',
      dropLocation: 'Sigiriya',
      vehicleType: 'SUV',
      pickupDate: '2024-01-15',
      returnDate: '2024-01-17',
      passengers: 2,
      status: 'confirmed',
      amount: '$450',
      phone: '+1 234-567-8901',
      notes: 'Need child seat'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      email: 'jane@example.com',
      pickupLocation: 'Bentota',
      dropLocation: 'Colombo',
      vehicleType: 'Sedan',
      pickupDate: '2024-01-20',
      returnDate: '2024-01-22',
      passengers: 4,
      status: 'pending',
      amount: '$320',
      phone: '+1 234-567-8902',
      notes: 'Extra luggage'
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      email: 'robert@example.com',
      pickupLocation: 'Kandy',
      dropLocation: 'Nuwara Eliya',
      vehicleType: 'Van',
      pickupDate: '2024-02-05',
      returnDate: '2024-02-07',
      passengers: 7,
      status: 'confirmed',
      amount: '$580',
      phone: '+1 234-567-8903',
      notes: ''
    },
    {
      id: 4,
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      pickupLocation: 'Galle',
      dropLocation: 'Mirissa',
      vehicleType: 'SUV',
      pickupDate: '2024-01-28',
      returnDate: '2024-01-30',
      passengers: 3,
      status: 'cancelled',
      amount: '$380',
      phone: '+1 234-567-8904',
      notes: 'Need beach access'
    },
    {
      id: 5,
      customer: 'Michael Chen',
      email: 'michael@example.com',
      pickupLocation: 'Colombo',
      dropLocation: 'Ella',
      vehicleType: 'Premium SUV',
      pickupDate: '2024-02-10',
      returnDate: '2024-02-15',
      passengers: 2,
      status: 'confirmed',
      amount: '$890',
      phone: '+1 234-567-8905',
      notes: 'Long distance trip'
    },
    {
      id: 6,
      customer: 'Emma Davis',
      email: 'emma@example.com',
      pickupLocation: 'Negombo',
      dropLocation: 'Dambulla',
      vehicleType: 'Sedan',
      pickupDate: '2024-01-25',
      returnDate: '2024-01-26',
      passengers: 2,
      status: 'pending',
      amount: '$250',
      phone: '+1 234-567-8906',
      notes: 'One way trip'
    },
    {
      id: 7,
      customer: 'David Wilson',
      email: 'david@example.com',
      pickupLocation: 'Colombo Airport',
      dropLocation: 'Bentota',
      vehicleType: 'Van',
      pickupDate: '2024-02-01',
      returnDate: '2024-02-05',
      passengers: 6,
      status: 'confirmed',
      amount: '$650',
      phone: '+1 234-567-8907',
      notes: 'Family vacation'
    },
  ];

  // Vehicle types for filter
  const vehicleTypes = ['all', 'Sedan', 'SUV', 'Van', 'Premium SUV', 'Bus', 'Mini Van'];

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
    showSnackbar(`Booking ${newStatus} successfully!`, 'success');
  };

  const handleDeleteConfirm = () => {
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
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'all' || booking.vehicleType === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
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
    <>
      <Card className="booking-container" elevation={0}>
        <PageHeader
          title="Vehicle Bookings Management"
          subtitle="Manage and track all vehicle rental bookings"
          primaryAction={{
            label: 'Export',
            onClick: () => handleExport(),
            icon: <DownloadIcon />
          }}
          secondaryActions={[
            {
              label: 'Print All',
              onClick: () => showSnackbar('Printing all bookings...', 'info'),
              icon: <Print />
            },
            {
              label: 'Email All',
              onClick: () => showSnackbar('Sending emails to all customers...', 'info'),
              icon: <Email />
            }
          ]}
          variant="gradient"
        />

        <Box className="booking-controls">
          <TextField
            placeholder="Search by customer, location, vehicle..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box className="filter-buttons">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={vehicleFilter}
                label="Vehicle Type"
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Vehicles' : type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
              <Chip
                key={status}
                label={status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
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
                <TableCell className="table-header-cell">Pickup Location</TableCell>
                <TableCell className="table-header-cell">Drop Location</TableCell>
                <TableCell className="table-header-cell">Vehicle</TableCell>
                <TableCell className="table-header-cell">Pickup Date</TableCell>
                <TableCell className="table-header-cell">Return Date</TableCell>
                <TableCell className="table-header-cell">Passengers</TableCell>
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
                    <Box className="location-cell">
                      <LocationIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {booking.pickupLocation}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="location-cell">
                      <LocationIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {booking.dropLocation}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="vehicle-cell">
                      <CarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      <Chip
                        label={booking.vehicleType}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="date-cell">
                      <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {formatDate(booking.pickupDate)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="date-cell">
                      <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      {formatDate(booking.returnDate)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<PeopleIcon fontSize="small" />}
                      label={`${booking.passengers} ${booking.passengers === 1 ? 'pax' : 'pax'}`}
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

      {/* View Booking Details Dialog */}
      <Dialog
        open={openDialog && dialogType === 'view'}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Vehicle Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box className="booking-details">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    CUSTOMER INFORMATION
                  </Typography>
                  <Typography variant="h6">{selectedBooking.customer}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBooking.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedBooking.phone}</Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    PICKUP DETAILS
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body1">{selectedBooking.pickupLocation}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2">{formatDate(selectedBooking.pickupDate)}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    DROP DETAILS
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body1">{selectedBooking.dropLocation}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2">{formatDate(selectedBooking.returnDate)}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    VEHICLE INFORMATION
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body1">{selectedBooking.vehicleType}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    <Typography variant="body2">{selectedBooking.passengers} Passengers</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    BOOKING INFORMATION
                  </Typography>
                  <Typography variant="body2">Booking ID: #{selectedBooking.id}</Typography>
                  <Typography variant="body2">Amount: {selectedBooking.amount}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {getStatusChip(selectedBooking.status)}
                  </Box>
                </Grid>

                {selectedBooking.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      ADDITIONAL NOTES
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <NotesIcon fontSize="small" sx={{ mr: 1, opacity: 0.7, mt: 0.5 }} />
                      <Typography variant="body2">{selectedBooking.notes}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
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
            Are you sure you want to delete the vehicle booking for {selectedBooking?.customer}?
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
  );
};

export default Booking;