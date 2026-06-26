import type React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

interface LatestPostsProps {
  posts: BlogPost[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => {
  const locale = useLocale();

  if (posts.length === 0) return null;

  return (
    <section className="relative py-20 bg-black">
      <div className="px-6 md:px-12 mb-16">
        <h2 className="type-raster-section text-[10vw] md:text-[8vw] text-white">
          {t(locale, "blog.heading")}
        </h2>
        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
          <p className="type-mono text-white/40">{t(locale, "blog.subtitle")}</p>
          <a
            href="/blog"
            className="type-mono text-white/60 hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-1"
          >
            {t(locale, "blog.view_all")} <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-16 sm:gap-20 md:gap-24 w-full max-w-5xl xl:max-w-7xl mx-auto px-8 sm:px-16 md:px-24">
        {posts.map(post => (
          <motion.a
            key={post.slug}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group block"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 type-mono text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="type-raster-section text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-accent transition-colors tracking-tight">
                {post.title}
              </h3>
              <p className="text-white/50 text-sm max-w-xl leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="border border-white/20 text-white/60 px-3 py-1 rounded-full type-mono text-[11px] md:text-xs uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default LatestPosts;
