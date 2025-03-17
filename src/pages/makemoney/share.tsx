import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Share2 } from 'lucide-react';

export default function ShareAndEarn() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center mb-6">
          <Share2 size={32} className="text-[#1AFF00] mr-3" />
          <h1 className="text-3xl font-extrabold font-heading">SHARE AND EARN</h1>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-lg mb-6">
            Share your unique link with friends and earn rewards when they make a purchase.
          </p>
          
          <div className="bg-[#EFEBDF]/10 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-heading mb-4">How it works</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Sign up for our referral program</li>
              <li>Share your unique link with friends</li>
              <li>Earn 10% commission on their first purchase</li>
              <li>Get paid monthly through your preferred payment method</li>
            </ol>
          </div>
          
          {/* Add signup form or more content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
