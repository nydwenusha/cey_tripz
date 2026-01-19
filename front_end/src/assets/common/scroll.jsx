
import React, { useState, useEffect } from "react";

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	 return (
	   <button
	     onClick={scrollToTop}
	     style={{
	       position: "fixed",
	       bottom: "100px", // Increased to appear above WhatsApp button
	       right: "30px",
	       zIndex: 1000,
	       display: isVisible ? "block" : "none",
	       background: "#333",
	       color: "#fff",
	       border: "none",
	       borderRadius: "50%",
	       width: "48px",
	       height: "48px",
	       fontSize: "24px",
	       cursor: "pointer",
	       boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
	       transition: "opacity 0.3s"
	     }}
	     aria-label="Scroll to top"
	     title="Scroll to top"
	   >
	     ↑
	   </button>
	 );
};

export default ScrollToTopButton;
