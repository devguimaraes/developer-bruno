import type React from "react";
import { contactData } from "@/config/site";

const CompactCTA: React.FC = () => {
  return (
    <section className="py-16 bg-black border-y border-white/10">
      <div className="text-center px-6">
        <p className="type-mono text-sm text-white/60 mb-4">Gostou do que viu?</p>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-4xl md:text-6xl text-white hover:text-accent transition-colors"
        >
          VAMOS_CONVERSAR
        </a>
      </div>
    </section>
  );
};

export default CompactCTA;
