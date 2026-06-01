import type React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar } from "lucide-react";
import type { Project } from "@/types";
import type { BlogPost } from "@/types/blog";
import GlitchImage from "@/components/ui/GlitchImage";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { contactData } from "@/config/site";

interface CaseStudyProps {
  project: Project;
  relatedPosts: BlogPost[];
}

const CaseStudy: React.FC<CaseStudyProps> = ({ project, relatedPosts }) => {
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const heroBanner = project.bannerImage ?? project.image;

  const sectionMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10%" },
        transition: { duration: 0.5 },
      };

  return (
    <div className="w-full bg-black text-white">
      {/* ================================================================ */}
      {/*  HERO — Banner Full-Width com Overlays Técnicos                  */}
      {/* ================================================================ */}
      <section className="relative min-h-[85vh] flex flex-col overflow-hidden bg-[#050505]">
        {/* Camada de fundo: imagem + efeitos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 w-full h-full scale-110">
            <GlitchImage
              src={heroBanner}
              alt={project.title}
              active={true}
              className="w-full h-full object-cover grayscale-[0.3] opacity-90 contrast-125"
            />
          </div>

          {/* Vignette radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.8)_100%)]" />

          {/* Scanlines + Grid sobrepostos */}
          <div className="absolute inset-0 scanlines opacity-25" />
          <div className="absolute inset-0 grid-technical opacity-[0.06]" />
        </div>

        {/* Conteúdo centralizado sobre a imagem */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
          {/* Back button — canto superior esquerdo */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8">
            <motion.a
              href="/#projetos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 type-mono text-[10px] text-white/40 hover:text-accent transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" />
              {t(locale, "case.back")}
            </motion.a>
          </div>

          {/* Badge da categoria */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-accent text-black type-mono text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 mb-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
          >
            {project.category}
          </motion.span>

          {/* Título gigante com mix-blend-difference */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="type-raster-section text-[clamp(3rem,10vw,7rem)] md:text-7xl lg:text-8xl text-white leading-[0.85] mix-blend-difference drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] mb-4 max-w-[90vw]"
          >
            {project.title}
          </motion.h1>

          {/* Role — subtítulo técnico */}
          {project.role && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="type-mono text-xs text-white/50 uppercase tracking-[0.1em] mb-6"
            >
              {project.role}
            </motion.p>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center pb-6 gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-accent to-transparent"
          />
          <span className="type-mono text-[8px] text-white/25 uppercase tracking-[0.3em]">
            SCROLL
          </span>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  QUICK CTA — Botões de ação logo após o hero                     */}
      {/* ================================================================ */}
      <section className="relative z-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            {...sectionMotion}
            className="flex flex-col sm:flex-row gap-3 py-4 border-b border-white/10"
          >
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-accent transition-colors px-6 py-3.5 type-mono text-[10px] uppercase tracking-widest font-bold"
            >
              <span>{t(locale, "case.visit_live")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${contactData.email}`}
              className="inline-flex items-center justify-center gap-3 border border-white/10 text-white hover:border-accent/50 hover:text-accent transition-colors px-6 py-3.5 type-mono text-[10px] uppercase tracking-widest"
            >
              <span>{t(locale, "case.work_together")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  CONTEXT — Editorial: descrição + problema                       */}
      {/* ================================================================ */}
      <section className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
        <motion.div {...sectionMotion}>
          {/* Label mono */}
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
            {t(locale, "case.context")}
          </div>

          {/* Layout assimétrico: heading grande à esquerda, texto à direita */}
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-12">
            {/* Coluna esquerda: heading que sangra */}
            <div>
              <h2 className="type-raster-section text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9] border-l-2 border-accent pl-5 md:pl-8">
                {t(locale, "case.problem")}
              </h2>
            </div>

            {/* Coluna direita: texto editorial */}
            <div className="flex flex-col gap-6">
              {/* Descrição — lead-in itálico */}
              {project.description && (
                <p className="font-serif italic text-lg md:text-xl text-white/50 leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Context — o problema em si */}
              {project.context && (
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                  <p className="text-base md:text-lg text-white/80 leading-relaxed">
                    {project.context}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  STACK — Grid visual de tecnologias                              */}
      {/* ================================================================ */}
      <section className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
        <motion.div {...sectionMotion}>
          {/* Label mono */}
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
            {t(locale, "case.stack")}
          </div>

          {/* Layout: heading à esquerda, grid de cards à direita */}
          <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-12">
            <h2 className="type-raster-section text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9]">
              {t(locale, "case.technologies")}
            </h2>

            {/* Grid de cards de tecnologia */}
            <div className="grid grid-cols-2 gap-2">
              {project.tech.map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 p-5 md:p-6 flex flex-col gap-3"
                >
                  {/* Índice numerado */}
                  <span className="type-mono text-[9px] text-white/20 group-hover:text-accent/60 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Nome da tecnologia */}
                  <span className="type-mono text-xs md:text-sm text-white/80 group-hover:text-white transition-colors uppercase tracking-wider leading-tight">
                    {tech}
                  </span>

                  {/* Linha decorativa no hover */}
                  <div className="w-0 group-hover:w-full h-px bg-accent/30 transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================ */}
      {/*  IMPACT — Resultados mensuráveis (condicional)                   */}
      {/* ================================================================ */}
      {project.impact && (
        <section className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
          <motion.div {...sectionMotion}>
            <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
              {t(locale, "case.impact")}
            </div>

            <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-12">
              <h2 className="type-raster-section text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9] border-l-2 border-accent pl-5 md:pl-8">
                {t(locale, "case.results")}
              </h2>
              <div className="relative">
                <p className="text-base md:text-lg text-white/80 leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ================================================================ */}
      {/*  RELATED POSTS — Artigos do blog (condicional)                   */}
      {/* ================================================================ */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
          <motion.div {...sectionMotion}>
            <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-8">
              {t(locale, "case.related")}
            </div>

            <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 md:gap-12">
              <h2 className="type-raster-section text-4xl md:text-5xl lg:text-6xl text-white leading-[0.9]">
                {t(locale, "case.read_more")}
              </h2>

              <div className="flex flex-col gap-3">
                {relatedPosts.map(post => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block border border-white/10 hover:border-accent/30 transition-colors p-6"
                  >
                    <div className="flex items-center gap-3 type-mono text-[9px] text-white/30 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      {post.readTime && (
                        <>
                          <span className="text-white/10">/</span>
                          <span>{post.readTime}</span>
                        </>
                      )}
                    </div>
                    <h3 className="type-raster-section text-xl md:text-2xl text-white group-hover:text-accent transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-3 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ================================================================ */}
      {/*  FINAL CTA — Fechamento com email                                */}
      {/* ================================================================ */}
      <section className="container mx-auto px-6 py-16 md:py-24 max-w-5xl">
        <motion.div {...sectionMotion} className="text-center">
          <div className="type-mono text-[10px] text-white/30 uppercase tracking-widest mb-6">
            {t(locale, "case.next")}
          </div>

          <p className="type-mono text-sm text-white/40 mb-8">{t(locale, "cta.ready")}</p>

          <a
            href={`mailto:${contactData.email}`}
            className="inline-block type-raster-section text-[clamp(2.5rem,8vw,5rem)] text-white hover:text-accent transition-colors leading-none"
          >
            {t(locale, "cta.lets_talk")}
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default CaseStudy;
