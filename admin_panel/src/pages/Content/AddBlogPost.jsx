import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  Paper,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Container,
  InputAdornment,
  Popover,
  TextField as MuiTextField,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Close as CloseIcon,
  Visibility as PreviewIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  Image as ImageIconEditor,
  Link as LinkIcon,
  List as ListIcon,
  FormatListNumbered as ListNumberedIcon,
  Settings as SettingsIcon,
  FormatQuote as QuoteIcon,
  Code as CodeIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  FormatColorText as ColorIcon,
  FormatSize as SizeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import './AddBlogPost.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import api from '../../services/api/api';

const AddBlogPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const contentEditorRef = useRef(null);

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Tag dialog state
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  const [tagError, setTagError] = useState('');

  // Link popover state
  const [linkPopover, setLinkPopover] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: null,
    featuredImagePreview: '',
    author: '',
    visibility: 'public',
    allowComments: true,
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [categories, setCategories] = useState([]);

  const [allTags, setAllTags] = useState([
    'Sri Lanka', 'Beach', 'Adventure', 'Culture', 'Wildlife',
    'Budget Travel', 'Luxury', 'Family', 'Solo Travel', 'Honeymoon',
    'Backpacking', 'Food', 'Photography', 'Trekking', 'Wildlife Safari'
  ]);

  useEffect(() => {
    // Fetch categories from API
    api.get('/blogPostCategories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const popularTags = [
    'Sri Lanka', 'Beach', 'Adventure', 'Culture', 'Wildlife',
    'Budget Travel', 'Luxury', 'Family', 'Solo Travel'
  ];

  const [tagInput, setTagInput] = useState('');

  // Handle category addition
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Category name is required');
      return;
    }

    setAddingCategory(true);
    setCategoryError('');

    try {
      const response = await api.post('/addBlogPostCategory', {
        category: newCategoryName.trim(),
      });

      const createdCategory = response.data;

      setCategories((prev) => {
        const nextCategories = Array.isArray(prev) ? [...prev] : [];
        const exists = nextCategories.some((category) => category.id === createdCategory.id || category.name === createdCategory.name);

        if (!exists) {
          nextCategories.push(createdCategory);
        }

        return nextCategories;
      });

      setFormData((prev) => ({
        ...prev,
        category: createdCategory.name,
      }));

      handleCloseCategoryDialog();
    } catch (err) {
      console.error('Error adding category:', err);
      setCategoryError(err.response?.data?.message || 'Failed to add category. Please try again.');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setNewCategoryName('');
    setCategoryError('');
  };

  // Handle tag addition
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      setTagError('Tag name is required');
      return;
    }

    // Check if tag already exists
    const tagExists = allTags.some(
      tag => tag.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (tagExists) {
      setTagError('Tag already exists');
      return;
    }

    setAddingTag(true);
    setTagError('');

    try {
      const nextTag = newTagName.trim();

      setAllTags((prev) => [...prev, nextTag]);
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.includes(nextTag) ? prev.tags : [...prev.tags, nextTag],
      }));

      setTagDialogOpen(false);
      setNewTagName('');
    } finally {
      setAddingTag(false);
    }
  };

  const handleCloseTagDialog = () => {
    setTagDialogOpen(false);
    setNewTagName('');
    setTagError('');
  };

  // Rich text editor functions
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    const content = contentEditorRef.current?.innerHTML || '';
    setFormData(prev => ({ ...prev, content }));
    contentEditorRef.current?.focus();
  }, []);

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleAlignLeft = () => execCommand('justifyLeft');
  const handleAlignCenter = () => execCommand('justifyCenter');
  const handleAlignRight = () => execCommand('justifyRight');
  const handleInsertUnorderedList = () => execCommand('insertUnorderedList');
  const handleInsertOrderedList = () => execCommand('insertOrderedList');
  const handleUndo = () => execCommand('undo');
  const handleRedo = () => execCommand('redo');
  const handleBlockQuote = () => execCommand('formatBlock', '<blockquote>');
  const handleInsertCode = () => execCommand('formatBlock', '<pre>');

  const handleInsertLink = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (selectedText) {
      setLinkText(selectedText);
      setLinkPopover(event.currentTarget);
    } else {
      alert('Please select text to insert a link');
    }
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleSaveLink = () => {
    if (linkUrl && linkText) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.href = linkUrl;
      link.textContent = linkText;
      link.target = '_blank';
      link.style.color = '#667eea';
      link.style.textDecoration = 'underline';

      range.deleteContents();
      range.insertNode(link);

      const content = contentEditorRef.current?.innerHTML || '';
      setFormData(prev => ({ ...prev, content }));

      setLinkPopover(null);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleFontSize = () => {
    const size = prompt('Enter font size (1-7):', '3');
    if (size) {
      execCommand('fontSize', size);
    }
  };

  const handleTextColor = () => {
    const color = prompt('Enter color (e.g., red, #ff0000):', '#000000');
    if (color) {
      execCommand('foreColor', color);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleContentChange = (e) => {
    const content = e.target.innerHTML;
    setFormData(prev => ({ ...prev, content }));
  };

  const getNormalizedEditorContent = useCallback(() => {
    const rawHtml = contentEditorRef.current?.innerHTML || formData.content || '';
    const trimmedText = rawHtml
      .replace(/<br\s*\/?>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .trim();

    return trimmedText ? rawHtml : '';
  }, [formData.content]);



  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      handleBold();
    } else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      handleItalic();
    } else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      handleUnderline();
    } else if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      handleUndo();
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          featuredImage: file,
          featuredImagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      featuredImage: null,
      featuredImagePreview: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleAddPopularTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
  };

  const handleSubmit = async (targetStatus = 'pending') => {
    try {
      setLoading(true);
      setError('');

      const normalizedContent = getNormalizedEditorContent();

      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.category) {
        setError('Category is required');
        setLoading(false);
        return;
      }

      if (!normalizedContent) {
        setError('Content is required');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', normalizedContent);
      data.append('category', formData.category);
      data.append('status', formData.publishDate && targetStatus === 'published' ? 'scheduled' : targetStatus);
      data.append('seoTitle', formData.seoTitle || '');
      data.append('seoDescription', formData.seoDescription || '');
      data.append('seoKeywords', formData.seoKeywords || '');
      data.append('visibility', formData.visibility || 'public');
      data.append('allowComments', formData.allowComments ? 1 : 0);
      data.append('scheduled_date', formData.publishDate || '');
      data.append('meta_title', formData.seoTitle || '');
      data.append('meta_description', formData.seoDescription || '');
      data.append('is_featured', 0);

      formData.tags.forEach((tag, index) => {
        data.append(`tags[${index}]`, tag);
      });

      if (formData.featuredImage) {
        data.append('featuredImage', formData.featuredImage);
      }

      await api.post('/addBlogPost', data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/blogs');
      }, 2000);

    } catch (err) {
      console.error('Error saving post:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => handleSubmit('draft');
  const handleSavePending = () => handleSubmit('pending');

  const textEditorTools = [
    { icon: <UndoIcon />, action: handleUndo, title: 'Undo (Ctrl+Z)' },
    { icon: <RedoIcon />, action: handleRedo, title: 'Redo (Ctrl+Y)' },
    { divider: true },
    { icon: <BoldIcon />, action: handleBold, title: 'Bold (Ctrl+B)' },
    { icon: <ItalicIcon />, action: handleItalic, title: 'Italic (Ctrl+I)' },
    { icon: <UnderlineIcon />, action: handleUnderline, title: 'Underline (Ctrl+U)' },
    { divider: true },
    { icon: <AlignLeftIcon />, action: handleAlignLeft, title: 'Align Left' },
    { icon: <AlignCenterIcon />, action: handleAlignCenter, title: 'Align Center' },
    { icon: <AlignRightIcon />, action: handleAlignRight, title: 'Align Right' },
    { divider: true },
    { icon: <ListIcon />, action: handleInsertUnorderedList, title: 'Bullet List' },
    { icon: <ListNumberedIcon />, action: handleInsertOrderedList, title: 'Numbered List' },
    { divider: true },
    { icon: <LinkIcon />, action: handleInsertLink, title: 'Insert Link' },
    { icon: <ImageIconEditor />, action: handleInsertImage, title: 'Insert Image' },
    { divider: true },
    { icon: <QuoteIcon />, action: handleBlockQuote, title: 'Block Quote' },
    { icon: <CodeIcon />, action: handleInsertCode, title: 'Code Block' },
    { divider: true },
    { icon: <ColorIcon />, action: handleTextColor, title: 'Text Color' },
    { icon: <SizeIcon />, action: handleFontSize, title: 'Font Size' },
  ];

  return (
    <Box className="add-blog-page">
      {loading && <LinearProgress className="loading-bar" />}

      <form
        className="blog-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit('pending');
        }}
      >

        {/* Header with Theme Styling */}
        <Container maxWidth="xl" className="header-container" sx={{ mt: 3 }}>
          <PageHeader
            title="Create New Post"
            subtitle="Share your travel stories and inspire others"
            showBackButton
            onBackClick={() => navigate('/blogs')}
            secondaryActions={[
              {
                label: 'Save Draft',
                onClick: handleSaveDraft,
                icon: <SaveIcon />,
                variant: 'outlined',
              },
              {
                label: 'Preview',
                onClick: () => setPreviewOpen(true),
                icon: <PreviewIcon />,
                variant: 'outlined',
              },
            ]}
            primaryAction={{
              label: 'Save',
              onClick: handleSavePending,
              icon: <SaveIcon />,
            }}
            variant="gradient"
          />
        </Container>

        {/* Main Content */}

        <Container maxWidth="xl" className="main-container">
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} lg={8}>
              {/* Title Section */}
              <Paper className="form-card title-card" elevation={0}>
                <Box className="card-header">
                  <Box className="header-badge">
                    <TitleIcon className="card-icon" />
                    <Typography variant="h6">Post Title</Typography>
                  </Box>
                  <Box className="header-chip">
                    <Chip
                      label="Required"
                      size="small"
                      className="required-chip"
                    />
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Enter an engaging title..."
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  variant="outlined"
                  className="title-field"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" className={`char-count ${formData.title.length > 90 ? 'warning' : ''}`}>
                          {formData.title.length}/100
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box className="title-tips">
                  <Typography variant="caption" className="tips-title">
                    💡 Title Tips:
                  </Typography>
                  <Box className="tips-list">
                    <Typography variant="caption">• Use numbers for list posts (e.g., "10 Best Beaches")</Typography>
                    <Typography variant="caption">• Include keywords for SEO</Typography>
                    <Typography variant="caption">• Keep it under 60 characters for better search results</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Featured Image */}
              <Paper className="form-card" elevation={0}>
                <Box className="card-header">
                  <ImageIcon className="card-icon" />
                  <Typography variant="h6">Featured Image</Typography>
                </Box>
                {formData.featuredImagePreview ? (
                  <Box className="image-preview-box">
                    <img src={formData.featuredImagePreview} alt="Preview" className="preview-img" />
                    <IconButton className="remove-img-btn" onClick={removeImage}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box className="upload-box" onClick={() => fileInputRef.current.click()}>
                    <AddPhotoIcon className="upload-icon" />
                    <Typography variant="body1">Click to upload featured image</Typography>
                    <Typography variant="caption">Recommended: 1200x800px (Max 5MB)</Typography>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </Box>
                )}
              </Paper>

              {/* Excerpt */}
              <Paper className="form-card" elevation={0}>
                <Box className="card-header">
                  <DescriptionIcon className="card-icon" />
                  <Typography variant="h6">Excerpt</Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write a short summary of your post..."
                  value={formData.excerpt}
                  onChange={handleInputChange('excerpt')}
                  variant="outlined"
                  helperText={`${formData.excerpt.length}/200 characters - This will appear in blog listings and search results`}
                />
              </Paper>

              {/* Content Editor */}
              <Paper className="form-card" elevation={0}>
                <Box className="card-header">
                  <DescriptionIcon className="card-icon" />
                  <Typography variant="h6">Content</Typography>
                </Box>
                <Box className="editor-toolbar">
                  {textEditorTools.map((tool, index) => (
                    tool.divider ? (
                      <Divider key={index} orientation="vertical" flexItem className="toolbar-divider" />
                    ) : (
                      <IconButton
                        key={index}
                        size="small"
                        className="toolbar-btn"
                        onClick={tool.action}
                        title={tool.title}
                      >
                        {tool.icon}
                      </IconButton>
                    )
                  ))}
                </Box>
                <div
                  ref={contentEditorRef}
                  className="content-editor"
                  contentEditable
                  dir="ltr"
                  onInput={handleContentChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  suppressContentEditableWarning
                />
                <Typography variant="caption" color="text.secondary" className="editor-hint">
                  💡 Tip: Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline
                </Typography>
              </Paper>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} lg={4}>
              {/* Category with Add Button */}
              <Paper className="sidebar-card" elevation={0}>
                <Box className="card-header">
                  <CategoryIcon className="card-icon" />
                  <Typography variant="h6">Category</Typography>
                </Box>
                <Box className="category-select-wrapper">
                  <FormControl fullWidth>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      displayEmpty
                      className="category-select"
                    >
                      <MenuItem value="" disabled>Select a category</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    className="add-category-btn"
                    onClick={() => setCategoryDialogOpen(true)}
                    title="Add New Category"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Paper>

              {/* Tags with Add Button */}
              <Paper className="sidebar-card" elevation={0}>
                <Box className="card-header">
                  <TagIcon className="card-icon" />
                  <Typography variant="h6">Tags</Typography>
                </Box>
                <Box className="tag-input-wrapper">
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />

                  <IconButton
                    className="add-tag-btn"
                    onClick={() => setTagDialogOpen(true)}
                    title="Add New Tag"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box className="tags-wrapper">
                  {formData.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                      className="tag-chip"
                    />
                  ))}
                </Box>
                <Typography variant="caption" className="popular-label">
                  Popular tags:
                </Typography>
                <Box className="popular-wrapper">
                  {popularTags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleAddPopularTag(tag)}
                      className="popular-tag"
                    />
                  ))}
                </Box>
              </Paper>

              {/* Settings */}
              <Paper className="sidebar-card" elevation={0}>
                <Box className="card-header">
                  <SettingsIcon className="card-icon" />
                  <Typography variant="h6">Post Settings</Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allowComments}
                      onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                    />
                  }
                  label="Allow Comments"
                  className="settings-item"
                />

                <FormControl component="fieldset" className="settings-item">
                  <FormLabel component="legend">Visibility</FormLabel>
                  <RadioGroup
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    row
                  >
                    <FormControlLabel value="public" control={<Radio />} label={
                      <Box className="visibility-label">
                        <PublicIcon fontSize="small" /> Public
                      </Box>
                    } />
                    <FormControlLabel value="private" control={<Radio />} label={
                      <Box className="visibility-label">
                        <LockIcon fontSize="small" /> Private
                      </Box>
                    } />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Schedule Publish"
                  value={formData.publishDate}
                  onChange={handleInputChange('publishDate')}
                  InputLabelProps={{ shrink: true }}
                  className="schedule-field"
                />
              </Paper>

              {/* SEO */}
              <Paper className="sidebar-card" elevation={0}>
                <Box className="card-header">
                  <SettingsIcon className="card-icon" />
                  <Typography variant="h6">SEO Settings</Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="SEO Title"
                  placeholder="Leave blank to use post title"
                  value={formData.seoTitle}
                  onChange={handleInputChange('seoTitle')}
                  className="seo-field"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Meta Description"
                  multiline
                  rows={2}
                  placeholder="Write a meta description for search engines"
                  value={formData.seoDescription}
                  onChange={handleInputChange('seoDescription')}
                  className="seo-field"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Meta Keywords"
                  placeholder="Enter keywords separated by commas"
                  value={formData.seoKeywords}
                  onChange={handleInputChange('seoKeywords')}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>


        {/* Add Category Dialog */}
        <Dialog
          open={categoryDialogOpen}
          onClose={handleCloseCategoryDialog}
          maxWidth="sm"
          fullWidth
          className="category-dialog"
        >
          <DialogTitle className="category-dialog-title">
            <Box className="dialog-title-content">
              <CategoryIcon className="dialog-icon" />
              <Typography variant="h6">Add New Category</Typography>
            </Box>
            <IconButton onClick={handleCloseCategoryDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box className="category-form">
              <TextField
                fullWidth
                label="Category Name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                margin="normal"
                variant="outlined"
                error={!!categoryError}
                helperText={categoryError}
                autoFocus
              />
            </Box>

          </DialogContent>
          <DialogActions className="category-dialog-actions">
            <Button onClick={handleCloseCategoryDialog} className="cancel-btn">
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              variant="contained"
              className="add-category-btn"
              disabled={addingCategory || !newCategoryName.trim()}
              startIcon={addingCategory ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {addingCategory ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Tag Dialog */}
        <Dialog
          open={tagDialogOpen}
          onClose={handleCloseTagDialog}
          maxWidth="sm"
          fullWidth
          className="tag-dialog"
        >
          <DialogTitle className="tag-dialog-title">
            <Box className="dialog-title-content">
              <TagIcon className="dialog-icon" />
              <Typography variant="h6">Add New Tag</Typography>
            </Box>
            <IconButton onClick={handleCloseTagDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box className="tag-form">
              <TextField
                fullWidth
                label="Tag Name"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                margin="normal"
                variant="outlined"
                error={!!tagError}
                helperText={tagError}
                autoFocus
              />
            </Box>
          </DialogContent>
          <DialogActions className="tag-dialog-actions">
            <Button onClick={handleCloseTagDialog} className="cancel-btn">
              Cancel
            </Button>
            <Button
              onClick={handleAddTag}
              variant="contained"
              className="add-tag-btn"
              disabled={addingTag || !newTagName.trim()}
              startIcon={addingTag ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {addingTag ? 'Adding...' : 'Add Tag'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Link Popover */}
        <Popover
          open={Boolean(linkPopover)}
          anchorEl={linkPopover}
          onClose={() => setLinkPopover(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className="link-popover"
        >
          <Box className="link-popover-content">
            <Typography variant="subtitle2" className="popover-title">
              Insert Link
            </Typography>
            <MuiTextField
              size="small"
              placeholder="Link URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              fullWidth
              margin="dense"
            />
            <MuiTextField
              size="small"
              placeholder="Link Text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              fullWidth
              margin="dense"
            />
            <Box className="popover-actions">
              <Button size="small" onClick={() => setLinkPopover(null)}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveLink}
                disabled={!linkUrl || !linkText}
              >
                Insert
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle className="preview-header">
            <Typography variant="h6">Post Preview</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers className="preview-body">
            {formData.featuredImagePreview && (
              <img src={formData.featuredImagePreview} alt="Preview" className="preview-img-full" />
            )}
            <Typography variant="h4" className="preview-title">
              {formData.title || 'Untitled Post'}
            </Typography>
            <Box className="preview-meta">
              <Chip label={formData.category || 'Uncategorized'} size="small" className="preview-category" />
              <Typography variant="caption">
                {formData.tags.map(tag => `#${tag}`).join(' • ')}
              </Typography>
            </Box>
            <Typography variant="subtitle1" className="preview-excerpt">
              {formData.excerpt}
            </Typography>
            <Divider />
            <div
              className="preview-content-text"
              dangerouslySetInnerHTML={{ __html: formData.content || 'No content yet...' }}
            />
          </DialogContent>
          <DialogActions className="preview-actions">
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button type="button" variant="contained" onClick={handleSavePending}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbars */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success">Post saved successfully! Redirecting...</Alert>
        </Snackbar>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </form >
    </Box>

  );
};

export default AddBlogPost;
