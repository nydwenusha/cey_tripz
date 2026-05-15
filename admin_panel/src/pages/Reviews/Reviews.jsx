// Reviews.jsx
import React, { useEffect, useMemo, useState } from 'react';
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
  Typography,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Avatar,
  Box,
  Rating,
  Badge,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  FormGroup,
  Divider,
  Input,
  FormHelperText,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Delete,
  Edit,
  Visibility,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Flag,
  CheckCircle,
  Block,
  Refresh,
  Download,
  Print,
  Email,
  CalendarToday,
  ChatBubble,
  AutoAwesome,
  RateReview,
  Comment,
  TrendingUp,
  TrendingDown,
  PhotoLibrary,
  ZoomIn,
  Close,
  ArrowBack,
  ArrowForward,
  Save,
  Cancel,
  Upload,
  Delete as DeleteIcon,
  Verified,
  Warning,
  Image,
  StarRate,
  DeleteForever,
  RemoveCircle,
  Report
} from '@mui/icons-material';
import './Reviews.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const mapReviewFromApi = (review) => ({
  id: review.review_code || `REV-${String(review.id).padStart(5, '0')}`,
  customer: {
    name: review.customer_name || 'Unknown Customer',
    email: review.customer_email || 'Not provided',
    avatar: '',
    bookings: 0
  },
  tour: {
    id: review.booking_id ? `BOOKING-${review.booking_id}` : (review.tour_name || `TOUR-${review.id}`),
    name: review.tour_name || 'Tour not specified',
    category: '',
    duration: '',
    price: ''
  },
  rating: Number(review.rating || 0),
  comment: review.comment || '',
  date: review.created_at || new Date().toISOString(),
  status: review.status === 'rejected' ? 'reported' : review.status,
  verified: Boolean(review.booking_id),
  recordId: review.id,
  bookingId: review.booking_id ? String(review.booking_id) : '',
  tourName: review.tour_name || 'Tour not specified',
  helpful: 0,
  notHelpful: 0,
  response: '',
  responseDate: null,
  photos: Array.isArray(review.images) ? review.images.length : 0,
  reportCount: review.status === 'rejected' ? 1 : 0,
  images: Array.isArray(review.images)
    ? review.images.map((image) => ({
      id: image.id,
      url: image.image_url,
      title: image.image_title || `Review image ${image.id}`,
      uploadedBy: review.customer_name || 'Customer',
      isCustomerUploaded: true,
      uploadDate: image.created_at || review.created_at || new Date().toISOString()
    }))
    : []
});

const Reviews = () => {
  const reviewDialogSx = {
    zIndex: 1601,
    '& .MuiDialog-paper': {
      mt: { xs: 10, sm: 12 },
      mb: 3,
      maxHeight: 'calc(100% - 120px)',
    },
  };
  const reviewDialogSelectMenuProps = {
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
  // State
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [openImageGallery, setOpenImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedReviewImages, setSelectedReviewImages] = useState([]);
  const [openDeleteImageDialog, setOpenDeleteImageDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [editForm, setEditForm] = useState({
    bookingId: '',
    customerName: '',
    customerEmail: '',
    tourName: '',
    rating: 0,
    comment: '',
    status: 'pending',
    verified: false,
    helpful: 0,
    notHelpful: 0,
    response: '',
    images: []
  });
  const [bookingOptions, setBookingOptions] = useState([]);

  useEffect(() => {
    let isActive = true;

    const fetchReviewData = async () => {
      try {
        const [reviewsResponse, bookingsResponse] = await Promise.all([
          api.get('/GetReviews'),
          api.get('/GetReviewBookingOptions'),
        ]);

        if (!isActive) {
          return;
        }

        const reviewRows = Array.isArray(reviewsResponse.data?.reviews)
          ? reviewsResponse.data.reviews.map(mapReviewFromApi)
          : [];

        setReviews(reviewRows);
        setBookingOptions(Array.isArray(bookingsResponse.data?.bookings) ? bookingsResponse.data.bookings : []);
      } catch (error) {
        if (isActive) {
          setReviews([]);
          setBookingOptions([]);
        }
        console.error('Failed to load review data:', error);
      }
    };

    fetchReviewData();

    return () => {
      isActive = false;
    };
  }, []);

  const resetEditForm = () => {
    setEditForm({
      bookingId: '',
      customerName: '',
      customerEmail: '',
      tourName: '',
      rating: 0,
      comment: '',
      status: 'pending',
      verified: false,
      helpful: 0,
      notHelpful: 0,
      response: '',
      images: []
    });
  };

  // Initialize edit form when review is selected
  const initializeEditForm = (review) => {
    setEditForm({
      bookingId: review.bookingId || '',
      customerName: review.customer.name,
      customerEmail: review.customer.email === 'Not provided' ? '' : review.customer.email,
      tourName: review.tour.name,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      verified: review.verified,
      helpful: review.helpful,
      notHelpful: review.notHelpful,
      response: review.response || '',
      images: review.images || []
    });
  };

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookingSelectionChange = (bookingId) => {
    const selectedBooking = bookingOptions.find((booking) => String(booking.id) === String(bookingId));

    if (!selectedBooking) {
      setEditForm((prev) => ({
        ...prev,
        bookingId: '',
        verified: false,
      }));
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      bookingId: String(selectedBooking.id),
      customerName: selectedBooking.customer_name || '',
      customerEmail: selectedBooking.customer_email || '',
      verified: true,
    }));
  };

  // Handle image upload (simulated)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // In real app, you would upload files to server
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file), // Temporary local URL
      title: file.name,
      uploadedBy: 'Admin',
      isCustomerUploaded: false,
      isNew: true,
      uploadDate: new Date().toISOString().split('T')[0]
    }));
    
    setEditForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // Handle image delete (from edit form)
  const handleImageDelete = (imageId) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  // Open delete image confirmation dialog
  const handleOpenDeleteImageDialog = (image) => {
    setImageToDelete(image);
    setOpenDeleteImageDialog(true);
  };

  // Close delete image dialog
  const handleCloseDeleteImageDialog = () => {
    setOpenDeleteImageDialog(false);
    setImageToDelete(null);
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

  // Confirm and delete customer uploaded image
  const confirmDeleteCustomerImage = () => {
    if (!imageToDelete || !selectedReview) return;

    // Find the review
    const reviewIndex = reviews.findIndex(r => r.id === selectedReview.id);
    if (reviewIndex === -1) return;

    // Create updated review with image removed
    const updatedReview = {
      ...reviews[reviewIndex],
      images: reviews[reviewIndex].images.filter(img => img.id !== imageToDelete.id),
      photos: reviews[reviewIndex].images.length - 1
    };

    // Update reviews list
    const updatedReviews = [...reviews];
    updatedReviews[reviewIndex] = updatedReview;
    setReviews(updatedReviews);

    // Also update edit form if it's open
    if (dialogType === 'edit' && editForm.images.length > 0) {
      setEditForm(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageToDelete.id)
      }));
    }

    // Show success message
    showSnackbar(`Image "${imageToDelete.title}" has been deleted successfully.`);

    // Close dialogs
    handleCloseDeleteImageDialog();
    if (openImageGallery) {
      setOpenImageGallery(false);
    }
  };

  const normalizeReviewStatus = (status) => (status === 'reported' ? 'rejected' : status);

  const buildReviewUpdatePayload = (review, status = review.status) => {
    const customerEmail = review.customer.email && review.customer.email !== 'Not provided'
      ? review.customer.email.trim()
      : null;

    return {
      booking_id: review.bookingId || null,
      customer_name: review.customer.name.trim(),
      customer_email: customerEmail,
      tour_name: (review.tourName || review.tour?.name || '').trim(),
      rating: Math.max(1, Math.min(5, Math.round(review.rating || 0))),
      comment: review.comment.trim(),
      status: normalizeReviewStatus(status),
    };
  };

  // Handle edit form submit
  const handleEditSubmit = async () => {
    if (!selectedReview) return;

    try {
      const payload = {
        booking_id: editForm.bookingId || null,
        customer_name: editForm.customerName.trim(),
        customer_email: editForm.customerEmail.trim() || null,
        tour_name: editForm.tourName.trim(),
        rating: Math.max(1, Math.min(5, Math.round(editForm.rating || 0))),
        comment: editForm.comment.trim(),
        status: normalizeReviewStatus(editForm.status),
      };

      const response = await api.put(`/UpdateReview/${selectedReview.recordId}`, payload);
      const updatedReview = mapReviewFromApi(response.data.review);

      setReviews((prev) => prev.map((review) => (
        review.id === selectedReview.id ? updatedReview : review
      )));
      showSnackbar(response.data?.message || 'Review updated successfully.');
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to update review:', error);
      showSnackbar(error.response?.data?.message || 'Unable to update review right now.', 'error');
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;

    const matchesRating = filterRating === 'all' ||
      (filterRating === '5' && review.rating === 5) ||
      (filterRating === '4+' && review.rating >= 4) ||
      (filterRating === '3+' && review.rating >= 3) ||
      (filterRating === '2+' && review.rating >= 2) ||
      (filterRating === '1+' && review.rating >= 1);

    const matchesVerified = !showVerifiedOnly || review.verified;

    return matchesSearch && matchesStatus && matchesRating && matchesVerified;
  });

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedReviews = [...filteredReviews].sort((a, b) => {
      if (property === 'rating') {
        return isAsc ? a.rating - b.rating : b.rating - a.rating;
      }
      if (property === 'date') {
        return isAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      }
      if (property === 'helpful') {
        return isAsc ? a.helpful - b.helpful : b.helpful - a.helpful;
      }
      return isAsc
        ? String(a[property]).localeCompare(String(b[property]))
        : String(b[property]).localeCompare(String(a[property]));
    });

    setReviews(sortedReviews);
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
  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = (shouldClearSelectedReview = true) => {
    setAnchorEl(null);
    if (shouldClearSelectedReview) {
      setSelectedReview(null);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };

  const handleCloseEditDialog = () => {
    setOpenDialog(false);
    resetEditForm();
    setSelectedReview(null);
  };

  const handleAction = (action) => {
    if (!selectedReview) return;

    let shouldClearSelectedReview = true;

    switch (action) {
      case 'view':
        setDialogType('view');
        setOpenDialog(true);
        shouldClearSelectedReview = false;
        break;
      case 'edit':
        setDialogType('edit');
        initializeEditForm(selectedReview);
        setOpenDialog(true);
        shouldClearSelectedReview = false;
        break;
      case 'view-images':
        handleViewImages(selectedReview);
        shouldClearSelectedReview = false;
        break;
      case 'publish':
        updateReviewStatus(selectedReview.id, 'published');
        break;
      case 'pending':
        updateReviewStatus(selectedReview.id, 'pending');
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this review?')) {
          setReviews(reviews.filter(r => r.id !== selectedReview.id));
        }
        break;
      case 'report':
        handleReportReview(selectedReview.id);
        break;
      default:
        break;
    }

    handleMenuClose(shouldClearSelectedReview);
  };

  // Image gallery functions
  const handleViewImages = (review) => {
    if (review.images && review.images.length > 0) {
      setSelectedReviewImages(review.images);
      setSelectedImageIndex(0);
      setOpenImageGallery(true);
    }
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % selectedReviewImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + selectedReviewImages.length) % selectedReviewImages.length);
  };

  const handleCloseImageGallery = () => {
    setOpenImageGallery(false);
    setSelectedReviewImages([]);
    setSelectedImageIndex(0);
  };

  const updateReviewStatus = async (id, status) => {
    const reviewToUpdate = reviews.find((review) => review.id === id);

    if (!reviewToUpdate) return;

    try {
      const response = await api.put(
        `/UpdateReview/${reviewToUpdate.recordId}`,
        buildReviewUpdatePayload(reviewToUpdate, status)
      );
      const updatedReview = mapReviewFromApi(response.data.review);

      setReviews((prev) => prev.map((review) => (
        review.id === id ? updatedReview : review
      )));
      showSnackbar(response.data?.message || 'Review status updated successfully.');
    } catch (error) {
      console.error('Failed to update review status:', error);
      showSnackbar(error.response?.data?.message || 'Unable to update review status right now.', 'error');
    }
  };

  const handleReportReview = (id) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, reportCount: review.reportCount + 1 } : review
    ));
  };

  // Status chip configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'published':
        return { color: 'success', label: 'Published', icon: <CheckCircle fontSize="small" /> };
      case 'pending':
        return { color: 'warning', label: 'Pending Review', icon: <Refresh fontSize="small" /> };
      case 'reported':
        return { color: 'error', label: 'Reported', icon: <Flag fontSize="small" /> };
      default:
        return { color: 'default', label: status, icon: null };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#4caf50'; // Green
    if (rating >= 3) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  // Calculate helpful percentage
  const getHelpfulPercentage = (helpful, notHelpful) => {
    const total = helpful + notHelpful;
    return total > 0 ? Math.round((helpful / total) * 100) : 0;
  };

  const stats = useMemo(() => {
    const validRatings = reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0);
    const ratingTotal = validRatings.reduce((sum, rating) => sum + rating, 0);
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return {
      total: reviews.length,
      published: reviews.filter((review) => review.status === 'published').length,
      pending: reviews.filter((review) => review.status === 'pending').length,
      reported: reviews.filter((review) => review.status === 'reported').length,
      averageRating: validRatings.length > 0 ? Number((ratingTotal / validRatings.length).toFixed(1)) : 0,
      responseRate: 78,
      thisMonth: reviews.filter((review) => {
        const reviewDate = new Date(review.date);
        return !Number.isNaN(reviewDate.getTime()) && reviewDate >= thisMonthStart;
      }).length,
      lastMonth: reviews.filter((review) => {
        const reviewDate = new Date(review.date);
        return !Number.isNaN(reviewDate.getTime()) && reviewDate >= lastMonthStart && reviewDate < thisMonthStart;
      }).length
    };
  }, [reviews]);

  // Stats data
  const statCards = [
    {
      type: 'total',
      icon: <RateReview fontSize="large" />,
      value: stats.total,
      label: 'Total Reviews',
      trend: stats.lastMonth > 0 ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1) : 0
    },
    {
      type: 'rating',
      icon: <Star fontSize="large" />,
      value: stats.averageRating,
      label: 'Avg Rating',
      trend: null,
      isRating: true
    },
    {
      type: 'published',
      icon: <CheckCircle fontSize="large" />,
      value: stats.published,
      label: 'Published',
      trend: null
    },
    {
      type: 'response',
      icon: <Comment fontSize="large" />,
      value: stats.responseRate,
      label: 'Response Rate',
      trend: null,
      isPercentage: true
    }
  ];

  const linkedBookingDetails = bookingOptions.find((booking) => String(booking.id) === editForm.bookingId);

  return (
  
      <div className="reviews-container">
        {/* Header */}
        <PageHeader
          title="Reviews Management"
          subtitle="Manage and moderate customer reviews"
          primaryAction={{
            label: 'Export',
            onClick: () => console.log('Export clicked'),
            icon: <Download />
          }}
          secondaryActions={[
            {
              label: 'Print All',
              onClick: () => console.log('Print All clicked'),
              icon: <Print />
            },
            {
              label: 'Email All',
              onClick: () => console.log('Email All clicked'),
              icon: <Email />
            }
          ]}
          variant="gradient"
        />
        
        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((stat) => (
            <div key={stat.type} className={`stat-card ${stat.type}`}>
              <div className="card-header">
                <div className="stat-icon">{stat.icon}</div>
                {stat.trend !== null && (
                  <div className={`stat-trend ${stat.trend >= 0 ? 'positive' : 'negative'}`}>
                    {stat.trend >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <div className="card-content">
                <div className="stat-value">
                  {stat.isRating ? (
                    <>
                      {stat.value.toFixed(1)}
                      <Star fontSize="small" className="rating-star" />
                    </>
                  ) : stat.isPercentage ? (
                    `${stat.value}%`
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <Paper className="filters-paper">
          <div className="filters-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search reviews..."
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
              sx={{ minWidth: 300 }}
            />

            <div className="filter-controls">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="reported">Reported</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={filterRating}
                  label="Rating"
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4+">4+ Stars</MenuItem>
                  <MenuItem value="3+">3+ Stars</MenuItem>
                  <MenuItem value="2+">2+ Stars</MenuItem>
                  <MenuItem value="1+">1+ Stars</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={showVerifiedOnly}
                    onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                    size="small"
                  />
                }
                label="Verified Only"
              />

              <Tooltip title="Refresh">
                <IconButton>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </Paper>

        {/* Main Table */}
        <Paper className="reviews-table-paper">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Review ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Tour</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'rating'}
                      direction={orderBy === 'rating' ? order : 'desc'}
                      onClick={() => handleSort('rating')}
                    >
                      Rating
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'date'}
                      direction={orderBy === 'date' ? order : 'desc'}
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((review) => {
                    const statusConfig = getStatusConfig(review.status);
                    const helpfulPercentage = getHelpfulPercentage(review.helpful, review.notHelpful);

                    return (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          <div className="review-id-cell">
                            <Typography variant="body2" fontWeight="medium">
                              {review.id}
                            </Typography>
                            {review.reportCount > 0 && (
                              <Badge badgeContent={review.reportCount} color="error" size="small">
                                <Flag fontSize="small" />
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="customer-cell">
                            <Avatar className="customer-avatar">
                              {review.customer.name.charAt(0)}
                            </Avatar>
                            <div className="customer-info">
                              <Typography variant="body2" fontWeight="medium">
                                {review.customer.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {review.customer.email}
                              </Typography>
                              {review.verified && (
                                <Chip
                                  label="Verified User"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  icon={<CheckCircle fontSize="small" />}
                                  className="verified-chip"
                                />
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="tour-cell">
                            <Typography variant="body2" fontWeight="medium">
                              {review.tour.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {review.tour.category} {review.tour.duration}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="rating-cell">
                            <Rating
                              value={review.rating}
                              precision={0.5}
                              readOnly
                              sx={{ color: getRatingColor(review.rating) }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {review.rating.toFixed(1)}
                            </Typography>
                            <div className="helpful-stats">
                              <Box sx={{ width: '60px' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={helpfulPercentage}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#4caf50'
                                    }
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" color="textSecondary">
                                {helpfulPercentage}% helpful
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="comment-cell">
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {review.comment}
                            </Typography>
                            {review.photos > 0 && (
                              <Chip
                                label={`${review.photos} photos`}
                                size="small"
                                variant="outlined"
                                className="photos-chip"
                                onClick={() => handleViewImages(review)}
                                icon={<PhotoLibrary fontSize="small" />}
                              />
                            )}
                          </div>
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
                          <div className="date-cell">
                            <CalendarToday fontSize="small" className="date-icon" />
                            <div>
                              <Typography variant="body2">
                                {formatDate(review.date)}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatTime(review.date)}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, review)}
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
            count={filteredReviews.length}
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
          <MenuItem onClick={() => handleAction('view')}>
            <Visibility fontSize="small" className="menu-icon" />
            View Details
          </MenuItem>
          {selectedReview?.images && selectedReview.images.length > 0 && (
            <MenuItem onClick={() => handleAction('view-images')}>
              <PhotoLibrary fontSize="small" className="menu-icon" />
              View Images ({selectedReview.images.length})
            </MenuItem>
          )}
          <MenuItem onClick={() => handleAction('edit')}>
            <Edit fontSize="small" className="menu-icon" />
            Edit Review
          </MenuItem>
          {selectedReview?.status === 'pending' && (
            <MenuItem onClick={() => handleAction('publish')}>
              <CheckCircle fontSize="small" className="menu-icon" />
              Publish
            </MenuItem>
          )}
          {selectedReview?.status === 'published' && (
            <MenuItem onClick={() => handleAction('pending')}>
              <Block fontSize="small" className="menu-icon" />
              Move to Pending
            </MenuItem>
          )}
          <MenuItem onClick={() => handleAction('report')}>
            <Flag fontSize="small" className="menu-icon" />
            Report Review
          </MenuItem>
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" className="menu-icon" />
            Delete
          </MenuItem>
        </Menu>

        {/* View Review Dialog */}
        <Dialog open={openDialog && dialogType === 'view'} onClose={handleCloseViewDialog} maxWidth="md" fullWidth sx={reviewDialogSx}>
          <DialogTitle className="review-dialog-title">
            <Visibility className="dialog-icon" />
            Review Details
          </DialogTitle>
          <DialogContent dividers>
            {selectedReview && (
              <div className="review-details">
                <div className="review-header">
                  <div className="customer-section">
                    <Avatar sx={{ width: 60, height: 60, fontSize: 24 }}>
                      {selectedReview.customer.name.charAt(0)}
                    </Avatar>
                    <div className="customer-details">
                      <Typography variant="h6">{selectedReview.customer.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedReview.customer.email}
                      </Typography>
                      <div className="customer-tags">
                        {selectedReview.verified && (
                          <Chip label="Verified User" color="success" size="small" />
                        )}
                        <Chip label={selectedReview.bookingId ? `Booking #${selectedReview.bookingId}` : 'Guest review'} size="small" variant="outlined" />
                      </div>
                    </div>
                  </div>
                  <div className="rating-section">
                    <Rating value={selectedReview.rating} precision={0.5} readOnly size="large" />
                    <Typography variant="h5">{selectedReview.rating.toFixed(1)}</Typography>
                  </div>
                </div>

                <div className="review-content">
                  <Typography variant="subtitle1" gutterBottom>
                    Tour: {selectedReview.tour.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedReview.comment}
                  </Typography>

                  {selectedReview.images && selectedReview.images.length > 0 && (
                    <div className="review-photos">
                      <div className="photos-header">
                        <Typography variant="subtitle2" gutterBottom>
                          Customer Photos ({selectedReview.images.length})
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<ZoomIn />}
                          onClick={() => handleViewImages(selectedReview)}
                        >
                          View All
                        </Button>
                      </div>
                      <ImageList cols={3} gap={8} sx={{ maxHeight: 200 }}>
                        {selectedReview.images.slice(0, 3).map((image, index) => (
                          <ImageListItem key={image.id} onClick={() => {
                            setSelectedReviewImages(selectedReview.images);
                            setSelectedImageIndex(index);
                            setOpenImageGallery(true);
                          }}>
                            <img
                              src={image.url}
                              alt={image.title}
                              loading="lazy"
                              style={{ cursor: 'pointer', objectFit: 'cover', height: '100%' }}
                            />
                            <ImageListItemBar
                              title={image.title}
                              subtitle={`by ${image.uploadedBy}`}
                              sx={{ background: 'rgba(0, 0, 0, 0.5)' }}
                            />
                          </ImageListItem>
                        ))}
                        {selectedReview.images.length > 3 && (
                          <ImageListItem sx={{ position: 'relative' }}>
                            <div className="more-photos-overlay">
                              <Typography variant="h6" color="white">
                                +{selectedReview.images.length - 3}
                              </Typography>
                              <Typography variant="caption" color="white">
                                More photos
                              </Typography>
                            </div>
                          </ImageListItem>
                        )}
                      </ImageList>
                    </div>
                  )}
                </div>

                <div className="review-stats">
                  <div className="stat-item">
                    <ThumbUp fontSize="small" />
                    <Typography variant="body2">{selectedReview.helpful} helpful</Typography>
                  </div>
                  <div className="stat-item">
                    <ThumbDown fontSize="small" />
                    <Typography variant="body2">{selectedReview.notHelpful} not helpful</Typography>
                  </div>
                  <div className="stat-item">
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2">{formatDate(selectedReview.date)}</Typography>
                  </div>
                </div>

                {selectedReview.response && (
                  <Alert severity="info" className="response-alert">
                    <Typography variant="subtitle2" gutterBottom>
                      Your Response ({formatDate(selectedReview.responseDate)})
                    </Typography>
                    <Typography variant="body2">{selectedReview.response}</Typography>
                  </Alert>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Edit Review Dialog */}
        <Dialog
          open={openDialog && dialogType === 'edit'}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
          sx={reviewDialogSx}
        >
          <DialogTitle className="review-dialog-title">
            Edit Review
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
              {selectedReview && (
                <Box
                  sx={{
                    gridColumn: { xs: '1', md: '1 / -1' },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">Review Summary</Typography>
                    <Typography variant="body1">Review ID: {selectedReview.id}</Typography>
                    <Typography variant="body2">Customer: {selectedReview.customer.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Verification</Typography>
                    <Typography variant="body1">
                      {linkedBookingDetails ? `Booking #${linkedBookingDetails.id}` : 'No linked booking'}
                    </Typography>
                    <Typography variant="body2">
                      {linkedBookingDetails ? 'Verified User' : 'Guest Review'}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Typography variant="subtitle2">Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Rating
                    value={editForm.rating}
                    precision={1}
                    onChange={(event, newValue) => handleEditChange('rating', newValue || 0)}
                    size="large"
                  />
                  <Typography variant="h6" color="primary">
                    {editForm.rating.toFixed(1)}/5
                  </Typography>
                </Box>
              </Box>

              <TextField
                label="Linked Booking"
                select
                value={editForm.bookingId}
                onChange={(event) => handleBookingSelectionChange(event.target.value)}
                helperText={linkedBookingDetails
                  ? `${linkedBookingDetails.customer_email || 'No email'} • ${linkedBookingDetails.vehicle_type} • ${linkedBookingDetails.pickup_location} to ${linkedBookingDetails.drop_location}`
                  : 'Optional. Link a booking to mark this review as verified.'}
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                SelectProps={{ MenuProps: reviewDialogSelectMenuProps }}
              >
                <MenuItem value="">No linked booking</MenuItem>
                {bookingOptions.map((booking) => (
                  <MenuItem key={booking.id} value={String(booking.id)}>
                    #{booking.id} - {booking.customer_name} | {booking.vehicle_type} | {booking.pickup_location} to {booking.drop_location}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Customer Name"
                value={editForm.customerName}
                onChange={(event) => handleEditChange('customerName', event.target.value)}
                InputProps={{ readOnly: Boolean(editForm.bookingId) }}
                fullWidth
              />
              <TextField
                label="Customer Email"
                value={editForm.customerEmail}
                onChange={(event) => handleEditChange('customerEmail', event.target.value)}
                InputProps={{ readOnly: Boolean(editForm.bookingId) }}
                fullWidth
              />
              <TextField
                label="Tour Name"
                value={editForm.tourName}
                onChange={(event) => handleEditChange('tourName', event.target.value)}
                fullWidth
              />
              <TextField
                label="Status"
                select
                value={editForm.status}
                onChange={(event) => handleEditChange('status', event.target.value)}
                fullWidth
                SelectProps={{ MenuProps: reviewDialogSelectMenuProps }}
              >
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="pending">Pending Review</MenuItem>
                <MenuItem value="reported">Reported</MenuItem>
              </TextField>
              <TextField
                label="Helpful Votes"
                type="number"
                value={editForm.helpful}
                onChange={(event) => handleEditChange('helpful', parseInt(event.target.value, 10) || 0)}
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                label="Not Helpful Votes"
                type="number"
                value={editForm.notHelpful}
                onChange={(event) => handleEditChange('notHelpful', parseInt(event.target.value, 10) || 0)}
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                label="Review Comment"
                value={editForm.comment}
                onChange={(event) => handleEditChange('comment', event.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />
              <TextField
                label="Your Response (Optional)"
                value={editForm.response}
                onChange={(event) => handleEditChange('response', event.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
              />

              <Box
                sx={{
                  gridColumn: { xs: '1', md: '1 / -1' },
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Verified fontSize="small" color={linkedBookingDetails ? 'success' : 'disabled'} />
                <Typography variant="body2" fontWeight={600}>
                  {linkedBookingDetails ? 'Verified User' : 'Guest Review'}
                </Typography>
                {linkedBookingDetails && (
                  <Chip label={`Booking #${linkedBookingDetails.id}`} size="small" color="success" variant="outlined" />
                )}
              </Box>

              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Review Images ({editForm.images.length})
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<Upload />}
                  >
                    Upload New Images
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>

                {editForm.images.length > 0 ? (
                  <Grid container spacing={2}>
                    {editForm.images.map((image) => (
                      <Grid item xs={12} sm={6} md={4} key={image.id}>
                        <Card variant="outlined">
                          <CardMedia
                            component="img"
                            height="140"
                            image={image.url}
                            alt={image.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {image.title}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              {image.isCustomerUploaded ? 'Customer Upload' : 'Admin Upload'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              Uploaded: {formatDate(image.uploadDate)}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ p: 1, pt: 0 }}>
                            {image.isCustomerUploaded ? (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteForever />}
                                onClick={() => handleOpenDeleteImageDialog(image)}
                                fullWidth
                              >
                                Delete Customer Photo
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleImageDelete(image.id)}
                                fullWidth
                              >
                                Delete Admin Photo
                              </Button>
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" icon={<Image />}>
                    No images uploaded for this review. You can upload images using the button above.
                  </Alert>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Image Confirmation Dialog */}
        <Dialog
          open={openDeleteImageDialog}
          onClose={handleCloseDeleteImageDialog}
          sx={{ zIndex: 2400 }}
        >
          <DialogTitle>
            <DeleteForever className="dialog-icon" color="error" />
            Delete Customer Photo
          </DialogTitle>
          <DialogContent>
            {imageToDelete && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> This action cannot be undone. The photo will be permanently deleted.
                  </Typography>
                </Alert>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <img
                    src={imageToDelete.url}
                    alt={imageToDelete.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}
                  />
                  <Typography variant="h6">{imageToDelete.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Uploaded by: {imageToDelete.uploadedBy}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Upload Date: {formatDate(imageToDelete.uploadDate)}
                  </Typography>
                </Box>

                <Typography variant="body2">
                  Are you sure you want to delete this customer-uploaded photo?
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteImageDialog}>Cancel</Button>
            <Button
              onClick={confirmDeleteCustomerImage}
              variant="contained"
              color="error"
              startIcon={<DeleteForever />}
            >
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* Image Gallery Modal */}
        <Modal
          open={openImageGallery}
          onClose={handleCloseImageGallery}
          className="review-image-gallery-modal"
        >
          <Box
            className="review-image-gallery"
            role="dialog"
            aria-modal="true"
            aria-label="Review image gallery"
          >
            {selectedReviewImages[selectedImageIndex] && (
              <>
                <Box className="gallery-toolbar">
                  <Box className="gallery-title-group">
                    <Typography className="gallery-title" component="h2">
                      {selectedReviewImages[selectedImageIndex].title}
                    </Typography>
                    <Box className="gallery-meta">
                      <Typography component="span">
                        Uploaded by {selectedReviewImages[selectedImageIndex].uploadedBy}
                      </Typography>
                      {selectedReviewImages[selectedImageIndex].isCustomerUploaded && (
                        <Chip
                          label="Customer Photo"
                          size="small"
                          className="gallery-chip"
                        />
                      )}
                    </Box>
                  </Box>

                  <Box className="gallery-actions">
                    {selectedReviewImages[selectedImageIndex].isCustomerUploaded && (
                      <Tooltip title="Delete customer photo">
                        <IconButton
                          onClick={() => handleOpenDeleteImageDialog(selectedReviewImages[selectedImageIndex])}
                          className="gallery-icon-button gallery-delete-button"
                          size="small"
                          aria-label="Delete customer photo"
                        >
                          <DeleteForever />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Close gallery">
                      <IconButton
                        onClick={handleCloseImageGallery}
                        className="gallery-icon-button"
                        size="small"
                        aria-label="Close gallery"
                      >
                        <Close />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box className="gallery-stage">
                  {selectedReviewImages.length > 1 && (
                    <>
                      <IconButton
                        onClick={handlePrevImage}
                        className="gallery-nav gallery-nav-prev"
                        aria-label="Previous image"
                      >
                        <ArrowBack />
                      </IconButton>
                      <IconButton
                        onClick={handleNextImage}
                        className="gallery-nav gallery-nav-next"
                        aria-label="Next image"
                      >
                        <ArrowForward />
                      </IconButton>
                    </>
                  )}

                  <img
                    src={selectedReviewImages[selectedImageIndex].url}
                    alt={selectedReviewImages[selectedImageIndex].title}
                    className="gallery-main-image"
                  />
                </Box>

                <Box className="gallery-footer">
                  <Typography className="gallery-counter">
                    Image {selectedImageIndex + 1} of {selectedReviewImages.length}
                  </Typography>

                  {selectedReviewImages.length > 1 && (
                    <Box className="gallery-thumbnails" aria-label="Image thumbnails">
                      {selectedReviewImages.map((image, index) => (
                        <Box
                          key={image.id}
                          component="button"
                          type="button"
                          className={`gallery-thumbnail${index === selectedImageIndex ? ' is-active' : ''}`}
                          onClick={() => setSelectedImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                          aria-current={index === selectedImageIndex ? 'true' : undefined}
                        >
                          <img
                            src={image.url}
                            alt={image.title}
                          />
                          {image.isCustomerUploaded && (
                            <Box className="thumbnail-badge">
                              C
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Modal>

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

export default Reviews;
















