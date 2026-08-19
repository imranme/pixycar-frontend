import { cn } from "@/lib/utils";

type FieldErrorProps = {
  message?: string;
  className?: string;
};

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      className={cn("mt-1 font-navbar text-sm text-red-600", className)}
      role="alert"
    >
      {message}
    </p>
  );
}
