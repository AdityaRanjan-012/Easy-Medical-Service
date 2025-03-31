import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PlusIcon, XMarkIcon, TruckIcon, TrashIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function AmbulanceManagement({ ambulances, setAmbulances }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState({
    vehicleNumber: '',
    contactNumber: '',
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);

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

  const statusColors = {
    available: 'bg-emerald-200 text-emerald-800 border-emerald-200',
    booked: 'bg-red-100 text-sky-800 border-sky-200',

  };

  return (
    <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
      <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <TruckIcon className="h-7 w-7 mr-3 text-white" />
          Ambulance Fleet Management
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md font-medium"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Ambulance
        </button>
      </div>

      {/* Add Ambulance Form */}
      {showAddForm && (
        <div className="p-8 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Add New Ambulance</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleAddAmbulance} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
              <input
                type="text"
                value={newAmbulance.vehicleNumber}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, vehicleNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 shadow-sm py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., MH02AB1234"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                value={newAmbulance.contactNumber}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, contactNumber: e.target.value })}
                className="w-full rounded-lg border border-gray-300 shadow-sm py-3 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="10-digit mobile number"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-3 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
              >
                Add Ambulance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ambulance Table */}
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-700 flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-500" />
            Fleet Status Overview
          </h3>
          <div className="flex space-x-2">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${color.split(' ')[0]}`}></div>
                <span className="text-xs text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Vehicle Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Contact Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ambulances.map((ambulance) => (
                <tr key={ambulance._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ambulance.vehicleNumber}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                    {ambulance.contactNumber}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        statusColors[ambulance.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {ambulance.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDelete(ambulance._id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        <span className="font-medium">Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ambulances.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <TruckIcon className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 text-lg">No ambulances found</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-2 text-sm font-medium"
                      >
                        Add Your First Ambulance
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}