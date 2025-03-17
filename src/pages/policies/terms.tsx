import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-extrabold font-heading mb-6">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>Welcome to X57. By accessing or using our website, you agree to these Terms of Service.</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Use of Services</h2>
          <p>When using our services, you agree to follow all applicable laws and regulations.</p>
          
          {/* Add more terms content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
