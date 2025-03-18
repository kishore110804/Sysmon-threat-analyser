
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Users } from 'lucide-react';

export default function Collaborate() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center mb-6">
          <Users size={32} className="text-[#1AFF00] mr-3" />
          <h1 className="text-3xl font-extrabold font-heading">COLLABORATION? WE ARE IN</h1>
        </div>
        
        <div className="max-w-3xl">
          <p className="text-lg mb-6">
            Partner with X57 on creative projects, influencer marketing, or brand collaborations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#EFEBDF]/10 p-6 rounded-lg">
              <h2 className="text-xl font-heading mb-3">For Creators</h2>
              <p>Showcase our products to your audience and earn competitive commissions.</p>
            </div>
            
            <div className="bg-[#EFEBDF]/10 p-6 rounded-lg">
              <h2 className="text-xl font-heading mb-3">For Brands</h2>
              <p>Partner with us on co-branded products and cross-promotional opportunities.</p>
            </div>
          </div>
          
          {/* Add contact form or more content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
