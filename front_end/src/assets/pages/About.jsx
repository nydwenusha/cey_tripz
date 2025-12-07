import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/About.scss";
import Layout from "../../Layout";
import abtF1 from "../image/abtF1.jpg";
import abtF2 from "../image/abtF2.jpg";
import abtF3 from "../image/abtF3.jpg";
import abtG1 from "../image/abtG1.jpg";
import abtG2 from "../image/abtG2.jpeg";
import abtG3 from "../image/abtG3.jpg";
import abtG4 from "../image/abtG4.webp";
import abtG5 from "../image/abtG5.webp";
import abtG6 from "../image/abtG6.avif";

function About() {
  const stats = [
    { label: "Happy Travelers", value: "18K+" },
    { label: "Partner Drivers", value: "320+" },
    { label: "Fleet Vehicles", value: "140+" },
    { label: "Destinations", value: "65" },
  ];

  const journeyMilestones = [
    "2016: Started with a handful of chauffeurs serving Colombo.",
    "2018: Expanded to hill-country expeditions and wildlife routes.",
    "2021: Introduced curated experience planning with local experts.",
    "2024: Partnered with boutique stays to offer seamless multi-day tours.",
  ];

  const mosaicImages = [abtF1, abtF2, abtF3];

  const galleryImages = [abtG1, abtG2, abtG3, abtG4, abtG5, abtG6];

  return (
    <>
      <Layout>
        <div className="about-page">
          <Container className="py-5 about-content">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center about-hero"
            >
              <p className="eyebrow">Crafting journeys since 2016</p>
              <h1 className="about-title">Beyond Transfers — Tailored Island Adventures</h1>
              <p className="hero-copy">
                We pair luxury vehicles with storytellers on wheels so every kilometer across Sri Lanka
                feels curated, safe, and unforgettable.
              </p>
              <Button className="about-cta" size="lg" href="/booking">
                Plan Your Experience
              </Button>
            </motion.div>

            <Row className="align-items-center mb-5 g-4 about-highlight">
              <Col md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <Card className="about-card p-4">
                    <h3>Who We Are</h3>
                    <p>
                      LankaTour is Sri Lanka’s most trusted tourism vehicle booking platform —
                      connecting travelers with professional drivers, curated stays, and
                      premium vehicles for unforgettable journeys.
                    </p>
                    <p>
                      We specialize in <strong>hyper-personalized itineraries</strong> that blend
                      coastal escapes, heritage explorations, and misty mountain adventures, all
                      powered by data-backed route planning.
                    </p>
                  </Card>
                </motion.div>
              </Col>

              <Col md={6}>
                <motion.div
                  className="about-mosaic"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  {mosaicImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`highlight-${idx}`} />
                  ))}
                </motion.div>
              </Col>
            </Row>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stats-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="value">{stat.value}</span>
                  <span className="label">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <Row className="gy-4 about-story align-items-center">
              <Col md={6}>
                <motion.div
                  className="journey-card"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3>Our Journey</h3>
                  <ul>
                    {journeyMilestones.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              </Col>
              <Col md={6}>
                <motion.div
                  className="experience-card"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h4>Why travelers choose us</h4>
                  <p>
                    Dedicated concierges, real-time vehicle tracking, and 24/7 support ensure every
                    itinerary runs like clockwork. From surf vans to chauffeured sedans, we match the
                    perfect ride with your travel rhythm.
                  </p>
                  <div className="badge-grid">
                    <span>Safety First</span>
                    <span>Local Insights</span>
                    <span>Eco Routes</span>
                    <span>Concierge Support</span>
                  </div>
                </motion.div>
              </Col>
            </Row>

            <motion.div
              className="photo-grid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {galleryImages.map((img, index) => (
                <div key={index} className="photo-item">
                  <img src={img} alt={`gallery-${index}`} />
                </div>
              ))}
            </motion.div>
          </Container>
        </div>

      </Layout>
    </>
  );
}

export default About;
