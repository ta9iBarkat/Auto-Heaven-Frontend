import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Verify_Email = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const handleVerification = async () => {
      try {
        if (!token) {
          setStatus("error");
          return;
        }

        // Since the backend URL already handles verification when clicked,
        // we just need to make the API call to get the user data and token
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.accessToken) {
          // Store the token
          localStorage.setItem("token", result.accessToken);

          // Store user data
          localStorage.setItem(
            "profileName",
            `${result.name} ${result.surname}`
          );
          localStorage.setItem(
            "userRole",
            result.role === "buyer"
              ? "customer"
              : result.role === "seller"
              ? "partner"
              : "admin"
          );
          localStorage.setItem(
            "userData",
            JSON.stringify({
              id: result._id,
              name: result.name,
              surname: result.surname,
              email: result.email,
              role: result.role,
            })
          );

          // Trigger navbar update
          window.dispatchEvent(new Event("profileCreated"));

          // Redirect immediately to profile
          navigate("/profile");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    handleVerification();
  }, [token, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4 sm:p-6 lg:p-8">
      {/* Background Image */}
      <img
        src="/src/assets/car-hero.png"
        alt="Car"
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none opacity-40"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(54,210,213,0.3) 50%, rgba(26,54,93,0.9) 100%)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-[#36D2D5] rounded-full opacity-10 animate-pulse z-5"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white rounded-full opacity-5 animate-bounce z-5"></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#36D2D5] rounded-full opacity-20 animate-ping z-5"></div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto">
        <div
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center gap-6 sm:gap-8 border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-2xl bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
              Email Verification
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] mx-auto rounded-full"></div>
          </div>

          {/* Status Content */}
          {status === "verifying" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto bg-white/10 rounded-full flex items-center justify-center animate-spin border-4 border-[#36D2D5]/20">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-4 border-[#36D2D5] border-t-transparent rounded-full"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  Verifying Email & Redirecting...
                </h3>
                <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto leading-relaxed">
                  Please wait while we verify your account and redirect you to
                  your profile.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500/50">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">
                  Verification Failed
                </h3>
                <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto leading-relaxed mb-6">
                  Unable to verify your email. Please try again or contact
                  support.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full max-w-xs mx-auto px-6 py-3 sm:py-4 rounded-xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {/* Branding */}
          <div className="text-center mt-6 p-4 sm:p-5 bg-white/5 rounded-xl border border-white/10 w-full">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl sm:text-3xl">🚗</span>
              <span className="text-white font-bold text-base sm:text-lg">
                Auto Heaven
              </span>
            </div>
            <p className="text-white/70 text-xs sm:text-sm">
              Premium Car Rentals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify_Email;
