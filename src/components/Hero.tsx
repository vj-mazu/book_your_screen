import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const occasions = ["Birthday Surprises", "Anniversary Specials", "Romantic Movie Dates", "Private Proposals"];

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctasRef = useRef<HTMLDivElement | null>(null);

  const [occIndex, setOccIndex] = useState(0);

  // Occasions cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setOccIndex((prev) => (prev + 1) % occasions.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }
      );

      tl.fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(8px)", y: 15 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.9, stagger: 0.12 },
        "-=0.8"
      );

      tl.fromTo(
        ".ctas-reveal",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-28 px-6 md:px-12 bg-black"
    >
      {/* Full Screen Mysore Palace Night Image Background (Bright & Cleanly Visible) */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <img
          src="/assets/mysore_palace.png"
          alt="Illuminated Mysore Palace background"
          className="w-full h-full object-cover saturate-[1.15] brightness-[0.85] contrast-[1.02]"
        />
        {/* Minimalist transparent overlays to preserve Mysore Palace visibility while keeping text readable */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col lg:flex-row items-center justify-start">
        
        {/* Left Side: Premium Glassmorphic Card Typography & CTAs */}
        <div className="w-full lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass-card-gold p-6 sm:p-10 md:p-12 rounded-[2.5rem] text-left flex flex-col items-start w-full relative overflow-hidden"
          >
            {/* Soft inner gold light flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="blur-in text-[10px] md:text-xs font-black tracking-[0.35em] uppercase text-accent mb-5 inline-block bg-[#d4af37]/15 border border-[#d4af37]/35 px-4 py-2 rounded-full"
            >
              Mysuru's Premier Private Theatre
            </span>

            {/* Title */}
            <h1
              ref={titleRef}
              className="name-reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display italic leading-[1.1] tracking-tight text-white mb-6 font-bold"
            >
              Create Memories on the{" "}
              <span className="font-black not-italic bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] font-display italic">
                Big Screen
              </span>
            </h1>

            {/* Occasions Cycling */}
            <div className="blur-in text-base sm:text-lg md:text-2xl font-medium text-white/80 mb-8 h-10 flex items-center justify-start gap-2">
              <span>Perfect for</span>
              <span
                key={occIndex}
                className="font-display italic text-lg sm:text-xl md:text-3xl text-accent font-black animate-role-fade-in inline-block border-b border-[#d4af37]/30 text-gold-gradient"
              >
                {occasions[occIndex]}
              </span>
            </div>

            {/* Description */}
            <p
              ref={descRef}
              className="blur-in text-xs sm:text-sm md:text-base text-white/70 max-w-xl mb-10 leading-relaxed font-medium"
            >
              Experience Mysuru's finest luxury theater for birthdays, anniversaries, romantic dates, and proposal setups. Enjoy full privacy, customized decorations, premium food/mocktails, and breathtaking Dolby surround sound.
            </p>

            {/* CTA Buttons */}
            <div ref={ctasRef} className="ctas-reveal flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={() => handleScrollTo("services")}
                className="relative px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold overflow-hidden group bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] text-white hover:opacity-95 hover:scale-105 transition-all shadow-lg shadow-[#d4af37]/20 border border-white/10"
              >
                Explore Services
              </button>

              <button
                onClick={() => handleScrollTo("booking")}
                className="px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-transparent border border-[#d4af37] text-accent hover:bg-[#d4af37]/10 hover:scale-105 transition-all shadow-sm"
              >
                Book Screen Now
              </button>
            </div>
          </motion.div>
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
