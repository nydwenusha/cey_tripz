import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import "../css/BlogPost.scss";
import Layout from "../../Layout";
import api from "../services/api/api";
import { getBlogImageUrl } from "../utils/blogImages";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch single blog post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching post with ID:", id);
        const response = await api.get(`/blogPosts/${id}`);
        console.log("API Response:", response);

        if (response.status === 200) {
          // Handle different response structures
          let postData = response.data;

          // If response has nested blogPost or data property
          if (response.data.blogPost) {
            postData = response.data.blogPost;
          } else if (response.data.data) {
            postData = response.data.data;
          }

          console.log("Post data:", postData);

          if (postData && postData.id && postData.status === 'published') {
            setPost(postData);
            setLikesCount(postData.likes || 0);

            // Fetch related posts (same category, different id)
            if (postData.category) {
              try {
                const relatedResponse = await api.get(`/blogPosts`, {
                  params: {
                    category: postData.category,
                    exclude: id,
                    limit: 3
                  }
                });
                console.log("Related posts response:", relatedResponse);

                if (relatedResponse.status === 200) {
                  let relatedData = relatedResponse.data.blogPosts || relatedResponse.data.data || relatedResponse.data;
                  if (Array.isArray(relatedData)) {
                    const filtered = relatedData.filter(p => p.id !== parseInt(id) && p.status === 'published');
                    setRelatedPosts(filtered.slice(0, 3));
                  }
                }
              } catch (err) {
                console.error("Error fetching related posts:", err);
              }
            }
          } else {
            setError("Post not found");
          }
        } else {
          setError("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        if (error.response) {
          console.log("Error response:", error.response);
          if (error.response.status === 404) {
            setError("Post not found");
          } else {
            setError("Failed to load post. Please try again.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError("Invalid post ID");
      setLoading(false);
    }
  }, [id]);

  const handleLike = async () => {
    const newLikesCount = liked ? likesCount - 1 : likesCount + 1;

    // Optimistic update
    setLikesCount(newLikesCount);
    setLiked(!liked);

    try {
      // Call API to update likes
      const response = await api.post(`/blogPosts/${id}/like`);
      if (response.status !== 200) {
        // Revert if API call fails
        setLikesCount(likesCount);
        setLiked(liked);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert on error
      setLikesCount(likesCount);
      setLiked(liked);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/blog/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback
      prompt("Copy this link:", shareUrl);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  const handleRelatedPostClick = (postId) => {
    navigate(`/blog/${postId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    navigate('/#blog');
  };

  const getAuthorInitial = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className="blog-post-loading">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading amazing story...
          </motion.p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="blog-post-error">
          <Container>
            <motion.div
              className="error-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Story Not Found</h2>
              <p>{error || "The travel story you're looking for doesn't exist."}</p>
              <button onClick={handleBackToBlog} className="back-to-blog-btn">
                ← Back to Blog
              </button>
            </motion.div>
          </Container>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="blog-post-wrapper">
        {/* Hero Banner */}
        <div className="post-hero-banner">
          <div className="post-hero-navigation">
            <Container>
              <button onClick={handleBackToBlog} className="nav-back-btn">
                ← Back to Blog
              </button>
            </Container>
          </div>
          <div className="hero-image-wrapper">
            <img
              src={getBlogImageUrl(post)}
              alt={post.title}
            />
            <div className="hero-overlay"></div>
          </div>
          <Container>
            <div className="hero-content">
              <motion.span
                className="hero-category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {post.category || 'Travel'}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {post.title}
              </motion.h1>
              <motion.div
                className="hero-meta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="hero-author">
                  {post.author_avatar ? (
                    <img src={getBlogImageUrl(post.author_avatar)} alt={post.author} />
                  ) : (
                    <div className="author-initials">
                      {getAuthorInitial(post.author)}
                    </div>
                  )}
                  <div>
                    <strong>{post.author || 'Anonymous'}</strong>
                    <span>{formatDate(post.published_at || post.created_at || post.date)}</span>
                  </div>
                </div>
                <div className="hero-stats">
                  {post.location && <span>📍 {post.location}</span>}
                  <span>⏱️ {post.read_time || post.readTime || '5 min read'}</span>
                  <span>❤️ {likesCount} likes</span>
                </div>
              </motion.div>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="post-main-container">
          <Row>
            <Col lg={8}>
              <motion.article
                className="post-article"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />

                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="post-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="post-actions">
                  <button
                    className={`action-like-btn ${liked ? 'active' : ''}`}
                    onClick={handleLike}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3c1.74,0 3.41.81 4.5,2.08C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.41 22,8.5c0,3.77-3.4,6.86-8.55,11.54L12,21.35Z" />
                    </svg>
                    {likesCount} Likes
                  </button>
                  <button className="action-share-btn" onClick={handleShare}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M18,16.08c-0.76,0-1.44,0.3-1.96,0.77L8.91,12.7c0.05-0.23,0.09-0.46,0.09-0.7s-0.04-0.47-0.09-0.7l7.05-4.11c0.54,0.5,1.25,0.81,2.04,0.81c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3c0,0.24,0.04,0.47,0.09,0.7L8.04,9.81C7.5,9.31,6.79,9,6,9c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.79,0,1.5-0.31,2.04-0.81l7.12,4.16c-0.05,0.21-0.08,0.43-0.08,0.65c0,1.61,1.31,2.92,2.92,2.92c1.61,0,2.92-1.31,2.92-2.92C20.92,17.39,19.61,16.08,18,16.08z" />
                    </svg>
                    Share
                  </button>
                </div>
              </motion.article>

              {post.author && (
                <motion.div
                  className="post-author"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {post.author_avatar ? (
                    <img src={getBlogImageUrl(post.author_avatar)} alt={post.author} />
                  ) : (
                    <div className="author-initials large">
                      {getAuthorInitial(post.author)}
                    </div>
                  )}
                  <div>
                    <h4>About {post.author}</h4>
                    <p>{post.author_bio || `${post.author} is a passionate traveler and storyteller who loves exploring new destinations and sharing experiences.`}</p>
                    <div className="author-links">
                      {post.author_twitter && <a href={post.author_twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
                      {post.author_instagram && <a href={post.author_instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                    </div>
                  </div>
                </motion.div>
              )}
            </Col>

            <Col lg={4}>
              <motion.div
                className="post-sidebar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {relatedPosts.length > 0 && (
                  <div className="sidebar-card">
                    <h4>Related Stories</h4>
                    <div className="related-stories">
                      {relatedPosts.map((relatedPost) => (
                        <div
                          key={relatedPost.id}
                          className="related-story"
                          onClick={() => handleRelatedPostClick(relatedPost.id)}
                        >
                          <img
                            src={getBlogImageUrl(relatedPost)}
                            alt={relatedPost.title}
                          />
                          <div>
                            <h5>{relatedPost.title}</h5>
                            <span>{relatedPost.read_time || relatedPost.readTime || '5 min read'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="sidebar-card newsletter-card">
                  <h4>Newsletter</h4>
                  <p>Get travel stories delivered to your inbox</p>
                  <input type="email" placeholder="Your email" />
                  <button>Subscribe</button>
                </div>
              </motion.div>
            </Col>
          </Row>

          <div className="post-navigation-buttons">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-top-btn">
              Back to Top ↑
            </button>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default BlogPost;
