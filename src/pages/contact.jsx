import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'

const Contact = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-white relative overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row items-stretch justify-center w-full h-full relative min-h-[900px]">
        {/* Left: Chat with our team */}
        <div className="flex-1 flex flex-col justify-center items-center p-10 z-10 bg-transparent">
          <h2 className="text-6xl font-extrabold text-white mb-8 text-center">Chat with Us</h2>
          <p className="text-3xl text-white text-center max-w-2xl">We're here to help you with any questions or requests. Reach out and our team will get back to you as soon as possible!</p>
        </div>
        {/* Right: Contact Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-10 z-10">
          <div className="w-full max-w-2xl">
            <ContactForm />
          </div>
        </div>
        {/* Background Image */}
        <img src="/src/assets/startup-jobs-for-students-1110x600.jpg" alt="Contact" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" style={{ filter: 'brightness(0.7) blur(1.5px) saturate(1.2)', height: '100%' }} />
      </div>
      <Footer />
    </div>
  )
}

export default Contact