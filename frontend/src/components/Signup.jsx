import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    contact: {
      phone: "",
      emergency: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (address and contact)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/hospitals/register",
        formData
      );

      if (response.data.status === "success") {
        setSuccess("Registration successful! Redirecting to login...");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl text-white font-bold">H</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register your hospital to get started
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-500 text-xl">✓</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500 text-xl">⚠</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            {/* Hospital Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Hospital Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 ease-in-out"
                  placeholder="Enter hospital name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 ease-in-out"
                  placeholder="Enter hospital email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 ease-in-out"
                  placeholder="Create a password"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Address Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                    Street
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition duration-200 ease-in-out"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200 ease-in-out"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition duration-200 ease-in-out"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700">
                    Pincode
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="address.pincode"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition duration-200 ease-in-out"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      id="contact.phone"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition duration-200 ease-in-out"
                      placeholder="Primary phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact.emergency" className="block text-sm font-medium text-gray-700">
                    Emergency Number
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="tel"
                      id="contact.emergency"
                      name="contact.emergency"
                      value={formData.contact.emergency}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition duration-200 ease-in-out"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white 
                       bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register Hospital"
              )}
            </button>

            <div className="text-center">
              <a
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;