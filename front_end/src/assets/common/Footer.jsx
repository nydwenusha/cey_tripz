import { Container, Row, Col } from "react-bootstrap";
import "../css/Footer.scss";

function Footer() {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Contact Info</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-envelope-fill"></i> Info@lankaTour.lk</li>
              <li><i className="bi bi-telephone-fill"></i> +94 75 322 8869</li>
              <li><i className="bi bi-telephone-fill"></i> +94 76 448 7775</li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Follow Us On Social Media</h5>
            <div className="footer-social">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-tripadvisor"></i></a>
              <a href="#"><i className="bi bi-pinterest"></i></a>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer-bottom">
        <Container className="text-center">
          <h5 className="footer-logo">lanka<span>Tour</span></h5>
          <p>Copyright © 2023 Srilanka Explore Tourism. All Rights Reserved.</p>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
