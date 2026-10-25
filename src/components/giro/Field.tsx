import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Notice } from "./Notice";

interface FieldFrameProps {
  /** Rótulo em mono, em cima do campo. Na busca ele fica só para leitor de tela. */
  label: string;
  hint?: string;
  /**
   * Mensagem de erro. Quando existe, o campo recebe aria-invalid e borda grossa, e a mensagem
   * vira o aviso ligado por aria-describedby. Quem decide quando validar é quem usa o campo.
   */
  error?: string;
}

function useControlIds(
  id: string | undefined,
  hint: string | undefined,
  error: string | undefined,
  describedBy: string | undefined
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedByIds = [describedBy, hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return {
    inputId,
    hintId,
    errorId,
    aria: {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedByIds || undefined,
    },
  };
}

interface FieldMessagesProps {
  hint?: string;
  hintId: string;
  error?: string;
  errorId: string;
}

function FieldMessages({ hint, hintId, error, errorId }: FieldMessagesProps) {
  return (
    <>
      {hint && (
        <p id={hintId} className="g-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <Notice id={errorId} variant="error" className="self-start">
          {error}
        </Notice>
      )}
    </>
  );
}

export type FieldProps = ComponentPropsWithoutRef<"input"> & FieldFrameProps;

/** Campo de linha única em pílula de 52 px. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, id, className, "aria-describedby": describedBy, ...inputProps },
  ref
) {
  const ids = useControlIds(id, hint, error, describedBy);
  return (
    <div className="g-field">
      <label className="g-field__label" htmlFor={ids.inputId}>
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        id={ids.inputId}
        className={cn("g-input", className)}
        {...ids.aria}
      />
      <FieldMessages hint={hint} hintId={ids.hintId} error={error} errorId={ids.errorId} />
    </div>
  );
});

export type TextAreaProps = ComponentPropsWithoutRef<"textarea"> & FieldFrameProps;

/** Área de texto com radius-md. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, id, className, "aria-describedby": describedBy, ...textareaProps },
  ref
) {
  const ids = useControlIds(id, hint, error, describedBy);
  return (
    <div className="g-field">
      <label className="g-field__label" htmlFor={ids.inputId}>
        {label}
      </label>
      <textarea
        {...textareaProps}
        ref={ref}
        id={ids.inputId}
        className={cn("g-input g-input--area", className)}
        {...ids.aria}
      />
      <FieldMessages hint={hint} hintId={ids.hintId} error={error} errorId={ids.errorId} />
    </div>
  );
});

export type SearchProps = ComponentPropsWithoutRef<"input"> & FieldFrameProps;

/** Busca com ícone Lucide de 20 px. O rótulo visível fica só para leitor de tela. */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { label, hint, error, id, className, "aria-describedby": describedBy, ...inputProps },
  ref
) {
  const ids = useControlIds(id, hint, error, describedBy);
  return (
    <div className="g-field">
      <div className="g-search">
        <label className="g-sr" htmlFor={ids.inputId}>
          {label}
        </label>
        <SearchIcon className="g-icon g-search__icon" aria-hidden="true" />
        <input
          {...inputProps}
          ref={ref}
          id={ids.inputId}
          type="search"
          className={cn("g-input", className)}
          {...ids.aria}
        />
      </div>
      <FieldMessages hint={hint} hintId={ids.hintId} error={error} errorId={ids.errorId} />
    </div>
  );
});
