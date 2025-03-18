
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-extrabold font-heading mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer service.</p>
          
          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services.</p>
          
          {/* Add more privacy policy content here */}
        </div>
      </section>
      <Footer />
    </>
  );
}
