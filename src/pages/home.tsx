import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="container relative min-h-[80vh] flex flex-col items-start justify-start pt-16 md:pt-20 overflow-hidden">
        {/* Text wrapper - controls overall positioning */}
        <div className="relative w-full mt-8 md:mt-6 z-10">
          {/* Mobile view: Stacked and left-aligned text */}
          <div className="flex flex-col items-start pl-4 md:hidden">
            <span className="font-heading text-4xl font-bold">STEERING_</span>
            <span className="font-playwrite italic text-[#1AFF00] text-3xl my-2 playwrite-gb-j-guides-regular-italic drop-shadow-[0_0_8px_#1AFF00]">
              Lifestyle
            </span>
            <span className="font-heading text-4xl font-bold text-black">XD</span>
          </div>
          
          {/* Desktop view: Left-aligned flowing text layout */}
          <div className="hidden md:block">
            <div className="flex flex-wrap items-start justify-start md:justify-start pl-8 lg:pl-12">
              <div className="w-full md:w-auto">
                <span className="font-heading text-7xl lg:text-9xl font-bold block text-left">
                  STEERING
                </span>
              </div>
              
              <div className="w-full md:w-auto">
                <span className="font-playwrite italic text-[#1AFF00] text-6xl lg:text-8xl playwrite-gb-j-guides-regular-italic drop-shadow-[0_0_15px_#1AFF00] block text-left">
                  Lifestyle
                </span>
              </div>
              
              <div className="w-full md:w-auto">
                <span className="font-heading text-7xl lg:text-9xl font-bold block text-left">
                  XD
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hoodie image positioned lower on page */}
        <div className="w-full max-w-2xl mx-auto mt-12 md:mt-24">
          <img 
            src="/hood.png" 
            alt="Falling hoodie 3D render" 
            className="w-full object-contain"
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
