import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";
import Logo from "../assets/LOGO.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    return localStorage.getItem("profileName") || null;
  });

  React.useEffect(() => {
    const handler = () => {
      const name = localStorage.getItem("profileName");
      if (name) setUser(name);
    };
    window.addEventListener("profileCreated", handler);
    return () => window.removeEventListener("profileCreated", handler);
  }, []);

  return (
    <nav
      className="text-gray-900 shadow-2xl relative overflow-hidden backdrop-blur-lg fixed top-0 left-0 right-0 z-50"
      style={{
        background:
          "linear-gradient(180deg, rgba(240, 240, 240, 0.95) 0%, rgba(220, 220, 220, 0.95) 100%)",
        minHeight: "120px",
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent transform -skew-x-12"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#36D2D5] via-white to-[#36D2D5] animate-gradient-x"></div>

      <div className="relative w-full max-w-none flex flex-col md:flex-row items-center justify-between px-12 py-8 gap-6">
        <Link to="/" className="flex items-center gap-6 group">
          <div className="relative transform transition-all duration-700 group-hover:scale-125 group-hover:rotate-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#36D2D5] to-white rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-500 scale-150"></div>
            <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl animate-ping-slow"></div>
            <img
              src={Logo}
              alt="Auto Heaven Logo"
              className="w-12 relative z-10 drop-shadow-2xl filter brightness-110 contrast-110 group-hover:brightness-125 transition-all duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[26px] font-black tracking-wider text-gray-900 drop-shadow-2xl bg-gradient-to-r from-gray-900 via-[#36D2D5] to-gray-900 bg-clip-text text-transparent group-hover:from-[#36D2D5] group-hover:via-gray-900 group-hover:to-[#36D2D5] transition-all duration-700">
              Auto Heaven
            </span>
            <span className="text-[14px] font-bold text-gray-700 tracking-widest uppercase bg-gradient-to-r from-[#36D2D5] to-gray-900 bg-clip-text text-transparent">
              ✨ Premium Car Rentals ✨
            </span>
          </div>
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="group relative transition-all duration-500 px-4 py-2 rounded-2xl text-white font-bold text-[20px] shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
            }}
          >
            <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
              Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/about"
            className="group relative transition-all duration-500 px-4 py-2 rounded-2xl text-white font-bold text-[18px] shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
            }}
          >
            <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
              About Us
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/contact"
            className="group relative transition-all duration-500 px-4 py-2 rounded-2xl text-white font-bold text-[18px] shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
            }}
          >
            <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
              Contact Us
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-4 ml-8 px-4 py-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] rounded-2xl blur-md opacity-60"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] flex items-center justify-center text-2xl font-extrabold text-white border-4 border-white shadow-2xl rounded-2xl ring-4 ring-[#36D2D5]/40 ring-offset-2 ring-offset-white/20 animate-profile-pop group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="36"
                      height="36"
                      rx="8"
                      fill="url(#profileGradient)"
                    />
                    <text
                      x="50%"
                      y="58%"
                      textAnchor="middle"
                      fill="white"
                      fontSize="1.6rem"
                      fontWeight="bold"
                      dy=".3em"
                    >
                      {user[0]}
                    </text>
                    <defs>
                      <linearGradient
                        id="profileGradient"
                        x1="0"
                        y1="0"
                        x2="36"
                        y2="36"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#36D2D5" />
                        <stop offset="0.5" stopColor="#0a3d62" />
                        <stop offset="1" stopColor="#36D2D5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg drop-shadow-lg group-hover:text-[#36D2D5] transition-colors duration-300">
                  Welcome back,
                </span>
                <span className="text-[#36D2D5] font-extrabold text-xl drop-shadow-lg group-hover:text-white transition-colors duration-300">
                  {user}
                </span>
              </div>
            </Link>
          ) : null}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative focus:outline-none p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="relative w-8 h-8 flex flex-col justify-center items-center">
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-lg bg-black/20 border-t border-white/20">
          <div className="flex flex-col items-center gap-4 py-8 px-6">
            <Link
              to="/"
              className="group relative w-4/5 text-center transition-all duration-500 px-8 py-4 rounded-2xl text-white font-bold text-xl shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
              }}
            >
              <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
                Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/about"
              className="group relative w-4/5 text-center transition-all duration-500 px-8 py-4 rounded-2xl text-white font-bold text-xl shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
              }}
            >
              <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
                About Us
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/contact"
              className="group relative w-4/5 text-center transition-all duration-500 px-8 py-4 rounded-2xl text-white font-bold text-xl shadow-2xl border-2 border-white/30 hover:border-white hover:shadow-[0_0_30px_rgba(54,210,213,0.6)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(54,210,213,0.2) 100%)",
              }}
            >
              <span className="relative z-10 group-hover:text-[#36D2D5] transition-colors duration-300">
                Contact Us
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-[#36D2D5] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-4 mt-6 p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] rounded-2xl blur-md opacity-60"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] flex items-center justify-center text-2xl font-extrabold text-white border-4 border-white shadow-2xl rounded-2xl ring-4 ring-[#36D2D5]/40 ring-offset-2 ring-offset-white/20 animate-profile-pop group-hover:scale-110 transition-transform duration-300">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="32"
                        height="32"
                        rx="6"
                        fill="url(#mobileProfileGradient)"
                      />
                      <text
                        x="50%"
                        y="58%"
                        textAnchor="middle"
                        fill="white"
                        fontSize="1.4rem"
                        fontWeight="bold"
                        dy=".3em"
                      >
                        {user[0]}
                      </text>
                      <defs>
                        <linearGradient
                          id="mobileProfileGradient"
                          x1="0"
                          y1="0"
                          x2="32"
                          y2="32"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#36D2D5" />
                          <stop offset="0.5" stopColor="#0a3d62" />
                          <stop offset="1" stopColor="#36D2D5" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg drop-shadow-lg group-hover:text-[#36D2D5] transition-colors duration-300">
                    Welcome back,
                  </span>
                  <span className="text-[#36D2D5] font-extrabold text-xl drop-shadow-lg group-hover:text-white transition-colors duration-300">
                    {user}
                  </span>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
