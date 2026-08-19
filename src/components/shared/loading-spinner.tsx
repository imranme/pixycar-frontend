import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-neutral-200 border-t-[#FFA51F] size-6",
        className
      )}
      role="status"
      aria-label="loading"
    />
  );
}
