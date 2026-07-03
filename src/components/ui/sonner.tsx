import { Toaster as Sonner } from "sonner";
import { BrandIcon } from "@/components/brand";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        error: <BrandIcon name="erro" size={20} />,
        success: <BrandIcon name="sucesso" size={20} />,
        warning: <BrandIcon name="alerta" size={20} />,
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
export { Toaster };
