// Vehicles.jsx
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Rating,
    Badge,
    Tabs,
    Tab,
    Avatar,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Star as StarIcon,
    LocalOffer as FeaturedIcon,
    Bookmark as BookmarkIcon,
    DirectionsCar as CarIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    PhotoCamera as CameraIcon,
    AddPhotoAlternate as AddPhotoIcon,
    DeleteForever as DeletePhotoIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
    ZoomIn as ZoomInIcon,
    LocalGasStation as FuelIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import './Vehicles.scss';
import MainLayout from './../../MainLayout';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// Import multiple vehicle images for each car
const vehicleImageGalleries = {
    wagonR: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
    ],
    alto: [
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
    ],
    prius: [
        'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop'
    ],
    civic: [
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
    ],
    montero: [
        'https://images.unsplash.com/photo-1563720223484-21c6c2d3c8c0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop'
    ]
};

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([
        {
            id: 1,
            name: "Suzuki Wagon R Stingray",
            type: "HATCHBACK",
            description: "Compact, fuel-efficient and perfect for city trips and solo travel.",
            status: "active",
            category: "hatchback",
            price: "$45/day",
            revenue: "$12,500",
            rating: 4.6,
            totalBookings: 28,
            featured: true,
            tags: ["Compact", "Fuel Efficient", "City", "Automatic"],
            capacity: "4 persons",
            duration: "Daily rental",
            images: vehicleImageGalleries.wagonR,
            fuelType: "Petrol",
            transmission: "Automatic",
            year: "2023",
            color: "Silver Metallic",
            mileage: "25 km/l",
            engine: "998 cc"
        },
        {
            id: 2,
            name: "Suzuki Alto",
            type: "MINI CAR",
            description: "Comfort and class combined — best for couples and business trips.",
            status: "active",
            category: "mini",
            price: "$35/day",
            revenue: "$8,900",
            rating: 4.4,
            totalBookings: 25,
            featured: false,
            tags: ["Comfort", "Business", "Couples", "Manual"],
            capacity: "4 persons",
            duration: "Daily rental",
            images: vehicleImageGalleries.alto,
            fuelType: "Petrol",
            transmission: "Manual",
            year: "2022",
            color: "Pearl White",
            mileage: "22 km/l",
            engine: "796 cc"
        },
        {
            id: 3,
            name: "Toyota Prius Hybrid",
            type: "HYBRID",
            description: "Eco-friendly hybrid with excellent fuel economy for long trips.",
            status: "active",
            category: "hybrid",
            price: "$60/day",
            revenue: "$15,300",
            rating: 4.8,
            totalBookings: 32,
            featured: true,
            tags: ["Eco-friendly", "Hybrid", "Long Trips", "Premium"],
            capacity: "5 persons",
            duration: "Weekly rental",
            images: vehicleImageGalleries.prius,
            fuelType: "Hybrid",
            transmission: "Automatic",
            year: "2023",
            color: "Electric Blue",
            mileage: "30 km/l",
            engine: "1798 cc"
        },
        {
            id: 4,
            name: "Honda Civic Sedan",
            type: "SEDAN",
            description: "Reliable sedan perfect for family trips and comfortable travel.",
            status: "inactive",
            category: "sedan",
            price: "$55/day",
            revenue: "$9,800",
            rating: 4.5,
            totalBookings: 18,
            featured: false,
            tags: ["Family", "Comfortable", "Reliable", "Spacious"],
            capacity: "5 persons",
            duration: "Daily rental",
            images: vehicleImageGalleries.civic,
            fuelType: "Petrol",
            transmission: "Automatic",
            year: "2022",
            color: "Crystal Black",
            mileage: "18 km/l",
            engine: "1799 cc"
        },
        {
            id: 5,
            name: "Mitsubishi Montero Sport",
            type: "SUV",
            description: "Powerful SUV for adventure trips and off-road experiences.",
            status: "active",
            category: "suv",
            price: "$85/day",
            revenue: "$20,100",
            rating: 4.7,
            totalBookings: 42,
            featured: true,
            tags: ["Adventure", "Off-road", "Powerful", "7-Seater"],
            capacity: "7 persons",
            duration: "Weekly rental",
            images: vehicleImageGalleries.montero,
            fuelType: "Diesel",
            transmission: "Automatic",
            year: "2023",
            color: "Jet Black Mica",
            mileage: "12 km/l",
            engine: "2442 cc"
        }
    ]);

    const [activeTab, setActiveTab] = useState(0);
    const [filter, setFilter] = useState('all');
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const navigate = useNavigate();
    const stats = {
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.status === 'active').length,
        totalRevenue: "$66,600",
        avgRating: 4.6,
        featuredVehicles: vehicles.filter(v => v.featured).length,
        totalImages: vehicles.reduce((sum, vehicle) => sum + vehicle.images.length, 0)
    };

    const categories = [
        { label: "All Vehicles", count: vehicles.length, value: 'all', icon: <CarIcon /> },
        { label: "Active", count: vehicles.filter(v => v.status === 'active').length, value: 'active', icon: <ActiveIcon /> },
        { label: "Inactive", count: vehicles.filter(v => v.status === 'inactive').length, value: 'inactive', icon: <InactiveIcon /> },
        { label: "Featured", count: vehicles.filter(v => v.featured).length, value: 'featured', icon: <StarIcon /> }
    ];

    const vehicleTypes = [
        { label: "Hatchback", count: 1, icon: "🚗", color: "#667eea" },
        { label: "SUV", count: 1, icon: "🚙", color: "#4caf50" },
        { label: "Sedan", count: 1, icon: "🚘", color: "#ff9800" },
        { label: "Mini", count: 1, icon: "🚗", color: "#e91e63" },
        { label: "Hybrid", count: 1, icon: "⚡", color: "#2196f3" },
        { label: "Luxury", count: 0, icon: "💎", color: "#9c27b0" },
        { label: "Van", count: 0, icon: "🚐", color: "#795548" },
        { label: "Convertible", count: 0, icon: "🌴", color: "#00bcd4" }
    ];

    const filteredVehicles = filter === 'all'
        ? vehicles
        : filter === 'active'
            ? vehicles.filter(v => v.status === 'active')
            : filter === 'inactive'
                ? vehicles.filter(v => v.status === 'inactive')
                : vehicles.filter(v => v.featured);

    const handleStatusToggle = (id) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === id
                ? { ...vehicle, status: vehicle.status === "active" ? "inactive" : "active" }
                : vehicle
        ));
    };

    const handleFeaturedToggle = (id) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === id
                ? { ...vehicle, featured: !vehicle.featured }
                : vehicle
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenImageDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setMainImageIndex(0);
        setImageDialogOpen(true);
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
        setSelectedVehicle(null);
    };

    const handleAddImage = (vehicleId) => {
        const newImage = prompt("Enter new image URL:");
        if (newImage) {
            setVehicles(vehicles.map(vehicle =>
                vehicle.id === vehicleId
                    ? { ...vehicle, images: [...vehicle.images, newImage] }
                    : vehicle
            ));
        }
    };

    const handleRemoveImage = (vehicleId, imageIndex) => {
        if (window.confirm("Remove this image?")) {
            setVehicles(vehicles.map(vehicle =>
                vehicle.id === vehicleId
                    ? {
                        ...vehicle,
                        images: vehicle.images.filter((_, index) => index !== imageIndex)
                    }
                    : vehicle
            ));
        }
    };

    const nextImage = () => {
        if (selectedVehicle && mainImageIndex < selectedVehicle.images.length - 1) {
            setMainImageIndex(mainImageIndex + 1);
        }
    };

    const prevImage = () => {
        if (selectedVehicle && mainImageIndex > 0) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    const getStatusChip = (status) => (
        <Chip
            icon={status === "active" ? <ActiveIcon /> : <InactiveIcon />}
            label={status.toUpperCase()}
            color={status === "active" ? "success" : "error"}
            size="small"
            variant="outlined"
        />
    );

    const VehicleImageGallery = ({ vehicle, isCompact = false }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const next = () => {
            setCurrentIndex((prev) => (prev + 1) % vehicle.images.length);
        };

        const prev = () => {
            setCurrentIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
        };

        return (

            <Box className={`vehicle-gallery ${isCompact ? 'compact' : ''}`} >
                <Box className="main-image-container">
                    <CardMedia
                        component="img"
                        image={vehicle.images[currentIndex]}
                        alt={`${vehicle.name} - Image ${currentIndex + 1}`}
                        className="main-image"
                        onClick={() => !isCompact && handleOpenImageDialog(vehicle)}
                    />
                    {vehicle.images.length > 1 && (
                        <>
                            <IconButton className="nav-btn prev-btn" onClick={prev}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton className="nav-btn next-btn" onClick={next}>
                                <ChevronRightIcon />
                            </IconButton>
                            <Box className="image-counter">
                                {currentIndex + 1} / {vehicle.images.length}
                            </Box>
                        </>
                    )}
                </Box>

                {!isCompact && vehicle.images.length > 1 && (
                    <Box className="thumbnail-container">
                        {vehicle.images.slice(0, 4).map((img, idx) => (
                            <Box
                                key={idx}
                                className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                            >
                                <CardMedia
                                    component="img"
                                    image={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="thumbnail-image"
                                />
                            </Box>
                        ))}
                        {vehicle.images.length > 4 && (
                            <Box className="thumbnail more-images">
                                +{vehicle.images.length - 4}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>

        );
    };

    return (
        <MainLayout>
            <Box className="vehicles-management">
                {/* Header */}
                <Box className="header-section">
                    <Box>
                        <Typography variant="h4" className="page-title">
                            Vehicle Management
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="page-subtitle">
                            Manage your fleet of vehicles with multiple images, view analytics and handle bookings
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CarIcon />}
                        onClick={() => navigate("/AddVehicles")}
                        className="add-vehicle-btn"
                    >
                        Add New Vehicle
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} className="stats-section">
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card">
                            <CardContent>
                                <Box className="stat-header">
                                    <Box className="stat-icon-wrapper">
                                        <CarIcon className="stat-icon" />
                                    </Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Total Vehicles
                                    </Typography>
                                </Box>
                                <Typography variant="h4" className="stat-value">
                                    {stats.totalVehicles}
                                </Typography>
                                <Box display="flex" alignItems="center" mt={1}>
                                    <CameraIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {stats.totalImages} images
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card">
                            <CardContent>
                                <Box className="stat-header">
                                    <Box className="stat-icon-wrapper success">
                                        <ActiveIcon className="stat-icon" />
                                    </Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Active Vehicles
                                    </Typography>
                                </Box>
                                <Typography variant="h4" className="stat-value success">
                                    {stats.activeVehicles}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-trend">
                                    {((stats.activeVehicles / stats.totalVehicles) * 100).toFixed(0)}% active
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card">
                            <CardContent>
                                <Box className="stat-header">
                                    <Box className="stat-icon-wrapper warning">
                                        <StarIcon className="stat-icon" />
                                    </Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Featured
                                    </Typography>
                                </Box>
                                <Typography variant="h4" className="stat-value warning">
                                    {stats.featuredVehicles}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="stat-trend">
                                    Popular choices
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className="stat-card">
                            <CardContent>
                                <Box className="stat-header">
                                    <Box className="stat-icon-wrapper primary">
                                        <Typography color="textSecondary" variant="body2">
                                            Total Revenue
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h4" className="stat-value primary">
                                    {stats.totalRevenue}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Rating value={stats.avgRating} readOnly precision={0.1} size="small" />
                                    <Typography variant="body2" color="textSecondary">
                                        Avg. {stats.avgRating}/5
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs for View Mode */}
                <Card className="tabs-section">
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Gallery View" icon={<CameraIcon />} iconPosition="start" />
                        <Tab label="Table View" icon={<ViewIcon />} iconPosition="start" />

                    </Tabs>
                </Card>

                {/* Categories Filter */}
                <Box className="categories-section">
                    <Typography variant="h6" gutterBottom className="section-subtitle">
                        Filter by Status
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                        {categories.map((cat) => (
                            <Chip
                                key={cat.value}
                                icon={cat.icon}
                                label={`${cat.label} (${cat.count})`}
                                color={filter === cat.value ? "primary" : "default"}
                                variant={filter === cat.value ? "filled" : "outlined"}
                                clickable
                                onClick={() => setFilter(cat.value)}
                                className="filter-chip"
                            />
                        ))}
                    </Box>
                </Box>

                {/* Gallery View */}
                {activeTab === 0 && (
                    <Box className="gallery-view">
                        <Typography variant="h5" className="gallery-title">
                            Vehicle Gallery
                        </Typography>
                        <Grid container spacing={3}>
                            {filteredVehicles.map((vehicle) => (
                                <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                                    <Card className="gallery-card">
                                        <VehicleImageGallery vehicle={vehicle} />
                                        <CardContent className="gallery-content">
                                            <Box className="gallery-header">
                                                <Box>
                                                    <Typography variant="h6" className="gallery-vehicle-name">
                                                        {vehicle.name}
                                                        {vehicle.featured && (
                                                            <StarIcon className="featured-star" />
                                                        )}
                                                    </Typography>
                                                    <Typography color="textSecondary" className="gallery-vehicle-type">
                                                        {vehicle.type} • {vehicle.year}
                                                    </Typography>
                                                </Box>
                                                {getStatusChip(vehicle.status)}
                                            </Box>

                                            <Typography variant="body2" className="gallery-description">
                                                {vehicle.description}
                                            </Typography>

                                            <Box className="gallery-specs">
                                                <Grid container spacing={1}>
                                                    <Grid item xs={4}>
                                                        <Box className="spec-item">
                                                            <FuelIcon fontSize="small" />
                                                            <Typography variant="caption">{vehicle.fuelType}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box className="spec-item">
                                                            <PeopleIcon fontSize="small" />
                                                            <Typography variant="caption">{vehicle.capacity}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Box className="spec-item">
                                                            <SettingsIcon fontSize="small" />
                                                            <Typography variant="caption">{vehicle.transmission}</Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            <Box className="gallery-footer">
                                                <Typography variant="h6" color="primary" className="gallery-price">
                                                    {vehicle.price}
                                                </Typography>
                                                <Box className="gallery-actions">
                                                    <IconButton size="small" onClick={() => handleOpenImageDialog(vehicle)}>
                                                        <ZoomInIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleFeaturedToggle(vehicle.id)}
                                                        color={vehicle.featured ? "warning" : "default"}
                                                    >
                                                        <FeaturedIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Table View with Image Gallery */}
                {activeTab === 1 && (
                    <Box className="table-view">
                        <TableContainer component={Paper} className="vehicles-table">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="100px">Images</TableCell>
                                        <TableCell>Vehicle Details</TableCell>
                                        <TableCell>Specifications</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Pricing</TableCell>
                                        <TableCell>Performance</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredVehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id} className={`table-row ${vehicle.status}`}>
                                            <TableCell>
                                                <Box className="table-image-gallery">
                                                    <Avatar
                                                        src={vehicle.images[0]}
                                                        alt={vehicle.name}
                                                        variant="rounded"
                                                        className="main-table-image"
                                                        onClick={() => handleOpenImageDialog(vehicle)}
                                                    >
                                                        <CarIcon />
                                                    </Avatar>
                                                    <Box className="table-thumbnails">
                                                        {vehicle.images.slice(1, 3).map((img, idx) => (
                                                            <Avatar
                                                                key={idx}
                                                                src={img}
                                                                variant="rounded"
                                                                className="table-thumbnail"
                                                                onClick={() => handleOpenImageDialog(vehicle)}
                                                            />
                                                        ))}
                                                        {vehicle.images.length > 3 && (
                                                            <Avatar className="more-images-badge">
                                                                +{vehicle.images.length - 3}
                                                            </Avatar>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box className="vehicle-info">
                                                    <Typography fontWeight="bold" variant="body1">
                                                        {vehicle.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {vehicle.description}
                                                    </Typography>
                                                    <Box className="table-tags">
                                                        {vehicle.tags.map((tag, idx) => (
                                                            <Chip key={idx} label={tag} size="small" className="table-tag" />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box className="specs-list">
                                                    <Box className="spec-item">
                                                        <Typography variant="caption" color="textSecondary">Year:</Typography>
                                                        <Typography variant="body2">{vehicle.year}</Typography>
                                                    </Box>
                                                    <Box className="spec-item">
                                                        <Typography variant="caption" color="textSecondary">Color:</Typography>
                                                        <Typography variant="body2">{vehicle.color}</Typography>
                                                    </Box>
                                                    <Box className="spec-item">
                                                        <Typography variant="caption" color="textSecondary">Engine:</Typography>
                                                        <Typography variant="body2">{vehicle.engine}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Switch
                                                        checked={vehicle.status === "active"}
                                                        onChange={() => handleStatusToggle(vehicle.id)}
                                                        size="small"
                                                        className="status-switch"
                                                    />
                                                    {getStatusChip(vehicle.status)}
                                                    {vehicle.featured && (
                                                        <StarIcon color="warning" fontSize="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold" color="primary" className="price-cell">
                                                    {vehicle.price}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Revenue: {vehicle.revenue}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box className="performance-metrics">
                                                    <Rating value={vehicle.rating} readOnly size="small" />
                                                    <Typography variant="body2">
                                                        {vehicle.rating}/5
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {vehicle.totalBookings} bookings
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box className="table-actions">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        title="Manage Images"
                                                        onClick={() => handleOpenImageDialog(vehicle)}
                                                    >
                                                        <CameraIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="primary" title="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        title="Delete"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}



                {/* Image Management Dialog */}
                <Dialog
                    open={imageDialogOpen}
                    onClose={handleCloseImageDialog}
                    maxWidth="lg"
                    fullWidth
                >
                    {selectedVehicle && (
                        <>
                            <DialogTitle>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">
                                        {selectedVehicle.name} - Image Gallery
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={() => handleAddImage(selectedVehicle.id)}>
                                            <AddPhotoIcon />
                                        </IconButton>
                                        <IconButton onClick={handleCloseImageDialog}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </DialogTitle>
                            <DialogContent>
                                <Box className="image-dialog-content">
                                    <Box className="main-image-display">
                                        <CardMedia
                                            component="img"
                                            image={selectedVehicle.images[mainImageIndex]}
                                            alt={`${selectedVehicle.name} - Image ${mainImageIndex + 1}`}
                                            className="dialog-main-image"
                                        />
                                        {selectedVehicle.images.length > 1 && (
                                            <>
                                                <IconButton className="dialog-nav-btn prev" onClick={prevImage}>
                                                    <ChevronLeftIcon />
                                                </IconButton>
                                                <IconButton className="dialog-nav-btn next" onClick={nextImage}>
                                                    <ChevronRightIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        <Box className="image-counter">
                                            Image {mainImageIndex + 1} of {selectedVehicle.images.length}
                                        </Box>
                                    </Box>

                                    <Box className="image-grid">
                                        <Typography variant="subtitle2" gutterBottom>
                                            All Images ({selectedVehicle.images.length})
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {selectedVehicle.images.map((img, idx) => (
                                                <Grid item xs={3} key={idx}>
                                                    <Card className={`grid-image-card ${idx === mainImageIndex ? 'active' : ''}`}>
                                                        <CardMedia
                                                            component="img"
                                                            image={img}
                                                            alt={`Image ${idx + 1}`}
                                                            className="grid-image"
                                                            onClick={() => setMainImageIndex(idx)}
                                                        />
                                                        <Box className="grid-image-actions">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleRemoveImage(selectedVehicle.id, idx)}
                                                                color="error"
                                                            >
                                                                <DeletePhotoIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseImageDialog} color="primary">
                                    Close
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddImage(selectedVehicle.id)}
                                >
                                    Add More Images
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                {/* Vehicle Categories */}
                <Card className="categories-card">
                    <CardContent>
                        <Typography variant="h6" gutterBottom className="section-subtitle">
                            Vehicle Categories
                        </Typography>
                        <Box className="vehicle-categories">
                            {vehicleTypes.map((type) => (
                                <Card
                                    key={type.label}
                                    className="category-card"
                                    style={{ borderLeft: `4px solid ${type.color}` }}
                                >
                                    <CardContent>
                                        <Typography variant="h3" className="category-icon">
                                            {type.icon}
                                        </Typography>
                                        <Typography variant="subtitle2" className="category-label">
                                            {type.label}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {type.count} vehicles
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </MainLayout>
    );
};

export default Vehicles;