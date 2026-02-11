import { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Booking.scss";
import Layout from "../../Layout";
import api from "../services/api/api";

function Booking() {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    pickup_location: "",
    drop_location: "",
    pickup_date: null,
    return_date: null,
    vehicle_type: "",
    passengers: "",
    notes: "",
    amount:"0"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Here the formatted data

  const formattedData = {
    customer_name: formData.customer_name,
    customer_email: formData.customer_email,
    customer_phone: formData.customer_phone,
    pickup_location: formData.pickup_location,
    drop_location: formData.drop_location,
    pickup_date: formData.pickup_date ? formData.pickup_date.toLocaleDateString('en-CA') : null, 
    return_date: formData.return_date ? formData.return_date.toLocaleDateString('en-CA') : null, 
    vehicle_type: formData.vehicle_type,
    passengers: formData.passengers,
    notes: formData.notes,
    amount:'0' // Set default amount to 0, you can calculate this based on vehicle type and duration if needed
  };

  const handleDateChange = (date, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date
    }));
    if (fieldName === 'pickup_date') {
      setPickupDate(date);
    } else if (fieldName === 'return_date') {
      setReturnDate(date);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const response = await api.post("/booking", formattedData);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowConfirm(false);
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          pickup_location: "",
          drop_location: "",
          pickup_date: null,
          return_date: null,
          vehicle_type: "",
          passengers: "",
          notes: "",
          amount:"0"
        });
        setPickupDate(null);
        setReturnDate(null);
      }, 3000);
      setShowConfirm(true);
      setSubmitStatus({
        type: "success",
        message: "Your booking has been confirmed! We will contact you soon.",
      });
    } catch (error) {
      if (error.response?.status === 422) {
        const messages = error.response.data.errors;
        setErrors({
          customer_name: messages.customer_name?.[0] || "",
          customer_email: messages.customer_email?.[0] || "",
          customer_phone: messages.customer_phone?.[0] || "",
          pickup_location: messages.pickup_location?.[0] || "",
          drop_location: messages.drop_location?.[0] || "",
          pickup_date: messages.pickup_date?.[0] || "",
          return_date: messages.return_date?.[0] || "",
          vehicle_type: messages.vehicle_type?.[0] || "",
          passengers: messages.passengers?.[0] || "",
          notes: messages.notes?.[0] || "",
          amount: messages.amount?.[0] || "",
        });
        setSubmitStatus({
          type: "error",
          message: "Please check the form for errors.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="booking">
        <Container className="booking-card">
          <Card className="p-4 shadow-sm booking-card">
            <h2 className="text-center mb-4">Book Your Journey</h2>

            {submitStatus && (
              <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mb-4`}>
                {submitStatus.message}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <h5 className="mb-3">Personal Information</h5>
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      isInvalid={!!errors.customer_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customer_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      isInvalid={!!errors.customer_email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customer_email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="e.g. +94 77 123 4567"
                      isInvalid={!!errors.customer_phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.customer_phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Booking Details Section */}
              <h5 className="mb-3">Booking Details</h5>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Pickup Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="pickup_location"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      placeholder="Enter pickup location"
                      isInvalid={!!errors.pickup_location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pickup_location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Drop Location <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="drop_location"
                      value={formData.drop_location}
                      onChange={handleChange}
                      placeholder="Enter drop location"
                      isInvalid={!!errors.drop_location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.drop_location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Pickup Date <span className="text-danger">*</span></Form.Label>
                    <DatePicker
                      selected={formData.pickup_date}
                      onChange={(date) => handleDateChange(date, 'pickup_date')}
                      className={`form-control ${errors.pickup_date ? 'is-invalid' : ''}`}
                      placeholderText="Select pickup date"
                      dateFormat="yyyy-MM-dd"
                    />
                    {errors.pickup_date && (
                      <div className="invalid-feedback d-block">{errors.pickup_date}</div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Return Date <span className="text-danger">*</span></Form.Label>
                    <DatePicker
                      selected={formData.return_date}
                      onChange={(date) => handleDateChange(date, 'return_date')}
                      className={`form-control ${errors.return_date ? 'is-invalid' : ''}`}
                      placeholderText="Select return date"
                      dateFormat="yyyy-MM-dd"
                    />
                    {errors.return_date && (
                      <div className="invalid-feedback d-block">{errors.return_date}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Vehicle Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      isInvalid={!!errors.vehicle_type}
                    >
                      <option value="">Select Vehicle</option>
                      <optgroup label="Mini Car">
                        <option value="Suzuki Alto">Suzuki Alto</option>
                      </optgroup>
                      <optgroup label="Exclusive / Sedan Car">
                        <option value="Toyota Prius">Toyota Prius</option>
                        <option value="Honda Shuttle">Honda Shuttle</option>
                        <option value="Toyota Axio">Toyota Axio</option>
                      </optgroup>
                      <optgroup label="Hatchback Car">
                        <option value="Suzuki Wagon R (FX)">Suzuki Wagon R (FX)</option>
                        <option value="Suzuki Wagon R (FZ)">Suzuki Wagon R (FZ)</option>
                        <option value="Suzuki Wagon R (Stingray)">Suzuki Wagon R (Stingray)</option>
                      </optgroup>
                      <optgroup label="Mini Van">
                        <option value="Suzuki Every">Suzuki Every</option>
                      </optgroup>
                      <optgroup label="Seater Van (Flat Roof)">
                        <option value="Toyota KDH">Toyota KDH</option>
                      </optgroup>
                      <optgroup label="Seater Van (High Roof)">
                        <option value="Toyota Hiace">Toyota Hiace</option>
                      </optgroup>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.vehicle_type}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Number of Passengers <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      placeholder="e.g. 4"
                      isInvalid={!!errors.passengers}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.passengers}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter any special requests (child seat, extra luggage, etc.)"
                />
              </Form.Group>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
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
                  <p>We've received your details. Our team will contact you soon.</p>
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