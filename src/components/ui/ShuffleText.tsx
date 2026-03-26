import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { gsap } from "gsap";

interface ShuffleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  maxDelay?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  textAlign?: "left" | "center" | "right";
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: "evenodd" | "random";
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
}

const ShuffleText = ({
  text,
  className = "",
  style = {},
  duration = 0.8,
  delay = 0,
  maxDelay = 0,
  ease = "power2.out",
  threshold = 0.1,
  rootMargin = "-100px",
  tag: Tag = "span",
  textAlign = "center",
  onShuffleComplete,
  shuffleTimes = 2,
  animationMode = "random",
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
  colorFrom,
  colorTo,
  triggerOnce = true,
  triggerOnHover = true,
}: ShuffleTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const chars = useMemo(() => text.split(""), [text]);
  const charset = scrambleCharset;
  const getRandomChar = useCallback(() => charset[Math.floor(Math.random() * charset.length)], [charset]);

  const startAnimation = useCallback(() => {
    if (isAnimating || (triggerOnce && hasTriggered)) return;
    
    setIsAnimating(true);
    setHasTriggered(true);

    const elements = containerRef.current?.querySelectorAll(".shuffle-char");
    if (!elements) return;

    elements.forEach((el, i) => {
      const targetChar = chars[i];
      if (targetChar === " " || targetChar === "\n") {
        if (i === chars.length - 1) setIsAnimating(false);
        return;
      }

      const charDelay = delay + (animationMode === "random" ? Math.random() * maxDelay : i * stagger);

      const tl = gsap.timeline({
        delay: charDelay,
        onComplete: () => {
          if (i === chars.length - 1) {
            setIsAnimating(false);
            onShuffleComplete?.();
            if (loop) {
              gsap.delayedCall(loopDelay, startAnimation);
            }
          }
        }
      });

      // Shuffle Effect
      for (let s = 0; s < shuffleTimes; s++) {
        tl.to(el, {
          duration: duration / (shuffleTimes + 2),
          onStart: () => {
            el.textContent = getRandomChar();
            if (colorFrom) gsap.set(el, { color: colorFrom });
          }
        });
      }

      // Final Revelation
      tl.to(el, {
        duration: duration / 1.5,
        color: colorTo || "inherit",
        ease: ease,
        onStart: () => {
          el.textContent = targetChar;
        }
      });
    });
  }, [isAnimating, triggerOnce, hasTriggered, chars, delay, animationMode, maxDelay, stagger, duration, shuffleTimes, getRandomChar, colorFrom, onShuffleComplete, loop, loopDelay, colorTo, ease]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [text, hasTriggered, rootMargin, threshold, startAnimation]);

  return (
    // @ts-expect-error - Tag is dynamic and Ref type is complex
    <Tag
      ref={containerRef}
      className={className}
      style={{ ...style, textAlign }}
      onMouseEnter={() => triggerOnHover && !isAnimating && startAnimation()}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="shuffle-char inline-block whitespace-pre"
        >
          {char === " " ? "\u00A0" : char === "\n" ? <br /> : char}
        </span>
      ))}
    </Tag>
  );
};

export default ShuffleText;
