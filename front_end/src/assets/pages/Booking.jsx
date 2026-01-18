import { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Booking.scss";
import Layout from "../../Layout";

function Booking() {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  return (
    <Layout>
      <div className="booking">
      <Container className="booking-card">
      <Card className="p-4 shadow-sm booking-card">
        <h2 className="text-center mb-4">Book Your Vehicle</h2>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pickup Location</Form.Label>
                <Form.Control type="text" placeholder="Enter pickup location" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Drop Location</Form.Label>
                <Form.Control type="text" placeholder="Enter drop location" required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pickup Date</Form.Label>
                <DatePicker
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  className="form-control"
                  placeholderText="Select date"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Return Date</Form.Label>
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  className="form-control"
                  placeholderText="Select date"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Vehicle Type</Form.Label>
                <Form.Select required>
                  <option value="">Select Vehicle</option>
                  <optgroup label="Mini Car">
                    <option>Suzuki Alto</option>
                  </optgroup>
                  <optgroup label="Exclusive / Sedan Car">
                    <option>Toyota Prius</option>
                    <option>Honda Shuttle</option>
                    <option>Toyota Axio</option>
                  </optgroup>
                  <optgroup label="Hatchback Car">
                    <option>Suzuki Wagon R (FX)</option>
                    <option>Suzuki Wagon R (FZ)</option>
                    <option>Suzuki Wagon R (Stingray)</option>
                  </optgroup>
                  <optgroup label="Mini Van">
                    <option>Suzuki Every</option>
                  </optgroup>
                  <optgroup label="Seater Van (Flat Roof)">
                    <option>Toyota KDH</option>
                  </optgroup>
                  <optgroup label="Seater Van (High Roof)">
                    <option>Toyota Hiace</option>
                  </optgroup>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Passengers</Form.Label>
                <Form.Control type="number" min="1" max="50" placeholder="e.g. 4" required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter any special requests..." />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary" size="lg">
              Confirm Booking
            </Button>
          </div>
        </Form>
      </Card>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="confirm-popup"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-3 shadow-sm text-center">
              <h5>✅ Booking Confirmed!</h5>
              <p>We’ve received your details. Our team will contact you soon.</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
    </div>
    </Layout>
  );
}

export default Booking;
