import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/ambulance-bookings/my-bookings",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.status === "success") {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch bookings. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowConfirmation(true);
  };

  const handleCancelBooking = async () => {
    try {
      setCancellingId(bookingToCancel);
      const response = await axios.put(
        `http://localhost:5000/api/ambulance-bookings/${bookingToCancel}/cancel`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.status === "success") {
        // Close confirmation and refresh data
        setShowConfirmation(false);
        fetchBookings(); // Refresh the bookings list
      }
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
      console.error(err);
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-gray-600">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setBookingToCancel(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancellingId === bookingToCancel}
                className={`px-4 py-2 rounded text-white ${
                  cancellingId === bookingToCancel
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {cancellingId === bookingToCancel
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        My Ambulance Bookings
      </h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600 text-center">No bookings found</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Booking ID: {booking._id}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      booking.status === "pending"
                        ? "bg-orange-500"
                        : booking.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                  {booking.status === "pending" && (
                    <button
                      onClick={() => handleCancelClick(booking._id)}
                      className="px-3 py-1 rounded text-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Ambulance Details
                  </h4>
                  <p className="text-gray-600">
                    Vehicle Number:{" "}
                    <span className="font-medium">
                      {booking.ambulance.vehicleNumber}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Contact:{" "}
                    <span className="font-medium">
                      {booking.ambulance.contactNumber}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-medium">
                      {booking.ambulance.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Booking Information
                  </h4>
                  <p className="text-gray-600">
                    Pickup:{" "}
                    <span className="font-medium">
                      {booking.pickupLocation}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Patient Age:{" "}
                    <span className="font-medium">{booking.patientAge}</span>
                  </p>
                  <p className="text-gray-600">
                    Emergency:{" "}
                    <span className="font-medium">{booking.emergencyType}</span>
                  </p>
                  <p className="text-gray-600">
                    Created:{" "}
                    <span className="font-medium">
                      {new Date(booking.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingComponent;
