const mongoose = require('mongoose');
const City = require('./models/City');
const Hospital = require('./models/Hospital');
const Ambulance = require('./models/Ambulance');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const seedDB = async () => {
  await City.deleteMany({});
  await Hospital.deleteMany({});
  await Ambulance.deleteMany({});

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

  const hospitals = [
    { city: 'Bijoynagar', rank: 3, emergencyNumber: '123-456-7890', ambulances: 2 },
    { city: 'Borjhar', rank: 2, emergencyNumber: '123-456-7891', ambulances: 1 },
    { city: 'Azara', rank: 4, emergencyNumber: '123-456-7892', ambulances: 3 },
    { city: 'Guwahati', rank: 1, emergencyNumber: '123-456-7893', ambulances: 5 },
  ];
  const savedHospitals = await Hospital.insertMany(hospitals);

  for (const hospital of savedHospitals) {
    for (let i = 0; i < hospital.ambulances; i++) {
      const ambulance = new Ambulance({ hospital: hospital._id });
      await ambulance.save();
    }
  }

  console.log('Database seeded');
  mongoose.connection.close();
};

seedDB();