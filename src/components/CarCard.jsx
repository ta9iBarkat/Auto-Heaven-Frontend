import React, { useState } from "react";

const CarCard = ({
  car,
  userRole,
  onCarClick,
  onDeleteCar,
  onLoadCarBookings,
  onUpdateBookingStatus,
  onLoadCarPurchaseRequests,
  onUpdatePurchaseRequestStatus,
}) => {
  const [showBookings, setShowBookings] = useState(false);
  const [showPurchaseRequests, setShowPurchaseRequests] = useState(false);
  const [carBookings, setCarBookings] = useState([]);
  const [carPurchaseRequests, setCarPurchaseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewBookings = async () => {
    if (showBookings) {
      setShowBookings(false);
      return;
    }

    setIsLoading(true);
    try {
      const bookings = await onLoadCarBookings(car.id);
      setCarBookings(bookings);
      setShowBookings(true);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPurchaseRequests = async () => {
    if (showPurchaseRequests) {
      setShowPurchaseRequests(false);
      return;
    }

    setIsLoading(true);
    try {
      const requests = await onLoadCarPurchaseRequests(car.id);
      setCarPurchaseRequests(requests);
      setShowPurchaseRequests(true);
    } catch (error) {
      console.error("Error loading purchase requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:scale-105 transition-all duration-300">
      <div className="relative mb-4">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              car.status === "Available"
                ? "bg-green-500/20 text-green-200 border border-green-500/30"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            }`}
          >
            {car.status}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-500/30">
            {car.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{car.name}</h3>
          <p className="text-white/70 text-sm">
            {car.brand} • {car.year} • {car.category}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-[#36D2D5]">
            ${car.price}
            {car.listingType === "rent" ? "/day" : ""}
          </span>
        </div>

        {userRole === "partner" && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
              <p className="text-white/70">Earnings</p>
              <p className="font-bold text-green-300">${car.totalEarnings}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
              <p className="text-white/70">Bookings</p>
              <p className="font-bold text-blue-300">{car.bookings}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => onCarClick(car.id)}
            className="w-full bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white py-2 rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
          >
            More Details
          </button>

          {userRole === "partner" && (
            <div className="space-y-2">
              <button
                onClick={handleViewBookings}
                disabled={isLoading}
                className="w-full bg-blue-500/20 text-blue-200 py-2 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors border border-blue-500/30"
              >
                {showBookings ? "Hide Bookings" : "View Bookings"}
              </button>

              {car.listingType === "sale" && (
                <button
                  onClick={handleViewPurchaseRequests}
                  disabled={isLoading}
                  className="w-full bg-green-500/20 text-green-200 py-2 rounded-lg font-semibold hover:bg-green-500/30 transition-colors border border-green-500/30"
                >
                  {showPurchaseRequests ? "Hide Requests" : "Purchase Requests"}
                </button>
              )}

              <button
                onClick={() => onDeleteCar(car.id)}
                className="w-full bg-red-500/20 text-red-200 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                Delete Car
              </button>
            </div>
          )}
        </div>

        {/* Bookings Section */}
        {showBookings && carBookings.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-white font-semibold">Recent Bookings:</h4>
            {carBookings.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {booking.user?.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {booking.duration} days - ${booking.totalPrice}
                    </p>
                  </div>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      onUpdateBookingStatus(booking._id, e.target.value)
                    }
                    className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-xs"
                  >
                    <option value="pending" className="bg-gray-800">
                      Pending
                    </option>
                    <option value="confirmed" className="bg-gray-800">
                      Confirmed
                    </option>
                    <option value="active" className="bg-gray-800">
                      Active
                    </option>
                    <option value="completed" className="bg-gray-800">
                      Completed
                    </option>
                    <option value="cancelled" className="bg-gray-800">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Purchase Requests Section */}
        {showPurchaseRequests && carPurchaseRequests.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-white font-semibold">Purchase Requests:</h4>
            {carPurchaseRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {request.user?.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            onUpdatePurchaseRequestStatus(
                              request._id,
                              "confirmed"
                            )
                          }
                          className="px-2 py-1 bg-green-500/20 text-green-200 rounded text-xs hover:bg-green-500/30 transition-colors border border-green-500/30"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            onUpdatePurchaseRequestStatus(
                              request._id,
                              "cancelled"
                            )
                          }
                          className="px-2 py-1 bg-red-500/20 text-red-200 rounded text-xs hover:bg-red-500/30 transition-colors border border-red-500/30"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== "pending" && (
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          request.status === "confirmed"
                            ? "bg-green-500/20 text-green-200"
                            : "bg-red-500/20 text-red-200"
                        }`}
                      >
                        {request.status === "confirmed"
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCard;
