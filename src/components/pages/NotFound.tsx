import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import { BrandMascot } from "@/components/brand/BrandMascot";
import type { MascotState } from "@/components/brand/BrandMascot";

const NotFound = () => {
  const locale = useLocale();
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    setPathname(currentPath);
  }, []);

  const [hoverState, setHoverState] = useState<MascotState>("confused");

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />
      <div className="absolute inset-0 opacity-[0.08] grid-dots" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-28 sm:px-12 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4"
        >
          <div
            className="type-mono text-[10px] text-white/40 uppercase tracking-[0.24em]"
            title="Page not found — this route does not exist"
          >
            {t(locale, "notfound.error_code")}
          </div>
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-[0.24em]">
            {t(locale, "notfound.route_status")}
          </div>
        </motion.div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center py-16">
          <div className="grid w-full gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
                className="flex justify-center mb-6"
              >
                <BrandMascot variant="cor" size={64} state={hoverState} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="type-mono text-[10px] text-white/40 uppercase tracking-[0.24em]"
                title="Connection lost — the requested page could not be found"
              >
                {t(locale, "notfound.page_status")} &middot; {t(locale, "notfound.lost_signal")}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="type-raster-section text-[26vw] leading-[0.78] text-white sm:text-[18vw] lg:text-[12rem]"
              >
                404
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl space-y-6"
              >
                <h2 className="type-raster-section text-[2rem] leading-[0.9] text-white sm:text-[3rem]">
                  {t(locale, "notfound.heading_line1")}
                  <br />
                  {t(locale, "notfound.heading_line2")}
                </h2>

                <div className="max-w-xl border-t border-white/[0.08] pt-6">
                  <p className="text-sm leading-relaxed text-white/60 sm:text-base">
                    {t(locale, "notfound.description")}
                  </p>
                </div>

                {pathname && (
                  <div className="inline-flex border border-white/[0.08] px-4 py-2">
                    <span className="type-mono break-all text-[10px] text-white/40 uppercase tracking-[0.2em]">
                      {t(locale, "notfound.path_label")} {pathname}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6 border-t border-white/[0.08] pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            >
              <div
                className="type-mono text-[10px] text-white/35 uppercase tracking-[0.24em]"
                title="Navigation options to recover from this error"
              >
                {t(locale, "notfound.recovery_label")}
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="/"
                  className="group inline-flex items-center justify-between gap-4 bg-white px-5 py-4 text-black transition-colors hover:bg-accent pressable"
                  onMouseEnter={() => setHoverState("happy")}
                  onMouseLeave={() => setHoverState("confused")}
                >
                  <span className="type-mono text-[10px] uppercase tracking-[0.24em]">
                    {t(locale, "notfound.back_home")}
                  </span>
                  <ArrowLeft className="h-4 w-4" />
                </a>

                <a
                  href="/blog"
                  className="group inline-flex items-center justify-between gap-4 border border-white/[0.08] px-5 py-4 text-white transition-colors hover:border-accent/60 hover:text-accent pressable"
                >
                  <span className="type-mono text-[10px] uppercase tracking-[0.24em]">
                    {t(locale, "notfound.go_blog")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="border-t border-white/[0.08] pt-6">
                <p className="type-mono text-[10px] leading-6 text-white/30 uppercase tracking-[0.22em]">
                  {t(locale, "notfound.author")}
                  <br />
                  {t(locale, "notfound.author_role")}
                  <br />
                  {t(locale, "notfound.location")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-4"
        >
          <div
            className="type-mono text-[10px] text-white/30 uppercase tracking-[0.2em]"
            title="Geographic coordinates: Rio de Janeiro, Brazil"
          >
            {t(locale, "notfound.coords")}
          </div>
          <div
            className="type-mono text-[10px] text-white/20 uppercase tracking-[0.2em]"
            title="Current page version"
          >
            {t(locale, "notfound.version")}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
