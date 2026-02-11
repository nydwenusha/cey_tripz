// Reviews.jsx
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
  Typography,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Stack,
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
  Reply,
  CheckCircle,
  Block,
  Refresh,
  Download,
  Print,
  Email,
  Person,
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
  Photo,
  RemoveCircle,
  Report,
  Security
} from '@mui/icons-material';
import './Reviews.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

// Sample review images - in real app, these would come from your backend
const sampleReviewImages = {
  'REV-001': [
    { id: 1, url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', title: 'Sigiriya View', uploadedBy: 'John Doe', isCustomerUploaded: true, uploadDate: '2024-01-15' },
    { id: 2, url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w-400&h=300&fit=crop', title: 'Tour Group', uploadedBy: 'John Doe', isCustomerUploaded: true, uploadDate: '2024-01-15' },
    { id: 3, url: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?w=400&h=300&fit=crop', title: 'Guide', uploadedBy: 'John Doe', isCustomerUploaded: true, uploadDate: '2024-01-15' }
  ],
  'REV-002': [
    { id: 1, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', title: 'Beach View', uploadedBy: 'Jane Smith', isCustomerUploaded: true, uploadDate: '2024-01-20' },
    { id: 2, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop', title: 'Resort Pool', uploadedBy: 'Jane Smith', isCustomerUploaded: true, uploadDate: '2024-01-20' }
  ],
  'REV-003': [
    { id: 1, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop', title: 'Mountain Peak', uploadedBy: 'Robert Johnson', isCustomerUploaded: true, uploadDate: '2024-01-25' },
    { id: 2, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', title: 'Trekking Trail', uploadedBy: 'Robert Johnson', isCustomerUploaded: true, uploadDate: '2024-01-25' },
    { id: 3, url: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=400&h=300&fit=crop', title: 'Camp Site', uploadedBy: 'Robert Johnson', isCustomerUploaded: true, uploadDate: '2024-01-25' },
    { id: 4, url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop', title: 'Sunset View', uploadedBy: 'Robert Johnson', isCustomerUploaded: true, uploadDate: '2024-01-25' },
    { id: 5, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop', title: 'Team Photo', uploadedBy: 'Robert Johnson', isCustomerUploaded: true, uploadDate: '2024-01-25' }
  ],
  'REV-005': [
    { id: 1, url: 'https://images.unsplash.com/photo-1550358864-518f202c02ba?w=400&h=300&fit=crop', title: 'Wildlife', uploadedBy: 'Michael Wilson', isCustomerUploaded: true, uploadDate: '2024-02-01' }
  ],
  'REV-006': [
    { id: 1, url: 'https://images.unsplash.com/photo-1519925610903-381054cc2a1c?w=400&h=300&fit=crop', title: 'City Tour', uploadedBy: 'Sarah Brown', isCustomerUploaded: true, uploadDate: '2024-02-05' },
    { id: 2, url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop', title: 'Landmarks', uploadedBy: 'Sarah Brown', isCustomerUploaded: true, uploadDate: '2024-02-05' },
    { id: 3, url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', title: 'City Streets', uploadedBy: 'Sarah Brown', isCustomerUploaded: true, uploadDate: '2024-02-05' },
    { id: 4, url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop', title: 'Guide', uploadedBy: 'Sarah Brown', isCustomerUploaded: true, uploadDate: '2024-02-05' }
  ]
};

const Reviews = () => {
  // Initial reviews data
  const initialReviews = [
    {
      id: 'REV-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '',
        bookings: 3
      },
      tour: {
        id: 'TOUR-001',
        name: 'Sigiriya Adventure',
        category: 'Adventure',
        duration: '2 days',
        price: '$150'
      },
      rating: 4,
      comment: 'Amazing experience! The tour guide was very knowledgeable and the views were breathtaking. Highly recommend this adventure.',
      date: '2024-01-15 14:30:00',
      status: 'published',
      verified: true,
      helpful: 12,
      notHelpful: 2,
      response: 'Thank you for your wonderful review! We\'re thrilled you enjoyed the Sigiriya Adventure.',
      responseDate: '2024-01-16 10:15:00',
      photos: 3,
      reportCount: 0,
      images: sampleReviewImages['REV-001']
    },
    {
      id: 'REV-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '',
        bookings: 2
      },
      tour: {
        id: 'TOUR-002',
        name: 'Beach Paradise',
        category: 'Relaxation',
        duration: '3 days',
        price: '$200'
      },
      rating: 4.5,
      comment: 'Great tour, highly recommended. The beach was pristine and the accommodations were excellent.',
      date: '2024-01-20 11:45:00',
      status: 'published',
      verified: true,
      helpful: 8,
      notHelpful: 1,
      response: 'We appreciate your feedback! Glad you enjoyed your Beach Paradise experience.',
      responseDate: '2024-01-21 09:30:00',
      photos: 2,
      reportCount: 0,
      images: sampleReviewImages['REV-002']
    },
    {
      id: 'REV-003',
      customer: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        avatar: '',
        bookings: 1
      },
      tour: {
        id: 'TOUR-003',
        name: 'Mountain Trekking',
        category: 'Extreme',
        duration: '5 days',
        price: '$350'
      },
      rating: 5,
      comment: 'Absolutely fantastic! Challenging but rewarding. The guides were professional and safety was their top priority.',
      date: '2024-01-25 09:15:00',
      status: 'published',
      verified: false,
      helpful: 15,
      notHelpful: 0,
      response: '',
      responseDate: null,
      photos: 5,
      reportCount: 0,
      images: sampleReviewImages['REV-003']
    },
    {
      id: 'REV-004',
      customer: {
        name: 'Emily Davis',
        email: 'emily@example.com',
        avatar: '',
        bookings: 4
      },
      tour: {
        id: 'TOUR-004',
        name: 'Cultural Heritage',
        category: 'Cultural',
        duration: '4 days',
        price: '$280'
      },
      rating: 3,
      comment: 'Good experience but could be better. Some sites were overcrowded.',
      date: '2024-01-28 16:20:00',
      status: 'pending',
      verified: true,
      helpful: 5,
      notHelpful: 3,
      response: '',
      responseDate: null,
      photos: 0,
      reportCount: 0,
      images: []
    },
    {
      id: 'REV-005',
      customer: {
        name: 'Michael Wilson',
        email: 'michael@example.com',
        avatar: '',
        bookings: 5
      },
      tour: {
        id: 'TOUR-005',
        name: 'Wildlife Safari',
        category: 'Wildlife',
        duration: '3 days',
        price: '$320'
      },
      rating: 2,
      comment: 'Disappointed with the tour. Expected more wildlife sightings.',
      date: '2024-02-01 13:45:00',
      status: 'published',
      verified: true,
      helpful: 3,
      notHelpful: 7,
      response: 'We\'re sorry to hear about your experience. We\'ll work with our guides to improve wildlife spotting opportunities.',
      responseDate: '2024-02-02 11:00:00',
      photos: 1,
      reportCount: 1,
      images: sampleReviewImages['REV-005']
    },
    {
      id: 'REV-006',
      customer: {
        name: 'Sarah Brown',
        email: 'sarah@example.com',
        avatar: '',
        bookings: 2
      },
      tour: {
        id: 'TOUR-006',
        name: 'City Explorer',
        category: 'Urban',
        duration: '1 day',
        price: '$75'
      },
      rating: 4,
      comment: 'Great city tour! The guide was very informative.',
      date: '2024-02-05 10:30:00',
      status: 'published',
      verified: true,
      helpful: 6,
      notHelpful: 1,
      response: 'Thank you for joining our City Explorer tour!',
      responseDate: '2024-02-05 15:20:00',
      photos: 4,
      reportCount: 0,
      images: sampleReviewImages['REV-006']
    }
  ];

  // Sample tours for dropdown
  const availableTours = [
    { id: 'TOUR-001', name: 'Sigiriya Adventure', category: 'Adventure' },
    { id: 'TOUR-002', name: 'Beach Paradise', category: 'Relaxation' },
    { id: 'TOUR-003', name: 'Mountain Trekking', category: 'Extreme' },
    { id: 'TOUR-004', name: 'Cultural Heritage', category: 'Cultural' },
    { id: 'TOUR-005', name: 'Wildlife Safari', category: 'Wildlife' },
    { id: 'TOUR-006', name: 'City Explorer', category: 'Urban' },
    { id: 'TOUR-007', name: 'Historical Tour', category: 'History' },
    { id: 'TOUR-008', name: 'Food Tour', category: 'Culinary' }
  ];

  // State
  const [reviews, setReviews] = useState(initialReviews);
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
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: '',
    status: 'pending',
    verified: false,
    tourId: '',
    helpful: 0,
    notHelpful: 0,
    response: '',
    images: []
  });
  const [stats, setStats] = useState({
    total: 125,
    published: 98,
    pending: 15,
    reported: 12,
    averageRating: 4.2,
    responseRate: 78,
    thisMonth: 24,
    lastMonth: 31
  });

  // Initialize edit form when review is selected
  const initializeEditForm = (review) => {
    setEditForm({
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      verified: review.verified,
      tourId: review.tour.id,
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
    alert(`Image "${imageToDelete.title}" has been deleted successfully.`);

    // Close dialogs
    handleCloseDeleteImageDialog();
    if (openImageGallery) {
      setOpenImageGallery(false);
    }
  };

  // Handle edit form submit
  const handleEditSubmit = () => {
    if (!selectedReview) return;

    // Find the tour data
    const selectedTour = availableTours.find(tour => tour.id === editForm.tourId);
    const originalTour = reviews.find(r => r.id === selectedReview.id)?.tour;

    const updatedReview = {
      ...selectedReview,
      rating: editForm.rating,
      comment: editForm.comment,
      status: editForm.status,
      verified: editForm.verified,
      tour: selectedTour ? {
        ...originalTour,
        id: selectedTour.id,
        name: selectedTour.name,
        category: selectedTour.category
      } : originalTour,
      helpful: editForm.helpful,
      notHelpful: editForm.notHelpful,
      response: editForm.response,
      images: editForm.images,
      photos: editForm.images.length,
      // Update date to current time when edited
      date: new Date().toISOString()
    };

    // Update reviews list
    setReviews(reviews.map(review => 
      review.id === selectedReview.id ? updatedReview : review
    ));

    // Show success message
    alert('Review updated successfully!');
    
    // Close dialog
    setOpenDialog(false);
    setEditForm({
      rating: 0,
      comment: '',
      status: 'pending',
      verified: false,
      tourId: '',
      helpful: 0,
      notHelpful: 0,
      response: '',
      images: []
    });
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

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleAction = (action) => {
    if (!selectedReview) return;

    switch (action) {
      case 'view':
        setDialogType('view');
        setOpenDialog(true);
        break;
      case 'edit':
        setDialogType('edit');
        initializeEditForm(selectedReview);
        setOpenDialog(true);
        break;
      case 'view-images':
        handleViewImages(selectedReview);
        break;
      case 'manage-images':
        setDialogType('manage-images');
        setOpenDialog(true);
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
      case 'reply':
        setDialogType('reply');
        setOpenDialog(true);
        break;
      case 'report':
        handleReportReview(selectedReview.id);
        break;
      default:
        break;
    }

    handleMenuClose();
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

  const updateReviewStatus = (id, status) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, status } : review
    ));
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
                                  label="Verified"
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
                              {review.tour.category} • {review.tour.duration}
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
            <>
              <MenuItem onClick={() => handleAction('view-images')}>
                <PhotoLibrary fontSize="small" className="menu-icon" />
                View Images ({selectedReview.images.length})
              </MenuItem>
              <MenuItem onClick={() => handleAction('manage-images')}>
                <Security fontSize="small" className="menu-icon" />
                Manage Customer Photos
              </MenuItem>
            </>
          )}
          <MenuItem onClick={() => handleAction('edit')}>
            <Edit fontSize="small" className="menu-icon" />
            Edit Review
          </MenuItem>
          <MenuItem onClick={() => handleAction('reply')}>
            <Reply fontSize="small" className="menu-icon" />
            Reply to Review
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
        <Dialog open={openDialog && dialogType === 'view'} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Visibility className="dialog-icon" />
            Review Details
          </DialogTitle>
          <DialogContent>
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
                          <Chip label="Verified Customer" color="success" size="small" />
                        )}
                        <Chip label={`${selectedReview.customer.bookings} bookings`} size="small" variant="outlined" />
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
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Review Dialog */}
        <Dialog open={openDialog && dialogType === 'edit'} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Edit className="dialog-icon" />
            Edit Review
            {selectedReview && (
              <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                ID: {selectedReview.id} • Customer: {selectedReview.customer.name}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Rating Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating
                      value={editForm.rating}
                      precision={0.5}
                      onChange={(event, newValue) => handleEditChange('rating', newValue)}
                      size="large"
                    />
                    <Typography variant="h6" color="primary">
                      {editForm.rating.toFixed(1)}/5
                    </Typography>
                  </Box>
                </Grid>

                {/* Tour Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tour</InputLabel>
                    <Select
                      value={editForm.tourId}
                      label="Tour"
                      onChange={(e) => handleEditChange('tourId', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select a tour</em>
                      </MenuItem>
                      {availableTours.map((tour) => (
                        <MenuItem key={tour.id} value={tour.id}>
                          {tour.name} ({tour.category})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Status Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editForm.status}
                      label="Status"
                      onChange={(e) => handleEditChange('status', e.target.value)}
                    >
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="pending">Pending Review</MenuItem>
                      <MenuItem value="reported">Reported</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Comment Section */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Review Comment"
                    value={editForm.comment}
                    onChange={(e) => handleEditChange('comment', e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                {/* Stats Section */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Helpful Votes"
                    value={editForm.helpful}
                    onChange={(e) => handleEditChange('helpful', parseInt(e.target.value) || 0)}
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Not Helpful Votes"
                    value={editForm.notHelpful}
                    onChange={(e) => handleEditChange('notHelpful', parseInt(e.target.value) || 0)}
                    variant="outlined"
                    size="small"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                {/* Response Section */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Your Response (Optional)"
                    value={editForm.response}
                    onChange={(e) => handleEditChange('response', e.target.value)}
                    variant="outlined"
                    placeholder="Add your response to this review..."
                  />
                </Grid>

                {/* Verified Status */}
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editForm.verified}
                          onChange={(e) => handleEditChange('verified', e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Verified fontSize="small" />
                          <Typography>Verified Customer</Typography>
                        </Box>
                      }
                    />
                  </FormGroup>
                </Grid>

                {/* Images Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
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
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)} 
              startIcon={<Cancel />}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit} 
              variant="contained" 
              startIcon={<Save />}
              color="primary"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manage Customer Photos Dialog */}
        <Dialog open={openDialog && dialogType === 'manage-images'} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Security className="dialog-icon" />
            Manage Customer Photos
            {selectedReview && (
              <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                Review: {selectedReview.id} • Customer: {selectedReview.customer.name}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> Deleting customer photos is permanent. Customers may have uploaded these photos as part of their review experience. Consider whether deletion is necessary.
                  </Typography>
                </Alert>

                <Typography variant="h6" gutterBottom>
                  Customer Uploaded Photos ({selectedReview.images.filter(img => img.isCustomerUploaded).length})
                </Typography>
                
                {selectedReview.images.filter(img => img.isCustomerUploaded).length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedReview.images.filter(img => img.isCustomerUploaded).map((image) => (
                      <Grid item xs={12} sm={6} md={4} key={image.id}>
                        <Card variant="outlined" sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="160"
                            image={image.url}
                            alt={image.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {image.title}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Chip
                                label="Customer Upload"
                                size="small"
                                color="primary"
                                variant="outlined"
                                icon={<Person fontSize="small" />}
                              />
                              <Chip
                                label={formatDate(image.uploadDate)}
                                size="small"
                                variant="outlined"
                                icon={<CalendarToday fontSize="small" />}
                              />
                            </Stack>
                          </CardContent>
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="error"
                              startIcon={<DeleteForever />}
                              onClick={() => handleOpenDeleteImageDialog(image)}
                            >
                              Delete Photo
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" icon={<Photo />}>
                    No customer uploaded photos found for this review.
                  </Alert>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Photo Management Guidelines
                </Typography>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>When to delete customer photos:</strong>
                  </Typography>
                  <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li>Inappropriate or offensive content</li>
                    <li>Violation of community guidelines</li>
                    <li>Poor quality or irrelevant images</li>
                    <li>Copyright infringement concerns</li>
                  </ul>
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={openDialog && dialogType === 'reply'} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Reply className="dialog-icon" />
            Reply to Review
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <div className="reply-form">
                <Typography variant="body1" paragraph>
                  Replying to review by {selectedReview.customer.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Original Review: "{selectedReview.comment.substring(0, 100)}..."
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Your Response"
                  variant="outlined"
                  defaultValue={selectedReview.response || ''}
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => {
              console.log('Reply sent');
              setOpenDialog(false);
            }}>
              Send Response
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Image Confirmation Dialog */}
        <Dialog open={openDeleteImageDialog} onClose={handleCloseDeleteImageDialog}>
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
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden'
          }}>
            {/* Close button */}
            <IconButton
              onClick={handleCloseImageGallery}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 1,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <Close />
            </IconButton>

            {/* Delete button for customer photos */}
            {selectedReviewImages[selectedImageIndex]?.isCustomerUploaded && (
              <IconButton
                onClick={() => handleOpenDeleteImageDialog(selectedReviewImages[selectedImageIndex])}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 60,
                  bgcolor: 'rgba(220, 53, 69, 0.8)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(220, 53, 69, 1)'
                  }
                }}
              >
                <DeleteForever />
              </IconButton>
            )}

            {/* Navigation buttons */}
            {selectedReviewImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    zIndex: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    zIndex: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </>
            )}

            {/* Current image */}
            {selectedReviewImages[selectedImageIndex] && (
              <>
                <img
                  src={selectedReviewImages[selectedImageIndex].url}
                  alt={selectedReviewImages[selectedImageIndex].title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                
                {/* Image info */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  p: 2
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        {selectedReviewImages[selectedImageIndex].title}
                      </Typography>
                      <Typography variant="body2">
                        Uploaded by: {selectedReviewImages[selectedImageIndex].uploadedBy}
                        {selectedReviewImages[selectedImageIndex].isCustomerUploaded && (
                          <Chip
                            label="Customer Photo"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      Image {selectedImageIndex + 1} of {selectedReviewImages.length}
                    </Typography>
                  </Box>
                </Box>

                {/* Thumbnail strip */}
                {selectedReviewImages.length > 1 && (
                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    p: 2,
                    overflowX: 'auto',
                    bgcolor: 'background.default'
                  }}>
                    {selectedReviewImages.map((image, index) => (
                      <Box key={image.id} sx={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={image.title}
                          onClick={() => setSelectedImageIndex(index)}
                          style={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            cursor: 'pointer',
                            opacity: index === selectedImageIndex ? 1 : 0.5,
                            border: index === selectedImageIndex ? '2px solid #1976d2' : 'none',
                            borderRadius: 4
                          }}
                        />
                        {image.isCustomerUploaded && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'primary.main',
                              color: 'white',
                              borderRadius: '50%',
                              width: 16,
                              height: 16,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px'
                            }}
                          >
                            C
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Modal>
      </div>

  );
};

export default Reviews;