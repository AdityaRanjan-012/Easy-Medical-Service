import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BuildingOffice2Icon, PhoneIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';

// Base API URL (could be moved to a config file in a real app)
const API_BASE_URL = 'http://localhost:5000/api';

export default function FindNearbyHospitals() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // New state to track if search was attempted

  const fetchHospitals = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      setSearched(true); // Mark that a search has been attempted
      const response = await axios.get(`${API_BASE_URL}/hospitals/city/${cityName.trim()}`);
      setHospitals(response.data);
      if (response.data.length === 0) {
        toast.error('No hospitals found in this city');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch hospital data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!city.trim()) {
      toast.error('Please enter a city name');
      return;
    }
    fetchHospitals(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Nearby Hospitals
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Enter your city to find hospitals and available ambulances
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="flex justify-center gap-x-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 rounded-xl border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              placeholder="Enter city name (e.g., Guwahati)"
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find Hospitals'}
            </button>
          </form>
        </div>

        {/* Hospital Results */}
        {hospitals.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Availble Hospitals 
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <BuildingOffice2Icon className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                  </div>

                  <div className="space-y-3 text-gray-600 text-sm">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p>{hospital.address.street}</p>
                        <p>{hospital.address.city}, {hospital.address.state}</p>
                        <p>PIN: {hospital.address.pincode}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p>Phone: {hospital.contact.phone}</p>
                        <p className="text-red-600">Emergency: {hospital.contact.emergency}</p>
                      </div>
                    </div>

                    {/* Ambulance Status */}
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p>Total Ambulances: {hospital.ambulanceCount.total}</p>
                        <p className="text-green-600">
                          Available: {hospital.ambulanceCount.available}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ambulance Details */}
                  {hospital.ambulances.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Ambulances:</h4>
                      <div className="space-y-2">
                        {hospital.ambulances.map((ambulance) => (
                          <div
                            key={ambulance._id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-xl"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{ambulance.vehicleNumber}</p>
                              <p className="text-xs text-gray-500">{ambulance.status}</p>
                            </div>
                            <a
                              href={`tel:${ambulance.contactNumber}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              {ambulance.contactNumber}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 text-center text-red-600 bg-red-50 p-4 rounded-xl max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* No Results - Only show after search */}
        {hospitals.length === 0 && !loading && !error && searched && (
          <div className="mt-8 text-center text-gray-600 bg-gray-50 p-4 rounded-xl max-w-2xl mx-auto">
            No hospitals found in {city.charAt(0).toUpperCase() + city.slice(1)}. Try another city.
          </div>
        )}
      </div>
    </div>
  );
}