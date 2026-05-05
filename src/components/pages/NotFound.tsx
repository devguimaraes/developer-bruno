import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const NotFound = () => {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "unknown";

    console.error("404 Error: User attempted to access non-existent route:", currentPath);
    setPathname(currentPath);
  }, []);

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
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div className="type-mono text-[10px] text-white/40 uppercase tracking-[0.24em]">
            {"// ERROR_404"}
          </div>
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-[0.24em]">
            Route not found
          </div>
        </motion.div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center py-16">
          <div className="grid w-full gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="type-mono text-[10px] text-white/40 uppercase tracking-[0.24em]"
              >
                {"// PAGE_STATUS"} &middot; LOST_SIGNAL
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
                  PAGE
                  <br />
                  NOT_FOUND
                </h2>

                <div className="max-w-xl border-t border-white/10 pt-6">
                  <p className="text-sm leading-relaxed text-white/60 sm:text-base">
                    A rota que você tentou abrir não existe ou foi movida. Você pode voltar para a
                    home, explorar os projetos selecionados ou seguir direto para o blog.
                  </p>
                </div>

                {pathname && (
                  <div className="inline-flex border border-white/10 px-4 py-2">
                    <span className="type-mono break-all text-[10px] text-white/40 uppercase tracking-[0.2em]">
                      PATH: {pathname}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
            >
              <div className="type-mono text-[10px] text-white/35 uppercase tracking-[0.24em]">
                {"// RECOVERY_OPTIONS"}
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="/"
                  className="group inline-flex items-center justify-between gap-4 bg-white px-5 py-4 text-black transition-colors hover:bg-[#f3c65a]"
                >
                  <span className="type-mono text-[10px] uppercase tracking-[0.24em]">
                    Voltar ao início
                  </span>
                  <ArrowLeft className="h-4 w-4" />
                </a>

                <a
                  href="/blog"
                  className="group inline-flex items-center justify-between gap-4 border border-white/15 px-5 py-4 text-white transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <span className="type-mono text-[10px] uppercase tracking-[0.24em]">
                    Ir para o blog
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="type-mono text-[10px] leading-6 text-white/30 uppercase tracking-[0.22em]">
                  Bruno Guimarães
                  <br />
                  Front-end systems
                  <br />
                  Rio de Janeiro, BR
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4"
        >
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">
            POS: 22.9068 S / 43.1729 W
          </div>
          <div className="type-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
            VER: 4.0.4_NOT_FOUND
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
