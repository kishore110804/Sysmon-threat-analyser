import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  doc, getDoc, updateDoc, collection, 
  addDoc, serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import AdminLayout from '@/components/admin/admin-layout';
import { 
  ArrowLeft, Check, X, Clock, ChevronDown, ChevronUp,
  FileText, Download, ExternalLink, Send, Brush,
  Shield, AlertTriangle
} from 'lucide-react';

export default function ApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    designStylesAndTools: true,
    designSamples: true,
    actions: true
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const fetchApplicationAndDesigner = async () => {
      if (!id) return;
      
      try {
        // Fetch application data
        const applicationDoc = await getDoc(doc(firestore, 'designerApplications', id));
        
        if (!applicationDoc.exists()) {
          setError('Application not found');
          return;
        }
        
        const applicationData = {
          id: applicationDoc.id,
          ...applicationDoc.data()
        } as any;
        
        setApplication(applicationData);
        
        // Fetch designer data
        if (applicationData.userId) {
          const designerDoc = await getDoc(doc(firestore, 'users', applicationData.userId));
          
          if (designerDoc.exists()) {
            setDesigner({
              id: designerDoc.id,
              ...designerDoc.data()
            } as any);
          }
        }
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load application data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationAndDesigner();
  }, [id]);

  // Toggle section expand/collapse
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Handle application approval
  const handleApproveApplication = async () => {
    if (!id || !application || !designer) return;
    
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // 1. Update the application status
      await updateDoc(doc(firestore, 'designerApplications', id), {
        status: 'verified',
        reviewedAt: serverTimestamp(),
        reviewNotes: 'Application approved'
      });
      
      // 2. Update the user's designer verification status
      await updateDoc(doc(firestore, 'users', designer.id), {
        'designerVerification.status': 'verified',
        'designerVerification.verifiedAt': serverTimestamp(),
        // Set additional fields for verified designers
        'designerVerification.profileComplete': true
      });
      
      // 3. Add a notification for the designer
      await addDoc(collection(firestore, 'notifications'), {
        userId: designer.id,
        type: 'designer_verification',
        title: 'Application Approved',
        message: 'Your designer application has been approved! You can now submit designs.',
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Update local state
      setApplication({
        ...application,
        status: 'verified',
        reviewedAt: new Date(),
        reviewNotes: 'Application approved'
      });
      
      setSuccessMessage('Designer application approved successfully');
    } catch (err) {
      console.error('Error approving application:', err);
      setError('Failed to approve application');
    } finally {
      setUpdating(false);
    }
  };

  // Handle application rejection
  const handleRejectApplication = async () => {
    if (!id || !application || !designer) return;
    
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // 1. Update the application status
      await updateDoc(doc(firestore, 'designerApplications', id), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewNotes: 'Application rejected'
      });
      
      // 2. Update the user's designer verification status
      await updateDoc(doc(firestore, 'users', designer.id), {
        'designerVerification.status': 'rejected',
        'designerVerification.rejectedAt': serverTimestamp()
      });
      
      // 3. Add a notification for the designer
      await addDoc(collection(firestore, 'notifications'), {
        userId: designer.id,
        type: 'designer_verification',
        title: 'Application Status Update',
        message: 'Your designer application has been reviewed. Please check your email for details.',
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Update local state
      setApplication({
        ...application,
        status: 'rejected',
        reviewedAt: new Date(),
        reviewNotes: 'Application rejected'
      });
      
      setSuccessMessage('Designer application rejected');
    } catch (err) {
      console.error('Error rejecting application:', err);
      setError('Failed to reject application');
    } finally {
      setUpdating(false);
    }
  };

  // Handle sending feedback
  const handleSendFeedback = async () => {
    if (!id || !application || !designer || !feedbackMessage.trim()) return;
    
    setUpdating(true);
    setError(null);
    
    try {
      // 1. Update the application with feedback
      await updateDoc(doc(firestore, 'designerApplications', id), {
        feedback: [...(application.feedback || []), {
          message: feedbackMessage,
          timestamp: serverTimestamp(),
          adminId: 'admin' // In a real app, this would be the current admin user's ID
        }]
      });
      
      // 2. Add a notification for the designer
      await addDoc(collection(firestore, 'notifications'), {
        userId: designer.id,
        type: 'feedback',
        title: 'New Feedback on Your Application',
        message: 'You have received feedback on your designer application.',
        read: false,
        createdAt: serverTimestamp()
      });
      
      // 3. Update the application status to 'feedback' if it's currently pending
      if (application.status === 'pending_review') {
        await updateDoc(doc(firestore, 'designerApplications', id), {
          status: 'feedback'
        });
        
        // Also update user's verification status
        await updateDoc(doc(firestore, 'users', designer.id), {
          'designerVerification.status': 'feedback'
        });
        
        // Update local state
        setApplication({
          ...application,
          status: 'feedback'
        });
      }
      
      // Update local state with new feedback
      setApplication({
        ...application,
        feedback: [...(application.feedback || []), {
          message: feedbackMessage,
          timestamp: new Date(),
          adminId: 'admin'
        }]
      });
      
      setFeedbackMessage('');
      setSuccessMessage('Feedback sent successfully');
    } catch (err) {
      console.error('Error sending feedback:', err);
      setError('Failed to send feedback');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Application Review" subtitle="Loading application data...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading application data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !application) {
    return (
      <AdminLayout title="Application Review" subtitle="Error">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
        <div className="mt-4">
          <Link 
            to="/admin/designers/applications" 
            className="inline-flex items-center text-blue-600 hover:text-blue-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Applications
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Designer Application Review" 
      subtitle={`Reviewing application from ${application?.userName || application?.userEmail}`}
    >
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/admin/designers/applications" 
          className="inline-flex items-center text-blue-600 hover:text-blue-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Applications
        </Link>
      </div>
      
      {/* Status banner */}
      {application && (
        <div className={`mb-6 px-6 py-4 rounded-md flex items-center justify-between
          ${application.status === 'pending_review' ? 'bg-yellow-50 border border-yellow-200' :
            application.status === 'verified' ? 'bg-green-50 border border-green-200' :
            application.status === 'rejected' ? 'bg-red-50 border border-red-200' : 
            'bg-blue-50 border border-blue-200'}`}
        >
          <div className="flex items-center">
            {application.status === 'pending_review' ? (
              <Clock size={20} className="text-yellow-500 mr-2" />
            ) : application.status === 'verified' ? (
              <Check size={20} className="text-green-500 mr-2" />
            ) : application.status === 'rejected' ? (
              <X size={20} className="text-red-500 mr-2" />
            ) : (
              <Shield size={20} className="text-blue-500 mr-2" />
            )}
            <div>
              <h3 className={`font-medium 
                ${application.status === 'pending_review' ? 'text-yellow-800' :
                  application.status === 'verified' ? 'text-green-800' :
                  application.status === 'rejected' ? 'text-red-800' : 'text-blue-800'}`}
              >
                {application.status === 'pending_review' ? 'Pending Review' : 
                 application.status === 'verified' ? 'Application Verified' :
                 application.status === 'rejected' ? 'Application Rejected' : 
                 'Application In Progress'}
              </h3>
              <p className="text-sm text-gray-600">
                Submitted on {formatDate(application.submittedAt)}
                {application.reviewedAt && ` • Reviewed on ${formatDate(application.reviewedAt)}`}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Alert messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Application details - collapsible sections */}
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('basicInfo')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200"
          >
            <h2 className="text-lg font-medium">Designer Information</h2>
            {expandedSections.basicInfo ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          
          {expandedSections.basicInfo && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{application?.userName || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{application?.userEmail || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                  <p className="mt-1">{application?.contactEmail || 'Same as account email'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
                  <p className="mt-1">
                    {application?.experienceLevel === 'expert' ? 'Expert (5+ years)' :
                     application?.experienceLevel === 'experienced' ? 'Experienced (3-5 years)' :
                     application?.experienceLevel === 'intermediate' ? 'Intermediate (1-3 years)' :
                     application?.experienceLevel === 'beginner' ? 'Beginner (0-1 years)' : 'Not specified'}
                  </p>
                </div>
                
                {/* Portfolio Links */}
                {application?.portfolioLinks && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Portfolio Links</h3>
                    <p className="mt-1 break-words">{application.portfolioLinks}</p>
                  </div>
                )}
                
                {/* Design Statement */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Design Statement</h3>
                  <p className="mt-1 whitespace-pre-line">{application?.designStatement || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Design Styles and Tools */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('designStylesAndTools')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200"
          >
            <h2 className="text-lg font-medium">Design Styles & Tools</h2>
            {expandedSections.designStylesAndTools ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          
          {expandedSections.designStylesAndTools && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Product Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Categories</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application?.productCategories?.map((category: string) => (
                      <span 
                        key={category} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                      </span>
                    )) || 'None selected'}
                  </div>
                </div>
                
                {/* Design Styles */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Design Styles</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {application?.designStyles?.map((style: string) => (
                      <span 
                        key={style} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {style}
                      </span>
                    )) || 'None selected'}
                  </div>
                </div>
                
                {/* 3D Tools */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">3D Design Tools</h3>
                  <div className="mt-2">
                    {application?.tools3d?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {application.tools3d.map((tool: string) => (
                          <span 
                            key={tool} 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tool === 'clo3d' 
                                ? 'bg-green-100 text-green-800 font-semibold' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tool === 'clo3d' && <Brush size={12} className="mr-1" />}
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No 3D tools selected</p>
                    )}
                  </div>
                </div>
                
                {/* Other Tools */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Other Design Tools</h3>
                  <p className="mt-1">{application?.otherTools || 'None specified'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Design Samples */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('designSamples')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200"
          >
            <h2 className="text-lg font-medium">Design Samples</h2>
            {expandedSections.designSamples ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          
          {expandedSections.designSamples && (
            <div className="p-6">
              {application?.fileUrls?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {application.fileUrls.map((url: string, index: number) => {
                    // Determine if it's an image file
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
                    
                    return (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
                      >
                        {isImage ? (
                          <div className="relative h-40 bg-gray-100">
                            <img 
                              src={url} 
                              alt={`Design sample ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback for failed images
                                (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Preview+Unavailable';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-gray-100 flex items-center justify-center">
                            <FileText size={48} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div className="p-3 bg-white flex justify-between items-center border-t">
                          <span className="text-sm text-gray-500 truncate">
                            Sample {index + 1}
                          </span>
                          <div className="flex space-x-2">
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-800"
                              title="View full size"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <a 
                              href={url} 
                              download={`design-sample-${index + 1}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Download"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <AlertTriangle size={24} className="mx-auto mb-2" />
                  <p>No design samples were uploaded with this application.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Actions and Feedback */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection('actions')}
            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 border-b border-gray-200"
          >
            <h2 className="text-lg font-medium">Actions & Feedback</h2>
            {expandedSections.actions ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>
          
          {expandedSections.actions && (
            <div className="p-6">
              {/* Previous Feedback */}
              {application?.feedback && application.feedback.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Previous Feedback</h3>
                  <div className="space-y-3">
                    {application.feedback.map((feedback: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="whitespace-pre-line">{feedback.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Sent on {formatDate(feedback.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Send Feedback */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Send Feedback to Designer</h3>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Enter feedback for the designer regarding their application or designs..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  onClick={handleSendFeedback}
                  disabled={!feedbackMessage.trim() || updating}
                  className={`mt-3 inline-flex items-center px-4 py-2 rounded-md text-white ${
                    !feedbackMessage.trim() || updating
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send size={16} className="mr-2" />
                  Send Feedback
                </button>
              </div>
              
              {/* Approval/Rejection Actions */}
              {application?.status === 'pending_review' || application?.status === 'feedback' ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleApproveApplication}
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Check size={18} className="mr-2" />
                    Approve Application
                  </button>
                  <button
                    onClick={handleRejectApplication}
                    disabled={updating}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <X size={18} className="mr-2" />
                    Reject Application
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-md ${
                  application?.status === 'verified' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {application?.status === 'verified' ? (
                    <p className="flex items-center">
                      <Check size={18} className="mr-2" />
                      This application has been approved
                    </p>
                  ) : (
                    <p className="flex items-center">
                      <X size={18} className="mr-2" />
                      This application has been rejected
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
