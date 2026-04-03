import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/AllStoriesPage.scss';
import Layout from '../../Layout';

const AllStoriesPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data for traveler stories with images
    const travelerStories = [
        {
            id: 1,
            name: 'Anika & Joel',
            story: 'Sunrise at Sigiriya and whale watching in Mirissa made our trip unforgettable. The ancient rock fortress of Sigiriya at dawn was absolutely breathtaking.',
            stars: 5,
            location: 'Sigiriya & Mirissa',
            duration: '7 Days',
            date: 'March 2024',
            tags: ['Adventure', 'Nature', 'Cultural'],
            imageUrl: 'https://images.unsplash.com/photo-1602758164098-7b1b1d1f1b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            name: 'Sahan P.',
            story: 'Loved the tea trails and misty mornings in Ella. Smooth transport and friendly guides! The train ride through tea plantations was magical.',
            stars: 4,
            location: 'Ella',
            duration: '5 Days',
            date: 'January 2024',
            tags: ['Nature', 'Relaxation', 'Scenic'],
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            name: 'Maria Chen',
            story: 'The ancient temples of Polonnaruwa took our breath away. So much history in one place! The intricate carvings were absolutely stunning.',
            stars: 5,
            location: 'Polonnaruwa',
            duration: '4 Days',
            date: 'February 2024',
            tags: ['Cultural', 'Historical', 'Architecture'],
            imageUrl: 'https://images.unsplash.com/photo-1593693399740-5e67a1f7a6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 4,
            name: 'James & Liam',
            story: 'Beach hopping along the south coast was paradise. Great food and even better sunsets. The seafood was incredible everywhere we went.',
            stars: 4,
            location: 'Southern Coast',
            duration: '10 Days',
            date: 'December 2023',
            tags: ['Beach', 'Food', 'Relaxation'],
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 5,
            name: 'Priya N.',
            story: 'Yala National Park safari was the highlight of our trip. Saw leopards and so much wildlife! An unforgettable wildlife experience.',
            stars: 5,
            location: 'Yala',
            duration: '3 Days',
            date: 'November 2023',
            tags: ['Wildlife', 'Adventure', 'Nature'],
            imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 6,
            name: 'Thomas & Family',
            story: 'The train ride from Kandy to Ella was magical. Scenery we will never forget! Perfect for family travel with kids.',
            stars: 5,
            location: 'Kandy to Ella',
            duration: '6 Days',
            date: 'October 2023',
            tags: ['Family', 'Scenic', 'Train'],
            imageUrl: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 7,
            name: 'Fatima R.',
            story: 'Local markets in Colombo offered incredible food experiences. The hospitality was heartwarming. A perfect city break.',
            stars: 4,
            location: 'Colombo',
            duration: '3 Days',
            date: 'September 2023',
            tags: ['Food', 'City', 'Cultural'],
            imageUrl: 'https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 8,
            name: 'Kenji Tanaka',
            story: 'Climbing Adam\'s Peak at night to witness the sunrise was a spiritual journey. The panoramic views were worth every step.',
            stars: 5,
            location: 'Adam\'s Peak',
            duration: '2 Days',
            date: 'August 2023',
            tags: ['Adventure', 'Spiritual', 'Hiking'],
            imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 9,
            name: 'Lisa & Marco',
            story: 'Exploring Galle Fort was like stepping back in time. The blend of Dutch architecture and local culture was fascinating.',
            stars: 4,
            location: 'Galle',
            duration: '2 Days',
            date: 'July 2023',
            tags: ['Historical', 'Cultural', 'Architecture'],
            imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 10,
            name: 'Raj & Family',
            story: 'Perfect family vacation with something for everyone - beaches, wildlife, and cultural sites. Kids loved the elephant orphanage.',
            stars: 5,
            location: 'Multiple Destinations',
            duration: '12 Days',
            date: 'June 2023',
            tags: ['Family', 'Wildlife', 'Beach'],
            imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        }
    ];

    // Filter stories based on selected filter and search term
    const filteredStories = travelerStories.filter(story => {
        const matchesFilter = filter === 'all' || story.tags.includes(filter);
        const matchesSearch = story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            story.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            story.story.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={i < count ? 'star filled' : 'star'}>
                ★
            </span>
        ));
    };

    const handleViewDetails = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleShareExperience = () => {
        navigate('/share-experience');
    };

    // Get unique tags for filter
    const allTags = ['all', 'Adventure', 'Nature', 'Cultural', 'Beach', 'Food', 'Historical', 'Family', 'Wildlife', 'City', 'Spiritual', 'Hiking', 'Scenic', 'Relaxation'];
    const uniqueTags = [...new Set(allTags)];

    return (
        <Layout>
            <div className="all-stories-page">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="container">
                        <div className="hero-content">
                            <button className="btn-back" onClick={handleBackToHome}>
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </button>
                            <h1 className="hero-title">Traveler Stories</h1>
                            <p className="hero-subtitle">
                                Discover authentic experiences from travelers who explored Sri Lanka
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="filter-section py-4">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-8 mb-3 mb-md-0">
                                <div className="search-box">
                                    <i className="bi bi-search search-icon"></i>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search stories by name, location, or keywords..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            className="btn-clear-search"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="filter-dropdown">
                                    <select
                                        className="form-select"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        {uniqueTags.map(tag => (
                                            <option key={tag} value={tag}>
                                                {tag === 'all' ? 'All Categories' : tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Filter Tags */}
                        <div className="filter-tags mt-3">
                            {uniqueTags.filter(tag => tag !== 'all').map(tag => (
                                <button
                                    key={tag}
                                    className={`filter-tag ${filter === tag ? 'active' : ''}`}
                                    onClick={() => setFilter(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div className="stories-grid-section py-5">
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h2 className="section-title">
                                    {filter === 'all' ? 'All Travel Stories' : `${filter} Stories`}
                                    <span className="stories-count">({filteredStories.length} stories)</span>
                                </h2>
                            </div>
                        </div>

                        {filteredStories.length === 0 ? (
                            <div className="no-results text-center py-5">
                                <i className="bi bi-search no-results-icon"></i>
                                <h3>No stories found</h3>
                                <p>Try a different search term or filter</p>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredStories.map((story) => (
                                    <div className="col-lg-4 col-md-6" key={story.id}>
                                        <div className="story-card">
                                            <div className="story-image">
                                                <img
                                                    src={story.imageUrl}
                                                    alt={story.location}
                                                    className="img-fluid"
                                                />
                                                <div className="story-overlay">
                                                    <span className="story-location">
                                                        <i className="bi bi-geo-alt"></i> {story.location}
                                                    </span>
                                                    <span className="story-duration">
                                                        <i className="bi bi-calendar"></i> {story.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="story-content">
                                                <div className="story-header">
                                                    <h3 className="story-title">{story.name}</h3>
                                                    <div className="story-rating">
                                                        {renderStars(story.stars)}
                                                        <span className="rating-text">{story.stars}/5</span>
                                                    </div>
                                                </div>

                                                <div className="story-meta">
                                                    <span className="meta-item">
                                                        <i className="bi bi-calendar-event"></i> {story.date}
                                                    </span>
                                                </div>

                                                <p className="story-excerpt">{story.story}</p>

                                                <div className="story-tags">
                                                    {story.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="story-tag">{tag}</span>
                                                    ))}
                                                </div>

                                                <div className="story-actions">
                                                    <button
                                                        className="btn-read-story"
                                                        onClick={() => handleViewDetails(story.id)}
                                                    >
                                                        Read Full Story <i className="bi bi-arrow-right"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="cta-section py-5">
                    <div className="container text-center">
                        <h2>Have Your Own Sri Lanka Story?</h2>
                        <p className="cta-subtitle">
                            Share your travel experience and inspire others to explore the beauty of Sri Lanka
                        </p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleShareExperience}
                        >
                            <i className="bi bi-pencil me-2"></i>Share Your Experience
                        </button>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="stats-section py-4">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-md-3 col-6 mb-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">{travelerStories.length}+</h3>
                                    <p className="stat-label">Travel Stories</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">
                                        {Math.round(travelerStories.reduce((acc, story) => acc + story.stars, 0) / travelerStories.length * 10) / 10}
                                    </h3>
                                    <p className="stat-label">Average Rating</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">12+</h3>
                                    <p className="stat-label">Destinations</p>
                                </div>
                            </div>
                            <div className="col-md-3 col-6 mb-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">50+</h3>
                                    <p className="stat-label">Photos Shared</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AllStoriesPage;