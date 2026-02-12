import React, { useEffect, useState } from 'react';
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
} from '@mui/icons-material';
import './Booking.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const Booking = () => {
  // Vehicle categories for UI display
  const vehicleCategories = [
    { id: 1, name: 'Suzuki Alto', category: 'Mini Car' },
    { id: 2, name: 'Toyota Prius', category: 'Sedan Car' },
    { id: 3, name: 'Honda Shuttle', category: 'Sedan Car' },
    { id: 4, name: 'Toyota Axio', category: 'Sedan Car' },
    { id: 5, name: 'Suzuki Wagon R (FX)', category: 'Hatchback Car' },
    { id: 6, name: 'Suzuki Wagon R (FZ)', category: 'Hatchback Car' },
    { id: 7, name: 'Suzuki Wagon R (Stingray)', category: 'Hatchback Car' },
    { id: 8, name: 'Suzuki Every', category: 'Mini Van' },
    { id: 9, name: 'Toyota KDH', category: 'Seater Van' },
    { id: 10, name: 'Toyota Hiace', category: 'Seater Van' }
  ];

  // UI-only functions for display
  const getVehicleCategory = (vehicleType) => {
    const vehicle = vehicleCategories.find(v => v.name === vehicleType);
    return vehicle ? vehicle.category : 'Unknown';
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
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
  useEffect(()=>{
    api.get('/GetBookings').then(response=>{
      console.log('Bookings data:', response.data);
      setBookings(response.data.bookings || []); // Assuming response has a 'bookings' array
    }).catch(error=>{
      console.error('Error fetching bookings:', error);
    })

   
  }, [])

  // Vehicle types for filter dropdown
  const vehicleTypes = vehicleCategories.map(cat => cat.name);

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
              <Select label="Vehicle Model">
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
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
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
              {bookings.map((booking) => (
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
                        <IconButton size="small" color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit booking">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {booking.status === 'pending' && (
                        <Tooltip title="Confirm booking">
                          <IconButton size="small" color="success">
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Tooltip title="Cancel booking">
                          <IconButton size="small" color="warning">
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="More options">
                        <IconButton size="small">
                          <MoreVertIcon />
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
            count={100}
            page={0}
            onPageChange={() => { }}
            rowsPerPage={10}
            onRowsPerPageChange={() => { }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      </Card>

      {/* Actions Menu UI */}
      <Menu
        anchorEl={null}
        open={false}
        onClose={() => { }}
      >
        <MenuItem>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon><CheckIcon fontSize="small" /></ListItemIcon>
          Confirm
        </MenuItem>
        <MenuItem>
          <ListItemIcon><CloseIcon fontSize="small" /></ListItemIcon>
          Cancel
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
          Send Email
        </MenuItem>
        <MenuItem>
          <ListItemIcon><PrintIcon fontSize="small" /></ListItemIcon>
          Print Ticket
        </MenuItem>
        <MenuItem>
          <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
          Archive
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog UI */}
      <Dialog open={false} onClose={() => { }}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { }}>Cancel</Button>
          <Button color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Dialog UI */}
      <Dialog open={false} onClose={() => { }} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent dividers>
          <Typography>
            View booking details here
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Booking ID: #12345</Typography>
            <Typography variant="subtitle2">Customer: John Doe</Typography>
            <Typography variant="subtitle2">Vehicle: Toyota Prius</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { }}>Close</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar UI */}
      <Snackbar
        open={false}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Booking;