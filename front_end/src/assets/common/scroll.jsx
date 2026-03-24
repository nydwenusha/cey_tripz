
import React, { useEffect, useState } from "react";

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
		window.scrollTo({ top: 0 , behavior: "smooth" });
	};

	return (
		<button
			onClick={scrollToTop}
			className={`scroll-to-top-btn ${isVisible ? "is-visible" : ""}`}
			aria-label="Scroll to top"
			title="Scroll to top"
			tabIndex={isVisible ? 0 : -1}
			disabled={!isVisible}
		>
			↑
		</button>
	);
};

export default ScrollToTopButton;
