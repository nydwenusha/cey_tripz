import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider, } from "react-router-dom";
import Home from "./assets/pages/Home";
import VehicleDetails from "./assets/pages/VehicleDetails";
import Vehicles from "./assets/pages/Vehicles";
import About from "./assets/pages/About";
import Contact from "./assets/pages/Contact";
import Booking from "./assets/pages/Booking";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import TravelerStoryDetail from "./assets/pages/TravelerStoryDetail";
import AllReviewsPage from "./assets/pages/AllReviewsPage";
import BlogPost from "./assets/pages/BlogPost";
import ShareExperiencePage from "./assets/pages/ShareExperiencePage";



const router = createBrowserRouter([

  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/vehicles", element: <Vehicles /> },
  { path: "/vehicles/:id", element: <VehicleDetails /> },
  { path: "/contact", element: <Contact /> },
  { path: "/booking", element: <Booking /> },
  { path: "/share-experience", element: <ShareExperiencePage /> },
  { path: "/story/:id", element: <TravelerStoryDetail /> },
  { path: "/reviews", element: <AllReviewsPage /> },
  { path: "/stories", element: <Navigate to="/reviews" replace /> },
  { path: "/blog/:id", element: <BlogPost /> },

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
