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
      setTimeout(onComplete, 1200); // Wait for split transition
    }, 2800); // elegant reveal duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  const titleLetters = "BOOK YOUR SCREEN".split("");

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none bg-[#0a0a0a] flex items-center justify-center">
      {/* Cinematic Film Grain */}
      <div className="film-grain opacity-[0.12]" />

      {/* Behind the doors: Full screen dark backing */}
      <div className="absolute inset-0 bg-[#070707] z-0" />

      {/* Split Curtains with Palace Image projected onto them */}
      <AnimatePresence>
        {!isDone ? (
          // BEFORE SPLIT: The text and full image are layered nicely together
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Mysore Palace Background fade-in behind the text BEFORE split */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1.01 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="absolute inset-0 z-0 pointer-events-none select-none"
            >
              <img
                src="/assets/mysore_palace.png"
                alt="Palace transition overlay"
                className="w-full h-full object-cover saturate-[1.1] brightness-[0.55]"
              />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>

            {/* Glowing Golden Logo Text */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-w-4xl text-center">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-x-2.5 text-4xl sm:text-6xl font-display font-black tracking-wider text-accent italic">
                  {titleLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                      className="inline-block drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)] bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="text-[9px] sm:text-xs text-white tracking-[0.45em] uppercase font-bold mt-2 text-gold-gradient"
                >
                  Private Theatre & Celebration Suites
                </motion.p>
              </div>
            </div>
          </div>
        ) : (
          // ON SPLIT: Two panels sliding left/right, each showing its half of the palace image
          <>
            {/* Left Split Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden z-20 border-r border-[#d4af37]/30 bg-black"
            >
              {/* Left half of the image */}
              <div className="absolute top-0 left-0 w-[200%] h-full">
                <img
                  src="/assets/mysore_palace.png"
                  alt="Palace Left Panel"
                  className="w-full h-full object-cover saturate-[1.1] brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
              
              {/* Left side text snippet to split beautifully */}
              <div className="absolute inset-0 flex items-center justify-end pr-1.5 sm:pr-2.5">
                <span className="text-4xl sm:text-6xl font-display font-black tracking-wider text-accent italic opacity-25 select-none bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent transform translate-x-1/2">
                  BOOK YOUR
                </span>
              </div>

              <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
            </motion.div>
            
            {/* Right Split Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden z-20 border-l border-[#d4af37]/30 bg-black"
            >
              {/* Right half of the image */}
              <div className="absolute top-0 right-0 w-[200%] h-full">
                <img
                  src="/assets/mysore_palace.png"
                  alt="Palace Right Panel"
                  className="w-full h-full object-cover saturate-[1.1] brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Right side text snippet to split beautifully */}
              <div className="absolute inset-0 flex items-center justify-start pl-1.5 sm:pl-2.5">
                <span className="text-4xl sm:text-6xl font-display font-black tracking-wider text-accent italic opacity-25 select-none bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#aa7c11] bg-clip-text text-transparent transform -translate-x-1/2">
                  SCREEN
                </span>
              </div>

              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};



