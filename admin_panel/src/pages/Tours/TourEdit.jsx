import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Divider,
  Paper,
  InputAdornment,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  FormHelperText
} from '@mui/material';
import {
  Save,
  Cancel,
  Delete,
  Add,
  Remove,
  PhotoCamera,
  AttachMoney,
  AccessTime,
  Group,
  Description,
  LocationOn,
  Category,
  Star
} from '@mui/icons-material';
import './TourEdit.scss';
import MainLayout from '../../MainLayout';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const TourEdit = ({ initialData = null, onSave, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    destination: initialData?.destination || '',
    price: initialData?.price || '',
    status: initialData?.status || 'Active',
    category: initialData?.category || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    maxParticipants: initialData?.maxParticipants || '',
    difficulty: initialData?.difficulty || 'Medium',
    inclusions: initialData?.inclusions || ['Transport', 'Guide', 'Meals'],
    exclusions: initialData?.exclusions || ['Personal Expenses', 'Tips'],
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
    highlights: initialData?.highlights || [''],
    meetingPoint: initialData?.meetingPoint || '',
    requirements: initialData?.requirements || '',
    cancellationPolicy: initialData?.cancellationPolicy || 'standard'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');

  const steps = ['Basic Information', 'Details & Pricing', 'Additional Info'];

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
    'Nuwara Eliya'
  ];

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
    'Photography'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Difficult', 'Challenging'];
  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible (Full refund 24h before)' },
    { value: 'standard', label: 'Standard (50% refund 48h before)' },
    { value: 'strict', label: 'Strict (No refund 72h before)' },
    { value: 'non-refundable', label: 'Non-refundable' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Tour name is required';
      if (!formData.destination) newErrors.destination = 'Destination is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    if (step === 1) {
      if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
      if (!formData.duration) newErrors.duration = 'Duration is required';
      if (!formData.maxParticipants || formData.maxParticipants <= 0) {
        newErrors.maxParticipants = 'Valid participant count is required';
      }
      if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()]
      }));
      setNewInclusion('');
    }
  };

  const handleRemoveInclusion = (inclusion) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter(item => item !== inclusion)
    }));
  };

  const handleAddExclusion = () => {
    if (newExclusion.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()]
      }));
      setNewExclusion('');
    }
  };

  const handleRemoveExclusion = (exclusion) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter(item => item !== exclusion)
    }));
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const finalData = {
        ...formData,
        price: Number(formData.price),
        maxParticipants: Number(formData.maxParticipants)
      };

      onSave(finalData);
      setSuccessMessage(initialData ? 'Tour updated successfully!' : 'Tour created successfully!');
    }
  };

  const handleKeyPress = (event, callback) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <MainLayout>
      <Box className="tour-edit">
        {/* Page Header */}
        <PageHeader props={{title: initialData ? 'Edit Tour' : 'Create New Tour', cancel: onCancel, submit: handleSubmit, saveButtonText:'Save', cancelButtonText: 'Cancel'}} />
        

          
        <Stepper activeStep={activeStep} className="form-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card className="form-card">
          <CardContent>
            {activeStep === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" className="section-title">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Tour Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="e.g., Sigiriya Adventure Tour"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleChange('status')}
                      label="Status"
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.destination} required>
                    <InputLabel>Destination</InputLabel>
                    <Select
                      value={formData.destination}
                      onChange={handleChange('destination')}
                      label="Destination"
                    >
                      {destinations.map((dest) => (
                        <MenuItem key={dest} value={dest}>
                          {dest}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.destination && <FormHelperText>{errors.destination}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.category} required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={handleChange('category')}
                      label="Category"
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    error={!!errors.description}
                    helperText={errors.description}
                    multiline
                    rows={4}
                    placeholder="Describe the tour experience, attractions, and unique features..."
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box className="tags-section">
                    <Paper className="tags-input-paper">
                      <Box className="tags-input-container">
                        <TextField
                          fullWidth
                          placeholder="Add a tag (e.g., Family-friendly, Photography)"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                          size="small"
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                        />
                        <IconButton onClick={handleAddTag} size="small">
                          <Add />
                        </IconButton>
                      </Box>
                    </Paper>
                    <Box className="tags-display">
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          className="tag-chip"
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" className="section-title">
                    Pricing & Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price (USD)"
                    type="number"
                    value={formData.price}
                    onChange={handleChange('price')}
                    error={!!errors.price}
                    helperText={errors.price}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={formData.duration}
                    onChange={handleChange('duration')}
                    error={!!errors.duration}
                    helperText={errors.duration}
                    placeholder="e.g., 2 days, 1 week"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Participants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={handleChange('maxParticipants')}
                    error={!!errors.maxParticipants}
                    helperText={errors.maxParticipants}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.difficulty} required>
                    <InputLabel>Difficulty Level</InputLabel>
                    <Select
                      value={formData.difficulty}
                      onChange={handleChange('difficulty')}
                      label="Difficulty Level"
                    >
                      {difficultyLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className="inclusions-paper">
                    <Typography variant="subtitle1" gutterBottom>
                      Inclusions
                    </Typography>
                    <Box className="list-input-container">
                      <TextField
                        fullWidth
                        placeholder="Add inclusion (e.g., Hotel Pickup)"
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddInclusion)}
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton onClick={handleAddInclusion} size="small">
                        <Add />
                      </IconButton>
                    </Box>
                    <Box className="list-items">
                      {formData.inclusions.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveInclusion(item)}
                          className="list-chip"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper className="exclusions-paper">
                    <Typography variant="subtitle1" gutterBottom>
                      Exclusions
                    </Typography>
                    <Box className="list-input-container">
                      <TextField
                        fullWidth
                        placeholder="Add exclusion (e.g., Travel Insurance)"
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddExclusion)}
                        size="small"
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton onClick={handleAddExclusion} size="small">
                        <Add />
                      </IconButton>
                    </Box>
                    <Box className="list-items">
                      {formData.exclusions.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveExclusion(item)}
                          className="list-chip"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" className="section-title">
                    Additional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tour Highlights
                  </Typography>
                  <Paper className="highlights-paper">
                    <Box className="highlights-input-container">
                      <TextField
                        fullWidth
                        placeholder="Add a highlight (e.g., Sunrise view from Sigiriya Rock)"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddHighlight)}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton onClick={handleAddHighlight}>
                        <Add />
                      </IconButton>
                    </Box>
                    <Box className="highlights-list">
                      {formData.highlights.map((highlight, index) => (
                        <Box key={index} className="highlight-item">
                          <Typography variant="body2">{highlight}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveHighlight(index)}
                            className="remove-highlight"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Meeting Point"
                    value={formData.meetingPoint}
                    onChange={handleChange('meetingPoint')}
                    placeholder="e.g., Hotel Lobby, Central Station"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Cancellation Policy</InputLabel>
                    <Select
                      value={formData.cancellationPolicy}
                      onChange={handleChange('cancellationPolicy')}
                      label="Cancellation Policy"
                    >
                      {cancellationPolicies.map((policy) => (
                        <MenuItem key={policy.value} value={policy.value}>
                          {policy.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Requirements & Notes"
                    value={formData.requirements}
                    onChange={handleChange('requirements')}
                    multiline
                    rows={3}
                    placeholder="Any special requirements, what to bring, health considerations..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Paper className="featured-section">
                    <Box className="featured-content">
                      <Star className="featured-icon" />
                      <Box className="featured-text">
                        <Typography variant="subtitle1">Featured Tour</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Featured tours appear prominently on the homepage
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.featured}
                            onChange={handleSwitchChange('featured')}
                            color="warning"
                          />
                        }
                        label={formData.featured ? "Featured" : "Not Featured"}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}

            <Box className="stepper-actions">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className="back-button"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  className="submit-button"
                >
                  {initialData ? 'Update Tour' : 'Create Tour'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  className="next-button"
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" className="success-alert">
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default TourEdit;