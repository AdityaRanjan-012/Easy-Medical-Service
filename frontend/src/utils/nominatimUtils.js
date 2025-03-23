import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Search for a location by address
export const searchLocation = async (address) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'RMS Hospital Finder' // Required by Nominatim's usage policy
      }
    });
    
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        displayName: location.display_name,
        address: location.address
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'RMS Hospital Finder'
      }
    });
    
    if (response.data) {
      return {
        displayName: response.data.display_name,
        address: response.data.address
      };
    }
    throw new Error('Address not found');
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

// Format address components into a string
export const formatAddress = (addressComponents) => {
  const components = [];
  if (addressComponents.road) components.push(addressComponents.road);
  if (addressComponents.suburb) components.push(addressComponents.suburb);
  if (addressComponents.city || addressComponents.town) components.push(addressComponents.city || addressComponents.town);
  if (addressComponents.state) components.push(addressComponents.state);
  if (addressComponents.postcode) components.push(addressComponents.postcode);
  return components.join(', ');
}; 