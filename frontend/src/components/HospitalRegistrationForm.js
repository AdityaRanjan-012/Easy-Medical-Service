import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentLocation } from '../utils/locationUtils';
import { searchLocation, reverseGeocode } from '../utils/nominatimUtils';

const HospitalRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    contact: {
      phone: '',
      emergency: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getLocationCoordinates = async () => {
    try {
      setLocationStatus('Getting location...');
      const location = await getCurrentLocation();
      
      // Get address details from coordinates using Nominatim
      const addressInfo = await reverseGeocode(location.latitude, location.longitude);
      
      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        address: {
          street: addressInfo.address.road || '',
          city: addressInfo.address.city || addressInfo.address.town || '',
          state: addressInfo.address.state || '',
          pincode: addressInfo.address.postcode || ''
        }
      }));
      
      setLocationStatus('Location and address acquired successfully');
    } catch (error) {
      setLocationStatus('Error getting location: ' + error.message);
      toast({
        title: 'Location Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const searchByAddress = async () => {
    try {
      setLocationStatus('Searching address...');
      const addressString = `${formData.address.street}, ${formData.address.city}, ${formData.address.state}, ${formData.address.pincode}`;
      const location = await searchLocation(addressString);
      
      setFormData(prev => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        }
      }));
      
      setLocationStatus('Location coordinates found from address');
    } catch (error) {
      setLocationStatus('Error finding location from address: ' + error.message);
      toast({
        title: 'Address Search Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // If coordinates are not set, try to get them from the address
      if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
        await searchByAddress();
      }
      
      const response = await axios.post('/api/hospitals/register', formData);
      toast({
        title: 'Registration Successful',
        description: 'You have successfully registered your hospital.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred during registration',
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
      <VStack spacing={4} align="stretch" maxW="md" mx="auto">
        <Heading textAlign="center">Hospital Registration</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Hospital Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter hospital name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Street Address</FormLabel>
              <Input
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>City</FormLabel>
              <Input
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>State</FormLabel>
              <Input
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Pincode</FormLabel>
              <Input
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Emergency Contact</FormLabel>
              <Input
                name="contact.emergency"
                value={formData.contact.emergency}
                onChange={handleInputChange}
                placeholder="Enter emergency contact"
              />
            </FormControl>

            <Button
              onClick={getLocationCoordinates}
              colorScheme="teal"
              type="button"
              width="full"
            >
              Get Current Location
            </Button>
            
            <Button
              onClick={searchByAddress}
              colorScheme="green"
              type="button"
              width="full"
              isDisabled={!formData.address.street || !formData.address.city}
            >
              Get Coordinates from Address
            </Button>
            
            {locationStatus && (
              <Text
                color={locationStatus.includes('Error') ? 'red.500' : 'green.500'}
                fontSize="sm"
              >
                {locationStatus}
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Register Hospital
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default HospitalRegistrationForm; 