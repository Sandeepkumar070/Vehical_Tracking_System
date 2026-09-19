const DEFAULT_API_BASE_URL = "https://vehicleapis.runasp.net";

const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  driverVehicle: `${API_BASE_URL}/api/DriverVehicle`,
  fixedLocation: `${API_BASE_URL}/api/FIX_get_location`,
  movableLocation: `${API_BASE_URL}/api/movalble_location`,
  updateLocation: `${API_BASE_URL}/api/Update_location`,
  vehicleAssignment: `${API_BASE_URL}/api/VehicleAssignment`,
  registeredVehicles: `${API_BASE_URL}/api/VehicleAssignment/registered-vehicles`,
  driverImage: `${API_BASE_URL}/api/VehicleAssignment/driver-image`,
  vehicleDetails: `${API_BASE_URL}/api/VehicleDetails`,
  vehicleLogin: `${API_BASE_URL}/api/VehicleLogin`,
  vehicleMonitoring: `${API_BASE_URL}/api/VehicleMonitoring`,
  vehicleStatus: `${API_BASE_URL}/api/VehicleStatus`,
  vehicleStatusUpdate: `${API_BASE_URL}/api/VehicleStatusUpdate`,
};
