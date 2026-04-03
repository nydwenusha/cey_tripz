// //not fixed

// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { motion } from "framer-motion";
// import "../css/PackageDetails.scss";

// const packages = [
//   {
//     name: "Flying Rawana",
//     days: "3 Days / 2 Nights",
//     route: "Colombo ➜ Kandy ➜ Ella",
//     withGuide: "Rs. 45,000 / Person",
//     withoutGuide: "Rs. 35,000 / Person",
//     offer: "10% Off for Early Booking!",
//     img: "https://d1ynolcus8dvgv.cloudfront.net/2019/04/flying-rawana-header-image-970%C3%97600.jpg",
//   },
//   {
//     name: "Southern Beach Escape",
//     days: "4 Days / 3 Nights",
//     route: "Colombo ➜ Galle ➜ Mirissa ➜ Matara",
//     withGuide: "Rs. 65,000 / Person",
//     withoutGuide: "Rs. 52,000 / Person",
//     offer: "Free Whale Watching Tickets!",
//     img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
//   },
//   {
//     name: "Cultural Heritage Tour",
//     days: "5 Days / 4 Nights",
//     route: "Anuradhapura ➜ Polonnaruwa ➜ Sigiriya ➜ Dambulla",
//     withGuide: "Rs. 78,000 / Person",
//     withoutGuide: "Rs. 64,000 / Person",
//     offer: "Up to 15% Off for Groups!",
//     img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445",
//   },
// ];

// function PackageDetails() {
//   return (
//     <section className="package-details-section py-5">
//       <Container>
//         <motion.h2
//           className="text-center mb-4 package-title"
//           initial={{ opacity: 0, y: -20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           🌄 Featured Tour Packages
//         </motion.h2>

//         <Row>
//           {packages.map((pkg, index) => (
//             <Col md={4} sm={6} xs={12} key={index} className="mb-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 whileHover={{ scale: 1.03 }}
//                 viewport={{ once: true }}
//               >
//                 <Card className="package-card shadow-sm border-0">
//                   <div className="img-wrapper">
//                     <motion.img
//                       src={pkg.img}
//                       alt={pkg.name}
//                       className="package-img"
//                       whileHover={{ scale: 1.05 }}
//                       transition={{ duration: 0.4 }}
//                     />
//                   </div>
//                   <Card.Body>
//                     <Card.Title className="package-name">{pkg.name}</Card.Title>
//                     <Card.Text className="package-days">📅 {pkg.days}</Card.Text>
//                     <p className="package-route">🧭 {pkg.route}</p>
//                     <p className="price">
//                       <strong>With Guide:</strong> {pkg.withGuide}
//                     </p>
//                     <p className="price">
//                       <strong>Without Guide:</strong> {pkg.withoutGuide}
//                     </p>
//                     <motion.p
//                       className="offer"
//                       animate={{ opacity: [0.7, 1, 0.7] }}
//                       transition={{ repeat: Infinity, duration: 2 }}
//                     >
//                       🎁 {pkg.offer}
//                     </motion.p>
//                     <Button variant="outline-primary" className="view-btn">
//                       View Details
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </motion.div>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </section>
//   );
// }

// export default PackageDetails;
