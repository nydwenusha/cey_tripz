import React, { useState, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    Divider,
    Alert,
    Card,
    CardMedia,
    IconButton,
    Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    ArrowBack as ArrowBackIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    AttachMoney as MoneyIcon,
    PhotoCamera as CameraIcon,
    CloudUpload as UploadIcon,
    LocalGasStation as FuelIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    CheckCircle as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import MainLayout from '../../MainLayout'; // Import MainLayout
import './AddVehicles.scss';

// Constants
const vehicleTypes = [

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

const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const transmissionTypes = ['Automatic', 'Manual', 'Semi-Automatic'];
const statusOptions = ['active', 'inactive'];
const colors = [
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

const steps = ['Basic Information', 'Specifications', 'Pricing & Images', 'Review'];

const AddVehicles = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
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
        tags: [],
        featured: false
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [tagsInput, setTagsInput] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState({});

    const handleNextStep = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBackStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        // Check if adding these files exceeds the 4 image limit
        if (imageFiles.length + files.length > 4) {
            alert('You can only upload up to 4 images');
            return;
        }

        // Filter only image files
        const imageFilesArray = files.filter(file =>
            file.type.startsWith('image/')
        );

        // Create preview URLs
        const newPreviews = imageFilesArray.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }));

        // Update state
        setImageFiles(prev => [...prev, ...imageFilesArray]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        // Reset file input
        event.target.value = '';
    };

    const handleRemoveImage = (index) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index].preview);

        // Remove the image from both arrays
        const newImageFiles = [...imageFiles];
        const newImagePreviews = [...imagePreviews];

        newImageFiles.splice(index, 1);
        newImagePreviews.splice(index, 1);

        setImageFiles(newImageFiles);
        setImagePreviews(newImagePreviews);
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current.click();
    };

    const simulateFileUpload = (file, index) => {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(prev => ({
                ...prev,
                [index]: progress
            }));

            if (progress >= 100) {
                clearInterval(interval);
                // Remove progress after completion
                setTimeout(() => {
                    setUploadProgress(prev => {
                        const newProgress = { ...prev };
                        delete newProgress[index];
                        return newProgress;
                    });
                }, 1000);
            }
        }, 100);
    };

    const handleAddTag = () => {
        if (tagsInput.trim() && !formData.tags.includes(tagsInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagsInput.trim()]
            });
            setTagsInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 0:
                if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
                if (!formData.type) newErrors.type = 'Vehicle type is required';
                if (!formData.category) newErrors.category = 'Category is required';
                break;
            case 1:
                if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
                if (!formData.transmission) newErrors.transmission = 'Transmission is required';
                if (!formData.capacity) newErrors.capacity = 'Capacity is required';
                if (!formData.engine) newErrors.engine = 'Engine capacity is required';
                break;
            case 2:
                if (!formData.dailyRate) newErrors.dailyRate = 'Daily rate is required';
                if (!formData.weeklyRate) newErrors.weeklyRate = 'Weekly rate is required';
                if (!formData.monthlyRate) newErrors.monthlyRate = 'Monthly rate is required';
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateStep(activeStep)) {
            try {
                setSuccessMessage('Uploading images...');

                // Simulate file uploads
                const uploadPromises = imageFiles.map((file, index) => {
                    return new Promise((resolve) => {
                        simulateFileUpload(file, index);
                        // Simulate API call delay
                        setTimeout(() => resolve({
                            url: URL.createObjectURL(file),
                            name: file.name,
                            size: file.size
                        }), 2000);
                    });
                });

                const uploadedImages = await Promise.all(uploadPromises);

                // Prepare vehicle data
                const vehicleData = {
                    id: Date.now(),
                    ...formData,
                    images: uploadedImages.map(img => img.url),
                    price: `$${formData.dailyRate}/day`,
                    revenue: "$0",
                    rating: 4.0,
                    totalBookings: 0,
                    duration: "Daily rental",
                    uploadedAt: new Date().toISOString()
                };

                console.log('Vehicle data saved:', vehicleData);

                // Show success message
                setSuccessMessage('Vehicle added successfully!');

                // Redirect to vehicles list after 2 seconds
                setTimeout(() => {
                    navigate('/vehicles');
                }, 2000);

            } catch (error) {
                console.error('Error uploading files:', error);
                setSuccessMessage('Error uploading files. Please try again.');
            }
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box className="form-step">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Vehicle Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="e.g., Suzuki Wagon R Stingray"
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.type} variant="outlined">
                                    <InputLabel>Vehicle Type</InputLabel>
                                    <Select
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                        label="Vehicle Type"
                                        
                                    >
                                        <MenuItem value="" disabled>Select Type</MenuItem>
                                        {vehicleTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.category} variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                        label="Category"
                                    >
                                        {vehicleTypes.map((type) => (
                                            <MenuItem key={type} value={type.toLowerCase()}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe the vehicle features and benefits"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    inputProps={{ min: "2000", max: new Date().getFullYear() }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Color</InputLabel>
                                    <Select
                                        value={formData.color}
                                        onChange={(e) => handleInputChange('color', e.target.value)}
                                        label="Color"
                                    >
                                        {colors.map((color) => (
                                            <MenuItem key={color} value={color}>
                                                {color}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 1:
                return (
                    <Box className="form-step">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.fuelType} variant="outlined">
                                    <InputLabel>Fuel Type</InputLabel>
                                    <Select
                                        value={formData.fuelType}
                                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                                        label="Fuel Type"
                                    >
                                        {fuelTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.transmission} variant="outlined">
                                    <InputLabel>Transmission</InputLabel>
                                    <Select
                                        value={formData.transmission}
                                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                                        label="Transmission"
                                    >
                                        {transmissionTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Engine Capacity (cc)"
                                    value={formData.engine}
                                    onChange={(e) => handleInputChange('engine', e.target.value)}
                                    placeholder="e.g., 998"
                                    required
                                    error={!!errors.engine}
                                    helperText={errors.engine}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mileage (km/l)"
                                    value={formData.mileage}
                                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                                    placeholder="e.g., 25"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Capacity (persons)"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                                    placeholder="e.g., 4"
                                    required
                                    error={!!errors.capacity}
                                    helperText={errors.capacity}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        label="Status"
                                    >
                                        {statusOptions.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Box className="tags-section">
                                    <Typography variant="subtitle1" gutterBottom>
                                        Tags
                                    </Typography>
                                    <Box display="flex" gap={1} mb={2}>
                                        <TextField
                                            size="small"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add tags (press Enter)"
                                            variant="outlined"
                                            sx={{ flex: 1 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={handleAddTag}
                                            startIcon={<AddIcon />}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {formData.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => handleRemoveTag(tag)}
                                                deleteIcon={<DeleteIcon />}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.featured}
                                            onChange={(e) => handleInputChange('featured', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Mark as Featured Vehicle"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box className="form-step">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Pricing
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Daily Rate"
                                    type="number"
                                    value={formData.dailyRate}
                                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    error={!!errors.dailyRate}
                                    helperText={errors.dailyRate}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Weekly Rate"
                                    type="number"
                                    value={formData.weeklyRate}
                                    onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    error={!!errors.weeklyRate}
                                    helperText={errors.weeklyRate}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Monthly Rate"
                                    type="number"
                                    value={formData.monthlyRate}
                                    onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    error={!!errors.monthlyRate}
                                    helperText={errors.monthlyRate}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" gutterBottom color="primary">
                                    Vehicle Images
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
                                    Upload up to 4 images of your vehicle (JPG, PNG, WEBP)
                                </Typography>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                />

                                {/* Upload button */}
                                <Box className="upload-section">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<UploadIcon />}
                                        onClick={handleTriggerFileInput}
                                        className="upload-button"
                                    >
                                        Select Images
                                    </Button>
                                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                                        {imageFiles.length}/4 images selected
                                    </Typography>
                                </Box>

                                {/* Image previews */}
                                {imagePreviews.length > 0 && (
                                    <Box className="image-previews">
                                        <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                                            Selected Images:
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {imagePreviews.map((preview, index) => (
                                                <Grid item xs={12} sm={6} md={3} key={index}>
                                                    <Card className="image-preview-card">
                                                        <Box className="image-preview-container">
                                                            <CardMedia
                                                                component="img"
                                                                image={preview.preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="preview-image"
                                                            />
                                                            {uploadProgress[index] !== undefined && (
                                                                <Box className="upload-progress">
                                                                    <Box
                                                                        className="progress-bar"
                                                                        style={{ width: `${uploadProgress[index]}%` }}
                                                                    />
                                                                    <Typography variant="caption" className="progress-text">
                                                                        {uploadProgress[index]}%
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                            <IconButton
                                                                size="small"
                                                                className="remove-image-btn"
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                <CloseIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                        <Box className="image-info">
                                                            <Typography variant="caption" noWrap title={preview.name}>
                                                                {preview.name.length > 15
                                                                    ? `${preview.name.substring(0, 15)}...`
                                                                    : preview.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {preview.size}
                                                            </Typography>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* Upload tips */}
                                <Alert severity="info" sx={{ mt: 3 }}>
                                    <Typography variant="body2">
                                        <strong>Tips:</strong> Use high-quality images (min. 800x600px).<br />
                                        Supported formats: JPG, PNG, WEBP. Max size: 5MB per image.
                                    </Typography>
                                </Alert>
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 3:
                return (
                    <Box className="form-step">
                        {successMessage && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {successMessage}
                            </Alert>
                        )}

                        <Typography variant="h5" gutterBottom color="primary">
                            Review Vehicle Details
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Name:</Typography>
                                    <Typography variant="body1" fontWeight="600">{formData.name}</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" color="textSecondary">Type:</Typography>
                                    <Typography variant="body1" fontWeight="600">{formData.type}</Typography>
                                </Card>
                            </Grid>

                            {/* Other summary cards... */}

                            {/* Image summary */}
                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        Images:
                                    </Typography>
                                    {imagePreviews.length > 0 ? (
                                        <Grid container spacing={1}>
                                            {imagePreviews.map((preview, index) => (
                                                <Grid item xs={3} key={index}>
                                                    <Avatar
                                                        src={preview.preview}
                                                        variant="rounded"
                                                        sx={{ width: 60, height: 60 }}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No images selected
                                        </Typography>
                                    )}
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            default:
                return null;
        }
    };

    // Wrap the content with MainLayout
    return (
        <MainLayout>
            <Container maxWidth="lg" className="add-vehicles-page">
                <Box sx={{ py: 4 }}>
                    {/* Header */}
                    <Box className="page-header">
                        <Box>
                            <Typography variant="h4" className="page-title">
                                Add New Vehicle
                            </Typography>
                            <Typography variant="body1" color="textSecondary" className="page-subtitle">
                                Fill in the vehicle details step by step
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/vehicles')}
                            className="back-button"
                        >
                            Back to Vehicles
                        </Button>
                    </Box>

                    {/* Form Container */}
                    <Paper elevation={0} className="form-container">
                        {/* Stepper */}
                        <Stepper activeStep={activeStep} alternativeLabel className="form-stepper">
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Step Content */}
                        <Box className="step-content">
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Navigation Buttons */}
                        <Box className="form-actions">
                            <Box display="flex" justifyContent="space-between" width="100%">
                                <Button
                                    onClick={handleBackStep}
                                    disabled={activeStep === 0 || successMessage}
                                    variant="outlined"
                                    className="action-button back"
                                >
                                    Back
                                </Button>

                                <Box display="flex" gap={2}>
                                    <Button
                                        onClick={() => navigate('/vehicles')}
                                        color="inherit"
                                        variant="outlined"
                                        className="action-button cancel"
                                        disabled={successMessage}
                                    >
                                        Cancel
                                    </Button>

                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmit}
                                            startIcon={<CheckIcon />}
                                            className="action-button submit"
                                            disabled={successMessage || imageFiles.some((_, index) => uploadProgress[index] !== undefined)}
                                        >
                                            {successMessage ? 'Processing...' : 'Add Vehicle'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleNextStep}
                                            className="action-button next"
                                            disabled={successMessage}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </MainLayout>
    );
};

export default AddVehicles;