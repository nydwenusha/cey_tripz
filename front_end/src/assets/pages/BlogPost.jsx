import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import "../css/BlogPost.scss";
import Layout from "../../Layout";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Sample post data
  const postData = {
    id: 1,
    title: "Hidden Gems of Sri Lanka: Beyond the Tourist Trail",
    image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf",
    author: "Sarah Johnson",
    authorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    date: "March 15, 2024",
    category: "Destinations",
    location: "Sri Lanka",
    readTime: "8 min read",
    likes: 234,
    content: `
      <p>Sri Lanka, often called the "Pearl of the Indian Ocean," is a land of endless discoveries. While popular destinations like Sigiriya and Kandy attract millions of visitors, the island harbors countless hidden gems waiting to be explored by adventurous travelers.</p>
      
      <img src="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf" alt="Sri Lanka" />
      
      <h2>The Enchanting Village of Haputale</h2>
      <p>Nestled in the misty hills of the Badulla district, Haputale offers breathtaking views. The famous Lipton's Seat provides a panoramic vista that stretches across five provinces. The morning mist rising over the tea estates creates an ethereal atmosphere.</p>
      
      <h2>Secret Beaches of the East Coast</h2>
      <p>Beyond the famous Pasikudah and Arugam Bay, the east coast hides pristine beaches that remain untouched by mass tourism. Pigeon Island National Park offers spectacular snorkeling opportunities with vibrant coral reefs.</p>
      
      <h2>Essential Travel Tips</h2>
      <ul>
        <li>Hire local guides for hidden spots</li>
        <li>Travel during off-peak seasons</li>
        <li>Respect local customs and traditions</li>
        <li>Support local communities</li>
      </ul>
      
      <blockquote>
        "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
      </blockquote>
    `,
    tags: ["Hidden Gems", "Adventure", "Culture", "Travel Tips"]
  };

  useEffect(() => {
    setTimeout(() => {
      setPost(postData);
      setLikesCount(postData.likes);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading story...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="blog-post-wrapper">
        {/* Hero Banner */}
        <div className="post-hero-banner">
          <div className="hero-image-wrapper">
            <img src={post.image} alt={post.title} />
            <div className="hero-overlay"></div>
          </div>
          <Container>
            <div className="hero-content">
              <span className="hero-category">{post.category}</span>
              <h1>{post.title}</h1>
              <div className="hero-meta">
                <div className="hero-author">
                  <img src={post.authorAvatar} alt={post.author} />
                  <div>
                    <strong>{post.author}</strong>
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="hero-stats">
                  <span>📍 {post.location}</span>
                  <span>⏱️ {post.readTime}</span>
                  <span>❤️ {likesCount}</span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="post-main-container">
          <Row>
            <Col lg={8}>
              <article className="post-article">
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="post-tag">#{tag}</span>
                  ))}
                </div>

                <div className="post-actions">
                  <button
                    className={`action-like-btn ${liked ? 'active' : ''}`}
                    onClick={handleLike}
                  >
                    ❤️ {likesCount} Likes
                  </button>
                  <button className="action-share-btn">
                    📤 Share
                  </button>
                </div>
              </article>

              <div className="post-author">
                <img src={post.authorAvatar} alt={post.author} />
                <div>
                  <h4>About {post.author}</h4>
                  <p>Sarah is a travel writer and photographer who has been exploring Sri Lanka for over a decade.</p>
                  <div className="author-links">
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="post-sidebar">
                <div className="sidebar-card">
                  <h4>Related Stories</h4>
                  <div className="related-stories">
                    <div className="related-story">
                      <img src={post.image} alt="Related" />
                      <div>
                        <h5>Ultimate Guide to Backpacking Sri Lanka</h5>
                        <span>12 min read</span>
                      </div>
                    </div>
                    <div className="related-story">
                      <img src={post.image} alt="Related" />
                      <div>
                        <h5>Sustainable Tourism in Sri Lanka</h5>
                        <span>6 min read</span>
                      </div>
                    </div>
                    <div className="related-story">
                      <img src={post.image} alt="Related" />
                      <div>
                        <h5>Best Street Food in Colombo</h5>
                        <span>5 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sidebar-card newsletter-card">
                  <h4>Newsletter</h4>
                  <p>Get travel stories delivered to your inbox</p>
                  <input type="email" placeholder="Your email" />
                  <button>Subscribe</button>
                </div>
              </div>
            </Col>
          </Row>

          <div className="post-navigation-buttons">
            <button onClick={() => navigate('/blog')} className="nav-back-btn">
              ← Back to Blog
            </button>
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