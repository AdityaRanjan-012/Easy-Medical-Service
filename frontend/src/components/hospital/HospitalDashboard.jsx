import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function HospitalDashboard() {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState({
    vehicleNumber: '',
    contactNumber: ''
  });

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hospitals/profile');
      setAmbulances(response.data.ambulances); // Extracting the ambulances array
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ambulances');
      toast.error(err.response?.data?.message || 'Failed to fetch ambulances');
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
      const errorMessage = err.response?.data?.errors?.[0]?.message || 
                          err.response?.data?.message || 
                          'Failed to add ambulance';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (ambulanceId, newStatus) => {
    try {
      await axios.put(`/api/ambulances/${ambulanceId}/status`, { status: newStatus });
      setAmbulances(ambulances.map(amb => 
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
      setAmbulances(ambulances.filter(amb => amb._id !== ambulanceId));
      toast.success('Ambulance deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete ambulance');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Ambulances</h1>
            <p className="mt-2 text-sm text-gray-700">
              Add and manage your hospital's ambulances
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Ambulance
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add New Ambulance</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddAmbulance} className="space-y-4">
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  value={newAmbulance.vehicleNumber}
                  onChange={(e) => setNewAmbulance({ ...newAmbulance, vehicleNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="e.g., MH02AB1234"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={newAmbulance.contactNumber}
                  onChange={(e) => setNewAmbulance({ ...newAmbulance, contactNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Add Ambulance
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Vehicle Number
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contact Number
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {ambulances.map((ambulance) => (
                      <tr key={ambulance._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {ambulance.vehicleNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {ambulance.contactNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={ambulance.status}
                            onChange={(e) => handleStatusChange(ambulance._id, e.target.value)}
                            className="rounded-md border-gray-300 text-sm focus:border-red-500 focus:ring-red-500"
                          >
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                          <button
                            onClick={() => handleDelete(ambulance._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ambulances.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-3 py-4 text-sm text-gray-500 text-center">
                          No ambulances found. Add your first ambulance.
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
    </div>
  );
} 