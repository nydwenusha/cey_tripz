import React from 'react'
import Navigation from "./assets/common/Navigation";
import Footer from "./assets/common/Footer";

function Layout({children}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navigation />
      {/* Add top padding to avoid content being hidden under the fixed navbar */}
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout