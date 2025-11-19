import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

const WITTY_MESSAGES = [
  "Reticulating Splines...",
  "Summoning the div centerer...",
  "Downloading more RAM...",
  "Compiling coffee...",
  "Overriding system safety...",
  "Bypassing mainframe...",
  "Optimizing dopamine receptors...",
  "Aligning pixels...",
  "Generating witty loading text...",
  "Establishing secure connection...",
];

const BOOT_LOGS = [
  "INITIALIZING_CORE_SYSTEMS...",
  "LOADING_MODULE_X99...",
  "VERIFYING_INTEGRITY...",
  "ACCESS_GRANTED_LEVEL_7...",
  "DECRYPTING_PAYLOAD...",
  "SYSTEM_OVERRIDE_ACTIVE...",
  "BYPASSING_FIREWALL...",
  "INJECTING_DEPENDENCIES...",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState(WITTY_MESSAGES[0]);

  useEffect(() => {
    const totalDuration = 3000; // 3 seconds total load
    const intervalTime = 30;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);

      setProgress(newProgress);

      // Randomly add logs
      if (Math.random() > 0.7) {
        setLogs((prev) => [
          ...prev.slice(-5), // Keep last 5
          `${BOOT_LOGS[Math.floor(Math.random() * BOOT_LOGS.length)]} [OK]`,
        ]);
      }

      // Change witty message occasionally
      if (currentStep % 25 === 0) {
        setCurrentMessage(
          WITTY_MESSAGES[Math.floor(Math.random() * WITTY_MESSAGES.length)]
        );
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 500); // Small delay before unmount
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
        transition: { duration: 0.5 },
      }}
    >
      {/* Background Glitch Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] filter contrast-150 brightness-100"></div>

      <div className="w-full max-w-md p-6 relative z-10 flex flex-col gap-8">
        {/* Terminal Window */}
        <div className="bg-card border-2 border-primary/50 shadow-brutal p-4 font-mono text-xs h-48 overflow-hidden relative rounded-sm">
          <div className="absolute top-0 left-0 right-0 bg-primary/10 p-1 flex justify-between items-center border-b border-primary/20">
            <span className="flex items-center gap-2 text-primary font-bold">
              <Terminal size={14} /> SYSTEM_BOOT
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-1 text-muted-foreground">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-primary">{">"}</span> {log}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-primary"
            />
          </div>
        </div>

        {/* Main Status */}
        <div className="text-center space-y-2">
          <motion.h2
            className="text-4xl font-black font-mono tracking-tighter uppercase text-primary"
            animate={{
              textShadow: [
                "2px 2px 0px rgba(0,0,0,0.2)",
                "-2px -2px 0px rgba(0,0,0,0.2)",
                "2px 2px 0px rgba(0,0,0,0.2)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.1,
              repeatType: "reverse",
            }}
          >
            {Math.round(progress)}%
          </motion.h2>
          <p className="text-lg font-bold text-foreground/80 min-h-[1.75rem]">
            {currentMessage}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-6 border-2 border-foreground bg-muted relative shadow-brutal-sm">
          <motion.div
            className="h-full bg-primary relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Striped pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:20px_20px] animate-[slide-right_1s_linear_infinite]"></div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
