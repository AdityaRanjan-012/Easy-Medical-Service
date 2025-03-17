const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  neighbors: [{ type: String }],
});

module.exports = mongoose.model('City', CitySchema);