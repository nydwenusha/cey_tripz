import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
    Alert,
    Snackbar,
    Switch,
    FormControlLabel,
    LinearProgress,
    InputAdornment,
    Avatar,
    Badge,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Publish as PublishIcon,
    Schedule as ScheduleIcon,
    Category as CategoryIcon,
    Tag as TagIcon,
    Image as ImageIcon,
    RemoveRedEye as EyeIcon,
    Comment as CommentIcon,
    Star as StarIcon,
    TrendingUp as TrendingIcon,
    Email,
    Print,
    Save,
    Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './BlogPostManagement.scss';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const BlogPostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [imagePreview, setImagePreview] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const [previewPost, setPreviewPost] = useState(null);

    // Stats
    const [stats, setStats] = useState({
        totalPosts: 0,
        published: 0,
        pending: 0,
        drafts: 0,
        scheduled: 0,
        totalViews: 0,
        totalComments: 0
    });

    const [postForm, setPostForm] = useState({
        id: '',
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category_id: '',
        category_name: '',
        tags: [],
        author: '',
        author_avatar: null,
        status: 'draft',
        image: null,
        published_date: null,
        scheduled_date: null,
        is_featured: false,
        meta_title: '',
        meta_description: '',
        views: 0,
        comments: 0,
        likes: 0,
        read_time: '',
        location: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const editSelectMenuProps = {
        sx: { zIndex: 1702 },
        PaperProps: {
            sx: {
                maxHeight: 320,
                zIndex: 1702,
            },
        },
    };
    const editDatePickerSlotProps = {
        popper: {
            sx: { zIndex: 1702 },
        },
        textField: {
            fullWidth: true,
            margin: 'dense',
        },
    };

    // Get image URL helper
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${import.meta.env.VITE_BLOG_IMAGE_URL || 'http://localhost:8000/storage'}/${imagePath}`;
    };

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const updateStats = useCallback((postsData) => {
        const published = postsData.filter(p => p.status === 'published').length;
        const pending = postsData.filter(p => p.status === 'pending').length;
        const drafts = postsData.filter(p => p.status === 'draft').length;
        const scheduled = postsData.filter(p => p.status === 'scheduled').length;
        const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0);
        const totalComments = postsData.reduce((sum, post) => sum + (post.comments || 0), 0);

        setStats({
            totalPosts: postsData.length,
            published,
            pending,
            drafts,
            scheduled,
            totalViews,
            totalComments
        });
    }, []);

    const fetchData = useCallback(async () => {
        setInitialLoading(true);
        try {
            // Fetch posts and categories in parallel
            const [postsResponse, categoriesResponse] = await Promise.all([
                api.get('/blogPosts'),
                api.get('/blogPostCategories')
            ]);

            if (postsResponse.status === 200) {
                const postsData = postsResponse.data.blogPosts || postsResponse.data.data || postsResponse.data;
                setPosts(postsData);
                updateStats(postsData);
            }

            if (categoriesResponse.status === 200) {
                const categoriesData = categoriesResponse.data.categories || categoriesResponse.data.data || categoriesResponse.data;
                setCategories(categoriesData);
            }

            // Extract all unique tags from posts
            const allTagsSet = new Set();
            if (postsResponse.data.blogPosts) {
                postsResponse.data.blogPosts.forEach(post => {
                    if (post.tags && Array.isArray(post.tags)) {
                        post.tags.forEach(tag => allTagsSet.add(tag));
                    }
                });
            }
            setAllTags(Array.from(allTagsSet));

        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to load blog posts', 'error');
        } finally {
            setInitialLoading(false);
        }
    }, [showSnackbar, updateStats]);

    const filterAndSortPosts = useCallback(() => {
        let filtered = [...posts];

        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(post => post.status === statusFilter);
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(post => post.category_id === parseInt(categoryFilter) || post.category === categoryFilter);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at || b.published_date) - new Date(a.created_at || a.published_date);
                case 'oldest':
                    return new Date(a.created_at || a.published_date) - new Date(b.created_at || b.published_date);
                case 'views':
                    return (b.views || 0) - (a.views || 0);
                case 'title':
                    return (a.title || '').localeCompare(b.title || '');
                case 'likes':
                    return (b.likes || 0) - (a.likes || 0);
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
    }, [categoryFilter, posts, searchQuery, sortBy, statusFilter]);

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        filterAndSortPosts();
    }, [filterAndSortPosts]);

    const handleOpenDialog = async (post) => {
        if (!post) {
            return;
        }

        setPostForm({
            id: post.id,
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            category_id: post.category_id || '',
            category_name: post.category || '',
            tags: post.tags || [],
            author: post.author || '',
            author_avatar: post.author_avatar || null,
            status: post.status || 'draft',
            image: post.image || null,
            published_date: post.published_date || post.created_at || null,
            scheduled_date: post.scheduled_date || null,
            is_featured: post.is_featured || false,
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            views: post.views || 0,
            comments: post.comments || 0,
            likes: post.likes || 0,
            read_time: post.read_time || '',
            location: post.location || ''
        });
        setImagePreview(getImageUrl(post.image));
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenPreview = (post) => {
        if (!post) {
            return;
        }

        setPreviewPost(post);
    };

    const handleClosePreview = () => {
        setPreviewPost(null);
    };

    const handleSavePost = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            const selectedCategory = categories.find((cat) => String(cat.id) === String(postForm.category_id));

            formData.append('title', postForm.title);
            formData.append('slug', postForm.slug);
            formData.append('content', postForm.content);
            formData.append('excerpt', postForm.excerpt);
            formData.append('category_id', postForm.category_id || '');
            formData.append('category', selectedCategory?.name || postForm.category_name || '');
            formData.append('author', postForm.author);
            formData.append('status', postForm.status);
            formData.append('is_featured', postForm.is_featured);
            formData.append('meta_title', postForm.meta_title);
            formData.append('meta_description', postForm.meta_description);
            formData.append('location', postForm.location);
            formData.append('read_time', postForm.read_time);

            if (postForm.scheduled_date) {
                formData.append('scheduled_date', postForm.scheduled_date);
            }

            if (postForm.image && typeof postForm.image !== 'string') {
                formData.append('image', postForm.image);
            }

            postForm.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

            formData.append('_method', 'PUT');
            const response = await api.post(`/blogPosts/${postForm.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showSnackbar(response.data?.message || 'Blog post updated successfully!', 'success');

            if (response.status === 200 || response.status === 201) {
                await fetchData();
                handleCloseDialog();
            }
        } catch (error) {
            console.error('Error saving post:', error);
            showSnackbar(error.response?.data?.message || 'Failed to save post', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete button click - opens confirmation dialog
    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setOpenDeleteDialog(true);
    };

    // Handle confirm delete - calls API
    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        setDeleteLoading(true);
        try {
            const response = await api.delete(`/blogPostDelete/${postToDelete.id}`);

            if (response.status === 200) {
                showSnackbar('Blog post deleted successfully!', 'success');
                await fetchData(); // Refresh data
                setOpenDeleteDialog(false);
                setPostToDelete(null);
            } else {
                showSnackbar('Failed to delete post', 'error');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showSnackbar(error.response?.data?.message || 'Failed to delete post', 'error');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setPostToDelete(null);
    };

    const handleInputChange = (field, value) => {
        setPostForm(prev => ({ ...prev, [field]: value }));

        if (field === 'title') {
            const slug = value
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-');
            setPostForm(prev => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setPostForm(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateSeoScore = (post) => {
        let score = 0;
        if (post.title && post.title.length >= 50 && post.title.length <= 60) score += 25;
        if (post.meta_description && post.meta_description.length >= 120 && post.meta_description.length <= 160) score += 25;
        if (post.content && post.content.length > 300) score += 25;
        if (post.tags && post.tags.length >= 3) score += 25;
        return score;
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'success';
            case 'pending': return 'warning';
            case 'draft': return 'warning';
            case 'scheduled': return 'info';
            default: return 'default';
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedPosts = filteredPosts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const statsData = [
        {
            title: 'Total Posts',
            value: stats.totalPosts,
            icon: <PublishIcon />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Published',
            value: stats.published,
            icon: <ViewIcon />,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            change: '+8%',
            trend: 'up'
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: <ScheduleIcon />,
            color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            change: '+0%',
            trend: 'up'
        },
        {
            title: 'Drafts',
            value: stats.drafts,
            icon: <EditIcon />,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            change: '-3%',
            trend: 'down'
        },
        {
            title: 'Scheduled',
            value: stats.scheduled,
            icon: <ScheduleIcon />,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            change: '+15%',
            trend: 'up'
        },
        {
            title: 'Total Views',
            value: stats.totalViews,
            icon: <EyeIcon />,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            change: '+24%',
            trend: 'up'
        },
        {
            title: 'Comments',
            value: stats.totalComments,
            icon: <CommentIcon />,
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            change: '+18%',
            trend: 'up'
        }
    ];

    if (initialLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="blog-management">
                {/* Header */}
                <PageHeader
                    title="Blog Post Management"
                    subtitle="Create, edit, and manage all your blog posts in one place."
                    primaryAction={{
                        label: 'Add Blog',
                        onClick: () => navigate('/blogs/add'),
                        icon: <AddIcon />
                    }}
                    secondaryActions={[
                        {
                            label: 'Print All',
                            onClick: () => window.print(),
                            icon: <Print />
                        },
                        {
                            label: 'Email All',
                            onClick: () => console.log('Email all'),
                            icon: <Email />
                        }
                    ]}
                    variant="gradient"
                />

                {/* Stats Cards */}
                <Box className="stats-container">
                    <Grid container spacing={3} className="stats-grid">
                        {statsData.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={index} className="stat-item">
                                <Card className="stat-card" style={{ background: stat.color }}>
                                    <CardContent className="stat-card-content" sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        justifyContent: 'space-between',
                                        padding: '20px !important',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '16px'
                                        }}>
                                            <Box sx={{
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                width: 40,
                                                height: 40,
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {stat.icon}
                                            </Box>
                                            <Typography variant="caption" sx={{
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2px',
                                                fontSize: '0.75rem'
                                            }}>
                                                {stat.change} <TrendingIcon fontSize="inherit" />
                                            </Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{
                                            fontSize: '2.5rem',
                                            fontWeight: 800,
                                            margin: '8px 0',
                                            lineHeight: 1,
                                            color: 'white'
                                        }}>
                                            {formatNumber(stat.value)}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            opacity: 0.9,
                                            fontWeight: 500,
                                            marginTop: 'auto',
                                            fontSize: '0.875rem',
                                            color: 'white',
                                            display: 'block',
                                            visibility: 'visible',
                                            height: 'auto',
                                            lineHeight: 1.4
                                        }}>
                                            {stat.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Filters */}
                <Paper className="filters-section">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    label="Category"
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label="Sort By"
                                >
                                    <MenuItem value="newest">Newest First</MenuItem>
                                    <MenuItem value="oldest">Oldest First</MenuItem>
                                    <MenuItem value="views">Most Viewed</MenuItem>
                                    <MenuItem value="likes">Most Liked</MenuItem>
                                    <MenuItem value="title">Title A-Z</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                    setCategoryFilter('all');
                                    setSortBy('newest');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Posts Table */}
                {loading && !initialLoading ? (
                    <LinearProgress className="loading-bar" />
                ) : (
                    <>
                        <TableContainer component={Paper} className="posts-table">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="120px">Image</TableCell>
                                        <TableCell>Post Details</TableCell>
                                        <TableCell width="120px">Category</TableCell>
                                        <TableCell width="120px">Status</TableCell>
                                        <TableCell width="180px">Stats</TableCell>
                                        <TableCell width="120px">SEO Score</TableCell>
                                        <TableCell width="150px" align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedPosts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No blog posts found.
                                            </TableCell>
                                        </TableRow>
                                    ) : paginatedPosts.map((post) => (
                                        <TableRow key={post.id} className={post.is_featured ? 'featured-post' : ''}>
                                            <TableCell>
                                                <Box className="post-image-container">
                                                    <Avatar
                                                        variant="rounded"
                                                        src={getImageUrl(post.image)}
                                                        alt={post.title}
                                                        className="post-image"
                                                        sx={{ width: 80, height: 60 }}
                                                    >
                                                        <ImageIcon />
                                                    </Avatar>
                                                    {post.is_featured && (
                                                        <Badge
                                                            badgeContent={<StarIcon sx={{ fontSize: 12 }} />}
                                                            color="warning"
                                                            className="featured-badge"
                                                        >
                                                            <div></div>
                                                        </Badge>
                                                    )}
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box className="post-details">
                                                    <Typography variant="subtitle2" className="post-title" gutterBottom>
                                                        {post.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" className="post-excerpt">
                                                        {post.excerpt?.substring(0, 120)}...
                                                    </Typography>
                                                    <Box className="post-meta">
                                                        <Box className="author-info">
                                                            <Avatar
                                                                src={getImageUrl(post.author_avatar)}
                                                                sx={{ width: 24, height: 24, mr: 1 }}
                                                            >
                                                                {post.author?.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="caption">
                                                                {post.author || 'Admin'} • {new Date(post.created_at).toLocaleDateString()} • {post.read_time || '5 min read'}
                                                            </Typography>
                                                        </Box>
                                                        <Box className="post-tags">
                                                            {post.tags?.slice(0, 2).map((tag) => (
                                                                <Chip
                                                                    key={tag}
                                                                    label={tag}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    className="tag-chip"
                                                                    icon={<TagIcon fontSize="small" />}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    icon={<CategoryIcon />}
                                                    label={post.category}
                                                    size="small"
                                                    className="category-chip"
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={post.status}
                                                    color={getStatusColor(post.status)}
                                                    size="small"
                                                    icon={post.status === 'scheduled' ? <ScheduleIcon /> : null}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Box className="post-stats">
                                                    <Box className="stat-item">
                                                        <EyeIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" className="stat-value">
                                                            {formatNumber(post.views || 0)}
                                                        </Typography>
                                                    </Box>
                                                    <Box className="stat-item">
                                                        <CommentIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" className="stat-value">
                                                            {post.comments || 0}
                                                        </Typography>
                                                    </Box>
                                                    <Box className="stat-item">
                                                        <StarIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" className="stat-value">
                                                            {formatNumber(post.likes || 0)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box className="seo-score">
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={post.seo_score || calculateSeoScore(post)}
                                                        className={`seo-progress seo-${Math.floor((post.seo_score || calculateSeoScore(post)) / 25)}`}
                                                    />
                                                    <Box className="seo-info">
                                                        <Typography variant="body2" className="seo-value">
                                                            {post.seo_score || calculateSeoScore(post)}%
                                                        </Typography>
                                                        {(post.seo_score || calculateSeoScore(post)) >= 75 && (
                                                            <Typography variant="caption" color="success.main">
                                                                Excellent
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Box className="action-buttons">
                                                    <Tooltip title="Preview">
                                                        <IconButton
                                                            size="small"
                                                            className="action-btn view-btn"
                                                            onClick={() => handleOpenPreview(post)}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            className="action-btn edit-btn"
                                                            onClick={() => handleOpenDialog(post)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            className="action-btn delete-btn"
                                                            onClick={() => handleDeleteClick(post)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredPosts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            className="pagination"
                        />
                    </>
                )}

                {/* Preview Dialog */}
                <Dialog
                    open={Boolean(previewPost)}
                    onClose={handleClosePreview}
                    maxWidth="md"
                    fullWidth
                    className="post-dialog"
                    sx={{
                        zIndex: 1601,
                        '& .MuiDialog-paper': {
                            mt: { xs: 10, sm: 12 },
                            mb: 3,
                            maxHeight: 'calc(100% - 120px)',
                        },
                    }}
                >
                    <DialogTitle className="blog-dialog-title">
                        Blog Post Preview
                    </DialogTitle>
                    <DialogContent dividers sx={{ background: '#f8fafc' }}>
                        {previewPost && (
                            <Box sx={{ background: '#fff', borderRadius: 2, overflow: 'hidden' }}>
                                {(previewPost.image || previewPost.image_url) && (
                                    <Box
                                        component="img"
                                        src={getImageUrl(previewPost.image || previewPost.image_url)}
                                        alt={previewPost.title}
                                        sx={{
                                            width: '100%',
                                            height: { xs: 220, md: 360 },
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                )}
                                <Box sx={{ p: { xs: 2, md: 4 } }}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        <Chip label={previewPost.status || 'draft'} color={getStatusColor(previewPost.status)} size="small" />
                                        {previewPost.category && (
                                            <Chip label={previewPost.category} size="small" variant="outlined" />
                                        )}
                                    </Box>

                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.25 }}>
                                        {previewPost.title || 'Untitled Post'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {previewPost.author || 'Admin'} | {previewPost.read_time || '5 min read'}
                                    </Typography>

                                    {previewPost.excerpt && (
                                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                                            {previewPost.excerpt}
                                        </Typography>
                                    )}

                                    <Box sx={{ borderTop: '1px solid #e5e7eb', pt: 3 }}>
                                        <Box
                                            sx={{
                                                color: '#1f2937',
                                                lineHeight: 1.8,
                                                '& p': { mb: 2 },
                                                '& img': { maxWidth: '100%', borderRadius: 2 },
                                                '& blockquote': {
                                                    borderLeft: '4px solid #667eea',
                                                    m: '16px 0',
                                                    pl: 2,
                                                    color: 'text.secondary',
                                                },
                                            }}
                                            dangerouslySetInnerHTML={{ __html: previewPost.content || '<p>No content available.</p>' }}
                                        />
                                    </Box>

                                    {previewPost.tags && previewPost.tags.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
                                            {previewPost.tags.map((tag) => (
                                                <Chip key={tag} label={`#${tag}`} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePreview}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    className="post-dialog"
                    sx={{
                        zIndex: 1601,
                        '& .MuiDialog-paper': {
                            mt: { xs: 10, sm: 12 },
                            mb: 3,
                            maxHeight: 'calc(100% - 120px)',
                        },
                    }}
                >
                    <DialogTitle className="blog-dialog-title">
                        Edit Blog Post
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Post Title"
                                    value={postForm.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    margin="normal"
                                    required
                                    helperText="SEO Tip: 50-60 characters recommended"
                                />

                                <TextField
                                    fullWidth
                                    label="Slug"
                                    value={postForm.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    margin="normal"
                                    helperText="URL-friendly version of the title"
                                />

                                <TextField
                                    fullWidth
                                    label="Excerpt"
                                    value={postForm.excerpt}
                                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    helperText="Brief summary for preview (120-160 characters)"
                                />

                                <TextField
                                    fullWidth
                                    label="Content"
                                    value={postForm.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={10}
                                    placeholder="Start writing your blog post here..."
                                />

                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={postForm.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    margin="normal"
                                    helperText="Optional: Add location for the post"
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper className="sidebar-paper" elevation={1}>
                                    <Box className="sidebar-section">
                                        <Typography variant="subtitle2" gutterBottom>
                                            Featured Image
                                        </Typography>
                                        <Box className="image-preview-large">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Featured"
                                                    className="preview-image"
                                                />
                                            ) : (
                                                <Box className="no-image">
                                                    <ImageIcon sx={{ fontSize: 48, color: 'gray' }} />
                                                    <Typography variant="caption">No image selected</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            size="small"
                                            startIcon={<ImageIcon />}
                                            className="upload-button"
                                            sx={{ mt: 1 }}
                                        >
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                    </Box>

                                    <Box className="sidebar-section">
                                        <Typography variant="subtitle2" gutterBottom>
                                            Status & Schedule
                                        </Typography>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={postForm.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                label="Status"
                                                MenuProps={editSelectMenuProps}
                                            >
                                                <MenuItem value="draft">Draft</MenuItem>
                                                <MenuItem value="pending">Pending</MenuItem>
                                                <MenuItem value="published">Published</MenuItem>
                                                <MenuItem value="scheduled">Scheduled</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {postForm.status === 'scheduled' && (
                                            <DatePicker
                                                label="Schedule Date"
                                                value={postForm.scheduled_date}
                                                onChange={(date) => handleInputChange('scheduled_date', date)}
                                                slotProps={editDatePickerSlotProps}
                                            />
                                        )}

                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                value={postForm.category_id}
                                                onChange={(e) => handleInputChange('category_id', e.target.value)}
                                                label="Category"
                                                MenuProps={editSelectMenuProps}
                                            >
                                                {categories.map((cat) => (
                                                    <MenuItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            label="Read Time"
                                            value={postForm.read_time}
                                            onChange={(e) => handleInputChange('read_time', e.target.value)}
                                            margin="dense"
                                            placeholder="e.g., 5 min read"
                                        />
                                    </Box>

                                    <Box className="sidebar-section">
                                        <Typography variant="subtitle2" gutterBottom>
                                            Tags
                                        </Typography>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Select Tags</InputLabel>
                                            <Select
                                                multiple
                                                value={postForm.tags}
                                                onChange={(e) => handleInputChange('tags', e.target.value)}
                                                label="Select Tags"
                                                MenuProps={editSelectMenuProps}
                                                renderValue={(selected) => (
                                                    <Box className="selected-tags">
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {allTags.map((tag) => (
                                                    <MenuItem key={tag} value={tag}>
                                                        {tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box className="sidebar-section">
                                        <Typography variant="subtitle2" gutterBottom>
                                            SEO & Settings
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Meta Title"
                                            value={postForm.meta_title}
                                            onChange={(e) => handleInputChange('meta_title', e.target.value)}
                                            margin="dense"
                                            size="small"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Meta Description"
                                            value={postForm.meta_description}
                                            onChange={(e) => handleInputChange('meta_description', e.target.value)}
                                            margin="dense"
                                            multiline
                                            rows={2}
                                            size="small"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={postForm.is_featured}
                                                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                                                    color="warning"
                                                />
                                            }
                                            label="Feature this post"
                                        />

                                        <Box className="seo-score-display">
                                            <Typography variant="subtitle2">
                                                SEO Score: {calculateSeoScore(postForm)}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={calculateSeoScore(postForm)}
                                                className="seo-progress"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            onClick={handleSavePost}
                            variant="contained"
                            disabled={loading}
                            startIcon={<Save />}
                            className="save-button"
                        >
                            {loading ? 'Saving...' : 'Update Post'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCancelDelete}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="div">
                            Confirm Delete
                        </Typography>
                        <IconButton onClick={handleCancelDelete} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box className="delete-dialog-content" sx={{ py: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Are you sure you want to delete this blog post?
                            </Typography>
                            <Typography variant="h6" color="error" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                                "{postToDelete?.title}"
                            </Typography>
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    This action cannot be undone. All associated data including comments, likes, and tags will be permanently removed.
                                </Typography>
                            </Alert>
                            {postToDelete && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Typography variant="caption" color="textSecondary" component="div">
                                        <strong>Post ID:</strong> {postToDelete.id}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" component="div">
                                        <strong>Status:</strong> {postToDelete.status}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" component="div">
                                        <strong>Created:</strong> {new Date(postToDelete.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button
                            onClick={handleCancelDelete}
                            variant="outlined"
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            variant="contained"
                            color="error"
                            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                            disabled={deleteLoading}
                            sx={{ minWidth: 120 }}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* This is the comment dialog */}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default BlogPostManagement;
