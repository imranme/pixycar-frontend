import { HeroSection } from "@/components/layout/hero-section";
import { HowItWorks } from "@/components/(marketing)/how-it-works";
import { Features } from "@/components/(marketing)/features";
import { LiveListings } from "@/components/(marketing)/live-listings";
import { Testimonials } from "@/components/(marketing)/testimonials";
import { CTA } from "@/components/(marketing)/cta";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks id="how-it-works" />
      <Features id="features" />
      <LiveListings id="browse-cars" />
      <Testimonials id="testimonials" />
      <CTA />
    </>
  );
}
