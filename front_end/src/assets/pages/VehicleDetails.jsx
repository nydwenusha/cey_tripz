//inside the vehicle card

import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState } from "react";
import "../css/VehicleDetails.scss";
import Layout from "../../Layout";

const vehicleData = [
  {
    id: 1,
    name: "Suzuki Wagon R",
    price: "Rs. 12,000/day",
    images: [
      "https://carsguide.ikman.lk/wp-content/uploads/2023/05/shutterstock_2204903329-e1685523842171.jpg",
      "https://wallpapercave.com/wp/wp7368203.png",
      "https://gaadiwaadi.com/wp-content/uploads/2024/11/New-Gen-Wagn-R-Rendering.jpg"
    ],
    description:
      "This SUV provides excellent off-road performance and style. Perfect for hill country and long scenic routes.",
    specs: ["5 Seats", "AC", "4x4", "Automatic", "Bluetooth"]
  },
  {
    id: 2,
    name: "Toyota Premio",
    price: "Rs. 12,000/day",
    images: [
      "https://i.pinimg.com/originals/7e/9e/bc/7e9ebccb69ad693e9c7c5aadd8253215.png",
      "https://rentacarsctg.com/wp-content/uploads/2021/09/Toyota-Allion-2018.jpg",
      "https://www.africhoice.com/airport-transfer-services/airport-transfer-standard-sedan.jpg"
    ],
    description:
      "Comfort and class combined — best for couples and business trips.",
    specs: ["4 Seats", "AC", "sunroof", "Automatic", "Bluetooth"]
  },
  {
    id: 3,
    name: "Toyota KDH",
    price: "Rs. 8,000/day",
    images: [
      "https://wallpaperaccess.com/full/8416028.jpg",
      "https://wecaretaxi.com/wp-content/uploads/2023/01/toyota-kdh-flat-roof-van-rental-e1673449493237.png",
      "https://img.indianautosblog.com/2017/08/JDM-spec-2017-Toyota-Hiace-profile.jpg"
    ],
    description:
      "family trips with comfort and space. Ideal for group tours across Sri Lanka.",
    specs: ["12 Seats", "AC", "Auto Gear", "USB", "Bluetooth"]
  },
  {
    id: 4,
    name: "Suzuki Alto",
    price: "Rs. 18,000/day",
    images: [
      "https://ic1.maxabout.us/autos/cars_india/N/2018/8/new-maruti-suzuki-alto-800-india.jpg5",
      "https://ic1.maxabout.us/autos/cars_india/N/2018/8/new-maruti-suzuki-alto-800-india.jpg",
      "https://ic1.maxabout.us/autos/cars_india/N/2018/8/new-maruti-suzuki-alto-800-india.jpg"
    ],
    description:
      "Ssafe and reliable compact car perfect for city trips and solo travel.",
    specs: ["4 Seats", "AC", "Automatic", "Large Storage", "WiFi"]
  }
];

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = vehicleData.find((v) => v.id === parseInt(id));
  const [mainImg, setMainImg] = useState(vehicle?.images[0]);

  if (!vehicle)
    return (
      <Layout>
        <Container className="nav-vehicle">
          <h3>Vehicle not found.</h3>
        </Container>
      </Layout>
    );

  const handleBooking = () => {
    navigate("/booking", { state: { selectedVehicle: vehicle.name } });
  };

  return (

    <Layout>
      <Container fluid className="py-5 vehicle-details-page">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 shadow-sm vehicle-details-card">
            <Row>
              <Col md={6}>
                <div className="main-image-container">
                  <img
                    src={mainImg}
                    alt={vehicle.name}
                    className="img-fluid rounded main-image"
                  />
                </div>
                <div className="thumbnail-row mt-3 d-flex gap-2">
                  {vehicle.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`thumb-${index}`}
                      className={`thumbnail ${mainImg === img ? "active" : ""}`}
                      onClick={() => setMainImg(img)}
                    />
                  ))}
                </div>
              </Col>

              <Col md={6}>
                <h2>{vehicle.name}</h2>
                <h5 className="text-primary mb-3">{vehicle.price}</h5>
                <p>{vehicle.description}</p>
                <ul className="spec-list">
                  {vehicle.specs.map((s, i) => (
                    <li key={i}>🚘 {s}</li>
                  ))}
                </ul>
                <Button variant="danger" size="lg" onClick={handleBooking}>
                  Book Now
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </Container>

    </Layout>
  );
}

export default VehicleDetails;
