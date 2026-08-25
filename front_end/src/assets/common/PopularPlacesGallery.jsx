
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

      </Container>
    </section>
  );
}

export default PopularPlacesGallery;
