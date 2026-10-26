import { forwardRef } from "react";

/** Canvas do campo de spinners. Quem pinta é useHeroEngine; aqui só fica o elemento. */
export const SpinnerField = forwardRef<HTMLCanvasElement>(function SpinnerField(_props, ref) {
  return <canvas ref={ref} className="hr-field" />;
});
