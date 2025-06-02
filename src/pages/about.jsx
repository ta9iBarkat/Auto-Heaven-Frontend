import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';
import AboutUs from '../components/AboutUs';
import WhoWeAre from '../components/WhoWeAre';


export default function About() {
  return (
    <>
      <Navbar />
      <AboutUs />
      <main className="flex mb-10 mt-4 flex-col items-center justify-center w-full min-h-screen bg-transparent">
        <WhoWeAre />
      </main>
      <Footer />
    </>
  );
}