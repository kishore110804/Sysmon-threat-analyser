import React from 'react';
import Navbar from '@/components/navbar';

export default function Kudos() {
  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Kudos Board
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Check out the latest kudos from our community.
          </p>
        </div>
        <div className="grid gap-6">
          {/* Kudos content will go here */}
        </div>
      </section>
    </>
  );
}
