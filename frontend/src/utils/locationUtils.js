import axios from 'axios';

// Get current location using browser's geolocation API
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Find nearby hospitals using the backend API
export const findNearbyHospitals = async (longitude, latitude, maxDistance = 10000) => {
  try {
    const response = await axios.get(`/api/hospitals/nearby`, {
      params: {
        longitude,
        latitude,
        maxDistance
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error finding nearby hospitals:', error);
    throw error;
  }
};

// Calculate distance between two points in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Convert degrees to radians
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
}; 