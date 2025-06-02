import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (
      formData.name &&
      formData.surname &&
      formData.email &&
      formData.password
    ) {
      // Store form data temporarily for role selection
      localStorage.setItem(
        "signupData",
        JSON.stringify({
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          password: formData.password,
          contactDetails: {
            phone: "", // Can be added later
            address: "", // Can be added later
          },
        })
      );
      localStorage.setItem(
        "profileName",
        `${formData.name} ${formData.surname}`
      );
      window.dispatchEvent(new Event("profileCreated"));
      navigate("/role");
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
          onSubmit={handleSignup}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col gap-5 border border-white/20 transform hover:scale-[1.02] transition-all duration-300 max-h-[90vh] overflow-y-auto"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
            <div className="flex flex-col items-start gap-2 w-full lg:w-2/3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-2xl bg-gradient-to-r from-white to-[#36D2D5] bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                Join{" "}
                <span className="text-[#36D2D5] font-bold">Auto Heaven</span>{" "}
                for
                <span className="text-[#36D2D5] font-bold">
                  {" "}
                  exclusive deals
                </span>
                , seamless rentals, and premium support.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 w-full lg:w-1/3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="text-2xl mb-1">🚗</div>
              <span className="text-white font-bold text-sm text-center">
                Premium Member
              </span>
              <span className="text-[#36D2D5] font-semibold text-xs">
                Auto Heaven
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">First Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">Last Name</label>
              <input
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-white font-bold text-sm">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="Create a secure password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-bold text-sm">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 focus:outline-none focus:border-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5]/20 text-white bg-white/10 backdrop-blur-sm font-medium transition-all duration-300 placeholder-white/50 hover:bg-white/15"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 rounded accent-[#36D2D5] focus:ring-2 focus:ring-[#36D2D5] mt-0.5"
              required
            />
            <label
              htmlFor="terms"
              className="text-white/90 font-medium text-sm leading-relaxed"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-[#36D2D5] hover:text-[#2bc5c8] font-bold hover:underline transition-colors"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#36D2D5] hover:text-[#2bc5c8] font-bold hover:underline transition-colors"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-8 py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-[#36D2D5] to-[#2bc5c8] hover:from-[#2bc5c8] hover:to-[#36D2D5] transition-all duration-300 shadow-2xl hover:shadow-[#36D2D5]/25 tracking-wide uppercase transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-white/20"
          >
            Create Account
          </button>

          {/* Sign In Link */}
          <div className="flex items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/80 font-medium mr-2 text-sm">
              Already have an account?
            </span>
            <a
              href="/login"
              className="text-[#36D2D5] font-bold hover:text-white transition-colors text-base hover:underline"
            >
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
