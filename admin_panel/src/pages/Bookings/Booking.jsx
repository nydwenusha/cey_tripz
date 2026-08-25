import React, { useEffect, useMemo, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Archive as ArchiveIcon,
  CalendarMonth as CalendarMonthIcon,
  DirectionsCar as DirectionsCarIcon,
  Payments as PaymentsIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import './Booking.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const getBookingsPage = (page, perPage, search = '', vehicleType = 'all', status = 'all') =>
  api.get('/GetBookings', {
    params: {
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
      ...(vehicleType !== 'all' ? { vehicle_type: vehicleType } : {}),
      ...(status !== 'all' ? { status } : {}),
    },
  });

const fallbackVehicleCategories = {
  'Suzuki Alto': 'Mini Car',
  'Toyota Prius': 'Sedan Car',
  'Honda Shuttle': 'Sedan Car',
  'Toyota Axio': 'Sedan Car',
  'Suzuki Wagon R (FX)': 'Hatchback Car',
  'Suzuki Wagon R (FZ)': 'Hatchback Car',
  'Suzuki Wagon R (Stingray)': 'Hatchback Car',
  'Suzuki Every': 'Mini Van',
  'Toyota KDH': 'Seater Van',
  'Toyota Hiace': 'Seater Van',
};

const Booking = () => {
  const createInitialEditForm = (booking = {}) => ({
    id: booking.id ?? null,
    customer_name: booking.customer_name ?? '',
    customer_email: booking.customer_email ?? '',
    customer_phone: booking.customer_phone ?? '',
    pickup_location: booking.pickup_location ?? '',
    drop_location: booking.drop_location ?? '',
    pickup_date: booking.pickup_date ?? '',
    return_date: booking.return_date ?? '',
    vehicle_type: booking.vehicle_type ?? '',
    passengers: booking.passengers ?? '',
    amount: booking.amount ?? '',
    status: booking.status ?? 'pending',
    notes: booking.notes ?? '',
  });

  const getStatusChip = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon fontSize="small" /> },
      cancelled: { label: 'Cancelled', color: 'error', icon: <CloseIcon fontSize="small" /> },
      completed: { label: 'Completed', color: 'info', icon: <CheckCircleIcon fontSize="small" /> }
    };
    const config = statusConfig[status?.toLowerCase()] || { label: status || 'Unknown', color: 'default' };
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

  const getSelectedFilterChipStyles = (status) => {
    const selectedStyles = {
      all: { backgroundColor: '#4b5563 !important', borderColor: '#4b5563 !important' },
      confirmed: { backgroundColor: '#1b5e20 !important', borderColor: '#1b5e20 !important' },
      pending: { backgroundColor: '#b45309 !important', borderColor: '#b45309 !important' },
      cancelled: { backgroundColor: '#b91c1c !important', borderColor: '#b91c1c !important' },
      completed: { backgroundColor: '#0369a1 !important', borderColor: '#0369a1 !important' },
    };

    return {
      color: '#fff !important',
      opacity: '1 !important',
      fontWeight: 700,
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
      backgroundImage: 'none',
      ...selectedStyles[status],
      '& .MuiChip-label, & .MuiChip-icon': {
        color: '#fff !important',
      },
      '&:hover': {
        color: '#fff !important',
        opacity: '1 !important',
        backgroundImage: 'none',
        ...selectedStyles[status],
      },
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Sample static data for UI demonstration
  // const sampleBookings = [
  //   {
  //     id: 1,
  //     customer_name: 'John Doe',
  //     customer_email: 'john@example.com',
  //     customer_phone: '+1234567890',
  //     pickup_location: 'Airport',
  //     drop_location: 'City Center',
  //     vehicle_type: 'Toyota Prius',
  //     pickup_date: '2024-01-15',
  //     return_date: '2024-01-20',
  //     passengers: 4,
  //     amount: '$450.00',
  //     status: 'confirmed'
  //   },
  //   {
  //     id: 2,
  //     customer_name: 'Jane Smith',
  //     customer_email: 'jane@example.com',
  //     customer_phone: '+0987654321',
  //     pickup_location: 'Downtown',
  //     drop_location: 'Beach Resort',
  //     vehicle_type: 'Suzuki Wagon R (FX)',
  //     pickup_date: '2024-01-18',
  //     return_date: '2024-01-22',
  //     passengers: 2,
  //     amount: '$320.00',
  //     status: 'pending'
  //   },
  //   {
  //     id: 3,
  //     customer_name: 'Mike Johnson',
  //     customer_email: 'mike@example.com',
  //     customer_phone: '+1122334455',
  //     pickup_location: 'Train Station',
  //     drop_location: 'Business Park',
  //     vehicle_type: 'Toyota KDH',
  //     pickup_date: '2024-01-10',
  //     return_date: '2024-01-12',
  //     passengers: 8,
  //     amount: '$280.00',
  //     status: 'cancelled'
  //   }
  // ];
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusActionLoading, setStatusActionLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [menuBooking, setMenuBooking] = useState(null);
  const [deleteDialogState, setDeleteDialogState] = useState({
    open: false,
    booking: null,
  });
  const [statusDialogState, setStatusDialogState] = useState({
    open: false,
    booking: null,
    targetStatus: null,
  });
  const [editFormData, setEditFormData] = useState(createInitialEditForm());
  const [editFormErrors, setEditFormErrors] = useState({});
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const bookingDialogSelectMenuProps = {
    disableScrollLock: true,
    sx: {
      zIndex: 1702,
    },
    slotProps: {
      root: {
        sx: {
          zIndex: 1702,
        },
      },
      paper: {
        sx: {
          zIndex: 1702,
          maxHeight: 320,
        },
      },
    },
    PaperProps: {
      sx: {
        zIndex: 1702,
        maxHeight: 320,
      },
    },
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedVehicleType !== 'all' ||
    selectedStatusFilter !== 'all';

  useEffect(() => {
    const nextSearch = (searchParams.get('search') || '').trim();

    setSearchInput((prev) => (prev === nextSearch ? prev : nextSearch));
    setSearchTerm((prev) => (prev === nextSearch ? prev : nextSearch));
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const nextSearchTerm = searchInput.trim();
      setPage(0);
      setSearchTerm(nextSearchTerm);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    let isActive = true;

    const loadBookings = async () => {
      try {
        const response = await getBookingsPage(
          page + 1,
          rowsPerPage,
          searchTerm,
          selectedVehicleType,
          selectedStatusFilter
        );

        if (!isActive) {
          return;
        }

        setBookings(response.data.bookings || []);
        setTotalBookingsCount(response.data.pagination?.total || 0);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Error fetching bookings:', error);
        showSnackbar(error.response?.data?.message || 'Failed to retrieve bookings.', 'error');
      }
    };

    loadBookings();

    return () => {
      isActive = false;
    };
  }, [page, rowsPerPage, searchTerm, selectedVehicleType, selectedStatusFilter]);

  useEffect(() => {
    let isActive = true;

    const loadVehicles = async () => {
      try {
        const response = await api.get('/GetVehicles');

        if (!isActive) {
          return;
        }

        setVehicleOptions(response.data?.vehicles || []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Error fetching vehicles:', error);
        setVehicleOptions([]);
        showSnackbar(error.response?.data?.message || 'Failed to load vehicles.', 'error');
      }
    };

    loadVehicles();

    return () => {
      isActive = false;
    };
  }, []);

  const getVehicleCategory = (vehicleType) => {
    const matchedVehicle = vehicleOptions.find((vehicle) => vehicle.name === vehicleType);

    if (matchedVehicle?.category) {
      return matchedVehicle.category;
    }

    if (matchedVehicle?.type) {
      return matchedVehicle.type;
    }

    return fallbackVehicleCategories[vehicleType] || 'Unknown';
  };

  const vehicleTypes = useMemo(() => {
    const nextVehicleTypes = new Set(
      vehicleOptions
        .map((vehicle) => vehicle?.name?.trim())
        .filter(Boolean)
    );

    [
      editFormData.vehicle_type,
      selectedBooking?.vehicle_type,
      selectedVehicleType !== 'all' ? selectedVehicleType : '',
    ]
      .map((vehicleName) => vehicleName?.trim())
      .filter(Boolean)
      .forEach((vehicleName) => nextVehicleTypes.add(vehicleName));

    return Array.from(nextVehicleTypes).sort((left, right) => left.localeCompare(right));
  }, [editFormData.vehicle_type, selectedBooking?.vehicle_type, selectedVehicleType, vehicleOptions]);

  const refreshBookingsPage = async (targetPage = page) => {
    const response = await getBookingsPage(
      targetPage + 1,
      rowsPerPage,
      searchTerm,
      selectedVehicleType,
      selectedStatusFilter
    );

    const nextBookings = response.data.bookings || [];
    const total = response.data.pagination?.total || 0;

    if (targetPage > 0 && nextBookings.length === 0 && total > 0) {
      const fallbackPage = targetPage - 1;
      const fallbackResponse = await getBookingsPage(
        fallbackPage + 1,
        rowsPerPage,
        searchTerm,
        selectedVehicleType,
        selectedStatusFilter
      );

      setPage(fallbackPage);
      setBookings(fallbackResponse.data.bookings || []);
      setTotalBookingsCount(fallbackResponse.data.pagination?.total || 0);
      return;
    }

    setBookings(nextBookings);
    setTotalBookingsCount(total);
  };

  const syncBookingState = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );

    if (selectedBooking?.id === updatedBooking.id) {
      setSelectedBooking(updatedBooking);
    }

    if (editFormData.id === updatedBooking.id) {
      setEditFormData((prev) => ({
        ...prev,
        status: updatedBooking.status,
      }));
    }
  };

  const updateStatus = async (booking, newStatus) => {
    setStatusActionLoading(booking.id);

    try {
      const response = await api.put(`/updateStatus`, {
        id: booking.id,
        status: newStatus
      });

      const updatedBooking = response.data.booking;

      if (hasActiveFilters) {
        await refreshBookingsPage();
      } else {
        syncBookingState(updatedBooking);
      }

      showSnackbar(response.data.message || `Booking ${newStatus} successfully.`);
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update booking status.', 'error');
      return false;
    } finally {
      setStatusActionLoading(null);
    }
  };

  const handleViewDetails = async (id) => {
    setViewDialogOpen(true);
    setDetailsLoading(true);

    try {
      const response = await api.get(`/GetBookings/${id}`);
      setSelectedBooking(response.data.booking || null);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setSelectedBooking(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedBooking(null);
    setDetailsLoading(false);
  };

  const handleOpenActionMenu = (event, booking) => {
    setActionMenuAnchor(event.currentTarget);
    setMenuBooking(booking);
  };

  const handleCloseActionMenu = () => {
    if (deleteLoading) {
      return;
    }

    setActionMenuAnchor(null);
    setMenuBooking(null);
  };

  const handleOpenDeleteDialog = () => {
    if (!menuBooking) {
      return;
    }

    setDeleteDialogState({
      open: true,
      booking: menuBooking,
    });
    setActionMenuAnchor(null);
    setMenuBooking(null);
  };

  const handleCloseDeleteDialog = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteDialogState({
      open: false,
      booking: null,
    });
  };

  const openStatusDialog = (booking, targetStatus) => {
    setStatusDialogState({
      open: true,
      booking,
      targetStatus,
    });
  };

  const closeStatusDialog = () => {
    if (statusActionLoading) {
      return;
    }

    setStatusDialogState({
      open: false,
      booking: null,
      targetStatus: null,
    });
  };

  const handleConfirmStatusAction = async () => {
    if (!statusDialogState.booking || !statusDialogState.targetStatus) {
      return;
    }

    const wasUpdated = await updateStatus(statusDialogState.booking, statusDialogState.targetStatus);

    if (wasUpdated) {
      setStatusDialogState({
        open: false,
        booking: null,
        targetStatus: null,
      });
    }
  };

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

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleVehicleFilterChange = (event) => {
    setSelectedVehicleType(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatusFilter(status);
    setPage(0);
  };

  const handleEditFieldChange = (field) => (event) => {
    const { value } = event.target;

    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setEditFormErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.customer_name.trim()) {
      errors.customer_name = 'Customer name is required.';
    }

    if (!editFormData.customer_email.trim()) {
      errors.customer_email = 'Customer email is required.';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.customer_email)) {
      errors.customer_email = 'Enter a valid email address.';
    }

    if (!editFormData.pickup_location.trim()) {
      errors.pickup_location = 'Pickup location is required.';
    }

    if (!editFormData.drop_location.trim()) {
      errors.drop_location = 'Drop location is required.';
    }

    if (!editFormData.pickup_date) {
      errors.pickup_date = 'Pickup date is required.';
    }

    if (!editFormData.return_date) {
      errors.return_date = 'Return date is required.';
    } else if (editFormData.pickup_date && editFormData.return_date < editFormData.pickup_date) {
      errors.return_date = 'Return date cannot be before pickup date.';
    }

    if (!editFormData.vehicle_type) {
      errors.vehicle_type = 'Vehicle model is required.';
    }

    if (editFormData.passengers === '' || editFormData.passengers === null) {
      errors.passengers = 'Passenger count is required.';
    } else if (!Number.isInteger(Number(editFormData.passengers)) || Number(editFormData.passengers) < 1) {
      errors.passengers = 'Passengers must be at least 1.';
    }

    if (editFormData.amount === '' || editFormData.amount === null) {
      errors.amount = 'Amount is required.';
    } else if (Number.isNaN(Number(editFormData.amount)) || Number(editFormData.amount) < 0) {
      errors.amount = 'Amount must be 0 or greater.';
    }

    if (!editFormData.status) {
      errors.status = 'Status is required.';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditBooking = async (id) => {
    setEditDialogOpen(true);
    setEditLoading(true);
    setEditFormErrors({});

    try {
      const response = await api.get(`/GetBookings/${id}`);
      const booking = response.data.booking;

      if (!booking) {
        throw new Error('Booking not found');
      }

      setEditFormData(createInitialEditForm(booking));
    } catch (error) {
      console.error('Error fetching booking for edit:', error);
      setEditDialogOpen(false);
      setEditFormData(createInitialEditForm());
      showSnackbar('Unable to load booking for editing.', 'error');
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

  const handleSaveBooking = async () => {
    if (!validateEditForm()) {
      return;
    }

    setSaveLoading(true);

    try {
      const payload = {
        customer_name: editFormData.customer_name.trim(),
        customer_email: editFormData.customer_email.trim(),
        customer_phone: editFormData.customer_phone.trim() || null,
        pickup_location: editFormData.pickup_location.trim(),
        drop_location: editFormData.drop_location.trim(),
        pickup_date: editFormData.pickup_date,
        return_date: editFormData.return_date,
        vehicle_type: editFormData.vehicle_type,
        passengers: Number(editFormData.passengers),
        amount: Number(editFormData.amount),
        status: editFormData.status,
        notes: editFormData.notes.trim() || null,
      };

      const response = await api.put(`/UpdateBooking/${editFormData.id}`, payload);
      const updatedBooking = response.data.booking;

      if (hasActiveFilters) {
        await refreshBookingsPage();
      } else {
        syncBookingState(updatedBooking);
      }

      resetEditDialog();
      showSnackbar(response.data.message || 'Booking updated successfully.');
    } catch (error) {
      console.error('Error updating booking:', error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const fieldErrors = Object.entries(error.response.data.errors).reduce((acc, [field, messages]) => {
          acc[field] = Array.isArray(messages) ? messages[0] : messages;
          return acc;
        }, {});

        setEditFormErrors(fieldErrors);
      }

      showSnackbar(error.response?.data?.message || 'Failed to update booking.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteDialogState.booking) {
      return;
    }

    const bookingId = deleteDialogState.booking.id;
    const shouldMoveToPreviousPage = bookings.length === 1 && page > 0;
    const nextPage = shouldMoveToPreviousPage ? page - 1 : page;
    setDeleteLoading(bookingId);

    try {
      const response = await api.delete(`/DeleteBooking/${bookingId}`);

      if (selectedBooking?.id === bookingId) {
        handleCloseViewDialog();
      }

      if (editFormData.id === bookingId) {
        resetEditDialog();
      }

      setDeleteDialogState({
        open: false,
        booking: null,
      });

      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await refreshBookingsPage(nextPage);
      }

      showSnackbar(response.data.message || 'Booking deleted successfully.');
    } catch (error) {
      console.error('Error deleting booking:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete booking.', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      <Card className="booking-container" elevation={0}>
        <PageHeader
          title="Bookings Management"
          subtitle="Manage and track all vehicle rental bookings"
          primaryAction={{ label: 'Export', icon: <DownloadIcon /> }}
          secondaryActions={[
            { label: 'Print All', icon: <PrintIcon /> },
            { label: 'Email All', icon: <EmailIcon /> }
          ]}
          variant="gradient"
        />

        {/* Filters Section UI */}
        <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by customer, email, phone, location, vehicle..."
            variant="outlined"
            size="small"
            sx={{ width: 400 }}
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Vehicle Model</InputLabel>
              <Select
                label="Vehicle Model"
                value={selectedVehicleType}
                onChange={handleVehicleFilterChange}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                {vehicleTypes.map(vehicle => (
                  <MenuItem key={vehicle} value={vehicle}>{vehicle}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map(status => (
                <Chip
                  key={status}
                  label={status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  color={status === 'confirmed' ? 'success' :
                    status === 'pending' ? 'warning' :
                      status === 'cancelled' ? 'error' :
                        status === 'completed' ? 'info' : 'default'}
                  variant={selectedStatusFilter === status ? 'filled' : 'outlined'}
                  size="small"
                  sx={{
                    cursor: 'pointer',
                    ...(selectedStatusFilter === status ? getSelectedFilterChipStyles(status) : {}),
                  }}
                  onClick={() => handleStatusFilterChange(status)}
                />
              ))}
            </Box>

            <Tooltip title="More filters">
              <IconButton size="small">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Pickup Location</TableCell>
                <TableCell>Drop Location</TableCell>
                <TableCell>Vehicle Model</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Pickup Date</TableCell>
                <TableCell>Return Date</TableCell>
                <TableCell>Passengers</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon />
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {booking.customer_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {booking.customer_email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          📞 {booking.customer_phone}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{booking.pickup_location}</TableCell>
                  <TableCell>{booking.drop_location}</TableCell>
                  <TableCell>{booking.vehicle_type}</TableCell>
                  <TableCell>{getVehicleCategory(booking.vehicle_type)}</TableCell>
                  <TableCell>{formatDate(booking.pickup_date)}</TableCell>
                  <TableCell>{formatDate(booking.return_date)}</TableCell>
                  <TableCell>{booking.passengers}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View details">
                        <IconButton size="small" color="info" onClick={() => handleViewDetails(booking.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit booking">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditBooking(booking.id)}
                          disabled={statusActionLoading === booking.id || deleteLoading === booking.id}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {booking.status === 'pending' && (
                        <Tooltip title="Confirm booking">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => openStatusDialog(booking, 'confirmed')}
                            disabled={statusActionLoading === booking.id || deleteLoading === booking.id}
                          >
                            {statusActionLoading === booking.id && statusDialogState.targetStatus === 'confirmed' ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <CheckIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Tooltip title="Cancel booking">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => openStatusDialog(booking, 'cancelled')}
                            disabled={statusActionLoading === booking.id || deleteLoading === booking.id}
                          >
                            {statusActionLoading === booking.id && statusDialogState.targetStatus === 'cancelled' ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="More options">
                        <IconButton
                          size="small"
                          onClick={(event) => handleOpenActionMenu(event, booking)}
                          disabled={statusActionLoading === booking.id || deleteLoading === booking.id}
                        >
                          {deleteLoading === booking.id ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : (
                            <MoreVertIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination UI */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <TablePagination
            component="div"
            count={totalBookingsCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      </Card>

      {/* Actions Menu UI */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDeleteDialog} disabled={!menuBooking || Boolean(deleteLoading)}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog UI */}
      <Dialog open={deleteDialogState.open} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
          },
        }}>
        <DialogTitle className="booking-dialog-title">Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={Boolean(deleteLoading)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteBooking} disabled={Boolean(deleteLoading)}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusDialogState.open} onClose={closeStatusDialog} maxWidth="xs" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
          },
        }}>
        <DialogTitle className="booking-dialog-title">
          {statusDialogState.targetStatus === 'confirmed' ? 'Confirm Booking' : 'Cancel Booking'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            {statusDialogState.targetStatus === 'confirmed'
              ? 'Are you sure you want to confirm this booking?'
              : 'Are you sure you want to cancel this booking?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatusDialog} disabled={Boolean(statusActionLoading)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={statusDialogState.targetStatus === 'confirmed' ? 'success' : 'warning'}
            onClick={handleConfirmStatusAction}
            disabled={Boolean(statusActionLoading)}
          >
            {statusActionLoading
              ? (statusDialogState.targetStatus === 'confirmed' ? 'Confirming...' : 'Cancelling...')
              : (statusDialogState.targetStatus === 'confirmed' ? 'Confirm Booking' : 'Cancel Booking')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Dialog UI */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
            maxHeight: 'calc(100% - 120px)',
          },
        }}>
        <DialogTitle className="booking-dialog-title">
          Booking Details
        </DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Typography>Loading booking details...</Typography>
          ) : selectedBooking ? (
            <Box className="booking-details" sx={{ display: 'grid', gap: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle2">Customer Details</Typography>
                  <Typography variant="h6">{selectedBooking.customer_name}</Typography>
                  <Typography variant="body2">{selectedBooking.customer_email}</Typography>
                  <Typography variant="body2">{selectedBooking.customer_phone || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Booking Summary</Typography>
                  <Typography variant="body1">Booking ID: #{selectedBooking.id}</Typography>
                  <Box sx={{ mt: 1 }}>{getStatusChip(selectedBooking.status)}</Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Created: {formatDateTime(selectedBooking.created_at)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <RouteIcon sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography variant="subtitle2">Route</Typography>
                    <Typography variant="body1">Pickup: {selectedBooking.pickup_location}</Typography>
                    <Typography variant="body2">Drop: {selectedBooking.drop_location}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CalendarMonthIcon sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography variant="subtitle2">Travel Dates</Typography>
                    <Typography variant="body1">Pickup: {formatDate(selectedBooking.pickup_date)}</Typography>
                    <Typography variant="body2">Return: {formatDate(selectedBooking.return_date)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <DirectionsCarIcon sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography variant="subtitle2">Vehicle</Typography>
                    <Typography variant="body1">{selectedBooking.vehicle_type}</Typography>
                    <Typography variant="body2">
                      Category: {getVehicleCategory(selectedBooking.vehicle_type)}
                    </Typography>
                    <Typography variant="body2">
                      Passengers: {selectedBooking.passengers}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <PaymentsIcon sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography variant="subtitle2">Payment</Typography>
                    <Typography variant="body1">{formatCurrency(selectedBooking.amount)}</Typography>
                    <Typography variant="body2">
                      Last Updated: {formatDateTime(selectedBooking.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2">Additional Notes</Typography>
                <Typography variant="body2">
                  {selectedBooking.notes?.trim() ? selectedBooking.notes : 'No additional notes provided.'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography>Unable to load booking details.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
            maxHeight: 'calc(100% - 120px)',
          },
        }}
      >
        <DialogTitle className="booking-dialog-title">
          Edit Booking
        </DialogTitle>
        <DialogContent dividers>
          {editLoading ? (
            <Typography>Loading booking for editing...</Typography>
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
                label="Customer Name"
                value={editFormData.customer_name}
                onChange={handleEditFieldChange('customer_name')}
                error={Boolean(editFormErrors.customer_name)}
                helperText={editFormErrors.customer_name}
                fullWidth
              />
              <TextField
                label="Customer Email"
                type="email"
                value={editFormData.customer_email}
                onChange={handleEditFieldChange('customer_email')}
                error={Boolean(editFormErrors.customer_email)}
                helperText={editFormErrors.customer_email}
                fullWidth
              />
              <TextField
                label="Customer Phone"
                value={editFormData.customer_phone}
                onChange={handleEditFieldChange('customer_phone')}
                error={Boolean(editFormErrors.customer_phone)}
                helperText={editFormErrors.customer_phone}
                fullWidth
              />
              <TextField
                label="Vehicle Model"
                select
                value={editFormData.vehicle_type}
                onChange={handleEditFieldChange('vehicle_type')}
                error={Boolean(editFormErrors.vehicle_type)}
                helperText={editFormErrors.vehicle_type}
                SelectProps={{ MenuProps: bookingDialogSelectMenuProps }}
                fullWidth
              >
                {vehicleTypes.map((vehicle) => (
                  <MenuItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Pickup Location"
                value={editFormData.pickup_location}
                onChange={handleEditFieldChange('pickup_location')}
                error={Boolean(editFormErrors.pickup_location)}
                helperText={editFormErrors.pickup_location}
                fullWidth
              />
              <TextField
                label="Drop Location"
                value={editFormData.drop_location}
                onChange={handleEditFieldChange('drop_location')}
                error={Boolean(editFormErrors.drop_location)}
                helperText={editFormErrors.drop_location}
                fullWidth
              />
              <TextField
                label="Pickup Date"
                type="date"
                value={editFormData.pickup_date}
                onChange={handleEditFieldChange('pickup_date')}
                error={Boolean(editFormErrors.pickup_date)}
                helperText={editFormErrors.pickup_date}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Return Date"
                type="date"
                value={editFormData.return_date}
                onChange={handleEditFieldChange('return_date')}
                error={Boolean(editFormErrors.return_date)}
                helperText={editFormErrors.return_date}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Passengers"
                type="number"
                value={editFormData.passengers}
                onChange={handleEditFieldChange('passengers')}
                error={Boolean(editFormErrors.passengers)}
                helperText={editFormErrors.passengers}
                inputProps={{ min: 1 }}
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
                label="Status"
                select
                value={editFormData.status}
                onChange={handleEditFieldChange('status')}
                error={Boolean(editFormErrors.status)}
                helperText={editFormErrors.status}
                SelectProps={{ MenuProps: bookingDialogSelectMenuProps }}
                fullWidth
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
              <Box />
              <TextField
                label="Additional Notes"
                value={editFormData.notes}
                onChange={handleEditFieldChange('notes')}
                error={Boolean(editFormErrors.notes)}
                helperText={editFormErrors.notes}
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
          <Button variant="contained" onClick={handleSaveBooking} disabled={editLoading || saveLoading}>
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar UI */}
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
    </>
  );
};

export default Booking;
