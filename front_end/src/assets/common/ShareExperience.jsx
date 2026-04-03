import React, { useState } from 'react';
import './../css/ShareExperience.scss';
import { Carousel, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // ADD THIS IMPORT

// Import sample images (in a real app, these would be from your assets)
// For demo purposes, I'm using placeholder URLs. Replace with actual image imports.

const ShareExperience = () => {
    const [formData, setFormData] = useState({
        name: '',
        stars: 5,
        location: '',
        story: '',
        image: null
    });

    const [showAllStories, setShowAllStories] = useState(false);
    const navigate = useNavigate(); // ADD THIS

    // Sample data for traveler stories with images
    const travelerStories = [
        {
            id: 1,
            name: 'Anika & Joel',
            story: 'Sunrise at Sigiriya and whale watching in Mirissa made our trip unforgettable.',
            stars: 5,
            location: 'Sigiriya & Mirissa',
            imageUrl: 'https://images.unsplash.com/photo-1602758164098-7b1b1d1f1b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            name: 'Sahan P.',
            story: 'Loved the tea trails and misty mornings in Ella. Smooth transport and friendly guides!',
            stars: 4,
            location: 'Ella',
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            name: 'Maria Chen',
            story: 'The ancient temples of Polonnaruwa took our breath away. So much history in one place!',
            stars: 5,
            location: 'Polonnaruwa',
            imageUrl: 'https://images.unsplash.com/photo-1593693399740-5e67a1f7a6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 4,
            name: 'James & Liam',
            story: 'Beach hopping along the south coast was paradise. Great food and even better sunsets.',
            stars: 4,
            location: 'Southern Coast',
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 5,
            name: 'Priya N.',
            story: 'Yala National Park safari was the highlight of our trip. Saw leopards and so much wildlife!',
            stars: 5,
            location: 'Yala',
            imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 6,
            name: 'Thomas & Family',
            story: 'The train ride from Kandy to Ella was magical. Scenery we will never forget!',
            stars: 5,
            location: 'Kandy to Ella',
            imageUrl: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 7,
            name: 'Fatima R.',
            story: 'Local markets in Colombo offered incredible food experiences. The hospitality was heartwarming.',
            stars: 4,
            location: 'Colombo',
            imageUrl: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 8,
            name: 'Kenji Tanaka',
            story: 'Climbing Adam\'s Peak at night to witness the sunrise was a spiritual journey.',
            stars: 5,
            location: 'Adam\'s Peak',
            imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Form submitted:', formData);
        alert('Thank you for sharing your experience!');

        // Reset form
        setFormData({
            name: '',
            stars: 5,
            location: '',
            story: '',
            image: null
        });

        // Reset file input
        document.getElementById('image-upload').value = '';
    };

    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={i < count ? 'star filled' : 'star'}>
                ★
            </span>
        ));
    };

    const handleViewMoreClick = () => {
        navigate('/stories');
    };

    const handleViewDetails = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    const handleModalViewDetails = (storyId, e) => {
        e.stopPropagation(); // Prevent card click
        setShowAllStories(false); // Close modal
        setTimeout(() => {
            navigate(`/story/${storyId}`); // Navigate after modal closes
        }, 300);
    };

    return (
        <div className="share-experience-container">
            <div className="container py-5">
                <div className="row">
                    {/* Left Column - Review Form */}
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="review-form-section p-4 shadow rounded">
                            <h2 className="section-title mb-4">Share Your Experience</h2>
                            <p className="section-subtitle mb-4">
                                Tell fellow travelers about your moments under the Beauty of Sri Lanka section.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Your Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="e.g., Dilan & Maya"
                                        value={formData.name}
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
                                                    onClick={() => setFormData({ ...formData, stars: star })}
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
                                    <label htmlFor="location" className="form-label">Where</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location"
                                        name="location"
                                        placeholder="e.g., Ella, Mirissa"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="story" className="form-label">Your Story</label>
                                    <textarea
                                        className="form-control"
                                        id="story"
                                        name="story"
                                        rows="4"
                                        placeholder="What made this place special?"
                                        value={formData.story}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="image-upload" className="form-label">
                                        <i className="bi bi-image me-2"></i>Add a memory (image)
                                    </label>
                                    <div className="file-upload-wrapper">
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <div className="file-info">
                                            <i className="bi bi-cloud-arrow-up me-2"></i>
                                            <span>{formData.image ? formData.image.name : 'No file chosen'}</span>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-100">
                                    Post Review
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Traveler Stories Carousel */}
                    <div className="col-lg-6">
                        <div className="traveler-stories-section p-4 h-100 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="section-title mb-0">Recent Traveler Stories</h2>
                                <div className="carousel-indicator">
                                    <span className="carousel-subtitle">Real moments from the Beauty of Sri Lanka gallery.</span>
                                </div>
                            </div>

                            <div className="traveler-carousel-wrapper flex-grow-1">
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
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
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
                                                    <div className="story-footer d-flex justify-content-between align-items-center">
                                                        <div className="story-index">
                                                            {String(index + 1).padStart(2, '0')}/{String(Math.min(travelerStories.length, 4)).padStart(2, '0')}
                                                        </div>
                                                        <button
                                                            className="btn-view-details"
                                                            onClick={() => handleViewDetails(story.id)}
                                                        >
                                                            View More <i className="bi bi-arrow-right ms-1"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>

                            <div className="text-center mt-4 pt-3">
                                <button className="btn btn-outline-light view-more-btn" onClick={handleViewMoreClick}>
                                    View More Stories <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                                <p className="text-light opacity-75 mt-2 mb-0 small">
                                    Showing {Math.min(travelerStories.length, 4)} of {travelerStories.length} stories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Viewing All Stories */}
            {/* <Modal
                show={showAllStories}
                onHide={() => setShowAllStories(false)}
                size="lg"
                centered
                className="stories-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="modal-title w-100">
                        <h2 className="section-title mb-0">All Traveler Stories</h2>
                        <p className="modal-subtitle mt-2">Discover all amazing experiences from Sri Lanka travelers</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="row g-4">
                        {travelerStories.map((story) => (
                            <div className="col-md-6" key={story.id}>
                                <div 
                                    className="traveler-story-card h-100 shadow-sm border"
                                    
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="story-image-container-modal">
                                        <img
                                            src={story.imageUrl}
                                            alt={story.location}
                                            className="story-image-modal"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                                            }}
                                        />
                                        <div className="story-image-overlay-modal">
                                            <span className="location-badge-modal">
                                                <i className="bi bi-geo-alt me-1"></i> {story.location}
                                            </span>
                                        </div>
                                        
                                    </div>
                                    <div className="p-3 d-flex flex-column h-100">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h4 className="traveler-name mb-0">{story.name}</h4>
                                            <div className="story-stars">{renderStars(story.stars)}</div>
                                        </div>
                                        <p className="traveler-story mb-3 small flex-grow-1">{story.story}</p>
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAllStories(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal> */}
        </div>
    );
};

export default ShareExperience;