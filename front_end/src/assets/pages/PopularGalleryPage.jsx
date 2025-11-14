//not fixed

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "./PopularGalleryPage.css";

const galleryData = [
  {
    name: "Sigiriya Rock Fortress",
    img: "https://images.unsplash.com/photo-1590069261202-2d7dc27dbb27",
    desc: "An ancient fortress built atop a rock with mesmerizing views.",
    price: "Rs. 45,000",
    guide: true,
  },
  {
    name: "Galle Fort",
    img: "https://images.unsplash.com/photo-1603697093564-5bdbd084db9a",
    desc: "Historical seaside fortress with colonial charm and ocean breeze.",
    price: "Rs. 38,000",
    guide: false,
  },
  {
    name: "Ella Nine Arches Bridge",
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
    desc: "Iconic train bridge surrounded by misty tea plantations.",
    price: "Rs. 50,000",
    guide: true,
  },
  {
    name: "Mirissa Beach",
    img: "https://images.unsplash.com/photo-1603533492068-7e1e1b1cb4b3",
    desc: "Golden beach perfect for surfing, whale watching, and sunsets.",
    price: "Rs. 35,000",
    guide: false,
  },
  {
    name: "Nuwara Eliya",
    img: "https://images.unsplash.com/photo-1602576663273-7e5563f6c5e3",
    desc: "Cool mountain town with lush tea gardens and waterfalls.",
    price: "Rs. 48,000",
    guide: true,
  },
  {
    name: "Yala National Park",
    img: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135",
    desc: "Sri Lanka’s top wildlife destination with elephants and leopards.",
    price: "Rs. 58,000",
    guide: true,
  },
];

const feedbacks = [
  {
    name: "Nethmi Perera",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    place: "Ella Adventure",
    comment: "Absolutely stunning! The guide was friendly and helpful. Highly recommend!",
  },
  {
    name: "Kasun Silva",
    photo: "https://randomuser.me/api/portraits/men/36.jpg",
    place: "Galle Fort",
    comment: "Perfect weekend getaway. Loved the ocean breeze and colonial vibes.",
  },
  {
    name: "Sajani Fernando",
    photo: "https://randomuser.me/api/portraits/women/49.jpg",
    place: "Yala Safari",
    comment: "Saw leopards up close! Worth every rupee!",
  },
];

function PopularGalleryPage() {
  return (
    <section className="popular-gallery-page py-5">
      <Container>
        <motion.h2
          className="text-center mb-5 gallery-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌴 Sri Lankan Popular Places Gallery
        </motion.h2>

        {/* === Gallery Grid === */}
        <Row>
          {galleryData.map((item, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
              <motion.div
                className="gallery-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="img-box">
                  <img src={item.img} alt={item.name} />
                  <div className="overlay">
                    <div className="overlay-content">
                      <h5>{item.name}</h5>
                      <p>{item.desc}</p>
                      <p>
                        {item.guide ? "🧭 With Guide" : "🚗 Without Guide"} –{" "}
                        <strong>{item.price}</strong>
                      </p>
                      <Button variant="primary" className="book-now-btn">
                        Book Package
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* === Feedback Section === */}
        <motion.h3
          className="text-center mt-5 mb-4 feedback-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          💬 Traveler Feedback
        </motion.h3>

        <Row>
          {feedbacks.map((f, index) => (
            <Col md={4} key={index} className="mb-4">
              <motion.div
                className="feedback-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img src={f.photo} alt={f.name} className="feedback-photo" />
                <h6>{f.name}</h6>
                <p className="feedback-place">{f.place}</p>
                <p className="feedback-comment">“{f.comment}”</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default PopularGalleryPage;
