import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log("Sending login request with data:", loginData);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log("Login API response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store authentication data - use accessToken and store as token
      if (result.accessToken) {
        localStorage.setItem("token", result.accessToken);
        console.log("Auth token stored:", result.accessToken);
      }

      // Store user data - API returns user data directly in result
      if (result.name) {
        localStorage.setItem("profileName", `${result.name} ${result.surname}`);
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

        console.log("User data stored:", {
          id: result._id,
          name: result.name,
          surname: result.surname,
          email: result.email,
          role: result.role,
        });

        window.dispatchEvent(new Event("profileCreated"));

        // Navigate based on user role
        if (result.role === "buyer") {
          navigate("/");
        } else if (result.role === "seller") {
          navigate("/profile");
        } else if (result.role === "admin") {
          navigate("/dashboard"); // Fixed typo: was "/dashbaord"
        } else {
          navigate("/");
        }
      } else {
        // Fallback navigation
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
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

      <div className="relative z-20 w-full max-w-md sm:max-w-lg lg:max-w-2xl">
        <form
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col gap-6 border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-start gap-3 w-full lg:w-2/3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-2xl bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                Sign in to access{" "}
                <span className="text-[#36D2D5] font-bold">
                  exclusive car deals
                </span>
                , manage your rentals, and enjoy premium support.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 w-full lg:w-1/3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-2xl mb-1">🚗</div>
              <span className="text-white font-bold text-sm text-center">
                Auto Heaven
              </span>
              <span className="text-[#36D2D5] font-semibold text-xs">
                Member Login
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded accent-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]"
              />
              <label
                htmlFor="remember"
                className="text-white/90 font-medium text-sm"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-[#36D2D5] hover:text-[#2bc5c8] font-bold hover:underline text-sm transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 px-8 py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 shadow-2xl hover:shadow-[#36D2D5]/25 tracking-wide uppercase transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-white/20 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Sign Up Link */}
          <div className="flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/80 font-medium mr-2 text-sm">
              Don't have an account?
            </span>
            <a
              href="/signup"
              className="text-[#36D2D5] font-bold hover:text-white transition-colors text-base hover:underline"
            >
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
