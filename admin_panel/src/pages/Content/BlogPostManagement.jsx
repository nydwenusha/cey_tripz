import React, { useState, useEffect } from 'react';
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
    Badge
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
    Add,
    Save
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './BlogPostManagement.scss';
import MainLayout from '../../MainLayout';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=200&fit=crop'
];

const BlogPostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [categories, setCategories] = useState(['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Food', 'Fashion', 'Sports']);
    const [tags, setTags] = useState(['React', 'JavaScript', 'Web Development', 'MUI', 'CSS', 'Design', 'SEO', 'Marketing', 'AI', 'Mobile']);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create');

    const [postForm, setPostForm] = useState({
        id: '',
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: '',
        tags: [],
        author: 'Admin User',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        status: 'draft',
        featuredImage: SAMPLE_IMAGES[0],
        publishedDate: new Date(),
        scheduledDate: null,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        seoScore: 0,
        views: 0,
        comments: 0,
        likes: 0
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [imagePreview, setImagePreview] = useState(SAMPLE_IMAGES[0]);

    const statsData = [
        {
            title: 'Total Posts',
            value: 0,
            icon: <PublishIcon />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Published',
            value: 0,
            icon: <ViewIcon />,
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            change: '+8%',
            trend: 'up'
        },
        {
            title: 'Drafts',
            value: 0,
            icon: <EditIcon />,
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            change: '-3%',
            trend: 'down'
        },
        {
            title: 'Scheduled',
            value: 0,
            icon: <ScheduleIcon />,
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            change: '+15%',
            trend: 'up'
        },
        {
            title: 'Total Views',
            value: 0,
            icon: <EyeIcon />,
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            change: '+24%',
            trend: 'up'
        },
        {
            title: 'Comments',
            value: 0,
            icon: <CommentIcon />,
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            change: '+18%',
            trend: 'up'
        }
    ];

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        filterAndSortPosts();
        updateStats();
    }, [posts, searchQuery, statusFilter, categoryFilter, sortBy]);

    const fetchInitialData = () => {
        setLoading(true);
        setTimeout(() => {
            const mockPosts = Array.from({ length: 35 }, (_, i) => ({
                id: `post-${i + 1}`,
                title: `The Future of ${['AI', 'Web Dev', 'Technology', 'Business', 'Health'][i % 5]} in 2024`,
                slug: `future-of-${['ai', 'web-dev', 'technology', 'business', 'health'][i % 5]}-2024`,
                excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                category: categories[i % categories.length],
                tags: [tags[i % tags.length], tags[(i + 1) % tags.length], tags[(i + 2) % tags.length]],
                author: 'Admin User',
                authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                status: i % 4 === 0 ? 'published' : i % 4 === 1 ? 'draft' : i % 4 === 2 ? 'scheduled' : 'published',
                featuredImage: SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],
                publishedDate: new Date(Date.now() - i * 86400000),
                scheduledDate: i % 4 === 2 ? new Date(Date.now() + (i + 1) * 86400000) : null,
                views: Math.floor(Math.random() * 10000),
                comments: Math.floor(Math.random() * 150),
                likes: Math.floor(Math.random() * 500),
                isFeatured: i % 7 === 0,
                seoScore: Math.floor(Math.random() * 100),
                readTime: `${Math.floor(Math.random() * 10) + 5} min`
            }));
            setPosts(mockPosts);
            setLoading(false);
        }, 1000);
    };

    const updateStats = () => {
        const newStats = [...statsData];
        newStats[0].value = posts.length;
        newStats[1].value = posts.filter(p => p.status === 'published').length;
        newStats[2].value = posts.filter(p => p.status === 'draft').length;
        newStats[3].value = posts.filter(p => p.status === 'scheduled').length;
        newStats[4].value = posts.reduce((sum, post) => sum + post.views, 0);
        newStats[5].value = posts.reduce((sum, post) => sum + post.comments, 0);
    };

    const filterAndSortPosts = () => {
        let filtered = [...posts];

        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(post => post.status === statusFilter);
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(post => post.category === categoryFilter);
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                case 'oldest':
                    return new Date(a.publishedDate) - new Date(b.publishedDate);
                case 'views':
                    return b.views - a.views;
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'likes':
                    return b.likes - a.likes;
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
    };

    const handleOpenDialog = (mode = 'create', post = null) => {
        setDialogMode(mode);
        if (mode === 'edit' && post) {
            setPostForm({ ...post });
            setImagePreview(post.featuredImage);
        } else {
            const newId = `post-${posts.length + 1}`;
            setPostForm({
                id: newId,
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                category: '',
                tags: [],
                author: 'Admin User',
                authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                status: 'draft',
                featuredImage: SAMPLE_IMAGES[0],
                publishedDate: new Date(),
                scheduledDate: null,
                isFeatured: false,
                metaTitle: '',
                metaDescription: '',
                seoScore: 0,
                views: 0,
                comments: 0,
                likes: 0
            });
            setImagePreview(SAMPLE_IMAGES[0]);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSavePost = () => {
        setLoading(true);

        setTimeout(() => {
            if (dialogMode === 'create') {
                const newPost = {
                    ...postForm,
                    views: 0,
                    comments: 0,
                    likes: 0,
                    seoScore: calculateSeoScore(postForm),
                    readTime: `${Math.floor(Math.random() * 10) + 5} min`
                };
                setPosts([newPost, ...posts]);
                showSnackbar('Blog post created successfully!', 'success');
            } else {
                const updatedPosts = posts.map(post =>
                    post.id === postForm.id ? { ...postForm, seoScore: calculateSeoScore(postForm) } : post
                );
                setPosts(updatedPosts);
                showSnackbar('Blog post updated successfully!', 'success');
            }

            setLoading(false);
            handleCloseDialog();
        }, 500);
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
        setOpenDeleteDialog(false);
        showSnackbar('Blog post deleted successfully!', 'success');
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
                setPostForm(prev => ({ ...prev, featuredImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateSeoScore = (post) => {
        let score = 0;
        if (post.title && post.title.length >= 50 && post.title.length <= 60) score += 25;
        if (post.metaDescription && post.metaDescription.length >= 120 && post.metaDescription.length <= 160) score += 25;
        if (post.content && post.content.length > 300) score += 25;
        if (post.tags && post.tags.length >= 3) score += 25;
        return score;
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'success';
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
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box className="blog-management">
                    {/* Header */}
                    <PageHeader
                        title="Blog Post Management"
                        subtitle="Create, edit, and manage all your blog posts in one place."
                        primaryAction={{
                            label: 'Add Blog',
                            onClick: () => navigate('/AddBlogs'),
                            icon: <AddIcon />
                        }}
                        secondaryActions={[
                            {
                                label: 'Print All',
                                
                                icon: <Print />
                            },
                            {
                                label: 'Email All',
                               
                                icon: <Email />
                            }
                        ]}
                        variant="gradient"
                    />
                    
                    

                    {/* Stats Cards - FIXED VERSION */}
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
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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

                    {/* Bulk Actions */}
                    <Box className="bulk-actions">
                        <FormControl variant="outlined" size="small" className="bulk-select">
                            <InputLabel>Bulk Actions</InputLabel>
                            <Select
                                label="Bulk Actions"
                                defaultValue=""
                            >
                                <MenuItem value="">Select Action</MenuItem>
                                <MenuItem value="publish">Publish</MenuItem>
                                <MenuItem value="draft">Move to Draft</MenuItem>
                                <MenuItem value="feature">Feature</MenuItem>
                                <MenuItem value="delete">Delete</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Posts Table with Images */}
                    {loading ? (
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
                                        {paginatedPosts.map((post) => (
                                            <TableRow key={post.id} className={post.isFeatured ? 'featured-post' : ''}>
                                                <TableCell>
                                                    <Box className="post-image-container">
                                                        <Avatar
                                                            variant="rounded"
                                                            src={post.featuredImage}
                                                            alt={post.title}
                                                            className="post-image"
                                                            sx={{ width: 80, height: 60 }}
                                                        >
                                                            <ImageIcon />
                                                        </Avatar>
                                                        {post.isFeatured && (
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
                                                            {post.excerpt.substring(0, 120)}...
                                                        </Typography>
                                                        <Box className="post-meta">
                                                            <Box className="author-info">
                                                                <Avatar
                                                                    src={post.authorAvatar}
                                                                    sx={{ width: 24, height: 24, mr: 1 }}
                                                                />
                                                                <Typography variant="caption">
                                                                    {post.author} • {new Date(post.publishedDate).toLocaleDateString()} • {post.readTime}
                                                                </Typography>
                                                            </Box>
                                                            <Box className="post-tags">
                                                                {post.tags.slice(0, 2).map((tag) => (
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
                                                                {formatNumber(post.views)}
                                                            </Typography>
                                                        </Box>
                                                        <Box className="stat-item">
                                                            <CommentIcon fontSize="small" color="action" />
                                                            <Typography variant="body2" className="stat-value">
                                                                {post.comments}
                                                            </Typography>
                                                        </Box>
                                                        <Box className="stat-item">
                                                            <StarIcon fontSize="small" color="action" />
                                                            <Typography variant="body2" className="stat-value">
                                                                {formatNumber(post.likes)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Box className="seo-score">
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={post.seoScore}
                                                            className={`seo-progress seo-${Math.floor(post.seoScore / 25)}`}
                                                        />
                                                        <Box className="seo-info">
                                                            <Typography variant="body2" className="seo-value">
                                                                {post.seoScore}%
                                                            </Typography>
                                                            {post.seoScore >= 75 && (
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
                                                            <IconButton size="small" className="action-btn view-btn">
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                className="action-btn edit-btn"
                                                                onClick={() => handleOpenDialog('edit', post)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                className="action-btn delete-btn"
                                                                onClick={() => {
                                                                    setPostForm(post);
                                                                    setOpenDeleteDialog(true);
                                                                }}
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

                    {/* Create/Edit Dialog */}
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        maxWidth="md"
                        fullWidth
                        className="post-dialog"
                    >
                        <DialogTitle>
                            {dialogMode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
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
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Paper className="sidebar-paper" elevation={1}>
                                        <Box className="sidebar-section">
                                            <Typography variant="subtitle2" gutterBottom>
                                                Featured Image
                                            </Typography>
                                            <Box className="image-preview-large">
                                                <img
                                                    src={imagePreview}
                                                    alt="Featured"
                                                    className="preview-image"
                                                />
                                            </Box>
                                            <Box className="image-options">
                                                <Typography variant="caption" color="textSecondary" gutterBottom>
                                                    Choose from sample images:
                                                </Typography>
                                                <Box className="sample-images">
                                                    {SAMPLE_IMAGES.slice(0, 6).map((img, index) => (
                                                        <Avatar
                                                            key={index}
                                                            src={img}
                                                            variant="rounded"
                                                            className={`sample-image ${imagePreview === img ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setImagePreview(img);
                                                                handleInputChange('featuredImage', img);
                                                            }}
                                                            sx={{ width: 60, height: 40, cursor: 'pointer' }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    fullWidth
                                                    size="small"
                                                    startIcon={<ImageIcon />}
                                                    className="upload-button"
                                                >
                                                    Upload Custom
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </Button>
                                            </Box>
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
                                                >
                                                    <MenuItem value="draft">Draft</MenuItem>
                                                    <MenuItem value="published">Published</MenuItem>
                                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                                </Select>
                                            </FormControl>

                                            {postForm.status === 'scheduled' && (
                                                <DatePicker
                                                    label="Schedule Date"
                                                    value={postForm.scheduledDate}
                                                    onChange={(date) => handleInputChange('scheduledDate', date)}
                                                    renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                                                />
                                            )}

                                            <FormControl fullWidth margin="dense">
                                                <InputLabel>Category</InputLabel>
                                                <Select
                                                    value={postForm.category}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    label="Category"
                                                >
                                                    {categories.map((cat) => (
                                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
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
                                                    renderValue={(selected) => (
                                                        <Box className="selected-tags">
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} size="small" />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >
                                                    {tags.map((tag) => (
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
                                                value={postForm.metaTitle}
                                                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                                                margin="dense"
                                                size="small"
                                            />
                                            <TextField
                                                fullWidth
                                                label="Meta Description"
                                                value={postForm.metaDescription}
                                                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                                                margin="dense"
                                                multiline
                                                rows={2}
                                                size="small"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={postForm.isFeatured}
                                                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
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
                                startIcon={dialogMode === 'create' ? <AddIcon /> : <PublishIcon />}
                                className="save-button"
                            >
                                {loading ? 'Saving...' : dialogMode === 'create' ? 'Create Post' : 'Update Post'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                    >
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Box className="delete-dialog-content">
                                <Typography variant="body1" gutterBottom>
                                    Are you sure you want to delete this post?
                                </Typography>
                                <Typography variant="h6" color="error" gutterBottom>
                                    "{postForm.title}"
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    This action cannot be undone. All associated data will be permanently removed.
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                            <Button
                                onClick={() => handleDeletePost(postForm.id)}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                            >
                                Delete Permanently
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} elevation={6}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </LocalizationProvider>
       
    );
};

export default BlogPostManagement;