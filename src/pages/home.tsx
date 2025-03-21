import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { VerticalNav } from "@/components/vertical-nav";

export default function Home() {
  // State to control the flicker/glitch effect
  const [isGlitching, setIsGlitching] = useState(false);

  // Setup the flickering effect to occur every 4 seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      
      // Reset the glitch after a short duration
      setTimeout(() => {
        setIsGlitching(false);
      }, 260);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <>
      <Navbar />
      
      <section className="container relative min-h-[90vh] pt-16 md:pt-20 overflow-hidden">
        {/* Main content area - restructured */}
        <div className="w-full flex flex-col md:flex-row justify-between relative">
          {/* Left side: Text content stack and button */}
          <div className="w-full md:w-1/2 pl-4 md:pl-10 relative z-10">
            <div className="flex flex-col items-start">
              <span className="font-heading text-4xl md:text-6xl lg:text-[8rem] font-bold text-left tracking-tighter leading-none">
                STEERING
              </span>
              
              <div className="relative my-2 md:my-4">
                <span className={`
                  font-playwrite italic text-[#1AFF00] text-3xl md:text-6xl lg:text-8xl playwrite-gb-j-guides-regular-italic
                  block text-left transition-all duration-100 leading-none
                  ${isGlitching ? 
                    'opacity-80 drop-shadow-[0_0_25px_#1AFF00] blur-[0.7px]' : 
                    'drop-shadow-[0_0_15px_#1AFF00]'
                  }
                `}>
                  Lifestyle
                </span>
                {/* Simple ghost copy for glitch */}
                {isGlitching && (
                  <span className="absolute top-0 left-[3px] font-playwrite italic text-[#1AFF00]/20 text-3xl md:text-6xl lg:text-8xl playwrite-gb-j-guides-regular-italic blur-[0.5px]">
                    Lifestyle
                  </span>
                )}
              </div>
              
              <div className="font-heading text-4xl md:text-6xl lg:text-[8rem] font-bold text-left tracking-tighter leading-none mb-8 mt-6">
                <span>X</span>
                <span className={`${isGlitching ? 'text-[#1AFF00]' : ''} transition-colors duration-100`}>D</span>
              </div>
              
              {/* Co-Creations button now positioned below XD text */}
              <Link
                to="/cocreations"
                className="group py-4 px-8 w-full sm:w-auto rounded-lg flex items-center justify-center transition-all duration-300 
                   border-2 border-[#1AFF00] text-[#1AFF00] 
                   hover:bg-[#1AFF00] hover:text-black
                   shadow-[0_0_15px_rgba(26,255,0,0.2)]
                   hover:shadow-[0_0_20px_rgba(26,255,0,0.4)]"
              >
                <span className="font-heading tracking-wide text-xl md:text-2xl font-bold">check out our Co-Creations</span>
                <ArrowRight className="ml-3 h-5 w-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
          
          {/* Right side: SVG elements and Hoodie image */}
          <div className="w-full md:w-1/2 flex flex-col justify-between relative">
            {/* Hoodie image - only visible on tablet/desktop */}
            <div className="hidden md:block absolute right-4 lg:right-10 top-1/2 transform -translate-y-1/2 z-0">
              <img 
                src="/hood.png" 
                alt="Floating hoodie" 
                className="w-auto h-[450px] lg:h-[550px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* SVG elements positioned in bottom right */}
            <div className="absolute bottom-10 right-8 md:right-10 flex flex-col gap-6 md:gap-8 items-end z-10">
              <img 
                src="/ran.svg" 
                alt="Ransom SVG" 
                className="h-32 w-32 md:h-40 md:w-40 hover:rotate-3 transition-transform duration-500" 
              />
              <img 
                src="/tenor.gif.svg" 
                alt="Tenor SVG" 
                className="h-32 w-32 md:h-40 md:w-40 hover:rotate-[-3deg] transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products You Might Like Section - With increased height and spacing */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Products You Might Like</h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl">Handpicked selections based on latest trends</p>
        </div>
        
        <div className="border-2 border-black rounded-lg p-16 md:p-24 text-center min-h-[400px] flex flex-col items-center justify-center">
          <h3 className="text-3xl font-heading mb-4">Products Coming Soon</h3>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            We're working on bringing you the best selection of products. Check back soon!
          </p>
        </div>
       
      </section>
       
      <VerticalNav />
      <Footer />
    </>
  );
}
