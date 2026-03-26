import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Blog.scss";
import { useNavigate } from "react-router-dom";
import api from "../services/api/api";

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

  // Fetch blog posts and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch blog posts
        const postsResponse = await api.get("/blogPosts");
        if (postsResponse.status === 200) {
          const postsData = postsResponse.data.blogPosts || postsResponse.data;
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
      // Call API to update likes
      const response = await api.post(`/blogPosts/${postId}/like`);
      if (response.status === 200) {
        // Update local state
        setLikedPosts(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));

        // Update posts array with new likes count
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
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
    <section className="blog-section">
      <Container>
        <motion.h2
          className="text-center mb-5 blog-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Travel Stories
        </motion.h2>

        <motion.p
          className="text-center blog-subtitle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Inspiring adventures, travel tips, and hidden gems from Sri Lanka and beyond
        </motion.p>

        <div className="blog-filters">
          <input
            type="text"
            className="search-field"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {filteredPosts.length === 0 ? (
            <motion.div
              className="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>No stories found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
            </motion.div>
          ) : (
            <>
              <div className="posts-grid">
                {currentPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="blog-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    viewport={{ once: true }}
                  >
                    <div className="card-image-wrapper" onClick={() => handleReadMore(post.id)}>
                      <img
                        src={
                          post.image
                            ? `${import.meta.env.VITE_BLOG_IMAGE_URL || 'http://localhost:8000/storage'}/${post.image}`
                            : 'https://via.placeholder.com/1200x600?text=No+Image'
                        }
                        alt={post.title}
                        className="card-image"
                      />
                      <span className="category-chip">{post.category}</span>
                    </div>

                    <div className="card-content">
                      <div className="post-meta">
                        <div className="author-info">
                          <div className="author-avatar">
                            {post.author?.charAt(0) || 'A'}
                          </div>
                          <span className="author-name">{post.author || 'Anonymous'}</span>
                        </div>
                        <span className="post-date">{formatDate(post.published_at || post.created_at)}</span>
                      </div>

                      <h3 className="post-title" onClick={() => handleReadMore(post.id)}>
                        {post.title}
                      </h3>

                      <div className="location-info">
                        <svg className="location-icon" viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
                        </svg>
                        <span className="location-text">{post.location || 'Sri Lanka'}</span>
                      </div>

                      <p className="post-excerpt">
                        {post.excerpt || (post.content?.substring(0, 150) + '...') || 'No description available'}
                      </p>

                      <div className="read-time">
                        <svg className="time-icon" viewBox="0 0 24 24" width="14" height="14">
                          <path fill="currentColor" d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M12.5,7H11v6l5.25,3.15l0.75-1.23l-4.5-2.67z" />
                        </svg>
                        <span>{post.read_time || post.readTime || '5 min read'}</span>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="tags">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="tag-chip">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button className="read-more-btn" onClick={() => handleReadMore(post.id)}>
                        Read More
                      </button>
                      <div className="action-icons">
                        <button
                          className={`like-button ${likedPosts[post.id] ? 'liked' : ''}`}
                          onClick={() => handleLike(post.id, post.likes)}
                        >
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3c1.74,0 3.41.81 4.5,2.08C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.41 22,8.5c0,3.77-3.4,6.86-8.55,11.54L12,21.35Z" />
                          </svg>
                          <span>{likedPosts[post.id] ? (post.likes || 0) + 1 : post.likes || 0}</span>
                        </button>
                        <button className="share-button" onClick={() => handleShare(post)}>
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M18,16.08c-0.76,0-1.44,0.3-1.96,0.77L8.91,12.7c0.05-0.23,0.09-0.46,0.09-0.7s-0.04-0.47-0.09-0.7l7.05-4.11c0.54,0.5,1.25,0.81,2.04,0.81c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3c0,0.24,0.04,0.47,0.09,0.7L8.04,9.81C7.5,9.31,6.79,9,6,9c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.79,0,1.5-0.31,2.04-0.81l7.12,4.16c-0.05,0.21-0.08,0.43-0.08,0.65c0,1.61,1.31,2.92,2.92,2.92c1.61,0,2.92-1.31,2.92-2.92C20.92,17.39,19.61,16.08,18,16.08z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {filteredPosts.length > postsPerPage && (
                <div className="pagination">
                  {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
};

export default Blog;