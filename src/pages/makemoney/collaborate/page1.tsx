import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

export default function CollaborateForm1() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPersonName: '',
    instagramHandle: '',
    email: '',
    phoneNumber: '',
    eventName: '',
    eventDate: '',
    urgencyLevel: ''
  });

  const [symbol, setSymbol] = useState('?');
  const navigate = useNavigate();

  // Effect for alternating symbol
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbol(prev => prev === '?' ? '!' : '?');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Next button
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('formData', JSON.stringify(formData)); // Save data to session storage
    navigate('/makemoney/collaborate/page2'); // Navigate to Page 2
  };

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 relative">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </Link>
        
        {/* Flickering Heading */}
        <div className="mb-10 relative flex justify-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold relative z-10 text-center">
            <span className="text-black">LET'S</span>
            <span className="text-black ml-2">COCREATE</span>
            <span className="text-[#1AFF00] animate-pulse ml-2">
              {symbol}
            </span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left column: Value Proposition */}
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

          {/* Right column: Form */}
          <div className="md:w-2/3">
            <form onSubmit={handleNext} className="bg-[#eceae4] border border-black/10 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-heading mb-6">Custom Design Request</h3>

              {/* Organization/Team Name */}
              <div className="mb-5">
                <label htmlFor="organizationName" className="block text-sm font-medium mb-1">Organization/Team Name</label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>

              {/* Contact Person Name */}
              <div className="mb-5">
                <label htmlFor="contactPersonName" className="block text-sm font-medium mb-1">Contact Person Name</label>
                <input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  required
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>

              {/* Instagram Handle */}
              <div className="mb-5">
                <label htmlFor="instagramHandle" className="block text-sm font-medium mb-1">Instagram Handle (optional)</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-3 bg-black/5 border border-r-0 border-black/20 rounded-l-md text-gray-600">@</span>
                  <input 
                    type="text" 
                    id="instagramHandle" 
                    name="instagramHandle" 
                    value={formData.instagramHandle} 
                    onChange={handleChange} 
                    className="flex-1 px-4 py-3 bg-white border border-black/20 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50" 
                    placeholder="yourusername"
                  />
                </div>
              </div>

              {/* Email Address */}
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
                />
              </div>

              {/* Phone Number */}
              <div className="mb-5">
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number (optional)</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>

              {/* Event Name */}
              <div className="mb-5">
                <label htmlFor="eventName" className="block text-sm font-medium mb-1">Event/Project Name</label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>

              {/* Event Date */}
              <div className="mb-5">
                <label htmlFor="eventDate" className="block text-sm font-medium mb-1">Event Date</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                />
              </div>

              {/* Urgency Level */}
              <div className="mb-5">
                <label htmlFor="urgencyLevel" className="block text-sm font-medium mb-1">Urgency Level</label>
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  required
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50">
                  <option value="">Select urgency level</option>
                  <option value="normal">Normal</option>
                  <option value="priority">Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-black text-white font-medium transition-all hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
