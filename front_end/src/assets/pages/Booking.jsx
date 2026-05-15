import { useEffect, useMemo, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Booking.scss";
import Layout from "../../Layout";
import api from "../services/api/api";

const MotionDiv = motion.div;

const initialFormData = {
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
  amount: "0",
};

function Booking() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadVehicles = async () => {
      try {
        const response = await api.get("/vehicles");

        if (!isActive) {
          return;
        }

        setVehicleOptions(Array.isArray(response.data?.vehicles) ? response.data.vehicles : []);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Failed to load vehicles:", error);
        setVehicleOptions([]);
      } finally {
        if (isActive) {
          setVehiclesLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      isActive = false;
    };
  }, []);

  const groupedVehicleOptions = useMemo(() => (
    vehicleOptions.reduce((groups, vehicle) => {
      const groupLabel = vehicle.type || vehicle.category || "Other Vehicles";

      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }

      groups[groupLabel].push(vehicle);
      return groups;
    }, {})
  ), [vehicleOptions]);

  const handleDateChange = (date, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const formattedData = {
    customer_name: formData.customer_name.trim(),
    customer_email: formData.customer_email.trim(),
    customer_phone: formData.customer_phone.trim(),
    pickup_location: formData.pickup_location.trim(),
    drop_location: formData.drop_location.trim(),
    pickup_date: formData.pickup_date ? formData.pickup_date.toLocaleDateString("en-CA") : null,
    return_date: formData.return_date ? formData.return_date.toLocaleDateString("en-CA") : null,
    vehicle_type: formData.vehicle_type,
    passengers: formData.passengers,
    notes: formData.notes.trim(),
    amount: "0",
  };

  const validateForm = (data) => {
    const nextErrors = {};

    if (!data.customer_name) nextErrors.customer_name = "Full name is required.";
    if (!data.customer_email) {
      nextErrors.customer_email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)) {
      nextErrors.customer_email = "Please enter a valid email address.";
    }
    if (!data.customer_phone) nextErrors.customer_phone = "Phone number is required.";
    if (!data.pickup_location) nextErrors.pickup_location = "Pickup location is required.";
    if (!data.drop_location) nextErrors.drop_location = "Drop location is required.";
    if (!data.pickup_date) nextErrors.pickup_date = "Pickup date is required.";
    if (!data.return_date) nextErrors.return_date = "Return date is required.";
    if (!data.vehicle_type) nextErrors.vehicle_type = "Please select a vehicle type.";

    if (data.passengers === "") {
      nextErrors.passengers = "Number of passengers is required.";
    } else {
      const passengersCount = Number(data.passengers);
      if (!Number.isInteger(passengersCount) || passengersCount < 1) {
        nextErrors.passengers = "Number of passengers must be at least 1.";
      }
    }

    if (data.pickup_date && data.return_date && new Date(data.return_date) < new Date(data.pickup_date)) {
      nextErrors.return_date = "Return date cannot be earlier than pickup date.";
    }

    return nextErrors;
  };

  const normalizeServerErrors = (messages = {}) => ({
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

  const clearFormFields = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const resetForm = () => {
    setShowConfirm(false);
    clearFormFields();
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrors({});

    const clientErrors = validateForm(formattedData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setSubmitStatus({
        type: "error",
        message: "Please correct the highlighted fields.",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/booking", formattedData);
      clearFormFields();
      setShowConfirm(true);
    } catch (error) {
      if (error.response?.status === 422) {
        const messages = error.response.data?.errors || error.response.data || {};
        setErrors(normalizeServerErrors(messages));
        setSubmitStatus({
          type: "error",
          message: error.response.data?.message || "Please check the form for errors.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: error.response?.data?.message || "Something went wrong. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="booking">
        <Container className="booking-card-shell">
          <Card className="booking-card">
            {!showConfirm && <h2 className="text-center mb-4">Book Your Journey</h2>}

            {submitStatus?.type === "error" && (
              <div className="alert alert-danger mb-4">
                {submitStatus.message}
              </div>
            )}

            <AnimatePresence mode="wait">
              {showConfirm ? (
                <MotionDiv
                  key="success-state"
                  className="booking-success-state"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="booking-success-icon">OK</div>
                  <h2>Booking Confirmed!</h2>
                  <p>We've received your details. Our team will contact you soon.</p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={resetForm}
                  >
                    Make Another Booking
                  </Button>
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="form-state"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <Form onSubmit={handleSubmit}>
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
                            onChange={(date) => handleDateChange(date, "pickup_date")}
                            className={`form-control ${errors.pickup_date ? "is-invalid" : ""}`}
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
                            onChange={(date) => handleDateChange(date, "return_date")}
                            className={`form-control ${errors.return_date ? "is-invalid" : ""}`}
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
                            disabled={vehiclesLoading || vehicleOptions.length === 0}
                          >
                            <option value="">
                              {vehiclesLoading
                                ? "Loading vehicles..."
                                : vehicleOptions.length === 0
                                  ? "No vehicles available"
                                  : "Select Vehicle"}
                            </option>
                            {Object.entries(groupedVehicleOptions).map(([groupLabel, vehicles]) => (
                              <optgroup key={groupLabel} label={groupLabel}>
                                {vehicles.map((vehicle) => (
                                  <option key={vehicle.id} value={vehicle.name}>
                                    {vehicle.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
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
                            min="1"
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
                        {loading ? "Processing..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </Form>
                </MotionDiv>
              )}
            </AnimatePresence>
          </Card>
        </Container>
      </div>
    </Layout>
  );
}

export default Booking;

