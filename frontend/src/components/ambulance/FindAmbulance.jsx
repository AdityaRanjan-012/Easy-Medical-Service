import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function FindAmbulance() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      toast.error('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/ambulances/available/${city.trim()}`);
      setHospitals(response.data);
      if (response.data.length === 0) {
        toast.error('No available ambulances found in this city');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available ambulances');
      toast.error(err.response?.data?.message || 'Failed to fetch available ambulances');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Available Ambulances
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Enter your city to find available ambulances nearby
          </p>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSearch} className="flex justify-center gap-x-4">
            <div className="w-full max-w-lg">
              <label htmlFor="city" className="sr-only">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm"
                placeholder="Enter your city name"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex-none rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {hospitals.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Ambulances</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{hospital.hospitalName}</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="flex items-center gap-x-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      {hospital.hospitalAddress.street}, {hospital.hospitalAddress.city}
                    </p>
                    <p className="mt-1 flex items-center gap-x-2">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      Emergency: {hospital.hospitalContact.emergency}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Available Ambulances:</h4>
                    <ul className="mt-2 space-y-2">
                      {hospital.availableAmbulances.map((ambulance) => (
                        <li
                          key={ambulance._id}
                          className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2 text-sm"
                        >
                          <span className="font-medium">{ambulance.vehicleNumber}</span>
                          <a
                            href={`tel:${ambulance.contactNumber}`}
                            className="text-red-600 hover:text-red-500"
                          >
                            {ambulance.contactNumber}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 