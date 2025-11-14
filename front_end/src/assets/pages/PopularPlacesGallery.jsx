//not fixed

import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "./PopularPlacesGallery.css";

const places = [
  {
    name: "Sigiriya Rock Fortress",
    Image: "https://i.pinimg.com/736x/78/83/b2/7883b2ee3c476146717ff826b0d55593.jpg",
    desc: "Ancient rock fortress with royal gardens and frescoes.",
  },
  {
    name: "Ella Nine Arches Bridge",
    img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
    desc: "Iconic bridge surrounded by misty tea plantations.",
  },
  {
    name: "Galle Fort",
    img: "https://images.unsplash.com/photo-1603697093564-5bdbd084db9a",
    desc: "Historic fort blending Dutch architecture and coastal charm.",
  },
  {
    name: "Mirissa Beach",
    img: "https://images.unsplash.com/photo-1603533492068-7e1e1b1cb4b3",
    desc: "Golden sandy beach famous for whale watching and sunsets.",
  },
  {
    name: "Kandy Temple of the Tooth",
    img: "https://images.unsplash.com/photo-1633964043791-88c8c9b52df4",
    desc: "Sacred Buddhist temple in the heart of the hill country.",
  },
  {
    name: "Nuwara Eliya Tea Estates",
    img: "https://images.unsplash.com/photo-1602576663273-7e5563f6c5e3",
    desc: "Cool climate and scenic tea plantations of central highlands.",
  },
  {
    name: "Yala National Park",
    img: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135",
    desc: "Sri Lanka’s top wildlife destination with leopards and elephants.",
  },
  {
    name: "Trincomalee Beach",
    img: "https://images.unsplash.com/photo-1583795484227-98d4b07ccaa8",
    desc: "Crystal-clear waters and soft white sand on the east coast.",
  },
];

function PopularPlacesGallery() {
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
          🌅 Sri Lankan Popular Places Gallery
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
      </Container>
    </section>
  );
}

export default PopularPlacesGallery;
