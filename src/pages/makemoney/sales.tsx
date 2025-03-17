import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Briefcase } from 'lucide-react';

export default function SalesExecutive() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center mb-6">
          <Briefcase size={32} className="text-[#1AFF00] mr-3" />
          <h1 className="text-3xl font-extrabold font-heading">BECOME AN X57 SALES EXECUTIVE</h1>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-lg mb-6">
            Join our sales team and represent the X57 brand while earning competitive commissions.
          </p>
          
          <div className="bg-[#EFEBDF]/10 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-heading mb-4">Benefits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Flexible work hours</li>
              <li>Commission-based earnings with no upper limit</li>
              <li>Product discounts and monthly allowance</li>
              <li>Professional training and support</li>
              <li>Opportunity for career growth</li>
            </ul>
          </div>
          
          {/* Add application form or more content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
