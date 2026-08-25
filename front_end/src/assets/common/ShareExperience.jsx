import React, { useEffect, useState } from 'react';
import './../css/ShareExperience.scss';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api/api';

const initialFormData = {
  customerName: '',
  stars: 5,
  tourName: '',
  comment: '',
  images: [],
};

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_IMAGE_COUNT = 10;
const FALLBACK_STORY_IMAGE = 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

const mapReviewToTravelerStory = (review) => {
  const images = Array.isArray(review.images) ? review.images : [];
  const coverImage = images.find((image) => image.is_cover) || images[0];
  const rating = Number(review.rating) || 5;

  return {
    id: `review-${review.id}`,
    reviewId: review.id,
    name: review.customer_name || 'Cey Tripz Traveler',
    story: review.comment || '',
    stars: Math.max(1, Math.min(5, Math.round(rating))),
    location: review.tour_name || 'Sri Lanka',
    imageUrl: coverImage?.image_url || FALLBACK_STORY_IMAGE,
    source: 'published-review',
  };
};

const ShareExperience = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [publishedStories, setPublishedStories] = useState([]);
  const [publishedReviewTotal, setPublishedReviewTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const navigate = useNavigate();
  const travelerStories = publishedStories;

  useEffect(() => {
    let isActive = true;

    const fetchPublishedReviews = async () => {
      try {
        const response = await api.get('/reviews', {
          params: {
            limit: 8,
          },
        });
        const reviews = Array.isArray(response.data?.reviews) ? response.data.reviews : [];
        const stories = reviews
          .filter((review) => review.status === 'published')
          .map(mapReviewToTravelerStory)
          .filter((story) => story.story.trim());

        if (isActive) {
          setPublishedStories(stories);
          setPublishedReviewTotal(Number(response.data?.pagination?.total) || stories.length);
        }
      } catch (error) {
        console.error('Error loading published traveler stories:', error);
      } finally {
        if (isActive) {
          setReviewsLoading(false);
        }
      }
    };

    fetchPublishedReviews();

    const intervalId = window.setInterval(fetchPublishedReviews, 30000);
    window.addEventListener('focus', fetchPublishedReviews);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', fetchPublishedReviews);
    };
  }, []);

  const getFeedbackAlertClass = () => {
    if (feedback.type === 'success') {
      return 'alert-success';
    }

    if (feedback.type === 'warning') {
      return 'alert-warning';
    }

    return 'alert-danger';
  };

  const buildImageSizeWarning = (files) => {
    const fileNames = files.slice(0, 3).map((file) => file.name).join(', ');
    const remainingCount = files.length - 3;
    const fileList = fileNames
      ? ` Remove or resize: ${fileNames}${remainingCount > 0 ? ` and ${remainingCount} more` : ''}.`
      : '';

    return `Each photo must be less than ${MAX_IMAGE_SIZE_MB} MB.${fileList}`;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    const validFiles = selectedFiles.filter((file) => file.size <= MAX_IMAGE_SIZE_BYTES);

    if (oversizedFiles.length > 0) {
      setFeedback({
        type: 'warning',
        message: buildImageSizeWarning(oversizedFiles),
      });
    } else if (feedback.type === 'warning') {
      setFeedback({ type: '', message: '' });
    }

    if (validFiles.length === 0) {
      event.target.value = '';
      return;
    }

    const mergedFiles = [...formData.images, ...validFiles];
    const uniqueFiles = mergedFiles.filter((file, index, array) => {
      return index === array.findIndex((candidate) => (
        candidate.name === file.name &&
        candidate.size === file.size &&
        candidate.lastModified === file.lastModified
      ));
    });
    const limitedFiles = uniqueFiles.slice(0, MAX_IMAGE_COUNT);

    if (uniqueFiles.length > MAX_IMAGE_COUNT) {
      setFeedback({
        type: 'warning',
        message: `You can upload up to ${MAX_IMAGE_COUNT} photos per review.`,
      });
    }

    setFormData((prev) => ({
      ...prev,
      images: limitedFiles,
    }));

    event.target.value = '';
  };

  const handleRemoveSelectedImage = (fileToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((file) => !(
        file.name === fileToRemove.name &&
        file.size === fileToRemove.size &&
        file.lastModified === fileToRemove.lastModified
      )),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    const fileInput = document.getElementById('image-upload');

    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: '', message: '' });

    const oversizedFiles = formData.images.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);

    if (oversizedFiles.length > 0) {
      setFeedback({
        type: 'warning',
        message: buildImageSizeWarning(oversizedFiles),
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('customer_name', formData.customerName.trim());
      payload.append('tour_name', formData.tourName.trim());
      payload.append('rating', String(formData.stars));
      payload.append('comment', formData.comment.trim());

      formData.images.forEach((imageFile) => {
        payload.append('images[]', imageFile, imageFile.name);
      });

      const response = await api.post('/reviews', payload, {
        headers: {
          Accept: 'application/json',
        },
      });

      setFeedback({
        type: 'success',
        message: response.data?.message || 'Review submitted successfully.',
      });
      resetForm();
    } catch (error) {
      console.error('Error submitting review:', error);

      const backendErrors = error.response?.data?.errors || {};
      const firstErrorMessage = Object.values(backendErrors).flat().find(Boolean);
      const requestTooLargeMessage = error.response?.status === 413
        ? `Your selected photos are too large together. Each photo must be less than ${MAX_IMAGE_SIZE_MB} MB.`
        : '';

      setFeedback({
        type: 'error',
        message: firstErrorMessage || requestTooLargeMessage || error.response?.data?.message || 'Unable to submit your review right now.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={index < count ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  const handleViewMoreClick = () => {
    navigate('/reviews');
  };

  return (
    <div className="share-experience-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="review-form-section p-4 shadow rounded">
              <h2 className="section-title mb-4">Share Your Experience</h2>
              <p className="section-subtitle mb-4">
                Tell fellow travelers about your tour and share your memories.
              </p>

              {feedback.message && (
                <div className={`alert ${getFeedbackAlertClass()} mb-4`}>
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerName"
                    name="customerName"
                    placeholder="e.g., Dilan & Maya"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Stars</label>
                  <div className="star-rating-select">
                    <div className="stars-container">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-select-btn ${formData.stars >= star ? 'selected' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, stars: star }))}
                          aria-label={`${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <div className="stars-label mt-2">
                      Selected: <span className="selected-stars-count">{formData.stars}</span> out of 5 stars
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="tourName" className="form-label">Tour Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tourName"
                    name="tourName"
                    placeholder="e.g., Beach Paradise"
                    value={formData.tourName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    id="comment"
                    name="comment"
                    rows="4"
                    placeholder="Tell us about your tour experience"
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="image-upload" className="form-label">
                    <i className="bi bi-image me-2"></i>Add memories (images)
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      className="form-control"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                    />
                    <div className="file-info">
                      <i className="bi bi-cloud-arrow-up me-2"></i>
                      <span>
                        {formData.images.length > 0
                          ? `${formData.images.length} file${formData.images.length > 1 ? 's' : ''} selected`
                          : 'No files chosen'}
                      </span>
                    </div>
                    <p className="file-size-warning">
                      Photos must be less than {MAX_IMAGE_SIZE_MB} MB each.
                    </p>
                    {formData.images.length > 0 && (
                      <div className="selected-files-list">
                        {formData.images.map((file) => (
                          <div
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            className="selected-file-item"
                          >
                            <span className="selected-file-name">{file.name}</span>
                            <button
                              type="button"
                              className="remove-selected-file"
                              onClick={() => handleRemoveSelectedImage(file)}
                              aria-label={`Remove ${file.name}`}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="traveler-stories-section p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title mb-0">Recent Ratings &amp; Reviews</h2>
                <div className="carousel-indicator">
                  <span className="carousel-subtitle">Published feedback from Cey Tripz travelers.</span>
                </div>
              </div>

              <div className="traveler-carousel-wrapper flex-grow-1">
                {reviewsLoading && (
                  <div className="h-100 d-flex align-items-center justify-content-center text-light" role="status">
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Loading reviews...
                  </div>
                )}

                {!reviewsLoading && travelerStories.length === 0 && (
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center text-light p-4">
                    <i className="bi bi-chat-heart fs-1 mb-3" aria-hidden="true"></i>
                    <h3 className="h5">No published reviews yet</h3>
                    <p className="mb-0 opacity-75">Be the first traveler to share an experience.</p>
                  </div>
                )}

                {!reviewsLoading && travelerStories.length > 0 && (
                  <Carousel
                    indicators={false}
                    interval={5000}
                    className="traveler-carousel"
                    prevIcon={
                      <span className="carousel-control-prev-custom" aria-hidden="true">
                        <i className="bi bi-chevron-left"></i>
                      </span>
                    }
                    nextIcon={
                      <span className="carousel-control-next-custom" aria-hidden="true">
                        <i className="bi bi-chevron-right"></i>
                      </span>
                    }
                  >
                    {travelerStories.slice(0, 4).map((story, index) => (
                      <Carousel.Item key={story.id}>
                        <div className="traveler-story-card p-0 rounded shadow overflow-hidden">
                          <div className="story-image-container">
                            <img
                              src={story.imageUrl}
                              alt={story.location}
                              className="story-image"
                              onError={(event) => {
                                event.target.onerror = null;
                                event.target.src = FALLBACK_STORY_IMAGE;
                              }}
                            />
                            <div className="story-image-overlay">
                              <span className="location-badge">
                                <i className="bi bi-geo-alt me-1"></i> {story.location}
                              </span>
                            </div>
                          </div>
                          <div className="story-content p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h3 className="traveler-name mb-0">{story.name}</h3>
                              <div className="story-stars">{renderStars(story.stars)}</div>
                            </div>
                            <p className="traveler-story mb-4">{story.story}</p>
                            <div className="story-footer d-flex justify-content-end align-items-center">
                              <div className="story-index">
                                {String(index + 1).padStart(2, '0')}/{String(Math.min(travelerStories.length, 4)).padStart(2, '0')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </div>

              <div className="text-center mt-4 pt-3">
                <button className="btn btn-outline-light view-more-btn" onClick={handleViewMoreClick}>
                  View All Ratings &amp; Reviews <i className="bi bi-arrow-right ms-2"></i>
                </button>
                <p className="text-light opacity-75 mt-2 mb-0 small">
                  Showing {Math.min(travelerStories.length, 4)} of {publishedReviewTotal} published reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareExperience;






