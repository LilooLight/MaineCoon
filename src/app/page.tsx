"use client";

import { BookingProvider } from "@/components/cattery/booking-context";
import { Header } from "@/components/cattery/header";
import { Hero } from "@/components/cattery/hero";
import { About } from "@/components/cattery/about";
import { Producers } from "@/components/cattery/producers";
import { KittensCatalog } from "@/components/cattery/kittens-catalog";
import { Reviews } from "@/components/cattery/reviews";
import { Blog } from "@/components/cattery/blog";
import { FAQ } from "@/components/cattery/faq";
import { FinalCTA } from "@/components/cattery/final-cta";
import { Footer } from "@/components/cattery/footer";
import { BookingDialog } from "@/components/cattery/booking-dialog";

export default function Home() {
  return (
    <BookingProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Hero />
          <About />
          <Producers />
          <KittensCatalog />
          <Reviews />
          <Blog />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <BookingDialog />
      </div>
    </BookingProvider>
  );
}
