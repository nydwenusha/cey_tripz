import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import './Categories.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { Download, Email, Print } from '@mui/icons-material';

const Categories = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [featureFilter, setFeatureFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: 1, name: 'Adventure', description: 'Thrilling outdoor activities', tours: 24, status: 'active', featured: true },
        { id: 2, name: 'Beach', description: 'Relaxing coastal getaways', tours: 18, status: 'active', featured: true },
        { id: 3, name: 'Cultural', description: 'Historical and cultural experiences', tours: 32, status: 'active', featured: true },
        { id: 4, name: 'Wildlife', description: 'Animal encounters and safaris', tours: 15, status: 'active', featured: true },
        { id: 5, name: 'Historical', description: 'Ancient sites and monuments', tours: 21, status: 'active', featured: false },
        { id: 6, name: 'Mountain', description: 'High altitude adventures', tours: 12, status: 'inactive', featured: false },
        { id: 7, name: 'Cruise', description: 'Ocean and river cruises', tours: 8, status: 'active', featured: false },
        { id: 8, name: 'Wellness', description: 'Spa and health retreats', tours: 14, status: 'inactive', featured: false },
    ];

    const stats = {
        totalCategories: 8,
        totalTours: 144,
        activeCategories: 7,
        featuredCategories: 4,
    };

    const filteredCategories = categories.filter(category => {
        if (statusFilter !== 'all' && category.status !== statusFilter) return false;

        if (featureFilter !== 'all') {
            if (featureFilter === 'featured' && !category.featured) return false;
            if (featureFilter === 'regular' && category.featured) return false;
        }

        if (searchQuery && !category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !category.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const handleMenuOpen = (event, category) => {
        setMenuAnchor(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedCategory(null);
    };

    const handleAction = (action) => {
        console.log(`${action} category:`, selectedCategory);
        handleMenuClose();
    };

    return (
        <MainLayout>
            <Box className="categories-container">
                {/* Header with Add Button */}
                <PageHeader
                    title="Categories"
                    subtitle="Manage your tour categories"
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

                {/* Stats Section */}
                <Box className="stats-section">
                    <Grid container spacing={2} className="stats-grid">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card">
                                <CardContent>
                                    <Typography variant="h4" className="stat-number">
                                        {stats.totalCategories}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Total Categories
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card">
                                <CardContent>
                                    <Typography variant="h4" className="stat-number">
                                        {stats.totalTours}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Total Tours
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card">
                                <CardContent>
                                    <Typography variant="h4" className="stat-number">
                                        {stats.activeCategories}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Active Categories
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card">
                                <CardContent>
                                    <Typography variant="h4" className="stat-number">
                                        {stats.featuredCategories}
                                    </Typography>
                                    <Typography variant="body2" className="stat-label">
                                        Featured Categories
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Filters and Search Section */}
                <Box className="filters-section">
                    <Box className="search-container">
                        <SearchIcon className="search-icon" />
                        <TextField
                            placeholder="Search categories..."
                            variant="outlined"
                            size="small"
                            className="search-field"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                        />
                        <IconButton className="filter-button">
                            <FilterListIcon />
                        </IconButton>
                    </Box>

                    <Box className="filter-toggles">
                        <ToggleButtonGroup
                            value={statusFilter}
                            exclusive
                            onChange={(e, value) => setStatusFilter(value || 'all')}
                            size="small"
                            className="toggle-group"
                        >
                            <ToggleButton value="all" className="toggle-button">All</ToggleButton>
                            <ToggleButton value="active" className="toggle-button">Active</ToggleButton>
                            <ToggleButton value="inactive" className="toggle-button">Inactive</ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            value={featureFilter}
                            exclusive
                            onChange={(e, value) => setFeatureFilter(value || 'all')}
                            size="small"
                            className="toggle-group"
                        >
                            <ToggleButton value="all" className="toggle-button">All</ToggleButton>
                            <ToggleButton value="featured" className="toggle-button">Featured</ToggleButton>
                            <ToggleButton value="regular" className="toggle-button">Regular</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                {/* Categories Grid - Fixed width boxes */}
                <Box className="categories-grid-wrapper">
                    <Grid container spacing={3} className="categories-grid">
                        {filteredCategories.map((category) => (
                            <Grid item key={category.id} className="category-grid-item">
                                <Card className="category-card">
                                    <CardContent>
                                        <Box className="category-header">
                                            <Box className="category-title-section">
                                                <Typography variant="h6" className="category-name">
                                                    {category.name}
                                                </Typography>
                                                <Box className="status-indicator">
                                                    {category.status === 'active' ? (
                                                        <Chip
                                                            label="Active"
                                                            size="small"
                                                            className="status-chip active"
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label="Inactive"
                                                            size="small"
                                                            className="status-chip inactive"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                className="more-button"
                                                onClick={(e) => handleMenuOpen(e, category)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>

                                        <Typography variant="body2" className="category-description">
                                            {category.description}
                                        </Typography>

                                        <Box className="category-footer">
                                            <Typography variant="body1" className="tour-count">
                                                {category.tours} tours
                                            </Typography>
                                            <Box className="badges">
                                                {category.featured && (
                                                    <Chip
                                                        label="Featured"
                                                        size="small"
                                                        className="featured-chip"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Action Menu */}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    className="action-menu"
                >
                    <MenuItem onClick={() => handleAction('view')} className="menu-item">
                        <VisibilityIcon fontSize="small" />
                        View Details
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('edit')} className="menu-item">
                        <EditIcon fontSize="small" />
                        Edit Category
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('toggle')} className="menu-item">
                        <ArchiveIcon fontSize="small" />
                        {selectedCategory?.status === 'active' ? 'Deactivate' : 'Activate'}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleAction('delete')} className="menu-item delete">
                        <DeleteIcon fontSize="small" />
                        Delete Category
                    </MenuItem>
                </Menu>
            </Box>
        </MainLayout>
    );
};

export default Categories;