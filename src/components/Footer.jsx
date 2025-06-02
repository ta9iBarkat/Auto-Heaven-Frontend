import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../assets/LOGO.png';

const Footer = () => {
  return (
    <footer className="w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(10,61,98,0.95) 0%, rgba(54,210,213,0.9) 50%, rgba(0,0,0,0.85) 100%)', color: 'white', padding: '3.5rem 0 2rem 0' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="relative w-full flex flex-col md:flex-row items-start justify-between px-12 gap-16 mx-0">
        {/* Enhanced Brand & Slogan with Logo */}
        <div className="flex flex-col gap-6 md:w-1/3">
          <div className="flex items-center gap-4">
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl"></div>
              <img 
                src={Logo} 
                alt="Auto Heaven Logo" 
                className="w-16 h-16 relative z-10 drop-shadow-2xl filter brightness-110 contrast-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl md:text-5xl font-black tracking-wide text-white drop-shadow-2xl bg-gradient-to-r from-white via-[#36D2D5] to-white bg-clip-text text-transparent">Auto Heaven</span>
              <span className="text-sm font-medium text-white/80 tracking-widest uppercase">Premium Car Rentals</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-white drop-shadow-lg">Find It, Drive It & Love It</p>
          <p className="text-lg text-white/90 max-w-md leading-relaxed">Your trusted partner for finding the perfect car. Experience comfort, safety, and style with every drive.</p>
        </div>
        {/* Navigation */}
        <div className="flex flex-col gap-4 md:w-1/6 mt-8 md:mt-0">
          <span className="text-2xl font-bold mb-2 text-white">Quick Links</span>
          <Link to="/" className="hover:underline hover:text-[#36D2D5] transition text-lg">Home</Link>
          <Link to="/about" className="hover:underline hover:text-[#36D2D5] transition text-lg">About Us</Link>
          <Link to="/contact" className="hover:underline hover:text-[#36D2D5] transition text-lg">Contact Us</Link>
          <a href="#cars" className="hover:underline hover:text-[#36D2D5] transition text-lg">Browse Cars</a>
        </div>
        {/* Contact & Social */}
        <div className="flex flex-col gap-4 md:w-1/4 mt-8 md:mt-0">
          <span className="text-2xl font-bold mb-2 text-white">Contact</span>
          <span className="text-lg">Email: <a href="mailto:info@autoheaven.com" className="underline hover:text-[#36D2D5]">info@autoheaven.com</a></span>
          <span className="text-lg">Phone: <a href="tel:+1234567890" className="underline hover:text-[#36D2D5]">+1 234 567 890</a></span>
          <span className="text-lg">Location: 123 Heaven St, Dream City</span>
          <div className="flex gap-6 mt-2">
            <a href="#" aria-label="Instagram" className="hover:text-[#36D2D5] text-3xl"><svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5a6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5zm6.25 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"></path></svg></a>
            <a href="#" aria-label="Facebook" className="hover:text-[#36D2D5] text-3xl"><svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.006 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89c1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17.006 22 12"></path></svg></a>
            <a href="#" aria-label="Twitter" className="hover:text-[#36D2D5] text-3xl"><svg fill="currentColor" viewBox="0 0 24 24" width="1em" height="1em"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37a8.59 8.59 0 0 1-2.72 1.04a4.28 4.28 0 0 0-7.29 3.9A12.13 12.13 0 0 1 3.11 4.9a4.28 4.28 0 0 0 1.32 5.71a4.24 4.24 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.19a4.3 4.3 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2c0-.19-.01-.39-.02-.58A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"></path></svg></a>
          </div>
        </div>
        {/* Newsletter */}
        <div className="flex flex-col gap-4 md:w-1/4 mt-8 md:mt-0 mr-10">
          <span className="text-2xl font-bold mb-2 text-white">Newsletter</span>
          <p className="text-white/80 text-lg">Subscribe to get the latest car deals and news!</p>
          <form className="flex gap-3 mt-2">
            <input type="email" placeholder="Your email" className="rounded-full px-6 py-3 text-gray-800 text-lg focus:outline-none" style={{ background: 'white' }} />
            <button type="submit" className="rounded-full px-8 py-3 font-bold text-white text-lg transition" style={{ backgroundColor: '#36D2D5' }}
              onMouseEnter={e => {e.target.style.backgroundColor = 'white'; e.target.style.color = '#36D2D5';}}
              onMouseLeave={e => {e.target.style.backgroundColor = '#36D2D5'; e.target.style.color = 'white';}}
            >Subscribe</button>
          </form>
        </div>
      </div>
      <div className="w-full text-center text-white/70 text-lg mt-12">
        &copy; {new Date().getFullYear()} Auto Heaven. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer