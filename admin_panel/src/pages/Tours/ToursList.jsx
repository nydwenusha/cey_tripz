import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Tooltip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  Visibility,
  FileCopy,
  Add,
  Sort,
  Star,
  LocationOn,
  AttachMoney,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import './TourList.scss';
import MainLayout from '../../MainLayout';

const TourList = ({ tours: initialTours = [], onEdit, onDelete, onAddNew }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bulkAction, setBulkAction] = useState('');

  const [tours, setTours] = useState([
    {
      id: 1,
      name: 'Sigiriya Adventure',
      destination: 'Sigiriya',
      price: 150,
      status: 'Active',
      category: 'Adventure',
      bookings: 42,
      rating: 4.8,
      duration: '2 days',
      featured: true,
      revenue: 6300,
      capacity: 20,
      tags: ['Popular', 'Hiking', 'Historical']
    },
    {
      id: 2,
      name: 'Beach Paradise',
      destination: 'Hikkaduwa',
      price: 200,
      status: 'Active',
      category: 'Beach',
      bookings: 28,
      rating: 4.5,
      duration: '3 days',
      featured: true,
      revenue: 5600,
      capacity: 15,
      tags: ['Relaxing', 'Swimming', 'Snorkeling']
    },
    {
      id: 3,
      name: 'Cultural Heritage',
      destination: 'Anuradhapura',
      price: 180,
      status: 'Inactive',
      category: 'Cultural',
      bookings: 15,
      rating: 4.3,
      duration: '1 day',
      featured: false,
      revenue: 2700,
      capacity: 25,
      tags: ['Historical', 'Religious']
    },
    {
      id: 4,
      name: 'Wildlife Safari',
      destination: 'Yala',
      price: 250,
      status: 'Active',
      category: 'Wildlife',
      bookings: 35,
      rating: 4.9,
      duration: '2 days',
      featured: true,
      revenue: 8750,
      capacity: 12,
      tags: ['Safari', 'Photography', 'Wildlife']
    },
    {
      id: 5,
      name: 'Mountain Trek',
      destination: 'Ella',
      price: 120,
      status: 'Active',
      category: 'Adventure',
      bookings: 19,
      rating: 4.6,
      duration: '1 day',
      featured: false,
      revenue: 2280,
      capacity: 18,
      tags: ['Hiking', 'Scenic']
    }
  ]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTours.map((tour) => tour.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const newData = tours.filter(tour => tour.id !== tourToDelete.id);
    setTours(newData);
    setDeleteDialogOpen(false);
    setTourToDelete(null);
    setSnackbarMessage(`"${tourToDelete.name}" has been deleted`);
    setSnackbarOpen(true);
    if (onDelete) onDelete(tourToDelete.id);
  };

  const handleBulkAction = (action) => {
    let message = '';
    let updatedTours = [...tours];

    switch (action) {
      case 'activate':
        updatedTours = tours.map(tour =>
          selected.includes(tour.id) ? { ...tour, status: 'Active' } : tour
        );
        message = `${selected.length} tours activated`;
        break;
      case 'deactivate':
        updatedTours = tours.map(tour =>
          selected.includes(tour.id) ? { ...tour, status: 'Inactive' } : tour
        );
        message = `${selected.length} tours deactivated`;
        break;
      case 'delete':
        updatedTours = tours.filter(tour => !selected.includes(tour.id));
        message = `${selected.length} tours deleted`;
        break;
      default:
        return;
    }

    setTours(updatedTours);
    setSelected([]);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleToggleFeatured = (id) => {
    setTours(tours.map(tour =>
      tour.id === id ? { ...tour, featured: !tour.featured } : tour
    ));
  };

  // Filter and sort data
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'Featured' ? tour.featured : tour.status === statusFilter);
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'price') return (a.price - b.price) * order;
    if (sortBy === 'bookings') return (a.bookings - b.bookings) * order;
    if (sortBy === 'rating') return (a.rating - b.rating) * order;
    if (sortBy === 'revenue') return (a.revenue - b.revenue) * order;
    return a[sortBy]?.localeCompare(b[sortBy]) * order;
  });

  const paginatedTours = filteredTours.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChip = (status) => {
    const color = status === 'Active' ? 'success' : 'error';
    return (
      <Chip
        label={status}
        color={color}
        size="small"
        icon={status === 'Active' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
      />
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      Adventure: 'warning',
      Beach: 'info',
      Cultural: 'secondary',
      Wildlife: 'success',
      Historical: 'primary',
      Luxury: 'error'
    };
    return colors[category] || 'default';
  };

  return (
    <MainLayout>
      <Box className="tour-list">
        {/* Header with Search and Actions */}
        <Card className="tour-list-header" sx={{ mb: 3 }}>
          <CardContent>
            <Box className="header-content">
              <Typography variant="h5" className="page-title">
                Tour Management
              </Typography>
              <Box className="header-actions">
                <TextField
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  className="search-field"
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onAddNew}
                  className="add-button"
                >
                  Add Tour
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="filters-card" sx={{ mb: 3 }}>
          <CardContent>
            <Box className="filters-content">
              <Box className="filter-buttons">
                <Chip
                  label="All Tours"
                  onClick={() => handleStatusFilter('all')}
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  variant="outlined"
                />
                <Chip
                  label="Active"
                  onClick={() => handleStatusFilter('Active')}
                  color={statusFilter === 'Active' ? 'success' : 'default'}
                  variant="outlined"
                />
                <Chip
                  label="Inactive"
                  onClick={() => handleStatusFilter('Inactive')}
                  color={statusFilter === 'Inactive' ? 'error' : 'default'}
                  variant="outlined"
                />
                <Chip
                  label="Featured"
                  onClick={() => handleStatusFilter('Featured')}
                  color={statusFilter === 'Featured' ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>

              {selected.length > 0 && (
                <Box className="bulk-actions-section">
                  <Typography variant="body2" className="selected-count">
                    {selected.length} selected
                  </Typography>
                  <FormControl size="small" className="bulk-select-form">
                    <InputLabel>Bulk Actions</InputLabel>
                    <Select
                      value={bulkAction}
                      onChange={(e) => handleBulkAction(e.target.value)}
                      label="Bulk Actions"
                    >
                      <MenuItem value="activate">Activate Selected</MenuItem>
                      <MenuItem value="deactivate">Deactivate Selected</MenuItem>
                      <MenuItem value="delete">Delete Selected</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total Tours
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {filteredTours.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Active Tours
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {filteredTours.filter(t => t.status === 'Active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total Revenue
                </Typography>
                <Typography variant="h6" className="stat-value">
                  ${filteredTours.reduce((sum, tour) => sum + tour.revenue, 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Avg. Rating
                </Typography>
                <Typography variant="h6" className="stat-value">
                  {filteredTours.length > 0
                    ? (filteredTours.reduce((sum, tour) => sum + tour.rating, 0) / filteredTours.length).toFixed(1)
                    : '0.0'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Table */}
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredTours.length}
                    checked={filteredTours.length > 0 && selected.length === filteredTours.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>
                  <Box className="sortable-header" onClick={() => handleSort('name')}>
                    Tour Name
                    <Sort className={`sort-icon ${sortBy === 'name' ? 'active' : ''} ${sortOrder}`} />
                  </Box>
                </TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>
                  <Box className="sortable-header" onClick={() => handleSort('price')}>
                    Price
                    <Sort className={`sort-icon ${sortBy === 'price' ? 'active' : ''} ${sortOrder}`} />
                  </Box>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>
                  <Box className="sortable-header" onClick={() => handleSort('bookings')}>
                    Bookings
                    <Sort className={`sort-icon ${sortBy === 'bookings' ? 'active' : ''} ${sortOrder}`} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="sortable-header" onClick={() => handleSort('rating')}>
                    Rating
                    <Sort className={`sort-icon ${sortBy === 'rating' ? 'active' : ''} ${sortOrder}`} />
                  </Box>
                </TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTours.map((tour) => (
                <TableRow
                  key={tour.id}
                  hover
                  selected={selected.indexOf(tour.id) !== -1}
                  className={`table-row ${tour.featured ? 'featured-row' : ''}`}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(tour.id) !== -1}
                      onChange={(event) => handleClick(event, tour.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="tour-name-cell">
                      <Box className="tour-name-wrapper">
                        <Typography variant="body2" className="tour-name">
                          {tour.name}
                        </Typography>
                        {tour.featured && <Star fontSize="small" className="featured-icon" />}
                      </Box>
                      <Typography variant="caption" color="textSecondary" className="tour-details">
                        {tour.duration} • Capacity: {tour.capacity}
                      </Typography>
                      <Box className="tags-container">
                        {tour.tags.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            className="tour-tag"
                          />
                        ))}
                        {tour.tags.length > 2 && (
                          <Chip
                            label={`+${tour.tags.length - 2}`}
                            size="small"
                            className="more-tags"
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="destination-cell">
                      <LocationOn fontSize="small" className="destination-icon" />
                      <Typography variant="body2">{tour.destination}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="price-cell">
                      <Typography variant="body2" className="price-value">
                        <AttachMoney fontSize="small" />
                        {tour.price}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" className="revenue">
                        Revenue: ${tour.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(tour.status)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tour.category}
                      color={getCategoryColor(tour.category)}
                      size="small"
                      className="category-chip"
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="bookings-cell">
                      <Typography variant="body2" className="bookings-count">
                        {tour.bookings}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(tour.bookings / tour.capacity) * 100}
                        className="booking-progress"
                      />
                      <Typography variant="caption" color="textSecondary" className="capacity-info">
                        {tour.bookings}/{tour.capacity}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="rating-cell">
                      <Star fontSize="small" className="star-icon" />
                      <Typography variant="body2" className="rating-value">
                        {tour.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={tour.featured}
                      onChange={() => handleToggleFeatured(tour.id)}
                      color="warning"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box className="actions-cell">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit && onEdit(tour)}
                          className="action-button edit-button"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View">
                        <IconButton size="small" className="action-button view-button">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" className="action-button duplicate-button">
                          <FileCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(tour)}
                          className="action-button delete-button"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="table-pagination"
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          className="delete-dialog"
        >
          <DialogTitle>Delete Tour</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{tourToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            className="snackbar-alert"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default TourList;