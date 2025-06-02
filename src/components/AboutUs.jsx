import React from 'react'
import aboutImage from '../assets/image0_0 (2).jpg'

const AboutUs = () => {
  return (
    <section className="w-screen py-20 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, #36D2D5 100%)', margin: 0 }}>
      <h1 className="text-5xl font-extrabold text-white mb-16 text-center drop-shadow-lg">About Us</h1>
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <p className="text-white text-lg md:text-2xl leading-relaxed">
            Welcome to <span className="font-bold text-[#36D2D5]">Auto Heaven</span>!<br/>
            We are dedicated to helping you find, drive, and love your perfect car. Our platform connects you with top-rated vehicles, trusted owners, and the best deals in town. Experience comfort, safety, and style with every drive.<br/><br/>
            <span className="font-semibold">Our mission:</span> To make car renting and buying easy, transparent, and enjoyable for everyone.
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <img 
            src={aboutImage} 
            alt="Auto Heaven Team" 
            className="w-full max-w-lg rounded-xl shadow-2xl border-4 border-[#36D2D5] hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutUs