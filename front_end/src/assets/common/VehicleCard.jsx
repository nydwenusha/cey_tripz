import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../css/VehicleCard.scss";
import { getVehicles } from "../data/vehicles";

function VehicleCards() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const animatedTextRef = useRef(null);

  useEffect(() => {
    const target = animatedTextRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadVehicles = async () => {
      try {
        const nextVehicles = await getVehicles();

        if (!isActive) {
          return;
        }

        setVehicles(nextVehicles);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Error fetching vehicles:", error);
        setVehicles([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      isActive = false;
    };
  }, []);

  const handleDetails = (id) => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <section className="vehicle-section">
      <div ref={animatedTextRef} className={`hero-animated-text ${isVisible ? 'animate' : ''}`}>
        <span>Discover • Explore • Travel • Experience Sri Lanka With Cey<span style={{ color: "#F2B426" }}>Tripz</span></span>
      </div>
      <Container fluid className="py-5">
        <h2 className="text-center mb-5">Available Vehicles</h2>
        {loading ? (
          <div className="text-center text-muted">Loading vehicles...</div>
        ) : (
          <Row className="justify-content-center g-4">
            {vehicles.length === 0 ? (
              <Col xs={12}>
                <div className="text-center text-muted">No vehicles available right now.</div>
              </Col>
            ) : (
              vehicles.map((v) => (
                <Col key={v.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="vehicle-card h-100 shadow-lg">
                    <div
                      className="vehicle-img-wrapper"
                      onClick={() => handleDetails(v.id)}
                    >
                      <Card.Img
                        variant="top"
                        src={v.cardImg}
                        alt={v.name}
                        className="vehicle-img"
                      />
                    </div>
                    <Card.Body className="text-center d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title>{v.name}</Card.Title>
                        <div className="vehicle-category">{v.type}</div>
                        <Card.Text className="text-primary fw-semibold">
                          {v.price}
                        </Card.Text>
                        <Card.Text className="text-muted small vehicle-description">
                          {v.shortDesc}
                        </Card.Text>
                      </div>
                      <Link to={`/vehicles/${v.id}`} className="btn btn-primary mt-3">
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </section>
  );
}

export default VehicleCards;
