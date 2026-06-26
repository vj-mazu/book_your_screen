import React from "react";
import { motion } from "framer-motion";
import { Tv, Volume2, Monitor, Wind, Play, ShieldAlert, Sparkles, Smile } from "lucide-react";

interface SpecItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}

const specs: SpecItem[] = [
  {
    icon: <Tv size={24} />,
    label: "Screen",
    value: "150 INCH",
    detail: "4K Ultra HD Cinematic Screen",
  },
  {
    icon: <Volume2 size={24} />,
    label: "Audio",
    value: "DOLBY ATMOS",
    detail: "Immersive Surround Sound System",
  },
  {
    icon: <Monitor size={24} />,
    label: "Visuals",
    value: "4K ULTRA HD",
    detail: "Crystal-clear HDR Picture",
  },
  {
    icon: <Wind size={24} />,
    label: "Comfort",
    value: "FULL AC",
    detail: "100% Private Air-Conditioned",
  },
  {
    icon: <Play size={24} />,
    label: "Content",
    value: "ALL OTT",
    detail: "Netflix, Prime, Hotstar & More",
  },
  {
    icon: <ShieldAlert size={24} />,
    label: "Privacy",
    value: "100% PRIVATE",
    detail: "Exclusive Venue for Your Group",
  },
  {
    icon: <Sparkles size={24} />,
    label: "Ambience",
    value: "AMBIENT LIGHT",
    detail: "Customizable Mood Lighting",
  },
  {
    icon: <Smile size={24} />,
    label: "Seating",
    value: "LUXURY RECLINERS",
    detail: "Premium Luxury Recliner Seating",
  },
];

import { useLocation, type LocationType } from "./LocationContext";

export const Specifications: React.FC = () => {
  const { activeLocation, setActiveLocation, getLocationAssets } = useLocation();
  const { details } = getLocationAssets();
  const locationsList: LocationType[] = ["Hebbal", "Dr. Rajkumar Road", "Kuvempunagar"];

  return (
    <section id="specifications" className="py-20 md:py-28 bg-bg relative overflow-hidden border-t border-stroke/40">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stroke to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stroke to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-24">
        
        {/* Section Title & Location Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-12 h-[1px] bg-accent" />
              <span className="text-accent font-sans text-[10px] uppercase tracking-[5px] font-bold">
                Theatre Specifications
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl font-display text-text-primary italic font-bold"
              >
                Premium <span className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent not-italic font-black">Specs</span>
              </motion.h2>
            </div>
          </div>

          {/* Location Switcher Tabs */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase text-muted tracking-[3px] block">
              Switch Branch View:
            </span>
            <div className="inline-flex flex-wrap gap-1.5 p-1 bg-white border border-stroke/60 rounded-2xl shadow-sm">
              {locationsList.map((loc) => {
                const isSelected = activeLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => setActiveLocation(loc)}
                    className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-xl px-4 py-2 transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white shadow-sm"
                        : "text-muted hover:text-text-primary hover:bg-stroke/40"
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Branch Info Bar */}
        <div className="mb-10 p-4.5 rounded-2xl bg-white border border-[#d4af37]/20 shadow-[0_4px_20px_rgba(212,175,55,0.03)] flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] animate-pulse" />
          <span className="text-xs text-text-primary font-bold tracking-wide">
            {details}
          </span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent max-w-6xl mx-auto px-2">
          {specs.map((spec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                borderColor: "rgba(212, 175, 55, 0.55)",
                boxShadow: "0 20px 45px rgba(212, 175, 55, 0.15)",
                backgroundColor: "#fffdf9"
              }}
              className="flex flex-col items-start gap-5 p-6 sm:p-8 bg-surface rounded-3xl border border-stroke transition-all duration-300 group relative overflow-hidden"
            >
              {/* Golden Ambient Corner Flare inside card */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-accent/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="text-accent/80 group-hover:text-accent transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                {spec.icon}
              </div>
              
              <div>
                <span className="text-muted font-sans text-[8px] sm:text-[9px] uppercase tracking-[3.5px] block mb-1.5 font-black">
                  {spec.label}
                </span>
                <p className="text-base sm:text-lg md:text-xl font-display italic text-text-primary tracking-wide uppercase leading-tight font-black group-hover:text-[#aa7c11] transition-colors duration-300">
                  {spec.value}
                </p>
                <span className="text-muted/75 font-sans text-[10px] block mt-1.5 leading-relaxed font-semibold">
                  {spec.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
