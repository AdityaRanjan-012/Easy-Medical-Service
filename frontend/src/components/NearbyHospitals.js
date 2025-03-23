import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { getCurrentLocation, findNearbyHospitals, calculateDistance } from '../utils/locationUtils';
import { searchLocation, reverseGeocode, formatAddress } from '../utils/nominatimUtils';

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const toast = useToast();

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      // Find nearby hospitals
      const nearbyHospitals = await findNearbyHospitals(longitude, latitude);
      
      // Add distance to each hospital
      const hospitalsWithDistance = nearbyHospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          latitude,
          longitude,
          hospital.location.coordinates[1],
          hospital.location.coordinates[0]
        )
      }));
      
      // Sort by distance
      hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
      
      setHospitals(hospitalsWithDistance);
    } catch (err) {
      throw new Error('Error finding nearby hospitals: ' + err.message);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's current location
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Get address from coordinates
      const addressInfo = await reverseGeocode(location.latitude, location.longitude);
      setUserAddress(formatAddress(addressInfo.address));
      
      // Find nearby hospitals
      await fetchNearbyHospitals(location.latitude, location.longitude);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an address to search',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get coordinates from address
      const location = await searchLocation(searchAddress);
      setUserLocation({
        latitude: location.latitude,
        longitude: location.longitude
      });
      
      setUserAddress(formatAddress(location.address));
      
      // Find nearby hospitals
      await fetchNearbyHospitals(location.latitude, location.longitude);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>Find Nearby Hospitals</Heading>
      
      <VStack spacing={4} mb={6}>
        <FormControl>
          <FormLabel>Search by Address</FormLabel>
          <InputGroup>
            <Input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter an address to search"
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
            />
            <InputRightElement>
              <Button
                size="sm"
                onClick={handleAddressSearch}
                isLoading={loading}
              >
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleGetCurrentLocation}
          isLoading={loading}
          width="full"
        >
          Use Current Location
        </Button>
      </VStack>

      {userAddress && (
        <Text mb={4} fontWeight="medium">
          Showing results near: {userAddress}
        </Text>
      )}

      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4} align="stretch">
          {hospitals.map((hospital) => (
            <Box
              key={hospital._id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              shadow="sm"
            >
              <Heading size="md">{hospital.name}</Heading>
              <Text mt={2}>
                {hospital.address.street}, {hospital.address.city}, {hospital.address.state}
              </Text>
              <Text mt={2}>
                Distance: {hospital.distance.toFixed(2)} km
              </Text>
              <Text mt={2}>
                Contact: {hospital.contact.phone} (Emergency: {hospital.contact.emergency})
              </Text>
              <Text mt={2}>
                Available Ambulances: {hospital.ambulanceCount.available}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default NearbyHospitals; 