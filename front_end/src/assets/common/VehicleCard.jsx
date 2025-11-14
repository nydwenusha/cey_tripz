//available vehicle

import { Card, Container, Row, Col } from "react-bootstrap";
import "../css/VehicleCard.scss";
import { Link, useNavigate } from "react-router-dom";

const vehicles = [
  {
    id: 1,
    name: "Suzuki Wagon R",
    desc: "Compact, fuel-efficient and perfect for city trips and solo travel.",
    img: "https://carsguide.ikman.lk/wp-content/uploads/2023/05/shutterstock_2204903329-e1685523842171.jpg",
    price: "Rs. 12,000 / Day",
  },
  {
    id: 2,
    name: "Toyota Premio",
    desc: "Comfort and class combined — best for couples and business trips.",
    img: "https://global.toyota/pages/models/images/20191018/kv/premio_ogp_01.jpg",
    price: "Rs. 18,500 / Day",
  },
  {
    id: 3,
    name: "Toyota KDH",
    desc: "Spacious 9-seater ideal for family or group tours across Sri Lanka.",
    img: "https://wecaretaxi.com/wp-content/uploads/2023/01/toyota-kdh-flat-roof-van-rental-e1673449493237.png",
    price: "Rs. 22,000 / Day",
  },
  {
    id: 4,
    name: "Suzuki Alto",
    desc: "Reliable long-distance car for adventure seekers and families.",
    img: "https://i.ndtvimg.com/auto/makers/29/190/maruti-suzuki-alto-800.jpg",
    price: "Rs. 24,000 / Day",
  },
];

function VehicleCards() {
  const navigate = useNavigate();

  const handleDetails = (id) => {
    navigate(`/vehicles/${id}`);
  };
  

  return (
    
    <section className="vehicle-section">
      <Container fluid className="py-5">
        <h2 className="text-center mb-5">Available Vehicles</h2>
        <Row className="justify-content-center g-4">
          {vehicles.map((v) => (
            <Col key={v.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="vehicle-card h-100 shadow-lg">
                <div
                  className="vehicle-img-wrapper"
                  onClick={() => handleDetails(v.id)}
                >
                  <Card.Img
                    variant="top"
                    src={v.img}
                    alt={v.name}
                    className="vehicle-img"
                  />
                </div>
                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{v.name}</Card.Title>
                    <Card.Text className="text-primary fw-semibold">
                      {v.price}
                    </Card.Text>
                    <Card.Text className="text-muted small">
                      {v.desc}
                    </Card.Text>
                  </div>
                  <Link to={`/vehicles/${v.id}`} className="btn btn-primary mt-3">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default VehicleCards;
