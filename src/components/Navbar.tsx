import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "pricing", label: "Pricing" },
    { id: "gallery", label: "Gallery" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between md:justify-center items-center pt-4 px-6 md:px-4 md:pointer-events-none">
      
      {/* MOBILE HEADER BAR */}
      <div className="w-full flex md:hidden items-center justify-between bg-white/95 backdrop-blur-md px-4 py-3 rounded-full border border-stroke shadow-lg pointer-events-auto">
        <div onClick={() => handleNavClick("home")} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#aa7c11] flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="font-display italic text-[10px] font-black text-gold-gradient">BY</span>
            </div>
          </div>
          <span className="text-xs font-black tracking-widest text-text-primary">BYS</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick("booking")}
            className="text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] text-white px-3.5 py-2 rounded-full shadow-md"
          >
            Book Now
          </button>
          
          <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary p-1.5 focus:outline-none">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* DESKTOP FLOATING NAVBAR */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className={`hidden md:inline-flex items-center rounded-full border border-stroke/50 bg-white/80 backdrop-blur-md p-1.5 transition-all duration-300 pointer-events-auto ${
          isScrolled ? "shadow-lg shadow-black/5 scale-[0.98] border-stroke/80" : ""
        }`}
      >
        {/* Logo */}
        <motion.div
          onClick={() => handleNavClick("home")}
          whileHover={{ scale: 1.05 }}
          className="relative w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden p-[2px] group"
        >
          <div className="absolute inset-0 accent-gradient animate-gradient-shift rounded-full transition-transform duration-700 group-hover:rotate-180" />
          <div className="absolute inset-[2px] bg-white rounded-full flex items-center justify-center">
            <span className="font-display italic text-xs font-bold text-accent-gradient select-none">
              BY
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-stroke/60 mx-2" />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((item) => {
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

        {/* CTA Button */}
        <button
          onClick={() => handleNavClick("booking")}
          className="relative inline-flex items-center justify-center text-xs md:text-sm font-semibold rounded-full px-4 py-1.5 md:py-2 overflow-hidden group"
        >
          <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          <span className="absolute inset-[1.5px] bg-white rounded-full transition-all group-hover:inset-[2.5px]" />
          
          <span className="relative z-10 flex items-center gap-1 text-text-primary select-none group-hover:scale-95 transition-transform duration-300">
            Book Screen
            <span className="text-[10px] md:text-xs">↗</span>
          </span>
        </button>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-6 right-6 z-40 bg-white/98 backdrop-blur-lg border border-stroke rounded-3xl p-5 shadow-2xl flex flex-col gap-3 md:hidden pointer-events-auto"
          >
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all ${
                    isActive ? "text-[#aa7c11] bg-[#d4af37]/10" : "text-muted hover:text-text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="w-full h-[1px] bg-stroke/60 my-1" />
            <button
              onClick={() => handleNavClick("booking")}
              className="w-full text-center py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-[2px] bg-gradient-to-r from-[#d4af37] via-[#aa7c11] to-[#d4af37] shadow-md"
            >
              Book Screen Now ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
