import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';
import { 
  PackagePlus, Search, Image, UploadCloud, PlusCircle, 
  X, CheckCircle, ChevronDown, User, DollarSign 
} from 'lucide-react';

type ProductCategory = 
  'hood-fits' | 
  'ez-tees' | 
  'mini-moves' | 
  'swag-loops' | 
  'caps-vault' | 
  'flow-pants' |
  'other';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  category: ProductCategory;
  tags: string[];
  colors: {[key: string]: {name: string, hex: string}};
  sizes: string[];
  images: File[];
  designerId: string;
  designId: string;
  resellerId: string;
  stock: number;
  designerCommission: number;
  resellerCommission: number;
  featuredDesign: boolean;
  isLimited: boolean;
  limitedQuantity?: number;
}

// Dropdown data
const PRODUCT_CATEGORIES = [
  { value: 'hood-fits', label: 'Hood Fits (Hoodies)' },
  { value: 'ez-tees', label: 'EZ-Tees (T-shirts)' },
  { value: 'mini-moves', label: 'Mini Moves' },
  { value: 'swag-loops', label: 'Swag Loops' },
  { value: 'caps-vault', label: 'Caps Vault' },
  { value: 'flow-pants', label: 'Flow Pants' },
  { value: 'other', label: 'Other' }
];

const PRODUCT_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'
];

const DEFAULT_COLORS = {
  black: {name: 'Black', hex: '#000000'},
  white: {name: 'White', hex: '#FFFFFF'},
  gray: {name: 'Gray', hex: '#808080'}
};

export default function NewProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: 'hood-fits',
    tags: [],
    colors: DEFAULT_COLORS,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [],
    designerId: '',
    designId: '',
    resellerId: '',
    stock: 100,
    designerCommission: 15, // Default 15%
    resellerCommission: 10, // Default 10%
    featuredDesign: false,
    isLimited: false,
    limitedQuantity: 0
  });
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Search states
  const [designerSearchQuery, setDesignerSearchQuery] = useState('');
  const [designerSearchResults, setDesignerSearchResults] = useState<any[]>([]);
  const [designerSearchLoading, setDesignerSearchLoading] = useState(false);
  const [showDesignerDropdown, setShowDesignerDropdown] = useState(false);
  
  const [resellerSearchQuery, setResellerSearchQuery] = useState('');
  const [resellerSearchResults, setResellerSearchResults] = useState<any[]>([]);
  const [resellerSearchLoading, setResellerSearchLoading] = useState(false);
  const [showResellerDropdown, setShowResellerDropdown] = useState(false);
  
  const [selectedDesigner, setSelectedDesigner] = useState<any>(null);
  const [selectedReseller, setSelectedReseller] = useState<any>(null);
  const [designerDesigns, setDesignerDesigns] = useState<any[]>([]);
  
  // Handle text/number inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle size selection
  const handleSizeToggle = (size: string) => {
    setFormData(prev => {
      const newSizes = [...prev.sizes];
      if (newSizes.includes(size)) {
        return {
          ...prev,
          sizes: newSizes.filter(s => s !== size)
        };
      } else {
        return {
          ...prev,
          sizes: [...newSizes, size]
        };
      }
    });
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };
  
  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle designer search
  useEffect(() => {
    if (!designerSearchQuery.trim()) {
      setDesignerSearchResults([]);
      return;
    }
    
    const searchDesigners = async () => {
      setDesignerSearchLoading(true);
      try {
        // Query for users with verified designer status matching search
        const designersQuery = query(
          collection(firestore, 'users'),
          where('designerVerification.status', '==', 'verified')
        );
        
        const querySnapshot = await getDocs(designersQuery);
        const allDesigners = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Filter client-side (Firestore doesn't support OR searches well)
        const filteredDesigners = allDesigners.filter(designer => {
          const fullName = `${designer.firstName || ''} ${designer.lastName || ''}`.toLowerCase();
          const query = designerSearchQuery.toLowerCase();
          
          return fullName.includes(query) || 
                 (designer.email && designer.email.toLowerCase().includes(query));
        });
        
        setDesignerSearchResults(filteredDesigners.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error('Error searching designers:', error);
      } finally {
        setDesignerSearchLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(searchDesigners, 300);
    return () => clearTimeout(debounceTimeout);
  }, [designerSearchQuery]);
  
  // Handle reseller search
  useEffect(() => {
    if (!resellerSearchQuery.trim()) {
      setResellerSearchResults([]);
      return;
    }
    
    const searchResellers = async () => {
      setResellerSearchLoading(true);
      try {
        // Query for users with reseller role matching search
        const resellersQuery = query(
          collection(firestore, 'users'),
          where('role', '==', 'reseller')
        );
        
        const querySnapshot = await getDocs(resellersQuery);
        const allResellers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Filter client-side
        const filteredResellers = allResellers.filter(reseller => {
          const fullName = `${reseller.firstName || ''} ${reseller.lastName || ''}`.toLowerCase();
          const query = resellerSearchQuery.toLowerCase();
          
          return fullName.includes(query) || 
                 (reseller.email && reseller.email.toLowerCase().includes(query));
        });
        
        setResellerSearchResults(filteredResellers.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error('Error searching resellers:', error);
      } finally {
        setResellerSearchLoading(false);
      }
    };
    
    const debounceTimeout = setTimeout(searchResellers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [resellerSearchQuery]);
  
  // Fetch designer's designs when a designer is selected
  useEffect(() => {
    if (!selectedDesigner) {
      setDesignerDesigns([]);
      return;
    }
    
    const fetchDesignerDesigns = async () => {
      try {
        // Query for designs that belong to the selected designer
        const designsQuery = query(
          collection(firestore, 'designs'),
          where('designerId', '==', selectedDesigner.id)
        );
        
        const querySnapshot = await getDocs(designsQuery);
        const designs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setDesignerDesigns(designs);
      } catch (error) {
        console.error('Error fetching designer designs:', error);
      }
    };
    
    fetchDesignerDesigns();
  }, [selectedDesigner]);
  
  // Handle designer selection
  const selectDesigner = (designer: any) => {
    setSelectedDesigner(designer);
    setFormData(prev => ({
      ...prev,
      designerId: designer.id
    }));
    setShowDesignerDropdown(false);
    setDesignerSearchQuery('');
  };
  
  // Handle reseller selection
  const selectReseller = (reseller: any) => {
    setSelectedReseller(reseller);
    setFormData(prev => ({
      ...prev,
      resellerId: reseller.id
    }));
    setShowResellerDropdown(false);
    setResellerSearchQuery('');
  };
  
  // Handle design selection
  const selectDesign = (designId: string) => {
    setFormData(prev => ({
      ...prev,
      designId
    }));
  };
  
  // Handle file upload for product images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Validate files
    const newImages: File[] = Array.from(files).filter(file => {
      if (!validImageTypes.includes(file.type)) {
        setError(`File "${file.name}" is not a supported image type.`);
        return false;
      }
      
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds the maximum size of 5MB.`);
        return false;
      }
      
      return true;
    });
    
    // Create preview URLs
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Free up memory
      newUrls.splice(index, 1);
      return newUrls;
    });
  };
  
  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation
      if (!formData.name.trim()) throw new Error('Product name is required');
      if (!formData.description.trim()) throw new Error('Product description is required');
      if (!formData.price.trim() || isNaN(parseFloat(formData.price))) throw new Error('Valid price is required');
      if (!formData.category) throw new Error('Product category is required');
      if (formData.sizes.length === 0) throw new Error('At least one size must be selected');
      if (formData.images.length === 0) throw new Error('At least one product image is required');
      if (!formData.designerId) throw new Error('Designer is required');
      if (!formData.designId) throw new Error('Design is required');
      
      // Upload images to storage
      const imageUrls: string[] = [];
      
      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];
        const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }
      
      // Calculate commission rates
      const baseDesignerCommission = formData.designerCommission;
      const finalDesignerCommission = formData.featuredDesign ? baseDesignerCommission + 5 : baseDesignerCommission;
      const resellerCommission = formData.resellerId ? formData.resellerCommission : 0;
      
      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        category: formData.category,
        tags: formData.tags,
        colors: formData.colors,
        sizes: formData.sizes,
        imageUrls,
        designerId: formData.designerId,
        designId: formData.designId,
        resellerId: formData.resellerId || null,
        stock: formData.stock,
        designerCommission: finalDesignerCommission,
        resellerCommission: resellerCommission,
        featuredDesign: formData.featuredDesign,
        isLimited: formData.isLimited,
        limitedQuantity: formData.isLimited ? formData.limitedQuantity : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        // Add unique SKU generation for the product
        sku: generateProductSKU(formData.category, selectedDesigner?.id),
        // For commission tracking
        commissionSettings: {
          designerPercentage: finalDesignerCommission,
          resellerPercentage: resellerCommission,
          platformPercentage: 100 - finalDesignerCommission - resellerCommission,
        }
      };
      
      // Add to Firestore
      const productRef = await addDoc(collection(firestore, 'products'), productData);
      
      // Create commission tracking document
      await addDoc(collection(firestore, 'commissions'), {
        productId: productRef.id,
        designerId: formData.designerId,
        resellerId: formData.resellerId || null,
        designerName: selectedDesigner?.firstName && selectedDesigner?.lastName 
          ? `${selectedDesigner.firstName} ${selectedDesigner.lastName}`
          : selectedDesigner?.displayName || selectedDesigner?.email,
        resellerName: selectedReseller?.firstName && selectedReseller?.lastName
          ? `${selectedReseller.firstName} ${selectedReseller.lastName}`
          : selectedReseller?.displayName || selectedReseller?.email,
        productName: formData.name,
        designerPercentage: finalDesignerCommission,
        resellerPercentage: resellerCommission,
        isFeatureDesign: formData.featuredDesign,
        totalSales: 0,
        totalCommissions: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setSuccess(true);
      
      // Redirect to product page after delay
      setTimeout(() => {
        navigate(`/admin/products/${productRef.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique SKU for the product using category and designer ID
  const generateProductSKU = (category: string, designerId?: string) => {
    const categoryCode = category.substring(0, 3).toUpperCase();
    const designerCode = designerId ? designerId.substring(0, 4).toUpperCase() : 'XXXX';
    const timestamp = Date.now().toString().substring(7, 13);
    
    return `${categoryCode}-${designerCode}-${timestamp}`;
  };

  return (
    <AdminLayout 
      title="Create New Product" 
      subtitle="Add a new product to the catalog"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentStep(1)}
            className={`flex-1 text-center ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
          >
            1. Product Information
          </button>
          <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <button 
            onClick={() => currentStep >= 2 ? setCurrentStep(2) : null}
            className={`flex-1 text-center ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
          >
            2. Design & Attribution
          </button>
          <div className={`w-12 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <button 
            onClick={() => currentStep >= 3 ? setCurrentStep(3) : null}
            className={`flex-1 text-center ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
          >
            3. Upload Images
          </button>
        </div>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <CheckCircle size={20} className="mr-2" />
          Product created successfully! Redirecting...
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Step 1: Product Information */}
        {currentStep === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <PackagePlus size={24} className="mr-2 text-blue-600" />
              Product Information
            </h2>
            
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              {/* Price and Sale Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price ($) <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {PRODUCT_CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {/* Tag display */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Sizes <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-md border ${
                        formData.sizes.includes(size) 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formData.sizes.length === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Please select at least one size
                  </p>
                )}
              </div>
              
              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Limited Edition */}
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isLimited"
                    name="isLimited"
                    checked={formData.isLimited}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isLimited" className="ml-2 block text-sm font-medium text-gray-700">
                    Limited Edition Product
                  </label>
                </div>
                
                {formData.isLimited && (
                  <div className="mt-2 pl-6">
                    <label htmlFor="limitedQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Limited Quantity
                    </label>
                    <input
                      type="number"
                      id="limitedQuantity"
                      name="limitedQuantity"
                      value={formData.limitedQuantity}
                      onChange={handleInputChange}
                      min="1"
                      max={formData.stock}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.isLimited}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next: Design & Attribution
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Design & Attribution */}
        {currentStep === 2 && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Brush size={24} className="mr-2 text-blue-600" />
              Design & Attribution
            </h2>
            
            <div className="space-y-6">
              {/* Designer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="flex">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search for a verified designer..."
                        value={designerSearchQuery}
                        onChange={(e) => {
                          setDesignerSearchQuery(e.target.value);
                          setShowDesignerDropdown(true);
                        }}
                        onFocus={() => setShowDesignerDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDesignerDropdown(!showDesignerDropdown)}
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  {/* Designer Dropdown Results */}
                  {showDesignerDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-300">
                      {designerSearchLoading ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                      ) : designerSearchResults.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">
                          {designerSearchQuery ? 'No designers found' : 'Start typing to search designers'}
                        </div>
                      ) : (
                        <ul>
                          {designerSearchResults.map(designer => (
                            <li 
                              key={designer.id}
                              onClick={() => selectDesigner(designer)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#1AFF00]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#1AFF00]">
                                  {designer.firstName?.charAt(0) || designer.email?.charAt(0) || '?'}
                                </div>
                                <div className="ml-3">
                                  <div className="font-medium">
                                    {designer.firstName && designer.lastName 
                                      ? `${designer.firstName} ${designer.lastName}` 
                                      : designer.displayName || designer.email}
                                  </div>
                                  <div className="text-sm text-gray-500">{designer.email}</div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Selected Designer Display */}
                {selectedDesigner && (
                  <div className="mt-3 flex items-center bg-blue-50 p-3 rounded-md border border-blue-100">
                    <div className="w-10 h-10 bg-[#1AFF00]/20 rounded-full flex items-center justify-center text-lg font-bold text-[#1AFF00]">
                      {selectedDesigner.firstName?.charAt(0) || selectedDesigner.email?.charAt(0) || '?'}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">
                        {selectedDesigner.firstName && selectedDesigner.lastName 
                          ? `${selectedDesigner.firstName} ${selectedDesigner.lastName}` 
                          : selectedDesigner.displayName || selectedDesigner.email}
                      </div>
                      <div className="text-sm text-gray-500">{selectedDesigner.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDesigner(null);
                        setFormData(prev => ({ ...prev, designerId: '', designId: '' }));
                        setDesignerDesigns([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Design Selection - Only visible when designer is selected */}
              {selectedDesigner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Design <span className="text-red-500">*</span>
                  </label>
                  
                  {designerDesigns.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                      <p className="text-gray-500">This designer has no uploaded designs yet.</p>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Create Design for This Designer
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {designerDesigns.map(design => (
                        <div 
                          key={design.id}
                          onClick={() => selectDesign(design.id)}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                            formData.designId === design.id 
                              ? 'border-blue-500 ring-2 ring-blue-500/50' 
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                            {design.thumbnailUrl ? (
                              <img 
                                src={design.thumbnailUrl} 
                                alt={design.name} 
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Image size={32} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="font-medium truncate">{design.name}</div>
                            <div className="text-xs text-gray-500">
                              Created: {new Date(design.createdAt?.seconds * 1000).toLocaleDateString()}
                            </div>
                            {formData.designId === design.id && (
                              <div className="mt-2 text-blue-600 text-sm font-medium flex items-center">
                                <CheckCircle size={14} className="mr-1" />
                                Selected
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Reseller Selection (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reseller <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <div className="flex">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search for a reseller..."
                        value={resellerSearchQuery}
                        onChange={(e) => {
                          setResellerSearchQuery(e.target.value);
                          setShowResellerDropdown(true);
                        }}
                        onFocus={() => setShowResellerDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowResellerDropdown(!showResellerDropdown)}
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  
                  {/* Reseller Dropdown Results */}
                  {showResellerDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-300">
                      {resellerSearchLoading ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                      ) : resellerSearchResults.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">
                          {resellerSearchQuery ? 'No resellers found' : 'Start typing to search resellers'}
                        </div>
                      ) : (
                        <ul>
                          {resellerSearchResults.map(reseller => (
                            <li 
                              key={reseller.id}
                              onClick={() => selectReseller(reseller)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <User size={20} className="text-gray-400 mr-2" />
                                <div>
                                  <div className="font-medium">
                                    {reseller.firstName && reseller.lastName 
                                      ? `${reseller.firstName} ${reseller.lastName}` 
                                      : reseller.displayName || reseller.email}
                                  </div>
                                  <div className="text-sm text-gray-500">{reseller.email}</div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Selected Reseller Display */}
                {selectedReseller && (
                  <div className="mt-3 flex items-center bg-purple-50 p-3 rounded-md border border-purple-100">
                    <User size={20} className="text-purple-600 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">
                        {selectedReseller.firstName && selectedReseller.lastName 
                          ? `${selectedReseller.firstName} ${selectedReseller.lastName}` 
                          : selectedReseller.displayName || selectedReseller.email}
                      </div>
                      <div className="text-sm text-gray-500">{selectedReseller.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReseller(null);
                        setFormData(prev => ({ ...prev, resellerId: '' }));
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Commission Rates */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                  <DollarSign size={18} className="text-green-600 mr-2" />
                  Commission Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="designerCommission" className="block text-sm font-medium text-gray-700 mb-1">
                      Designer Commission (%)
                    </label>
                    <input
                      type="number"
                      id="designerCommission"
                      name="designerCommission"
                      value={formData.designerCommission}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {selectedReseller && (
                    <div>
                      <label htmlFor="resellerCommission" className="block text-sm font-medium text-gray-700 mb-1">
                        Reseller Commission (%)
                      </label>
                      <input
                        type="number"
                        id="resellerCommission"
                        name="resellerCommission"
                        value={formData.resellerCommission}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
                
                {/* Featured Design Option */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featuredDesign"
                      name="featuredDesign"
                      checked={formData.featuredDesign}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featuredDesign" className="ml-2 block text-sm font-medium text-gray-700">
                      Feature on Kudos Board (+5% commission to designer)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back: Product Information
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next: Upload Images
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Product Images */}
        {currentStep === 3 && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Image size={24} className="mr-2 text-blue-600" />
              Product Images
            </h2>
            
            <div className="space-y-6">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Product Images <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud size={40} className="mb-3 text-gray-400" />
                    <span className="text-lg text-gray-700">Click to upload or drag and drop</span>
                    <span className="text-sm text-gray-500 mt-1">PNG, JPG, GIF, WEBP (max 5MB)</span>
                  </label>
                </div>
              </div>
              
              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-3">Image Previews</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    <label htmlFor="images" className="aspect-w-1 aspect-h-1 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <div className="flex flex-col items-center text-gray-500">
                        <PlusCircle size={24} className="mb-1" />
                        <span className="text-sm">Add More</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Summary of Product */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-base font-medium text-gray-700 mb-3">Product Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{formData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${formData.price || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">
                      {PRODUCT_CATEGORIES.find(cat => cat.value === formData.category)?.label || formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Designer</p>
                    <p className="font-medium">
                      {selectedDesigner ? (
                        selectedDesigner.firstName && selectedDesigner.lastName 
                          ? `${selectedDesigner.firstName} ${selectedDesigner.lastName}` 
                          : selectedDesigner.displayName || selectedDesigner.email
                      ) : 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back: Design & Attribution
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Product...
                  </span>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
