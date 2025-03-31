import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BuildingOffice2Icon, PhoneIcon, TruckIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import ViewAmbulanceBookings from './ViewAmbulanceBookings';
import AmbulanceManagement from './AmbulanceManagement'; // Import the new component

export default function HospitalDashboard() {
  const [hospitalData, setHospitalData] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    fetchHospitalProfile();
  }, []);

  const fetchHospitalProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hospitals/profile');
      setHospitalData(response.data);
      console.log(response.data);
      setAmbulances(response.data.ambulances);
      login({ name: response.data.name }, 'hospital');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hospital data');
      toast.error(err.response?.data?.message || 'Failed to fetch hospital data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600 text-lg animate-pulse">Loading hospital data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hospital Profile Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <BuildingOffice2Icon className="h-6 w-6 mr-2" />
              {hospitalData.name}
            </h1>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Phone: {hospitalData.contact.phone}
                </p>
                <p className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-red-500" />
                  Emergency: {hospitalData.contact.emergency}
                </p>
                <p>Email: {hospitalData.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
              <div className="text-gray-600">
                <p>{hospitalData.address.street}</p>
                <p>{hospitalData.address.city}, {hospitalData.address.state}</p>
                <p>PIN: {hospitalData.address.pincode}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ambulance Status</h3>
              <div className="flex items-center space-x-4 text-gray-600">
                <p className="flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-green-500" />
                  Available: {hospitalData.ambulanceCount.available}
                </p>
                <p>Total: {hospitalData.ambulanceCount.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Ambulance Bookings Section */}
        <div className="mb-8">
          <ViewAmbulanceBookings />
        </div>
        {/* Ambulance Management Section */}
        <div className="mb-8">
          <AmbulanceManagement ambulances={ambulances} setAmbulances={setAmbulances} />
        </div>

      </div>
    </div>
  );
}