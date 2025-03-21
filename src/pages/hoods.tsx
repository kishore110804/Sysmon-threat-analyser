
import Navbar from '@/components/navbar';
import VerticalNav from '@/components/vertical-nav';

export default function Hoods() {
  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Hoods Collection
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Browse our collection of premium hoodies.
          </p>
        </div>
      </section>
      <VerticalNav />
    </>
  );
}
