import { SectionHeader } from "@/components/giro/SectionHeader";
import { ServiceArt, type ServiceArtName } from "@/components/services/ServiceArt";
import { useLocale } from "@/hooks/useLocale";
import { type TranslationKey, t } from "@/lib/i18n";
import { bareLabel } from "./copy";

interface Service {
  art: ServiceArtName;
  title: TranslationKey;
  body: TranslationKey;
  tags: TranslationKey;
}

// Os dois primeiros ocupam meia largura e os três seguintes um terço; o primeiro vai no azul.
const SERVICES: readonly Service[] = [
  {
    art: "sites-completos",
    title: "services.sites.title",
    body: "services.sites.body",
    tags: "services.sites.tags",
  },
  {
    art: "landing-pages",
    title: "services.landing.title",
    body: "services.landing.body",
    tags: "services.landing.tags",
  },
  {
    art: "product-ui",
    title: "services.product.title",
    body: "services.product.body",
    tags: "services.product.tags",
  },
  {
    art: "full-stack",
    title: "services.fullstack.title",
    body: "services.fullstack.body",
    tags: "services.fullstack.tags",
  },
  {
    art: "branding",
    title: "services.branding.title",
    body: "services.branding.body",
    tags: "services.branding.tags",
  },
];

// Intervalo da cascata: cada card termina de carregar um pouco depois do anterior.
const STAGGER_MS = 180;

export function HomeServices() {
  const locale = useLocale();

  return (
    <div className="home-services">
      <SectionHeader
        label={bareLabel(t(locale, "services.label"))}
        title={t(locale, "services.title")}
        lead={t(locale, "services.intro")}
      />
      <ul className="home-services__grid">
        {SERVICES.map((service, index) => (
          <li key={service.art} className={index === 0 ? "home-service g-azul" : "home-service"}>
            <div className="home-service__art">
              <ServiceArt name={service.art} delay={index * STAGGER_MS} />
            </div>
            <div className="home-service__body">
              <span className="home-service__n">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="home-service__title">{t(locale, service.title)}</h3>
              <p className="home-service__text">{t(locale, service.body)}</p>
              <ul className="home-service__tags">
                {t(locale, service.tags)
                  .split(" · ")
                  .map(tag => (
                    <li key={tag}>{tag}</li>
                  ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
