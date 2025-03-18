const City = require('../models/City');
const Hospital = require('../models/Hospital');
const Ambulance = require('../models/Ambulance');

const findShortestPath = async (startCity) => {
  const cities = await City.find();
  const graph = cities.reduce((acc, city) => {
    acc[city.name] = city.neighbors;
    return acc;
  }, {});

  const visited = new Map();
  const distance = new Map();
  const queue = [];

  for (const city of cities) {
    visited.set(city.name, false);
    distance.set(city.name, Infinity);
  }

  queue.push(startCity);
  visited.set(startCity, true);
  distance.set(startCity, 0);

  while (queue.length > 0) {
    const currentCity = queue.shift();
    const neighbors = graph[currentCity] || [];

    for (const neighbor of neighbors) {
      if (!visited.get(neighbor)) {
        visited.set(neighbor, true);
        distance.set(neighbor, distance.get(currentCity) + 5);
        queue.push(neighbor);
      }
    }
  }

  return distance;
};

const rankHospitals = async (distance) => {
  const hospitals = await Hospital.find();
  const rankedHospitals = [];

  for (const hospital of hospitals) {
    const dist = distance.get(hospital.city);
    if (dist !== Infinity) {
      rankedHospitals.push({
        hospital: hospital,
        distance: dist,
      });
    }
  }

  rankedHospitals.sort((a, b) => {
    if (a.distance === b.distance) return a.hospital.rank - b.hospital.rank;
    return a.distance - b.distance;
  });

  return rankedHospitals;
};

exports.dispatchAmbulance = async (req, res) => {
  const { startCity } = req.body;

  try {
    const cityExists = await City.findOne({ name: startCity });
    if (!cityExists) {
      return res.status(404).json({ msg: 'City not found' });
    }

    const distance = await findShortestPath(startCity);
    const rankedHospitals = await rankHospitals(distance);

    if (rankedHospitals.length === 0) {
      return res.status(404).json({ msg: 'No reachable hospitals found' });
    }

    const bestHospital = rankedHospitals[0].hospital;
    const bestDistance = rankedHospitals[0].distance;

    const ambulance = await Ambulance.findOne({ hospital: bestHospital._id, isAvailable: true });
    if (!ambulance) {
      return res.status(400).json({ msg: 'No available ambulances at the nearest hospital' });
    }

    ambulance.isAvailable = false;
    await ambulance.save();

    res.json({
      message: `Ambulance dispatched from ${bestHospital.city}`,
      distance: bestDistance,
      emergencyNumber: bestHospital.emergencyNumber,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};