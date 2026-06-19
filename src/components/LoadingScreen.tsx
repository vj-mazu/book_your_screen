import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 950); // wait for parting transition
    }, 2800); // Quick, elegant reveal duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  const titleLetters = "BOOK YOUR SCREEN".split("");

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none bg-[#0a0a0a] flex items-center justify-center">
      {/* Cinematic Film Grain */}
      <div className="film-grain opacity-[0.12]" />

      {/* Mysore Palace Background fade-in inside the loader before curtains part */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="absolute inset-0 z-0 select-none pointer-events-none"
      >
        <img
          src="/assets/mysore_palace.png"
          alt="Palace transition overlay"
          className="w-full h-full object-cover saturate-[1.1] brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Parting Curtains */}
      <AnimatePresence>
        {isDone && (
          <>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-black z-50 border-r border-[#d4af37]/20 flex justify-end items-center"
            >
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
            </motion.div>
            
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 bottom-0 right-0 w-1/2 bg-black z-50 border-l border-[#d4af37]/20 flex justify-start items-center"
            >
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-w-4xl text-center">
        
        {/* Simple & Elegant Gold Text Reveal */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-2.5 text-4xl sm:text-6xl font-display font-black tracking-wider text-accent italic">
            {titleLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                className="inline-block drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="text-[9px] sm:text-xs text-white tracking-[0.45em] uppercase font-bold mt-2"
          >
            Private Theatre & Celebration Suites
          </motion.p>
        </div>

      </div>
    </div>
  );
};



