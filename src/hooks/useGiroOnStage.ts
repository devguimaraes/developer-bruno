import { useEffect, useState } from "react";
import { getGiroOnStage, subscribeGiroOnStage } from "@/lib/giroOnStage";

/**
 * Hook para componentes React consultarem reativamente se o Giro está ativo no palco da home.
 */
export function useGiroOnStage(): boolean {
  // Começa como no servidor (false): ler a store aqui quebrava a hidratação quando outra ilha já
  // tinha posto o Giro no palco. O effect logo abaixo sincroniza com o valor real.
  const [onStage, setOnStage] = useState(false);

  useEffect(() => {
    setOnStage(getGiroOnStage());
    return subscribeGiroOnStage(setOnStage);
  }, []);

  return onStage;
}
