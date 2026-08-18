import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import './../css/TravelerStoryDetail.scss';
import Layout from '../../Layout';

const TravelerStoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedStories, setRelatedStories] = useState([]);

    // Sample data for traveler stories with multiple images
    const allStories = [
        {
            id: 1,
            name: 'Anika & Joel',
            story: 'Sunrise at Sigiriya and whale watching in Mirissa made our trip unforgettable. The ancient rock fortress of Sigiriya at dawn was absolutely breathtaking. We climbed up just before sunrise and were rewarded with the most spectacular view as the sun illuminated the surrounding jungle.',
            detailedStory: `Our Sri Lanka adventure began in Sigiriya, where we woke up at 4 AM to climb the ancient rock fortress. As the sun rose, the entire landscape was bathed in golden light - a moment we'll cherish forever. 

      From there, we traveled to Mirissa for whale watching. The experience of seeing blue whales in their natural habitat was humbling and awe-inspiring. Our guide was incredibly knowledgeable and helped us spot several whales, dolphins, and sea turtles.
      
      The trip was perfectly balanced between cultural exploration and natural wonders. The local food, especially the seafood curries, was outstanding. We highly recommend visiting during the dry season (December to March) for the best experience.`,
            stars: 5,
            location: 'Sigiriya & Mirissa',
            duration: '7 Days',
            date: 'March 2024',
            images: [
                'https://images.unsplash.com/photo-1602758164098-7b1b1d1f1b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1596027179618-2256f6d4e6d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1519552928909-1ca62168a3d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            highlights: [
                'Sunrise at Sigiriya Rock Fortress',
                'Whale watching in Mirissa',
                'Traditional Sri Lankan cooking class',
                'Stay at a jungle eco-lodge'
            ],
            tips: 'Book whale watching tours in advance during peak season. Start the Sigiriya climb early to avoid crowds and heat.',
            accommodation: 'Heritance Kandalama & Mirissa Hills Villa'
        },
        {
            id: 2,
            name: 'Sahan P.',
            story: 'Loved the tea trails and misty mornings in Ella. Smooth transport and friendly guides!',
            detailedStory: `As a local who moved abroad years ago, returning to Sri Lanka's hill country was a nostalgic journey. The train ride from Kandy to Ella was even more beautiful than I remembered - winding through lush tea plantations with breathtaking views at every turn.

      Ella itself was magical. We hiked Little Adam's Peak early in the morning, walking through mist-covered trails that made us feel like we were in a dream. The Nine Arch Bridge was another highlight - watching the train pass through the colonial-era bridge surrounded by jungle was surreal.
      
      The tea plantation tours were educational and delicious. We learned about the entire tea-making process and got to taste different varieties. The cool climate was a welcome break from Colombo's heat.`,
            stars: 4,
            location: 'Ella',
            duration: '5 Days',
            date: 'January 2024',
            images: [
                'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1523480717984-24cba35ae1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1573843989-c9d4a65d6c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1573843989-c9d4a65d6c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            highlights: [
                'Train ride from Kandy to Ella',
                'Hiking Little Adam\'s Peak',
                'Nine Arch Bridge visit',
                'Tea plantation tour'
            ],
            tips: 'Take the train from Kandy to Ella for the best views. Book accommodation with mountain views.',
            accommodation: '98 Acres Resort & Ella Mount View'
        },
        {
            id: 3,
            name: 'Maria Chen',
            story: 'The ancient temples of Polonnaruwa took our breath away. So much history in one place!',
            detailedStory: `As a history enthusiast, Polonnaruwa was the highlight of my Sri Lanka trip. The ancient city, a UNESCO World Heritage Site, was incredibly well-preserved. Walking among thousand-year-old ruins gave me goosebumps.

      The Gal Vihara with its four magnificent Buddha statues carved from a single granite rock wall was absolutely stunning. The intricate details and sheer scale of the sculptures were mind-blowing. We hired a local guide who brought the history to life with fascinating stories.
      
      We combined this with visits to Dambulla Cave Temple and Sigiriya, making it a perfect cultural triangle tour. The hotels in the area offered authentic Sri Lankan hospitality and delicious traditional food.`,
            stars: 5,
            location: 'Polonnaruwa',
            duration: '4 Days',
            date: 'February 2024',
            images: [
                'https://images.unsplash.com/photo-1593693399740-5e67a1f7a6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1593693399720-69c3e32c7c61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1593693399740-5e67a1f7a6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1593693399720-69c3e32c7c61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            highlights: [
                'Ancient city of Polonnaruwa',
                'Gal Vihara rock temple',
                'Dambulla Cave Temple',
                'Local cultural performances'
            ],
            tips: 'Visit early morning to avoid heat and crowds. Hire a licensed guide for better historical insights.',
            accommodation: 'EKHO Safari Hotel & Deer Park Hotel'
        },
        {
            id: 4,
            name: 'James & Liam',
            story: 'Beach hopping along the south coast was paradise. Great food and even better sunsets.',
            detailedStory: `Our honeymoon in Sri Lanka's south coast was pure bliss. We started in Galle, exploring the charming Dutch fort with its boutique shops and cafes. The mix of colonial architecture and local culture was fascinating.

      From there, we beach-hopped along the coast - Unawatuna, Mirissa, and Tangalle each had their own unique charm. The seafood was incredible everywhere we went, especially the fresh lobster and crab. 
      
      The highlight was watching sunset from the iconic Dalawella Beach rope swing. We also went on a river safari in Madu Ganga, spotting monitor lizards and exotic birds. The combination of beach relaxation and local experiences made it perfect.`,
            stars: 4,
            location: 'Southern Coast',
            duration: '10 Days',
            date: 'December 2023',
            images: [
                'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            ],
            highlights: [
                'Galle Fort exploration',
                'Beach hopping along south coast',
                'River safari in Madu Ganga',
                'Sunset at Dalawella Beach'
            ],
            tips: 'Rent a tuk-tuk for local beach hopping. Try seafood at small family-run restaurants.',
            accommodation: 'Cape Weligama & Anantara Peace Haven'
        }
    ];

    useEffect(() => {
        // Find the story by ID
        const foundStory = allStories.find(s => s.id === parseInt(id));

        if (foundStory) {
            setStory(foundStory);

            // Find related stories (excluding current one)
            const related = allStories
                .filter(s => s.id !== parseInt(id))
                .slice(0, 3);
            setRelatedStories(related);
        } else {
            // Redirect if story not found
            navigate('/reviews');
        }

        setLoading(false);

        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id, navigate]);

    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={i < count ? 'star filled' : 'star'}>
                ★
            </span>
        ));
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleRelatedStoryClick = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    if (loading) {
        return (
            <div className="story-detail-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="story-not-found">
                <div className="container text-center py-5">
                    <h2>Story Not Found</h2>
                    <p>The story you're looking for doesn't exist.</p>
                    <button className="btn btn-primary" onClick={handleBackClick}>
                        Back to Stories
                    </button>
                </div>
            </div>
        );
    }

    const handleViewDetails = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    return (
        <Layout>
            <div className="story-detail-page">
                {/* Hero Section with Image Carousel */}
                <div className="story-hero-section">
                    <div className="container-fluid px-0">
                        <Carousel fade interval={5000} className="story-hero-carousel">
                            {story.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <div className="hero-image-container">
                                        <img
                                            className="d-block w-100"
                                            src={image}
                                            alt={`${story.location} - Image ${index + 1}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                                            }}
                                        />
                                        <div className="hero-overlay">
                                            <div className="container">
                                                <div className="hero-content">
                                                    <button className="btn-back" onClick={handleBackClick}>
                                                        <i className="bi bi-arrow-left"></i> Back to Stories
                                                    </button>
                                                    <h1 className="hero-title">{story.name}'s Journey</h1>
                                                    <p className="hero-subtitle">
                                                        <i className="bi bi-geo-alt-fill"></i> {story.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container py-5">
                    <div className="row">
                        {/* Left Column - Story Details */}
                        <div className="col-lg-8">
                            <div className="story-content-section">
                                {/* Story Header */}
                                <div className="story-header mb-5">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h2 className="story-title">{story.name}'s Sri Lanka Adventure</h2>
                                            <div className="story-meta">
                                                <span className="meta-item">
                                                    <i className="bi bi-calendar-event"></i> {story.date}
                                                </span>
                                                <span className="meta-item">
                                                    <i className="bi bi-clock"></i> {story.duration}
                                                </span>
                                                <span className="meta-item">
                                                    <i className="bi bi-star-fill"></i> {story.stars}/5 Rating
                                                </span>
                                            </div>
                                        </div>
                                        <div className="story-rating">
                                            {renderStars(story.stars)}
                                            <span className="rating-text">{story.stars} out of 5 stars</span>
                                        </div>
                                    </div>

                                    <div className="story-tags">
                                        <span className="tag">Cultural</span>
                                        <span className="tag">Adventure</span>
                                        <span className="tag">Nature</span>
                                        <span className="tag">Food</span>
                                    </div>
                                </div>

                                {/* Detailed Story */}
                                <div className="story-details mb-5">
                                    <h3 className="section-title">The Experience</h3>
                                    <div className="detailed-story-text">
                                        {story.detailedStory.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="story-paragraph">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* Trip Highlights */}
                                <div className="highlights-section mb-5">
                                    <h3 className="section-title">Trip Highlights</h3>
                                    <div className="row">
                                        {story.highlights.map((highlight, index) => (
                                            <div className="col-md-6" key={index}>
                                                <div className="highlight-card">
                                                    <div className="highlight-number">0{index + 1}</div>
                                                    <div className="highlight-content">
                                                        <h4>{highlight}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Travel Tips */}
                                <div className="tips-section mb-5">
                                    <h3 className="section-title">
                                        <i className="bi bi-lightbulb"></i> Travel Tips
                                    </h3>
                                    <div className="tips-card">
                                        <p>{story.tips}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="col-lg-4">
                            <div className="story-sidebar">
                                {/* Accommodation Info */}
                                <div className="sidebar-card mb-4">
                                    <h4 className="sidebar-title">
                                        <i className="bi bi-building"></i> Accommodation
                                    </h4>
                                    <p className="sidebar-text">{story.accommodation}</p>
                                </div>

                                {/* Location Map */}
                                <div className="sidebar-card mb-4">
                                    <h4 className="sidebar-title">
                                        <i className="bi bi-map"></i> Location
                                    </h4>
                                    <div className="location-map">
                                        <div className="map-placeholder">
                                            <i className="bi bi-geo-alt"></i>
                                            <p>{story.location}, Sri Lanka</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Facts */}
                                <div className="sidebar-card mb-4">
                                    <h4 className="sidebar-title">
                                        <i className="bi bi-info-circle"></i> Quick Facts
                                    </h4>
                                    <ul className="facts-list">
                                        <li>
                                            <strong>Best Time to Visit:</strong> December to March
                                        </li>
                                        <li>
                                            <strong>Ideal For:</strong> Couples, Families, Solo Travelers
                                        </li>
                                        <li>
                                            <strong>Budget Level:</strong> Moderate
                                        </li>
                                        <li>
                                            <strong>Transport:</strong> Private Car & Train
                                        </li>
                                    </ul>
                                </div>

                                {/* Share Story */}
                                <div className="sidebar-card mb-4">
                                    <h4 className="sidebar-title">
                                        <i className="bi bi-share"></i> Share This Story
                                    </h4>
                                    <div className="share-buttons">
                                        <button className="btn btn-outline-primary share-btn">
                                            <i className="bi bi-facebook"></i>
                                        </button>
                                        <button className="btn btn-outline-primary share-btn">
                                            <i className="bi bi-twitter"></i>
                                        </button>
                                        <button className="btn btn-outline-primary share-btn">
                                            <i className="bi bi-whatsapp"></i>
                                        </button>
                                        <button className="btn btn-outline-primary share-btn">
                                            <i className="bi bi-link-45deg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Stories */}
                    <div className="related-stories-section mt-5">
                        <h3 className="section-title text-center mb-4">You Might Also Like</h3>
                        <div className="row">
                            {relatedStories.map((relatedStory) => (
                                <div className="col-md-4" key={relatedStory.id}>
                                    <div
                                        className="related-story-card"
                                        onClick={() => handleRelatedStoryClick(relatedStory.id)}
                                    >
                                        <div className="related-image-container">
                                            <img
                                                src={relatedStory.images[0]}
                                                alt={relatedStory.location}
                                                className="related-image"
                                            />
                                            <div className="related-overlay">
                                                <span className="related-location">
                                                    <i className="bi bi-geo-alt"></i> {relatedStory.location}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="related-content">
                                            <h4>{relatedStory.name}'s Story</h4>
                                            <p className="related-excerpt">{relatedStory.story.substring(0, 100)}...</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="related-stars">{renderStars(relatedStory.stars)}</div>
                                                <button className="btn-read-more">
                                                    Read More <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="cta-section py-5">
                    <div className="container text-center">
                        <h2>Ready to Share Your Sri Lanka Story?</h2>
                        <p className="cta-subtitle">Inspire other travelers with your own experiences</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/share-experience')}
                        >
                            Share Your Experience
                        </button>
                    </div>
                </div>
            </div>
        </Layout>

        
    );
};

export default TravelerStoryDetail;
