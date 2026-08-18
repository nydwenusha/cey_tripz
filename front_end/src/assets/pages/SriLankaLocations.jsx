import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api/api";
import "../css/SriLankaLocations.scss";

const MotionDiv = motion.div;
const MotionHeading = motion.h2;
const MotionImage = motion.img;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatPrice = (price) => {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) ? priceFormatter.format(numericPrice) : "Contact us";
};

function TourImage({ tour }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!tour.photoUrl || imageFailed) {
    return (
      <div className="tour-img-placeholder" role="img" aria-label={`${tour.name} image unavailable`}>
        <i className="bi bi-image" aria-hidden="true" />
        <span>Image coming soon</span>
      </div>
    );
  }

  return (
    <MotionImage
      src={tour.photoUrl}
      alt={tour.name}
      className="tour-img"
      loading="lazy"
      onError={() => setImageFailed(true)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
    />
  );
}

function SriLankaLocations() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTours = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tours", { signal });
      const toursData = response.data?.tours || response.data?.data || response.data || [];

      setTours(Array.isArray(toursData) ? toursData : []);
    } catch (requestError) {
      if (requestError.code === "ERR_CANCELED") {
        return;
      }

      console.error("Failed to load tours:", requestError);
      setTours([]);
      setError(requestError.response?.data?.message || "Unable to load tour packages right now.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTours(controller.signal);

    return () => controller.abort();
  }, [loadTours]);

  const handleBooking = (tour) => {
    navigate("/booking", {
      state: {
        tourId: tour.id,
        selectedPackage: tour.name,
        destination: tour.destination,
        route: tour.destination,
        duration: tour.duration,
        price: formatPrice(tour.price),
      },
    });
  };

  return (
    <section className="locations-section py-5">
      <Container>
        <MotionHeading
          className="text-center mb-5 section-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Locations &amp; Packages
        </MotionHeading>

        {loading && (
          <div className="tour-state" role="status" aria-live="polite">
            <Spinner animation="border" variant="primary" />
            <span>Loading tour packages...</span>
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="tour-state tour-error">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={() => loadTours()}>
              Try again
            </Button>
          </Alert>
        )}

        {!loading && !error && tours.length === 0 && (
          <Alert variant="info" className="tour-state">
            New tour packages are coming soon. Please check back later.
          </Alert>
        )}

        {!loading && !error && tours.length > 0 && (
          <Row>
            {tours.map((tour, index) => (
              <Col md={4} sm={6} xs={12} key={tour.id || `${tour.name}-${index}`} className="mb-4">
                <MotionDiv
                  className="h-100"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.5) }}
                  whileHover={{ scale: 1.03 }}
                  viewport={{ once: true }}
                >
                  <Card className="tour-card h-100 shadow-sm border-0">
                    <div className="img-wrapper">
                      <TourImage tour={tour} />
                      {tour.featured && <span className="tour-featured-badge">Featured</span>}
                    </div>

                    <Card.Body className="d-flex flex-column">
                      {tour.category && <span className="tour-category">{tour.category}</span>}
                      <Card.Title className="tour-name">{tour.name}</Card.Title>
                      {tour.description && <Card.Text className="tour-desc">{tour.description}</Card.Text>}

                      <div className="tour-details">
                        {tour.destination && (
                          <p className="tour-route">
                            <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                            <span><strong>Destination:</strong> {tour.destination}</span>
                          </p>
                        )}
                        {tour.duration && (
                          <p className="tour-days">
                            <i className="bi bi-calendar3" aria-hidden="true" />
                            <span><strong>Duration:</strong> {tour.duration}</span>
                          </p>
                        )}
                        {tour.maxParticipants && (
                          <p className="tour-capacity">
                            <i className="bi bi-people-fill" aria-hidden="true" />
                            <span><strong>Up to:</strong> {tour.maxParticipants} travelers</span>
                          </p>
                        )}
                      </div>

                      <p className="tour-price">{formatPrice(tour.price)}</p>
                      <Button className="book-btn mt-auto" onClick={() => handleBooking(tour)}>
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </MotionDiv>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}

export default SriLankaLocations;
