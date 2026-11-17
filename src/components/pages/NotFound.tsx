import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import { ButtonLink } from "@/components/giro/Button";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const locale = useLocale();
  // O endereço só existe no navegador. Começa vazio, então o SSR e a primeira renderização
  // do cliente batem, e o endereço aparece depois da montagem.
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <section className="g-azul flex min-h-[80svh] flex-col px-4 pb-32 pt-16 sm:px-8 md:pb-16 md:pt-32 lg:px-16">
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center",
          "gap-12 text-center lg:flex-row lg:justify-between lg:gap-16 lg:text-left"
        )}
      >
        <div className="g-tinta flex h-60 w-60 shrink-0 items-center justify-center rounded-full">
          <Giro state="lost" size={176} />
        </div>

        <div className="flex max-w-xl flex-col items-center gap-6 lg:items-start">
          <p className="rotulo">{t(locale, "notfound.label")}</p>

          <h1 className="titulo-1">{t(locale, "notfound.title")}</h1>

          <p className="corpo-l">{t(locale, "notfound.text")}</p>

          {pathname && (
            <p className="codigo break-all">{t(locale, "notfound.address", { path: pathname })}</p>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2 lg:justify-start">
            <ButtonLink href="/" lead={<ArrowLeft className="g-icon" aria-hidden="true" />}>
              {t(locale, "notfound.home_button")}
            </ButtonLink>
            <ButtonLink href="/blog" variant="secondary" arrow>
              {t(locale, "notfound.blog_button")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
