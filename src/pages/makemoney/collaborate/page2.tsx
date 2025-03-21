import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CollaborateForm2() {
  // Retrieve data from sessionStorage
  const savedFormData = JSON.parse(sessionStorage.getItem('formData') || '{}');
  console.log('Form Data on Page 2:', savedFormData); // For debugging

  const [formData, setFormData] = useState({
    ...savedFormData,
    apparelType: '',
    sizesNeeded: '',
    colorPreferences: '',
    designDescription: '',
    file: null
  });

  const [symbol, setSymbol] = useState('?');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to alternate the symbol between ? and !
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbol(prev => prev === '?' ? '!' : '?');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Your request has been submitted!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 relative">
      <div className="container mx-auto px-4">
        {/* Back Button */}
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
          {/* Left Column: Value Proposition */}
          <div className="md:w-1/3">
            <div className="flex items-center mb-6">
              <span className="text-[#1AFF00] mr-3">👥</span>
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

          {/* Right Column: Form */}
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-heading mb-6">Custom Design Request</h3>

          {/* Apparel Type (Checkboxes) */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Type of Apparel</label>
            <div className="flex flex-wrap gap-4"> {/* Use flexbox with gap */}
              {["T-Shirts", "Hoodies", "Jerseys", "Jackets", "Others"].map((item) => (
                <label key={item} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="apparelType"
                    value={item}
                    checked={formData.apparelType.includes(item)} // Multiple selections
                    onChange={handleChange}
                    className="mr-2" // Margin-right for spacing between checkbox and text
                  />
                  <span className="ml-2">{item}</span> {/* margin-left for text */}
                </label>
              ))}
            </div>
          </div>





              {/* Sizes Needed */}
              <div className="mb-5">
                <label htmlFor="sizesNeeded" className="block text-sm font-medium mb-1">Sizes Needed</label>
                <input
                  type="text"
                  id="sizesNeeded"
                  name="sizesNeeded"
                  value={formData.sizesNeeded}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md"
                  placeholder="Enter sizes like S, M, L, XL"
                />
              </div>

            {/* Color Preferences */}
            <div className="mb-5">
              <label htmlFor="colorPreferences" className="block text-sm font-medium mb-1">Color Preferences (optional)</label>
              <input
                type="text"
                id="colorPreferences"
                name="colorPreferences"
                value={formData.colorPreferences}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-black/20 rounded-md"
                placeholder="Enter color preferences"
              />
            </div>



              {/* File Upload */}
              <div className="mb-5">
                <label htmlFor="file" className="block text-sm font-medium mb-1">Upload Design References</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-black/20 rounded-md"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-black/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
