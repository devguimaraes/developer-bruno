import React, { useEffect } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { ComputerIllustration } from "./ComputerIllustration";
import { MoveRight, Plus } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const Hero: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Parallax transforms for different layers
  // Background moves slightly opposite to mouse
  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

  // Text moves slightly with mouse (depth effect)
  const textX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10px", "10px"]);
  const textY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10px", "10px"]);

  // Illustration moves more (closer to camera)
  const illusX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const illusY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const illusRotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["5deg", "-5deg"]
  );
  const illusRotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-5deg", "5deg"]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -0.5 to 0.5
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-brutal-bg perspective-1000"
    >
      {/* Technical Grid Background - Parallax Layer 0 */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05]"></div>
      </motion.div>

      {/* HUD Elements */}
      <div className="absolute top-24 left-4 font-mono text-xs font-bold writing-vertical-rl text-gray-400 tracking-widest hidden md:block z-10">
        COORDENADAS: 24.55.12.X
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-xs font-bold text-gray-400 tracking-widest hidden md:block z-10">
        ROLE_PARA_DADOS [⇩]
      </div>

      {/* Decorative Corners */}
      <Plus className="absolute top-28 left-8 w-6 h-6 text-black stroke-[4] z-10" />
      <Plus className="absolute top-28 right-8 w-6 h-6 text-black stroke-[4] z-10" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        {/* Typography Content - Parallax Layer 1 */}
        <div className="text-left space-y-6 order-2 lg:order-1 relative">
          <div className="flex items-center gap-4">
            <div className="bg-brutal-yellow border-2 border-black px-3 py-1 font-bold font-mono text-sm shadow-[4px_4px_0px_0px_#000]">
              MODO_DEV: ATIVO
            </div>
            <div className="h-px bg-black flex-1"></div>
          </div>

          <div className="relative">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter">
              BRUNO
              <br />
              <span className="text-transparent bg-clip-text bg-black text-stroke-2">
                GUIMARÃES
              </span>
            </h1>
            {/* Floating Badge */}
            <motion.div
              animate={{ rotate: [10, 14, 10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-4 right-0 md:right-10 lg:-top-8 lg:right-20 bg-brutal-orange text-white font-bold px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20"
            >
              FRONT-END
            </motion.div>
          </div>

          <div className="border-l-4 border-black pl-6 space-y-4">
            <h2 className="text-xl md:text-3xl font-bold font-mono bg-black text-white inline-block px-2">
              &lt;Código + Design /&gt;
            </h2>
            <p className="text-lg md:text-xl text-stone-800 font-medium max-w-lg leading-relaxed">
              Construindo{" "}
              <span className="underline decoration-4 decoration-brutal-orange underline-offset-4">
                experiências digitais
              </span>{" "}
              que combinam design com engenharia front-end.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <NeoButton
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-black text-white hover:bg-gray-800 shadow-[8px_8px_0px_0px_#f97316]"
            >
              VER PROJETOS <MoveRight className="ml-2 inline" />
            </NeoButton>
            <NeoButton
              variant="outline"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white hover:bg-stone-100 shadow-[8px_8px_0px_0px_#000]"
            >
              FALE COMIGO
            </NeoButton>
          </div>
        </div>

        {/* Visual Content - Parallax Layer 2 (3D) */}
        <motion.div
          style={{
            x: illusX,
            y: illusY,
            rotateX: illusRotateX,
            rotateY: illusRotateY,
            z: 50,
          }}
          className="order-1 lg:order-2 flex justify-center items-center relative perspective-container"
        >
          {/* Background Graphic */}
          <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-brutal-purple/20 to-brutal-yellow/20 rounded-full filter blur-3xl -z-10 animate-pulse-slow"></div>
          <div className="transform-style-3d">
            <ComputerIllustration />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
