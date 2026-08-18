import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import Layout from "../../Layout";
import "../css/contact.scss";

const MotionDiv = motion.div;

function Contact() {
  const contactHighlights = [
    {
      title: "Travel Concierge",
      copy: "Curated itineraries, multi-day tours, and bespoke experiences crafted in under 24 hours.",
      href: "tel:+94717191657",
      detail: "+94 71 719 1657",
      icon: "🌍",
    },
    {
      title: "Fleet Hotline",
      copy: "Real-time vehicle tracking, chauffeur briefings, and last-minute swaps handled instantly.",
      href: "tel:+94758793281",
      detail: "+94 75 879 3281",
      icon: "🚐",
    },
    {
      title: "WhatsApp Desk",
      copy: "Share pins, voice notes, or docs on the go — we reply in minutes around the clock.",
      href: "https://wa.me/94710877100",
      detail: "Chat on WhatsApp",
      icon: "💬",
    },
  ];

  const serviceHours = [
    { label: "Weekdays", value: "06:00 – 22:00 IST" },
    { label: "Weekends", value: "08:00 – 20:00 IST" },
    { label: "Emergency", value: "24/7 duty manager" },
  ];

  return (
    <Layout>
      <section className="contact-page">
        <Container className="contact-wrapper py-5">
          <MotionDiv
            className="contact-hero text-center"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="contact-eyebrow">Direct line to island specialists</p>
            <h1>Plan, confirm, or rescue any Sri Lankan itinerary</h1>
            <p className="contact-lede">
              From boutique hotel transfers to cross-country expeditions, our operations desk pairs you with
              verified chauffeurs, live support, and detailed route intel.
            </p>
          </MotionDiv>

          <Row className="g-4 contact-highlight-row">
            {contactHighlights.map((item, index) => (
              <Col md={4} key={item.title}>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="contact-info-card h-100">
                    <div className="contact-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.copy}</p>
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>{item.detail}</a>
                  </Card>
                </MotionDiv>
              </Col>
            ))}
          </Row>

          <Row className="g-4 align-items-stretch contact-main">
            <Col lg={7}>
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="h-100"
              >
                <Card className="contact-form-card h-100">
                  <div className="form-heading">
                    <h3>Tell us about your journey</h3>
                    <p>Drop the essentials and a concierge will confirm availability within 2 hours.</p>
                  </div>
                  <Form>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="contactName">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control type="text" placeholder="Alex Perera" required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="contactEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" placeholder="alex@journeys.io" required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="contactPhone">
                          <Form.Label>Phone / WhatsApp</Form.Label>
                          <Form.Control type="text" placeholder="(+94) 71 123 4567" required />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId="contactMessage">
                          <Form.Label>Itinerary Details</Form.Label>
                          <Form.Control as="textarea" rows={4} placeholder="Pickup city, stops, vehicle type..." />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end mt-4">
                      <Button type="submit" className="contact-send-btn">
                        Dispatch request
                      </Button>
                    </div>
                  </Form>
                </Card>
              </MotionDiv>
            </Col>
            <Col lg={5}>
              <MotionDiv
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="contact-side-stack"
              >
                <Card className="contact-meta-card">
                  <h5>Operations desk</h5>
                  <p>We monitor every route via GPS and weather alerts so we can reroute before delays hit.</p>
                  <ul>
                    {serviceHours.map((slot) => (
                      <li key={slot.label}>
                        <span>{slot.label}</span>
                        <strong>{slot.value}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="badge-row">
                    <span>Response under 15 min</span>
                    <span>Multi-lingual team</span>
                    <span>Duty manager on-call</span>
                  </div>
                </Card>

                <div className="contact-map-card">
                  <div className="map-overlay">
                    <p>Head office</p>
                    <h4>45 Galle Road, Colombo</h4>
                    <small>Drop by for coffee & route planning</small>
                  </div>
                  <iframe
                    title="Cey Tripz HQ"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.896315101553!2d79.85207367601632!3d6.927078893068712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259338a0a15c5%3A0x56c1d9f4f7968d17!2sGalle%20Rd%2C%20Colombo%2000300!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              </MotionDiv>
             
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
}

export default Contact;
