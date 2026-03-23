import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Blog.scss";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const postsPerPage = 6;

  // Sample blog posts data with Sri Lanka focus
  const samplePosts = [
    {
      id: 1,
      title: "Hidden Gems of Sri Lanka: Beyond the Tourist Trail",
      excerpt: "Discover lesser-known paradises in the pearl of the Indian Ocean...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "Destinations",
      location: "Sri Lanka",
      readTime: "8 min read",
      likes: 234,
      comments: 45,
      tags: ["Hidden Gems", "Adventure", "Culture"]
    },
    {
      id: 2,
      title: "Ultimate Guide to Backpacking Sri Lanka on a Budget",
      excerpt: "Tips and tricks for exploring the island paradise without breaking the bank...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf",
      author: "Mike Chen",
      date: "March 12, 2024",
      category: "Travel Tips",
      location: "Sri Lanka",
      readTime: "12 min read",
      likes: 567,
      comments: 89,
      tags: ["Budget Travel", "Backpacking", "Tips"]
    },
    {
      id: 3,
      title: "Sustainable Tourism: Protecting Sri Lanka's Natural Beauty",
      excerpt: "Learn eco-friendly travel practices that help preserve the island's ecosystem...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      author: "Emma Watson",
      date: "March 10, 2024",
      category: "Sustainability",
      location: "Sri Lanka",
      readTime: "6 min read",
      likes: 892,
      comments: 156,
      tags: ["Eco-Friendly", "Sustainable", "Conservation"]
    },
    {
      id: 4,
      title: "Best Street Food Markets in Colombo",
      excerpt: "A food lover's guide to the most delicious street food experiences in the capital...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
      author: "Lisa Wong",
      date: "March 8, 2024",
      category: "Food & Drink",
      location: "Colombo, Sri Lanka",
      readTime: "5 min read",
      likes: 445,
      comments: 67,
      tags: ["Food", "Markets", "Sri Lankan Cuisine"]
    },
    {
      id: 5,
      title: "Photography Tips for Capturing Sri Lankan Landscapes",
      excerpt: "Professional tips to take stunning photos of tea plantations, beaches, and wildlife...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1551696870-8e7f5e6f6b8a",
      author: "David Miller",
      date: "March 5, 2024",
      category: "Photography",
      location: "Sri Lanka",
      readTime: "7 min read",
      likes: 678,
      comments: 92,
      tags: ["Photography", "Tips", "Landscape"]
    },
    {
      id: 6,
      title: "Top 5 Safari Experiences in Sri Lanka",
      excerpt: "Incredible wildlife encounters across Yala, Udawalawe, and Wilpattu...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      author: "James Wilson",
      date: "March 3, 2024",
      category: "Adventure",
      location: "Sri Lanka",
      readTime: "10 min read",
      likes: 723,
      comments: 108,
      tags: ["Safari", "Wildlife", "Adventure"]
    },
    {
      id: 7,
      title: "Tea Trail: Exploring Sri Lanka's Hill Country",
      excerpt: "Journey through misty mountains and rolling tea plantations...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      author: "Priya Sharma",
      date: "March 1, 2024",
      category: "Culture",
      location: "Nuwara Eliya, Sri Lanka",
      readTime: "9 min read",
      likes: 567,
      comments: 78,
      tags: ["Tea", "Hill Country", "Culture"]
    },
    {
      id: 8,
      title: "Sacred Cities: A Spiritual Journey Through Sri Lanka",
      excerpt: "Visit ancient temples, stupas, and sacred sites across the island...",
      content: "Full content here...",
      image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf",
      author: "Amara Perera",
      date: "February 28, 2024",
      category: "Culture",
      location: "Sri Lanka",
      readTime: "11 min read",
      likes: 834,
      comments: 123,
      tags: ["Spiritual", "Temples", "History"]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, selectedCategory]);

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const categories = ['all', ...new Set(posts.map(post => post.category))];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const [likedPosts, setLikedPosts] = useState({});

  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const navigate = useNavigate();

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
                    <div className="card-image-wrapper">
                      <img src={post.image} alt={post.title} className="card-image" />
                      <span className="category-chip">{post.category}</span>
                    </div>

                    <div className="card-content">
                      <div className="post-meta">
                        <div className="author-info">
                          <div className="author-avatar">
                            {post.author.charAt(0)}
                          </div>
                          <span className="author-name">{post.author}</span>
                        </div>
                        <span className="post-date">{post.date}</span>
                      </div>

                      <h3 className="post-title">{post.title}</h3>

                      <div className="location-info">
                        <svg className="location-icon" viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z"/>
                        </svg>
                        <span className="location-text">{post.location}</span>
                      </div>

                      <p className="post-excerpt">{post.excerpt}</p>

                      <div className="read-time">
                        <svg className="time-icon" viewBox="0 0 24 24" width="14" height="14">
                          <path fill="currentColor" d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8S16.42,20,12,20z M12.5,7H11v6l5.25,3.15l0.75-1.23l-4.5-2.67z"/>
                        </svg>
                        <span>{post.readTime}</span>
                      </div>

                      <div className="tags">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="tag-chip">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button className="read-more-btn" onClick={()=>{
                        navigate('/blog/1');
                      }}>
                        Read More
                      </button>
                      <div className="action-icons">
                        <button 
                          className={`like-button ${likedPosts[post.id] ? 'liked' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3c1.74,0 3.41.81 4.5,2.08C13.09,3.81 14.76,3 16.5,3 19.58,3 22,5.41 22,8.5c0,3.77-3.4,6.86-8.55,11.54L12,21.35Z"/>
                          </svg>
                          <span>{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
                        </button>
                        <button className="comment-button">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M21,6H3C1.9,6,1,6.9,1,8v10c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M21,8v2H3V8H21z M3,18v-6h18v6H3z"/>
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                        <button className="share-button">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M18,16.08c-0.76,0-1.44,0.3-1.96,0.77L8.91,12.7c0.05-0.23,0.09-0.46,0.09-0.7s-0.04-0.47-0.09-0.7l7.05-4.11c0.54,0.5,1.25,0.81,2.04,0.81c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3c0,0.24,0.04,0.47,0.09,0.7L8.04,9.81C7.5,9.31,6.79,9,6,9c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.79,0,1.5-0.31,2.04-0.81l7.12,4.16c-0.05,0.21-0.08,0.43-0.08,0.65c0,1.61,1.31,2.92,2.92,2.92c1.61,0,2.92-1.31,2.92-2.92C20.92,17.39,19.61,16.08,18,16.08z"/>
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