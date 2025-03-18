import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CoCreations() {
  return (
    <div className="min-h-screen bg-[#EFEBDF] flex flex-col items-center justify-center px-4 relative">
      {/* Back button in the left */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-black hover:text-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="font-medium">Back</span>
      </Link>
      
      {/* Large COCREATIONS text */}
      <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-center w-full my-12 tracking-tight">
        CO<span className="text-[#1AFF00]">CREATIONS</span>
      </h1>
      
      {/* "Let's Colab" button */}
      <div className="text-center">
        <Link 
          to="/makemoney/collaborate"
          className="group bg-black text-white px-10 py-4 rounded-lg font-heading text-xl hover:bg-black/80 transition-all flex items-center justify-center"
        >
          Let's Colab
          <ArrowRight className="ml-2 h-5 w-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
        <p className="mt-4 text-muted-foreground">
          Join forces with X57 to create something extraordinary
        </p>
      </div>
      
      {/* Optional design elements */}
      <div className="absolute bottom-12 text-center opacity-50 text-sm">
        <p>We believe in the power of creative collaboration</p>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
