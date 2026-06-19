import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, title: "Private Dolby Theater", image: "/assets/asset-1.jpeg" },
  { id: 2, title: "Romantic Balloon Setup", image: "/assets/asset-2.jpeg" },
  { id: 3, title: "Cozy Couple Lounge", image: "/assets/asset-3.jpeg" },
  { id: 4, title: "Birthday Party Room", image: "/assets/asset-4.jpeg" },
  { id: 5, title: "Cinema Sound setup", image: "/assets/asset-5.jpeg" },
  { id: 6, title: "Neon Birthday decor", image: "/assets/asset-6.jpeg" },
  { id: 7, title: "Candlelit Proposals", image: "/assets/asset-7.jpeg" },
  { id: 8, title: "Surprise Pastries", image: "/assets/asset-8.jpeg" },
  { id: 9, title: "Family Movie Lounge", image: "/assets/asset-9.jpeg" },
  { id: 10, title: "Royal Entry setup", image: "/assets/asset-10.jpeg" }
];

export const ParallaxGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Track scroll progress of the component height (400vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Map vertical scroll progress to horizontal translation (from 0% to -75%)
  const xTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  
  // Fade out text block slightly at the end of scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.35]);

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative h-[400vh] bg-bg"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stroke/40 to-transparent z-10" />

      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Horizontal Row Wrapper */}
        <motion.div
          style={{ x: xTranslate }}
          className="flex gap-6 md:gap-12 px-6 sm:px-12 md:px-24 items-center"
        >
          {/* Pinned Gallery Title Card */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="flex flex-col justify-center min-w-[280px] sm:min-w-[350px] md:min-w-[500px] pr-4 md:pr-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-accent" />
              <span className="text-accent font-sans text-[10px] uppercase tracking-[6px] font-bold">
                Gallery
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display text-text-primary leading-[0.85] uppercase italic font-bold">
              Cinematic <br />
              <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Moments</span>
            </h2>
            <p className="text-muted font-sans text-xs uppercase tracking-[3px] mt-6 max-w-xs hidden md:block font-bold">
              Scroll down to swipe through real moments captured at Book Your Screen
            </p>
          </motion.div>

          {/* Gallery Items */}
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="relative h-[400px] w-[280px] sm:h-[500px] sm:w-[350px] md:h-[650px] md:w-[480px] overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 shrink-0 group border border-stroke/60 shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-500 flex items-end p-6 md:p-8">
                <span className="text-white font-display italic text-xl md:text-2xl drop-shadow-md">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
};
