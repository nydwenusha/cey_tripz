
//Beauty Of Sri Lanka

import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/PopularPlacesGallery.scss";

const places = [
  {
    name: "Sigiriya Rock Fortress",
    img: "https://wallpaperaccess.com/full/8208378.jpg",
    desc: "Ancient rock fortress with royal gardens and frescoes.",
  },
  {
    name: "Ella Nine Arches Bridge",
    img: "https://www.orienthotelsl.com/wp-content/uploads/2023/01/Nine-Arch-Bridge-Ella-1200x630-1.jpg",
    desc: "Iconic bridge surrounded by misty tea plantations.",
  },
  {
    name: "Galle Fort",
    img: "https://www.themorning.lk/_next/image?url=https:%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fthe-morning-39270.appspot.com%2Fo%2Farticles%252FxR3p67owvdTx9EYZ1XSP%3Falt%3Dmedia%26token%3D6102a5a0-3320-4437-8475-4ed42327cd4c&w=3840&q=80",
    desc: "Historic fort blending Dutch architecture and coastal charm.",
  },
  {
    name: "Mirissa Beach",
    img: "https://i.pinimg.com/originals/5c/5c/8e/5c5c8eb5a9ef89b5d82e5eb417d0debc.jpg",
    desc: "Golden sandy beach famous for whale watching and sunsets.",
  },
  {
    name: "Kandy Temple of the Tooth",
    img: "http://www.pearlceylon.com/images/destination/kandy/temple-of-tooth.jpg",
    desc: "Sacred Buddhist temple in the heart of the hill country.",
  },
  {
    name: "Nuwara Eliya Tea Estates",
    img: "https://wallpaperaccess.com/full/6153887.jpg",
    desc: "Cool climate and scenic tea plantations of central highlands.",
  },
  {
    name: "Yala National Park",
    img: "https://cdn.getyourguide.com/img/location/5c83eb378b7ca.jpeg/88.jpg",
    desc: "Sri Lanka’s top wildlife destination with leopards and elephants.",
  },
  {
    name: "Trincomalee Beach",
    img: "https://saltinourhair.com/wp-content/uploads/2018/05/things-to-do-trincomalee-main-beach.jpg?x76699",
    desc: "Crystal-clear waters and soft white sand on the east coast.",
  },
  {
    name: "Colombo City ",
    img: "https://wowiwalkers.com/wp-content/uploads/2023/03/Price_Lotus-Tower_Colombo_Sri-Lanka_Blog-1024x683.jpg",
    desc: "colombo is a strong fo the sri lanka.",
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
          🌅 Beauty Of Sri Lanka
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
