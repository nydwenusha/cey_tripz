//inside the vehicle card

import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../css/VehicleDetails.scss";
import Layout from "../../Layout";
import { getVehicleById } from "../data/vehicles";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = getVehicleById(id);
  const [mainImg, setMainImg] = useState(vehicle?.images?.[0]);

  useEffect(() => {
    setMainImg(vehicle?.images?.[0]);
  }, [vehicle]);

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
