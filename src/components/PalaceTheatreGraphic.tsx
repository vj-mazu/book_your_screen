import React from "react";
import { motion } from "framer-motion";

export const PalaceTheatreGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-[560px] aspect-[16/10] flex items-center justify-center p-2">
      {/* Dynamic Golden Ambient Light spill behind the screen */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <motion.div
          animate={{
            opacity: [0.15, 0.28, 0.2],
            scale: [0.98, 1.03, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-accent/15 via-[#f5e4a3]/20 to-transparent blur-3xl rounded-full"
        />
      </div>

      {/* Cinematic Theater Room Framing */}
      <div className="relative w-full h-full bg-[#111] rounded-2xl p-4 shadow-[0_30px_70px_rgba(0,0,0,0.18)] border border-[#d4af37]/20 flex flex-col justify-between overflow-hidden z-10">
        {/* Soft overhead spot lamp beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-gradient-to-b from-[#d4af37]/10 to-transparent blur-xl pointer-events-none" />

        {/* Screen Title / Speaker grille detail */}
        <div className="flex justify-between items-center text-[9px] tracking-[0.25em] text-[#d4af37]/40 uppercase font-bold border-b border-white/5 pb-2">
          <span>Dolby Atmos Lounge</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Live Projection
          </span>
        </div>

        {/* The Curved Projector Screen showing a real Private Theatre room */}
        <div className="relative flex-1 my-3 rounded-lg overflow-hidden border-2 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.25)] bg-black">
          {/* Real Private Theatre Image */}
          <img
            src="/assets/asset-1.jpeg"
            alt="Real Private Theatre projection"
            className="w-full h-full object-cover saturate-[1.1] brightness-[0.85] contrast-[1.05]"
          />
          {/* Cinema Screen Curved Overlay & Highlight reflections */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-black/60 pointer-events-none" />
          
          {/* Anamorphic lens flare stripe */}
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 mix-blend-screen" />
        </div>

        {/* Acoustic Paneling / Lower Stage Detail */}
        <div className="pt-2 flex justify-between items-end border-t border-white/5">
          <div className="flex gap-2">
            {/* Subtle visual representation of high-end floor speakers */}
            <div className="w-4 h-6 bg-white/5 rounded border border-white/10" />
            <div className="w-4 h-6 bg-white/5 rounded border border-white/10" />
          </div>
          
          {/* Glowing central console details */}
          <span className="text-[8px] text-white/30 tracking-widest uppercase font-mono">
            BYS // SCREEN-01
          </span>

          <div className="flex gap-2">
            <div className="w-4 h-6 bg-white/5 rounded border border-white/10" />
            <div className="w-4 h-6 bg-white/5 rounded border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

