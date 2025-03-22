const mongoose = require('mongoose');
const City = require('./models/City');
const HospitalProfile = require('./models/HospitalProfile');
const DoctorProfile = require('./models/DoctorProfile');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  
const seedDB = async () => {
  await City.deleteMany({});
  await HospitalProfile.deleteMany({});
  await DoctorProfile.deleteMany({});

  const cities = [
    { name: 'Boko', neighbors: ['Bijoynagar'] },
    { name: 'Bijoynagar', neighbors: ['Boko', 'Mirza'] },
    { name: 'Mirza', neighbors: ['Bijoynagar', 'Borjhar'] },
    { name: 'Borjhar', neighbors: ['Mirza', 'Vip'] },
    { name: 'Vip', neighbors: ['Borjhar', 'Azara'] },
    { name: 'Azara', neighbors: ['Vip', 'Jhalukbari'] },
    { name: 'Jhalukbari', neighbors: ['Azara', 'Guwahati'] },
    { name: 'Guwahati', neighbors: ['Jhalukbari'] },
  ];
  await City.insertMany(cities);

  // Seed a hospital (manual signup would replace this)
  const hospitalUser = new User({
    name: 'Hospital Guwahati',
    email: 'hospital@guwahati.com',
    password: await bcrypt.hash('hospital123', 10), // Hash password
    role: 'hospital',
  });
  await hospitalUser.save();

  const hospitalProfile = new HospitalProfile({
    userId: hospitalUser._id,
    ambulances: 5,
    doctors: [],
    location: 'Guwahati Medical Center',
  });
  await hospitalProfile.save();

  // Seed a doctor (manual signup would replace this)
  const doctorUser = new User({
    name: 'Dr. John',
    email: 'john@doctor.com',
    password: await bcrypt.hash('doctor123', 10), // Hash password
    role: 'doctor',
  });
  await doctorUser.save();

  const doctorProfile = new DoctorProfile({
    userId: doctorUser._id,
    specialist: ['Cardiology'],
    location: 'Guwahati Medical Center',
    hospitalId: hospitalProfile._id,
  });
  await doctorProfile.save();

  hospitalProfile.doctors.push(doctorProfile._id);
  await hospitalProfile.save();

  console.log('Database seeded');
  mongoose.connection.close();
};


seedDB();