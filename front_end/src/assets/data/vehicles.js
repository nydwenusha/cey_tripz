import api from "../services/api/api";

const normalizeVehicle = (vehicle = {}) => ({
  id: vehicle.id,
  name: vehicle.name || "Unnamed Vehicle",
  type: vehicle.type || vehicle.category || "Vehicle",
  category: vehicle.category || vehicle.type || "Vehicle",
  shortDesc: vehicle.shortDesc || vehicle.description || "",
  cardImg: vehicle.cardImg || vehicle.images?.[0] || "",
  price: vehicle.price || "$0.00/day",
  images: Array.isArray(vehicle.images) ? vehicle.images : [],
  description: vehicle.description || "",
  specs: Array.isArray(vehicle.specs) ? vehicle.specs : [],
  featured: Boolean(vehicle.featured),
  status: vehicle.status || "inactive",
  capacityValue: Number(vehicle.capacityValue ?? Number.parseInt(vehicle.capacity, 10)) || 0,
  fuelType: vehicle.fuelType || "",
  transmission: vehicle.transmission || "",
});

export async function getVehicles() {
  const response = await api.get("/vehicles");
  return (response.data?.vehicles || []).map(normalizeVehicle);
}

export async function getVehicleById(id) {
  const response = await api.get(`/vehicles/${id}`);
  const vehicle = response.data?.vehicle;
  return vehicle ? normalizeVehicle(vehicle) : undefined;
}
