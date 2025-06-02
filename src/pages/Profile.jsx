import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarDetailsModal from "../components/CarDetailsModal";
import CarCard from "../components/CarCard";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [profileName, setProfileName] = useState("");
  const [userRole, setUserRole] = useState("customer");
  const [userCars, setUserCars] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [userPurchaseRequests, setUserPurchaseRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  // Add car form state
  const [addCarForm, setAddCarForm] = useState({
    title: "",
    listingType: "rent",
    price: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    const storedProfileName = localStorage.getItem("profileName");
    const storedUserRole = localStorage.getItem("userRole") || "customer";
    if (!storedProfileName) {
      navigate("/login");
      return;
    }
    setProfileName(storedProfileName);
    setUserRole(storedUserRole);
  }, [navigate]);

  // Separate useEffect for loading cars when userRole changes
  useEffect(() => {
    if (userRole) {
      loadCars();
      if (userRole === "customer") {
        loadUserBookings();
        loadUserPurchaseRequests();
      }
    }
  }, [userRole]);

  const loadCars = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Determine which endpoint to use based on user role
      let endpoint;
      if (userRole === "partner") {
        endpoint = "http://localhost:5000/api/cars/my-cars";
      } else {
        // For customers, load all available cars (no auth required for this endpoint)
        endpoint = "http://localhost:5000/api/cars";
      }

      console.log(`Loading cars for ${userRole} from endpoint:`, endpoint);

      const headers = {
        "Content-Type": "application/json",
      };

      // Only add Authorization header for partner requests
      if (userRole === "partner") {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: headers,
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        if (response.status === 401 && userRole === "partner") {
          // Token expired or invalid, redirect to login
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to load cars");
      }

      if (result.success && result.data) {
        // Transform API data to match component expectations
        const transformedCars = result.data.map((car) => ({
          id: car._id,
          name: car.title,
          price: car.salePrice || car.pricePerDay || car.price || 0, // Fix price handling
          brand: car.title.split(" ")[0], // Extract brand from title
          year: new Date(car.createdAt).getFullYear(),
          image: car.images?.[0]?.url || "/src/assets/car-hero.png",
          status: car.isAvailable ? "Available" : "Rented",
          totalEarnings: 0, // Would need additional API
          bookings: 0, // Would need additional API
          currentRenter: null,
          rentalEndDate: null,
          category: car.category,
          listingType: car.listingType,
          owner: car.owner,
        }));

        setUserCars(transformedCars);
      } else {
        setUserCars([]);
      }
    } catch (err) {
      console.error("Error loading cars:", err);
      setError(err.message);

      // If it's an auth error for partners, clear storage and redirect
      if (err.message.includes("token") || err.message.includes("authorized")) {
        if (userRole === "partner") {
          localStorage.clear();
          navigate("/login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserBookings = async () => {
    if (userRole !== "customer") return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (!token || !userData.id) {
        throw new Error("No authentication token or user ID found");
      }

      console.log("Loading bookings for user:", userData.id);

      const response = await fetch(
        `http://localhost:5000/api/bookings/user/${userData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("User bookings API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to load bookings");
      }

      if (result.success && result.data) {
        // Filter out purchase requests from regular bookings
        const allBookings = result.data;
        const regularBookings = allBookings.filter(
          (booking) =>
            booking.type !== "purchase" &&
            !booking.notes?.includes("PURCHASE REQUEST") &&
            !(
              booking.duration <= 2 &&
              (booking.notes?.toLowerCase().includes("purchase") ||
                booking.notes?.toLowerCase().includes("buy"))
            )
        );
        setUserBookings(regularBookings);
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      if (err.message.includes("token") || err.message.includes("authorized")) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPurchaseRequests = async () => {
    if (userRole !== "customer") return;

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      if (!token || !userData.id) {
        return;
      }

      console.log(
        "Loading bookings (including purchase requests) for user:",
        userData.id
      );

      const response = await fetch(
        `http://localhost:5000/api/bookings/user/${userData.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("User bookings API response:", result);

      if (response.ok && result.success) {
        // Filter bookings to find purchase requests
        const allBookings = result.data || [];
        const purchaseRequests = allBookings.filter(
          (booking) =>
            booking.type === "purchase" ||
            booking.notes?.includes("PURCHASE REQUEST") ||
            // Check if it's a very short booking (likely a purchase request)
            (booking.duration <= 2 &&
              (booking.notes?.toLowerCase().includes("purchase") ||
                booking.notes?.toLowerCase().includes("buy") ||
                booking.car?.listingType === "sale"))
        );
        console.log("Filtered purchase requests:", purchaseRequests);
        setUserPurchaseRequests(purchaseRequests);

        // Also filter out purchase requests from regular bookings
        const regularBookings = allBookings.filter(
          (booking) =>
            booking.type !== "purchase" &&
            !booking.notes?.includes("PURCHASE REQUEST") &&
            !(
              booking.duration <= 2 &&
              (booking.notes?.toLowerCase().includes("purchase") ||
                booking.notes?.toLowerCase().includes("buy"))
            )
        );
        setUserBookings(regularBookings);
      } else {
        setUserPurchaseRequests([]);
      }
    } catch (err) {
      console.error("Error loading purchase requests:", err);
      setUserPurchaseRequests([]);
    }
  };

  const handleAddCarInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setAddCarForm((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setAddCarForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Verify user is a partner
      if (userRole !== "partner") {
        throw new Error("Only partners can add cars");
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", addCarForm.title);
      formData.append("listingType", addCarForm.listingType);
      formData.append("price", addCarForm.price);
      formData.append("category", addCarForm.category);

      // Add all selected images
      addCarForm.images.forEach((image) => {
        formData.append("images", image);
      });

      console.log("Sending car creation request...");

      const response = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      const result = await response.json();
      console.log("Add car API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to add car");
      }

      // Reset form and reload cars
      setAddCarForm({
        title: "",
        listingType: "rent",
        price: "",
        category: "",
        images: [],
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      await loadCars();
      setActiveTab("my-cars");
      alert("Car added successfully!");
    } catch (err) {
      console.error("Error adding car:", err);
      setError(err.message);

      // If it's an auth error, clear storage and redirect
      if (err.message.includes("token") || err.message.includes("authorized")) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Verify user is a partner
      if (userRole !== "partner") {
        throw new Error("Only partners can delete cars");
      }

      console.log("Deleting car with ID:", carId);

      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Delete car API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to delete car");
      }

      await loadCars();
      alert("Car deleted successfully!");
    } catch (err) {
      console.error("Error deleting car:", err);
      setError(err.message);

      // If it's an auth error, clear storage and redirect
      if (err.message.includes("token") || err.message.includes("authorized")) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Make API call to logout endpoint
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all local storage data
      localStorage.removeItem("profileName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      localStorage.removeItem("token");

      // Trigger navbar update
      window.dispatchEvent(new Event("profileCreated"));

      // Navigate to home page
      navigate("/");
    }
  };

  const renderMyRentals = () => {
    return (
      <div className="space-y-8">
        {/* Rental Bookings */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              🚗 My Bookings ({userBookings.length})
            </h2>
            <button
              onClick={() => setActiveTab("my-cars")}
              className="px-6 py-3 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white font-bold rounded-xl hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 transform hover:scale-105"
            >
              + Book More Cars
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D2D5] mx-auto"></div>
              <p className="text-white mt-4">Loading bookings...</p>
            </div>
          ) : userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`p-6 rounded-xl border ${
                    booking.status === "active" ||
                    booking.status === "confirmed"
                      ? "bg-blue-500/10 border-blue-500/30"
                      : booking.status === "completed"
                      ? "bg-green-500/10 border-green-500/30"
                      : booking.status === "pending"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          booking.car?.images?.[0]?.url ||
                          booking.car?.images?.[0] ||
                          "/src/assets/car-hero.png"
                        }
                        alt={booking.car?.title || "Car"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {booking.car?.title || "Unknown Car"}
                        </h4>
                        <p className="text-white/70">
                          <span className="font-semibold">📅 Duration:</span>{" "}
                          {booking.duration || "N/A"} days
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">📍 Status:</span>{" "}
                          <span className="capitalize">{booking.status}</span>
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">📅 Start:</span>{" "}
                          {booking.startDate
                            ? new Date(booking.startDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">📅 End:</span>{" "}
                          {booking.endDate
                            ? new Date(booking.endDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        {booking.car?.owner && (
                          <p className="text-white/70">
                            <span className="font-semibold">👤 Owner:</span>{" "}
                            {booking.car.owner.name} ({booking.car.owner.email})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "active" ||
                          booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                            : booking.status === "completed"
                            ? "bg-green-500/20 text-green-200 border border-green-500/30"
                            : booking.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-200 border border-red-500/30"
                        }`}
                      >
                        {booking.status === "active"
                          ? "🔵 Active"
                          : booking.status === "confirmed"
                          ? "✅ Confirmed"
                          : booking.status === "completed"
                          ? "✅ Completed"
                          : booking.status === "pending"
                          ? "⏳ Pending"
                          : "❌ Cancelled"}
                      </span>
                      <p className="text-lg font-bold text-white">
                        💰 ${booking.totalPrice || booking.totalAmount || 0}
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleCarClick(booking.car?._id)}
                          className="px-3 py-1 bg-[#36D2D5]/20 text-[#36D2D5] rounded-lg text-sm hover:bg-[#36D2D5]/30 transition-colors border border-[#36D2D5]/30 font-semibold"
                        >
                          View Details
                        </button>
                        {(booking.status === "active" ||
                          booking.status === "pending" ||
                          booking.status === "confirmed") && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-3 py-1 bg-red-500/20 text-red-200 rounded-lg text-sm hover:bg-red-500/30 transition-colors border border-red-500/30"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-white mb-4">No bookings yet</p>
              <p className="text-white/70">
                Browse our cars to start your first rental!
              </p>
              <button
                onClick={() => setActiveTab("my-cars")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white font-bold rounded-xl hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
              >
                Browse Cars
              </button>
            </div>
          )}
        </div>

        {/* Purchase Requests - Only show if there are any */}
        {userPurchaseRequests.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">
              💰 My Purchase Requests ({userPurchaseRequests.length})
            </h2>

            <div className="space-y-4">
              {userPurchaseRequests.map((request) => (
                <div
                  key={request._id}
                  className={`p-6 rounded-xl border ${
                    request.status === "pending"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : request.status === "approved"
                      ? "bg-green-500/10 border-green-500/30"
                      : request.status === "rejected"
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          request.car?.images?.[0]?.url ||
                          request.car?.images?.[0] ||
                          "/src/assets/car-hero.png"
                        }
                        alt={request.car?.title || "Car"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {request.car?.title || "Unknown Car"}
                        </h4>
                        <p className="text-white/70">
                          <span className="font-semibold">💵 Price:</span> $
                          {request.car?.salePrice || request.car?.price || 0}
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">📅 Requested:</span>{" "}
                          {new Date(
                            request.createdAt || request.startDate
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">📍 Status:</span>{" "}
                          <span className="capitalize">
                            {request.status === "confirmed"
                              ? "Approved"
                              : request.status === "cancelled"
                              ? "Rejected"
                              : request.status}
                          </span>
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">💬 Type:</span>{" "}
                          <span className="text-green-200 font-semibold">
                            Purchase Request
                          </span>
                        </p>
                        {request.car?.owner && (
                          <p className="text-white/70">
                            <span className="font-semibold">👤 Seller:</span>{" "}
                            {request.car.owner.name} ({request.car.owner.email})
                            {request.car.owner.contactDetails?.phone && (
                              <span>
                                {" "}
                                - 📞 {request.car.owner.contactDetails.phone}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          request.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                            : request.status === "approved"
                            ? "bg-green-500/20 text-green-200 border border-green-500/30"
                            : request.status === "rejected"
                            ? "bg-red-500/20 text-red-200 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                        }`}
                      >
                        {request.status === "pending"
                          ? "⏳ Pending"
                          : request.status === "approved"
                          ? "✅ Approved"
                          : request.status === "rejected"
                          ? "❌ Rejected"
                          : "📞 Contact Seller"}
                      </span>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleCarClick(request.car?._id)}
                          className="px-3 py-1 bg-[#36D2D5]/20 text-[#36D2D5] rounded-lg text-sm hover:bg-[#36D2D5]/30 transition-colors border border-[#36D2D5]/30 font-semibold"
                        >
                          View Car
                        </button>
                      </div>
                      {request.status === "confirmed" && (
                        <p className="text-green-200 text-sm mt-2 font-semibold">
                          Contact the seller to finalize purchase!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Cancelling booking:", bookingId);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Cancel booking API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to cancel booking");
      }

      if (result.success) {
        await loadUserBookings();
        alert("Booking cancelled successfully!");
      } else {
        throw new Error(result.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(err.message);
      if (err.message.includes("token") || err.message.includes("authorized")) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Add new state for partner bookings

  // Add function to load car bookings for partners
  const loadCarBookings = async (carId) => {
    if (userRole !== "partner") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Loading bookings for car:", carId);

      const response = await fetch(
        `http://localhost:5000/api/bookings/car/${carId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Car bookings API response:", result);

      if (response.ok && result.success) {
        return result.data || [];
      } else {
        console.error("Failed to load car bookings:", result.message);
        return [];
      }
    } catch (err) {
      console.error("Error loading car bookings:", err);
      return [];
    }
  };

  // Add function to update booking status for partners
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (userRole !== "partner") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating booking status:", bookingId, newStatus);

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      console.log("Update booking status API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to update booking status");
      }

      alert("Booking status updated successfully!");
      // Reload car data to show updated bookings
      await loadCars();
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError(err.message);
    }
  };

  // Add function to load car purchase requests for partners
  const loadCarPurchaseRequests = async (carId) => {
    if (userRole !== "partner") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log(
        "Loading bookings (including purchase requests) for car:",
        carId
      );

      const response = await fetch(
        `http://localhost:5000/api/bookings/car/${carId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Car bookings API response:", result);

      if (response.ok && result.success) {
        // Filter to get only purchase requests
        const allBookings = result.data || [];
        const purchaseRequests = allBookings.filter(
          (booking) =>
            booking.type === "purchase" ||
            booking.notes?.includes("PURCHASE REQUEST") ||
            (booking.duration <= 2 &&
              (booking.notes?.toLowerCase().includes("purchase") ||
                booking.notes?.toLowerCase().includes("buy") ||
                booking.car?.listingType === "sale"))
        );
        return purchaseRequests;
      } else {
        console.error("Failed to load car purchase requests:", result.message);
        return [];
      }
    } catch (err) {
      console.error("Error loading car purchase requests:", err);
      return [];
    }
  };

  // Add function to update purchase request status for partners
  const handleUpdatePurchaseRequestStatus = async (requestId, newStatus) => {
    if (userRole !== "partner") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating purchase request status:", requestId, newStatus);

      // Use the existing booking status update endpoint
      const response = await fetch(
        `http://localhost:5000/api/bookings/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      console.log("Update purchase request status API response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(
          result.message || "Failed to update purchase request status"
        );
      }

      // Map booking status to purchase request status for display
      const statusMessage =
        newStatus === "confirmed"
          ? "approved"
          : newStatus === "cancelled"
          ? "rejected"
          : newStatus;

      alert(`Purchase request ${statusMessage} successfully!`);
      // Reload car data to show updated requests
      await loadCars();
    } catch (err) {
      console.error("Error updating purchase request status:", err);
      setError(err.message);
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-black text-white mb-4 bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
          Welcome back, {profileName}!
        </h2>

        {userRole === "partner" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Cars</h3>
              <p className="text-2xl font-bold">{userCars.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
              <p className="text-2xl font-bold">
                ${userCars.reduce((sum, car) => sum + car.totalEarnings, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
              <p className="text-2xl font-bold">
                {userCars.reduce((sum, car) => sum + car.bookings, 0)}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
              <p className="text-2xl font-bold">
                {
                  userBookings.filter(
                    (b) => b.status === "active" || b.status === "confirmed"
                  ).length
                }
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
              <p className="text-2xl font-bold">
                $
                {userBookings.reduce(
                  (sum, booking) =>
                    sum + (booking.totalPrice || booking.totalAmount || 0),
                  0
                )}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
              <p className="text-2xl font-bold">
                {userBookings.length + userPurchaseRequests.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Requests Section for Partners */}
      {userRole === "partner" && (
        <PartnerPurchaseRequestsSection
          onLoadPartnerPurchaseRequests={loadPartnerPurchaseRequests}
          onUpdatePurchaseRequestStatus={handleUpdatePurchaseRequestStatus}
        />
      )}

      {/* Recent Activity - Only show for customers */}
      {userRole === "customer" && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button
              onClick={() => setActiveTab("my-cars")}
              className="px-4 py-2 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white font-semibold rounded-lg hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 text-sm"
            >
              Book New Car
            </button>
          </div>
          <div className="space-y-3">
            {userBookings.slice(0, 3).map((booking, index) => (
              <div
                key={booking._id || index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div>
                  <p className="font-semibold text-white">
                    {booking.car?.title || "Car"} - {booking.status}
                  </p>
                  <p className="text-white/70 text-sm">
                    Duration: {booking.duration || "N/A"} days - $
                    {booking.totalPrice || booking.totalAmount || 0}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === "active" ||
                    booking.status === "confirmed"
                      ? "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                      : booking.status === "completed"
                      ? "bg-green-500/20 text-green-200 border border-green-500/30"
                      : booking.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-200 border border-red-500/30"
                  }`}
                >
                  {booking.status === "active"
                    ? "Active"
                    : booking.status === "confirmed"
                    ? "Confirmed"
                    : booking.status === "completed"
                    ? "Completed"
                    : booking.status === "pending"
                    ? "Pending"
                    : "Cancelled"}
                </span>
              </div>
            ))}
            {userBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">No recent activity</p>
                <button
                  onClick={() => setActiveTab("my-cars")}
                  className="px-6 py-3 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white font-bold rounded-xl hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
                >
                  Start Your First Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderMyCars = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
          {userRole === "partner" ? "My Cars & Bookings" : "Available Cars"}
        </h2>
        {userRole === "partner" && (
          <button
            onClick={() => setActiveTab("add-car")}
            className="bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white px-4 py-2 rounded-xl font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 transform hover:scale-105"
          >
            + Add New Car
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D2D5] mx-auto"></div>
          <p className="text-white mt-4">Loading cars...</p>
        </div>
      ) : userCars.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-xl text-white mb-4">
            {userRole === "partner"
              ? "No cars listed yet"
              : "No cars available"}
          </p>
          <p className="text-white/70">
            {userRole === "partner"
              ? "Start earning by adding your first car!"
              : "Check back later for new listings!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {userCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              userRole={userRole}
              onCarClick={handleCarClick}
              onDeleteCar={handleDeleteCar}
              onLoadCarBookings={loadCarBookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onLoadCarPurchaseRequests={loadCarPurchaseRequests}
              onUpdatePurchaseRequestStatus={handleUpdatePurchaseRequestStatus}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderAddCar = () => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
      <h2 className="text-2xl font-black text-white mb-4 bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
        Add New Car
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-200 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleAddCar} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Car Title *
            </label>
            <input
              type="text"
              name="title"
              value={addCarForm.title}
              onChange={handleAddCarInputChange}
              placeholder="e.g., BMW X5 2020"
              className="w-full border border-white/20 rounded-lg px-3 py-2 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Listing Type *
            </label>
            <select
              name="listingType"
              value={addCarForm.listingType}
              onChange={handleAddCarInputChange}
              className="w-full border border-white/20 rounded-lg px-3 py-2 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-white/15 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20"
              required
            >
              <option value="rent" className="bg-gray-800">
                For Rent
              </option>
              <option value="sale" className="bg-gray-800">
                For Sale
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={addCarForm.price}
              onChange={handleAddCarInputChange}
              placeholder="150"
              min="1"
              className="w-full border border-white/20 rounded-lg px-3 py-2 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Category *
            </label>
            <select
              name="category"
              value={addCarForm.category}
              onChange={handleAddCarInputChange}
              className="w-full border border-white/20 rounded-lg px-3 py-2 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-white/15 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20"
              required
            >
              <option value="" className="bg-gray-800">
                Select Category
              </option>
              <option value="Luxury" className="bg-gray-800">
                Luxury
              </option>
              <option value="Family" className="bg-gray-800">
                Family
              </option>
              <option value="Van" className="bg-gray-800">
                Van
              </option>
              <option value="SUV" className="bg-gray-800">
                SUV
              </option>
              <option value="Sports" className="bg-gray-800">
                Sports
              </option>
              <option value="Economy" className="bg-gray-800">
                Economy
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Car Images * (1-10 images, max 10MB each)
          </label>
          <input
            type="file"
            name="images"
            onChange={handleAddCarInputChange}
            multiple
            accept="image/*"
            className="w-full border border-white/20 rounded-lg px-3 py-2 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-white/15 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20"
            required
          />
          <p className="text-white/60 text-xs mt-1">
            Selected: {addCarForm.images.length} file(s)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white font-bold py-3 rounded-xl hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 transform hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding Car..." : "Add Car"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my-cars")}
            className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "my-cars":
        return renderMyCars();
      case "add-car":
        return renderAddCar();
      case "my-rentals":
        return renderMyRentals();
      default:
        return renderHome();
    }
  };

  const handleCarClick = (carId) => {
    setSelectedCarId(carId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCarId(null);
  };

  const handleCarUpdated = () => {
    loadCars(); // Reload cars after update
  };

  // Add function to load all purchase requests for partner's cars
  const loadPartnerPurchaseRequests = async () => {
    if (userRole !== "partner") return [];

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Loading all purchase requests for partner's cars");

      // Get all partner's cars first
      const carsResponse = await fetch(
        "http://localhost:5000/api/cars/my-cars",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const carsResult = await carsResponse.json();
      if (!carsResponse.ok || !carsResult.success) {
        console.error("Failed to load partner cars");
        return [];
      }

      const partnerCars = carsResult.data || [];
      const allPurchaseRequests = [];

      // Load purchase requests for each car
      for (const car of partnerCars) {
        try {
          const bookingsResponse = await fetch(
            `http://localhost:5000/api/bookings/car/${car._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const bookingsResult = await bookingsResponse.json();
          if (bookingsResponse.ok && bookingsResult.success) {
            const carBookings = bookingsResult.data || [];
            const purchaseRequests = carBookings.filter(
              (booking) =>
                booking.type === "purchase" ||
                booking.notes?.includes("PURCHASE REQUEST") ||
                (booking.duration <= 2 &&
                  (booking.notes?.toLowerCase().includes("purchase") ||
                    booking.notes?.toLowerCase().includes("buy")))
            );

            // Add car details to each request
            purchaseRequests.forEach((request) => {
              request.car = car;
            });

            allPurchaseRequests.push(...purchaseRequests);
          }
        } catch (err) {
          console.error(`Error loading bookings for car ${car._id}:`, err);
        }
      }

      console.log("All purchase requests for partner:", allPurchaseRequests);
      return allPurchaseRequests;
    } catch (err) {
      console.error("Error loading partner purchase requests:", err);
      return [];
    }
  };

  // Add component for partner purchase requests
  const PartnerPurchaseRequestsSection = ({
    onLoadPartnerPurchaseRequests,
    onUpdatePurchaseRequestStatus,
  }) => {
    const [purchaseRequests, setPurchaseRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const loadRequests = async () => {
        setIsLoading(true);
        const requests = await onLoadPartnerPurchaseRequests();
        setPurchaseRequests(requests);
        setIsLoading(false);
      };

      if (userRole === "partner") {
        loadRequests();
      }
    }, [userRole, onLoadPartnerPurchaseRequests]);

    const handleStatusUpdate = async (requestId, newStatus) => {
      await onUpdatePurchaseRequestStatus(requestId, newStatus);
      // Reload requests after update
      const requests = await onLoadPartnerPurchaseRequests();
      setPurchaseRequests(requests);
    };

    if (purchaseRequests.length === 0) {
      return null; // Don't show section if no requests
    }

    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">
          💰 Purchase Requests ({purchaseRequests.length})
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36D2D5] mx-auto"></div>
            <p className="text-white mt-2">Loading requests...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchaseRequests.map((request) => (
              <div
                key={request._id}
                className={`p-4 rounded-xl border ${
                  request.status === "pending"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : request.status === "confirmed"
                    ? "bg-green-500/10 border-green-500/30"
                    : request.status === "cancelled"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        request.car?.images?.[0]?.url ||
                        "/src/assets/car-hero.png"
                      }
                      alt={request.car?.title || "Car"}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {request.car?.title || "Unknown Car"}
                      </h4>
                      <p className="text-white/70 text-sm">
                        <span className="font-semibold">💵 Price:</span> $
                        {request.car?.salePrice || request.car?.price || 0}
                      </p>
                      <p className="text-white/70 text-sm">
                        <span className="font-semibold">👤 Buyer:</span>{" "}
                        {request.user?.name} ({request.user?.email})
                      </p>
                      <p className="text-white/70 text-sm">
                        <span className="font-semibold">📅 Requested:</span>{" "}
                        {new Date(
                          request.createdAt || request.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-center ${
                        request.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
                          : request.status === "confirmed"
                          ? "bg-green-500/20 text-green-200 border border-green-500/30"
                          : request.status === "cancelled"
                          ? "bg-red-500/20 text-red-200 border border-red-500/30"
                          : "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                      }`}
                    >
                      {request.status === "pending"
                        ? "⏳ Pending"
                        : request.status === "confirmed"
                        ? "✅ Approved"
                        : request.status === "cancelled"
                        ? "❌ Rejected"
                        : request.status}
                    </span>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, "confirmed")
                          }
                          className="px-3 py-1 bg-green-500/20 text-green-200 rounded-lg text-sm hover:bg-green-500/30 transition-colors border border-green-500/30 font-semibold"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, "cancelled")
                          }
                          className="px-3 py-1 bg-red-500/20 text-red-200 rounded-lg text-sm hover:bg-red-500/30 transition-colors border border-red-500/30 font-semibold"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      {/* Navbar with proper spacing for sidebar */}
      <div className="ml-0 lg:ml-80">
        <Navbar />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 lg:w-32 lg:h-32 bg-[#36D2D5] rounded-full opacity-10 animate-pulse z-5"></div>
      <div className="absolute bottom-32 right-40 w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full opacity-5 animate-bounce z-5"></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 lg:w-16 lg:h-16 bg-[#36D2D5] rounded-full opacity-20 animate-ping z-5"></div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 shadow-2xl h-screen fixed left-0 top-0 bottom-0 z-[9999] bg-white/10 backdrop-blur-xl border-r border-white/20 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
          <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div className="text-center space-y-4 pt-4">
              <div className="w-20 h-20 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl ring-4 ring-white/20">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{profileName}</h2>
                <p className="text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
                  {userRole === "partner" ? "Car Seller/Owner" : "Customer"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-semibold transition-all duration-300 ${
                  activeTab === "home"
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30 scale-105"
                    : "text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                <span className="text-2xl">🏠</span>
                <span className="text-base">Home</span>
              </button>

              {userRole === "customer" && (
                <button
                  onClick={() => setActiveTab("my-rentals")}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-semibold transition-all duration-300 ${
                    activeTab === "my-rentals"
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30 scale-105"
                      : "text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <span className="text-2xl">🚙</span>
                  <span className="text-base">My Rentals</span>
                </button>
              )}

              {userRole === "partner" && (
                <>
                  <button
                    onClick={() => setActiveTab("my-cars")}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-semibold transition-all duration-300 ${
                      activeTab === "my-cars"
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30 scale-105"
                        : "text-white hover:bg-white/10 hover:scale-105"
                    }`}
                  >
                    <span className="text-2xl">🚗</span>
                    <span className="text-base">My Cars</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("add-car")}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-semibold transition-all duration-300 ${
                      activeTab === "add-car"
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30 scale-105"
                        : "text-white hover:bg-white/10 hover:scale-105"
                    }`}
                  >
                    <span className="text-2xl">➕</span>
                    <span className="text-base">Add Car</span>
                  </button>
                </>
              )}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-8 left-6 right-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-semibold text-white hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 border border-white/20 hover:border-red-500/50 hover:scale-105"
              >
                <span className="text-2xl">🚪</span>
                <span className="text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <div className="p-6 sm:p-8 lg:p-12 pt-32 lg:pt-10">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Car Details Modal */}
      <CarDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        carId={selectedCarId}
        userRole={userRole}
        onCarUpdated={handleCarUpdated}
      />
    </div>
  );
};

export default Profile;
