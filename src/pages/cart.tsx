import React from 'react';
import Navbar from '@/components/navbar';

export default function Cart() {
  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Your Cart
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Review your selected items before checkout.
          </p>
        </div>
        <div className="grid gap-6">
          {/* Cart items will go here */}
          <div className="border border-border rounded-md p-6">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </div>
      </section>
    </>
  );
}
