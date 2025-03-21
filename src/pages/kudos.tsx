import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Kudos() {
  return (
    <div className="min-h-screen bg-[#eceae4] flex flex-col items-center justify-center px-4 relative">
      {/* Back button in the left */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-black hover:text-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="font-medium">Back</span>
      </Link>
      
      {/* Large KUDOS!BOARD text */}
      <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-center w-full my-12 tracking-tight">
        KUDOS<span className="text-[#1AFF00]">!</span>BOARD
      </h1>
      
      {/* Center "Coming Soon" button */}
      <div className="text-center">
        <button className="bg-black text-white px-10 py-4 rounded-lg font-heading text-xl hover:bg-black/80 transition-all transform hover:scale-105 shadow-lg">
          Coming Soon
        </button>
        <p className="mt-4 text-muted-foreground">
          We're working on something special for our community
        </p>
      </div>
      
      {/* Optional design elements */}
      <div className="absolute bottom-12 text-center opacity-50 text-sm">
        <p>Be part of the conversation. Share your experiences.</p>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
