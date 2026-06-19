import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Track active section on scroll
      const sections = ["home", "services", "pricing", "gallery", "reviews"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className={`inline-flex items-center rounded-full border border-stroke/50 bg-white/80 backdrop-blur-md p-1.5 transition-all duration-300 pointer-events-auto ${
          isScrolled ? "shadow-lg shadow-black/5 scale-[0.98] border-stroke/80" : ""
        }`}
      >
        {/* 1. Logo */}
        <motion.div
          onClick={() => handleNavClick("home")}
          whileHover={{ scale: 1.05 }}
          className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden p-[2px] group"
        >
          {/* Logo ring accent gradient (reverses or spins on hover) */}
          <div className="absolute inset-0 accent-gradient animate-gradient-shift rounded-full transition-transform duration-700 group-hover:rotate-180" />
          <div className="absolute inset-[2px] bg-white rounded-full flex items-center justify-center">
            <span className="font-display italic text-xs font-bold text-accent-gradient select-none">
              BY
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-stroke/60 mx-2 hidden sm:block" />

        {/* 3. Nav Links */}
        <div className="flex items-center gap-1">
          {[
            { id: "home", label: "Home" },
            { id: "services", label: "Services" },
            { id: "pricing", label: "Pricing" },
            { id: "gallery", label: "Gallery" },
            { id: "reviews", label: "Reviews" },
          ].map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs md:text-sm font-medium rounded-full px-3.5 py-1.5 md:py-2 transition-all relative ${
                  isActive
                    ? "text-text-primary bg-stroke/60"
                    : "text-muted hover:text-text-primary hover:bg-stroke/30"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-stroke/60 mx-2" />

        {/* 5. "Book Screen" CTA Button with gradient hover ring */}
        <button
          onClick={() => handleNavClick("booking")}
          className="relative inline-flex items-center justify-center text-xs md:text-sm font-semibold rounded-full px-4 py-1.5 md:py-2 overflow-hidden group"
        >
          {/* Accent hover border behind button */}
          <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          <span className="absolute inset-[1.5px] bg-white rounded-full transition-all group-hover:inset-[2.5px]" />
          
          <span className="relative z-10 flex items-center gap-1 text-text-primary select-none group-hover:scale-95 transition-transform duration-300">
            Book Screen
            <span className="text-[10px] md:text-xs">↗</span>
          </span>
        </button>
      </motion.nav>
    </header>
  );
};
