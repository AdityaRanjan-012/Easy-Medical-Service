// src/components/BookAmbulance.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BookAmbulance = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const ambulance = location.state?.ambulance; // Get ambulance data from state

  const [formData, setFormData] = useState({
    ambulanceId: ambulance?._id || '',
    pickupLocation: '',
    patientAge: '',
    emergencyType: 'emergency',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book an ambulance');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/ambulance-bookings/book',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Ambulance booked successfully!');
      navigate('/customer/bookings'); // Redirect to bookings page after success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book ambulance');
    } finally {
      setLoading(false);
    }
  };

  if (!ambulance) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Ambulance Selected</h2>
          <p className="mt-2 text-gray-600">Please go back and select an ambulance to book.</p>
          <Link to="/find-ambulance" className="mt-4 inline-block text-red-600 hover:text-red-500">
            Back to Find Ambulance
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        {!user ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
            <p className="mt-2 text-gray-600">Please login to book an ambulance.</p>
            <Link
              to="/customer/login"
              className="mt-4 inline-block rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500"
            >
              Customer Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Ambulance</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <input
                  type="text"
                  value={ambulance.vehicleNumber}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter pickup location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Age</label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter patient age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Type</label>
                <select
                  name="emergencyType"
                  value={formData.emergencyType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="emergency">Emergency</option>
                  <option value="non-emergency">Non-Emergency</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Link
                  to="/find-ambulance"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAmbulance;