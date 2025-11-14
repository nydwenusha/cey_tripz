//feedback

import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../css/Teatmonials.scss";

const testimonials = [
  {
    img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
    name: "Ayesha Perera",
    comment:
      "Our family trip to Ella was perfect! The driver was so polite and the van was super comfortable. Highly recommended!",
    location: "Colombo, Sri Lanka",
    
  },
  {
    img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
    name: "Liam Carter",
    comment:
      "As a tourist, I loved how easy it was to book vehicles through LankaTour. Great service and friendly drivers.",
    location: "Melbourne, Australia",
    
  },
  {
    img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
    name: "Nuwan Silva",
    comment:
      "Professional and punctual service. I use LankaTour for all my business trips — never disappointed!",
    location: "Kandy, Sri Lanka",
    
  },
];

function Testimonials() {
  return (
    <div className="testimonials-section">
      <Container className="py-5">
        <motion.h2
          className="text-center mb-5 testimonials-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          We’re all about your satisfaction
        </motion.h2>

        <Row>
          {testimonials.map((t, index) => (
            <Col md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
<Card className="testimonial-card p-4 text-center shadow">
  <motion.img
    src={t.img}
    alt={t.name}
    className="testimonial-img mx-auto"
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    transition={{ duration: 0.6 }}
  />
  <i className="bi bi-quote testimonial-quote"></i>
  <p className="testimonial-text">{t.comment}</p>
  <h6 className="testimonial-name mt-3">{t.name}</h6>
  <p className="testimonial-location">{t.location}</p>
</Card>

              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Testimonials;
