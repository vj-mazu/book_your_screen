import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, ArrowLeft, ArrowRight, X, Heart, Popcorn, Tv, Gamepad2, Shield } from "lucide-react";

interface Service {
  title: string;
  subtitle: string;
  longDescription: string;
  coverImage: string;
  galleryImages: string[];
  num: string;
  highlights: string[];
}

const servicesList: Service[] = [
  {
    title: "Private Screening",
    subtitle: "Your Cinema, Your Rules",
    longDescription: "Enjoy your favorite movies and shows on a massive 150-inch 4K Ultra HD screen with immersive Dolby Atmos surround sound. Compatible with all major OTT platforms — Netflix, Prime Video, Disney+ Hotstar, Zee5, SonyLiv, and YouTube. Catch all the sports action live in absolute privacy.",
    coverImage: "/assets/asset-1.jpeg",
    galleryImages: ["/assets/asset-1.jpeg", "/assets/asset-9.jpeg", "/assets/asset-14.jpeg"],
    num: "01",
    highlights: ["150-inch 4K Screen", "Dolby Atmos Sound", "All OTT Streaming", "Luxury Recliners"],
  },
  {
    title: "Birthdays & Anniversaries",
    subtitle: "Celebrate in Style",
    longDescription: "Make your special day unforgettable with customized balloon setups, cake-cutting platforms, and surprise reveals. Every package can be tailored with LED lighting setups, sashes, and specific decorations to match your celebratory theme.",
    coverImage: "/assets/asset-3.jpeg",
    galleryImages: ["/assets/asset-3.jpeg", "/assets/asset-8.jpeg", "/assets/asset-15.jpeg", "/assets/asset-18.jpeg"],
    num: "02",
    highlights: ["Balloon Decor Included", "Cake-Cutting Setup", "Surprise Reveal", "Mood Lighting"],
  },
  {
    title: "Private Parties",
    subtitle: "Intimate & Exclusive",
    longDescription: "The perfect private lounge venue for bride-to-be celebrations, kitty parties, reunions, and cozy gatherings. Set the volume, customize the lighting, put on your playlist, and dance the night away.",
    coverImage: "/assets/asset-2.jpeg",
    galleryImages: ["/assets/asset-2.jpeg", "/assets/asset-7.jpeg", "/assets/asset-11.jpeg", "/assets/asset-16.jpeg", "/assets/asset-19.jpeg"],
    num: "03",
    highlights: ["Bride-to-Be Setup", "Romantic Dome Lounge", "Dance Space", "Atmos Audio Link"],
  },
  {
    title: "Traditional Functions",
    subtitle: "Heritage Meets Luxury",
    longDescription: "Celebrate traditional naming ceremonies, small family poojas, and family gatherings in an exclusive, air-conditioned setting. We maintain a limited guest count to preserve the absolute privacy of the experience.",
    coverImage: "/assets/asset-5.jpeg",
    galleryImages: ["/assets/asset-5.jpeg", "/assets/asset-6.jpeg", "/assets/asset-13.jpeg"],
    num: "04",
    highlights: ["Intimate Gatherings", "Naming Ceremonies", "Full AC Comfort", "Traditional Setups"],
  },
];

const amenities = [
  { icon: <Popcorn size={22} />, label: "Outside Food Allowed", desc: "Bring your own food & beverages — no restrictions" },
  { icon: <Heart size={22} />, label: "Luxury Recliner Seating", desc: "Premium plush recliners for maximum comfort & relaxation" },
  { icon: <Tv size={22} />, label: "All OTT Platforms", desc: "Netflix, Prime, Hotstar, Zee5, SonyLiv & more" },
  { icon: <Gamepad2 size={22} />, label: "Live Matches", desc: "Watch IPL, World Cup & sports on a 150-inch screen" },
  { icon: <Cake size={22} />, label: "Birthday Special", desc: "Props, sashes, and surprise details for your day" },
  { icon: <Shield size={22} />, label: "Full AC Control", desc: "100% private air-conditioned space for your group" },
];

export const Services: React.FC = () => {
  const [activeGallery, setActiveGallery] = useState<Service | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleNextImg = () => {
    if (activeGallery) {
      setCurrentImgIndex((prev) => (prev + 1) % activeGallery.galleryImages.length);
    }
  };

  const handlePrevImg = () => {
    if (activeGallery) {
      setCurrentImgIndex((prev) => (prev - 1 + activeGallery.galleryImages.length) % activeGallery.galleryImages.length);
    }
  };

  return (
    <section id="services" className="py-20 md:py-40 px-6 sm:px-8 md:px-12 lg:px-24 bg-bg relative overflow-hidden border-t border-stroke/40">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "auto" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-6 overflow-hidden"
          >
            <div className="w-12 h-[1px] bg-accent" />
            <span className="text-accent font-sans text-[10px] uppercase tracking-[5px] whitespace-nowrap font-bold">
              Curated Experiences
            </span>
          </motion.div>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display text-text-primary italic font-bold"
            >
              Our <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Services</span>
            </motion.h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted text-sm max-w-lg mt-6 leading-relaxed font-medium"
          >
            From private movie screenings to grand birthday surprises — every experience is designed to be exclusively yours.
          </motion.p>
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-24 md:gap-40">
          {servicesList.map((service, idx) => {
            const isRight = idx % 2 !== 0;
            return (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center ${
                  isRight ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Service Image / Cover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
                  onClick={() => {
                    setActiveGallery(service);
                    setCurrentImgIndex(0);
                  }}
                  className={`aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl relative cursor-pointer group shadow-lg ${
                    isRight ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={service.coverImage}
                    alt={service.title}
                    className="w-full h-full object-cover object-center transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                  
                  {/* Huge Number behind */}
                  <span className="absolute -top-4 -left-2 text-[120px] sm:text-[180px] md:text-[220px] font-display italic text-white/5 font-bold leading-none select-none pointer-events-none">
                    {service.num}
                  </span>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-black shadow-md flex items-center gap-2">
                      View Gallery
                    </span>
                  </div>
                </motion.div>

                {/* Service Text Details */}
                <div className={`flex flex-col justify-center ${isRight ? "lg:order-1 lg:text-right lg:items-end" : ""}`}>
                  <span className="text-accent font-sans text-xs uppercase tracking-[5px] mb-4 block font-black bg-accent/10 px-4 py-2 rounded-md inline-block w-fit">
                    {service.subtitle}
                  </span>
                  
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-display text-text-primary italic mb-6 leading-tight font-black">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted leading-relaxed mb-8 max-w-lg font-medium text-sm md:text-base">
                    {service.longDescription}
                  </p>

                  <div className={`flex flex-wrap gap-3 mb-10 ${isRight ? "lg:justify-end" : ""}`}>
                    {service.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 rounded-xl bg-surface border border-stroke text-text-primary font-sans text-[10px] uppercase tracking-[2px] shadow-sm font-bold"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveGallery(service);
                      setCurrentImgIndex(0);
                    }}
                    className="px-8 py-4 bg-accent text-white font-sans text-xs uppercase tracking-[3px] font-black rounded-full hover:bg-accent/80 hover:scale-105 transition-all shadow-lg flex items-center gap-3 w-fit"
                  >
                    Open Gallery
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Amenities Grid */}
        <div className="mt-32 md:mt-48">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-accent" />
              <span className="text-accent font-sans text-[10px] uppercase tracking-[5px] font-bold">
                What's Included
              </span>
            </div>
            <h3 className="text-4xl md:text-6xl font-display text-text-primary italic font-bold">
              In-Theatre <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Amenities</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {amenities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="flex items-start gap-5 p-6 md:p-8 rounded-2xl bg-surface border border-stroke hover:shadow-lg transition-all duration-500 group"
              >
                <div className="text-accent group-hover:scale-110 transition-transform duration-500 shrink-0 mt-1">
                  {item.icon}
                </div>
                <div>
                  <span className="text-text-primary font-sans text-sm font-bold block mb-1">
                    {item.label}
                  </span>
                  <span className="text-muted/80 font-sans text-xs leading-relaxed font-medium">
                    {item.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Gallery Dialog */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setActiveGallery(null)}
          >
            <button
              onClick={() => setActiveGallery(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/40 hover:text-white z-50 p-2"
            >
              <X size={28} />
            </button>

            <h3 className="text-white font-display italic text-2xl md:text-4xl mb-6 font-bold">
              {activeGallery.title}
            </h3>

            {/* Slider */}
            <div
              className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIndex}
                  src={activeGallery.galleryImages[currentImgIndex]}
                  alt={`${activeGallery.title} ${currentImgIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Prev / Next buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImg();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2.5 backdrop-blur-sm transition-all"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImg();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2.5 backdrop-blur-sm transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Slide Index Indicators */}
            <div className="flex gap-2 mt-6">
              {activeGallery.galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImgIndex ? "bg-accent w-8" : "bg-white/20 w-1.5"
                  }`}
                />
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
