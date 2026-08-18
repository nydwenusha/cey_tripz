import { useEffect, useState, useRef } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "../css/navigation.scss";

const MotionDiv = motion.div;

function NavbarComp() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getNavLinkClass = (path) => (
    `nav-link-animated ${location.pathname === path ? 'active' : ''}`
  );

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
      collapseOnSelect
      className={`navbar-transparent fixed-top py-3 ${scrolled ? 'scrolled' : ''}`}
      ref={navRef}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
          <img src="/favicon.png" alt="Logo" style={{ width: '64px', height: '64px' }} />
          <span className="brand-primary">Cey</span>
          <span className="brand-secondary">Tripz</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Nav.Link as={Link} to="/" className={getNavLinkClass('/')} aria-current={location.pathname === '/' ? 'page' : undefined}>Home</Nav.Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Nav.Link as={Link} to="/about" className={getNavLinkClass('/about')} aria-current={location.pathname === '/about' ? 'page' : undefined}>About</Nav.Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Nav.Link as={Link} to="/vehicles" className={getNavLinkClass('/vehicles')} aria-current={location.pathname === '/vehicles' ? 'page' : undefined}>Vehicles</Nav.Link>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Nav.Link as={Link} to="/contact" className={getNavLinkClass('/contact')} aria-current={location.pathname === '/contact' ? 'page' : undefined}>Contact</Nav.Link>
            </MotionDiv>
            <MotionDiv
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
                <i className="fa-solid fa-car" aria-hidden="true"></i> Book Now
              </Button>
            </MotionDiv>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
