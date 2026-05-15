import HeroSection from "../common/HeroSection";
import VehicleCards from "../common/VehicleCard";
//import PopularVehicles from "../common/PopularVehicles"; // commented out per request
import Navigation from "../common/Navigation";
import PopularPlacesGallery from "../common/PopularPlacesGallery";
import Teatmonials from "../common/Teatmonials";
import Footer from "../common/Footer";
import SriLankaLocations from "./SriLankaLocations";
import SriLankaMap from "../common/SriLankaMap";
import "leaflet/dist/leaflet.css";
import Layout from "../../Layout";
import ShareExperience from "../common/ShareExperience";
import Blog from "../common/Blog";
import { useState, useEffect } from "react";
import api from "../services/api/api";

function Home() {
  const [hasPosts, setHasPosts] = useState(false);
  useEffect(() => {
    api.get("/blogPosts")
      .then((response) => {
        if (response.status === 200) {
          console.log("Blog posts found:", response.data);
          setHasPosts(true);
        } else {
          setHasPosts(false);
        }
      })
  }, []);

  return (
    <Layout>
      <HeroSection />
      {/* <PopularVehicles /> */}
      <VehicleCards />
      <SriLankaLocations />
      <SriLankaMap />
      <PopularPlacesGallery />
      <ShareExperience />
      {hasPosts && <Blog />}

      <Teatmonials />
    </Layout>
  );
}

export default Home;
