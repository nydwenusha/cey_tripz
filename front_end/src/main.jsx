import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Home from "./assets/pages/Home";
import VehicleDetails from "./assets/pages/VehicleDetails";
import Vehicles from "./assets/pages/Vehicles";
import About from "./assets/pages/About";
import Contact from "./assets/pages/Contact";
import Booking from "./assets/pages/Booking";
// import Navigation from "./assets/common/Navigation";
// import Footer from "./assets/common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.scss";

// function Layout() {                       
//   return (
//     <>
//       <Navigation />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }


function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>404 — Page not found</h1>
      <p>The page you requested does not exist. Check the URL or use the navigation.</p>
    </div>
  );
}

const router = createBrowserRouter([

  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/vehicles", element: <Vehicles /> },
  { path: "/vehicles/:id", element: <VehicleDetails /> },
  { path: "/contact", element: <Contact /> },
  { path: "/booking", element: <Booking /> },


]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
