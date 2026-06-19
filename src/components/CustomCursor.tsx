import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 800);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleMouseClick);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hidden on touch/mobile devices to avoid clutter */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#d4af37] pointer-events-none z-[99999] hidden md:block"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          boxShadow: isHovered 
            ? "0 0 15px rgba(212, 175, 55, 0.6), inset 0 0 10px rgba(212, 175, 55, 0.3)" 
            : "0 0 5px rgba(212, 175, 55, 0.2)",
          backgroundColor: isHovered ? "rgba(212, 175, 55, 0.1)" : "transparent",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      {/* Inner tiny dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#d4af37] pointer-events-none z-[99999] translate-x-3 translate-y-3 hidden md:block"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
        }}
      />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-[#d4af37] pointer-events-none z-[99998] hidden md:block"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );
};
