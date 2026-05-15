import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Blog.scss";
import { useNavigate } from "react-router-dom";
import api from "../services/api/api";
import { getBlogImageUrl } from "../utils/blogImages";

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [categories, setCategories] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchInputRef = useRef(null);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch blog posts
        const postsResponse = await api.get("/blogPosts");
        if (postsResponse.status === 200) {
          const allPosts = postsResponse.data.blogPosts || postsResponse.data || [];
          const postsData = Array.isArray(allPosts)
            ? allPosts.filter(post => post.status === 'published')
            : [];
          setPosts(postsData);
          setFilteredPosts(postsData);
        }

        // Fetch categories
        const categoriesResponse = await api.get("/blogPostCategories");
        if (categoriesResponse.status === 200) {
          const categoriesData = categoriesResponse.data.categories || categoriesResponse.data;
          setCategories(["all", ...categoriesData.map(cat => cat.name)]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts when search term or category changes
  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedCategory, posts]);

  const filterPosts = () => {
    let filtered = [...posts];

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleLike = async (postId, currentLikes) => {
    try {
      const response = await api.post(`/blogPosts/${postId}/like`);
      if (response.status === 200) {
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, likes: likedPosts[postId] ? currentLikes - 1 : currentLikes + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      const shareBtn = document.getElementById(`share-${post.id}`);
      if (shareBtn) {
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          shareBtn.innerHTML = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get category color for badges
  const getCategoryColor = (category) => {
    const colors = {
      'Destinations': '#ff9800',
      'Travel Tips': '#4caf50',
      'Sustainability': '#2196f3',
      'Food & Drink': '#f44336',
      'Photography': '#9c27b0',
      'Adventure': '#ff5722',
      'Culture': '#3f51b5'
    };
    return colors[category] || '#667eea';
  };

  if (loading) {
    return (
      <section className="blog-section">
        <div className="loading-container">
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading amazing travel stories...
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-section" id="blog">
      {/* Hero Section - Matching Beauty of Sri Lanka Style */}
      <div className="blog-hero">
        <Container>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Travel Stories
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Inspiring adventures, travel tips, and hidden gems from around the world
            </motion.p>
          </motion.div>
        </Container>
      </div>

      <Container>
        {/* Enhanced Filters Section */}
        <div className="blog-filters-wrapper">
          <div className="search-section">
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search stories by title, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ×
              </button>
            )}
          </div>

          <div className="category-filter-wrapper">
            <div className="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Filter by</span>
            </div>
            <div className="category-chips">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Stories' : category}
                  {selectedCategory === category && (
                    <span className="active-dot"></span>
                  )}
                </button>
              ))}
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        {filteredPosts.length > 0 && (
          <div className="results-count">
            <span>Found {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              key="no-results"
              className="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="no-results-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>No stories found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              <button onClick={clearFilters} className="reset-btn">Reset Filters</button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="posts-grid">
                {currentPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                    whileHover={{ y: -8 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="card-image-wrapper" onClick={() => handleReadMore(post.id)}>
                      <img
                        src={getBlogImageUrl(post)}
                        alt={post.title}
                        className="card-image"
                        loading="lazy"
                      />
                      <span className="category-badge" style={{ backgroundColor: getCategoryColor(post.category) }}>
                        {post.category}
                      </span>
                      {post.is_featured && (
                        <span className="featured-badge">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                          </svg>
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="card-content">
                      <div className="post-meta">
                        <div className="author-info">
                          <div className="author-avatar">
                            {post.author?.charAt(0) || 'A'}
                          </div>
                          <span className="author-name">{post.author || 'Anonymous'}</span>
                        </div>
                        <div className="post-date">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                      </div>

                      <h3 className="post-title" onClick={() => handleReadMore(post.id)}>
                        {post.title}
                      </h3>

                      <div className="location-info">
                        <svg className="location-icon" viewBox="0 0 24 24" width="14" height="14">
                          <path fill="currentColor" d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                        </svg>
                        <span className="location-text">{post.location || 'Sri Lanka'}</span>
                      </div>

                      <p className="post-excerpt">
                        {post.excerpt?.substring(0, 120) || 'No description available.'}
                        {post.excerpt?.length > 120 && '...'}
                      </p>

                      <div className="post-footer">
                        <div className="read-time">
                          <svg className="time-icon" viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M12.5,7H11v6l5.25,3.15l0.75-1.23l-4.5-2.67z" />
                          </svg>
                          <span>{post.read_time || post.readTime || '5 min read'}</span>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="tags">
                            {post.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="tag-chip">#{tag}</span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="tag-chip">+{post.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button className="read-more-btn" onClick={() => handleReadMore(post.id)}>
                        Read Full Story
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                      <div className="action-icons">
                        <button
                          className={`action-btn like-btn ${likedPosts[post.id] ? 'active' : ''}`}
                          onClick={() => handleLike(post.id, post.likes)}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill={likedPosts[post.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3c1.74,0 3.41.81 4.5,2.08C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.41 22,8.5c0,3.77-3.4,6.86-8.55,11.54L12,21.35Z" />
                          </svg>
                          <span>{likedPosts[post.id] ? (post.likes || 0) + 1 : post.likes || 0}</span>
                        </button>
                        <button
                          id={`share-${post.id}`}
                          className="action-btn share-btn"
                          onClick={() => handleShare(post)}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18,16.08c-0.76,0-1.44,0.3-1.96,0.77L8.91,12.7c0.05-0.23,0.09-0.46,0.09-0.7s-0.04-0.47-0.09-0.7l7.05-4.11c0.54,0.5,1.25,0.81,2.04,0.81c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3c0,0.24,0.04,0.47,0.09,0.7L8.04,9.81C7.5,9.31,6.79,9,6,9c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.79,0,1.5-0.31,2.04-0.81l7.12,4.16c-0.05,0.21-0.08,0.43-0.08,0.65c0,1.61,1.31,2.92,2.92,2.92c1.61,0,2.92-1.31,2.92-2.92C20.92,17.39,19.61,16.08,18,16.08z" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {filteredPosts.length > postsPerPage && (
                <div className="pagination">
                  <button
                    className="page-nav"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Previous
                  </button>
                  <div className="page-numbers">
                    {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = currentPage === pageNum;
                      const isNearCurrent = Math.abs(currentPage - pageNum) <= 2;
                      const isFirst = pageNum === 1;
                      const isLast = pageNum === Math.ceil(filteredPosts.length / postsPerPage);
                      
                      if (isNearCurrent || isFirst || isLast) {
                        return (
                          <button
                            key={i}
                            className={`page-number ${isActive ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                        return <span key={i} className="page-dots">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    className="page-nav"
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredPosts.length / postsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                  >
                    Next
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      
    </section>
  );
};

export default Blog;
