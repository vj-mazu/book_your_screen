import React from "react";
import { motion } from "framer-motion";

interface ScreenCard {
  id: number;
  title: string;
  category: string;
  image: string;
  colSpan: string;
  aspect: string;
  description: string;
}

const screens: ScreenCard[] = [
  {
    id: 1,
    title: "The Dolby Cinema Screen",
    category: "Ultra HD private theatre with massive recliners",
    image: "/assets/asset-1.jpeg",
    colSpan: "md:col-span-7",
    aspect: "w-full aspect-[4/3] md:h-[400px]",
    description: "Massive 150-inch laser projection paired with immersive Dolby Atmos surround sound and comfortable luxury recliners.",
  },
  {
    id: 2,
    title: "Royal Celebration Suite",
    category: "Vibrant neon lighting and balloon decor",
    image: "/assets/asset-3.jpeg",
    colSpan: "md:col-span-5",
    aspect: "w-full aspect-[4/3] md:h-[400px]",
    description: "Equipped with specialized mood lights, neon tags, and pre-decorated balloon backdrops for birthday/anniversary parties.",
  },
  {
    id: 3,
    title: "Couple's Private Lounge",
    category: "Romantic candlelit setup & custom flowers",
    image: "/assets/asset-2.jpeg",
    colSpan: "md:col-span-5",
    aspect: "w-full aspect-[4/3] md:h-[400px]",
    description: "Intimate seating designed for two, featuring customized rose petal decor, gourmet pastries, and soft ambient lighting.",
  },
  {
    id: 4,
    title: "Celebration Party Screen",
    category: "Spacious room for large family celebrations",
    image: "/assets/asset-4.jpeg",
    colSpan: "md:col-span-7",
    aspect: "w-full aspect-[4/3] md:h-[400px]",
    description: "A wider viewing lounge perfect for gathering up to 10 friends, cutting cakes, and enjoying slideshows together.",
  },
];

export const BentoScreens: React.FC = () => {
  const handleScrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="screens" className="bg-bg py-24 md:py-32 border-t border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">
                Our Private Screens
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-4 leading-tight">
              Featured <span className="italic font-normal">theatres</span>
            </h2>
            <p className="text-sm md:text-base text-muted leading-relaxed">
              Choose from our luxury screens tailored to your occasions, boasting high-definition visual setups and powerful audio systems.
            </p>
          </div>

          {/* Book Link (Hidden on Mobile) */}
          <button
            onClick={handleScrollToBooking}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stroke text-sm font-semibold hover:border-accent hover:scale-105 transition-all group"
          >
            <span>Reserve A Screen</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {screens.map((screen, idx) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              onClick={handleScrollToBooking}
              className={`group relative overflow-hidden bg-surface border border-stroke/40 rounded-[2rem] cursor-pointer flex flex-col justify-end p-6 md:p-8 ${screen.colSpan} ${screen.aspect}`}
            >
              {/* Card Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={screen.image}
                  alt={screen.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Halftone Dot Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "6px 6px",
                  }}
                />

                {/* Light Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Glassmorphic Hover State */}
              <div className="absolute inset-0 bg-surface/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col justify-center items-center p-8 text-center">
                <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden mb-4">
                  <div className="absolute inset-0 accent-gradient animate-gradient-shift" />
                  <div className="relative bg-bg px-4 py-1.5 rounded-full text-xs font-semibold text-text-primary">
                    Book Screen — <span className="font-display italic">{screen.title}</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-text-primary/70 max-w-xs">
                  {screen.description}
                </p>
              </div>

              {/* Default Card Information */}
              <div className="relative z-10 text-white">
                <span className="text-[10px] md:text-xs tracking-[0.2em] font-semibold text-white/70 uppercase mb-2 inline-block">
                  {screen.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-display italic font-medium leading-none">
                  {screen.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
