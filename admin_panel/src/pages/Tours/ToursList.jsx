import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney,
  Cancel,
  CheckCircle,
  Close as CloseIcon,
  Delete,
  Edit,
  Email,
  LocationOn,
  PhotoCamera,
  Print,
  Save,
  Search,
  Sort,
  Star,
  Visibility,
} from '@mui/icons-material';
import './TourList.scss';
import './../../components/layout/PageHeader/PageHeader.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const destinations = [
  'Sigiriya',
  'Hikkaduwa',
  'Anuradhapura',
  'Colombo',
  'Kandy',
  'Galle',
  'Ella',
  'Mirissa',
  'Yala',
  'Polonnaruwa',
  'Bentota',
  'Nuwara Eliya',
];

const mergeDestinationOptions = (...groups) => {
  const uniqueDestinations = new Map();

  groups.flat().forEach((destination) => {
    const normalizedDestination = String(destination || '').trim();
    const key = normalizedDestination.toLocaleLowerCase();

    if (normalizedDestination && !uniqueDestinations.has(key)) {
      uniqueDestinations.set(key, normalizedDestination);
    }
  });

  return Array.from(uniqueDestinations.values());
};

const categories = [
  'Adventure',
  'Beach',
  'Cultural',
  'Wildlife',
  'Historical',
  'Wellness',
  'Family',
  'Luxury',
  'Hiking',
  'Photography',
  'Other',
];

const difficultyLevels = ['Easy', 'Medium', 'Difficult', 'Challenging'];
const statusOptions = ['Active', 'Inactive', 'Draft'];

const editDialogSelectMenuProps = {
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

const emptyTourForm = {
  id: '',
  name: '',
  destination: '',
  price: '',
  status: 'Active',
  category: '',
  description: '',
  duration: '',
  maxParticipants: '',
  difficulty: 'Medium',
  inclusionsText: '',
  exclusionsText: '',
  tagsText: '',
  featured: false,
  highlightsText: '',
  meetingPoint: '',
  requirements: '',
  cancellationPolicy: 'standard',
  photoUrl: '',
  photoPath: '',
};

const toListText = (value) => (Array.isArray(value) ? value.join(', ') : '');

const splitList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const createFormFromTour = (tour) => ({
  id: tour?.id || '',
  name: tour?.name || '',
  destination: tour?.destination || '',
  price: tour?.price !== undefined && tour?.price !== null ? String(tour.price) : '',
  status: tour?.status || 'Active',
  category: tour?.category || '',
  description: tour?.description || '',
  duration: tour?.duration || '',
  maxParticipants: tour?.maxParticipants || tour?.capacity || '',
  difficulty: tour?.difficulty || 'Medium',
  inclusionsText: toListText(tour?.inclusions),
  exclusionsText: toListText(tour?.exclusions),
  tagsText: toListText(tour?.tags),
  featured: Boolean(tour?.featured),
  highlightsText: toListText(tour?.highlights),
  meetingPoint: tour?.meetingPoint || '',
  requirements: tour?.requirements || '',
  cancellationPolicy: tour?.cancellationPolicy || 'standard',
  photoUrl: tour?.photoUrl || '',
  photoPath: tour?.photoPath || '',
});

const buildTourPayload = (form) => ({
  name: form.name.trim(),
  destination: form.destination,
  price: Number(form.price),
  status: String(form.status || 'Active').toLowerCase(),
  category: form.category,
  description: form.description.trim(),
  duration: form.duration.trim(),
  max_participants: Number(form.maxParticipants),
  difficulty: form.difficulty,
  inclusions: splitList(form.inclusionsText),
  exclusions: splitList(form.exclusionsText),
  tags: splitList(form.tagsText),
  featured: Boolean(form.featured),
  highlights: splitList(form.highlightsText),
  meeting_point: form.meetingPoint.trim(),
  requirements: form.requirements.trim(),
  cancellation_policy: form.cancellationPolicy,
});

const getStatusChip = (status) => {
  const normalized = String(status || '').toLowerCase();
  const color = normalized === 'active' ? 'success' : normalized === 'draft' ? 'warning' : 'error';

  return (
    <Chip
      label={status || 'Inactive'}
      color={color}
      size="small"
      icon={normalized === 'active' ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
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
    Luxury: 'error',
  };
  return colors[category] || 'default';
};

const TourList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [bulkAction, setBulkAction] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [previewTour, setPreviewTour] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyTourForm);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchTours = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get('/GetTours');
      const toursData = response.data?.tours || response.data?.data || response.data || [];
      setTours(Array.isArray(toursData) ? toursData : []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      showSnackbar(error.response?.data?.message || 'Failed to load tours', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          String(tour.name || '').toLowerCase().includes(search) ||
          String(tour.destination || '').toLowerCase().includes(search) ||
          String(tour.category || '').toLowerCase().includes(search);
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'Featured' ? tour.featured : tour.status === statusFilter);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;

        if (['price', 'bookings', 'rating', 'revenue'].includes(sortBy)) {
          return (Number(a[sortBy] || 0) - Number(b[sortBy] || 0)) * order;
        }

        return String(a[sortBy] || '').localeCompare(String(b[sortBy] || '')) * order;
      });
  }, [searchTerm, sortBy, sortOrder, statusFilter, tours]);

  const paginatedTours = filteredTours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const destinationOptions = useMemo(
    () => mergeDestinationOptions(destinations, tours.map((tour) => tour.destination)),
    [tours]
  );

  const stats = useMemo(
    () => ({
      totalTours: tours.length,
      activeTours: tours.filter((tour) => tour.status === 'Active').length,
      totalRevenue: tours.reduce((sum, tour) => sum + Number(tour.revenue || 0), 0),
      averageRating:
        tours.length > 0
          ? tours.reduce((sum, tour) => sum + Number(tour.rating || 0), 0) / tours.length
          : 0,
    }),
    [tours]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(filteredTours.map((tour) => tour.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
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
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortOrder('asc');
  };

  const handleOpenEdit = (tour) => {
    setEditForm(createFormFromTour(tour));
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    if (saving) return;
    setEditDialogOpen(false);
    setEditForm(emptyTourForm);
    setFormErrors({});
  };

  const handleEditInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '', form: '' }));
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.name.trim()) errors.name = 'Tour name is required';
    if (!editForm.destination) errors.destination = 'Destination is required';
    if (!editForm.category) errors.category = 'Category is required';
    if (!editForm.description.trim()) errors.description = 'Description is required';
    if (editForm.price === '' || Number(editForm.price) < 0) errors.price = 'Valid price is required';
    if (!editForm.duration.trim()) errors.duration = 'Duration is required';
    if (!editForm.maxParticipants || Number(editForm.maxParticipants) < 1) {
      errors.maxParticipants = 'Participant count must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await api.put(`/UpdateTour/${editForm.id}`, buildTourPayload(editForm));
      const updatedTour = response.data?.tour;

      if (updatedTour) {
        setTours((prev) => prev.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour)));
      } else {
        await fetchTours();
      }

      showSnackbar(response.data?.message || 'Tour updated successfully');
      handleCloseEdit();
    } catch (error) {
      console.error('Error updating tour:', error);
      setFormErrors((prev) => ({
        ...prev,
        form: error.response?.data?.message || 'Failed to update tour',
      }));
      showSnackbar(error.response?.data?.message || 'Failed to update tour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (tour) => {
    setTourToDelete(tour);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    if (actionLoadingId) return;
    setDeleteDialogOpen(false);
    setTourToDelete(null);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    setActionLoadingId(tourToDelete.id);

    try {
      const response = await api.delete(`/DeleteTour/${tourToDelete.id}`);
      setTours((prev) => prev.filter((tour) => tour.id !== tourToDelete.id));
      setSelected((prev) => prev.filter((id) => id !== tourToDelete.id));
      showSnackbar(response.data?.message || `"${tourToDelete.name}" has been deleted`);
      setDeleteDialogOpen(false);
      setTourToDelete(null);
    } catch (error) {
      console.error('Error deleting tour:', error);
      showSnackbar(error.response?.data?.message || 'Failed to delete tour', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBulkAction = async (action) => {
    if (!selected.length) return;

    setBulkAction(action);

    try {
      if (action === 'delete') {
        await Promise.all(selected.map((id) => api.delete(`/DeleteTour/${id}`)));
        setTours((prev) => prev.filter((tour) => !selected.includes(tour.id)));
        showSnackbar(`${selected.length} tours deleted`);
      } else {
        const nextStatus = action === 'activate' ? 'active' : 'inactive';
        await Promise.all(selected.map((id) => api.put(`/UpdateTourStatus/${id}`, { status: nextStatus })));
        await fetchTours();
        showSnackbar(`${selected.length} tours ${action === 'activate' ? 'activated' : 'deactivated'}`);
      }

      setSelected([]);
    } catch (error) {
      console.error('Error running bulk action:', error);
      showSnackbar(error.response?.data?.message || 'Failed to complete bulk action', 'error');
    } finally {
      setBulkAction('');
    }
  };

  const handleToggleFeatured = async (tour) => {
    setActionLoadingId(tour.id);

    try {
      const response = await api.put(`/UpdateTourFeatured/${tour.id}`, { featured: !tour.featured });
      const updatedTour = response.data?.tour;

      if (updatedTour) {
        setTours((prev) => prev.map((item) => (item.id === updatedTour.id ? updatedTour : item)));
      }

      showSnackbar(response.data?.message || 'Featured status updated');
    } catch (error) {
      console.error('Error updating featured status:', error);
      showSnackbar(error.response?.data?.message || 'Failed to update featured status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box className="tour-list">
      <PageHeader
        title="Tour Management"
        subtitle="Create, edit, and manage tour packages in one place."
        primaryAction={{
          label: 'Add New Tour',
          onClick: () => navigate('/addtours'),
          icon: <AddIcon />,
        }}
        secondaryActions={[
          {
            label: 'Print All',
            onClick: () => window.print(),
            icon: <Print />,
          },
          {
            label: 'Email All',
            onClick: () => console.log('Email tours'),
            icon: <Email />,
          },
        ]}
        variant="gradient"
      />

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

            <TextField
              size="small"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={handleSearch}
              className="tour-search-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {selected.length > 0 && (
              <Box className="bulk-actions-section">
                <Typography variant="body2" className="selected-count">
                  {selected.length} selected
                </Typography>
                <FormControl size="small" className="bulk-select-form">
                  <InputLabel>Bulk Actions</InputLabel>
                  <Select
                    value={bulkAction}
                    onChange={(event) => handleBulkAction(event.target.value)}
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Tours
              </Typography>
              <Typography variant="h6" className="stat-value">
                {stats.totalTours}
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
                {stats.activeTours}
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
                ${stats.totalRevenue.toLocaleString()}
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
                {stats.averageRating.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading ? (
        <Box className="tour-list-loading">
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No tours found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTours.map((tour) => {
                    const tags = Array.isArray(tour.tags) ? tour.tags : [];
                    const capacity = Number(tour.capacity || tour.maxParticipants || 1);
                    const bookings = Number(tour.bookings || 0);
                    const progressValue = capacity > 0 ? Math.min((bookings / capacity) * 100, 100) : 0;

                    return (
                      <TableRow
                        key={tour.id}
                        hover
                        selected={selected.includes(tour.id)}
                        className={`table-row ${tour.featured ? 'featured-row' : ''}`}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selected.includes(tour.id)} onChange={(event) => handleClick(event, tour.id)} />
                        </TableCell>
                        <TableCell>
                          <Box className="tour-name-cell">
                            <Box className="tour-thumbnail">
                              {tour.photoUrl ? (
                                <img src={tour.photoUrl} alt={tour.name || 'Tour'} />
                              ) : (
                                <PhotoCamera fontSize="small" />
                              )}
                            </Box>
                            <Box className="tour-name-content">
                              <Box className="tour-name-wrapper">
                                <Typography variant="body2" className="tour-name">
                                  {tour.name}
                                </Typography>
                                {tour.featured && <Star fontSize="small" className="featured-icon" />}
                              </Box>
                              <Typography variant="caption" color="textSecondary" className="tour-details">
                                {tour.duration || 'No duration'} | Capacity: {capacity}
                              </Typography>
                              <Box className="tags-container">
                                {tags.slice(0, 2).map((tag) => (
                                  <Chip key={tag} label={tag} size="small" className="tour-tag" />
                                ))}
                                {tags.length > 2 && <Chip label={`+${tags.length - 2}`} size="small" className="more-tags" />}
                              </Box>
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
                              {Number(tour.price || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" className="revenue">
                              Revenue: ${Number(tour.revenue || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(tour.status)}</TableCell>
                        <TableCell>
                          <Chip label={tour.category} color={getCategoryColor(tour.category)} size="small" className="category-chip" />
                        </TableCell>
                        <TableCell>
                          <Box className="bookings-cell">
                            <Typography variant="body2" className="bookings-count">
                              {bookings}
                            </Typography>
                            <LinearProgress variant="determinate" value={progressValue} className="booking-progress" />
                            <Typography variant="caption" color="textSecondary" className="capacity-info">
                              {bookings}/{capacity}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="rating-cell">
                            <Star fontSize="small" className="star-icon" />
                            <Typography variant="body2" className="rating-value">
                              {Number(tour.rating || 0).toFixed(1)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={Boolean(tour.featured)}
                            onChange={() => handleToggleFeatured(tour)}
                            color="warning"
                            size="small"
                            disabled={actionLoadingId === tour.id}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box className="actions-cell">
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                className="action-button view-button"
                                onClick={() => setPreviewTour(tour)}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(tour)}
                                className="action-button edit-button"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(tour)}
                                className="action-button delete-button"
                                disabled={actionLoadingId === tour.id}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
        </>
      )}

      <Dialog
        open={Boolean(previewTour)}
        onClose={() => setPreviewTour(null)}
        maxWidth="md"
        fullWidth
        className="tour-dialog"
        sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
            maxHeight: 'calc(100% - 120px)',
          },
        }}
      >
        <DialogTitle className="tour-dialog-title">Tour Preview</DialogTitle>
        <DialogContent dividers sx={{ background: '#f8fafc' }}>
          {previewTour && (
            <Box className="tour-preview-card">
              {previewTour.photoUrl && (
                <Box className="tour-preview-image">
                  <img src={previewTour.photoUrl} alt={previewTour.name || 'Tour'} />
                </Box>
              )}
              <Box className="tour-preview-header">
                <Box>
                  <Typography variant="h4" className="tour-preview-title">
                    {previewTour.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {previewTour.destination} | {previewTour.duration} | {previewTour.difficulty}
                  </Typography>
                </Box>
                <Box className="tour-preview-price">${Number(previewTour.price || 0).toLocaleString()}</Box>
              </Box>

              <Box className="tour-preview-chips">
                {getStatusChip(previewTour.status)}
                {previewTour.category && <Chip label={previewTour.category} variant="outlined" size="small" />}
                {previewTour.featured && <Chip label="Featured" color="warning" size="small" icon={<Star />} />}
              </Box>

              <Typography variant="body1" className="tour-preview-description">
                {previewTour.description || 'No description available.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Highlights</Typography>
                  {(previewTour.highlights || []).map((item) => (
                    <Typography key={item} variant="body2" color="text.secondary">
                      - {item}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Inclusions</Typography>
                  {(previewTour.inclusions || []).map((item) => (
                    <Typography key={item} variant="body2" color="text.secondary">
                      - {item}
                    </Typography>
                  ))}
                </Grid>
              </Grid>

              {previewTour.tags?.length > 0 && (
                <Box className="tour-preview-tags">
                  {previewTour.tags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} size="small" />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewTour(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
        className="tour-dialog"
        sx={{
          zIndex: 1601,
          '& .MuiDialog-paper': {
            mt: { xs: 10, sm: 12 },
            mb: 3,
            maxHeight: 'calc(100% - 120px)',
          },
        }}
      >
        <DialogTitle className="tour-dialog-title">Edit Tour</DialogTitle>
        <DialogContent dividers>
          {formErrors.form && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.form}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Tour Name"
                value={editForm.name}
                onChange={(event) => handleEditInputChange('name', event.target.value)}
                margin="normal"
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={editForm.description}
                onChange={(event) => handleEditInputChange('description', event.target.value)}
                margin="normal"
                multiline
                rows={5}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
                required
              />
              <TextField
                fullWidth
                label="Highlights"
                value={editForm.highlightsText}
                onChange={(event) => handleEditInputChange('highlightsText', event.target.value)}
                margin="normal"
                helperText="Comma separated values"
              />
              <TextField
                fullWidth
                label="Requirements & Notes"
                value={editForm.requirements}
                onChange={(event) => handleEditInputChange('requirements', event.target.value)}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className="tour-dialog-side" elevation={1}>
                <FormControl fullWidth margin="dense" error={Boolean(formErrors.status)}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.status}
                    onChange={(event) => handleEditInputChange('status', event.target.value)}
                    label="Status"
                    MenuProps={editDialogSelectMenuProps}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Autocomplete
                  freeSolo
                  autoHighlight
                  selectOnFocus
                  clearOnBlur={false}
                  options={destinationOptions}
                  value={editForm.destination || ''}
                  inputValue={editForm.destination || ''}
                  onChange={(_event, value) => handleEditInputChange('destination', value || '')}
                  onInputChange={(_event, value) => handleEditInputChange('destination', value)}
                  slotProps={{
                    popper: {
                      sx: { zIndex: 1702 },
                    },
                    paper: {
                      sx: { maxHeight: 320 },
                    },
                    listbox: {
                      sx: { maxHeight: 280 },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Destination"
                      placeholder="Type or select a destination"
                      margin="dense"
                      error={Boolean(formErrors.destination)}
                      helperText={formErrors.destination || 'Select a suggestion or enter a new destination'}
                      required
                    />
                  )}
                />

                <FormControl fullWidth margin="dense" error={Boolean(formErrors.category)} required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editForm.category}
                    onChange={(event) => handleEditInputChange('category', event.target.value)}
                    label="Category"
                    MenuProps={editDialogSelectMenuProps}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.category && <Typography className="tour-field-error">{formErrors.category}</Typography>}
                </FormControl>

                <TextField
                  fullWidth
                  label="Price (USD)"
                  type="number"
                  value={editForm.price}
                  onChange={(event) => handleEditInputChange('price', event.target.value)}
                  margin="dense"
                  error={Boolean(formErrors.price)}
                  helperText={formErrors.price}
                  InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                />

                <TextField
                  fullWidth
                  label="Duration"
                  value={editForm.duration}
                  onChange={(event) => handleEditInputChange('duration', event.target.value)}
                  margin="dense"
                  error={Boolean(formErrors.duration)}
                  helperText={formErrors.duration}
                />

                <TextField
                  fullWidth
                  label="Max Participants"
                  type="number"
                  value={editForm.maxParticipants}
                  onChange={(event) => handleEditInputChange('maxParticipants', event.target.value)}
                  margin="dense"
                  error={Boolean(formErrors.maxParticipants)}
                  helperText={formErrors.maxParticipants}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={editForm.difficulty}
                    onChange={(event) => handleEditInputChange('difficulty', event.target.value)}
                    label="Difficulty"
                    MenuProps={editDialogSelectMenuProps}
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Tags"
                  value={editForm.tagsText}
                  onChange={(event) => handleEditInputChange('tagsText', event.target.value)}
                  margin="dense"
                  helperText="Comma separated values"
                />

                <TextField
                  fullWidth
                  label="Inclusions"
                  value={editForm.inclusionsText}
                  onChange={(event) => handleEditInputChange('inclusionsText', event.target.value)}
                  margin="dense"
                  helperText="Comma separated values"
                />

                <TextField
                  fullWidth
                  label="Exclusions"
                  value={editForm.exclusionsText}
                  onChange={(event) => handleEditInputChange('exclusionsText', event.target.value)}
                  margin="dense"
                  helperText="Comma separated values"
                />

                <TextField
                  fullWidth
                  label="Meeting Point"
                  value={editForm.meetingPoint}
                  onChange={(event) => handleEditInputChange('meetingPoint', event.target.value)}
                  margin="dense"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editForm.featured}
                      onChange={(event) => handleEditInputChange('featured', event.target.checked)}
                      color="warning"
                    />
                  }
                  label="Feature this tour"
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
            className="save-button"
          >
            {saving ? 'Saving...' : 'Update Tour'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="sm" fullWidth className="delete-dialog">
        <DialogTitle
          className="tour-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="h6">Delete Tour</Typography>
          <IconButton onClick={handleCancelDelete} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Are you sure you want to delete this tour?</Typography>
          <Typography variant="h6" color="error" sx={{ mt: 2, fontWeight: 600 }}>
            "{tourToDelete?.name}"
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={Boolean(actionLoadingId)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={Boolean(actionLoadingId)}
            startIcon={actionLoadingId ? <CircularProgress size={18} color="inherit" /> : <Delete />}
          >
            {actionLoadingId ? 'Deleting...' : 'Delete Tour'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TourList;
