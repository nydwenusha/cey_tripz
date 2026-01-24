
//Beauty Of Sri Lanka

import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/PopularPlacesGallery.scss";
import sigiriyaImg from "../image/sigiriya-2.webp";
import nineArchImg from "../image/ninearch.jpg";
import mirissaImg from "../image/arugambay.jpg";
import kandyTempleImg from "../image/dhaladamaligawa.jpg";
import teaEstateImg from "../image/abtF2.jpg";
import yalaImg from "../image/abtG3.jpg";
import trincoImg from "../image/Nilaveli.webp";
import colomboImg from "../image/colombo.jpg";
import galleImg from "../image/galleF.jpg";

const places = [
  {
    name: "Sigiriya Rock Fortress",
    img: sigiriyaImg,
    desc: "Ancient rock fortress with royal gardens and frescoes.",
  },
  {
    name: "Ella Nine Arches Bridge",
    img: nineArchImg,
    desc: "Iconic bridge surrounded by misty tea plantations.",
  },
  {
    name: "Galle Fort",
    img: galleImg,
    desc: "Historic fort blending Dutch architecture and coastal charm.",
  },
  {
    name: "Mirissa Beach",
    img: mirissaImg,
    desc: "Golden sandy beach famous for whale watching and sunsets.",
  },
  {
    name: "Kandy Temple of the Tooth",
    img: kandyTempleImg,
    desc: "Sacred Buddhist temple in the heart of the hill country.",
  },
  {
    name: "Nuwara Eliya Tea Estates",
    img: teaEstateImg,
    desc: "Cool climate and scenic tea plantations of central highlands.",
  },
  {
    name: "Yala National Park",
    img: yalaImg,
    desc: "Sri Lanka’s top wildlife destination with leopards and elephants.",
  },
  {
    name: "Trincomalee Beach",
    img: trincoImg,
    desc: "Crystal-clear waters and soft white sand on the east coast.",
  },
  {
    name: "Colombo City ",
    img: colomboImg,
    desc: "colombo is a strong fo the sri lanka.",
  },
];

function PopularPlacesGallery() {
  const storageKey = "beauty-of-sri-lanka-reviews";

  const defaultReviews = useMemo(
    () => [
      {
        id: "rev-1",
        name: "Anika & Joel",
        rating: 5,
        comment: "Sunrise at Sigiriya and whale watching in Mirissa made our trip unforgettable.",
        image: mirissaImg,
        location: "Mirissa & Sigiriya",
      },
      {
        id: "rev-2",
        name: "Sahan P.",
        rating: 4,
        comment: "Loved the tea trails and misty mornings in Ella. Smooth transport and friendly guides!",
        image: teaEstateImg,
        location: "Ella",
      },
    ],
    []
  );

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
      return saved ? JSON.parse(saved) : defaultReviews;
    } catch (err) {
      return defaultReviews;
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    rating: "5",
    comment: "",
    location: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(reviews));
      }
    } catch (err) {
      // ignore storage errors
    }
  }, [reviews, storageKey]);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (evt) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result?.toString() || "";
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      name: formData.name.trim(),
      rating: Number(formData.rating) || 0,
      comment: formData.comment.trim(),
      location: formData.location.trim() || "Across Sri Lanka",
      image: formData.image || sigiriyaImg,
    };

    setReviews((prev) => [newReview, ...prev]);
    setFormData({ name: "", rating: "5", comment: "", location: "", image: "" });
    setPreview("");
  };

  const renderStars = (count) => "★★★★★".slice(0, Math.max(0, Math.min(5, count)));

  return (
    <section className="gallery-section py-5">
      <Container>
        <motion.h2
          className="text-center mb-5 gallery-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Beauty Of Sri Lanka
        </motion.h2>

        <div className="gallery-grid">
          {places.map((place, index) => (
            <motion.div
              key={index}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="gallery-image-wrapper">
                <img src={place.img} alt={place.name} className="gallery-image" />
                <div className="gallery-overlay">
                  <motion.div
                    className="gallery-details"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <h5>{place.name}</h5>
                    <p>{place.desc}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="reviews-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="review-form-card">
            <h3 className="mb-3">Share Your Experience</h3>
            <p className="text-muted small mb-4">
              Tell fellow travelers about your moments under the Beauty of Sri Lanka section.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label htmlFor="review-name">Your Name</label>
                <input
                  id="review-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Dilan & Maya"
                  required
                />
              </div>

              <div className="form-row inline">
                <div>
                  <label htmlFor="review-rating">Stars</label>
                  <select id="review-rating" name="rating" value={formData.rating} onChange={handleInputChange}>
                    {[5, 4, 3, 2, 1].map((val) => (
                      <option key={val} value={val}>
                        {val} Star{val > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="review-location">Where</label>
                  <input
                    id="review-location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Ella, Mirissa"
                  />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="review-comment">Your Story</label>
                <textarea
                  id="review-comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="What made this place special?"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="review-image">Add a memory (image)</label>
                <input id="review-image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} alt="Preview" className="review-preview" />}
              </div>

              <button type="submit" className="submit-btn">
                Post Review
              </button>
            </form>
          </div>

          <div className="reviews-feed">
            <div className="reviews-feed__header">
              <h3>Recent Traveler Stories</h3>
              <p className="text-muted small mb-0">Real moments from the Beauty of Sri Lanka gallery.</p>
            </div>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="review-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="review-image" style={{ backgroundImage: `url(${review.image})` }}>
                    <span className="review-location">{review.location}</span>
                  </div>
                  <div className="review-body">
                    <div className="review-meta">
                      <strong>{review.name}</strong>
                      <span className="review-stars">{renderStars(review.rating)}</span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default PopularPlacesGallery;
