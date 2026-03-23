import React, { useState, useRef, useCallback } from 'react';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  Publish as PublishIcon,
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
} from '@mui/icons-material';
import './AddBlogPost.scss';
import PageHeader from '../../components/layout/PageHeader/PageHeader';

const AddBlogPost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const contentEditorRef = useRef(null);
  
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
    visibility: 'public',
    allowComments: true,
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const categories = [
    { id: 1, name: 'Destinations', color: '#ff9800' },
    { id: 2, name: 'Travel Tips', color: '#4caf50' },
    { id: 3, name: 'Sustainability', color: '#2196f3' },
    { id: 4, name: 'Food & Drink', color: '#f44336' },
    { id: 5, name: 'Photography', color: '#9c27b0' },
    { id: 6, name: 'Adventure', color: '#ff5722' },
    { id: 7, name: 'Culture', color: '#3f51b5' },
  ];

  const popularTags = [
    'Sri Lanka', 'Beach', 'Adventure', 'Culture', 'Wildlife',
    'Budget Travel', 'Luxury', 'Family', 'Solo Travel'
  ];

  const [tagInput, setTagInput] = useState('');

  // Rich text editor functions
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    // Update content state after command
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
      
      // Update content
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

  const handleSubmit = async (publish = false) => {
    setLoading(true);
    setError('');
    
    if (!formData.title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Please enter an excerpt');
      setLoading(false);
      return;
    }
    if (!formData.content.trim()) {
      setError('Please enter content');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate('/blogs');
      }, 1500);
    } catch (err) {
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

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
            label: 'Publish',
            onClick: handlePublish,
            icon: <PublishIcon />,
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
            {/* Category */}
            <Paper className="sidebar-card" elevation={0}>
              <Box className="card-header">
                <CategoryIcon className="card-icon" />
                <Typography variant="h6">Category</Typography>
              </Box>
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
                      <Box className="category-option">
                        <Box className="category-dot" sx={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* Tags */}
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
                <Button onClick={addTag} variant="contained" size="small">
                  Add
                </Button>
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
          <Button variant="contained" onClick={handlePublish}>Publish Now</Button>
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
    </Box>
  );
};

export default AddBlogPost;