import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CoCreations() {
  return (
    <div className="min-h-screen bg-[#eceae4] flex flex-col items-center py-20 px-4 relative">
      {/* Back button in the left */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-black hover:text-black/70 transition-colors"
      >
        <ArrowLeft size={24} />
        <span className="font-medium">Back</span>
      </Link>
      
      {/* Large COCREATIONS text */}
      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-center w-full mb-8 tracking-tight">
        CO<span className="text-[#1AFF00]">CREATIONS</span>
      </h1>
      
      <p className="text-lg max-w-2xl text-center mb-12">
        Exclusive products we've designed for clubs, events, startups and companies.
        Each design tells a unique story of creative collaboration.
      </p>
      
      {/* Featured Collaborations */}
      <div className="w-full max-w-6xl mb-16">
        <h2 className="font-heading text-3xl mb-8 font-bold">Featured Collections</h2>
        
        {/* Grid of collaborations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Empty state for now */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#eceae4] border border-black/10 rounded-lg overflow-hidden hover:shadow-md transition-all group">
              <div className="aspect-[4/3] bg-black/5 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-black/20" />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-xl mb-2">Coming Soon</h3>
                <p className="text-sm text-black/70">Exciting collaborations launching soon</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* "Create Your Own" button */}
      <div className="text-center">
        <Link 
          to="/makemoney/collaborate"
          className="group bg-black text-white px-10 py-4 rounded-lg font-heading text-xl hover:bg-black/80 transition-all flex items-center justify-center"
        >
          Create Your Own Collection
          <ArrowRight className="ml-2 h-5 w-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
        <p className="mt-4 text-muted-foreground">
          Have your own brand or event? Let's create something together!
        </p>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#1AFF00]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-40 rounded-full bg-black/5 blur-3xl -z-10"></div>
    </div>
  );
}
