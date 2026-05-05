import type React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Calendar } from "lucide-react";
import type { Project } from "@/types";
import type { BlogPost } from "@/types/blog";

interface CaseStudyProps {
  project: Project;
  relatedPosts: BlogPost[];
}

const CaseStudy: React.FC<CaseStudyProps> = ({ project, relatedPosts }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-black text-white"
    >
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-20 sm:pt-24 md:pt-28 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/#projetos"
            className="inline-flex items-center gap-2 type-mono text-[10px] text-white/40 hover:text-accent transition-colors uppercase tracking-widest py-2"
          >
            <ArrowLeft className="w-3 h-3" />
            {"// BACK_TO_PROJECTS"}
          </a>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-12 pb-16 md:pb-24 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-wrap items-center gap-4 type-mono text-[10px] text-accent uppercase tracking-widest mb-6">
            <span>{project.category}</span>
            {project.role && (
              <>
                <span className="text-white/20">/</span>
                <span className="text-white/60">{project.role}</span>
              </>
            )}
          </div>

          <h1 className="type-raster-section text-[clamp(2.5rem,10vw,5rem)] md:text-6xl lg:text-7xl text-white leading-tight">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          )}
        </motion.div>
      </section>

      {/* Context Section */}
      {project.context && (
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/10 pt-8"
          >
            <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
              {"// CONTEXT"}
            </div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              <h2 className="type-raster-section text-2xl md:text-3xl text-white">O PROBLEMA</h2>
              <div>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  {project.context}
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Stack Section */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
            {"// STACK"}
          </div>
          <div className="grid md:grid-cols-[1fr_2fr] gap-8">
            <h2 className="type-raster-section text-2xl md:text-3xl text-white">TECNOLOGIAS</h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map(tech => (
                <span
                  key={tech}
                  className="border border-white/30 text-white px-4 py-2 rounded-full type-mono text-[10px] uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Section */}
      {project.impact && (
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/10 pt-8"
          >
            <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
              {"// IMPACT"}
            </div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              <h2 className="type-raster-section text-2xl md:text-3xl text-white">RESULTADOS</h2>
              <div>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  {project.impact}
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="border-t border-white/10 pt-8"
          >
            <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
              {"// RELATED_POSTS"}
            </div>
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              <h2 className="type-raster-section text-2xl md:text-3xl text-white">LEIA MAIS</h2>
              <div className="flex flex-col gap-6">
                {relatedPosts.map(post => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block border border-white/10 hover:border-accent/50 transition-colors p-5"
                  >
                    <div className="flex items-center gap-3 type-mono text-[9px] text-white/40 uppercase tracking-widest mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      {post.readTime && (
                        <>
                          <span className="text-white/20">/</span>
                          <span>{post.readTime}</span>
                        </>
                      )}
                    </div>
                    <h3 className="type-raster-section text-lg md:text-xl text-white group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 md:py-28 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="type-mono text-[10px] text-white/40 uppercase tracking-widest mb-6">
            {"// NEXT_STEPS"}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between gap-4 bg-white px-6 py-4 text-black hover:bg-[#f3c65a] transition-colors type-mono text-[10px] uppercase tracking-widest font-bold"
            >
              <span>Visitar site ao vivo</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="mailto:bc.guimaraes@outlook.com"
              className="inline-flex items-center justify-between gap-4 border border-white/15 px-6 py-4 text-white hover:border-accent/60 hover:text-accent transition-colors type-mono text-[10px] uppercase tracking-widest"
            >
              <span>Vamos trabalhar juntos</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default CaseStudy;
