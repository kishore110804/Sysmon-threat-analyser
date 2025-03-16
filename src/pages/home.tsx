import React from 'react';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="container flex flex-col items-start md:items-center gap-6 pb-8 pt-16 md:pt-20">
        {/* Main heading with responsive layout */}
        <div className="flex flex-col items-start md:items-center w-full">
          {/* Mobile view: Stacked and left-aligned text */}
          <div className="flex flex-col md:hidden mt-8 pl-2">
            <span className="font-heading text-3xl font-bold">STEERING</span>
            <span className="font-playwrite italic text-[#1AFF00] text-2xl my-2 playwrite-gb-j-guides-regular-italic">Lifestyle</span>
            <span className="font-heading text-3xl font-bold text-black">XD</span>
          </div>
          
          {/* Desktop view: Horizontal layout with centered text */}
          <h1 className="hidden md:flex md:text-9xl font-heading font-bold text-center mb-8 whitespace-nowrap overflow-hidden w-[calc(100vw-2rem)] mx-4 md:w-[calc(100vw-4rem)] md:mx-8 gap-2">
            <span className="font-heading">STEERING</span>
            <span className="font-playwrite italic text-[#1AFF00] playwrite-gb-j-guides-regular-italic">Lifestyle</span>
            <span className="font-heading text-black">XD</span>
          </h1>
        </div>
        
        {/* Centered hoodie image - hidden on mobile */}
        <div className="hidden md:block relative w-full max-w-2xl mx-auto">
          <img 
            src="/hood.png" 
            alt="Falling hoodie 3D render" 
            className="w-full object-contain"
          />
        </div>
        
        <div className="flex max-w-[980px] flex-col items-start md:items-center gap-2 mt-6">
          {/* Optional additional content */}
        </div>
      </section>
    </>
  );
}
