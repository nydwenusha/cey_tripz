
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
	return (
		<Layout>
			<div className="about-page">
				<Container className="about-content">
					<div className="about-hero text-center">
						<div className="eyebrow mb-2">About Us</div>
						<h1 className="about-title">Ayubowan....!<br/>WELCOME TO SRI LANKA</h1>
						<p className="hero-copy">
							We are grateful that you have chosen <b>CEYTRIPZ</b> for your visit.<br/>
							We take pride in being able to provide a high-quality rental car service in Sri Lanka that is efficient, reliable, responsible, and safe, catering to your needs in a way that perfectly suits your travel requirements.<br/>
							We are committed to safely and reliably transporting you, whether you are a resident of Sri Lanka or visiting the country to experience its beauty, to any destination in Sri Lanka. This is done using well-maintained vehicles driven by our highly experienced and disciplined drivers, at reasonable prices, ensuring a convenient and efficient journey.
						</p>
					</div>
					<Row className="about-highlight mb-5">
						<Col md={7}>
							<Card className="about-card mb-4">
								<Card.Body>
									<Card.Title as="h3">Why should you choose our rental car service?</Card.Title>
									<ul>
										<li>The opportunity to select a vehicle for your trips from our rental fleet according to the requirements of those occasions.</li>
										<li>This allows you to travel alone, with your assistant, or with your family.</li>
										<li>Our service experience has shown that while traveling within Sri Lanka, your travel plans may unexpectedly change. In such situations, we are here to assist you in reaching your destination at any time according to your needs.</li>
										<li>We provide taxi services 24 hours a day, every day.</li>
										<li>Upon arriving at the airport from abroad to experience the beauty of Sri Lanka, our service representatives will come to the airport to welcome you.</li>
										<li>Our rental vehicle service can be easily booked online through the website and conveniently via WhatsApp.</li>
									</ul>
									<p className="mt-3">
										Experience comfort on your journey with CEYTRIPZ, join us for a safe and reliable service.
									</p>
									<div className="text-start mt-4">
										<span className="fw-bold">Thank you</span><br/>
										<span>FOUNDER OF CEYTRIPZ</span>
									</div>
								</Card.Body>
							</Card>
						</Col>
						<Col md={5}>
							<div className="about-mosaic">
								<img className="mosaic-img main" src={abtG1} alt="Sri Lanka travel" />
								<img className="mosaic-img side-top" src={abtG6} alt="Ceytripz Sri Lanka" />
								<img className="mosaic-img side-bottom" src={abtG2} alt="Ceytripz journey" />
							</div>
						</Col>
					</Row>
					<Row className="photo-grid">
						<Col className="photo-item"><img src={abtF1} alt="Fleet 1" /></Col>
						<Col className="photo-item"><img src={abtF2} alt="Fleet 2" /></Col>
						<Col className="photo-item"><img src={abtF3} alt="Fleet 3" /></Col>
						<Col className="photo-item"><img src={abtG3} alt="Gallery 3" /></Col>
						<Col className="photo-item"><img src={abtG4} alt="Gallery 4" /></Col>
						<Col className="photo-item"><img src={abtG5} alt="Gallery 5" /></Col>
					</Row>
				</Container>
			</div>
		</Layout>
	);
}

export default About;
