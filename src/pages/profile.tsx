import React from 'react';
import Navbar from '@/components/navbar';

export default function Profile() {
  return (
    <>
      <Navbar />
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Your Profile
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>
        <div className="grid gap-6">
          {/* Profile content will go here */}
          <div className="border border-border rounded-md p-6">
            <p className="font-heading text-lg mb-2">Account Information</p>
            <p className="text-muted-foreground">Please sign in to view your profile information.</p>
          </div>
        </div>
      </section>
    </>
  );
}
