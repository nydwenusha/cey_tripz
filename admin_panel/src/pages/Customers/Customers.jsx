import React, { useEffect, useState } from 'react';
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
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Save,
  Print
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import './Customers.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const Customers = () => {
  const mapCustomer = (customer) => ({
    id: customer.id,
    name: customer.customer_name || 'N/A',
    email: customer.customer_email || 'N/A',
    phone: customer.customer_phone || 'N/A',
    totalBookings: Number(customer.total_bookings || 0),
    status: customer.status || 'inactive',
    joinDate: customer.join_date || null,
    lastActivity: customer.last_activity || null,
  });

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  useEffect(() => {
    const nextSearch = (searchParams.get('search') || '').trim();
    setSearchTerm(nextSearch);
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;

    const fetchCustomers = async () => {
      setLoading(true);

      try {
        const response = await api.get('/GetCustomers');

        if (!isActive) {
          return;
        }

        const mappedCustomers = (response.data.customers || []).map(mapCustomer);

        setCustomers(mappedCustomers);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error('Error fetching customers:', error);
        setCustomers([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchCustomers();

    return () => {
      isActive = false;
    };
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
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

  const handleEditFieldChange = (field) => (event) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    setEditErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.customer_name.trim()) {
      errors.customer_name = 'Customer name is required.';
    }

    if (editForm.customer_phone && editForm.customer_phone.length > 20) {
      errors.customer_phone = 'Customer phone must be 20 characters or less.';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAction = (action) => {
    const customer = selectedCustomer;
    handleMenuClose();

    if (!customer) {
      return;
    }

    if (action === 'View') {
      setViewCustomer(customer);
      return;
    }

    if (action === 'Edit') {
      setEditForm({
        id: customer.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone === 'N/A' ? '' : customer.phone,
      });
      setEditErrors({});
      setEditDialogOpen(true);
      return;
    }

    if (action === 'Delete') {
      setSelectedCustomer(customer);
      setDeleteDialogOpen(true);
    }
  };

  const handleCloseViewDialog = () => {
    setViewCustomer(null);
  };

  const resetEditDialog = () => {
    setEditDialogOpen(false);
    setEditErrors({});
    setEditForm({
      id: null,
      customer_name: '',
      customer_email: '',
      customer_phone: '',
    });
  };

  const handleCloseEditDialog = () => {
    if (actionLoading) {
      return;
    }

    resetEditDialog();
  };

  const handleCloseDeleteDialog = () => {
    if (actionLoading) {
      return;
    }

    setDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleUpdateCustomer = async () => {
    if (!validateEditForm()) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await api.put(`/UpdateCustomer/${editForm.id}`, {
        customer_name: editForm.customer_name.trim(),
        customer_phone: editForm.customer_phone.trim() || null,
      });

      const updatedCustomer = mapCustomer(response.data.customer);

      setCustomers((prev) =>
        prev.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
      );

      if (viewCustomer?.id === updatedCustomer.id) {
        setViewCustomer(updatedCustomer);
      }

      resetEditDialog();
      showSnackbar(response.data.message || 'Customer updated successfully.');
    } catch (error) {
      console.error('Error updating customer:', error);

      if (error.response?.status === 422 && error.response?.data?.errors) {
        const fieldErrors = Object.entries(error.response.data.errors).reduce((acc, [field, messages]) => {
          acc[field] = Array.isArray(messages) ? messages[0] : messages;
          return acc;
        }, {});

        setEditErrors(fieldErrors);
      }

      showSnackbar(error.response?.data?.message || 'Failed to update customer.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) {
      return;
    }

    setActionLoading(true);

    try {
      const deletingCustomerId = selectedCustomer.id;
      const response = await api.delete(`/DeleteCustomer/${selectedCustomer.id}`);

      setCustomers((prev) => {
        const nextCustomers = prev.filter((customer) => customer.id !== deletingCustomerId);
        const maxPage = Math.max(0, Math.ceil(nextCustomers.length / rowsPerPage) - 1);

        if (page > maxPage) {
          setPage(maxPage);
        }

        return nextCustomers;
      });

      if (viewCustomer?.id === deletingCustomerId) {
        setViewCustomer(null);
      }

      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
      showSnackbar(response.data.message || 'Customer deleted successfully.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete customer.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = () => {
    console.log('Save action triggered');
  };

  const handlePrintAll = () => {
    window.print();
  };

  const handleEmailAll = () => {
    const emails = customers
      .map((customer) => customer.email)
      .filter((email) => email && email !== 'N/A')
      .join(';');

    if (!emails) {
      return;
    }

    window.location.href = `mailto:${emails}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (orderBy === 'totalBookings') {
      return order === 'asc'
        ? a.totalBookings - b.totalBookings
        : b.totalBookings - a.totalBookings;
    }

    if (orderBy === 'joinDate' || orderBy === 'lastActivity') {
      const aTime = a[orderBy] ? new Date(a[orderBy]).getTime() : 0;
      const bTime = b[orderBy] ? new Date(b[orderBy]).getTime() : 0;

      return order === 'asc' ? aTime - bTime : bTime - aTime;
    }

    const aValue = String(a[orderBy] || '').toLowerCase();
    const bValue = String(b[orderBy] || '').toLowerCase();

    return order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const paginatedCustomers = sortedCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (value) => {
    if (!value) {
      return 'N/A';
    }

    return new Date(value).toLocaleDateString();
  };

  return (
    <div className="customers-container">
      <PageHeader
        title="Customers Management"
        subtitle="Manage customer details in one place. View contact info, booking history and more."
        primaryAction={{
          label: 'Save',
          onClick: handleSave,
          icon: <Save />
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

      <Paper className="customers-paper">
        <div className="table-header">
          <div className="header-actions">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              className="search-field"
            />
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'totalBookings'}
                    direction={orderBy === 'totalBookings' ? order : 'asc'}
                    onClick={() => handleSort('totalBookings')}
                  >
                    Total Bookings
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'joinDate'}
                    direction={orderBy === 'joinDate' ? order : 'asc'}
                    onClick={() => handleSort('joinDate')}
                  >
                    Join Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'lastActivity'}
                    direction={orderBy === 'lastActivity' ? order : 'asc'}
                    onClick={() => handleSort('lastActivity')}
                  >
                    Last Activity
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <div className="customer-name-cell">
                        <div className="avatar">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <Typography variant="body1" fontWeight="medium">
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {customer.id}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="contact-cell">
                        <div className="contact-item">
                          <Email fontSize="small" />
                          <Typography variant="body2">{customer.email}</Typography>
                        </div>
                        <div className="contact-item">
                          <Phone fontSize="small" />
                          <Typography variant="body2">{customer.phone}</Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.totalBookings}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        color={getStatusColor(customer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(customer.joinDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(customer.lastActivity)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, customer)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('View')}>
          <Visibility fontSize="small" className="menu-icon" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleAction('Edit')}>
          <Edit fontSize="small" className="menu-icon" />
          Edit Customer
        </MenuItem>
        <MenuItem onClick={() => handleAction('Delete')}>
          <Delete fontSize="small" className="menu-icon" />
          Delete Customer
        </MenuItem>
      </Menu>

      <Dialog open={Boolean(viewCustomer)} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
            maxHeight: 'calc(100% - 120px)',
          },
        }}>
        <DialogTitle className="customer-dialog-title">Customer Details</DialogTitle>
        <DialogContent dividers>
          {viewCustomer && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">Customer Name</Typography>
                <Typography variant="body1">{viewCustomer.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1">{viewCustomer.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body1">{viewCustomer.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total Bookings</Typography>
                <Typography variant="body1">{viewCustomer.totalBookings}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={viewCustomer.status}
                  color={getStatusColor(viewCustomer.status)}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2">Join Date</Typography>
                <Typography variant="body1">{formatDate(viewCustomer.joinDate)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Last Activity</Typography>
                <Typography variant="body1">{formatDate(viewCustomer.lastActivity)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
          },
        }}>
        <DialogTitle className="customer-dialog-title">Edit Customer</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              label="Customer Name"
              value={editForm.customer_name}
              onChange={handleEditFieldChange('customer_name')}
              error={Boolean(editErrors.customer_name)}
              helperText={editErrors.customer_name}
              fullWidth
            />
            <TextField
              label="Customer Email"
              value={editForm.customer_email}
              fullWidth
              disabled
            />
            <TextField
              label="Customer Phone"
              value={editForm.customer_phone}
              onChange={handleEditFieldChange('customer_phone')}
              error={Boolean(editErrors.customer_phone)}
              helperText={editErrors.customer_phone}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateCustomer} disabled={actionLoading}>
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
          },
        }}>
        <DialogTitle className="customer-dialog-title">Delete Customer</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete this customer? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteCustomer} disabled={actionLoading}>
            {actionLoading ? 'Deleting...' : 'Delete'}
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

export default Customers;
