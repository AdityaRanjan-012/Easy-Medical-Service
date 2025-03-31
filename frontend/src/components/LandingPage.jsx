import { Link } from 'react-router-dom';
import { BuildingOffice2Icon, TruckIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Rapid Medical Service
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting you to emergency healthcare and ambulances when you need them most.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/find-ambulance"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                Find an Ambulance
              </Link>
              <Link
                to="/find-hospital"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm sm:text-base shadow-sm hover:bg-gray-100 transition-colors"
              >
                <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                Find a Hospital
              </Link>
            </div>
          </div>
        </div>
        {/* Optional decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-100 transform -skew-y-3"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Why Choose RMS?</h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
          We provide fast, reliable, and accessible emergency medical services to save lives.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TruckIcon className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
              Instant Ambulance Booking
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Locate and contact available ambulances in your area with just a few clicks.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <BuildingOffice2Icon className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
              Hospital Locator
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Find nearby hospitals with real-time ambulance availability information.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <PhoneIcon className="h-12 w-12 text-blue-600 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 text-center">
              24/7 Emergency Support
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Our service is available round-the-clock to assist you in emergencies.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Need Help Now?</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Whether it's an ambulance or hospital information, we're here to assist you immediately.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/find-ambulance"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold text-sm sm:text-base shadow-sm hover:bg-gray-100 transition-colors"
            >
              Get an Ambulance
            </Link>
            <Link
              to="/hospital/login"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors"
            >
              Hospital Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Rapid Medical Service. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}