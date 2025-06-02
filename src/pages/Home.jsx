import Navbar from '../components/Navbar';
import CarList from '../components/CarList';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import React from 'react';

export default function Home() {
  return (
    <>
      <Navbar />
      <LoginModal />
      <main className="flex-grow container ">
        <CarList />
      </main>
      <Footer />
    </>
  );
}