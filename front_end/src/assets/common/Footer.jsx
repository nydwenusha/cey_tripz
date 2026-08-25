
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Footer.scss";

function Footer() {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/vehicles">Vehicles</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Contact Info</h5>
            <ul className="footer-contact">
              <li><i className="bi bi-envelope-fill"></i>info@ceytripz.com</li>
              <li><a href="tel:+94717191657"><i className="bi bi-telephone-fill"></i>+94&nbsp;&nbsp;71&nbsp;&nbsp;719&nbsp;&nbsp;1657</a></li>
              <li><a href="tel:+94758793281"><i className="bi bi-telephone-fill"></i>+94&nbsp;75&nbsp;879&nbsp;3281</a></li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="footer-col">
            <h5 className="footer-title">Follow Us On Social Media</h5>
            <div className="footer-social">
              <a
                href="https://www.facebook.com/share/1DqDgdZeft/"
                className="social-icon social-facebook"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/ceytripz?igsh=bjYxMHB5ZWpkZ3Zt"
                className="social-icon social-instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://wa.me/94710877100"
                className="social-icon social-whatsapp"
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="footer-bottom">
        <Container className="text-center">
          <h5 className="footer-logo">Cey<span>Tripz</span></h5>
          <p>Copyright © {new Date().getFullYear()} CeyTripz. All Rights Reserved</p>
          <small><a href="https://theanzwer.com" target="_blank" rel="noreferrer">Designed & Developed by
            The Anzwer IT Solutions
          </a></small>

        </Container>
      </div>
    </footer>
  );
}

export default Footer;
