import React, { useState, useEffect } from "react";

const CarDetailsModal = ({
  isOpen,
  onClose,
  carId,
  userRole,
  onCarUpdated,
}) => {
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    listingType: "",
    description: "",
  });

  const [bookingForm, setBookingForm] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalAmount: 0,
  });

  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (isOpen && carId) {
      fetchCarDetails();
    }
  }, [isOpen, carId]);

  const fetchCarDetails = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: "GET",
        headers: headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch car details");
      }

      if (result.success && result.data) {
        setCar(result.data);
        setEditForm({
          title: result.data.title || "",
          price:
            result.data.pricePerDay ||
            result.data.salePrice ||
            result.data.price ||
            "",
          category: result.data.category || "",
          listingType: result.data.listingType || "",
          description: result.data.description || "",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "startDate" || name === "endDate") {
        if (updated.startDate && updated.endDate) {
          const start = new Date(updated.startDate);
          const end = new Date(updated.endDate);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          updated.totalDays = diffDays;
          updated.totalAmount =
            diffDays * (car?.pricePerDay || car?.price || 0);
        }
      }

      return updated;
    });
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to update car details");
      }

      const updateData = {
        title: editForm.title,
        category: editForm.category,
        description: editForm.description,
      };

      if (editForm.listingType === "rent") {
        updateData.pricePerDay = Number(editForm.price);
      } else {
        updateData.salePrice = Number(editForm.price);
      }

      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update car");
      }

      if (result.success) {
        setCar(result.data);
        setIsEditing(false);
        onCarUpdated();
        alert("Car updated successfully!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePurchaseRequest = async () => {
    setIsBooking(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to send a purchase request");
      }

      // Create unique dates to avoid duplicate key error
      const randomHours = Math.floor(Math.random() * 24) + 1; // 1-24 hours
      const randomMinutes = Math.floor(Math.random() * 60); // 0-59 minutes

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9 + randomHours, randomMinutes, 0, 0);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      dayAfter.setHours(18, randomMinutes + 1, 0, 0); // Slight offset to ensure different times

      const purchaseData = {
        carId: carId,
        startDate: tomorrow.toISOString(),
        endDate: dayAfter.toISOString(),
        notes: `PURCHASE REQUEST: Customer is interested in purchasing this ${
          car.title
        }. Contact details: Customer wants to buy this vehicle for $${
          car.salePrice || car.price || 0
        }. Please contact to discuss purchase terms and conditions. Request ID: ${Date.now()}`,
        type: "purchase",
      };

      console.log("Creating purchase request with data:", purchaseData);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send purchase request");
      }

      if (result.success && result.data) {
        setShowBookingForm(false);
        alert(`Purchase request sent successfully! 

Car: ${result.data.car?.title || car.title}
Price: $${car.salePrice || car.price || 0}
Status: ${result.data.status}

The seller will be notified and will contact you soon to discuss the purchase details. You can track this request in your profile under "My Rentals" section.`);
        onClose();
      }
    } catch (err) {
      console.error("Error sending purchase request:", err);
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to book this car");
      }

      // Add random minutes to avoid duplicate key conflicts
      const startDate = new Date(bookingForm.startDate);
      const endDate = new Date(bookingForm.endDate);

      // Add random minutes to make dates unique
      const randomMinutes = Math.floor(Math.random() * 60);
      startDate.setMinutes(randomMinutes);
      endDate.setMinutes(randomMinutes + 1);

      const bookingData = {
        carId: carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        notes: `Rental booking for ${car.title}. Duration: ${
          bookingForm.totalDays
        } days. Booking ID: ${Date.now()}`,
      };

      console.log("Creating booking with data:", bookingData);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      if (result.success) {
        setShowBookingForm(false);
        alert(`Booking request sent successfully! 

Car: ${car.title}
Duration: ${bookingForm.totalDays} days
Total Amount: $${bookingForm.totalAmount}
Status: ${result.data.status}

The car owner will be notified and will contact you soon.`);
        onClose();
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Car Details" : "Car Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Loading State */}
          {isLoading && !car ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D2D5] mx-auto"></div>
              <p className="text-white mt-4">Loading car details...</p>
            </div>
          ) : car ? (
            <div className="space-y-6">
              {/* Car Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={car.images?.[0]?.url || "/src/assets/car-hero.png"}
                    alt={car.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {car.images?.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {car.images.slice(1, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`${car.title} ${index + 2}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Car Info */}
                <div className="space-y-4">
                  {isEditing ? (
                    <form onSubmit={handleUpdateCar} className="space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditInputChange}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditInputChange}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditInputChange}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          required
                        >
                          <option value="Luxury">Luxury</option>
                          <option value="Family">Family</option>
                          <option value="Van">Van</option>
                          <option value="SUV">SUV</option>
                          <option value="Sports">Sports</option>
                          <option value="Economy">Economy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditInputChange}
                          rows={3}
                          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                          placeholder="Describe your car..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white py-3 rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
                        >
                          {isLoading ? "Updating..." : "Update Car"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white">
                        {car.title}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-white/80">
                          <span className="font-semibold">Category:</span>{" "}
                          {car.category}
                        </p>
                        <p className="text-white/80">
                          <span className="font-semibold">Type:</span>{" "}
                          {car.listingType}
                        </p>
                        <p className="text-2xl font-bold text-[#36D2D5]">
                          ${car.pricePerDay || car.salePrice || car.price}/
                          {car.listingType === "rent" ? "day" : "total"}
                        </p>
                        {car.description && (
                          <p className="text-white/80">
                            <span className="font-semibold">Description:</span>{" "}
                            {car.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {userRole === "partner" ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white py-3 rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
                          >
                            Edit Car Details
                          </button>
                        ) : userRole === "admin" ? (
                          <div className="text-center py-4">
                            <p className="text-white/70 text-sm">
                              Admin View - Car details and owner information
                            </p>
                            {car.owner && (
                              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-white/80 text-sm">
                                  <span className="font-semibold">Owner:</span>{" "}
                                  {car.owner.name}
                                </p>
                                <p className="text-white/80 text-sm">
                                  <span className="font-semibold">Email:</span>{" "}
                                  {car.owner.email}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {car.listingType === "rent" ? (
                              <button
                                onClick={() =>
                                  setShowBookingForm(!showBookingForm)
                                }
                                className="w-full bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white py-3 rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
                              >
                                {showBookingForm
                                  ? "Hide Booking Form"
                                  : "Book This Car"}
                              </button>
                            ) : (
                              <button
                                onClick={handleCreatePurchaseRequest}
                                disabled={isBooking}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                              >
                                {isBooking
                                  ? "Sending Request..."
                                  : "Send Purchase Request"}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Booking Form - Only show for customers, not admin */}
              {showBookingForm &&
                car.listingType === "rent" &&
                userRole === "customer" && (
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4">
                      Book This Car
                    </h4>
                    <form onSubmit={handleCreateBooking} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={bookingForm.startDate}
                            onChange={handleBookingInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white font-semibold mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={bookingForm.endDate}
                            onChange={handleBookingInputChange}
                            min={
                              bookingForm.startDate ||
                              new Date().toISOString().split("T")[0]
                            }
                            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      {bookingForm.totalDays > 0 && (
                        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                          <div className="flex justify-between items-center">
                            <span className="text-white">Total Days:</span>
                            <span className="text-white font-bold">
                              {bookingForm.totalDays}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Total Amount:</span>
                            <span className="text-[#36D2D5] font-bold text-xl">
                              ${bookingForm.totalAmount}
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isBooking || bookingForm.totalDays <= 0}
                        className="w-full bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white py-3 rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 disabled:opacity-50"
                      >
                        {isBooking ? "Creating Booking..." : "Confirm Booking"}
                      </button>
                    </form>
                  </div>
                )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white">Failed to load car details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
