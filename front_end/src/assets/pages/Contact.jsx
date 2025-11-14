import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/contact.scss";
import Layout from "../../Layout";

function Contact() {
  return (
    <Layout>
      <div className="contact-page">
        <Container className="py-5">
          <motion.h1
            className="text-center contact-title mb-4"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact Us
          </motion.h1>

          <Row className="justify-content-center">
            <Col md={8}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-4 contact-card shadow-lg">
                  <Form>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="message">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Type your message here..."
                        required
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button
                        type="submit"
                        variant="outline-info"
                        className="px-4 py-2"
                      >
                        Send Message
                      </Button>
                    </div>
                  </Form>
                </Card>
              </motion.div>

              <motion.div
                className="text-center mt-4 contact-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p>
                  📍 <strong>Address:</strong> 45 Galle Road, Colombo, Sri Lanka
                </p>
                <p>
                  📞 <strong>Phone:</strong> +94 71 234 5678
                </p>
                <p>
                  📧 <strong>Email:</strong> info@lankatour.com
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}

export default Contact;
