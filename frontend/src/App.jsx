import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import FindAmbulance from './components/ambulance/FindAmbulance';
import HospitalLogin from './components/hospital/HospitalLogin';
import HospitalDashboard from './components/hospital/HospitalDashboard';
import PrivateRoute from './components/auth/PrivateRoute';

// Axios default config
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<FindAmbulance />} />
        <Route path="/find-ambulance" element={<FindAmbulance />} />
        <Route path="/hospital/login" element={<HospitalLogin />} />
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
  );
}

export default App;
