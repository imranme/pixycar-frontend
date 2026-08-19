import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsItemVariant = "default" | "danger" | "logout";

type SettingsItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: SettingsItemVariant;
};

export function SettingsItem({ icon: Icon, label, href, onClick, variant = "default" }: SettingsItemProps) {
  const base = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 text-left font-navbar transition",
    variant === "default" && "border-[#E5E7EB] bg-white hover:bg-gray-50",
    variant === "danger" && "border-[#EF4444] bg-white text-[#EF4444] hover:bg-red-50",
    variant === "logout" && "border-[#EF4444] bg-red-50 text-[#EF4444] hover:bg-red-100"
  );

  const iconClass =
    variant === "default" ? "text-[#5E5E5E]" : "text-[#EF4444]";
  const labelClass = variant === "default" ? "text-[#1E1E1E]" : "text-[#EF4444]";
  const chevronClass = variant === "default" ? "text-[#5E5E5E]" : "text-[#EF4444]";

  const inner = (
    <>
      <Icon className={cn("size-5 shrink-0", iconClass)} strokeWidth={2} />
      <span className={cn("min-w-0 flex-1 text-base font-medium", labelClass)}>{label}</span>
      <ChevronRight className={cn("size-5 shrink-0", chevronClass)} strokeWidth={2} aria-hidden />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {inner}
    </button>
  );
}
