import React, { useState, useEffect } from "react";
import CarDetailsModal from "./CarDetailsModal";

const CarList = () => {
  const [filters, setFilters] = useState({
    brand: "",
    transmission: "",
    type: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [selectedCar, _setSelectedCar] = useState(null);
  const [showCarCard, setShowCarCard] = useState(false);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("customer");

  // Modal state for new system
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const cardGray = "rgba(245, 245, 245, 0.95)";

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "customer";
    setUserRole(role);
    loadCars();
  }, []);

  const loadCars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cars");
      const result = await response.json();

      if (result.success && result.data) {
        setCars(result.data);
      }
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    return (
      (!filters.brand ||
        car.title?.toLowerCase().includes(filters.brand.toLowerCase())) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.type || car.category === filters.type)
    );
  });

  const handleChooseCar = (car) => {
    // Use new modal system
    setSelectedCarId(car._id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCarId(null);
  };

  const handleCarUpdated = () => {
    loadCars(); // Reload cars after any updates
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    alert("Your message has been sent to the dealer!");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleReservation = () => {
    console.log("Reservation started for:", selectedCar.name);
    alert(`Reservation request sent for ${selectedCar.name}!`);
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="w-screen flex flex-col md:flex-row gap-12"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #36D2D5 100%)",
        minHeight: "100vh",
        padding: "3rem 0",
        margin: 0,
        position: "relative",
        left: 0,
      }}
    >
      {/* Filters Section */}
      <div
        className="w-full md:w-1/4 rounded-3xl shadow-2xl p-12 mb-6 md:mb-0 flex flex-col items-center"
        style={{ background: cardGray, minHeight: "500px" }}
      >
        <h3 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-wide">
          Filter Cars
        </h3>
        <div className="w-full mb-6">
          <label className="block mb-3 font-semibold text-lg text-gray-700">
            Brand
          </label>
          <select
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={filters.brand}
            onChange={(e) =>
              setFilters((f) => ({ ...f, brand: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="Toyota">Toyota</option>
            <option value="BMW">BMW</option>
            <option value="Honda">Honda</option>
          </select>
        </div>
        <div className="w-full mb-6">
          <label className="block mb-3 font-semibold text-lg text-gray-700">
            Transmission
          </label>
          <select
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={filters.transmission}
            onChange={(e) =>
              setFilters((f) => ({ ...f, transmission: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div className="w-full mb-6">
          <label className="block mb-3 font-semibold text-lg text-gray-700">
            Car Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="Luxury">Luxury</option>
            <option value="Family">Family</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
            <option value="Sports">Sports</option>
            <option value="Economy">Economy</option>
          </select>
        </div>
      </div>

      {/* Cars List Section */}
      <div className="w-full md:w-3/4 flex flex-col gap-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D2D5] mx-auto"></div>
            <p className="text-white mt-4">Loading cars...</p>
          </div>
        ) : filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car._id}
              className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="relative h-[400px] overflow-hidden">
                <img
                  src={car.images?.[0]?.url || "/src/assets/car-hero.png"}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6 bg-[#36D2D5] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  ${car.pricePerDay || car.salePrice || car.price || 0}/
                  {car.listingType === "rent" ? "day" : "total"}
                </div>
                <div className="absolute top-6 left-6 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full font-semibold text-lg">
                  {car.listingType === "rent" ? "🚗 Rental" : "💰 For Sale"}
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-3xl font-extrabold mb-2 text-gray-800">
                      {car.title}
                    </h4>
                    <p className="text-xl text-gray-600 font-semibold">
                      {car.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">Owner</p>
                    <p className="text-xl font-bold text-[#0a3d62]">
                      {car.owner?.name || "Auto Heaven"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 font-semibold">
                      Category
                    </p>
                    <p className="text-lg font-bold text-[#0a3d62]">
                      {car.category}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 font-semibold">Type</p>
                    <p className="text-lg font-bold text-[#0a3d62]">
                      {car.listingType}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 font-semibold">
                      Status
                    </p>
                    <p className="text-lg font-bold text-[#0a3d62]">
                      {car.isAvailable ? "Available" : "Rented"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 font-semibold">
                      Images
                    </p>
                    <p className="text-lg font-bold text-[#0a3d62]">
                      {car.images?.length || 0}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {car.description ||
                    "Experience comfort and reliability with this premium vehicle. Perfect for business trips and family outings."}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">📍</span>
                    <span className="text-lg text-gray-700">
                      Available Citywide
                    </span>
                  </div>
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-[#36D2D5] to-[#0a3d62] text-white font-bold text-xl rounded-2xl hover:from-[#2ab8bb] hover:to-[#083349] transition-all duration-300 transform hover:scale-105 shadow-xl"
                    onClick={() => handleChooseCar(car)}
                  >
                    {car.listingType === "rent" ? "Book Now" : "View Details"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <p className="text-xl text-white mb-4">No cars found</p>
            <p className="text-white/70">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Car Details Modal */}
      <CarDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        carId={selectedCarId}
        userRole={userRole}
        onCarUpdated={handleCarUpdated}
      />

      {/* Legacy Modal (keeping for backward compatibility) */}
      {showCarCard && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-[#36D2D5] to-[#0a3d62] p-6 rounded-t-3xl">
              <button
                onClick={() => setShowCarCard(false)}
                className="absolute top-6 right-6 text-white hover:text-gray-300 text-3xl font-bold transition-colors"
              >
                ×
              </button>
              <h2 className="text-4xl font-extrabold text-white pr-12">
                {selectedCar.name}
              </h2>
              <p className="text-xl text-white font-semibold opacity-90">
                {selectedCar.category || "Premium Vehicle"}
              </p>
            </div>

            {/* Car Image */}
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                className="h-full max-w-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Main Content - Two White Cards */}
            <div className="flex flex-col xl:flex-row gap-8 p-8">
              {/* Left Card - Vehicle Info & Description */}
              <div className="xl:w-1/2 bg-white rounded-2xl shadow-xl p-8">
                {/* Price & Location */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-extrabold text-[#0a3d62]">
                      ${selectedCar.price}/day
                    </span>
                    <span className="bg-[#36D2D5] text-white px-4 py-2 rounded-full font-semibold">
                      📍 {selectedCar.location || "Available Citywide"}
                    </span>
                  </div>
                </div>

                {/* Vehicle Info Grid */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Vehicle Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Brand
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.brand}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Year
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.year || "2023"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Transmission
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.transmission}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Fuel Type
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.fuelType || "Gasoline"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Seats
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.seats || "5"} Passengers
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 font-semibold">
                        Type
                      </p>
                      <p className="text-lg font-bold text-black">
                        {selectedCar.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Overview
                  </h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                      {selectedCar.description ||
                        "Experience premium comfort and reliability with this exceptional vehicle. Perfect for both business and leisure travel."}
                    </p>
                    <p className="text-lg">
                      This vehicle features modern amenities, excellent safety
                      ratings, and outstanding fuel efficiency. Whether you're
                      planning a weekend getaway or need reliable transportation
                      for business meetings, this car delivers exceptional
                      performance and comfort.
                    </p>
                    <p className="text-lg">
                      All our vehicles undergo thorough inspection and
                      maintenance to ensure your safety and satisfaction. Book
                      now and enjoy a seamless rental experience with 24/7
                      customer support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Card - Reservation & Contact */}
              <div className="xl:w-1/2 bg-white rounded-2xl shadow-xl p-8">
                {/* Seller Info & Rating */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Rental Provider
                  </h3>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-6">
                    <div>
                      <p className="text-xl font-bold text-black">
                        {selectedCar.sellerName || selectedCar.owner}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-lg font-bold text-[#0a3d62] ml-2">
                          {selectedCar.rating}
                        </span>
                        <span className="text-gray-600 ml-2">
                          (125+ reviews)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Response time</p>
                      <p className="font-bold text-[#36D2D5]">Within 1 hour</p>
                    </div>
                  </div>
                </div>

                {/* Reservation Button */}
                <div className="mb-8">
                  <button
                    onClick={handleReservation}
                    className="w-full bg-gradient-to-r from-[#36D2D5] to-[#0a3d62] text-white font-extrabold text-2xl py-6 rounded-2xl hover:from-[#2ab8bb] hover:to-[#083349] transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    🚗 Reserve Now
                  </button>
                  <p className="text-center text-gray-600 mt-3 text-sm">
                    Instant confirmation • Free cancellation up to 24h
                  </p>
                </div>

                {/* Contact Dealer Form */}
                <div>
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Contact Dealer
                  </h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#36D2D5] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#36D2D5] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#36D2D5] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Ask about availability, special requests, or any questions..."
                        rows="4"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#36D2D5] focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0a3d62] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#083349] transition-colors duration-300"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
