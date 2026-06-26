import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLocation } from "./LocationContext";

const occasions = ["Birthday Surprises", "Anniversary Specials", "Romantic Movie Dates", "Private Proposals"];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctasRef = useRef<HTMLDivElement | null>(null);

  const [occIndex, setOccIndex] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const { activeLocation, getLocationAssets } = useLocation();
  const { palaceImages, details } = getLocationAssets();

  // Preload carousel images for instant delivery
  useEffect(() => {
    palaceImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [palaceImages]);

  // Occasions and backgrounds cycling
  useEffect(() => {
    const occInterval = setInterval(() => {
      setOccIndex((prev) => (prev + 1) % occasions.length);
    }, 2800);

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % palaceImages.length);
    }, 4500);

    return () => {
      clearInterval(occInterval);
      clearInterval(bgInterval);
    };
  }, [palaceImages]);

  // Reset bg index when active location changes
  useEffect(() => {
    setBgIndex(0);
  }, [activeLocation]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1 }
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.3"
      );

      tl.fromTo(
        ".ctas-reveal",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-28 px-4 sm:px-6 md:px-12 bg-black"
    >

      {/* Full Screen Mysore Palace Carousel Background (Bright & Cleanly Visible) */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        {palaceImages.map((src, idx) => (
          <div
            key={src}
            className={`hero-slide ${idx === bgIndex ? "active" : ""}`}
          >
            <img
              src={src}
              alt={`Mysore Palace View ${idx + 1}`}
              className="w-full h-full object-cover saturate-[1.15] brightness-[0.88] contrast-[1.0]"
            />
          </div>
        ))}
        {/* Transparent overlay positioned to secure text legibility on the left, but leaves the right side extremely bright & clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/98 via-black/85 via-black/45 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-black/75 md:hidden block" /> {/* slightly darker overlay for small mobile screens for readability */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-start px-6 md:px-12 mt-10 md:mt-0">
        
        {/* Left Side: Dynamic typography directly on background with maximum contrast overlays */}
        <div className="w-full lg:max-w-2xl text-left flex flex-col items-start relative">
          
          {/* Big prominent logo subtitle matching Navbar style */}
          <div className="blur-in flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center p-[1.5px] shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <span className="font-display italic text-[11px] font-black text-black select-none">BY</span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black uppercase text-white tracking-[6px] font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              BOOK YOUR SCREEN
            </span>
          </div>

          {/* Eyebrow - Standout text styling to highlight Mysuru's Premier Private Theatre */}
          <span
            ref={eyebrowRef}
            className="blur-in text-[9px] md:text-[11px] font-black tracking-[0.25em] uppercase mb-5 inline-block bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white shadow-md px-4 py-2 rounded-full font-sans"
          >
            {activeLocation === "Hebbal" ? "Hebbal Abhishek Circle" : activeLocation === "Dr. Rajkumar Road" ? "Dr. Rajkumar Road" : "Kuvempunagar Branch"}
          </span>

          {/* Title */}
          <h1
            ref={titleRef}
            className="name-reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display italic tracking-tight text-white mb-6 font-bold leading-[1.25] md:leading-[1.2] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            data-cursor="text"
          >
            Create Memories on the{"  "}
            <span className="font-black not-italic text-white border-b-4 border-[#d4af37]">
              Big Screen
            </span>
          </h1>

          {/* Occasions Cycling */}
          <div className="blur-in text-base sm:text-lg md:text-2xl font-medium text-white/95 mb-6 h-8 flex items-center justify-start gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span>Perfect for</span>
            <span
              key={occIndex}
              className="font-display italic text-lg sm:text-xl md:text-3xl text-accent font-black animate-role-fade-in inline-block border-b border-[#d4af37]/35 text-gold-gradient"
            >
              {occasions[occIndex]}
            </span>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            className="blur-in text-xs sm:text-sm md:text-base text-white/90 max-w-xl mb-4 leading-relaxed font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          >
            Experience Mysuru's finest luxury theater for birthdays, anniversaries, romantic dates, and proposal setups. Enjoy full privacy, customized decorations, premium food/mocktails, and breathtaking Dolby surround sound.
          </p>

          <p className="text-[9px] md:text-[10px] font-bold text-[#ffd700] uppercase tracking-wider mb-8 bg-[#d4af37]/20 border border-[#d4af37]/45 px-3.5 py-2 rounded-xl backdrop-blur-sm">
            {details}
          </p>

          {/* CTA Buttons */}
          <div ref={ctasRef} className="ctas-reveal flex flex-wrap gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => handleScrollTo("services")}
              className="relative px-6 sm:px-8 py-3.5 rounded-full text-xs font-bold overflow-hidden group bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] text-white hover:opacity-95 hover:scale-105 transition-all shadow-md shadow-[#d4af37]/15 border border-white/10"
            >
              Explore Services
            </button>

            <button
              onClick={() => handleScrollTo("booking")}
              className="px-6 sm:px-8 py-3.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all shadow-sm backdrop-blur-sm"
            >
              Book Screen Now
            </button>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-10">
        <span className="text-[9px] text-white/40 tracking-[0.25em] font-bold">DISCOVER MORE</span>
        <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 right-0 h-3 bg-accent rounded-full animate-scroll-down" />
        </div>
      </div>
    </section>
  );
};
