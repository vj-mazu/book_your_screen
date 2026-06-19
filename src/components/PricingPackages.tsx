import React from "react";
import { motion } from "framer-motion";
import { Tv, Heart, Cake, Check, Send } from "lucide-react";

interface RatePackage {
  icon: React.ReactNode;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  highlightClass?: string;
}

const packages: RatePackage[] = [
  {
    icon: <Tv size={28} />,
    name: "MOVIE SCREENING SPECIAL",
    price: "₹1,499",
    period: "per session (3 hours)",
    description: "Perfect for watching films, matches, or series with premium Dolby surround sound.",
    features: [
      "150-inch 4K Laser Screen",
      "Dolby Atmos Audio System",
      "Full OTT Platform Streaming",
      "Private Air-Conditioned Space",
      "Luxury Recliner Sofa Seating",
    ],
    popular: false,
  },
  {
    icon: <Heart size={28} />,
    name: "ANNIVERSARY CELEBRATION",
    price: "₹2,199",
    period: "per session (3 hours)",
    description: "Full private cinema and romantic surprise suite decorated with rose details, neon lights.",
    features: [
      "Custom Romantic Balloon Decor",
      "LED 'Happy Anniversary' Sign",
      "Fresh 1/2 Kg Chocolate Cake",
      "Complimentary Mocktails (2)",
      "Outside Food & Snacks Allowed",
    ],
    popular: false,
  },
  {
    icon: <Cake size={28} />,
    name: "GRAND BIRTHDAY CELEBRATION",
    price: "₹2,799",
    period: "per session (3 hours)",
    description: "Our absolute premium package equipped with grand stage setups, arch balloons, and snacks.",
    features: [
      "Grand Stage Balloon Backdrop",
      "Custom Neon Name Plate",
      "Premium 1 Kg Celebration Cake",
      "Welcome Drinks & Snacks (4 Pax)",
      "Cinematic Lighting Setup",
    ],
    popular: true,
    highlightClass: "border-[#d4af37] bg-gradient-to-b from-[#fffbf0] via-[#ffffff] to-[#fffbf0] shadow-[0_20px_50px_rgba(212,175,55,0.18)] ring-2 ring-[#d4af37]/45",
  },
];

export const PricingPackages: React.FC = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-bg relative overflow-hidden border-t border-stroke/40">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#d4af37]/[0.04] blur-[100px] sm:blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-accent font-sans text-xs uppercase tracking-[5px] font-bold">
              Business Rates
            </span>
            <div className="w-8 h-[1px] bg-accent" />
          </motion.div>
 
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl font-display text-text-primary italic mb-6 font-bold"
            >
              Pricing & <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Packages</span>
            </motion.h2>
          </div>
 
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-semibold px-4"
          >
            Transparent hourly packages with zero hidden fees. Outside food and beverages are always welcome.
          </motion.p>
        </div>
 
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto px-2">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className={`relative flex flex-col p-6 sm:p-8 md:p-10 transition-all duration-500 bg-surface rounded-3xl justify-between border ${
                pkg.highlightClass 
                  ? pkg.highlightClass 
                  : "border-stroke/60 shadow-md hover:shadow-lg hover:border-accent/40"
              }`}
            >
              {/* Premium Choice Tag */}
              {pkg.popular && (
                <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                  <span className="bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] text-white font-sans text-[9px] font-black uppercase tracking-[2.5px] px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                    👑 Gold Highlight
                  </span>
                </div>
              )}
 
              <div className="flex-grow">
                <div className={`mb-6 ${pkg.popular ? "text-[#aa7c11]" : "text-accent"}`}>
                  {pkg.icon}
                </div>
                
                <h3 className="text-text-primary font-sans text-xs font-black uppercase tracking-[3px] mb-5">
                  {pkg.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl sm:text-5xl font-display italic font-black ${
                    pkg.popular 
                      ? "bg-gradient-to-b from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent" 
                      : "text-text-primary"
                  }`}>
                    {pkg.price}
                  </span>
                </div>
                
                <span className="text-muted/60 font-sans text-[9px] uppercase tracking-[2px] mb-6 block font-bold">
                  {pkg.period}
                </span>
                
                <p className="text-muted leading-relaxed mb-6 font-medium text-xs sm:text-sm">
                  {pkg.description}
                </p>
 
                <ul className="flex flex-col gap-3.5 mb-8">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-text-primary font-sans text-xs sm:text-sm font-bold">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                        pkg.popular ? "bg-[#d4af37]/15 text-[#aa7c11]" : "bg-stroke/60 text-text-primary"
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
 
              {/* WhatsApp Booking Link */}
              <a
                href="https://wa.me/919019333970"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-center font-sans text-[10px] font-bold uppercase tracking-[2.5px] py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? "bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] text-white hover:opacity-90 hover:scale-[1.03] shadow-md border border-white/10"
                    : "bg-text-primary text-bg hover:bg-text-primary/95 hover:scale-[1.03] shadow-md"
                }`}
              >
                <span>Book on WhatsApp</span>
                <Send size={10} />
              </a>
 
            </motion.div>
          ))}
        </div>
 
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted/60 font-sans text-[9px] uppercase tracking-[2.5px] mt-16 max-w-lg mx-auto leading-relaxed font-bold px-4"
        >
          * Rates apply for regular bookings. Contact us directly to custom plan mega events, floral proposals or custom decorations.
        </motion.p>
      </div>
    </section>
  );
};

