
import Navbar from '@/components/navbar';

import VerticalNav from '@/components/vertical-nav';

export default function SwagLoops() {
  return (
    <>
      <Navbar />
      <VerticalNav />
      <section className="container mx-auto py-16 px-4 mt-10">
        <div className="flex flex-col items-start gap-2 mb-8">
          <h1 className="text-5xl md:text-7xl font-heading font-bold">SWAG LOOPS</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Exclusive accessories to complete your style and elevate your everyday look.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product items would go here */}
          <div className="border border-border rounded-lg p-4 aspect-square flex items-center justify-center">
            <p className="text-muted-foreground">Product Coming Soon</p>
          </div>
        </div>
      </section>
     
    </>
  );
}
