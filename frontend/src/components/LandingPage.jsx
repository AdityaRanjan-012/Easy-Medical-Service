import { Stethoscope, Ambulance, Calendar, ClipboardList, PhoneCall } from "lucide-react";

const LandingPage = () => {
  const handleGetStarted = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">MediCare</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Advanced Medical Management System</h1>
            <p className="text-xl mb-8">Streamlining healthcare services for better patient care</p>
            <button 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-50 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard icon={<ClipboardList className="h-12 w-12 text-blue-600" />} title="Medical Facility Management" description="Efficient management of medical facilities to ensure smooth operations and quality care." />
            <ServiceCard icon={<Ambulance className="h-12 w-12 text-blue-600" />} title="Ambulance Services" description="24/7 emergency ambulance services with quick response times and trained professionals." />
            <ServiceCard icon={<Calendar className="h-12 w-12 text-blue-600" />} title="Appointment Scheduling" description="Easy and convenient appointment booking system for patients and healthcare providers." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Healthcare Services?</h2>
          <p className="text-xl mb-8">Contact us today to learn more about our medical management system</p>
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300">Contact Us</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">MediCare</h3>
              <p>Advanced medical management solutions for modern healthcare.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Quick Links</h3>
              <ul>
                <li><a href="#" className="hover:text-blue-400">Home</a></li>
                <li><a href="#" className="hover:text-blue-400">Services</a></li>
                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <p className="flex items-center"><PhoneCall className="h-5 w-5 mr-2" /> +1 (555) 123-4567</p>
              <p className="flex items-center"><ClipboardList className="h-5 w-5 mr-2" /> info@medicare.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default LandingPage;