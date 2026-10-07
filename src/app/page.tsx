"use client";

import { BookingProvider } from "@/components/cattery/booking-context";
import { CompareProvider } from "@/components/cattery/compare-context";
import { Header } from "@/components/cattery/header";
import { Hero } from "@/components/cattery/hero";
import { TrustMarquee } from "@/components/cattery/trust-marquee";
import { About } from "@/components/cattery/about";
import { Producers } from "@/components/cattery/producers";
import { ShowChampions } from "@/components/cattery/show-champions";
import { KittensCatalog } from "@/components/cattery/kittens-catalog";
import { PersonalityQuiz } from "@/components/cattery/personality-quiz";
import { BookingProcess } from "@/components/cattery/booking-process";
import { LitterTimeline } from "@/components/cattery/litter-timeline";
import { BreederIntro } from "@/components/cattery/breeder-intro";
import { ExpectedCountdown } from "@/components/cattery/expected-countdown";
import { Reviews } from "@/components/cattery/reviews";
import { Blog } from "@/components/cattery/blog";
import { FAQ } from "@/components/cattery/faq";
import { FinalCTA } from "@/components/cattery/final-cta";
import { Footer } from "@/components/cattery/footer";
import { BookingDialog } from "@/components/cattery/booking-dialog";
import { BackToTop } from "@/components/cattery/back-to-top";
import { CompareBar } from "@/components/cattery/compare-bar";

export default function Home() {
  return (
    <BookingProvider>
      <CompareProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <Hero />
            <TrustMarquee />
            <About />
            <Producers />
            <ShowChampions />
            <PersonalityQuiz />
            <KittensCatalog />
            <ExpectedCountdown />
            <LitterTimeline />
            <BookingProcess />
            <BreederIntro />
            <Reviews />
            <Blog />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
          <BookingDialog />
          <BackToTop />
          <CompareBar />
        </div>
      </CompareProvider>
    </BookingProvider>
  );
}
