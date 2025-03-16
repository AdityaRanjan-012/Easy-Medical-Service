const AmbulanceBooking = require("../models/AmbulanceBooking");

exports.bookAmbulance = async (req, res) => {  // acc to hospital
  try {
    const { customerId, hospitalId } = req.body;

    const booking = new AmbulanceBooking({ customer: customerId, hospital: hospitalId });
    await booking.save();

    res.status(201).json({ message: "Ambulance booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error booking ambulance", error: error.message });
  }
};

exports.updateAmbulanceStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await AmbulanceBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: "Ambulance status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
