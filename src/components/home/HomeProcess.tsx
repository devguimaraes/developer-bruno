import { ProcessDiagram } from "@/components/giro/ProcessDiagram";
import { SectionHeader } from "@/components/giro/SectionHeader";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { bareLabel } from "./copy";

export function HomeProcess() {
  const locale = useLocale();

  return (
    <div className="home-process">
      <SectionHeader
        label={bareLabel(t(locale, "process.label"))}
        title={t(locale, "process.title")}
        lead={t(locale, "process.intro")}
      />
      <ProcessDiagram />
    </div>
  );
}
