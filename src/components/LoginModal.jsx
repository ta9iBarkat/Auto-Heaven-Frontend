import React from 'react'
import { Link } from 'react-router-dom';

const LoginModal = () => {
  return (
    <div className="fixed left-0 top-0 w-screen min-h-[900px] flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #36D2D5 100%)', margin: 0, padding: 0, zIndex: 1 }}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      {/* Slogan */}
      <h2 className="text-6xl md:text-7xl font-extrabold mb-16 text-white text-center drop-shadow-2xl z-10 mt-40 tracking-wider w-full max-w-5xl">
        Find It, Drive It & Love It
      </h2>
      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-12 mb-32 z-10 w-full justify-center">
        <Link
          to="/signup"
          className="px-20 py-6 rounded-full font-bold text-white text-3xl shadow-2xl transition duration-300 border-2 border-white text-center flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,225,229,1)' }}
          onMouseEnter={e => {e.target.style.backgroundColor = 'white'; e.target.style.color = 'rgba(0,225,229,1)';}}
          onMouseLeave={e => {e.target.style.backgroundColor = 'rgba(0,225,229,1)'; e.target.style.color = 'white';}}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="px-20 py-6 rounded-full font-bold text-white text-3xl shadow-2xl transition duration-300 border-2 border-white text-center flex items-center justify-center"
          style={{ backgroundColor: '#0a3d62' }}
          onMouseEnter={e => {e.target.style.backgroundColor = 'white'; e.target.style.color = '#0a3d62';}}
          onMouseLeave={e => {e.target.style.backgroundColor = '#0a3d62'; e.target.style.color = 'white';}}
        >
          Login
        </Link>
      </div>
      {/* Image */}
      <img
        src="/src/assets/car-hero.png"
        alt="Car Hero"
        className="absolute left-0 bottom-0 w-screen h-full object-cover z-0 opacity-80"
        style={{ minHeight: '900px' }}
      />
    </div>
  )
}

export default LoginModal