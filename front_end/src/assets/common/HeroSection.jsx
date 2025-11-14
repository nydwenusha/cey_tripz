import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/HeroSection.scss";

const slides = [
  {
    image: "https://wallpaperaccess.com/full/11885405.jpg",
    title: "Explore Sri Lanka with Comfort",
    desc: "Book premium vehicles for your journey today!",
  },
  {
    image: "https://wallpaperaccess.com/full/3558093.jpg",
    title: "Adventure Awaits",
    desc: "From beaches to mountains — travel with ease!",
  },
  {
    image: "https://wallpapers.com/images/hd/sri-lanka-stilt-fishing-sunset-senzn2oyh7mj7qt1.jpg",
    title: "Your Trip, Your Way",
    desc: "Luxury, budget, or family vehicles — all in one place.",
  },
  {
    image: "https://wallpapers.com/images/hd/sri-lanka-tangalle-beach-aerial-sj84qckd6uwxgwey.jpg",
    title: "Safety and Reliability",
    desc: "Trust and explore with LankaTour's reliable services.",
  },
];

function HeroSection() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleBookNow = () => {
    navigate("/booking"); // ✅ go to booking page
  };

  return (
    <div
      className="hero-container"
      style={{ backgroundImage: `url(${slides[index].image})` }}
    >
      <div className="hero-overlay">
        <h1 className="hero-title">{slides[index].title}</h1>
        <p className="hero-desc">{slides[index].desc}</p>

        <Button
          className="hero-book-btn"
          variant="danger"
          size="lg"
          onClick={handleBookNow} // ✅ click handler
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
