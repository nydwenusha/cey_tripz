import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    Tabs,
    Tab,
    Avatar,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    InputAdornment,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Star as StarIcon,
    LocalOffer as FeaturedIcon,
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
    Print,
    Email,
    AttachMoney as MoneyIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material';
import './Vehicles.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const vehicleTypeDefinitions = [
    { label: 'Hatchback', match: 'hatchback', icon: '🚗', color: '#667eea' },
    { label: 'SUV', match: 'suv', icon: '🚙', color: '#4caf50' },
    { label: 'Sedan', match: 'sedan', icon: '🚘', color: '#ff9800' },
    { label: 'Mini', match: 'mini', icon: '🚗', color: '#e91e63' },
    { label: 'Hybrid', match: 'hybrid', icon: '⚡', color: '#2196f3' },
    { label: 'Luxury', match: 'luxury', icon: '💎', color: '#9c27b0' },
    { label: 'Van', match: 'van', icon: '🚐', color: '#795548' },
    { label: 'Convertible', match: 'convertible', icon: '🌴', color: '#00bcd4' }
];

const vehicleTypeOptions = [
    'Hatchback',
    'SUV',
    'Sedan',
    'Mini',
    'Hybrid',
    'Luxury',
    'Van',
    'Convertible',
    'Truck',
    'Sports Car'
];

const vehicleCategoryOptions = [
    'Economy',
    'Family',
    'Luxury',
    'Executive',
    'Adventure',
    'Commercial',
];

const fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const transmissionOptions = ['Automatic', 'Manual', 'Semi-Automatic'];
const statusOptions = ['active', 'inactive'];
const colorOptions = [
    'White',
    'Black',
    'Silver',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Brown',
    'Orange'
];

const createInitialVehicleForm = () => ({
    name: '',
    type: '',
    description: '',
    status: 'active',
    category: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    fuelType: '',
    transmission: '',
    year: new Date().getFullYear().toString(),
    color: '',
    mileage: '',
    engine: '',
    capacity: '',
    tags: '',
    featured: false,
});

const createVehicleFormFromVehicle = (vehicle) => ({
    name: vehicle?.name || '',
    type: vehicle?.type || '',
    description: vehicle?.description || '',
    status: vehicle?.status || 'active',
    category: vehicle?.category || '',
    dailyRate: vehicle?.dailyRate !== undefined ? String(vehicle.dailyRate) : '',
    weeklyRate: vehicle?.weeklyRate !== undefined ? String(vehicle.weeklyRate) : '',
    monthlyRate: vehicle?.monthlyRate !== undefined ? String(vehicle.monthlyRate) : '',
    fuelType: vehicle?.fuelType || '',
    transmission: vehicle?.transmission || '',
    year: vehicle?.year || new Date().getFullYear().toString(),
    color: vehicle?.color || '',
    mileage: vehicle?.mileageValue || '',
    engine: vehicle?.engineValue || '',
    capacity: vehicle?.capacityValue !== undefined && vehicle?.capacityValue !== null
        ? String(vehicle.capacityValue)
        : '',
    tags: Array.isArray(vehicle?.tags) ? vehicle.tags.join(', ') : '',
    featured: Boolean(vehicle?.featured),
});

const bookingsPageSize = 50;

const getVehicleBookingKey = (vehicleName) => String(vehicleName || '').trim().toLowerCase();

const fetchBookingCountsByVehicle = async () => {
    const firstResponse = await api.get('/GetBookings', {
        params: {
            page: 1,
            per_page: bookingsPageSize,
        },
    });
    const lastPage = Number(firstResponse.data?.pagination?.last_page || 1);

    const remainingResponses = await Promise.all(
        Array.from({ length: Math.max(lastPage - 1, 0) }, (_, index) =>
            api.get('/GetBookings', {
                params: {
                    page: index + 2,
                    per_page: bookingsPageSize,
                },
            })
        )
    );

    return [firstResponse, ...remainingResponses]
        .flatMap((response) => (Array.isArray(response.data?.bookings) ? response.data.bookings : []))
        .reduce((counts, booking) => {
            const vehicleKey = getVehicleBookingKey(booking.vehicle_type);

            if (!vehicleKey) {
                return counts;
            }

            counts[vehicleKey] = (counts[vehicleKey] || 0) + 1;
            return counts;
        }, {});
};

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [bookingCountsByVehicle, setBookingCountsByVehicle] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [filter, setFilter] = useState('all');
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [deleteDialogState, setDeleteDialogState] = useState({
        open: false,
        vehicle: null,
    });
    const [imageDeleteDialogState, setImageDeleteDialogState] = useState({
        open: false,
        vehicle: null,
        imageIndex: null,
    });
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [vehicleDialogMode, setVehicleDialogMode] = useState('add');
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [addFormData, setAddFormData] = useState(createInitialVehicleForm());
    const [addFormErrors, setAddFormErrors] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const fileInputRef = useRef(null);
    const imageDialogInputRef = useRef(null);
    const vehicleDialogSelectMenuProps = {
        disableScrollLock: true,
        PaperProps: {
            sx: {
                zIndex: 1702,
                maxHeight: 320,
            },
        },
        sx: {
            zIndex: 1702,
        },
    };

    useEffect(() => {
        let isActive = true;

        const fetchVehicles = async () => {
            setLoading(true);

            try {
                const [vehiclesResponse, nextBookingCounts] = await Promise.all([
                    api.get('/GetVehicles'),
                    fetchBookingCountsByVehicle().catch((error) => {
                        console.error('Error fetching vehicle booking counts:', error);
                        return {};
                    }),
                ]);

                if (!isActive) {
                    return;
                }

                setBookingCountsByVehicle(nextBookingCounts);
                setVehicles(vehiclesResponse.data?.vehicles || []);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                console.error('Error fetching vehicles:', error);
                setBookingCountsByVehicle({});
                setVehicles([]);
                showSnackbar(error.response?.data?.message || 'Failed to load vehicles.', 'error');
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchVehicles();

        return () => {
            isActive = false;
        };
    }, []);

    const getVehicleBookingCount = (vehicle) => bookingCountsByVehicle[getVehicleBookingKey(vehicle?.name)] || 0;

    useEffect(() => {
        if (!selectedVehicle) {
            return;
        }

        if (selectedVehicle.images.length === 0 && mainImageIndex !== 0) {
            setMainImageIndex(0);
            return;
        }

        if (mainImageIndex > selectedVehicle.images.length - 1) {
            setMainImageIndex(Math.max(selectedVehicle.images.length - 1, 0));
        }
    }, [mainImageIndex, selectedVehicle]);

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

    const updateVehicleState = (updatedVehicle) => {
        setVehicles((prev) =>
            prev.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle))
        );

        if (selectedVehicle?.id === updatedVehicle.id) {
            setSelectedVehicle(updatedVehicle);
        }
    };

    const resetVehicleDialog = () => {
        imagePreviews.forEach((preview) => {
            if (preview.preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview.preview);
            }
        });

        setAddDialogOpen(false);
        setVehicleDialogMode('add');
        setEditingVehicleId(null);
        setSaveLoading(false);
        setAddFormData(createInitialVehicleForm());
        setAddFormErrors({});
        setImageFiles([]);
        setImagePreviews([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenAddDialog = () => {
        resetVehicleDialog();
        setAddDialogOpen(true);
    };

    const handleOpenEditDialog = (vehicle) => {
        resetVehicleDialog();
        setVehicleDialogMode('edit');
        setEditingVehicleId(vehicle.id);
        setAddFormData(createVehicleFormFromVehicle(vehicle));
        setAddDialogOpen(true);
    };

    const handleCloseVehicleDialog = () => {
        if (saveLoading) {
            return;
        }

        resetVehicleDialog();
    };

    const handleAddFieldChange = (field) => (event) => {
        const value = field === 'featured' ? event.target.checked : event.target.value;

        setAddFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setAddFormErrors((prev) => ({
            ...prev,
            [field]: '',
            form: '',
        }));
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || []);
        const imageOnlyFiles = files.filter((file) => file.type.startsWith('image/'));
        const availableSlots = Math.max(0, 4 - imageFiles.length);
        const nextFiles = imageOnlyFiles.slice(0, availableSlots);

        if (nextFiles.length === 0) {
            return;
        }

        setImageFiles((prev) => [...prev, ...nextFiles]);
        setImagePreviews((prev) => [
            ...prev,
            ...nextFiles.map((file) => ({
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                preview: URL.createObjectURL(file),
            })),
        ]);

        setAddFormErrors((prev) => ({
            ...prev,
            images: '',
            form: '',
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveSelectedImage = (index) => {
        setImageFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
        setImagePreviews((prev) => {
            const target = prev[index];

            if (target?.preview?.startsWith('blob:')) {
                URL.revokeObjectURL(target.preview);
            }

            return prev.filter((_, currentIndex) => currentIndex !== index);
        });
    };

    const validateVehicleForm = () => {
        const errors = {};

        if (!addFormData.name.trim()) errors.name = 'Vehicle name is required.';
        if (!addFormData.type) errors.type = 'Vehicle type is required.';
        if (!addFormData.category) errors.category = 'Category is required.';
        if (!addFormData.fuelType) errors.fuelType = 'Fuel type is required.';
        if (!addFormData.transmission) errors.transmission = 'Transmission is required.';
        if (!addFormData.engine.trim()) errors.engine = 'Engine capacity is required.';
        if (!addFormData.capacity || Number(addFormData.capacity) < 1) errors.capacity = 'Capacity must be at least 1.';
        if (addFormData.dailyRate === '' || Number(addFormData.dailyRate) < 0) errors.dailyRate = 'Daily rate is required.';
        if (addFormData.weeklyRate === '' || Number(addFormData.weeklyRate) < 0) errors.weeklyRate = 'Weekly rate is required.';
        if (addFormData.monthlyRate === '' || Number(addFormData.monthlyRate) < 0) errors.monthlyRate = 'Monthly rate is required.';
        if (vehicleDialogMode === 'add' && imageFiles.length > 4) errors.images = 'You can upload up to 4 images only.';

        setAddFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveVehicle = async () => {
        if (!validateVehicleForm()) {
            return;
        }

        setSaveLoading(true);

        try {
            const tagList = addFormData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean);

            const payload = {
                name: addFormData.name.trim(),
                type: addFormData.type,
                description: addFormData.description.trim(),
                status: addFormData.status,
                category: addFormData.category,
                daily_rate: addFormData.dailyRate || '0',
                weekly_rate: addFormData.weeklyRate || '0',
                monthly_rate: addFormData.monthlyRate || '0',
                fuel_type: addFormData.fuelType,
                transmission: addFormData.transmission,
                year: addFormData.year,
                color: addFormData.color,
                mileage: addFormData.mileage,
                engine: addFormData.engine.trim(),
                capacity: addFormData.capacity,
                featured: addFormData.featured ? 1 : 0,
                tags: tagList,
            };

            let response;

            if (vehicleDialogMode === 'edit' && editingVehicleId) {
                response = await api.put(`/UpdateVehicle/${editingVehicleId}`, payload);
                updateVehicleState(response.data.vehicle);
            } else {
                const formDataPayload = new FormData();

                Object.entries(payload).forEach(([field, value]) => {
                    if (field === 'tags') {
                        value.forEach((tag, index) => {
                            formDataPayload.append(`tags[${index}]`, tag);
                        });
                        return;
                    }

                    formDataPayload.append(field, value ?? '');
                });

                imageFiles.forEach((file) => {
                    formDataPayload.append('images[]', file, file.name);
                });

                response = await api.post('/AddVehicle', formDataPayload);
                setVehicles((prev) => [response.data.vehicle, ...prev]);
            }

            showSnackbar(
                response.data.message || (vehicleDialogMode === 'edit' ? 'Vehicle updated successfully.' : 'Vehicle added successfully.')
            );
            resetVehicleDialog();
        } catch (error) {
            console.error('Error saving vehicle:', error);

            if (error.response?.status === 422 && error.response?.data?.errors) {
                const fieldErrors = Object.entries(error.response.data.errors).reduce((acc, [field, messages]) => {
                    const nextMessage = Array.isArray(messages) ? messages[0] : messages;

                    if (field.startsWith('images')) {
                        acc.images = nextMessage;
                        return acc;
                    }

                    if (field === 'daily_rate') acc.dailyRate = nextMessage;
                    else if (field === 'weekly_rate') acc.weeklyRate = nextMessage;
                    else if (field === 'monthly_rate') acc.monthlyRate = nextMessage;
                    else if (field === 'fuel_type') acc.fuelType = nextMessage;
                    else acc[field] = nextMessage;

                    return acc;
                }, {});

                setAddFormErrors((prev) => ({
                    ...prev,
                    ...fieldErrors,
                    form: error.response?.data?.message || 'Validation failed.',
                }));
            } else {
                setAddFormErrors((prev) => ({
                    ...prev,
                    form: error.response?.data?.message || (vehicleDialogMode === 'edit' ? 'Failed to update vehicle.' : 'Failed to save vehicle.'),
                }));
            }
        } finally {
            setSaveLoading(false);
        }
    };

    const filteredVehicles = useMemo(() => {
        if (filter === 'all') {
            return vehicles;
        }

        if (filter === 'active') {
            return vehicles.filter((vehicle) => vehicle.status === 'active');
        }

        if (filter === 'inactive') {
            return vehicles.filter((vehicle) => vehicle.status === 'inactive');
        }

        return vehicles.filter((vehicle) => vehicle.featured);
    }, [filter, vehicles]);

    const stats = useMemo(() => ({
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter((vehicle) => vehicle.status === 'active').length,
        totalRevenue: `$${vehicles.reduce((sum, vehicle) => sum + Number(vehicle.revenueValue || 0), 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`,
        featuredVehicles: vehicles.filter((vehicle) => vehicle.featured).length,
        totalImages: vehicles.reduce((sum, vehicle) => sum + (vehicle.images?.length || 0), 0),
    }), [vehicles]);

    const categories = [
        { label: 'All Vehicles', count: vehicles.length, value: 'all', icon: <CarIcon /> },
        { label: 'Active', count: vehicles.filter((vehicle) => vehicle.status === 'active').length, value: 'active', icon: <ActiveIcon /> },
        { label: 'Inactive', count: vehicles.filter((vehicle) => vehicle.status === 'inactive').length, value: 'inactive', icon: <InactiveIcon /> },
        { label: 'Featured', count: vehicles.filter((vehicle) => vehicle.featured).length, value: 'featured', icon: <StarIcon /> }
    ];

    const vehicleTypes = vehicleTypeDefinitions.map((definition) => ({
        ...definition,
        count: vehicles.filter((vehicle) => {
            const category = String(vehicle.category || '').toLowerCase();
            const type = String(vehicle.type || '').toLowerCase();
            return category.includes(definition.match) || type.includes(definition.match);
        }).length,
    }));

    const handleStatusToggle = async (vehicle) => {
        const nextStatus = vehicle.status === 'active' ? 'inactive' : 'active';
        setActionLoadingId(vehicle.id);

        try {
            const response = await api.put(`/UpdateVehicleStatus/${vehicle.id}`, {
                status: nextStatus,
            });

            updateVehicleState(response.data.vehicle);
            showSnackbar(response.data.message || 'Vehicle status updated successfully.');
        } catch (error) {
            console.error('Error updating vehicle status:', error);
            showSnackbar(error.response?.data?.message || 'Failed to update vehicle status.', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleFeaturedToggle = async (vehicle) => {
        setActionLoadingId(vehicle.id);

        try {
            const response = await api.put(`/UpdateVehicleFeatured/${vehicle.id}`, {
                featured: !vehicle.featured,
            });

            updateVehicleState(response.data.vehicle);
            showSnackbar(response.data.message || 'Vehicle feature status updated successfully.');
        } catch (error) {
            console.error('Error updating featured vehicle:', error);
            showSnackbar(error.response?.data?.message || 'Failed to update featured vehicle.', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleOpenDeleteDialog = (vehicle) => {
        setDeleteDialogState({
            open: true,
            vehicle,
        });
    };

    const handleCloseDeleteDialog = () => {
        if (deleteDialogState.vehicle && actionLoadingId === deleteDialogState.vehicle.id) {
            return;
        }

        setDeleteDialogState({
            open: false,
            vehicle: null,
        });
    };

    const handleDelete = async () => {
        if (!deleteDialogState.vehicle) {
            return;
        }

        const vehicleId = deleteDialogState.vehicle.id;
        let deleteSucceeded = false;

        setActionLoadingId(vehicleId);

        try {
            const response = await api.delete(`/DeleteVehicle/${vehicleId}`);
            setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));

            if (selectedVehicle?.id === vehicleId) {
                handleCloseImageDialog();
            }

            showSnackbar(response.data.message || 'Vehicle deleted successfully.');
            deleteSucceeded = true;
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            showSnackbar(error.response?.data?.message || 'Failed to delete vehicle.', 'error');
        } finally {
            setActionLoadingId(null);

            if (deleteSucceeded) {
                setDeleteDialogState({
                    open: false,
                    vehicle: null,
                });
            }
        }
    };

    const handleOpenImageDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setMainImageIndex(0);
        setImageDialogOpen(true);
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
        setSelectedVehicle(null);
        setMainImageIndex(0);

        if (imageDialogInputRef.current) {
            imageDialogInputRef.current.value = '';
        }
    };

    const handleAddImage = () => {
        imageDialogInputRef.current?.click();
    };

    const handleImageDialogFileSelect = async (event, vehicleId) => {
        const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));

        if (files.length === 0) {
            return;
        }

        setActionLoadingId(vehicleId);

        try {
            const payload = new FormData();
            files.slice(0, 4).forEach((file) => {
                payload.append('images[]', file, file.name);
            });

            const response = await api.post(`/AddVehicleImage/${vehicleId}`, payload);

            updateVehicleState(response.data.vehicle);
            showSnackbar(response.data.message || 'Vehicle images added successfully.');
        } catch (error) {
            console.error('Error adding vehicle image:', error);
            showSnackbar(error.response?.data?.message || 'Failed to add vehicle images.', 'error');
        } finally {
            setActionLoadingId(null);

            if (imageDialogInputRef.current) {
                imageDialogInputRef.current.value = '';
            }
        }
    };

    const handleOpenImageDeleteDialog = (vehicle, imageIndex) => {
        setImageDeleteDialogState({
            open: true,
            vehicle,
            imageIndex,
        });
    };

    const handleCloseImageDeleteDialog = () => {
        if (imageDeleteDialogState.vehicle && actionLoadingId === imageDeleteDialogState.vehicle.id) {
            return;
        }

        setImageDeleteDialogState({
            open: false,
            vehicle: null,
            imageIndex: null,
        });
    };

    const handleRemoveImage = async () => {
        if (!imageDeleteDialogState.vehicle || imageDeleteDialogState.imageIndex === null) {
            return;
        }

        const vehicleId = imageDeleteDialogState.vehicle.id;
        const imageIndex = imageDeleteDialogState.imageIndex;
        let removeSucceeded = false;

        setActionLoadingId(vehicleId);

        try {
            const response = await api.delete(`/DeleteVehicleImage/${vehicleId}`, {
                data: {
                    index: imageIndex,
                },
            });

            updateVehicleState(response.data.vehicle);
            showSnackbar(response.data.message || 'Vehicle image removed successfully.');
            removeSucceeded = true;
        } catch (error) {
            console.error('Error removing vehicle image:', error);
            showSnackbar(error.response?.data?.message || 'Failed to remove vehicle image.', 'error');
        } finally {
            setActionLoadingId(null);

            if (removeSucceeded) {
                setImageDeleteDialogState({
                    open: false,
                    vehicle: null,
                    imageIndex: null,
                });
            }
        }
    };

    const handlePrintAll = () => {
        window.print();
    };

    const handleEmailAll = () => {
        window.location.href = 'mailto:?subject=Vehicle%20Fleet%20Details';
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
            icon={status === 'active' ? <ActiveIcon /> : <InactiveIcon />}
            label={String(status || '').toUpperCase()}
            color={status === 'active' ? 'success' : 'error'}
            size="small"
            variant="outlined"
        />
    );

    const VehicleImageGallery = ({ vehicle, isCompact = false }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const hasImages = (vehicle.images || []).length > 0;

        useEffect(() => {
            setCurrentIndex(0);
        }, [vehicle.id]);

        const next = () => {
            setCurrentIndex((prev) => (prev + 1) % vehicle.images.length);
        };

        const prev = () => {
            setCurrentIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
        };

        return (
            <Box className={`vehicle-gallery ${isCompact ? 'compact' : ''}`}>
                <Box className="main-image-container">
                    {hasImages ? (
                        <CardMedia
                            component="img"
                            image={vehicle.images[currentIndex]}
                            alt={`${vehicle.name} - Image ${currentIndex + 1}`}
                            className="main-image"
                            onClick={() => !isCompact && handleOpenImageDialog(vehicle)}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f5f5f5',
                                color: 'text.secondary',
                            }}
                        >
                            <CameraIcon />
                        </Box>
                    )}

                    {hasImages && vehicle.images.length > 1 && (
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

                {!isCompact && hasImages && vehicle.images.length > 1 && (
                    <Box className="thumbnail-container">
                        {vehicle.images.slice(0, 4).map((img, idx) => (
                            <Box
                                key={idx}
                                className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                            >
                                <CardMedia component="img" image={img} alt={`Thumbnail ${idx + 1}`} className="thumbnail-image" />
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
        <Box className="vehicles-management">
            <PageHeader
                title="Vehicle Management"
                subtitle="Manage your fleet of vehicles with multiple images, view analytics and handle bookings"
                primaryAction={{
                    label: 'Add Vehicle',
                    onClick: handleOpenAddDialog,
                    icon: <CarIcon />
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

            <Grid
                container
                spacing={3}
                className="stats-section"
                sx={{
                    width: '100%',
                    mx: 0,
                    marginLeft: '0 !important',
                    marginRight: '0 !important',
                }}
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                        display: 'flex',
                        flex: {
                            xs: '1 1 100%',
                            sm: '1 1 calc(50% - 12px)',
                            md: '1 1 calc(25% - 18px)'
                        },
                        maxWidth: {
                            xs: '100%',
                            sm: 'calc(50% - 12px)',
                            md: 'calc(25% - 18px)'
                        },
                        minWidth: 0,
                    }}
                >
                    <Card className="stat-card" sx={{ width: '100%' }}>
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
                            <Typography variant="body2" color="textSecondary" className="stat-trend">
                                {stats.totalImages} images in gallery
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                        display: 'flex',
                        flex: {
                            xs: '1 1 100%',
                            sm: '1 1 calc(50% - 12px)',
                            md: '1 1 calc(25% - 18px)'
                        },
                        maxWidth: {
                            xs: '100%',
                            sm: 'calc(50% - 12px)',
                            md: 'calc(25% - 18px)'
                        },
                        minWidth: 0,
                    }}
                >
                    <Card className="stat-card" sx={{ width: '100%' }}>
                        <CardContent>
                            <Box className="stat-header">
                                <Box className="stat-icon-wrapper success">
                                    <ActiveIcon className="stat-icon success" />
                                </Box>
                                <Typography color="textSecondary" variant="body2">
                                    Active Vehicles
                                </Typography>
                            </Box>
                            <Typography variant="h4" className="stat-value success">
                                {stats.activeVehicles}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="stat-trend">
                                {stats.totalVehicles ? `${Math.round((stats.activeVehicles / stats.totalVehicles) * 100)}% active` : 'No active vehicles'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                        display: 'flex',
                        flex: {
                            xs: '1 1 100%',
                            sm: '1 1 calc(50% - 12px)',
                            md: '1 1 calc(25% - 18px)'
                        },
                        maxWidth: {
                            xs: '100%',
                            sm: 'calc(50% - 12px)',
                            md: 'calc(25% - 18px)'
                        },
                        minWidth: 0,
                    }}
                >
                    <Card className="stat-card" sx={{ width: '100%' }}>
                        <CardContent>
                            <Box className="stat-header">
                                <Box className="stat-icon-wrapper warning">
                                    <FeaturedIcon className="stat-icon warning" />
                                </Box>
                                <Typography color="textSecondary" variant="body2">
                                    Featured
                                </Typography>
                            </Box>
                            <Typography variant="h4" className="stat-value warning">
                                {stats.featuredVehicles}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="stat-trend">
                                Highlighted on the website
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                        display: 'flex',
                        flex: {
                            xs: '1 1 100%',
                            sm: '1 1 calc(50% - 12px)',
                            md: '1 1 calc(25% - 18px)'
                        },
                        maxWidth: {
                            xs: '100%',
                            sm: 'calc(50% - 12px)',
                            md: 'calc(25% - 18px)'
                        },
                        minWidth: 0,
                    }}
                >
                    <Card className="stat-card" sx={{ width: '100%' }}>
                        <CardContent>
                            <Box className="stat-header">
                                <Box className="stat-icon-wrapper primary">
                                    <StarIcon className="stat-icon" />
                                </Box>
                                <Typography color="textSecondary" variant="body2">
                                    Revenue
                                </Typography>
                            </Box>
                            <Typography variant="h4" className="stat-value primary">
                                {stats.totalRevenue}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="stat-trend">
                                Based on confirmed and completed bookings
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper className="categories-section">
                <Typography variant="h6" gutterBottom className="section-subtitle">
                    Vehicle Filters
                </Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap">
                    {categories.map((category) => (
                        <Chip
                            key={category.value}
                            icon={category.icon}
                            label={`${category.label} (${category.count})`}
                            color={filter === category.value ? 'primary' : 'default'}
                            variant={filter === category.value ? 'filled' : 'outlined'}
                            onClick={() => setFilter(category.value)}
                            className="filter-chip"
                        />
                    ))}
                </Box>
            </Paper>

            <Paper className="tabs-section">
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Gallery View" icon={<CameraIcon />} iconPosition="start" />
                    <Tab label="Table View" icon={<ViewIcon />} iconPosition="start" />
                </Tabs>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : activeTab === 0 ? (
                <Box className="card-view">
                    <Grid container spacing={3}>
                        {filteredVehicles.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                                    <Typography>No vehicles found.</Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            filteredVehicles.map((vehicle) => (
                                <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                                    <Card className="vehicle-card">
                                        <VehicleImageGallery vehicle={vehicle} isCompact />

                                        <CardContent>
                                            <Box className="vehicle-header">
                                                <Typography variant="h6" className="vehicle-name">
                                                    {vehicle.name}
                                                    {vehicle.featured && <StarIcon className="featured-star" />}
                                                </Typography>
                                                <Typography color="textSecondary" className="vehicle-type">
                                                    {vehicle.type} • {vehicle.year || 'N/A'}
                                                </Typography>
                                            </Box>

                                            <Typography className="vehicle-description">
                                                {vehicle.description || 'No description available.'}
                                            </Typography>

                                            <Box className="vehicle-specs">
                                                <Box className="spec-item">
                                                    <FuelIcon fontSize="small" />
                                                    <Typography variant="body2">{vehicle.fuelType || 'N/A'}</Typography>
                                                </Box>
                                                <Box className="spec-item">
                                                    <PeopleIcon fontSize="small" />
                                                    <Typography variant="body2">{vehicle.capacity || 'N/A'}</Typography>
                                                </Box>
                                                <Box className="spec-item">
                                                    <SettingsIcon fontSize="small" />
                                                    <Typography variant="body2">{vehicle.transmission || 'N/A'}</Typography>
                                                </Box>
                                                <Box className="spec-item">
                                                    <CameraIcon fontSize="small" />
                                                    <Typography variant="body2">{vehicle.images.length} images</Typography>
                                                </Box>
                                            </Box>

                                            <Box className="vehicle-tags">
                                                {vehicle.tags.map((tag, index) => (
                                                    <Chip key={index} label={tag} className="tag-chip" size="small" />
                                                ))}
                                            </Box>

                                            <Box className="vehicle-metrics">
                                                <Box className="rating-section">
                                                    <Rating value={Number(vehicle.rating || 0)} readOnly precision={0.5} size="small" />
                                                    <Typography variant="body2" className="booking-count">
                                                        {getVehicleBookingCount(vehicle)} bookings
                                                    </Typography>
                                                </Box>
                                                <Typography color="primary" className="price">
                                                    {vehicle.price}
                                                </Typography>
                                            </Box>

                                            <Box className="vehicle-actions">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    className="view-details-btn"
                                                    onClick={() => handleOpenImageDialog(vehicle)}
                                                >
                                                    Manage Images
                                                </Button>

                                                <Box className="action-buttons">
                                                    <IconButton
                                                        onClick={() => handleFeaturedToggle(vehicle)}
                                                        color={vehicle.featured ? 'warning' : 'default'}
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <FeaturedIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleOpenEditDialog(vehicle)}
                                                        color="primary"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleOpenDeleteDialog(vehicle)}
                                                        color="error"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <Switch
                                                        checked={vehicle.status === 'active'}
                                                        onChange={() => handleStatusToggle(vehicle)}
                                                        disabled={actionLoadingId === vehicle.id}
                                                    />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>
            ) : (
                <Box className="table-view">
                    <TableContainer component={Paper} className="vehicles-table">
                        <Table>
                            <TableHead className="table-head">
                                <TableRow>
                                    <TableCell width="100px" className="table-header-cell">Images</TableCell>
                                    <TableCell className="table-header-cell">Vehicle Details</TableCell>
                                    <TableCell className="table-header-cell">Specifications</TableCell>
                                    <TableCell className="table-header-cell">Status</TableCell>
                                    <TableCell className="table-header-cell">Pricing</TableCell>
                                    <TableCell className="table-header-cell">Performance</TableCell>
                                    <TableCell align="center" className="table-header-cell">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredVehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No vehicles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id} className={`table-row ${vehicle.status}`}>
                                            <TableCell>
                                                <Box className="table-image-gallery">
                                                    <Avatar
                                                        src={vehicle.images[0] || ''}
                                                        alt={vehicle.name}
                                                        variant="rounded"
                                                        className="main-table-image"
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
                                                        {vehicle.description || 'No description available.'}
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
                                                        <Typography variant="body2">{vehicle.year || 'N/A'}</Typography>
                                                    </Box>
                                                    <Box className="spec-item">
                                                        <Typography variant="caption" color="textSecondary">Color:</Typography>
                                                        <Typography variant="body2">{vehicle.color || 'N/A'}</Typography>
                                                    </Box>
                                                    <Box className="spec-item">
                                                        <Typography variant="caption" color="textSecondary">Engine:</Typography>
                                                        <Typography variant="body2">{vehicle.engine || 'N/A'}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Switch
                                                        checked={vehicle.status === 'active'}
                                                        onChange={() => handleStatusToggle(vehicle)}
                                                        size="small"
                                                        className="status-switch"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    />
                                                    {getStatusChip(vehicle.status)}
                                                    {vehicle.featured && <StarIcon color="warning" fontSize="small" />}
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
                                                    <Rating value={Number(vehicle.rating || 0)} readOnly size="small" />
                                                    <Typography variant="body2">
                                                        {Number(vehicle.rating || 0).toFixed(1)}/5
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {getVehicleBookingCount(vehicle)} bookings
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
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <CameraIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => handleFeaturedToggle(vehicle)}
                                                        title="Feature"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <FeaturedIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEditDialog(vehicle)}
                                                        title="Edit"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(vehicle)}
                                                        title="Delete"
                                                        disabled={actionLoadingId === vehicle.id}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Dialog
                open={addDialogOpen}
                onClose={handleCloseVehicleDialog}
                maxWidth="md"
                fullWidth
                sx={{
                    zIndex: 1601,
                    '& .MuiDialog-paper': {
                        mt: { xs: 10, sm: 12 },
                        mb: 3,
                        maxHeight: 'calc(100% - 120px)',
                    },
                }}
            >
                <DialogTitle className="vehicle-dialog-title">
                    {vehicleDialogMode === 'edit' ? 'Edit Vehicle' : 'Add Vehicle'}
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
                        {addFormErrors.form && (
                            <Alert severity="error" sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                                {addFormErrors.form}
                            </Alert>
                        )}

                        {vehicleDialogMode === 'edit' && (
                            <Alert severity="info" sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                                Update vehicle details here. Manage gallery images from the vehicle image dialog.
                            </Alert>
                        )}

                        <TextField
                            label="Vehicle Name"
                            value={addFormData.name}
                            onChange={handleAddFieldChange('name')}
                            error={Boolean(addFormErrors.name)}
                            helperText={addFormErrors.name}
                            fullWidth
                        />
                        <TextField
                            label="Year"
                            type="number"
                            value={addFormData.year}
                            onChange={handleAddFieldChange('year')}
                            fullWidth
                            inputProps={{ min: 2000, max: 2100 }}
                        />
                        <FormControl fullWidth error={Boolean(addFormErrors.type)}>
                            <InputLabel>Vehicle Type</InputLabel>
                            <Select
                                label="Vehicle Type"
                                value={addFormData.type}
                                onChange={handleAddFieldChange('type')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {vehicleTypeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{addFormErrors.type}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth error={Boolean(addFormErrors.category)}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={addFormData.category}
                                onChange={handleAddFieldChange('category')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {vehicleCategoryOptions.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{addFormErrors.category}</FormHelperText>
                        </FormControl>
                        <TextField
                            label="Description"
                            value={addFormData.description}
                            onChange={handleAddFieldChange('description')}
                            multiline
                            rows={4}
                            fullWidth
                            sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                        />

                        <FormControl fullWidth error={Boolean(addFormErrors.fuelType)}>
                            <InputLabel>Fuel Type</InputLabel>
                            <Select
                                label="Fuel Type"
                                value={addFormData.fuelType}
                                onChange={handleAddFieldChange('fuelType')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {fuelTypeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{addFormErrors.fuelType}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth error={Boolean(addFormErrors.transmission)}>
                            <InputLabel>Transmission</InputLabel>
                            <Select
                                label="Transmission"
                                value={addFormData.transmission}
                                onChange={handleAddFieldChange('transmission')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {transmissionOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{addFormErrors.transmission}</FormHelperText>
                        </FormControl>

                        <TextField
                            label="Engine Capacity"
                            value={addFormData.engine}
                            onChange={handleAddFieldChange('engine')}
                            error={Boolean(addFormErrors.engine)}
                            helperText={addFormErrors.engine}
                            fullWidth
                        />
                        <TextField
                            label="Capacity"
                            type="number"
                            value={addFormData.capacity}
                            onChange={handleAddFieldChange('capacity')}
                            error={Boolean(addFormErrors.capacity)}
                            helperText={addFormErrors.capacity}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />
                        <TextField
                            label="Mileage"
                            value={addFormData.mileage}
                            onChange={handleAddFieldChange('mileage')}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Color</InputLabel>
                            <Select
                                label="Color"
                                value={addFormData.color}
                                onChange={handleAddFieldChange('color')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {colorOptions.map((color) => (
                                    <MenuItem key={color} value={color}>
                                        {color}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Daily Rate"
                            type="number"
                            value={addFormData.dailyRate}
                            onChange={handleAddFieldChange('dailyRate')}
                            error={Boolean(addFormErrors.dailyRate)}
                            helperText={addFormErrors.dailyRate}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MoneyIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Weekly Rate"
                            type="number"
                            value={addFormData.weeklyRate}
                            onChange={handleAddFieldChange('weeklyRate')}
                            error={Boolean(addFormErrors.weeklyRate)}
                            helperText={addFormErrors.weeklyRate}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MoneyIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Monthly Rate"
                            type="number"
                            value={addFormData.monthlyRate}
                            onChange={handleAddFieldChange('monthlyRate')}
                            error={Boolean(addFormErrors.monthlyRate)}
                            helperText={addFormErrors.monthlyRate}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MoneyIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={addFormData.status}
                                onChange={handleAddFieldChange('status')}
                                MenuProps={vehicleDialogSelectMenuProps}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Tags"
                            value={addFormData.tags}
                            onChange={handleAddFieldChange('tags')}
                            placeholder="Comma separated tags"
                            fullWidth
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={addFormData.featured}
                                        onChange={handleAddFieldChange('featured')}
                                    />
                                }
                                label="Featured Vehicle"
                            />
                        </Box>

                        {vehicleDialogMode === 'add' && (
                            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                    Vehicle Images
                                </Typography>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={imageFiles.length >= 4}
                                    >
                                        Upload Images
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {imageFiles.length}/4 images selected
                                    </Typography>
                                </Box>

                                {addFormErrors.images && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {addFormErrors.images}
                                    </Alert>
                                )}

                                {imagePreviews.length > 0 && (
                                    <Box className="vehicle-upload-previews">
                                        {imagePreviews.map((image, index) => (
                                            <Card key={`${image.name}-${index}`} className="vehicle-upload-preview-card">
                                                <CardMedia
                                                    component="img"
                                                    image={image.preview}
                                                    alt={image.name}
                                                    className="vehicle-upload-preview-image"
                                                />
                                                <Box className="vehicle-upload-preview-meta">
                                                    <Typography variant="body2" className="file-name">
                                                        {image.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {image.size}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveSelectedImage(index)}
                                                    className="vehicle-upload-remove"
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVehicleDialog} disabled={saveLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveVehicle}
                        disabled={saveLoading}
                        startIcon={saveLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    >
                        {saveLoading ? 'Saving...' : vehicleDialogMode === 'edit' ? 'Save Changes' : 'Save Vehicle'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={imageDialogOpen}
                onClose={handleCloseImageDialog}
                maxWidth="lg"
                fullWidth
                sx={{
                    zIndex: 1601,
                    '& .MuiDialog-paper': {
                        width: { xs: 'calc(100% - 32px)', md: 980 },
                        maxWidth: 980,
                        mt: { xs: 10, sm: 12 },
                        mb: 2,
                        maxHeight: 'calc(100% - 104px)',
                    },
                }}
                PaperProps={{ className: 'image-gallery-dialog-paper' }}
            >
                {selectedVehicle && (
                    <>
                        <DialogTitle className="vehicle-dialog-title image-gallery-title">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">
                                    {selectedVehicle.name} - Image Gallery
                                </Typography>
                                <Box className="image-gallery-header-actions">
                                    <input
                                        ref={imageDialogInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(event) => handleImageDialogFileSelect(event, selectedVehicle.id)}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAddImage}
                                        disabled={actionLoadingId === selectedVehicle.id}
                                        startIcon={<AddPhotoIcon />}
                                        className="image-gallery-upload-btn"
                                    >
                                        Add Images
                                    </Button>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box className="image-dialog-content">
                                <Box className="main-image-display">
                                    {selectedVehicle.images.length > 0 ? (
                                        <CardMedia
                                            component="img"
                                            image={selectedVehicle.images[mainImageIndex]}
                                            alt={`${selectedVehicle.name} - Image ${mainImageIndex + 1}`}
                                            className="dialog-main-image"
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: '#f5f5f5',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            <CameraIcon sx={{ fontSize: 48 }} />
                                        </Box>
                                    )}

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
                                        {selectedVehicle.images.length
                                            ? `Image ${mainImageIndex + 1} of ${selectedVehicle.images.length}`
                                            : 'No images available'}
                                    </Box>
                                </Box>

                                <Box className="image-grid">
                                    <Typography variant="subtitle2" gutterBottom className="image-grid-title">
                                        Gallery Images ({selectedVehicle.images.length})
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {selectedVehicle.images.map((img, idx) => (
                                            <Grid item xs={6} sm={4} md={3} key={idx}>
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
                                                            onClick={() => handleOpenImageDeleteDialog(selectedVehicle, idx)}
                                                            color="error"
                                                            disabled={actionLoadingId === selectedVehicle.id}
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
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Dialog
                open={deleteDialogState.open}
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
                sx={{
                    zIndex: 1601,
                    '& .MuiDialog-paper': {
                        mt: { xs: 10, sm: 12 },
                        mb: 3,
                    },
                }}
            >
                <DialogTitle className="vehicle-dialog-title">Delete Vehicle</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                        Are you sure you want to delete this vehicle?
                    </Typography>
                    {deleteDialogState.vehicle && (
                        <Typography variant="body2" color="text.secondary">
                            <strong>{deleteDialogState.vehicle.name}</strong>
                            {deleteDialogState.vehicle.type ? ` • ${deleteDialogState.vehicle.type}` : ''}
                            {deleteDialogState.vehicle.year ? ` • ${deleteDialogState.vehicle.year}` : ''}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} disabled={Boolean(deleteDialogState.vehicle && actionLoadingId === deleteDialogState.vehicle.id)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={Boolean(deleteDialogState.vehicle && actionLoadingId === deleteDialogState.vehicle.id)}
                    >
                        {deleteDialogState.vehicle && actionLoadingId === deleteDialogState.vehicle.id ? 'Deleting...' : 'Delete Vehicle'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={imageDeleteDialogState.open}
                onClose={handleCloseImageDeleteDialog}
                maxWidth="xs"
                fullWidth
                sx={{
                    zIndex: 1601,
                    '& .MuiDialog-paper': {
                        mt: { xs: 10, sm: 12 },
                        mb: 3,
                    },
                }}
            >
                <DialogTitle className="vehicle-dialog-title">Remove Image</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 1.5 }}>
                        Are you sure you want to remove this image?
                    </Typography>
                    {imageDeleteDialogState.vehicle && (
                        <Typography variant="body2" color="text.secondary">
                            Vehicle: <strong>{imageDeleteDialogState.vehicle.name}</strong>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageDeleteDialog} disabled={Boolean(imageDeleteDialogState.vehicle && actionLoadingId === imageDeleteDialogState.vehicle.id)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleRemoveImage}
                        disabled={Boolean(imageDeleteDialogState.vehicle && actionLoadingId === imageDeleteDialogState.vehicle.id)}
                    >
                        {imageDeleteDialogState.vehicle && actionLoadingId === imageDeleteDialogState.vehicle.id ? 'Removing...' : 'Remove Image'}
                    </Button>
                </DialogActions>
            </Dialog>

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
        </Box>
    );
};

export default Vehicles;
