import { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import "../css/navigation.scss";

function NavbarComp() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className={`navbar-transparent fixed-top py-3 ${scrolled ? 'scrolled' : ''}`}
      ref={navRef}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">🚐 LankaTour</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Nav.Link as={Link} to="/" className="nav-link-animated">Home</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Nav.Link as={Link} to="/vehicles" className="nav-link-animated">Vehicles</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Nav.Link as={Link} to="/about" className="nav-link-animated">About</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Nav.Link as={Link} to="/contact" className="nav-link-animated">Contact</Nav.Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="ms-3"
            >
              <Button 
                variant="black"
                className="nav-book-btn"
                onClick={handleBookNow}
              >
                 <i class="fa-solid fa-car"></i> Book Now
              </Button>
            </motion.div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
