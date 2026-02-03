import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Paper,
    TextField,
    Button,
    IconButton,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    InputAdornment,
    Tooltip,
    LinearProgress,
    Switch,
    FormControlLabel,
    Divider
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Search,
    Category,
    Star,
    TrendingUp,
    CheckCircle,
    Cancel,
    FilterList,
    Refresh,
    Landscape,
    BeachAccess,
    TempleBuddhist,
    Pets,
    History,
    Spa,
    FamilyRestroom,
    Diamond,
    Download,
    Print,
    Email
} from '@mui/icons-material';
import './Categories.scss';

import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader.jsx';
import '../../components/layout/PageHeader/PageHeader.scss';

const Categories = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Adventure', description: 'Thrilling outdoor activities', tourCount: 24, status: 'Active', featured: true, color: '#1976d2', icon: <Landscape /> },
        { id: 2, name: 'Beach', description: 'Relaxing coastal getaways', tourCount: 18, status: 'Active', featured: true, color: '#2196F3', icon: <BeachAccess /> },
        { id: 3, name: 'Cultural', description: 'Historical and cultural experiences', tourCount: 32, status: 'Active', featured: true, color: '#1976d2', icon: <TempleBuddhist /> },
        { id: 4, name: 'Wildlife', description: 'Animal encounters and safaris', tourCount: 15, status: 'Active', featured: false, color: '#1976d2', icon: <Pets /> },
        { id: 5, name: 'Historical', description: 'Ancient sites and monuments', tourCount: 21, status: 'Active', featured: false, color: '#1976d2', icon: <History /> },
        { id: 6, name: 'Wellness', description: 'Health and relaxation retreats', tourCount: 12, status: 'Inactive', featured: false, color: '#1976d2', icon: <Spa /> },
        { id: 7, name: 'Family', description: 'Kid-friendly activities', tourCount: 8, status: 'Active', featured: false, color: '#1976d2', icon: <FamilyRestroom /> },
        { id: 8, name: 'Luxury', description: 'Premium and exclusive experiences', tourCount: 14, status: 'Active', featured: true, color: '#1976d2', icon: <Diamond /> },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [featuredFilter, setFeaturedFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#1976d2', icon: 'category' });

    const iconOptions = [
        { value: 'category', icon: <Category />, label: 'Category' },
        { value: 'landscape', icon: <Landscape />, label: 'Landscape' },
        { value: 'beach', icon: <BeachAccess />, label: 'Beach' },
        { value: 'temple', icon: <TempleBuddhist />, label: 'Temple' },
        { value: 'pets', icon: <Pets />, label: 'Wildlife' },
        { value: 'history', icon: <History />, label: 'History' },
        { value: 'spa', icon: <Spa />, label: 'Wellness' },
        { value: 'family', icon: <FamilyRestroom />, label: 'Family' },
        { value: 'diamond', icon: <Diamond />, label: 'Luxury' },
        { value: 'star', icon: <Star />, label: 'Star' },
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    const handleFeaturedFilter = (featured) => {
        setFeaturedFilter(featured);
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
        showSnackbar(`Category "${categoryToDelete.name}" deleted`, 'success');
    };

    const handleEditClick = (category) => {
        setCurrentCategory({ ...category });
        setEditDialogOpen(true);
    };

    const handleSaveCategory = () => {
        if (currentCategory) {
            // Update existing category
            setCategories(categories.map(cat =>
                cat.id === currentCategory.id ? currentCategory : cat
            ));
            showSnackbar(`Category "${currentCategory.name}" updated`, 'success');
        } else {
            // Add new category
            const newCat = {
                ...newCategory,
                id: categories.length + 1,
                tourCount: 0,
                status: 'Active',
                featured: false
            };
            setCategories([...categories, newCat]);
            setNewCategory({ name: '', description: '', color: '#1976d2', icon: 'category' });
            showSnackbar(`Category "${newCat.name}" added`, 'success');
        }
        setEditDialogOpen(false);
        setCurrentCategory(null);
    };

    const handleToggleStatus = (id) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' } : cat
        ));
    };

    const handleToggleFeatured = (id) => {
        setCategories(categories.map(cat =>
            cat.id === id ? { ...cat, featured: !cat.featured } : cat
        ));
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleNewCategory = () => {
        setCurrentCategory(null);
        setNewCategory({ name: '', description: '', color: '#1976d2', icon: 'category' });
        setEditDialogOpen(true);
    };

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
        const matchesFeatured = featuredFilter === 'all' ||
            (featuredFilter === 'featured' ? category.featured : !category.featured);
        return matchesSearch && matchesStatus && matchesFeatured;
    });

    const getStatusChip = (status) => {
        return status === 'Active' ?
            <Chip label="Active" color="success" size="small" icon={<CheckCircle />} /> :
            <Chip label="Inactive" color="error" size="small" icon={<Cancel />} />;
    };

    const getIconComponent = (iconName) => {
        const icon = iconOptions.find(opt => opt.value === iconName);
        return icon ? icon.icon : <Category />;
    };

    const totalTours = categories.reduce((sum, cat) => sum + cat.tourCount, 0);
    const activeCategories = categories.filter(cat => cat.status === 'Active').length;
    const featuredCategories = categories.filter(cat => cat.featured).length;

    return (
        <MainLayout>
            <Box className="categories-container">
                {/* Header */}
                <PageHeader
                    title="Tour Categories"
                    subtitle="Manage your all categories in one place."
                    primaryAction={{
                        label: 'Export',
                        onClick: () => handleExport(),
                        icon: <Download />
                    }}
                    secondaryActions={[
                        {
                            label: 'Print All',
                            onClick: () => handlePrintAll(),
                            icon: <Print />
                        },
                        {
                            label: 'Email All',
                            onClick: () => handleEmailAll(),
                            icon: <Email />
                        }
                    ]}
                    variant="gradient"
                />

             

                {/* Stats */}
                <Grid container spacing={2} className="stats-grid">
                    <Grid item xs={12} sm={6} md={3} className="stat-item">
                        <Paper className="stat-card">
                            <Box className="stat-content">
                                <Typography variant="h6" className="stat-number">
                                    {categories.length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-label">
                                    Total Categories
                                </Typography>
                            </Box>
                            <Category className="stat-icon" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} className="stat-item">
                        <Paper className="stat-card">
                            <Box className="stat-content">
                                <Typography variant="h6" className="stat-number">
                                    {totalTours}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-label">
                                    Total Tours
                                </Typography>
                            </Box>
                            <TrendingUp className="stat-icon" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} className="stat-item">
                        <Paper className="stat-card">
                            <Box className="stat-content">
                                <Typography variant="h6" className="stat-number">
                                    {activeCategories}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-label">
                                    Active Categories
                                </Typography>
                            </Box>
                            <CheckCircle className="stat-icon" />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} className="stat-item">
                        <Paper className="stat-card">
                            <Box className="stat-content">
                                <Typography variant="h6" className="stat-number">
                                    {featuredCategories}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-label">
                                    Featured Categories
                                </Typography>
                            </Box>
                            <Star className="stat-icon" />
                        </Paper>
                    </Grid>
                </Grid>

                {/* Filters */}
                <Paper className="filters-paper">
                    <Box className="filters-content">
                        <TextField
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            className="search-field"
                            size="small"
                        />
                        <Box className="filter-buttons">
                            <Chip
                                label="All"
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
                        </Box>
                        <Box className="filter-buttons">
                            <Chip
                                label="All"
                                onClick={() => handleFeaturedFilter('all')}
                                color={featuredFilter === 'all' ? 'primary' : 'default'}
                                variant="outlined"
                            />
                            <Chip
                                label="Featured"
                                onClick={() => handleFeaturedFilter('featured')}
                                color={featuredFilter === 'featured' ? 'warning' : 'default'}
                                variant="outlined"
                            />
                            <Chip
                                label="Regular"
                                onClick={() => handleFeaturedFilter('regular')}
                                color={featuredFilter === 'regular' ? 'default' : 'default'}
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Categories Grid */}
                <Grid container spacing={2} className="categories-grid">
                    {filteredCategories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                            <Paper className="category-card" style={{ borderTop: `4px solid ${category.color}` }}>
                                <Box className="category-header">
                                    <Box className="category-icon" style={{ backgroundColor: `${category.color}20` }}>
                                        {getIconComponent(category.icon)}
                                    </Box>
                                    <Box className="category-actions">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => handleEditClick(category)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => handleDeleteClick(category)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                <Box className="category-content">
                                    <Typography variant="h6" className="category-name">
                                        {category.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" className="category-description">
                                        {category.description}
                                    </Typography>

                                    <Box className="category-stats">
                                        <Typography variant="caption" className="tour-count">
                                            {category.tourCount} tours
                                        </Typography>
                                        {getStatusChip(category.status)}
                                    </Box>

                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min((category.tourCount / 50) * 100, 100)}
                                        className="tour-progress"
                                        style={{ backgroundColor: `${category.color}20` }}
                                        sx={{ '& .MuiLinearProgress-bar': { backgroundColor: category.color } }}
                                    />
                                </Box>

                                <Divider />

                                <Box className="category-footer">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={category.status === 'Active'}
                                                onChange={() => handleToggleStatus(category.id)}
                                                size="small"
                                                color="success"
                                            />
                                        }
                                        label={category.status}
                                    />
                                    <Tooltip title={category.featured ? "Featured" : "Make Featured"}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleToggleFeatured(category.id)}
                                            className={category.featured ? 'featured-active' : ''}
                                        >
                                            <Star fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Edit/Add Dialog */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {currentCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogContent>
                        <Box className="edit-form">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Category Name"
                                        value={currentCategory ? currentCategory.name : newCategory.name}
                                        onChange={(e) => currentCategory ?
                                            setCurrentCategory({ ...currentCategory, name: e.target.value }) :
                                            setNewCategory({ ...newCategory, name: e.target.value })
                                        }
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        rows={3}
                                        value={currentCategory ? currentCategory.description : newCategory.description}
                                        onChange={(e) => currentCategory ?
                                            setCurrentCategory({ ...currentCategory, description: e.target.value }) :
                                            setNewCategory({ ...newCategory, description: e.target.value })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" gutterBottom>Icon</Typography>
                                    <Box className="icon-palette">
                                        {iconOptions.map((option) => (
                                            <Tooltip key={option.value} title={option.label}>
                                                <Box
                                                    className={`icon-option ${(currentCategory?.icon === option.value || newCategory.icon === option.value) ? 'selected' : ''}`}
                                                    onClick={() => currentCategory ?
                                                        setCurrentCategory({ ...currentCategory, icon: option.value }) :
                                                        setNewCategory({ ...newCategory, icon: option.value })
                                                    }
                                                >
                                                    {option.icon}
                                                </Box>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveCategory} variant="contained" className="save-button">
                            {currentCategory ? 'Update Category' : 'Add Category'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete "{categoryToDelete?.name}"?
                            {categoryToDelete?.tourCount > 0 && ` This category has ${categoryToDelete.tourCount} tours.`}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </MainLayout>
    );
};

export default Categories;