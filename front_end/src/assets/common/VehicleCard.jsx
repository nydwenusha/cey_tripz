import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../css/VehicleCard.scss";
import { vehicles } from "../data/vehicles";

function VehicleCards() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const animatedTextRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (animatedTextRef.current) {
      observer.observe(animatedTextRef.current);
    }

    return () => {
      if (animatedTextRef.current) {
        observer.unobserve(animatedTextRef.current);
      }
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
        <Row className="justify-content-center g-4">
          {vehicles.map((v) => (
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
                    <div className="vehicle-category">{v.category}</div>
                    {/* Uncomment and use price if available */}
                    {/* <Card.Text className="text-primary fw-semibold">{v.price}</Card.Text> */}
                    <Card.Text className="text-muted small">
                      {v.shortDesc}
                    </Card.Text>
                  </div>
                  <Link to={`/vehicles/${v.id}`} className="btn btn-primary mt-3">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default VehicleCards;
