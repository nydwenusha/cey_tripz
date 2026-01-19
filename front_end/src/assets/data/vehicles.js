import wagonCard from "../image/wagonR2015.jpg";
import wagonCard1 from "../image/wagon3.jpg";
import wagonCard2 from "../image/WagonRFZ.png";
import altoCard from "../image/alto11.avif";
import altoCard2 from "../image/alto2.avif";
import KDH1 from "../image/KDH1.jpeg"; 
import KDH2 from "../image/KDH2.jpeg"; 
import KDH3 from "../image/KDH3.jpeg"; 
import KDH4 from "../image/KDH4.jpeg"; 
import KDHIMG from "../image/KDHIMG.png"; 


import wagonr1 from "../image/w1.jpeg";
import wagonr2 from "../image/w2.jpeg";
import wagonr3 from "../image/w3.jpeg";

import alto11 from "../image/a2.jpeg";
import alto12 from "../image/a3.jpeg";
import alto13 from "../image/a4.jpeg";

import wagonr21 from "../image/WW1.jpeg";
import wagonr22 from "../image/WW2.jpeg";
import wagonr23 from "../image/WW3.jpeg";

import alto21 from "../image/aa1.jpeg";
import alto22 from "../image/aa2.jpeg";
import alto23 from "../image/aa4.jpeg";

import wagonr31 from "../image/WWW1.jpeg";
import wagonr32 from "../image/WWW2.jpeg";


export const vehicles = [
	{
		id: 1,
		name: "Suzuki Wagon R Stingray",
		category: "Hatchback Car",
		shortDesc: "Compact, fuel-efficient and perfect for city trips and solo travel.",
		cardImg: wagonCard,
		price: "Rs. 12,000/day",
		images: [wagonr1, wagonr2, wagonr3],
		description:
			"This SUV provides excellent off-road performance and style. Perfect for hill country and long scenic routes.",
		specs: ["5 Seats", "AC", "4x4", "Automatic", "Bluetooth"],
	},

	{
		id: 2,
		name: "Suzuki Alto",
		category: "Mini Car",
		shortDesc: "Comfort and class combined — best for couples and business trips.",
		cardImg: altoCard,
		price: "Rs. 12,000/day",
		images: [alto11, alto12, alto13],
		description: "Comfort and class combined — best for couples and business trips.",
		specs: ["4 Seats", "AC", "sunroof", "Automatic", "Bluetooth"],
	},

	{
		id: 3,
		name: "Suzuki Wagon R Stingray",
		category: "Hatchback Car",
		shortDesc: "Compact, fuel-efficient and perfect for city trips and solo travel.",
		cardImg: wagonCard1,
		price: "Rs. 12,000/day",
		images: [wagonr21, wagonr22, wagonr23],
		description:
			"This SUV provides excellent off-road performance and style. Perfect for hill country and long scenic routes.",
		specs: ["5 Seats", "AC", "4x4", "Automatic", "Bluetooth"],
	},

	{
		id: 4,
		name: "Suzuki Alto",
		category: "Mini Car",
		shortDesc: "Safe and reliable compact car perfect for city trips and solo travel.",
		cardImg: altoCard2,
		price: "Rs. 18,000/day",
		images: [alto21, alto22, alto23],
		description: "Safe and reliable compact car perfect for city trips and solo travel.",
		specs: ["4 Seats", "AC", "Automatic", "Large Storage", "WiFi"],
	},

	{
		id: 5,
		name: "Suzuki Wagon R FZ",
		category: "Hatchback Car",
		shortDesc: "Compact, fuel-efficient and perfect for city trips and solo travel.",
		cardImg: wagonCard2,
		price: "Rs. 12,000/day",
		images: [wagonr31, wagonr32],
		description:
			"This SUV provides excellent off-road performance and style. Perfect for hill country and long scenic routes.",
		specs: ["5 Seats", "AC", "4x4", "Automatic", "Bluetooth"],
	},
	{
		id: 6,
		name: "Toyota Hiace KDH",
		category: "Seater van  ( Flat Roof van ",
		cardImg: KDHIMG,
		price: "Rs. 25,000/day",
		images: [KDH1, KDH2, KDH3, KDH4],
		description:
			"A spacious and comfortable minivan, ideal for group travel and family outings.",
		specs: ["12 Seats", "AC", "Automatic", "Large Storage", "WiFi"],
	}
];

export function getVehicleById(id) {
	const numericId = Number.parseInt(String(id), 10);
	if (Number.isNaN(numericId)) return undefined;
	return vehicles.find((v) => v.id === numericId);
}
