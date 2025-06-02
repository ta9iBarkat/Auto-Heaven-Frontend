import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CarDetailsModal from "../components/CarDetailsModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [activeSection, setActiveSection] = useState("bookings");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/");
      return;
    }
    loadAllData();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [allBookings, filterStatus, filterType]);

  const loadAllData = async () => {
    await Promise.all([loadAllBookings(), loadAllUsers(), loadAllCars()]);
  };

  const loadAllBookings = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to load bookings");
      }

      if (result.success) {
        setAllBookings(result.data || []);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Loading all users...");

      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Users API Response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        throw new Error(result.message || "Failed to load users");
      }

      // Handle different response structures
      let users = [];
      if (result.success && result.data) {
        users = result.data;
      } else if (Array.isArray(result)) {
        users = result;
      } else if (result.users) {
        users = result.users;
      }

      console.log("Processed users:", users);
      setAllUsers(users);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(`Failed to load users: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllCars = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/cars", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load cars");
      }

      if (result.success) {
        setAllCars(result.data || []);
      }
    } catch (err) {
      console.error("Error loading cars:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      await loadAllUsers();
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user role");
      }

      await loadAllUsers();
      alert("User role updated successfully!");
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(err.message);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete car");
      }

      await loadAllCars();
      alert("Car deleted successfully!");
    } catch (err) {
      console.error("Error deleting car:", err);
      setError(err.message);
    }
  };

  const applyFilters = () => {
    let filtered = [...allBookings];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((booking) => booking.status === filterStatus);
    }

    // Filter by type (rental vs purchase)
    if (filterType === "rental") {
      filtered = filtered.filter(
        (booking) =>
          booking.type !== "purchase" &&
          !booking.notes?.includes("PURCHASE REQUEST")
      );
    } else if (filterType === "purchase") {
      filtered = filtered.filter(
        (booking) =>
          booking.type === "purchase" ||
          booking.notes?.includes("PURCHASE REQUEST")
      );
    }

    setFilteredBookings(filtered);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

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

      if (!response.ok) {
        throw new Error(result.message || "Failed to update booking status");
      }

      // Update local state
      setAllBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      alert("Booking status updated successfully!");
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
      case "confirmed":
      case "active":
        return "bg-green-500/20 text-green-200 border-green-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-200 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/30";
    }
  };

  const getBookingType = (booking) => {
    if (
      booking.type === "purchase" ||
      booking.notes?.includes("PURCHASE REQUEST")
    ) {
      return "Purchase Request";
    }
    return "Rental Booking";
  };

  const renderUserManagement = () => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            User Management ({allUsers.length} users)
          </h2>
          <button
            onClick={loadAllUsers}
            className="px-4 py-2 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
          >
            Refresh Users
          </button>
        </div>

        {allUsers.length > 0 ? (
          <div className="space-y-4">
            {allUsers.map((user) => {
              const adminCount = allUsers.filter(
                (u) => u.role === "admin"
              ).length;
              const isLastAdmin = user.role === "admin" && adminCount === 1;

              return (
                <div
                  key={user._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">
                            {user.name} {user.surname}
                          </h4>
                          <p className="text-white/70 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                        <p className="text-white/70">
                          <span className="font-semibold">Role:</span>{" "}
                          <span
                            className={`capitalize ${
                              user.role === "admin"
                                ? "text-red-300"
                                : user.role === "seller"
                                ? "text-blue-300"
                                : "text-green-300"
                            }`}
                          >
                            {user.role === "buyer" ? "customer" : user.role}
                          </span>
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={
                              user.isEmailVerified
                                ? "text-green-300"
                                : "text-yellow-300"
                            }
                          >
                            {user.isEmailVerified ? "Verified" : "Pending"}
                          </span>
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Joined:</span>{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        onChange={(e) => {
                          if (isLastAdmin) {
                            alert(
                              "Cannot change role: At least one admin must remain in the system."
                            );
                            return;
                          }
                          if (
                            confirm(
                              `Are you sure you want to change ${user.name}'s role from ${user.role} to ${e.target.value}?`
                            )
                          ) {
                            handleUpdateUserRole(user._id, e.target.value);
                          }
                        }}
                        className="px-3 py-2 rounded border bg-white/10 border-white/20 text-white text-sm"
                        title={
                          isLastAdmin
                            ? "Cannot change role of the last admin"
                            : ""
                        }
                      >
                        <option value="buyer" className="bg-gray-800">
                          Customer
                        </option>
                        <option value="seller" className="bg-gray-800">
                          Partner
                        </option>
                        <option value="admin" className="bg-gray-800">
                          Admin
                        </option>
                      </select>
                      <button
                        onClick={() => {
                          if (isLastAdmin) {
                            alert(
                              "Cannot delete: At least one admin must remain in the system."
                            );
                            return;
                          }
                          handleDeleteUser(user._id);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-200 rounded text-sm hover:bg-red-500/30 transition-colors border border-red-500/30"
                        disabled={isLastAdmin}
                        title={
                          isLastAdmin ? "Cannot delete the last admin" : ""
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {isLastAdmin && (
                    <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-200 text-xs">
                        ⚠️ This is the last admin account. Role cannot be
                        changed or deleted to maintain system access.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-white mb-4">No users found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCarManagement = () => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Car Management ({allCars.length} cars)
          </h2>
          <button
            onClick={loadAllCars}
            className="px-4 py-2 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
          >
            Refresh Cars
          </button>
        </div>

        {allCars.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allCars.map((car) => (
              <div
                key={car._id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={car.images?.[0]?.url || "/src/assets/car-hero.png"}
                    alt={car.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-white truncate">
                        {car.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          car.listingType === "sale"
                            ? "bg-green-500/20 text-green-200 border border-green-500/30"
                            : "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                        }`}
                      >
                        {car.listingType === "sale" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <p className="text-white/70">
                        <span className="font-semibold">Price:</span> $
                        {car.salePrice || car.pricePerDay || 0}
                        {car.listingType === "rent" ? "/day" : ""}
                      </p>
                      <p className="text-white/70">
                        <span className="font-semibold">Category:</span>{" "}
                        {car.category}
                      </p>
                      <p className="text-white/70">
                        <span className="font-semibold">Owner:</span>{" "}
                        {car.owner?.name}
                      </p>
                      <p className="text-white/70">
                        <span className="font-semibold">Status:</span>{" "}
                        <span
                          className={
                            car.isAvailable ? "text-green-300" : "text-red-300"
                          }
                        >
                          {car.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCarClick(car._id)}
                        className="px-3 py-1 bg-[#36D2D5]/20 text-[#36D2D5] rounded text-sm hover:bg-[#36D2D5]/30 transition-colors border border-[#36D2D5]/30"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-200 rounded text-sm hover:bg-red-500/30 transition-colors border border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-xl text-white mb-4">No cars found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBookingManagement = () => (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-white font-semibold mb-2">
              Filter by Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              <option value="all" className="bg-gray-800">
                All Statuses
              </option>
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
          <div>
            <label className="block text-white font-semibold mb-2">
              Filter by Type:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              <option value="all" className="bg-gray-800">
                All Types
              </option>
              <option value="rental" className="bg-gray-800">
                Rental Bookings
              </option>
              <option value="purchase" className="bg-gray-800">
                Purchase Requests
              </option>
            </select>
          </div>
          <div className="ml-auto">
            <button
              onClick={loadAllBookings}
              className="px-4 py-2 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white rounded-lg font-semibold hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            All Bookings ({filteredBookings.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D2D5] mx-auto"></div>
              <p className="text-white mt-4">Loading bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-white truncate">
                          {booking.car?.title || "Unknown Car"}
                        </h4>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                          {getBookingType(booking)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <p className="text-white/70">
                          <span className="font-semibold">Customer:</span>{" "}
                          {booking.user?.name || "Unknown"}
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Email:</span>{" "}
                          {booking.user?.email || "N/A"}
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Duration:</span>{" "}
                          {booking.duration || "N/A"} days
                        </p>
                        <p className="text-white/70">
                          <span className="font-semibold">Amount:</span> $
                          {booking.totalPrice || 0}
                        </p>
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleUpdateBookingStatus(booking._id, e.target.value)
                        }
                        className={`px-3 py-2 rounded border text-sm font-semibold ${getStatusColor(
                          booking.status
                        )} bg-transparent`}
                      >
                        <option
                          value="pending"
                          className="bg-gray-800 text-white"
                        >
                          Pending
                        </option>
                        <option
                          value="confirmed"
                          className="bg-gray-800 text-white"
                        >
                          Confirmed
                        </option>
                        <option
                          value="active"
                          className="bg-gray-800 text-white"
                        >
                          Active
                        </option>
                        <option
                          value="completed"
                          className="bg-gray-800 text-white"
                        >
                          Completed
                        </option>
                        <option
                          value="cancelled"
                          className="bg-gray-800 text-white"
                        >
                          Cancelled
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-white mb-4">No bookings found</p>
              <p className="text-white/70">
                No bookings match the current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Add car click handler for modal
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);

  const handleCarClick = (carId) => {
    setSelectedCarId(carId);
    setIsCarModalOpen(true);
  };

  const handleCarModalClose = () => {
    setIsCarModalOpen(false);
    setSelectedCarId(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "bookings":
        return renderBookingManagement();
      case "users":
        return renderUserManagement();
      case "cars":
        return renderCarManagement();
      default:
        return renderBookingManagement();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      <Navbar />

      <div className="pt-32 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-white/70">
              Manage all bookings, users, and cars in the system
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveSection("bookings")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeSection === "bookings"
                    ? "bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                📋 Bookings ({allBookings.length})
              </button>
              <button
                onClick={() => setActiveSection("users")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeSection === "users"
                    ? "bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                👥 Users ({allUsers.length})
              </button>
              <button
                onClick={() => setActiveSection("cars")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeSection === "cars"
                    ? "bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                🚗 Cars ({allCars.length})
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold">{allBookings.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{allUsers.length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Cars</h3>
              <p className="text-3xl font-bold">{allCars.length}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Pending Actions</h3>
              <p className="text-3xl font-bold">
                {allBookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg mb-6">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </div>

      {/* Car Details Modal */}
      {isCarModalOpen && (
        <CarDetailsModal
          isOpen={isCarModalOpen}
          onClose={handleCarModalClose}
          carId={selectedCarId}
          userRole="admin"
          onCarUpdated={loadAllCars}
        />
      )}
    </div>
  );
};

export default Dashboard;
