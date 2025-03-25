import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import { useFirebase } from '@/providers/firebase-provider';
import Navbar from '@/components/navbar';

// Define form data type
type FormData = {
  productCategories: string[];
  designStyles: string[];
  tools3d: string[];
  otherTools: string;
  portfolioLinks: string;
  experienceLevel: string;
  designStatement: string;
  contactEmail: string;
  files: File[];
};

// Define options for different categories
const PRODUCT_CATEGORIES = [
  { value: 'hood-fits', label: 'Hood Fits (Hoodies)' },
  { value: 'ez-tees', label: 'EZ-Tees (T-shirts)' },
  { value: 'mini-moves', label: 'Mini Moves' },
  { value: 'swag-loops', label: 'Swag Loops' },
  { value: 'caps-vault', label: 'Caps Vault' },
  { value: 'flow-pants', label: 'Flow Pants' },
  { value: 'other', label: 'Other' }
];

const DESIGN_STYLES = [
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'typography', label: 'Typography' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'vintage', label: 'Vintage/Retro' },
  { value: 'other', label: 'Other' }
];

const TOOLS_3D = [
  { value: 'clo3d', label: 'CLO3D' },
  { value: 'marvelous-designer', label: 'Marvelous Designer' },
  { value: 'blender', label: 'Blender' },
  { value: '3ds-max', label: '3ds Max' },
  { value: 'cinema4d', label: 'Cinema 4D' },
  { value: 'none', label: 'I don\'t use 3D tools' }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'experienced', label: 'Experienced (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' }
];

export default function DesignerApplication() {
  const { currentUser, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    productCategories: [],
    designStyles: [],
    tools3d: [],
    otherTools: '',
    portfolioLinks: '',
    experienceLevel: '',
    designStatement: '',
    contactEmail: '',
    files: []
  });
  
  // UI states
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  
  // Redirect to auth if not signed in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/auth', { state: { returnUrl: '/designer/apply' } });
    } else if (currentUser) {
      // Pre-fill email from current user
      setFormData(prev => ({ ...prev, contactEmail: currentUser.email || '' }));
    }
  }, [currentUser, authLoading, navigate]);
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'productCategories' | 'designStyles' | 'tools3d'>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(item => item !== value)
      }));
    }
  };
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    // Check file types and sizes
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/svg+xml'];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      if (validTypes.includes(file.type) && file.size <= maxSize) {
        validFiles.push(file);
      } else {
        setError(`File "${file.name}" rejected. Please upload images (JPG, PNG, GIF, SVG) or PDFs under 10MB.`);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };
  
  // Remove a file from the selection
  const removeFile = (index: number) => {
    const newFiles = [...formData.files];
    newFiles.splice(index, 1);
    setFormData(prev => ({ ...prev, files: newFiles }));
  };
  
  // Next step handler
  const handleNextStep = () => {
    // Validate current step
    if (formStep === 1) {
      if (formData.productCategories.length === 0) {
        setError('Please select at least one product category');
        return;
      }
      if (formData.designStyles.length === 0) {
        setError('Please select at least one design style');
        return;
      }
    } else if (formStep === 2) {
      if (!formData.experienceLevel) {
        setError('Please select your experience level');
        return;
      }
      if (!formData.designStatement || formData.designStatement.length < 50) {
        setError('Please provide a design statement (minimum 50 characters)');
        return;
      }
      if (!formData.contactEmail) {
        setError('Please provide your contact email');
        return;
      }
    }
    
    setError(null);
    setFormStep(prev => prev + 1);
  };
  
  // Previous step handler
  const handlePrevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };
  
  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (formData.files.length === 0) {
      setError('Please upload at least one design sample');
      return;
    }
    
    setError(null);
    setSubmitting(true);
    
    try {
      // Check if the user is authenticated
      if (!currentUser || !currentUser.uid) {
        throw new Error('You must be signed in to submit an application');
      }
      
      // 1. First create application document
      const applicationData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        productCategories: formData.productCategories,
        designStyles: formData.designStyles,
        tools3d: formData.tools3d,
        otherTools: formData.otherTools,
        portfolioLinks: formData.portfolioLinks,
        experienceLevel: formData.experienceLevel,
        designStatement: formData.designStatement,
        contactEmail: formData.contactEmail,
        fileUrls: [],
        submittedAt: serverTimestamp(),
        status: 'pending_review'
      };
      
      console.log('Creating application document...');
      // Add to designer applications collection
      const applicationRef = await addDoc(collection(firestore, 'designerApplications'), applicationData);
      console.log('Application document created with ID:', applicationRef.id);
      
      // 2. Upload files and get URLs
      const fileUrls: string[] = [];
      
      for (let i = 0; i < formData.files.length; i++) {
        const file = formData.files[i];
        const fileRef = ref(storage, `designer-applications/${currentUser.uid}/${applicationRef.id}/${file.name}`);
        
        // Upload file
        setFileUploadProgress(Math.round((i / formData.files.length) * 80)); // 0-80% for upload progress
        console.log(`Uploading file ${i+1} of ${formData.files.length}: ${file.name}...`);
        
        try {
          await uploadBytes(fileRef, file);
          console.log(`Uploaded file ${i+1} successfully.`);
          
          // Get download URL
          const downloadUrl = await getDownloadURL(fileRef);
          fileUrls.push(downloadUrl);
          console.log(`Got download URL for file ${i+1}`);
        } catch (uploadError) {
          console.error(`Error uploading file ${i+1}:`, uploadError);
          throw new Error(`Failed to upload file "${file.name}". Please check the file and try again.`);
        }
      }
      
      setFileUploadProgress(90); // 90% after files are uploaded
      
      // 3. Update application with file URLs
      console.log('Updating application with file URLs...');
      await updateDoc(doc(firestore, 'designerApplications', applicationRef.id), {
        fileUrls
      });
      
      // 4. Update user's designerVerification status
      console.log('Updating user profile with verification status...');
      await updateDoc(doc(firestore, 'users', currentUser.uid), {
        'designerVerification.status': 'pending',
        'designerVerification.applicationId': applicationRef.id,
        'designerVerification.appliedAt': serverTimestamp()
      });
      
      setFileUploadProgress(100);
      setSuccess(true);
      console.log('Application submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      
      // More detailed error messages based on the specific error
      let errorMessage = 'Failed to submit application. Please try again later.';
      
      if (err.code === 'permission-denied') {
        errorMessage = 'Access denied. Please ensure you are signed in and try again.';
      } else if (err.code === 'storage/unauthorized') {
        errorMessage = 'File upload failed due to permission issues. Please try again with smaller or different file types.';
      } else if (err.code === 'storage/invalid-format') {
        errorMessage = 'One or more files have an invalid format. Please use JPG, PNG, GIF, SVG or PDF files only.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state while checking auth
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#eceae4] flex items-center justify-center">
          <div className="animate-pulse text-lg">Loading...</div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#eceae4] py-16 px-4 relative">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Profile</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-black to-black/80 text-white p-8">
              <h1 className="font-heading text-3xl font-bold mb-2">Designer Application</h1>
              <p className="text-white/70">
                Submit your portfolio and join our community of designers. Get verified to earn commissions on your designs.
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="px-8 pt-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step {formStep} of 3</span>
                <span className="text-sm font-medium">{Math.floor((formStep / 3) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#1AFF00] h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(formStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Success state */}
            {success ? (
              <div className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1AFF00]/20 mb-4">
                    <CheckCircle className="h-8 w-8 text-[#1AFF00]" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading mb-2">Application Submitted!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for applying to become a verified designer. Our team will review your application within 7-10 business days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/profile" 
                      className="px-6 py-2 bg-black text-white rounded hover:bg-black/80 transition-all"
                    >
                      Return to Profile
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                    {error}
                  </div>
                )}
                
                {/* Step 1: Product Categories & Design Styles */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    {/* Product Categories */}
                    <fieldset>
                      <legend className="text-xl font-heading font-bold mb-4">What product categories do you want to design for?</legend>
                      <p className="text-gray-600 mb-4">Select all that apply</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {PRODUCT_CATEGORIES.map(category => (
                          <label 
                            key={category.value}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input 
                              type="checkbox"
                              value={category.value}
                              checked={formData.productCategories.includes(category.value)}
                              onChange={e => handleCheckboxChange(e, 'productCategories')}
                              className="h-4 w-4 text-[#1AFF00] focus:ring-[#1AFF00] rounded"
                            />
                            <span className="ml-3">{category.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    
                    {/* Design Styles */}
                    <fieldset>
                      <legend className="text-xl font-heading font-bold mb-4">What design styles are you experienced with?</legend>
                      <p className="text-gray-600 mb-4">Select all that apply</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {DESIGN_STYLES.map(style => (
                          <label 
                            key={style.value}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input 
                              type="checkbox"
                              value={style.value}
                              checked={formData.designStyles.includes(style.value)}
                              onChange={e => handleCheckboxChange(e, 'designStyles')}
                              className="h-4 w-4 text-[#1AFF00] focus:ring-[#1AFF00] rounded"
                            />
                            <span className="ml-3">{style.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
                
                {/* Step 2: Tools & Experience */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    {/* 3D Tools Experience */}
                    <fieldset>
                      <legend className="text-xl font-heading font-bold mb-4">Do you have experience with 3D design tools?</legend>
                      <p className="text-gray-600 mb-4">
                        Knowledge of 3D tools is a plus, but not required. Select all that you're familiar with.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {TOOLS_3D.map(tool => (
                          <label 
                            key={tool.value}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input 
                              type="checkbox"
                              value={tool.value}
                              checked={formData.tools3d.includes(tool.value)}
                              onChange={e => handleCheckboxChange(e, 'tools3d')}
                              className="h-4 w-4 text-[#1AFF00] focus:ring-[#1AFF00] rounded"
                            />
                            <span className="ml-3">{tool.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    
                    {/* Other Design Tools */}
                    <div>
                      <label className="block text-xl font-heading font-bold mb-2">
                        What other design tools do you use?
                      </label>
                      <p className="text-gray-600 mb-4">
                        E.g., Photoshop, Illustrator, Figma, etc.
                      </p>
                      <input
                        type="text"
                        name="otherTools"
                        value={formData.otherTools}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        placeholder="Photoshop, Illustrator, Procreate..."
                      />
                    </div>
                    
                    {/* Experience Level */}
                    <div>
                      <label className="block text-xl font-heading font-bold mb-2">
                        How much experience do you have as a designer?
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        required
                      >
                        <option value="">Select your experience level</option>
                        {EXPERIENCE_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Design Statement */}
                    <div>
                      <label className="block text-xl font-heading font-bold mb-2">
                        Tell us about your design approach and style
                      </label>
                      <textarea
                        name="designStatement"
                        value={formData.designStatement}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        placeholder="Describe your design style, approach, and what inspires you..."
                        required
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">
                        Minimum 50 characters. {formData.designStatement.length}/50 characters
                      </p>
                    </div>
                    
                    {/* Contact Email */}
                    <div>
                      <label className="block text-xl font-heading font-bold mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        placeholder="your@email.com"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        We'll use this email to contact you about your application
                      </p>
                    </div>
                    
                    {/* Portfolio Links */}
                    <div>
                      <label className="block text-xl font-heading font-bold mb-2">
                        Portfolio Links (Optional)
                      </label>
                      <input
                        type="text"
                        name="portfolioLinks"
                        value={formData.portfolioLinks}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1AFF00]/50"
                        placeholder="behance.net/username, dribbble.com/username"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Add links to your portfolio or social profiles (Behance, Dribbble, Instagram, etc.)
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Design Uploads */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-heading font-bold mb-2">
                        Upload Your Design Samples
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Please upload 3-5 examples of your best work. We accept JPG, PNG, GIF, SVG and PDF files (max 10MB each).
                      </p>
                      
                      {/* File Upload Area */}
                      <label className="block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1AFF00]/50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          multiple
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,application/pdf,image/svg+xml"
                        />
                        <div className="flex flex-col items-center h-full justify-center">
                          <UploadCloud size={32} className="mb-2 text-gray-400" />
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                          <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, SVG, PDF (max 10MB)</span>
                        </div>
                      </label>
                      
                      {/* File Preview */}
                      {formData.files.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-medium text-lg mb-2">Selected Files ({formData.files.length})</h3>
                          <ul className="space-y-2">
                            {formData.files.map((file, index) => (
                              <li key={`${file.name}-${index}`} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center">
                                  <span className="mr-3 text-sm text-gray-500">{index + 1}.</span>
                                  <span className="text-sm font-medium truncate max-w-[250px]">{file.name}</span>
                                  <span className="ml-2 text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <XCircle size={18} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Submit disclaimer */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        By submitting this application, you confirm that all designs are your original work and that you have the rights to submit them. You also agree to our terms and conditions regarding designer collaborations and commissions.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-all"
                      disabled={submitting}
                    >
                      Back
                    </button>
                  ) : (
                    <div></div> // Empty div for spacing
                  )}
                  
                  {formStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-black text-white rounded hover:bg-black/80 transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#1AFF00] text-black font-medium rounded hover:bg-[#1AFF00]/80 transition-all flex items-center"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          {fileUploadProgress < 100 ? `Uploading... ${fileUploadProgress}%` : 'Processing...'}
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
