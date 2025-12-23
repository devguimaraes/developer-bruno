import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, TrendingUp } from "lucide-react";

const UrgencyBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [downloadCount, setDownloadCount] = useState(47);

  useEffect(() => {
    // Get or set the countdown end time (resets at midnight each day)
    const getEndTime = (): Date => {
      const storageKey = "urgency_countdown_end";
      const storedEnd = localStorage.getItem(storageKey);
      const now = new Date();

      if (storedEnd) {
        const endDate = new Date(storedEnd);
        // Check if stored date is still valid (not in the past)
        if (endDate > now) {
          return endDate;
        }
      }

      // Calculate 72h from current midnight (resets daily)
      const todayMidnight = new Date(now);
      todayMidnight.setHours(0, 0, 0, 0);
      const endTime = new Date(todayMidnight.getTime() + 72 * 60 * 60 * 1000);

      localStorage.setItem(storageKey, endTime.toISOString());
      return endTime;
    };

    const endTime = getEndTime();

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          hours: totalHours,
          minutes,
          seconds,
        });
      } else {
        // Reset when expired (new day)
        localStorage.removeItem("urgency_countdown_end");
        setTimeLeft({ hours: 72, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate download count (in real app, fetch from backend)
  useEffect(() => {
    const storedCount = localStorage.getItem("download_count");
    if (storedCount) {
      setDownloadCount(parseInt(storedCount, 10));
    } else {
      // Random starting number between 45-65
      const baseCount = Math.floor(Math.random() * 20) + 45;
      localStorage.setItem("download_count", baseCount.toString());
      setDownloadCount(baseCount);
    }

    // Occasionally increment (simulates real activity)
    const incrementInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setDownloadCount((prev) => {
          const newCount = prev + 1;
          localStorage.setItem("download_count", newCount.toString());
          return newCount;
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(incrementInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-24 bg-black text-white py-4 px-4 border-b-4 border-brutal-yellow"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base">
        {/* Download Counter */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>
            <span className="font-bold text-brutal-yellow">
              {downloadCount}
            </span>{" "}
            pessoas já baixaram
          </span>
        </div>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-stone-400">ao vivo</span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-brutal-orange" />
          <span>Oferta expira em:</span>
          <div className="flex gap-1 font-mono font-bold">
            <span className="bg-brutal-orange px-2 py-1">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-brutal-orange px-2 py-1">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-brutal-orange px-2 py-1">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Fire Icon */}
        <Flame className="w-5 h-5 text-brutal-yellow animate-pulse hidden md:block" />
      </div>
    </motion.div>
  );
};

export default UrgencyBanner;
