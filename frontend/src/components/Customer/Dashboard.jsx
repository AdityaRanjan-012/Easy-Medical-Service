// src/components/CustomerProfile.jsx
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

export default function CustomerProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfileData(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile data');
      toast.error(err.response?.data?.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfileData(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600 text-lg animate-pulse">Loading profile...</div>
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <UserCircleIcon className="h-6 w-6 mr-2" />
              Customer Profile
            </h1>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Name
                      </h3>
                      <p className="mt-1 text-gray-600">{profileData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Email
                      </h3>
                      <p className="mt-1 text-gray-600">{profileData?.email || 'Not available'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Phone
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {profileData.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Address
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {profileData.address || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/find-ambulance"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-center transition-colors"
            >
              Find Ambulance
            </a>
            <a
              href="/customer/bookings"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-center transition-colors"
            >
              View Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}