import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  BuildingOffice2Icon, 
  PhoneIcon, 
  TruckIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import ViewAmbulanceBookings from './ViewAmbulanceBookings';
import AmbulanceManagement from './AmbulanceManagement';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-700 text-lg font-medium">Loading hospital dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <div className="text-center text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-center text-gray-600">{error}</p>
          <button 
            onClick={fetchHospitalProfile}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Welcome back, {hospitalData.name}</h1>
            <p className="mt-2 text-blue-100">Hospital Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <TruckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Available Ambulances</p>
              <p className="text-2xl font-bold text-gray-900">{hospitalData.ambulanceCount.available} <span className="text-sm text-gray-500 font-normal">/ {hospitalData.ambulanceCount.total}</span></p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Average Response Time</p>
              <p className="text-2xl font-bold text-gray-900">12.5 <span className="text-sm text-gray-500 font-normal">minutes</span></p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Patients Served</p>
              <p className="text-2xl font-bold text-gray-900">189 <span className="text-sm text-gray-500 font-normal">this month</span></p>
            </div>
          </div>
        </div>
        
        {/* Hospital Profile Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BuildingOffice2Icon className="h-6 w-6 mr-2 text-blue-600" />
              Hospital Information
            </h2>
            <button className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              Edit Profile
            </button>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Information
                </h3>
                <div className="space-y-3 pl-7">
                  <div className="flex items-baseline">
                    <span className="text-sm font-medium text-gray-500 w-24">Phone:</span>
                    <span className="text-gray-800">{hospitalData.contact.phone}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-sm font-medium text-gray-500 w-24">Emergency:</span>
                    <span className="text-gray-800 flex items-center">
                      {hospitalData.contact.emergency}
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                        24/7
                      </span>
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
                    <span className="text-gray-800 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {hospitalData.email}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <BellAlertIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Emergency Services
                </h3>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">ICU Availability</span>
                    <span className="text-blue-800 font-medium">8 beds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Trauma Center</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Address
                </h3>
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-800">{hospitalData.address.street}</p>
                  <p className="text-gray-800">{hospitalData.address.city}, {hospitalData.address.state}</p>
                  <p className="text-gray-800">PIN: {hospitalData.address.pincode}</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View on Map
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Ambulance Fleet Status
                </h3>
                <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(hospitalData.ambulanceCount.available / hospitalData.ambulanceCount.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      {Math.round((hospitalData.ambulanceCount.available / hospitalData.ambulanceCount.total) * 100)}% Available
                    </span>
                  </div>
                  <div className="text-gray-700 font-medium">
                    {hospitalData.ambulanceCount.available}/{hospitalData.ambulanceCount.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Ambulance Bookings Section */}
        <div>
          <ViewAmbulanceBookings />
        </div>
        
        {/* Ambulance Management Section */}
        <div>
          <AmbulanceManagement ambulances={ambulances} setAmbulances={setAmbulances} />
        </div>
      </div>
    </div>
  );
}