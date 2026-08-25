import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import "../css/SriLankaMap.scss";

// Custom blue marker icon
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -30],
});

const locations = [
  {
    name: "Sigiriya Rock Fortress",
    position: [7.9570, 80.7603],
    desc: "Ancient rock fortress with royal gardens and frescoes.",
    mapUrl: "https://www.google.com/maps/place/Sigiriya/",
  },
  {
    name: "Galle Fort",
    position: [6.0260, 80.2170],
    desc: "Historic Dutch fort on the southern coast.",
    mapUrl: "https://www.google.com/maps/place/Galle+Fort/",
  },
  {
    name: "Ella",
    position: [6.8667, 81.0466],
    desc: "Hill country village with tea estates and waterfalls.",
    mapUrl: "https://www.google.com/maps/place/Ella/",
  },
  {
    name: "Kandy",
    position: [7.2906, 80.6337],
    desc: "Cultural capital with the Temple of the Tooth.",
    mapUrl: "https://www.google.com/maps/place/Kandy/",
  },
  {
    name: "Mirissa",
    position: [5.9485, 80.4715],
    desc: "Tropical beach town famous for whale watching.",
    mapUrl: "https://www.google.com/maps/place/Mirissa/",
  },
  {
    name: "Nuwara Eliya",
    position: [6.9497, 80.7891],
    desc: "Beautiful mountain town with cool weather and tea estates.",
    mapUrl: "https://www.google.com/maps/place/Nuwara+Eliya/",
  },
  {
    name: "Yala National Park",
    position: [6.3668, 81.5185],
    desc: "Famous national park with leopards and elephants.",
    mapUrl: "https://www.google.com/maps/place/Yala+National+Park/",
  },
];

function SriLankaMap() {
  return (
    <section className="map-section py-5">
      <motion.h2
        className="text-center map-title mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
         Explore Sri Lanka's Popular Locations
      </motion.h2>

      <div className="map-container">
        <MapContainer
          center={[7.8731, 80.7718]} // Center of Sri Lanka
          zoom={7.2}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          style={{ height: "600px", borderRadius: "16px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />
          {locations.map((loc, i) => (
            <Marker position={loc.position} icon={customIcon} key={i}>
              <Popup>
                <div className="popup-content">
                  <h5>{loc.name}</h5>
                  <p>{loc.desc}</p>
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View on Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default SriLankaMap;
