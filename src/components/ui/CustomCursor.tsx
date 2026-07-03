import type React from "react";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || window.matchMedia("(hover: none)").matches);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    setIsEnabled(true);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible, isEnabled]);

  if (!isEnabled || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000]"
      style={{ x: cursorX, y: cursorY }}
    >
      {/* Linha horizontal da cruz */}
      <motion.div
        className="absolute bg-white/70"
        style={{
          width: 10,
          height: 1,
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClicking ? 6 : isHovering ? 16 : 10,
          opacity: isHovering ? 0.9 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      />

      {/* Linha vertical da cruz */}
      <motion.div
        className="absolute bg-white/70"
        style={{
          width: 1,
          height: 10,
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          height: isClicking ? 6 : isHovering ? 16 : 10,
          opacity: isHovering ? 0.9 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      />

      {/* Ponto central — accent gold */}
      <motion.div
        className="absolute bg-accent"
        style={{
          width: 2,
          height: 2,
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </motion.div>
  );
};

export default CustomCursor;
