import { useEffect, useState } from "react";
import { getGiroOnStage, subscribeGiroOnStage } from "@/lib/giroOnStage";

/**
 * Hook para componentes React consultarem reativamente se o Giro está ativo no palco da home.
 */
export function useGiroOnStage(): boolean {
  const [onStage, setOnStage] = useState(getGiroOnStage);

  useEffect(() => {
    setOnStage(getGiroOnStage());
    return subscribeGiroOnStage(setOnStage);
  }, []);

  return onStage;
}
