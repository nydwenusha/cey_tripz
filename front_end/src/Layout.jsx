import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Navigation from "./assets/common/Navigation";
import Footer from "./assets/common/Footer";

import WhatsAppPopup from "./assets/common/WhatsAppPopup";
import ScrollToTopButton from "./assets/common/scroll";

function Layout({children}) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navigation />
      <main className="app-main" key={location.pathname}>{children}</main>
      <Footer />
      <WhatsAppPopup />
      <ScrollToTopButton />
    </div>
  );
}

export default Layout
