import React from 'react'

const WhoWeAre = () => {
  return (
    <section className="w-screen flex flex-col items-center justify-center px-4 grow flex-1 min-h-0 bg-white" style={{ margin: 0, height: '100%' }}>
      <h2 className="text-6xl md:text-7xl font-extrabold text-[#222] mb-8 text-center drop-shadow-lg">Who We Are</h2>
      <p className="max-w-4xl text-center text-2xl md:text-4xl mb-16 text-[#222] font-semibold">
        At Auto Heaven, we are a passionate team dedicated to making car rental and buying easy, transparent, and enjoyable. Our professionals, offices, and active users are the heart of our community, driving us to deliver the best experience for every journey.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-20 mb-16 w-full max-w-6xl">
        {/* Professionals */}
        <div className="flex flex-col items-center bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] rounded-full shadow-2xl px-16 py-14 border-4 border-white hover:scale-110 hover:shadow-[0_8px_32px_rgba(54,210,213,0.25)] transition-transform duration-300 relative group">
          <span className="text-8xl font-extrabold text-white mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">25+</span>
          <span className="text-white text-3xl font-bold tracking-wide uppercase mt-2 group-hover:tracking-widest transition-all duration-300">Professionals</span>
          <div className="absolute -top-6 right-6 bg-white text-[#36D2D5] rounded-full px-4 py-1 text-lg font-bold shadow-md group-hover:bg-[#36D2D5] group-hover:text-white transition-all duration-300">Team</div>
        </div>
        {/* Offices */}
        <div className="flex flex-col items-center bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] rounded-full shadow-2xl px-16 py-14 border-4 border-white hover:scale-110 hover:shadow-[0_8px_32px_rgba(54,210,213,0.25)] transition-transform duration-300 relative group">
          <span className="text-8xl font-extrabold text-white mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">10</span>
          <span className="text-white text-3xl font-bold tracking-wide uppercase mt-2 group-hover:tracking-widest transition-all duration-300">Offices</span>
          <div className="absolute -top-6 right-6 bg-white text-[#36D2D5] rounded-full px-4 py-1 text-lg font-bold shadow-md group-hover:bg-[#36D2D5] group-hover:text-white transition-all duration-300">Global</div>
        </div>
        {/* Active Users */}
        <div className="flex flex-col items-center bg-gradient-to-br from-[#36D2D5] to-[#0a3d62] rounded-full shadow-2xl px-16 py-14 border-4 border-white hover:scale-110 hover:shadow-[0_8px_32px_rgba(54,210,213,0.25)] transition-transform duration-300 relative group">
          <span className="text-8xl font-extrabold text-white mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">5K+</span>
          <span className="text-white text-3xl font-bold tracking-wide uppercase mt-2 group-hover:tracking-widest transition-all duration-300">Active Users</span>
          <div className="absolute -top-6 right-6 bg-white text-[#36D2D5] rounded-full px-4 py-1 text-lg font-bold shadow-md group-hover:bg-[#36D2D5] group-hover:text-white transition-all duration-300">Live</div>
        </div>
      </div>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
        <div className="rounded-3xl p-12" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #36D2D5 100%)' }}>
          <h3 className="text-4xl font-extrabold text-white mb-6 text-center">Our Mission</h3>
          <p className="text-white text-2xl text-center">To revolutionize the car rental and buying experience by making it easy, transparent, and enjoyable for everyone. We strive to connect people with the perfect car for every journey.</p>
        </div>
        <div className="rounded-3xl p-12" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #36D2D5 100%)' }}>
          <h3 className="text-4xl font-extrabold text-white mb-6 text-center">Our Vision</h3>
          <p className="text-white text-2xl text-center">To be the leading platform for car enthusiasts and everyday drivers, known for trust, innovation, and exceptional service worldwide.</p>
        </div>
      </div>
    </section>
  )
}

export default WhoWeAre