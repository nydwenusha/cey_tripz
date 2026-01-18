import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Navigation from "./assets/common/Navigation";
import Footer from "./assets/common/Footer";
import WhatsAppPopup from "./assets/common/WhatsAppPopup";

function Layout({children}) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navigation />
      {/* Add top padding to avoid content being hidden under the fixed navbar */}
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppPopup />
    </div>
  );
}

export default Layout