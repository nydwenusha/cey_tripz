//inside the vehicle card

import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../css/VehicleDetails.scss";
import Layout from "../../Layout";
import { getVehicleById } from "../data/vehicles";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadVehicle = async () => {
      setLoading(true);

      try {
        const nextVehicle = await getVehicleById(id);

        if (!isActive) {
          return;
        }

        setVehicle(nextVehicle || null);
        setMainImg(nextVehicle?.images?.[0] || "");
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Error fetching vehicle details:", error);
        setVehicle(null);
        setMainImg("");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadVehicle();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Container className="nav-vehicle">
          <h3>Loading vehicle details...</h3>
        </Container>
      </Layout>
    );
  }

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
        <div>
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
                <div className="text-muted fw-semibold mb-2">{vehicle.type}</div>
                <h5 className="text-primary mb-3">{vehicle.price}</h5>
                <p>{vehicle.description}</p>
                <ul className="spec-list">
                  <li>Category: {vehicle.category}</li>
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
        </div>
      </Container>

    </Layout>
  );
}

export default VehicleDetails;
