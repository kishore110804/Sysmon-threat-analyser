import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
      <section className="container relative min-h-[80vh] flex flex-col items-start justify-start pt-16 md:pt-20 overflow-hidden">
        {/* Text wrapper - controls overall positioning */}
        <div className="relative w-full mt-8 md:mt-6 z-10">
          {/* Mobile view: Stacked and left-aligned text */}
          <div className="flex flex-col items-start pl-4 md:hidden">
            <span className="font-heading text-4xl font-bold">STEERING</span>
            <div className="relative my-2">
              <span className={`
                font-playwrite italic text-[#1AFF00] text-3xl playwrite-gb-j-guides-regular-italic
                inline-block transition-all duration-100 w-auto
                ${isGlitching ? 
                  'opacity-70 drop-shadow-[0_0_20px_#1AFF00] blur-[0.5px]' : 
                  'drop-shadow-[0_0_8px_#1AFF00]'
                }
              `}>
                Lifestyle
              </span>
              {isGlitching && (
                <span className="absolute top-0 left-[2px] font-playwrite italic text-[#1AFF00]/30 text-3xl playwrite-gb-j-guides-regular-italic blur-[0.3px]">
                  Lifestyle
                </span>
              )}
            </div>
            <span className="font-heading text-4xl font-bold text-black">XD</span>
          </div>
          
          {/* Desktop view: Left-aligned flowing text layout */}
          <div className="hidden md:block">
            <div className="flex flex-wrap items-start justify-start md:justify-start pl-8 lg:pl-12">
              <div className="w-full md:w-auto">
                <span className="font-heading text-7xl lg:text-9xl font-bold block text-left">
                  STEERING
                </span>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="relative">
                  <span className={`
                    font-playwrite italic text-[#1AFF00] text-6xl lg:text-8xl playwrite-gb-j-guides-regular-italic
                    block text-left transition-all duration-100
                    ${isGlitching ? 
                      'opacity-80 drop-shadow-[0_0_25px_#1AFF00] blur-[0.7px]' : 
                      'drop-shadow-[0_0_15px_#1AFF00]'
                    }
                  `}>
                    Lifestyle
                  </span>
                  {/* Simple ghost copy for glitch */}
                  {isGlitching && (
                    <>
                      <span className="absolute top-0 left-[3px] font-playwrite italic text-[#1AFF00]/20 text-6xl lg:text-8xl playwrite-gb-j-guides-regular-italic blur-[0.5px]">
                        Lifestyle
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <span className="font-heading text-7xl lg:text-9xl font-bold block text-left">
                  XD
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hoodie image positioned lower on page */}
        <div className="w-full max-w-2xl mx-auto mt-12 md:mt-24 mb-24">
          <img 
            src="/hood.png" 
            alt="Falling hoodie 3D render" 
            className="w-full object-contain"
          />
        </div>
        
        {/* COCreations Button - Border Glow Effect */}
        <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center mb-12 z-20">
          <Link
            to="/cocreations"
            className="group w-4/5 max-w-4xl py-4 rounded-lg flex items-center justify-center transition-all duration-300 
               border-2 border-[#1AFF00] text-[#1AFF00] 
               hover:bg-[#1AFF00] hover:text-black
               shadow-[0_0_15px_rgba(26,255,0,0.2)]
               hover:shadow-[0_0_20px_rgba(26,255,0,0.4)]"
          >
            <span className="font-heading tracking-wide text-xl md:text-2xl font-bold">check out our Co-Creations</span>
            <ArrowRight className="ml-3 h-5 w-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
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
      
      <Footer />
    </>
  );
}
