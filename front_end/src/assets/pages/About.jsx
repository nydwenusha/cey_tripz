
import { Container, Row, Col, Card } from "react-bootstrap";
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
import PRO1 from "../image/Pro1.jpeg";
import PRO2 from "../image/Pro2.jpeg";
import PRO3 from "../image/Pro3.jpeg";

const MotionDiv = motion.div;

function About() {
	return (
		<Layout>
			<div className="about-page">
				<Container className="about-content">
					<MotionDiv
						className="about-hero text-center"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, ease: "easeOut" }}
					>
						{/* <div className="eyebrow mb-2">About Us</div> */}
						<h1 className="about-title">Ayubowan....!<br/>WELCOME TO SRI LANKA</h1>
						<p className="hero-copy">
							We are grateful that you have chosen <b>CEYTRIPZ</b> for your visit.<br/>
							We take pride in being able to provide a high-quality rental car service in Sri Lanka that is efficient, reliable, responsible, and safe, catering to your needs in a way that perfectly suits your travel requirements.<br/>
							We are committed to safely and reliably transporting you, whether you are a resident of Sri Lanka or visiting the country to experience its beauty, to any destination in Sri Lanka. This is done using well-maintained vehicles driven by our highly experienced and disciplined drivers, at reasonable prices, ensuring a convenient and efficient journey.
						</p>
					</MotionDiv>

					{/* Team Section */}
					<MotionDiv
						className="team-section mb-5"
						initial={{ opacity: 0, y: 28 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, ease: "easeOut" }}
						viewport={{ once: true, amount: 0.12 }}
					>
						<div className="team-header text-center mb-5">
							<h2 className="team-title">Our Leadership Team</h2>
							<p className="team-subtitle">Meet the dedicated professionals behind CEYTRIPZ</p>
						</div>
						<Row className="team-grid">
							<Col md={12} className="mb-4">
								<div className="team-card founder-card">
									<div className="team-image-placeholder founder-image">
										<img src={PRO1} alt="Isuru Gamage" />
									</div>
									<div className="team-info founder-info">
										<h4 className="team-name">Isuru Gamage</h4>
										<p className="team-role">Chairman & Director</p>
										<p className="team-mission">"Every journey deserves a trusted partner. We exist to make each mile safe, comfortable, and memorable for every traveler who chooses Sri Lanka."</p>
										<div className="team-contact">
											<p><strong>Tel:</strong> <a href="tel:0710877100">0710 877 100</a></p>
										</div>
									</div>
								</div>
							</Col>
							<Col className="mb-4">
								<div className="team-card assistant-card">
									<div className="team-image-placeholder">
									<img src={PRO2} alt="Tharindu Dilshan" />
									</div>
									<div className="team-info">
										<h4 className="team-name">Tharindu Dilshan</h4>
										<p className="team-role">Assistant Director</p>
										<div className="team-contact">
											<p><strong>Tel:</strong> <a href="tel:0717191657">0717 191 657</a></p>
											{/* <p><strong>WhatsApp:</strong> <a href="https://wa.me/0787041588">0787 041 588</a></p> */}
										</div>
									</div>
								</div>
							</Col>
							<Col className="mb-4">
								<div className="team-card assistant-card">
									<div className="team-image-placeholder">
									<img src={PRO3} alt="Shashika Prasadani" />
									</div>
									<div className="team-info">
										<h4 className="team-name">Shashika Prasadani</h4>
										<p className="team-role">Assistant Director</p>
										<div className="team-contact">
											<p><strong>Tel:</strong> <a href="tel:0710454734">0710 454 734</a></p>
										</div>
									</div>
								</div>
							</Col>
						</Row>
					</MotionDiv>
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
