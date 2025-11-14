import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/About.scss";
import Layout from "../../Layout";

function About() {
  return (
    <>
      <Layout>
        <Container className="py-5 about-page">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-4 about-title"
          >
            About LankaTour
          </motion.h1>

          <Row className="align-items-center mb-5">
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="about-card p-4">
                  <h3>Who We Are</h3>
                  <p>
                    LankaTour is Sri Lanka’s most trusted tourism vehicle booking
                    platform — connecting travelers with professional drivers and
                    premium vehicles for unforgettable journeys.
                  </p>
                  <p>
                    We specialize in creating <strong>personalized travel experiences</strong>
                    across the island — from coastal drives in Galle to mountain
                    adventures in Nuwara Eliya.
                  </p>
                </Card>
              </motion.div>
            </Col>

            <Col md={6}>
              <motion.img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Sri Lanka Tour"
                className="img-fluid rounded shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              />
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-3"
              >
                <i className="bi bi-car-front-fill feature-icon"></i>
                <h5>Premium Vehicles</h5>
                <p>Choose from a luxury fleet maintained to perfection.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center p-3"
              >
                <i className="bi bi-person-bounding-box feature-icon"></i>
                <h5>Professional Drivers</h5>
                <p>Friendly, trained, and multilingual local drivers.</p>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-3"
              >
                <i className="bi bi-globe feature-icon"></i>
                <h5>Island-Wide Service</h5>
                <p>Explore every corner of Sri Lanka with ease.</p>
              </motion.div>
            </Col>
          </Row>
        </Container>

      </Layout>
    </>
  );
}

export default About;
