import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  TruckIcon,
  UserIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function ViewAmbulanceBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/ambulance-bookings/hospital",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        setBookings(response.data.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch ambulance bookings"
      );
      toast.error(
        err.response?.data?.message || "Failed to fetch ambulance bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(bookingId);
      const response = await axios.put(
        `http://localhost:5000/api/ambulance-bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Booking status updated successfully");
        // Update the local state to reflect the change
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update booking status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg animate-pulse">
        Loading ambulance bookings...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 text-lg">{error}</div>;
  }

  const statusOptions = [
    "pending",
    "confirmed",
    "in-transit",
    "completed",
    "cancelled",
  ];
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "in-transit": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const isFinalStatus = (status) => {
    return ["completed", "cancelled"].includes(status);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <TruckIcon className="h-6 w-6 mr-2 text-blue-600" />
          Ambulance Bookings
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Vehicle Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Pickup Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Patient Age
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Emergency Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Booked At
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.ambulance.vehicleNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                      {booking.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.pickupLocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.patientAge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.emergencyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={classNames(
                          statusColors[booking.status] ||
                            "bg-gray-100 text-gray-800",
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                      {new Date(booking.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isFinalStatus(booking.status) ? (
                        <div className="flex items-center text-green-600">
                          <CheckIcon className="h-5 w-5 mr-1" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              updateBookingStatus(booking._id, e.target.value)
                            }
                            disabled={
                              updatingStatus === booking._id ||
                              ["completed"].includes(booking.status)
                            }
                            className={`block appearance-none bg-white border ${
                              ["completed"].includes(booking.status)
                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 text-gray-700"
                            } py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500`}
                          >
                            {statusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          {updatingStatus === booking._id && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg
                                className="animate-spin h-4 w-4 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No ambulance bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Utility function for conditional class names (consistent with your Navbar)
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
