import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Check } from 'lucide-react';

export default function CollaborateForm2() {
  // Retrieve data from sessionStorage
  const savedFormData = JSON.parse(sessionStorage.getItem('formData') || '{}');

  const [formData, setFormData] = useState({
    ...savedFormData,
    apparelType: [],
    sizesNeeded: '',
    colorPreferences: '',
    designDescription: '',
    file: null
  });

  const [symbol, setSymbol] = useState('?');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Effect for alternating symbol
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

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        apparelType: [...(Array.isArray(prev.apparelType) ? prev.apparelType : []), value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        apparelType: Array.isArray(prev.apparelType) 
          ? prev.apparelType.filter(item => item !== value)
          : []
      }));
    }
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#eceae4] py-16 relative">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/makemoney/collaborate/page1" 
          className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Step 1</span>
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

        {submitted ? (
          <div className="max-w-2xl mx-auto bg-[#eceae4] border-2 border-[#1AFF00] p-8 rounded-lg text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-[#1AFF00]/20 w-16 h-16 flex items-center justify-center">
                <Check size={28} className="text-[#1AFF00]" />
              </div>
            </div>
            <h3 className="text-2xl font-heading mb-4">Thank You!</h3>
            <p className="text-lg mb-6">
              Your custom design request has been received! We'll reach out within 48 hours to discuss next steps for your brand's custom apparel.
            </p>
            <Link 
              to="/" 
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-all inline-block"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-10">
            {/* Left Column: Summary */}
            <div className="md:w-1/3">
              <div className="mb-6">
                <h2 className="text-2xl font-heading mb-3">Step 2: Product Details</h2>
                <p className="text-lg">
                  Tell us about your design preferences and product requirements.
                </p>
              </div>
              
              {Object.keys(savedFormData).length > 0 && (
                <div className="bg-[#eceae4] border border-black/10 p-6 rounded-lg shadow-sm mb-6">
                  <h3 className="text-xl font-heading mb-3">Your Info</h3>
                  <div className="space-y-2 text-sm">
                    {savedFormData.organizationName && (
                      <p><span className="font-medium">Organization:</span> {savedFormData.organizationName}</p>
                    )}
                    {savedFormData.contactPersonName && (
                      <p><span className="font-medium">Contact:</span> {savedFormData.contactPersonName}</p>
                    )}
                    {savedFormData.email && (
                      <p><span className="font-medium">Email:</span> {savedFormData.email}</p>
                    )}
                    {savedFormData.eventDate && (
                      <p><span className="font-medium">Event Date:</span> {savedFormData.eventDate}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Form */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit} className="bg-[#eceae4] border border-black/10 p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-heading mb-6">Product Specifications</h3>

                {/* Apparel Type (Checkboxes) */}
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1">Type of Apparel</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["T-Shirts", "Hoodies", "Jerseys", "Jackets", "Caps", "Others"].map((item) => (
                      <label key={item} className="inline-flex items-center space-x-2 bg-white/70 border border-black/10 rounded-md px-3 py-2 hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          name="apparelType"
                          value={item}
                          onChange={handleCheckboxChange}
                          checked={Array.isArray(formData.apparelType) && formData.apparelType.includes(item)}
                          className="border-black/20 rounded focus:ring-[#1AFF00]"
                        />
                        <span className="ml-2">{item}</span>
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
                    className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
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
                    className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                    placeholder="Enter color preferences"
                  />
                </div>
                
                {/* Design description */}
                <div className="mb-5">
                  <label htmlFor="designDescription" className="block text-sm font-medium mb-1">Design Description</label>
                  <textarea
                    id="designDescription"
                    name="designDescription"
                    value={formData.designDescription}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                    placeholder="Describe your design ideas, themes, or specific elements you'd like included"
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="mb-5">
                  <label htmlFor="file" className="block text-sm font-medium mb-1">Upload Design References</label>
                  <div className="border-2 border-dashed border-black/20 rounded-lg p-4 text-center hover:border-[#1AFF00]/50 transition-colors">
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                      <Upload size={24} className="mb-2 text-black/60" />
                      <span className="text-sm text-black/60">Click to upload or drag and drop</span>
                      <span className="text-xs text-black/40 mt-1">PNG, JPG, PDF (max 10MB)</span>
                    </label>
                    {formData.file && (
                      <div className="mt-3 text-sm text-black/80 bg-[#1AFF00]/10 p-2 rounded">
                        {(formData.file as File).name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-md bg-black text-white font-medium transition-all hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
