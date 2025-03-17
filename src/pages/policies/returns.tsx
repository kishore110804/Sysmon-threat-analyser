import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ReturnPolicy() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-extrabold font-heading mb-6">Return Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. Return Eligibility</h2>
          <p>Items can be returned within 30 days of receiving your order.</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. Return Process</h2>
          <p>To initiate a return, please contact our customer service team.</p>
          
          {/* Add more return policy content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
