import { SocialIcons } from "@dev-bruno/portfolio";

export function Default() {
  return (
    <div className="dark bg-black" style={{ padding: "3rem", minHeight: "200px" }}>
      {/* Force framer-motion initial animation state to visible for static preview */}
      <style>{`
        .social-preview-wrap * {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
      `}</style>
      <div className="social-preview-wrap">
        <SocialIcons />
      </div>
    </div>
  );
}
