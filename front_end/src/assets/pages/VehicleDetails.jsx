//inside the vehicle card

import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState } from "react";
import "../css/VehicleDetails.scss";
import Layout from "../../Layout";
import wagonr1 from "../image/wagonr1.jpg";
import wagonr2 from "../image/wagonr2.jpg";
import wagonr3 from "../image/wagonr3.jpg";
import premio1 from "../image/primio1.jpg";
import premio2 from "../image/primio2.png";
import premio3 from "../image/primio3.jpg";
import kdh1 from "../image/kdh1.jpg";
import kdh2 from "../image/kdh2.png";
import kdh3 from "../image/kdh3.jpg";
import alto1 from "../image/alto1.webp";
import alto2 from "../image/alto02.jpg";
import alto3 from "../image/alto1.webp";

const vehicleData = [
  {
    id: 1,
    name: "Suzuki Wagon R",
    price: "Rs. 12,000/day",
    images: [wagonr1, wagonr2, wagonr3],
    description:
      "This SUV provides excellent off-road performance and style. Perfect for hill country and long scenic routes.",
    specs: ["5 Seats", "AC", "4x4", "Automatic", "Bluetooth"]
  },
  {
    id: 2,
    name: "Toyota Premio",
    price: "Rs. 12,000/day",
    images: [premio1, premio2, premio3],
    description:
      "Comfort and class combined — best for couples and business trips.",
    specs: ["4 Seats", "AC", "sunroof", "Automatic", "Bluetooth"]
  },
  {
    id: 3,
    name: "Toyota KDH",
    price: "Rs. 8,000/day",
    images: [kdh1, kdh2, kdh3],
    description:
      "family trips with comfort and space. Ideal for group tours across Sri Lanka.",
    specs: ["12 Seats", "AC", "Auto Gear", "USB", "Bluetooth"]
  },
  {
    id: 4,
    name: "Suzuki Alto",
    price: "Rs. 18,000/day",
    images: [alto1, alto2, alto3],
    description:
      "Ssafe and reliable compact car perfect for city trips and solo travel.",
    specs: ["4 Seats", "AC", "Automatic", "Large Storage", "WiFi"]
  }
];

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = vehicleData.find((v) => v.id === parseInt(id));
  const [mainImg, setMainImg] = useState(vehicle?.images[0]);

  if (!vehicle)
    return (
      <Layout>
        <Container className="nav-vehicle">
          <h3>Vehicle not found.</h3>
        </Container>
      </Layout>
    );

  const handleBooking = () => {
    navigate("/booking", { state: { selectedVehicle: vehicle.name } });
  };

  return (

    <Layout>
      <Container fluid className="py-5 vehicle-details-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 shadow-sm vehicle-details-card">
            <Row>
              <Col md={6}>
                <div className="main-image-container">
                  <img
                    src={mainImg}
                    alt={vehicle.name}
                    className="img-fluid rounded main-image"
                  />
                </div>
                <div className="thumbnail-row mt-3 d-flex gap-2">
                  {vehicle.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      className={`thumbnail ${mainImg === img ? "active" : ""}`}
                      onClick={() => setMainImg(img)}
                    />
                  ))}
                </div>
              </Col>

              <Col md={6}>
                <h2>{vehicle.name}</h2>
                <h5 className="text-primary mb-3">{vehicle.price}</h5>
                <p>{vehicle.description}</p>
                <ul className="spec-list">
                  {vehicle.specs.map((s, i) => (
                    <li key={i}> {s}</li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="vehicle-book-btn"
                  onClick={handleBooking}
                >
                  Book Now
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </Container>

    </Layout>
  );
}

export default VehicleDetails;
