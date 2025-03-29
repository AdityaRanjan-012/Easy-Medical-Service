import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/layout/Navbar';
import FindAmbulance from './components/ambulance/FindAmbulance';
import HospitalLogin from './components/hospital/HospitalLogin';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import FindHospital from './components/hospital/FindHospital';
import LandingPage from './components/LandingPage';
import CustomerLogin from './components/Customer/Login';
import CustomerProfile from './components/Customer/Dashboard';
import CustomerSignup from './components/Customer/Signup';
import BookAmbulance from './components/ambulance/BookAmbulance';
import BookingComponent from './components/Customer/MyBooking';
import axios from 'axios';
//import.meta.env.VITE_API_URL ||
axios.defaults.baseURL = 'http://localhost:5000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-ambulance" element={<FindAmbulance />} />
          <Route path="/find-hospital" element={<FindHospital />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/book/ambulance" element={<BookAmbulance />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/bookings" element={<BookingComponent />} />
          
          <Route
            path="/hospital/dashboard"
            element={
              <PrivateRoute>
                <HospitalDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;