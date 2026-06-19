import { useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Specifications } from "./components/Specifications";
import { Services } from "./components/Services";
import { PricingPackages } from "./components/PricingPackages";
import { ParallaxGallery } from "./components/ParallaxGallery";
import { Testimonials } from "./components/Testimonials";
import { BookingForm } from "./components/BookingForm";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-bg">
          {/* Film Grain overlay for premium film texture */}
          <div className="film-grain" />

          {/* Premium Custom Cursor Follower & Ripples */}
          <CustomCursor />

          {/* Floating Pill Navigation */}
          <Navbar />

          {/* Main Layout Sections */}
          <main>
            <Hero />
            <Specifications />
            <Services />
            <PricingPackages />
            <ParallaxGallery />
            <Testimonials />
            <BookingForm />
          </main>

          {/* Footer Info */}
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
