import { Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Collaborate() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    organizationType: '',
    email: '',
    instagram: '',
    eventDate: '',
    estimatedQuantity: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Add state for the alternating symbol
  const [symbol, setSymbol] = useState('?');
  
  // Effect to alternate the symbol between ? and !
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbol(prev => prev === '?' ? '!' : '?');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };
  
  return (
    <>
      <div className="min-h-screen bg-[#eceae4] py-16 relative">
        <div className="container mx-auto px-4">
          {/* Back button with arrow icon */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          {/* Fancy heading */}
          <div className="mb-10 relative flex justify-center">
            <div className="relative">
              <h1 className="font-heading text-5xl md:text-7xl font-bold relative z-10 text-center">
                <span className="text-black">LET'S</span>
                <span className="text-black ml-2">COCREATE</span>
                {/* Properly display the alternating symbol */}
                <span className="text-[#1AFF00] animate-pulse ml-2">
                  {symbol}
                </span>
              </h1>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left column - Value proposition */}
            <div className="md:w-1/3">
              <div className="flex items-center mb-6">
                <Users size={32} className="text-[#1AFF00] mr-3" />
                <h2 className="text-2xl font-heading">Design Partnership</h2>
              </div>
              
              <p className="text-lg mb-6">
                We create custom apparel for clubs, events, companies, and startups. Our designs are free when you commit to ordering from us.
              </p>
              
              <div className="grid gap-6 mb-8">
                <div className="bg-[#eceae4] border border-black/10 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-heading mb-3">How It Works</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Submit your brand/event details below</li>
                    <li>Our designers create custom concepts</li>
                    <li>You approve the designs</li>
                    <li>We produce your custom products</li>
                    <li>Featured in our CoCreations collection</li>
                  </ol>
                </div>
                
                <div className="bg-[#eceae4] border border-black/10 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-heading mb-3">Perfect For</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>University clubs & organizations</li>
                    <li>Corporate events & retreats</li>
                    <li>Startups needing branded merch</li>
                    <li>Music events & festivals</li>
                    <li>Sports teams & competitions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Right column - Collaboration Form */}
            <div className="md:w-2/3">
              {submitted ? (
                <div className="bg-[#eceae4] border-2 border-[#1AFF00] p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-heading mb-4">Thank You!</h3>
                  <p className="text-lg mb-6">Your custom design request has been received! We'll reach out within 48 hours to discuss next steps for your brand's custom apparel.</p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-all"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#eceae4] border border-black/10 p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-heading mb-6">Custom Design Request</h3>
                  
                  {/* Name field */}
                  <div className="mb-5">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                      placeholder="Full Name"
                    />
                  </div>

                  {/* Organization Type */}
                  <div className="mb-5">
                    <label htmlFor="organizationType" className="block text-sm font-medium mb-1">Organization Type</label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      required
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                    >
                      <option value="">Select organization type</option>
                      <option value="university">University Club</option>
                      <option value="startup">Startup</option>
                      <option value="company">Company</option>
                      <option value="event">Event/Festival</option>
                      <option value="team">Sports Team</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  {/* Email field */}
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  {/* Instagram handle */}
                  <div className="mb-5">
                    <label htmlFor="instagram" className="block text-sm font-medium mb-1">Instagram Handle (optional)</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-3 bg-black/5 border border-r-0 border-black/20 rounded-l-md text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-white border border-black/20 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        placeholder="yourusername"
                      />
                    </div>
                  </div>
                  
                  {/* Two columns for date and quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium mb-1">Event Date/Deadline (optional)</label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="estimatedQuantity" className="block text-sm font-medium mb-1">Estimated Quantity</label>
                      <select
                        id="estimatedQuantity"
                        name="estimatedQuantity"
                        required
                        value={formData.estimatedQuantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                      >
                        <option value="">Select quantity range</option>
                        <option value="10-20">10-20 items</option>
                        <option value="21-50">21-50 items</option>
                        <option value="51-100">51-100 items</option>
                        <option value="101-200">101-200 items</option>
                        <option value="201+">201+ items</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Design Ideas & Requirements</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                      placeholder="Tell us about your organization, design ideas, and what you're looking for..."
                    ></textarea>
                  </div>
                  
                  {/* Submit button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-md bg-black text-white font-medium transition-all hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Custom Design'}
                    </button>
                    <p className="mt-3 text-xs text-center text-black/60">
                      By submitting this form, you agree to discuss a minimum order commitment with X57.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
      </div>
    </>
  );
}
