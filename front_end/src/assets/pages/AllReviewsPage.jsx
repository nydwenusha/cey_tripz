import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import api from '../services/api/api';
import './../css/AllReviewsPage.scss';

const REVIEWS_PER_REQUEST = 100;

const formatReviewDate = (value) => {
  if (!value) return '';

  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const getInitials = (name) => String(name || 'Traveler')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
  <i
    key={index}
    className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
    aria-hidden="true"
  />
));

function AllReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const loadReviews = useCallback(async (signal) => {
    setLoading(true);
    setError('');

    try {
      const requestPage = (page) => api.get('/reviews', {
        params: {
          page,
          per_page: REVIEWS_PER_REQUEST,
          limit: REVIEWS_PER_REQUEST,
        },
        signal,
      });

      const firstResponse = await requestPage(1);
      const firstReviews = Array.isArray(firstResponse.data?.reviews) ? firstResponse.data.reviews : [];
      const lastPage = Math.max(Number(firstResponse.data?.pagination?.last_page) || 1, 1);
      let allReviews = firstReviews;

      if (lastPage > 1) {
        const remainingResponses = await Promise.all(
          Array.from({ length: lastPage - 1 }, (_, index) => requestPage(index + 2))
        );

        allReviews = remainingResponses.reduce((items, response) => {
          const pageReviews = Array.isArray(response.data?.reviews) ? response.data.reviews : [];
          return [...items, ...pageReviews];
        }, firstReviews);
      }

      const uniqueReviews = Array.from(
        new Map(allReviews.map((review) => [review.id, review])).values()
      );

      setReviews(uniqueReviews);
    } catch (requestError) {
      if (requestError.code === 'ERR_CANCELED') return;

      console.error('Failed to load published reviews:', requestError);
      setReviews([]);
      setError(requestError.response?.data?.message || 'Unable to load ratings and reviews right now.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadReviews(controller.signal);
    return () => controller.abort();
  }, [loadReviews]);

  const summary = useMemo(() => {
    const total = reviews.length;
    const ratingTotal = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);

    return {
      total,
      average: total > 0 ? ratingTotal / total : 0,
      fiveStar: reviews.filter((review) => Number(review.rating) === 5).length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();

    return reviews.filter((review) => {
      const matchesRating = ratingFilter === 'all' || Number(review.rating) === Number(ratingFilter);
      const searchableText = [review.customer_name, review.tour_name, review.comment]
        .join(' ')
        .toLocaleLowerCase();

      return matchesRating && (!query || searchableText.includes(query));
    });
  }, [ratingFilter, reviews, searchTerm]);

  return (
    <Layout>
      <main className="all-reviews-page">
        <section className="reviews-hero">
          <div className="container">
            <button className="reviews-back-button" onClick={() => navigate('/')}>
              <i className="bi bi-arrow-left" aria-hidden="true" /> Back to Home
            </button>
            <div className="reviews-hero-content">
              <span className="reviews-eyebrow">Traveler feedback</span>
              <h1>Ratings &amp; Reviews</h1>
              <p>Read genuine, published experiences from travelers who explored Sri Lanka with Cey Tripz.</p>
              <button className="reviews-share-button" onClick={() => navigate('/share-experience')}>
                Share Your Experience
              </button>
            </div>
          </div>
        </section>

        <section className="reviews-content-section">
          <div className="container">
            {!loading && !error && reviews.length > 0 && (
              <div className="reviews-summary-grid">
                <div className="review-summary-card">
                  <span className="summary-value">{summary.average.toFixed(1)}</span>
                  <div className="summary-stars">{renderStars(Math.round(summary.average))}</div>
                  <span className="summary-label">Average rating</span>
                </div>
                <div className="review-summary-card">
                  <span className="summary-value">{summary.total}</span>
                  <span className="summary-label">Published reviews</span>
                </div>
                <div className="review-summary-card">
                  <span className="summary-value">{summary.fiveStar}</span>
                  <span className="summary-label">Five-star experiences</span>
                </div>
              </div>
            )}

            {!loading && !error && reviews.length > 0 && (
              <div className="reviews-toolbar">
                <div className="reviews-search">
                  <i className="bi bi-search" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search traveler, tour, or review..."
                    aria-label="Search reviews"
                  />
                </div>
                <select
                  value={ratingFilter}
                  onChange={(event) => setRatingFilter(event.target.value)}
                  aria-label="Filter reviews by rating"
                >
                  <option value="all">All ratings</option>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
            )}

            {loading && (
              <div className="reviews-state" role="status">
                <span className="spinner-border text-primary" aria-hidden="true" />
                <p>Loading ratings and reviews...</p>
              </div>
            )}

            {!loading && error && (
              <div className="reviews-state reviews-error" role="alert">
                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                <p>{error}</p>
                <button onClick={() => loadReviews()}>Try Again</button>
              </div>
            )}

            {!loading && !error && reviews.length === 0 && (
              <div className="reviews-state">
                <i className="bi bi-chat-heart" aria-hidden="true" />
                <h2>No published reviews yet</h2>
                <p>Be the first traveler to share an experience with Cey Tripz.</p>
                <button onClick={() => navigate('/share-experience')}>Write a Review</button>
              </div>
            )}

            {!loading && !error && reviews.length > 0 && filteredReviews.length === 0 && (
              <div className="reviews-state">
                <i className="bi bi-search" aria-hidden="true" />
                <h2>No matching reviews</h2>
                <p>Try another search term or rating filter.</p>
                <button onClick={() => { setSearchTerm(''); setRatingFilter('all'); }}>Clear Filters</button>
              </div>
            )}

            {!loading && !error && filteredReviews.length > 0 && (
              <>
                <div className="reviews-results-count">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </div>
                <div className="reviews-grid">
                  {filteredReviews.map((review) => {
                    const images = Array.isArray(review.images) ? review.images : [];
                    const coverImage = images.find((image) => image.is_cover) || images[0];
                    const rating = Math.max(1, Math.min(5, Number(review.rating) || 1));

                    return (
                      <article className="review-card" key={review.id}>
                        {coverImage?.image_url ? (
                          <div className="review-photo-wrapper">
                            <img src={coverImage.image_url} alt={`${review.tour_name || 'Tour'} review`} loading="lazy" />
                            {images.length > 1 && <span className="review-image-count">+{images.length - 1} photos</span>}
                          </div>
                        ) : (
                          <div className="review-photo-placeholder" aria-hidden="true">
                            {getInitials(review.customer_name)}
                          </div>
                        )}

                        <div className="review-card-body">
                          <div className="review-card-heading">
                            <div>
                              <h2>{review.customer_name || 'Cey Tripz Traveler'}</h2>
                              <p><i className="bi bi-geo-alt" aria-hidden="true" /> {review.tour_name || 'Sri Lanka Tour'}</p>
                            </div>
                            <span className="review-rating" aria-label={`${rating} out of 5 stars`}>
                              {rating.toFixed(1)} <i className="bi bi-star-fill" aria-hidden="true" />
                            </span>
                          </div>

                          <div className="review-stars" aria-hidden="true">{renderStars(Math.round(rating))}</div>
                          <p className="review-comment">{review.comment}</p>
                          <footer>
                            <span><i className="bi bi-patch-check-fill" aria-hidden="true" /> Published review</span>
                            {formatReviewDate(review.created_at) && <time>{formatReviewDate(review.created_at)}</time>}
                          </footer>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default AllReviewsPage;
