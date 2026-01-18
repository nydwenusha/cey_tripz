//Packages section for Sri Lanka locations

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../css/SriLankaLocations.scss";
import nineArchImg from "../image/ninearch.jpg";
import ambuluwawaImg from "../image/ambuluwawa.jpeg";
import jaffnaImg from "../image/jaffna.webp";
import sigiriyaImg from "../image/sigiriya-2.webp";
import arugamBayImg from "../image/arugambay.jpg";
import daladaImg from "../image/dhaladamaligawa.jpg";

const tourPackages = [
  {
    name: "Nine Arch bridge",
    desc: "Explore the misty hills of Ella with tea gardens, waterfalls, and the Nine Arches Bridge.",
    img: nineArchImg,
    route: "Colombo ➜ Kandy ➜ Ella",
    // days: "3 Days / 2 Nights",
    price: "$2 / 2KM",
  },
  {
    name: "Ambuluwawa tower",
    desc: "Exploring its essence, Ambuluwawa unfolds as more than just the tower's name; rising proudly at 3,567 feet.",
    img: ambuluwawaImg,
    route: "Colombo ➜ Ambuluwawa",
    // days: "4 Days / 3 Nights",
    price: "$2 / 2KM",
  },
  {
    name: "Jaffna",
    desc: "Jaffna is the capital of Sri Lanka’s Northern Province and the administrative center of the Jaffna District.",
    img: jaffnaImg,
    route: "Colombo ➜ Jaffna",
    // days: "5 Days / 4 Nights",
    price: "$2 / 2KM",
  },
  {
    name: "Sigiriya",
    desc: "Sigiriya Lion Rock is one of the most valuable historical monuments of Sri Lanka.",
    img: sigiriyaImg,
    route: "Colombo ➜ Kandy ➜ Ella",
    // days: "3 Days / 2 Nights",
    price: "$2 / 2KM",
  },
  {
    name: "Arugam Bay",
    desc: "Arugam Bay is a popular destination for Israeli tourists.height waves and surfing.",
    img: arugamBayImg,
    route: "Colombo ➜ Pottuvil ➜ Arugam Bay",
    // days: "4 Days / 3 Nights",
    price: "$2 / 2KM",
  },
  {
    name: "Kandy & Central Highlands",
    desc: "The city and the region have been known by many different names and versions of those names.",
    img: daladaImg,
    route: "Colombo ➜ Kandy",
    // days: "2 Days / 1 Night",
    price: "$2 / 2KM",
  },
];

function SriLankaLocations() {
  const navigate = useNavigate();

  const handleBooking = (pkg) => {
    navigate("/booking", { 
      state: { 
        selectedPackage: pkg.name,
        route: pkg.route,
        duration: pkg.days,
        price: pkg.price
      } 
    });
  };

  return (
    <section className="locations-section py-5">
      <Container>
        <motion.h2
          className="text-center mb-5 section-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Locations & Packages
        </motion.h2>

        <Row>
          {tourPackages.map((pkg, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                viewport={{ once: true }}
              >
                <Card className="tour-card shadow-sm border-0">
                  <div className="img-wrapper">
                    <motion.img
                      src={pkg.img}
                      alt={pkg.name}
                      className="tour-img"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="tour-name">{pkg.name}</Card.Title>
                    <Card.Text className="tour-desc">{pkg.desc}</Card.Text>
                    <p className="tour-route">🧭 Route: {pkg.route}</p>
                    <p className="tour-days">📅 Duration: {pkg.days}</p>
                    <p className="tour-price">💰 {pkg.price}</p>
                    <Button 
                      variant="primary" 
                      className="book-btn"
                      onClick={() => handleBooking(pkg)}
                    >
                      Book Now
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SriLankaLocations;
