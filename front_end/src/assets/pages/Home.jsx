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


function Home() {
  return (
    <Layout>
      <HeroSection />
      {/* <PopularVehicles /> */}
      <VehicleCards />
      <SriLankaLocations />
      <SriLankaMap />
      <PopularPlacesGallery />
      <Teatmonials />
    </Layout>
  );
}

export default Home;
