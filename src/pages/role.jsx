import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roleData = {
    customer: {
      title: "Customer Experience",
      description:
        "Join thousands of satisfied customers who trust Auto Heaven for their car rental needs. Enjoy premium vehicles, competitive prices, and exceptional service with our easy-to-use platform.",
      features: [
        "Wide selection of premium cars",
        "24/7 customer support",
        "Flexible rental periods",
        "Instant booking confirmation",
      ],
    },
    partner: {
      title: "Car Seller/Owner",
      description:
        "Become a car owner on Auto Heaven and start earning money by renting out your vehicles. Manage your car listings, track rental status, and maximize your income with our easy-to-use seller platform.",
      features: [
        "List unlimited cars",
        "Real-time rental tracking",
        "Automated payment processing",
        "Seller dashboard & analytics",
      ],
    },
  };

  const handleRoleSelection = async (role) => {
    setIsLoading(true);
    setError("");

    try {
      // Get signup data from localStorage
      const signupData = localStorage.getItem("signupData");
      if (!signupData) {
        throw new Error("No signup data found. Please sign up first.");
      }

      const userData = JSON.parse(signupData);

      // Map role to backend format
      const roleMapping = {
        customer: "buyer",
        partner: "seller",
      };

      const registrationData = {
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: userData.password,
        contactDetails: userData.contactDetails,
        role: roleMapping[role],
      };

      console.log("Sending registration request with data:", registrationData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      console.log("Registration API response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // Store temporary role for after email verification
      localStorage.setItem("pendingUserRole", role);

      // Clean up signup data
      localStorage.removeItem("signupData");

      // Show success message and redirect to email check
      alert(
        `Registration successful! Please check your email (${userData.email}) for verification link.`
      );
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center lg:justify-end relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4 sm:p-6 lg:p-8">
      {/* Background Image */}
      <img
        src="/src/assets/car-hero.png"
        alt="Car"
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none opacity-50"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(54,210,213,0.4) 50%, rgba(26,54,93,0.9) 100%)",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-[#36D2D5] rounded-full opacity-10 animate-pulse z-5"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full opacity-5 animate-bounce z-5"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-[#36D2D5] rounded-full opacity-20 animate-ping z-5"></div>

      <div className="relative z-20 w-full max-w-md sm:max-w-lg lg:max-w-3xl">
        <div
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4 border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-2xl bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
              Choose Your Role
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] mx-auto rounded-full"></div>
          </div>

          {/* Dynamic Role Image */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/20 transition-all duration-500 hover:scale-110">
              {selectedRole === "customer" ? (
                <img
                  src="/src/assets/istockphoto-1146425090-612x612-removebg-preview.png"
                  alt="Customer"
                  className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
                />
              ) : (
                <img
                  src="/src/assets/af78be849332d991e4b409d20ee1cb6f-removebg-preview.png"
                  alt="Handshake"
                  className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
                />
              )}
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="text-center space-y-2 transition-all duration-500 ease-in-out">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {roleData[selectedRole].title}
            </h3>
            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed px-2 min-h-[60px] flex items-center justify-center">
              {roleData[selectedRole].description}
            </p>
          </div>

          {/* Features List */}
          <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="text-white font-bold text-sm mb-3 text-center">
              Key Features:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roleData[selectedRole].features.map((feature, index) => (
                <li
                  key={index}
                  className="text-white/80 text-xs sm:text-sm flex items-center gap-2 p-2 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-[#36D2D5] text-sm font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Role Selection Buttons */}
          <div className="space-y-3">
            <button
              className={`w-full px-4 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl border-2 transform hover:scale-105 ${
                selectedRole === "customer"
                  ? "bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] text-white border-transparent shadow-[#36D2D5]/25 scale-105"
                  : "bg-white/10 text-white border-white/30 hover:bg-[#36D2D5] hover:border-[#36D2D5]"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onMouseEnter={() => !isLoading && setSelectedRole("customer")}
              onClick={() => !isLoading && handleRoleSelection("customer")}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">🚗</span>
                <span>
                  {isLoading && selectedRole === "customer"
                    ? "Creating Account..."
                    : "Customer - Rent Premium Cars"}
                </span>
              </div>
            </button>

            <button
              className={`w-full px-4 py-3 sm:py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl border-2 transform hover:scale-105 ${
                selectedRole === "partner"
                  ? "bg-gradient-to-r from-[#0a3d62] to-[#1e5f8b] text-white border-transparent shadow-[#0a3d62]/25 scale-105"
                  : "bg-white/10 text-white border-white/30 hover:bg-[#0a3d62] hover:border-[#0a3d62]"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onMouseEnter={() => !isLoading && setSelectedRole("partner")}
              onClick={() => !isLoading && handleRoleSelection("partner")}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">🤝</span>
                <span>
                  {isLoading && selectedRole === "partner"
                    ? "Creating Account..."
                    : "Partner - Rent Out Your Cars"}
                </span>
              </div>
            </button>
          </div>

          {/* Bottom Info */}
          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/70 text-xs">
              You can change your role anytime in your profile settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
