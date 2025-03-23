// src/components/HospitalDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PlusIcon, XMarkIcon, BuildingOffice2Icon, PhoneIcon, TruckIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

export default function HospitalDashboard() {
  const [hospitalData, setHospitalData] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState({
    vehicleNumber: '',
    contactNumber: '',
  });
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
      login({ name: response.data.name }, 'hospital'); // Set role as 'hospital'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch hospital data');
      toast.error(err.response?.data?.message || 'Failed to fetch hospital data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAmbulance = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/ambulances', newAmbulance);
      setAmbulances([...ambulances, response.data]);
      setShowAddForm(false);
      setNewAmbulance({ vehicleNumber: '', contactNumber: '' });
      toast.success('Ambulance added successfully');
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Failed to add ambulance';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (ambulanceId, newStatus) => {
    try {
      await axios.put(`/api/ambulances/${ambulanceId}/status`, { status: newStatus });
      setAmbulances(ambulances.map((amb) =>
        amb._id === ambulanceId ? { ...amb, status: newStatus } : amb
      ));
      toast.success('Ambulance status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (ambulanceId) => {
    if (!window.confirm('Are you sure you want to delete this ambulance?')) return;
    try {
      await axios.delete(`/api/ambulances/${ambulanceId}`);
      setAmbulances(ambulances.filter((amb) => amb._id !== ambulanceId));
      toast.success('Ambulance deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete ambulance');
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

        {/* Ambulance Management Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Ambulance Management</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Ambulance
            </button>
          </div>

          {/* Add Ambulance Form */}
          {showAddForm && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Ambulance</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddAmbulance} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    value={newAmbulance.vehicleNumber}
                    onChange={(e) => setNewAmbulance({ ...newAmbulance, vehicleNumber: e.target.value })}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., MH02AB1234"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    value={newAmbulance.contactNumber}
                    onChange={(e) => setNewAmbulance({ ...newAmbulance, contactNumber: e.target.value })}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Ambulance
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ambulance Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ambulances.map((ambulance) => (
                    <tr key={ambulance._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ambulance.vehicleNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ambulance.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={ambulance.status}
                          onChange={(e) => handleStatusChange(ambulance._id, e.target.value)}
                          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="Available">Available</option>
                          <option value="Booked">Booked</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          onClick={() => handleDelete(ambulance._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ambulances.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No ambulances found. Click "Add Ambulance" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}