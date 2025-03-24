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
// src/App.jsx or wherever your routes are defined
import CustomerLogin from './components/Customer/Login';
import CustomerProfile from './components/Customer/Dashboard';

// Axios default config
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
          <Route path="/customer/profile" element={<CustomerProfile />} />
          
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