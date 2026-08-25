// //not fixed

// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { motion } from "framer-motion";
// import "../css/PopularVehicles.scss";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const vehicleData = [
//   {
//     name: "Toyota KDH Van",
//     desc: "Spacious 9-seater ideal for family or group tours across Sri Lanka.",
//     img1: "https://images.unsplash.com/photo-1614274498760-7c89c5fba36a",
//     img2: "https://images.unsplash.com/photo-1616352431166-132b274b86f3",
//     price: "Rs. 24,000 / Day",
//   },
//   {
//     name: "Suzuki Wagon R",
//     desc: "Compact, fuel-efficient and perfect for city trips and solo travel.",
//     img1: "https://carsguide.ikman.lk/wp-content/uploads/2023/05/shutterstock_2204903329-e1685523842171.jpg",
//     img2: "https://images.unsplash.com/photo-1558979158-65a1eaa08691",
//     price: "Rs. 12,000 / Day",
//   },
//   {
//     name: "Toyota Premio",
//     desc: "Comfort and class combined — best for couples and business trips.",
//     img1: "https://images.unsplash.com/photo-1616781325312-90c0f3b94f39",
//     img2: "https://images.unsplash.com/photo-1616781325174-2851e224a2a3",
//     price: "Rs. 18,500 / Day",
//   },
//   {
//     name: "Nissan Caravan",
//     desc: "Reliable long-distance van for adventure seekers and families.",
//     img1: "https://images.unsplash.com/photo-1600783282300-7b71ae6db6c1",
//     img2: "https://images.unsplash.com/photo-1616393060182-2a93f9b51149",
//     price: "Rs. 22,000 / Day",
//   },
// ];

// function PopularVehicles() {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const navigate = useNavigate();

//   const handleBooking = (vehicle) => {
//     navigate("/booking", { state: { selectedVehicle: vehicle.name } });
//   };

//   return (
//     <section className="popular-vehicles-section">
//       <Container className="py-5">
//         <motion.h2
//           className="text-center mb-5 vehicles-title"
//           initial={{ opacity: 0, y: -30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//         >
//           🚘 Popular Vehicles
//         </motion.h2>

//         <Row>
//           {vehicleData.map((vehicle, index) => (
//             <Col md={3} sm={6} xs={12} key={index} className="mb-4">
//               <motion.div
//                 className="vehicle-card-wrapper"
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.2 }}
//                 whileHover={{ scale: 1.05 }}
//                 viewport={{ once: true }}
//               >
//                 <Card
//                   className="vehicle-card shadow-lg"
//                   onMouseEnter={() => setHoveredIndex(index)}
//                   onMouseLeave={() => setHoveredIndex(null)}
//                 >
//                   <motion.img
//                     src={hoveredIndex === index ? vehicle.img2 : vehicle.img1}
//                     alt={vehicle.name}
//                     className="vehicle-image"
//                     key={hoveredIndex === index ? vehicle.img2 : vehicle.img1}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5 }}
//                   />

//                   <Card.Body>
//                     <motion.h5
//                       initial={{ y: 10, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ delay: 0.2 }}
//                       className="vehicle-name"
//                     >
//                       {vehicle.name}
//                     </motion.h5>
//                     <p className="vehicle-desc">{vehicle.desc}</p>
//                     <p className="vehicle-price">{vehicle.price}</p>
//                     <motion.div whileTap={{ scale: 0.95 }}>
//                       <Button 
//                         variant="outline-info" 
//                         className="book-btn"
//                         onClick={() => handleBooking(vehicle)}
//                       >
//                         Book Now
//                       </Button>
//                     </motion.div>
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

// export default PopularVehicles;
