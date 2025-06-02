import React from 'react'

const ContactForm = () => {
  return (
    <form className="w-full max-w-lg bg-white bg-opacity-90 rounded-2xl shadow-xl p-10 flex flex-col gap-6 z-10">
      <div>
        <label className="block text-lg font-bold text-[#36D2D5] mb-2">Name</label>
        <input type="text" className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36D2D5] text-lg" placeholder="Your Name" required />
      </div>
      <div>
        <label className="block text-lg font-bold text-[#36D2D5] mb-2">Email</label>
        <input type="email" className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36D2D5] text-lg" placeholder="you@email.com" required />
      </div>
      <div>
        <label className="block text-lg font-bold text-[#36D2D5] mb-2">Message</label>
        <textarea className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36D2D5] text-lg min-h-[120px]" placeholder="Type your message..." required />
      </div>
      <button type="submit" className="mt-4 px-8 py-3 rounded-full font-bold text-white text-xl bg-[#36D2D5] hover:bg-[#0a3d62] transition duration-300 shadow-lg">Send Message</button>
    </form>
  )
}

export default ContactForm